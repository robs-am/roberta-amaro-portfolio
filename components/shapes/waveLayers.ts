export const LAYER_COUNT = 4;

// Below this width-to-height ratio the screen is portrait (a phone): the text fills the width there, so the
// waves stay faint everywhere instead of only behind the text column. Exported so the hero can place its
// horizon lower on the same screens (see `PORTRAIT_CLEAR` in HeroShapes.tsx).
export const PORTRAIT_ASPECT = 0.85;
// How opaque each layer is, back to front. The layers behind are the ones that pass behind the text, so they
// are faint, and the opacity rises step by step toward the front layer, which stays solid and reads as the
// nearest. The shadows follow it (see `applyColors` in waveScene.ts).
// The dark page is a dusk sky: the three back layers are the glow, so they are more present than before, and the front one
// is a near-solid silhouette.
export const DARK_OPACITIES = [0.32, 0.52, 0.64, 0.95];
// The light page is built like the dark one: translucent veils that get their depth from a dark side and from the
// shadows between the layers, and only the front one has body. High opacities (0.4 to 0.88, then 0.4 to 0.82) made
// every layer a flat pink sheet and read as sweet, not elegant.
// The wine palette needs more body than the pink did: at the old 0.46 and 0.64 a dark colour over the light page
// washed out to the same pastel, so the two front layers are higher while the back ones stay faint veils.
// The steps are even (about 0.14 each), like the dark page's, so the change from one layer to the next reads the same.
export const LIGHT_OPACITIES = [0.3, 0.42, 0.54, 0.62];

// Below this aspect the screen is narrower than it is tall (a phone in portrait): the same amplitude that
// reads as a calm, wide swell on a landscape screen gets squeezed into a much narrower width there, so every
// hump turns into a sharp, tall spike. `freqScale` widens the humps back out on those screens by lowering
// their frequency in proportion to how much narrower the screen is; landscape screens (>= 1) are untouched.
// Screens that are not portrait use this one factor. 1 was the original; 1.5 (more, tighter waves) read as a ripple, not
// as swells, so it went below 1 (her call: fewer, wider humps) and the waves got taller instead (`LANDSCAPE_AMPLITUDE`):
// lowering the frequency only widens a hump, its height is the amplitude.
export const LANDSCAPE_FREQ_SCALE = 0.85;
// How tall the waves are on a wide screen, as a multiple of the hand-tuned amplitudes. The crests rise higher above
// the horizon by this much, so the hero keeps its text clear with `DESKTOP_CLEAR` (HeroShapes.tsx).
export const LANDSCAPE_AMPLITUDE = 1.45;
// The steps between the layers on a wide screen: closer (0.8 of the hand-tuned steps), so a front layer's crest rises
// above the valleys of the one behind it and the layers overlap where they can be seen. At the wider humps, and with the
// two back layers faint, the full steps left the layers as separate bands.
export const LANDSCAPE_SPACING = 0.8;
// On a wide screen the layers also come in from the sides and sag toward the middle: past the text (see `setSafeZone`)
// each edge is lifted by up to this much (screen height units) at the screen's sides, the left more than the right so
// the two sides are not a mirrored bowl. The middle, under the text, keeps the waves' own shape. The lift grows over
// `LANDSCAPE_SIDE_REACH` (in `u`) from where the text ends.
export const LANDSCAPE_SIDE_LIFT = { left: 0.34, right: 0.2 };
export const LANDSCAPE_SIDE_REACH = 0.9;
// On a real phone (`PORTRAIT_ASPECT`) that proportional cut went too far: at the 0.55 it bottomed out at, the
// main wave showed less than half a hump across the width, so the layers read as one broad slope, not as waves.
// This fixed value shows about one crest per layer while the skew and the taller waves below keep them from spiking.
// Wider still (0.9 to 0.4, her call: calmer waves) since the layers got a diagonal (`PORTRAIT_TILT`): a long, slow
// slope with about one broad crest per layer across the screen, not a row of humps. Below about 0.5 the main wave
// shows less than half a hump across the width, which the diagonal keeps from reading as one flat slope.
export const PORTRAIT_FREQ_SCALE = 0.4;

// On a portrait screen (see `PORTRAIT_ASPECT`) the text takes most of the height, so the waves only get the strip
// under it. Two changes make the four layers fit that strip and still read as full: the steps between them
// shrink (`PORTRAIT_SPACING`, measured from the first layer, which stays where it is so it keeps clear of the
// CTAs), and the waves grow taller (`PORTRAIT_AMPLITUDE`) so the layers still interlock. Landscape is untouched.
// On a portrait screen the layers also lean: the edge runs from its full height at the left to `2 * -PORTRAIT_TILT`
// lower at the right (`u` runs -1 to 1), so the waves gather in the bottom left and thin out in a diagonal toward the
// bottom right. The left keeps the height the horizon was placed for, so the lean never brings a crest closer to the
// text (which sits on the left); only the right drops. Landscape has no lean.
export const PORTRAIT_TILT = -0.12;
export const PORTRAIT_SPACING = 0.75;
export const PORTRAIT_AMPLITUDE = 1.25;

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
export const edgeAt = (
  spec: LayerSpec,
  u: number,
  seconds: number,
  horizon: number,
  lean: number,
  freqScale: number,
  spacing = 1,
  amplitudeScale = 1,
  tilt = 0,
) => {
  let y = horizon + LAYERS[0].base + (spec.base - LAYERS[0].base) * spacing + tilt * (u + 1);
  for (let i = 0; i < 3; i++) {
    const angle = spec.frequency[i] * freqScale * u + spec.phase[i] + spec.speed[i] * seconds + (i === 0 ? lean : 0);
    // Bending the angle by its own sine skews the wave: sin(a + k sin a) is steeper on one side than the other.
    y += spec.amplitude[i] * amplitudeScale * Math.sin(i === 0 ? angle + spec.skew * Math.sin(angle) : angle);
  }
  return y;
};
