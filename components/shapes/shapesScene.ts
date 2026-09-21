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

// The home's entrance runs the text and the waves together: they start at the same moment and finish at
// the same moment. HERO_ENTRANCE_MS is when the text is done (see the timings in Hero.tsx, where the last
// item starts at 1000 + 4 x 140 ms and lasts 1100 ms); Hero stamps when it started, and the waves, which
// mount later because Three.js loads separately, work out how much of that time is left.
export const HERO_ENTRANCE_MS = 2700;
// The entrance plays every time the home mounts, like the other pages' entrances do.
export const heroEntrance = { startedAt: 0 };
