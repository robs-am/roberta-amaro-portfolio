// How strong the waves are on a portrait screen (a phone), as a fraction of their full opacity. There is no
// clear column on the left there (the text fills the width), so every part gets the same strength. It was 0.5,
// which on top of the faint back layers left them almost invisible against the dark page, and a mood with
// nothing to show on; the waves now sit behind only the icons and the mood field, which have their own backdrop.
const PORTRAIT_STRENGTH = "0.85";

// `aEdge` is the height of the layer's edge at this column, so `vDepth` is how far below the edge a point is.
export const fillVertex = /* glsl */ `
  attribute float aEdge;
  varying float vDepth;
  varying float vU;
  void main() {
    vDepth = aEdge - position.y;
    vU = position.x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Lighter at the edge, deeper below it, measured from the wave's own edge so the shading follows the curve.
// A thin band of light runs along the edge itself, like the edge of a sheet of paper catching the light.
// On a landscape screen the left side, where the text is, is mostly clear (`uSafe`); on a portrait one every
// part has the same strength (`PORTRAIT_STRENGTH`).
// `uGrain` turns the paper into sand: specks a little lighter and darker than the colour, a few bright glints and
// a few grains that let the page show through. The grain is laid out from the wave's own edge and not from the
// screen, so it moves with the paper; `uAspect` keeps the specks square (the mesh is stretched to the screen's
// width) and `uSeed` gives every layer its own pattern. It is a colour change on top of the layer's opacity, so the
// grain fades with the layer where the text is.
export const fillFragment = /* glsl */ `
  uniform vec3 uEdge;
  uniform vec3 uDeep;
  uniform vec3 uRim;
  uniform float uOpacity;
  uniform float uGrain;
  uniform float uSeed;
  uniform float uAspect;
  uniform float uSafe;
  uniform float uFadeFrom;
  uniform float uFadeTo;
  uniform float uPortrait;
  varying float vDepth;
  varying float vU;
  float hash(vec2 cell) {
    vec2 p = fract(cell * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  void main() {
    vec3 color = mix(uEdge, uDeep, smoothstep(0.0, 0.7, vDepth));
    color = mix(color, uRim, (1.0 - smoothstep(0.0, 0.05, vDepth)) * 0.65);
    float alpha = 1.0;
    if (uGrain > 0.0) {
      vec2 p = vec2(vU * uAspect, vDepth) + uSeed;
      float fine = hash(floor(p * 320.0));
      float clump = hash(floor(p * 90.0) + 3.7);
      float strength = uGrain * mix(1.0, 0.6, uPortrait);
      color *= 1.0 + (mix(fine, clump, 0.35) - 0.5) * 0.55 * strength;
      color = mix(color, uRim, step(0.985, fine) * 0.5 * strength);
      alpha -= smoothstep(0.75, 1.0, hash(floor(p * 200.0) + 9.1)) * 0.22 * strength;
    }
    float side = mix(uSafe, 1.0, smoothstep(uFadeFrom, uFadeTo, vU));
    gl_FragColor = vec4(color, alpha * uOpacity * mix(side, ${PORTRAIT_STRENGTH}, uPortrait));
    #include <colorspace_fragment>
  }
`;

export const shadowVertex = /* glsl */ `
  attribute float aAlpha;
  varying float vAlpha;
  varying float vU;
  void main() {
    vAlpha = aAlpha;
    vU = position.x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const shadowFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  uniform float uFade;
  uniform float uSafe;
  uniform float uFadeFrom;
  uniform float uFadeTo;
  uniform float uPortrait;
  varying float vAlpha;
  varying float vU;
  void main() {
    float side = mix(uSafe, 1.0, smoothstep(uFadeFrom, uFadeTo, vU));
    gl_FragColor = vec4(uColor, pow(vAlpha, 1.6) * uStrength * uFade * mix(side, ${PORTRAIT_STRENGTH}, uPortrait));
    #include <colorspace_fragment>
  }
`;
