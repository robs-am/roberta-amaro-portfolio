// Fine film grain over the background, so the home, the menu and the other pages read as the same
// surface. Monochrome noise from an SVG turbulence filter as a data URI, so there is no image to load.
// Fixed and click-through; it never sits on a scrolling container, which would repaint on every scroll.
//
// It sits BEHIND the 3D shapes and the content, never over them: the shapes and the text stay clean.
// `layerClassName` sets its stacking. In the page it is negative (above the background and the glow,
// below the shapes and the content); the menu overlay is opaque and has its own stacking context, so
// it renders its own grain, placed before its shapes in the DOM.
//
// Each theme has its own layer, because one blend mode cannot serve both backgrounds:
// - Dark: the noise is stretched and clipped so most pixels are black and the rest are light speckles,
//   blended with `screen`, which adds light mostly to dark tones (the near-black background).
//   `overlay` would do almost nothing there.
// - Light: the mirror image. Most pixels are white and the rest are dark speckles, blended with
//   `multiply`, which darkens mostly light tones (the near-white background). `overlay` does nothing
//   on a background that light.
const noise = (matrix: string) =>
  `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n' color-interpolation-filters='sRGB'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='${matrix}'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const DARK_GRAIN = noise("0.53 0.53 0.53 0 -0.8 0.53 0.53 0.53 0 -0.8 0.53 0.53 0.53 0 -0.8 0 0 0 0 1");
const LIGHT_GRAIN = noise("-0.53 -0.53 -0.53 0 1.8 -0.53 -0.53 -0.53 0 1.8 -0.53 -0.53 -0.53 0 1.8 0 0 0 0 1");

export function Grain({ layerClassName }: Readonly<{ layerClassName: string }>) {
  const layer = `pointer-events-none fixed inset-0 ${layerClassName}`;
  return (
    <>
      <div
        aria-hidden="true"
        className={`${layer} opacity-[0.55] mix-blend-multiply dark:hidden`}
        style={{ backgroundImage: LIGHT_GRAIN }}
      />
      <div
        aria-hidden="true"
        className={`${layer} hidden opacity-[0.26] mix-blend-screen dark:block`}
        style={{ backgroundImage: DARK_GRAIN }}
      />
    </>
  );
}
