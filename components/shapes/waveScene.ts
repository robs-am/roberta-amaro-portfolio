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
// and menu build this same scene from the same clock (`waveClock` in shapesScene.ts), so when the menu
// opens over the home the waves do not jump.

export const LAYER_COUNT = 4;

// Coordinates: y runs -1..1 over the screen height, x runs -aspect..aspect. `u` is x as a share of the
// screen half-width, so the waves have the same number of humps on every screen shape.
const SEGMENTS = 120;
const OVERSCAN = 1.3;
const FLOOR = -2.5;
const SHADOW_WIDTH = 0.16;
const MAX_PIXEL_RATIO = 1.5;
// Below this width-to-height ratio the screen is portrait (a phone): the text fills the width there, so the
// waves stay faint everywhere instead of only behind the text column.
const PORTRAIT_ASPECT = 0.85;
// How opaque one layer is; the layers stack, so the bottom of the screen ends up the densest.
export const LAYER_OPACITY = 0.4;

type LayerSpec = {
  base: number;
  amplitude: [number, number];
  frequency: [number, number];
  phase: [number, number];
  // Radians per second: slow, and in opposite directions, so the edge never looks like a scrolling sine.
  speed: [number, number];
  // How far the layer follows the pointer; nearer layers move more.
  parallax: number;
};

const LAYERS: LayerSpec[] = [
  { base: 0.2, amplitude: [0.15, 0.05], frequency: [3.1, 6.9], phase: [0.4, 1.9], speed: [0.1, -0.07], parallax: 0.02 },
  { base: -0.06, amplitude: [0.14, 0.06], frequency: [3.6, 7.6], phase: [2.2, 0.5], speed: [-0.09, 0.06], parallax: 0.04 },
  { base: -0.34, amplitude: [0.16, 0.05], frequency: [2.9, 6.4], phase: [4.1, 2.7], speed: [0.08, -0.05], parallax: 0.06 },
  { base: -0.62, amplitude: [0.13, 0.07], frequency: [3.9, 8.1], phase: [1.0, 3.6], speed: [-0.07, 0.05], parallax: 0.08 },
];

const edgeAt = (spec: LayerSpec, u: number, seconds: number) =>
  spec.base +
  spec.amplitude[0] * Math.sin(spec.frequency[0] * u + spec.phase[0] + spec.speed[0] * seconds) +
  spec.amplitude[1] * Math.sin(spec.frequency[1] * u + spec.phase[1] + spec.speed[1] * seconds);

const fillVertex = /* glsl */ `
  varying float vY;
  varying float vU;
  void main() {
    vY = position.y;
    vU = position.x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Lighter at the edge, deeper below it. On a landscape screen the left side, where the text is, is mostly
// clear (`uSafe`); on a portrait one every part is equally faint.
const fillFragment = /* glsl */ `
  uniform vec3 uEdge;
  uniform vec3 uDeep;
  uniform float uTop;
  uniform float uOpacity;
  uniform float uSafe;
  uniform float uPortrait;
  varying float vY;
  varying float vU;
  void main() {
    vec3 color = mix(uEdge, uDeep, smoothstep(0.0, 0.8, uTop - vY));
    float side = mix(uSafe, 1.0, smoothstep(-0.75, 0.15, vU));
    gl_FragColor = vec4(color, uOpacity * mix(side, 0.6, uPortrait));
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
  uniform float uPortrait;
  varying float vAlpha;
  varying float vU;
  void main() {
    float side = mix(uSafe, 1.0, smoothstep(-0.75, 0.15, vU));
    gl_FragColor = vec4(uColor, pow(vAlpha, 1.6) * uStrength * uFade * mix(side, 0.6, uPortrait));
    #include <colorspace_fragment>
  }
`;

// A strip of quads along the wave, two vertices per step: `topY` is the upper vertex, `bottomY` the lower.
function createStrip(withAlpha: boolean) {
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
  if (withAlpha) {
    // Opaque next to the layer's edge, clear at the far side of the strip.
    const alpha = new Float32Array(columns * 2);
    for (let column = 0; column < columns; column++) alpha[column * 2 + 1] = 1;
    geometry.setAttribute("aAlpha", new BufferAttribute(alpha, 1));
  }
  return { geometry, positions, columns };
}

export function createWaveScene(canvas: HTMLCanvasElement) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, -1, 1);

  const layers = LAYERS.map((spec, index) => {
    const fill = createStrip(false);
    const fillMaterial = new ShaderMaterial({
      uniforms: {
        uEdge: { value: new Color() },
        uDeep: { value: new Color() },
        uTop: { value: spec.base },
        uOpacity: { value: LAYER_OPACITY },
        uSafe: { value: 0.18 },
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

    const shadow = createStrip(true);
    const shadowMaterial = new ShaderMaterial({
      uniforms: {
        uColor: { value: new Color() },
        uStrength: { value: 0.3 },
        uFade: { value: 1 },
        uSafe: { value: 0.18 },
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

  const applyColors = () => {
    const styles = getComputedStyle(document.documentElement);
    const token = (name: string) => new Color(styles.getPropertyValue(name).trim());
    const dark = getTheme() === "dark";
    // Light page: pale rose at the back to a deeper rose in front, never dark enough to hurt the text over it.
    // Dark page: a muted pink at the back to a deep wine in front.
    const back = dark ? token("--accent").lerp(token("--glow-2"), 0.55) : new Color(0xf3c9d8);
    const front = dark ? new Color(0x3d2233) : new Color(0xc27b9a);
    const deepen = dark ? new Color(0x120c10) : token("--accent");
    layers.forEach(({ fillMaterial, shadowMaterial }, index) => {
      const edge = back.clone().lerp(front, index / (LAYER_COUNT - 1));
      fillMaterial.uniforms.uEdge.value.copy(edge);
      fillMaterial.uniforms.uDeep.value.copy(edge).lerp(deepen, dark ? 0.45 : 0.3);
      shadowMaterial.uniforms.uColor.value.set(dark ? 0x050305 : 0x3a1029);
      // The first layer's shadow falls on the page itself, so it is fainter.
      shadowMaterial.uniforms.uStrength.value = (dark ? 0.55 : 0.32) * (index === 0 ? 0.5 : 1);
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
        const edge = edgeAt(spec, u, seconds);
        fill.positions[column * 6 + 1] = edge;
        fill.positions[column * 6 + 4] = FLOOR;
        shadow.positions[column * 6 + 1] = edge + SHADOW_WIDTH;
        shadow.positions[column * 6 + 4] = edge;
      }
      fill.geometry.attributes.position.needsUpdate = true;
      shadow.geometry.attributes.position.needsUpdate = true;

      const fade = fades[index] ?? 1;
      fillMesh.visible = shadowMesh.visible = fade > 0.001;
      fillMaterial.uniforms.uOpacity.value = LAYER_OPACITY * fade;
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

  return { applyColors, resize, draw, dispose };
}
