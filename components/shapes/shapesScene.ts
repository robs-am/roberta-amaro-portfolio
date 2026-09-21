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
  // overlapping in depth. On a portrait screen they keep the same order down the right side (ring, wine
  // sphere, small sphere, knot), and fitPlacements() pushes each one out just far enough to clear the text.
  { anchor: [0.5, 0.42], z: 0, radius: 1.05, shape: "torus", tilt: [0.9, 0.4], drift: 0.1, tone: 0, portrait: { anchor: [-0.5, 0.8], radius: 0.95 } },
  { anchor: [0.52, -0.5], z: 0.4, radius: 0.85, shape: "knot", tilt: [0.3, 0.8], drift: -0.08, tone: 1, portrait: { anchor: [0.5, -0.72], radius: 0.75 } },
  { anchor: [0.86, 0.08], z: -1, radius: 0.62, shape: "sphere", tilt: [0, 0], drift: 0, tone: 1, portrait: { anchor: [0.8, 0.1], radius: 0.7 } },
  { anchor: [0.36, -0.02], z: 0.8, radius: 0.3, shape: "sphere", tilt: [0, 0], drift: 0, tone: 0, portrait: { anchor: [0.3, -0.05], radius: 0.32 } },
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

// How long the shapes take to glide to a new placement (anime.js, with the site's usual outExpo curve).
export const PLACEMENT_MS = 900;

/** A shape's normalized anchor (-1..1, y up) and its radius, in blob units. Flat, so anime.js can tween it. */
export type Placement = { x: number; y: number; radius: number };

// The placements the hero settled on, so the menu can start from them and glide from there (and back).
export const heroPlacements: { current: Placement[] | null } = { current: null };

// Rough outer radius of each shape, per unit of `radius` (the ring and the knot are wider than their radius).
const OUTER_RADIUS: Record<Blob["shape"], number> = { sphere: 1, torus: 1.42, knot: 1.6 };
const TEXT_GAP = 14;
// How far past the right edge a shape may bleed, as a share of its own radius.
const EDGE_BLEED = 0.25;
const FIT_SCALES = [1, 0.85, 0.7, 0.55];

/** Every line of text and every icon inside `root`, as viewport rectangles. Hidden labels are skipped. */
export function collectTextRects(root: Element): DOMRect[] {
  const rects: DOMRect[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim() || node.parentElement?.closest('[aria-hidden="true"]')) continue;
    range.selectNodeContents(node);
    for (const rect of range.getClientRects()) if (rect.width > 0) rects.push(rect);
  }
  for (const icon of root.querySelectorAll("svg")) {
    const rect = icon.getBoundingClientRect();
    if (rect.width > 0) rects.push(rect);
  }
  return rects;
}

/**
 * Portrait layout that adapts to the text: each shape rests at its portrait anchor, and is pushed right
 * just far enough to clear the widest line of text that overlaps it vertically. If it would not fit on
 * screen, it shrinks a little first. `unitPx` is one blob unit in pixels.
 */
export function fitPlacements(rects: DOMRect[], width: number, height: number, unitPx: number): Placement[] {
  return blobs.map((blob) => {
    const [anchorX, anchorY] = blob.portrait.anchor;
    const restX = ((anchorX + 1) / 2) * width;
    const centerY = ((1 - anchorY) / 2) * height;
    let placed: Placement = { x: anchorX, y: anchorY, radius: blob.portrait.radius * FIT_SCALES[FIT_SCALES.length - 1] };
    for (const scale of FIT_SCALES) {
      const reach = OUTER_RADIUS[blob.shape] * blob.portrait.radius * scale * unitPx;
      let textRight = 0;
      for (const rect of rects) {
        if (rect.bottom > centerY - reach && rect.top < centerY + reach) textRight = Math.max(textRight, rect.right);
      }
      const x = Math.min(Math.max(restX, textRight + TEXT_GAP + reach), width + EDGE_BLEED * reach);
      placed = { x: (x / width) * 2 - 1, y: anchorY, radius: blob.portrait.radius * scale };
      if (textRight + TEXT_GAP + reach <= width + EDGE_BLEED * reach) break;
    }
    return placed;
  });
}

// The home's entrance runs the text and the shapes together: they start at the same moment and finish at
// the same moment. HERO_ENTRANCE_MS is when the text is done (see the timings in Hero.tsx, where the last
// item starts at 1000 + 4 x 140 ms and lasts 1100 ms); Hero stamps when it started, and the shapes, which
// mount later because Three.js loads separately, work out how much of that time is left.
export const HERO_ENTRANCE_MS = 2700;
// The entrance plays every time the home mounts, like the other pages' entrances do.
export const heroEntrance = { startedAt: 0 };
