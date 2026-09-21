import { animate, type JSAnimation } from "animejs";
import { Raycaster, Vector2, type Material, type Mesh, type PerspectiveCamera } from "three";

// What happens when the pointer moves onto a shape, once per visit and softly: it swells a little and
// settles back, like a drop of liquid touched. The shapes have no front or back to turn, so there is no spin.
const PULSE_UP_MS = 450;
const PULSE_DOWN_MS = 750;
const PULSE_SIZE = 1.18;
// A shape that is still fading in cannot be touched yet.
const MIN_OPACITY = 0.5;

/**
 * Hover effect for the shapes' meshes. Call `hover` with the pointer position and read `scales[i]` when
 * sizing each mesh. The canvases have `pointer-events: none`, so the pointer is tested against the shapes
 * with a ray instead of with DOM events.
 */
export function createHoverSpin(meshes: Mesh[], camera: PerspectiveCamera) {
  const raycaster = new Raycaster();
  const ndc = new Vector2();
  const scales = meshes.map(() => 1);
  const running: (JSAnimation | null)[] = meshes.map(() => null);
  // Each shape's state, tweened by anime.js as a plain object.
  const states = meshes.map(() => ({ scale: 1 }));

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
    running[index] = animate(state, {
      scale: [
        { to: PULSE_SIZE, duration: PULSE_UP_MS, ease: "outSine" },
        { to: 1, duration: PULSE_DOWN_MS, ease: "inOutSine" },
      ],
      onUpdate: () => {
        scales[index] = state.scale;
      },
      onComplete: () => {
        running[index] = null;
      },
    });
  };

  const dispose = () => {
    for (const animation of running) animation?.cancel();
  };

  return { scales, hover, dispose };
}
