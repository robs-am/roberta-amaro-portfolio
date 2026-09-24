import { LAYERS, type LayerSpec } from "@/components/shapes/waveLayers";

// The dials the AI picks from a visitor's prompt. The AI never touches a shader value: it only chooses a
// point on these dials, and `moodToLayers` turns that point into layers inside the range hand-tuned in
// `LAYERS`, so no answer can come out ugly or off-brand.
//
// Calm, energy and speed all rest at 0.5, and at rest the scene is exactly `LAYERS` with the clock at its normal
// pace: the scene the hero already has is the middle of the space, and a mood only moves away from it.
export type WaveMood = {
  // 0 restless (a busier ripple, steeper humps) to 1 still (a smooth swell).
  calm: number;
  // 0 low waves to 1 tall waves.
  energy: number;
  // -1 cool to 1 warm. It moves the colours, not the shape, so `moodToLayers` does not read it.
  warmth: number;
  // 0 slow drift to 1 fast. It is the pace of the clock (`moodRate`), not part of the layers: see shapesScene.ts.
  speed: number;
  // The colour the visitor asked for, as a place on the colour wheel in degrees (0 red, 120 green, 215 blue, 330
  // pink). Only meaningful while `tint` is above 0. Like warmth, it moves the colours and not the shape.
  hue: number;
  // How much of that colour the waves take: 0 none (her rose) to 1 as much as the scene allows.
  tint: number;
  // How far apart the layers' hues are pushed around the wheel: 0 all the same colour, 1 a spread of colours, one per
  // layer (a party, a rainbow). Only meaningful while `tint` is above 0, and it fades in and out with it.
  spread: number;
};

// What `/api/wave-mood` answers (and what the mock stands in for): the dials plus a short phrase saying how the
// prompt was read, to show the visitor.
export type WaveMoodAnswer = WaveMood & { label: string };

export const NEUTRAL_MOOD: WaveMood = { calm: 0.5, energy: 0.5, warmth: 0, speed: 0.5, hue: 0, tint: 0, spread: 0 };

// What each end of a dial multiplies the resting value by. `low` applies at 0, `high` at 1, and 0.5 is always 1.
const ENERGY_AMPLITUDE = { low: 0.55, high: 1.5 };
const CALM_RIPPLE = { low: 2, high: 0.4 };
const CALM_SKEW = { low: 1.25, high: 0.5 };
const SPEED_RATE = { low: 0.3, high: 2.2 };
// A skew of 1 or more folds the wave back over itself (see `edgeAt`), so it stays under it.
const MAX_SKEW = 0.95;
// How long the current mood takes to close most of the way to a new one: about three times this to settle.
const EASE_SECONDS = 0.9;
// Below this distance a dial is close enough to its target to land on it.
const SETTLED = 0.002;
const SETTLED_DEGREES = 0.2;
// The dials that ease in a straight line; the hue is a circle and has its own step in `easeMood`.
const EASED = ["calm", "energy", "warmth", "speed", "tint", "spread"] as const;
// Under this much tint the colour is not visible, so the hue can change without anyone seeing it turn.
const HUE_HIDDEN = 0.02;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
// The answer comes from a model, so a missing or non-numeric field keeps the value it already had.
const dial = (value: unknown, min: number, max: number, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? clamp(value, min, max) : fallback;

// 0 -> low, 0.5 -> 1, 1 -> high: two straight halves, so the middle of the dial is always the untouched scene.
const scale = (t: number, { low, high }: { low: number; high: number }) =>
  t < 0.5 ? low + (1 - low) * (t / 0.5) : 1 + (high - 1) * ((t - 0.5) / 0.5);

// A place on the colour wheel is a circle, not a range: 370 is 10, not "too high".
const wrapHue = (value: unknown, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? ((value % 360) + 360) % 360 : fallback;

/** Reads a mood the AI (or anyone) sent: every dial is clamped to its range and a bad one keeps `from`'s. */
export const cleanMood = (mood: Partial<WaveMood>, from: WaveMood = NEUTRAL_MOOD): WaveMood => ({
  calm: dial(mood.calm, 0, 1, from.calm),
  energy: dial(mood.energy, 0, 1, from.energy),
  warmth: dial(mood.warmth, -1, 1, from.warmth),
  speed: dial(mood.speed, 0, 1, from.speed),
  hue: wrapHue(mood.hue, from.hue),
  tint: dial(mood.tint, 0, 1, from.tint),
  spread: dial(mood.spread, 0, 1, from.spread),
});

// A mood in a link, as the seven numbers in this order: `?mood=0.85,0.15,-0.3,0.1,270,0,0`. The label is left out on
// purpose: it is text, and text from a link could put anyone's words on the page.
const PARAM_KEYS = ["calm", "energy", "warmth", "speed", "hue", "tint", "spread"] as const;
const MAX_PARAM_LENGTH = 60;

export const moodToParam = (mood: WaveMood) =>
  PARAM_KEYS.map((key) => (key === "hue" ? Math.round(mood[key]) : Math.round(mood[key] * 100) / 100)).join(",");

/** Reads a `?mood=` value. Returns null when it is not exactly seven numbers; the numbers are then cleaned like any answer. */
export const moodFromParam = (param: string | null): WaveMood | null => {
  if (!param || param.length > MAX_PARAM_LENGTH) return null;
  const parts = param.split(",");
  if (parts.length !== PARAM_KEYS.length || parts.some((part) => part.trim() === "")) return null;
  const numbers = parts.map(Number);
  if (numbers.some((value) => !Number.isFinite(value))) return null;
  return cleanMood(Object.fromEntries(PARAM_KEYS.map((key, index) => [key, numbers[index]])));
};

/** How fast the wave clock runs for this mood: 1 is the pace the scene always had. */
export const moodRate = (mood: WaveMood) => scale(mood.speed, SPEED_RATE);

export const moodToLayers = (mood: WaveMood): LayerSpec[] => {
  const { calm, energy } = cleanMood(mood);
  const height = scale(energy, ENERGY_AMPLITUDE);
  const ripple = scale(calm, CALM_RIPPLE);
  const lean = scale(calm, CALM_SKEW);

  return LAYERS.map((layer) => ({
    ...layer,
    // Energy lifts the whole edge; calm only changes the fine ripple, the middle of the three sines.
    amplitude: [layer.amplitude[0] * height, layer.amplitude[1] * height * ripple, layer.amplitude[2] * height],
    skew: clamp(layer.skew * lean, -MAX_SKEW, MAX_SKEW),
  }));
};

/**
 * Moves `current` toward `target` in place over `dt` seconds (exponential, so it starts fast and lands soft
 * instead of stopping dead). Returns whether anything changed, so the caller only rebuilds layers when needed.
 */
export const easeMood = (current: WaveMood, target: WaveMood, dt: number) => {
  const step = 1 - Math.exp(-dt / EASE_SECONDS);
  let moved = false;
  for (const key of EASED) {
    const gap = target[key] - current[key];
    if (gap === 0) continue;
    current[key] = Math.abs(gap) < SETTLED ? target[key] : current[key] + gap * step;
    moved = true;
  }

  // The hue turns the short way round the wheel (350 to 10 is 20 degrees, not 340), and only while there is a
  // colour to turn: with none showing it jumps to the new one, so a fresh colour fades in as itself instead of
  // sweeping through every colour between; when the target has none, it stays put while the colour fades out.
  if (target.tint > 0 && current.hue !== target.hue) {
    if (current.tint < HUE_HIDDEN) {
      current.hue = target.hue;
    } else {
      const arc = ((((target.hue - current.hue) % 360) + 540) % 360) - 180;
      current.hue = Math.abs(arc) < SETTLED_DEGREES ? target.hue : (current.hue + arc * step + 360) % 360;
    }
    moved = true;
  }
  return moved;
};
