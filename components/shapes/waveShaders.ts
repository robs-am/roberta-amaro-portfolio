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
export const fillFragment = /* glsl */ `
  uniform vec3 uEdge;
  uniform vec3 uDeep;
  uniform vec3 uRim;
  uniform float uOpacity;
  uniform float uSafe;
  uniform float uFadeFrom;
  uniform float uFadeTo;
  uniform float uPortrait;
  varying float vDepth;
  varying float vU;
  void main() {
    vec3 color = mix(uEdge, uDeep, smoothstep(0.0, 0.7, vDepth));
    color = mix(color, uRim, (1.0 - smoothstep(0.0, 0.05, vDepth)) * 0.65);
    float side = mix(uSafe, 1.0, smoothstep(uFadeFrom, uFadeTo, vU));
    gl_FragColor = vec4(color, uOpacity * mix(side, ${PORTRAIT_STRENGTH}, uPortrait));
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
