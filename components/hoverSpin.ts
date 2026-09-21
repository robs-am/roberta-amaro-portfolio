import { animate, type JSAnimation } from "animejs";
import { Raycaster, Vector2, type Material, type Mesh, type PerspectiveCamera } from "three";
import { blobs } from "@/components/shapesScene";

// What happens when the pointer moves onto a shape, once per visit and softly:
// - the ring turns a full circle around its diameter (a coin flip; it passes edge-on only for an instant,
//   while a ring that rests edge-on reads as a pill). Around its own axis nothing would be seen, a ring is
//   the same from there;
// - the knot turns a full circle around its own axis;
// - a sphere looks the same from every side, so it swells a little and settles back.
const TURN_MS = 1800;
const PULSE_UP_MS = 450;
const PULSE_DOWN_MS = 750;
const PULSE_SIZE = 1.18;
// A shape that is still fading in cannot be touched yet.
const MIN_OPACITY = 0.5;

/**
 * Hover effect for the shapes' meshes. Call `hover` with the pointer position and, every frame, `apply`
 * with the mesh's index (and read `scales[i]` when sizing it). The canvases have `pointer-events: none`,
 * so the pointer is tested against the shapes with a ray instead of with DOM events.
 */
export function createHoverSpin(meshes: Mesh[], camera: PerspectiveCamera) {
  const raycaster = new Raycaster();
  const ndc = new Vector2();
  const scales = meshes.map(() => 1);
  const running: (JSAnimation | null)[] = meshes.map(() => null);
  // Each shape's state, tweened by anime.js as a plain object.
  const states = meshes.map(() => ({ turn: 0, scale: 1 }));

  const hover = (clientX: number, clientY: number) => {
    ndc.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster
      .intersectObjects(meshes, false)
      .find((entry) => ((entry.object as Mesh).material as Material).opacity > MIN_OPACITY);
    if (!hit) return;
    const index = meshes.indexOf(hit.object as Mesh);
    if (index < 0 || running[index] !== null) return;

    const state = states[index];
    const done = () => {
      running[index] = null;
    };
    if (blobs[index].shape === "sphere") {
      running[index] = animate(state, {
        scale: [
          { to: PULSE_SIZE, duration: PULSE_UP_MS, ease: "outSine" },
          { to: 1, duration: PULSE_DOWN_MS, ease: "inOutSine" },
        ],
        onUpdate: () => {
          scales[index] = state.scale;
        },
        onComplete: done,
      });
    } else {
      running[index] = animate(state, { turn: state.turn + Math.PI * 2, duration: TURN_MS, ease: "inOutSine", onComplete: done });
    }
  };

  /** Puts the current turn on the mesh; the ring flips around its diameter, the knot around its axis. */
  const apply = (index: number) => {
    const { rotation } = meshes[index];
    if (blobs[index].shape === "torus") rotation.y = states[index].turn;
    else if (blobs[index].shape === "knot") rotation.z = states[index].turn;
  };

  const dispose = () => {
    for (const animation of running) animation?.cancel();
  };

  return { scales, hover, apply, dispose };
}
