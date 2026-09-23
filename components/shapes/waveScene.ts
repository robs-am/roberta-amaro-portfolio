import { Color, DoubleSide, Mesh, OrthographicCamera, Scene, ShaderMaterial, WebGLRenderer } from "three";
import { getTheme } from "@/components/theme/theme";
import { fillFragment, fillVertex, shadowFragment, shadowVertex } from "@/components/shapes/waveShaders";
import { OVERSCAN, SEGMENTS, createStrip } from "@/components/shapes/waveGeometry";
import { CALM_ASPECT, DARK_OPACITIES, LAYERS, LAYER_COUNT, LIGHT_OPACITIES, MIN_FREQ_SCALE, PORTRAIT_ASPECT, edgeAt, type LayerSpec } from "@/components/shapes/waveLayers";

export { LAYER_COUNT, PORTRAIT_ASPECT };

// The scene behind the hero and behind the menu: soft layers of wave, stacked like cut paper. Each layer is a
// fill that runs from a wavy edge down past the bottom of the screen, and each casts a soft shadow onto the
// layer behind it, along its edge. The layers get darker toward the front (the bottom of the screen). Hero
// and menu build this same scene and both move the waves by the page's clock (performance.now), so when the
// menu opens over the home the waves do not jump.

const FLOOR = -2.5;
const SHADOW_WIDTH = 0.2;
const MAX_PIXEL_RATIO = 1.5;
// How far past the end of the text (in `u`) the layers take to reach full strength.
const SAFE_FEATHER = 0.45;
// How far a full warm or cool mood pulls the colours toward its tint (1 would replace the rose entirely).
const MAX_TINT = 0.4;
let layerOpacities = DARK_OPACITIES;

export function createWaveScene(canvas: HTMLCanvasElement) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, -1, 1);

  const layers = LAYERS.map((_, index) => {
    const fill = createStrip("edge");
    const fillMaterial = new ShaderMaterial({
      uniforms: {
        uEdge: { value: new Color() },
        uDeep: { value: new Color() },
        uRim: { value: new Color() },
        uOpacity: { value: layerOpacities[index] },
        uSafe: { value: 0.18 },
        uFadeFrom: { value: -0.75 },
        uFadeTo: { value: 0.15 },
        uPortrait: { value: 0 },
      },
      vertexShader: fillVertex,
      fragmentShader: fillFragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      side: DoubleSide,
    });
    const fillMesh = new Mesh(fill.geometry, fillMaterial);
    // Drawn back to front: the shadow of a layer goes over the layers behind it and under the layer itself.
    fillMesh.renderOrder = index * 2 + 1;
    fillMesh.frustumCulled = false;

    const shadow = createStrip("alpha");
    const shadowMaterial = new ShaderMaterial({
      uniforms: {
        uColor: { value: new Color() },
        uStrength: { value: 0.3 },
        uFade: { value: 1 },
        uSafe: { value: 0.18 },
        uFadeFrom: { value: -0.75 },
        uFadeTo: { value: 0.15 },
        uPortrait: { value: 0 },
      },
      vertexShader: shadowVertex,
      fragmentShader: shadowFragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      side: DoubleSide,
    });
    const shadowMesh = new Mesh(shadow.geometry, shadowMaterial);
    shadowMesh.renderOrder = index * 2;
    shadowMesh.frustumCulled = false;

    scene.add(shadowMesh, fillMesh);
    return { fill, fillMesh, fillMaterial, shadow, shadowMesh, shadowMaterial };
  });

  let aspect = 1;
  // See `CALM_ASPECT`/`MIN_FREQ_SCALE`: 1 on landscape screens, lower (wider humps) on narrow portrait ones.
  let freqScale = 1;
  // Where the waves start, in screen height units (-1 bottom, 1 top). The home sets it from the name's position.
  let horizon = 0;

  const setHorizon = (y: number) => {
    horizon = y;
  };

  // Where the text on the left ends, as `u` (-1 the left edge of the screen, 1 the right). The layers are
  // faint (`uSafe`) up to there and grow to full strength over the next stretch, so the waves stay out of the
  // way of the text however wide it is.
  const setSafeZone = (textRightU: number) => {
    for (const { fillMaterial, shadowMaterial } of layers) {
      for (const material of [fillMaterial, shadowMaterial]) {
        material.uniforms.uFadeFrom.value = textRightU;
        material.uniforms.uFadeTo.value = textRightU + SAFE_FEATHER;
      }
    }
  };

  // The palette as the theme gives it, kept so that a change of warmth can repaint without reading the CSS
  // again (warmth eases over a few seconds, one repaint per frame).
  let palette: { dark: boolean; back: Color; front: Color; deepen: Color } | null = null;
  let warmth = 0;

  // Reads the theme's colours, then paints.
  const applyColors = () => {
    const styles = getComputedStyle(document.documentElement);
    const token = (name: string) => new Color(styles.getPropertyValue(name).trim());
    const dark = getTheme() === "dark";
    // Light page: pale rose at the back to a deeper rose in front, never dark enough to hurt the text over it.
    // Dark page: a soft pink at the back to a wine in front, kept light enough that the bottom corners do not
    // sink into the page. Each layer is a clear step from the last.
    // The dark page's colours are brighter than before to make up for the lower opacity: less of the layer
    // shows, so what shows has to glow more.
    const back = dark ? token("--accent").lerp(new Color(0xffffff), 0.1) : new Color(0xc79aad);
    const front = dark ? new Color(0xb85a80) : new Color(0x8c566f);
    const deepen = dark ? new Color(0x2a1621) : token("--accent");
    palette = { dark, back, front, deepen };
    paint();
  };

  const paint = () => {
    if (!palette) return;
    const { dark, deepen } = palette;
    // Warmth leans the rose toward coral (warm) or toward a dusty violet (cool), only part of the way: it stays
    // recognisably her rose, just pushed, and the dark page's tints are kept light for the same reason as above.
    const lean = new Color(warmth >= 0 ? (dark ? 0xe8825f : 0xd98a68) : dark ? 0x8a78d6 : 0x7f7fb8);
    const tint = Math.abs(warmth) * MAX_TINT;
    const back = palette.back.clone().lerp(lean, tint);
    const front = palette.front.clone().lerp(lean, tint);
    // How much of the layers shows on the left, where the text is: the dark page needs more of it, or its
    // lower left corner is left empty and black. Lower than before on purpose — the right side (untouched,
    // outside the fade zone) stays exactly as vivid; only the text side is pulled back further toward the
    // page, so the waves recede where they'd otherwise compete with the words.
    const safe = dark ? 0.25 : 0.5;
    layerOpacities = dark ? DARK_OPACITIES : LIGHT_OPACITIES;
    layers.forEach(({ fillMaterial, shadowMaterial }, index) => {
      const edge = back.clone().lerp(front, index / (LAYER_COUNT - 1));
      fillMaterial.uniforms.uSafe.value = shadowMaterial.uniforms.uSafe.value = safe;
      fillMaterial.uniforms.uEdge.value.copy(edge);
      fillMaterial.uniforms.uDeep.value.copy(edge).lerp(deepen, dark ? 0.3 : 0.38);
      // The lit edge: the layer's own colour pushed toward a soft pink-white.
      fillMaterial.uniforms.uRim.value.copy(edge).lerp(new Color(dark ? 0xf7b8cb : 0xffffff), dark ? 0.55 : 0.5);
      shadowMaterial.uniforms.uColor.value.set(dark ? 0x14080f : 0x9a4a72);
      // A layer's shadow falls on the one behind it, so a faint layer casts a faint shadow: it follows the
      // opacity, keeping a floor so the edge of the faintest one is still drawn.
      const solidity = layerOpacities[index] / layerOpacities[LAYER_COUNT - 1];
      shadowMaterial.uniforms.uStrength.value = (dark ? 0.5 : 0.28) * (0.35 + 0.65 * solidity);
    });
  };

  // `value` is the mood's warmth (-1 cool to 1 warm); repaints only when it has actually moved.
  const setWarmth = (value: number) => {
    if (Math.abs(value - warmth) < 0.002) return;
    warmth = value;
    paint();
  };

  const resize = (width: number, height: number) => {
    aspect = width / height;
    renderer.setSize(width, height, false);
    camera.left = -aspect;
    camera.right = aspect;
    camera.updateProjectionMatrix();
    freqScale = aspect < CALM_ASPECT ? Math.max(aspect, MIN_FREQ_SCALE) : 1;
    const portrait = aspect < PORTRAIT_ASPECT ? 1 : 0;
    for (const layer of layers) {
      layer.fillMesh.scale.x = aspect;
      layer.shadowMesh.scale.x = aspect;
      layer.fillMaterial.uniforms.uPortrait.value = portrait;
      layer.shadowMaterial.uniforms.uPortrait.value = portrait;
    }
  };

  /**
   * Draws one frame. `seconds` moves the waves (pass 0 for a still frame), `pointerX/Y` is the eased pointer
   * offset (-1..1), `fades` is how visible each layer is (0..1), for the entrance, and `specs` is the shape of
   * each layer for the current mood (see `moodToLayers`); left out, the layers as hand-tuned.
   */
  const draw = (
    seconds: number,
    pointerX: number,
    pointerY: number,
    fades: readonly number[],
    specs: readonly LayerSpec[] = LAYERS,
  ) => {
    layers.forEach(({ fill, fillMesh, fillMaterial, shadow, shadowMesh, shadowMaterial }, index) => {
      const spec = specs[index] ?? LAYERS[index];
      for (let column = 0; column < fill.columns; column++) {
        const u = -OVERSCAN + (2 * OVERSCAN * column) / SEGMENTS;
        const edge = edgeAt(spec, u, seconds, horizon, pointerX * 0.5 * (index % 2 ? -1 : 1), freqScale);
        fill.positions[column * 6 + 1] = edge;
        fill.positions[column * 6 + 4] = FLOOR;
        fill.edges[column * 2] = fill.edges[column * 2 + 1] = edge;
        shadow.positions[column * 6 + 1] = edge + SHADOW_WIDTH;
        shadow.positions[column * 6 + 4] = edge;
      }
      fill.geometry.attributes.position.needsUpdate = true;
      fill.geometry.attributes.aEdge.needsUpdate = true;
      shadow.geometry.attributes.position.needsUpdate = true;

      const fade = fades[index] ?? 1;
      fillMesh.visible = shadowMesh.visible = fade > 0.001;
      fillMaterial.uniforms.uOpacity.value = layerOpacities[index] * fade;
      // The shadow fades with its layer.
      shadowMaterial.uniforms.uFade.value = fade;
      const dx = -pointerX * spec.parallax * aspect;
      const dy = pointerY * spec.parallax * 0.5;
      fillMesh.position.set(dx, dy, 0);
      shadowMesh.position.set(dx, dy, 0);
    });
    renderer.render(scene, camera);
  };

  const dispose = () => {
    for (const { fill, fillMaterial, shadow, shadowMaterial } of layers) {
      fill.geometry.dispose();
      fillMaterial.dispose();
      shadow.geometry.dispose();
      shadowMaterial.dispose();
    }
    renderer.dispose();
  };

  return { applyColors, setWarmth, resize, setHorizon, setSafeZone, draw, dispose };
}
