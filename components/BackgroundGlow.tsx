"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const EASING = 0.18;
const MAX_DEPTH = 340;
const SETTLE_PX = 0.1;

const blobs = [
  { className: "right-[-15%] top-[-40%] h-[115%] w-[85%] bg-glow-2", depth: 150 },
  { className: "left-[-5%] top-[-55%] h-[105%] w-[65%] bg-glow-1", depth: 240 },
  { className: "right-[30%] top-[10%] h-[55%] w-[40%] bg-glow-1", depth: MAX_DEPTH },
];

export function BackgroundGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const motionQuery = window.matchMedia(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    const apply = () => {
      container.style.setProperty("--glow-x", current.x.toFixed(4));
      container.style.setProperty("--glow-y", current.y.toFixed(4));
    };

    const tick = () => {
      current.x += (target.x - current.x) * EASING;
      current.y += (target.y - current.y) * EASING;
      apply();

      const remaining = Math.max(Math.abs(target.x - current.x), Math.abs(target.y - current.y));
      frame = remaining * MAX_DEPTH < SETTLE_PX ? 0 : requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      target.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.y = (event.clientY / window.innerHeight) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const syncWithPreferences = () => {
      if (motionQuery.matches) {
        window.addEventListener("pointermove", onPointerMove);
        return;
      }
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(frame);
      frame = 0;
      target.x = target.y = current.x = current.y = 0;
      apply();
    };

    syncWithPreferences();
    motionQuery.addEventListener("change", syncWithPreferences);

    return () => {
      motionQuery.removeEventListener("change", syncWithPreferences);
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-[95vh] overflow-hidden"
    >
      {blobs.map((blob) => (
        <div
          key={blob.className}
          className={`glow-blob ${blob.className}`}
          style={{ "--glow-depth": blob.depth } as CSSProperties}
        />
      ))}
    </div>
  );
}
