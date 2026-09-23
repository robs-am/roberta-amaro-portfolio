export const LAYER_COUNT = 4;

// Below this width-to-height ratio the screen is portrait (a phone): the text fills the width there, so the
// waves stay faint everywhere instead of only behind the text column. Exported so the hero can place its
// horizon lower on the same screens (see `PORTRAIT_CLEAR` in HeroShapes.tsx).
export const PORTRAIT_ASPECT = 0.85;
// How opaque each layer is, back to front. The layers behind are the ones that pass behind the text, so they
// are faint, and the opacity rises step by step toward the front layer, which stays solid and reads as the
// nearest. The shadows follow it (see `applyColors` in waveScene.ts).
export const DARK_OPACITIES = [0.14, 0.24, 0.4, 0.52];
// The light page has no glow to carry the waves, so all of its layers hold a visible tint of rose (not only the
// front one) and rise from a light wash at the back to the solid front layer.
export const LIGHT_OPACITIES = [0.22, 0.32, 0.42, 0.5];

// Below this aspect the screen is narrower than it is tall (a phone in portrait): the same amplitude that
// reads as a calm, wide swell on a landscape screen gets squeezed into a much narrower width there, so every
// hump turns into a sharp, tall spike. `freqScale` widens the humps back out on those screens by lowering
// their frequency in proportion to how much narrower the screen is; landscape screens (>= 1) are untouched.
export const CALM_ASPECT = 1;
export const MIN_FREQ_SCALE = 0.55;

// Each edge is three sines added up: a main wave, a finer ripple on it, and a long slow swell that carries the
// whole hump along, so the shape does not repeat. Their speeds differ (and run in opposite directions), so it
// never reads as one sine sliding sideways.
type Triple = [number, number, number];

export type LayerSpec = {
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
export const LAYERS: LayerSpec[] = [
  { base: -0.25, amplitude: [0.15, 0.05, 0.08], frequency: [2.4, 5.6, 1.4], phase: [0.4, 1.9, 0.8], speed: [0.28, -0.2, 0.12], skew: 0.75, parallax: 0.02 },
  { base: -0.45, amplitude: [0.17, 0.05, 0.08], frequency: [3.1, 6.6, 1.7], phase: [2.2, 0.5, 3.0], speed: [-0.25, 0.18, -0.1], skew: -0.7, parallax: 0.04 },
  { base: -0.65, amplitude: [0.18, 0.05, 0.07], frequency: [2.7, 5.9, 1.2], phase: [4.1, 2.7, 5.2], speed: [0.22, -0.16, 0.09], skew: 0.8, parallax: 0.06 },
  { base: -0.85, amplitude: [0.15, 0.05, 0.06], frequency: [3.5, 7.4, 1.6], phase: [1.0, 3.6, 2.1], speed: [-0.2, 0.15, -0.08], skew: -0.6, parallax: 0.08 },
];

// `lean` shifts the main wave with the pointer (in opposite directions on alternate layers), so the waves
// lean toward the cursor like liquid rather than only sliding as a block.
export const edgeAt = (spec: LayerSpec, u: number, seconds: number, horizon: number, lean: number, freqScale: number) => {
  let y = horizon + spec.base;
  for (let i = 0; i < 3; i++) {
    const angle = spec.frequency[i] * freqScale * u + spec.phase[i] + spec.speed[i] * seconds + (i === 0 ? lean : 0);
    // Bending the angle by its own sine skews the wave: sin(a + k sin a) is steeper on one side than the other.
    y += spec.amplitude[i] * Math.sin(i === 0 ? angle + spec.skew * Math.sin(angle) : angle);
  }
  return y;
};
