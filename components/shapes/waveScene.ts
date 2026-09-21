import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Mesh,
  OrthographicCamera,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";
import { getTheme } from "@/components/theme/theme";

// The scene behind the hero and behind the menu: soft layers of wave, stacked like cut paper. Each layer is a
// fill that runs from a wavy edge down past the bottom of the screen, and each casts a soft shadow onto the
// layer behind it, along its edge. The layers get darker toward the front (the bottom of the screen). Hero
// and menu build this same scene and both move the waves by the page's clock (performance.now), so when the
// menu opens over the home the waves do not jump.

export const LAYER_COUNT = 4;

// Coordinates: y runs -1..1 over the screen height, x runs -aspect..aspect. `u` is x as a share of the
// screen half-width, so the waves have the same number of humps on every screen shape.
const SEGMENTS = 120;
const OVERSCAN = 1.3;
const FLOOR = -2.5;
const SHADOW_WIDTH = 0.2;
const MAX_PIXEL_RATIO = 1.5;
// Below this width-to-height ratio the screen is portrait (a phone): the text fills the width there, so the
// waves stay faint everywhere instead of only behind the text column.
const PORTRAIT_ASPECT = 0.85;
// How far past the end of the text (in `u`) the layers take to reach full strength.
const SAFE_FEATHER = 0.45;
// How opaque each layer is, back to front. The layers behind are the ones that pass behind the text, so they
// are faint, and the opacity rises step by step toward the front layer, which stays solid and reads as the
// nearest. The shadows follow it (see `applyColors`).
const LAYER_OPACITIES = [0.08, 0.17, 0.32, 0.52];

// Each edge is three sines added up: a main wave, a finer ripple on it, and a long slow swell that carries the
// whole hump along, so the shape does not repeat. Their speeds differ (and run in opposite directions), so it
// never reads as one sine sliding sideways.
type Triple = [number, number, number];

type LayerSpec = {
  base: number;
  amplitude: Triple;
  frequency: Triple;
  phase: Triple;
  // Radians per second: a full turn of the main wave takes about 20 seconds.
  speed: Triple;
  // How lopsided the main wave is: 0 is a plain sine, and the more it leans (either way) the steeper one
  // side of each hump gets, and the narrower the crest against the valley.
  skew: number;
  // How far the layer follows the pointer; nearer layers move more.
  parallax: number;
};

// `base` is measured from the horizon (see `setHorizon`): about the height of the crests of the first layer is
// up to it, and every layer below it is a step further down. The name on the home rests just above the
// horizon. The waves are tall enough that a front layer rises above the valleys of the one behind it, so
// the layers interlock instead of sitting in neat bands.
const LAYERS: LayerSpec[] = [
  { base: -0.25, amplitude: [0.15, 0.05, 0.08], frequency: [2.4, 5.6, 1.4], phase: [0.4, 1.9, 0.8], speed: [0.28, -0.2, 0.12], skew: 0.75, parallax: 0.02 },
  { base: -0.45, amplitude: [0.17, 0.05, 0.08], frequency: [3.1, 6.6, 1.7], phase: [2.2, 0.5, 3.0], speed: [-0.25, 0.18, -0.1], skew: -0.7, parallax: 0.04 },
  { base: -0.65, amplitude: [0.18, 0.05, 0.07], frequency: [2.7, 5.9, 1.2], phase: [4.1, 2.7, 5.2], speed: [0.22, -0.16, 0.09], skew: 0.8, parallax: 0.06 },
  { base: -0.85, amplitude: [0.15, 0.05, 0.06], frequency: [3.5, 7.4, 1.6], phase: [1.0, 3.6, 2.1], speed: [-0.2, 0.15, -0.08], skew: -0.6, parallax: 0.08 },
];

// `lean` shifts the main wave with the pointer (in opposite directions on alternate layers), so the waves
// lean toward the cursor like liquid rather than only sliding as a block.
const edgeAt = (spec: LayerSpec, u: number, seconds: number, horizon: number, lean: number) => {
  let y = horizon + spec.base;
  for (let i = 0; i < 3; i++) {
    const angle = spec.frequency[i] * u + spec.phase[i] + spec.speed[i] * seconds + (i === 0 ? lean : 0);
    // Bending the angle by its own sine skews the wave: sin(a + k sin a) is steeper on one side than the other.
    y += spec.amplitude[i] * Math.sin(i === 0 ? angle + spec.skew * Math.sin(angle) : angle);
  }
  return y;
};

// `aEdge` is the height of the layer's edge at this column, so `vDepth` is how far below the edge a point is.
const fillVertex = /* glsl */ `
  attribute float aEdge;
  varying float vDepth;
  varying float vU;
  void main() {
    vDepth = aEdge - position.y;
    vU = position.x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Lighter at the edge, deeper below it, measured from the wave's own edge so the shading follows the curve.
// A thin band of light runs along the edge itself, like the edge of a sheet of paper catching the light.
// On a landscape screen the left side, where the text is, is mostly clear (`uSafe`); on a portrait one every
// part is equally faint.
const fillFragment = /* glsl */ `
  uniform vec3 uEdge;
  uniform vec3 uDeep;
  uniform vec3 uRim;
  uniform float uOpacity;
  uniform float uSafe;
  uniform float uFadeFrom;
  uniform float uFadeTo;
  uniform float uPortrait;
  varying float vDepth;
  varying float vU;
  void main() {
    vec3 color = mix(uEdge, uDeep, smoothstep(0.0, 0.7, vDepth));
    color = mix(color, uRim, (1.0 - smoothstep(0.0, 0.05, vDepth)) * 0.65);
    float side = mix(uSafe, 1.0, smoothstep(uFadeFrom, uFadeTo, vU));
    gl_FragColor = vec4(color, uOpacity * mix(side, 0.5, uPortrait));
    #include <colorspace_fragment>
  }
`;

const shadowVertex = /* glsl */ `
  attribute float aAlpha;
  varying float vAlpha;
  varying float vU;
  void main() {
    vAlpha = aAlpha;
    vU = position.x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const shadowFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  uniform float uFade;
  uniform float uSafe;
  uniform float uFadeFrom;
  uniform float uFadeTo;
  uniform float uPortrait;
  varying float vAlpha;
  varying float vU;
  void main() {
    float side = mix(uSafe, 1.0, smoothstep(uFadeFrom, uFadeTo, vU));
    gl_FragColor = vec4(uColor, pow(vAlpha, 1.6) * uStrength * uFade * mix(side, 0.5, uPortrait));
    #include <colorspace_fragment>
  }
`;

// A strip of quads along the wave, two vertices per step (the upper one, then the lower). The shadow's strip
// also carries an alpha, the fill's the height of its edge.
function createStrip(extra: "alpha" | "edge") {
  const columns = SEGMENTS + 1;
  const geometry = new BufferGeometry();
  const positions = new Float32Array(columns * 2 * 3);
  for (let column = 0; column < columns; column++) {
    const u = -OVERSCAN + (2 * OVERSCAN * column) / SEGMENTS;
    positions[column * 6] = u;
    positions[column * 6 + 3] = u;
  }
  const index: number[] = [];
  for (let column = 0; column < SEGMENTS; column++) {
    const a = column * 2;
    index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setIndex(index);
  const edges = new Float32Array(columns * 2);
  if (extra === "alpha") {
    // Opaque next to the layer's edge, clear at the far side of the strip.
    for (let column = 0; column < columns; column++) edges[column * 2 + 1] = 1;
    geometry.setAttribute("aAlpha", new BufferAttribute(edges, 1));
  } else {
    geometry.setAttribute("aEdge", new BufferAttribute(edges, 1));
  }
  return { geometry, positions, edges, columns };
}

export function createWaveScene(canvas: HTMLCanvasElement) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, -1, 1);

  const layers = LAYERS.map((spec, index) => {
    const fill = createStrip("edge");
    const fillMaterial = new ShaderMaterial({
      uniforms: {
        uEdge: { value: new Color() },
        uDeep: { value: new Color() },
        uRim: { value: new Color() },
        uOpacity: { value: LAYER_OPACITIES[index] },
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
    return { spec, fill, fillMesh, fillMaterial, shadow, shadowMesh, shadowMaterial };
  });

  let aspect = 1;
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

  const applyColors = () => {
    const styles = getComputedStyle(document.documentElement);
    const token = (name: string) => new Color(styles.getPropertyValue(name).trim());
    const dark = getTheme() === "dark";
    // Light page: pale rose at the back to a deeper rose in front, never dark enough to hurt the text over it.
    // Dark page: a soft pink at the back to a wine in front, kept light enough that the bottom corners do not
    // sink into the page. Each layer is a clear step from the last.
    // The dark page's colours are brighter than before to make up for the lower opacity: less of the layer
    // shows, so what shows has to glow more.
    const back = dark ? token("--accent").lerp(new Color(0xffffff), 0.1) : new Color(0xf5d2df);
    const front = dark ? new Color(0xb85a80) : new Color(0xb46b8c);
    const deepen = dark ? new Color(0x2a1621) : token("--accent");
    // How much of the layers shows on the left, where the text is: the dark page needs more of it, or its
    // lower left corner is left empty and black.
    const safe = dark ? 0.42 : 0.18;
    layers.forEach(({ fillMaterial, shadowMaterial }, index) => {
      const edge = back.clone().lerp(front, index / (LAYER_COUNT - 1));
      fillMaterial.uniforms.uSafe.value = shadowMaterial.uniforms.uSafe.value = safe;
      fillMaterial.uniforms.uEdge.value.copy(edge);
      fillMaterial.uniforms.uDeep.value.copy(edge).lerp(deepen, dark ? 0.3 : 0.38);
      // The lit edge: the layer's own colour pushed toward a soft pink-white.
      fillMaterial.uniforms.uRim.value.copy(edge).lerp(new Color(dark ? 0xf7b8cb : 0xffffff), dark ? 0.55 : 0.5);
      shadowMaterial.uniforms.uColor.value.set(dark ? 0x14080f : 0x3a1029);
      // A layer's shadow falls on the one behind it, so a faint layer casts a faint shadow: it follows the
      // opacity, keeping a floor so the edge of the faintest one is still drawn.
      const solidity = LAYER_OPACITIES[index] / LAYER_OPACITIES[LAYER_COUNT - 1];
      shadowMaterial.uniforms.uStrength.value = (dark ? 0.5 : 0.42) * (0.35 + 0.65 * solidity);
    });
  };

  const resize = (width: number, height: number) => {
    aspect = width / height;
    renderer.setSize(width, height, false);
    camera.left = -aspect;
    camera.right = aspect;
    camera.updateProjectionMatrix();
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
   * offset (-1..1), and `fades` is how visible each layer is (0..1), for the entrance.
   */
  const draw = (seconds: number, pointerX: number, pointerY: number, fades: readonly number[]) => {
    layers.forEach(({ spec, fill, fillMesh, fillMaterial, shadow, shadowMesh, shadowMaterial }, index) => {
      for (let column = 0; column < fill.columns; column++) {
        const u = -OVERSCAN + (2 * OVERSCAN * column) / SEGMENTS;
        const edge = edgeAt(spec, u, seconds, horizon, pointerX * 0.5 * (index % 2 ? -1 : 1));
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
      fillMaterial.uniforms.uOpacity.value = LAYER_OPACITIES[index] * fade;
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

  return { applyColors, resize, setHorizon, setSafeZone, draw, dispose };
}
