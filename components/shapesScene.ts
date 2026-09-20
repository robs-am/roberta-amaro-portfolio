// The arrangement shared by the 3D shapes behind the hero and behind the menu. Both layers read this
// same data, so when the menu opens over the home the shapes do not move: it looks like the same
// scene, not one replacing another. Change positions, sizes or opacity here, never in one layer only.

// Rounded 3D forms (a ring, a knot, spheres) grouped beside the text. `anchor` is the shape's center in
// normalized viewport coordinates (-1..1, y up), so values near ±1 push it partly off screen; `radius`
// scales the shape in blob units (one unit is UNIT_SHARE of the viewport). Kept abstract on purpose:
// elongated tubes next to spheres read as anatomy.
export type Blob = {
  anchor: [number, number];
  z: number;
  radius: number;
  shape: "sphere" | "torus" | "knot";
  tilt: [number, number];
  drift: number;
  tone: 0 | 1;
  /** Where and how big it is on a portrait screen (see PORTRAIT_ASPECT). */
  portrait: { anchor: [number, number]; radius: number };
};

export const blobs: Blob[] = [
  // One cluster in the free space to the right of the text: a ring, a knot and two spheres,
  // overlapping in depth. On a portrait screen they stay in a column down the right edge (ring, wine
  // sphere, small sphere, knot), beside the short lines of text.
  { anchor: [0.5, 0.42], z: 0, radius: 1.05, shape: "torus", tilt: [0.9, 0.4], drift: 0.1, tone: 0, portrait: { anchor: [0.64, 0.52], radius: 0.95 } },
  { anchor: [0.52, -0.5], z: 0.4, radius: 0.85, shape: "knot", tilt: [0.3, 0.8], drift: -0.08, tone: 1, portrait: { anchor: [0.6, -0.72], radius: 0.75 } },
  { anchor: [0.86, 0.08], z: -1, radius: 0.62, shape: "sphere", tilt: [0, 0], drift: 0, tone: 1, portrait: { anchor: [0.85, 0.1], radius: 0.7 } },
  { anchor: [0.36, -0.02], z: 0.8, radius: 0.3, shape: "sphere", tilt: [0, 0], drift: 0, tone: 0, portrait: { anchor: [0.42, -0.05], radius: 0.32 } },
];

// Below this width-to-height ratio the screen is treated as portrait (a phone, or a tablet held upright).
export const PORTRAIT_ASPECT = 0.85;

// One blob unit, as a fraction of the smaller of the viewport's height and 0.7 of its width.
export const UNIT_SHARE = 0.3;
export const POINTER_SHIFT = 0.3;

// How solid the shapes are; below 1 the page's background shows through them a little.
export const SHAPE_OPACITY = 0.92;

// The pointer offset, eased, as the hero last had it. The menu starts from it instead of from zero, so
// the shapes do not jump when it opens.
export const pointerCurrent = { x: 0, y: 0 };
export const pointerTarget = { x: 0, y: 0 };
