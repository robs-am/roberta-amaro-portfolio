import { NEUTRAL_MOOD, cleanMood, easeMood, moodRate, moodToLayers, type WaveMood } from "@/components/shapes/waveMood";

// What the wave layers behind the hero and behind the menu share (the layers themselves are in waveScene.ts).
// Both read this same data, so when the menu opens over the home the waves do not move: it looks like the
// same scene, not one replacing another.

// The pointer offset, eased, as the hero last had it. The menu starts from it instead of from zero, so
// the waves do not jump when it opens.
export const pointerCurrent = { x: 0, y: 0 };
export const pointerTarget = { x: 0, y: 0 };

// Where the waves start (see `setHorizon` in waveScene.ts), as the hero last measured it from the bottom of
// the name, so the menu draws the waves at the same height and they do not jump when it opens.
export const waveHorizon = { y: -0.05 };

// Where the home's text ends, as measured by the hero (see `setSafeZone` in waveScene.ts), so the menu fades the
// waves out of the text's way in the same place.
export const waveSafe = { u: 0.1 };

// The waves' mood and clock, shared like the rest: the menu carries on from the exact mood and moment the hero
// had. The mood is eased toward a target (`setWaveMood`), and the clock is added up frame by frame at the
// mood's pace instead of read from the page's time: the phase of a wave is speed x time, so changing the
// speed against a fixed time would make every wave jump, while adding up small steps changes it smoothly.
const MAX_STEP = 0.1;
const mood = { current: { ...NEUTRAL_MOOD }, target: { ...NEUTRAL_MOOD } };
// `tone` is what the paint follows (see `setTone` in waveScene.ts): the layers get the shape of the mood, the
// paint gets these five.
const clock = { seconds: 0, last: 0, layers: moodToLayers(NEUTRAL_MOOD), tone: { warmth: 0, hue: 0, tint: 0, spread: 0, grain: 0 } };

// What the scene draws follows the current mood: its shape for the layers, its five paint dials for the paint.
const publishMood = () => {
  clock.layers = moodToLayers(mood.current);
  const { warmth, hue, tint, spread, grain } = mood.current;
  clock.tone = { warmth, hue, tint, spread, grain };
};

// The scene is drawn by a loop, which picks a new mood up by itself; with reduced motion there is no loop (a
// still frame), so the scene has to be told to draw again. See `HeroShapes`.
const listeners = new Set<() => void>();
export const subscribeWaveMood = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const setWaveMood = (next: Partial<WaveMood>) => {
  mood.target = cleanMood(next, mood.target);
  // With reduced motion nothing eases: the still frame goes straight to the new mood.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    mood.current = { ...mood.target };
    publishMood();
  }
  for (const listener of listeners) listener();
};

/** Back to the scene as it was designed, easing there like any other mood. */
export const resetWaveMood = () => setWaveMood(NEUTRAL_MOOD);

/**
 * Moves the mood and the clock up to `now` (seconds, the page's own clock) and returns what to draw. The hero and
 * the menu can both run a loop at once, and both ask with the same frame's time, so the second ask changes nothing.
 */
export const stepWaves = (now: number) => {
  if (now > clock.last) {
    const dt = Math.min(now - clock.last, MAX_STEP);
    clock.last = now;
    clock.seconds += dt * moodRate(mood.current);
    if (easeMood(mood.current, mood.target, dt)) publishMood();
  }
  return clock;
};

// The home's entrance runs the text and the waves together: they start at the same moment and finish at
// the same moment. HERO_ENTRANCE_MS is when the text is done (see the timings in Hero.tsx, where the last
// item starts at 1000 + 4 x 140 ms and lasts 1100 ms); Hero stamps when it started, and the waves, which
// mount later because Three.js loads separately, work out how much of that time is left.
export const HERO_ENTRANCE_MS = 2700;
// The entrance plays every time the home mounts, like the other pages' entrances do.
export const heroEntrance = { startedAt: 0 };
