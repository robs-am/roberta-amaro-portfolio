import { BufferGeometry, Float32BufferAttribute, MeshBasicMaterial, SphereGeometry, Vector3 } from "three";
import { MarchingCubes } from "three/addons/objects/MarchingCubes.js";
import type { Blob } from "@/components/shapes/shapesScene";

// The shapes are soft masses, like drops of liquid that have run together, next to loose spheres. A mass is a few
// round lobes whose fields add up, so where two lobes are close they fuse with a smooth neck instead of a
// crease (metaballs, polygonised once with marching cubes). Every geometry is centred and scaled to fit a
// sphere of radius 1, so `Blob.radius` means the same for all of them.

type Lobe = { x: number; y: number; z: number; r: number };

// Offsets from the centre of the field and radii, as a share of it. Lobes closer than about their radii
// fuse; the farther apart, the thinner the neck.
const MASSES: Record<"massLong" | "massPair", Lobe[]> = {
  // Three lobes in a row, the middle one biggest, like the large fused body in the reference.
  massLong: [
    { x: -0.29, y: -0.06, z: 0, r: 0.17 },
    { x: 0.02, y: 0.1, z: 0.01, r: 0.13 },
    { x: 0.33, y: -0.05, z: -0.01, r: 0.14 },
  ],
  // Two lobes, one clearly smaller, with a soft waist.
  massPair: [
    { x: -0.14, y: -0.04, z: 0, r: 0.19 },
    { x: 0.21, y: 0.09, z: 0.01, r: 0.11 },
  ],
};

// How much of its depth a mass keeps (1 is as deep as it is tall).
const SQUASH = 0.5;
const RESOLUTION = 64;
const SUBTRACT = 12;
// Marching cubes' fixed iso-level: a lone ball of strength s and subtract k has its surface at sqrt(s / (ISOLATION + k)).
const ISOLATION = 80;

function createMass(lobes: Lobe[]): BufferGeometry {
  const field = new MarchingCubes(RESOLUTION, new MeshBasicMaterial(), false, false, 60000);
  field.isolation = ISOLATION;
  for (const { x, y, z, r } of lobes) {
    field.addBall(0.5 + x, 0.5 + y, 0.5 + z, r * r * (ISOLATION + SUBTRACT), SUBTRACT);
  }
  field.update();

  const count = field.count;
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(field.positionArray.slice(0, count * 3), 3));
  geometry.setAttribute("normal", new Float32BufferAttribute(field.normalArray.slice(0, count * 3), 3));
  field.geometry.dispose();
  (field.material as MeshBasicMaterial).dispose();

  // The field's coordinates run from -1 to 1 around its centre: recentre on the mass and scale it to radius 1.
  geometry.computeBoundingBox();
  const center = geometry.boundingBox!.getCenter(new Vector3());
  geometry.translate(-center.x, -center.y, -center.z);
  geometry.computeBoundingSphere();
  const scale = 1 / geometry.boundingSphere!.radius;
  geometry.scale(scale, scale, scale);

  // Squash the depth so the mass reads as a soft wave or pillow, not a lump. A non-uniform scale bends the
  // normals: they take the inverse (divide by the scale on that axis) and are normalised again.
  geometry.scale(1, 1, SQUASH);
  const normal = geometry.getAttribute("normal");
  const flat = new Vector3();
  for (let i = 0; i < normal.count; i++) {
    flat.fromBufferAttribute(normal, i);
    flat.z /= SQUASH;
    flat.normalize();
    normal.setXYZ(i, flat.x, flat.y, flat.z);
  }
  geometry.computeBoundingSphere();
  return geometry;
}

export function createShapeGeometry(shape: Blob["shape"]): BufferGeometry {
  if (shape === "sphere") return new SphereGeometry(1, 64, 64);
  return createMass(MASSES[shape]);
}
