import { LAYERS, type LayerSpec } from "@/components/shapes/waveLayers";

// The four dials the AI picks from a visitor's prompt. The AI never touches a shader value: it only chooses a
// point on these dials, and `moodToLayers` turns that point into layers inside the range hand-tuned in
// `LAYERS`, so no answer can come out ugly or off-brand.
//
// Calm, energy and speed all rest at 0.5, and at rest `moodToLayers` returns `LAYERS` unchanged: the scene the
// hero already has is the middle of the space, and a mood only moves away from it.
export type WaveMood = {
  // 0 restless (a busier ripple, steeper humps) to 1 still (a smooth swell).
  calm: number;
  // 0 low waves to 1 tall waves.
  energy: number;
  // -1 cool to 1 warm. It moves the colours, not the shape, so `moodToLayers` does not read it.
  warmth: number;
  // 0 slow drift to 1 fast.
  speed: number;
};

export const NEUTRAL_MOOD: WaveMood = { calm: 0.5, energy: 0.5, warmth: 0, speed: 0.5 };

// What each end of a dial multiplies the resting value by. `low` applies at 0, `high` at 1, and 0.5 is always 1.
const ENERGY_AMPLITUDE = { low: 0.55, high: 1.5 };
const CALM_RIPPLE = { low: 2, high: 0.4 };
const CALM_SKEW = { low: 1.25, high: 0.5 };
const SPEED_RATE = { low: 0.3, high: 2.2 };
// A skew of 1 or more folds the wave back over itself (see `edgeAt`), so it stays under it.
const MAX_SKEW = 0.95;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
// The answer comes from a model, so a missing or non-numeric field falls back to the resting value.
const dial = (value: number, min: number, max: number, fallback: number) =>
  Number.isFinite(value) ? clamp(value, min, max) : fallback;

// 0 -> low, 0.5 -> 1, 1 -> high: two straight halves, so the middle of the dial is always the untouched scene.
const scale = (t: number, { low, high }: { low: number; high: number }) =>
  t < 0.5 ? low + (1 - low) * (t / 0.5) : 1 + (high - 1) * ((t - 0.5) / 0.5);

export const moodToLayers = (mood: WaveMood): LayerSpec[] => {
  const calm = dial(mood.calm, 0, 1, 0.5);
  const energy = dial(mood.energy, 0, 1, 0.5);
  const speed = dial(mood.speed, 0, 1, 0.5);

  const height = scale(energy, ENERGY_AMPLITUDE);
  const ripple = scale(calm, CALM_RIPPLE);
  const lean = scale(calm, CALM_SKEW);
  const rate = scale(speed, SPEED_RATE);

  return LAYERS.map((layer) => ({
    ...layer,
    // Energy lifts the whole edge; calm only changes the fine ripple, the middle of the three sines.
    amplitude: [layer.amplitude[0] * height, layer.amplitude[1] * height * ripple, layer.amplitude[2] * height],
    speed: [layer.speed[0] * rate, layer.speed[1] * rate, layer.speed[2] * rate],
    skew: clamp(layer.skew * lean, -MAX_SKEW, MAX_SKEW),
  }));
};
