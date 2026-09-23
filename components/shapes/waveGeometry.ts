import { BufferAttribute, BufferGeometry } from "three";

// Coordinates: y runs -1..1 over the screen height, x runs -aspect..aspect. `u` is x as a share of the
// screen half-width, so the waves have the same number of humps on every screen shape.
export const SEGMENTS = 120;
export const OVERSCAN = 1.3;

// A strip of quads along the wave, two vertices per step (the upper one, then the lower). The shadow's strip
// also carries an alpha, the fill's the height of its edge.
export function createStrip(extra: "alpha" | "edge") {
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
