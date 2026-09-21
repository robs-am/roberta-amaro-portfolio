import { Color, ShaderMaterial, Vector2 } from "three";
import { getTheme } from "@/components/theme/theme";

// The look shared by the 3D shapes behind the hero and behind the menu: soft, translucent forms with a
// colour gradient across them (plum to pink, the page's accent), a gentle shading that only hints at volume
// and a faint glow at the edges. There are no lights and no highlights, so nothing reads as plastic.
// Two tones (0 and 1) differ in where the gradient starts and ends.

// The gradient is fixed to the screen, not to the shape, so it does not spin with the sway: each shape is
// darker toward the lower left and lighter toward the upper right, as if one soft light fell on all of them.
const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec2 vRelative;
  void main() {
    vec4 view = modelViewMatrix * vec4(position, 1.0);
    vec4 center = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    // Position inside the shape, in shape units (about -1..1), in view space.
    vRelative = (view.xy - center.xy) / length(modelViewMatrix[0].xyz);
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * view;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uFrom;
  uniform vec3 uTo;
  uniform vec3 uRim;
  uniform vec2 uDirection;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec2 vRelative;
  void main() {
    float t = smoothstep(-0.9, 0.9, dot(vRelative, uDirection));
    vec3 color = mix(uFrom, uTo, t);
    vec3 normal = normalize(vNormal);
    // Broad, soft shading from the upper left: a hint of volume, never a highlight.
    color *= 0.86 + 0.14 * dot(normal, normalize(vec3(-0.4, 0.6, 0.7)));
    // The silhouette glows a little toward the rim colour.
    float edge = pow(1.0 - abs(normal.z), 2.2);
    color = mix(color, uRim, edge * 0.45);
    gl_FragColor = vec4(color, uOpacity);
    #include <colorspace_fragment>
  }
`;

// `opacity` below 1 makes the shapes translucent, so the page's glow and grain show through them.
export function createShapeMaterials(opacity = 1) {
  return [0, 1].map(() => {
    const material = new ShaderMaterial({
      uniforms: {
        uFrom: { value: new Color() },
        uTo: { value: new Color() },
        uRim: { value: new Color() },
        uDirection: { value: new Vector2(0.8, 0.6).normalize() },
        uOpacity: { value: opacity },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      // Translucent shapes overlap each other and the text column; none should hide what is behind it.
      depthWrite: false,
    });
    material.opacity = opacity;
    return material;
  });
}

/** Sets how opaque a shape is. `opacity` is kept in step because the hover test reads it. */
export function setShapeOpacity(material: ShaderMaterial, opacity: number) {
  material.opacity = opacity;
  material.uniforms.uOpacity.value = opacity;
}

/** Copies the colours of `source` onto `target` (a shape's own clone of a tone's material). */
export function copyShapeColors(target: ShaderMaterial, source: ShaderMaterial) {
  for (const name of ["uFrom", "uTo", "uRim"]) target.uniforms[name].value.copy(source.uniforms[name].value);
}

// Reads the current theme from the page, so call it once at start and again whenever the theme changes.
export function applyShapeColors(materials: ShaderMaterial[]) {
  const styles = getComputedStyle(document.documentElement);
  const token = (name: string) => new Color(styles.getPropertyValue(name).trim());
  const dark = getTheme() === "dark";
  const accent = token("--accent");
  const glow = token("--glow-1");
  const pink = new Color(0xe58aa8);
  // Plum to pink in both themes; the tones differ in how far along that path each one starts and ends.
  const tones = dark
    ? [
        { from: glow.clone().lerp(accent, 0.35), to: accent.clone() },
        { from: glow.clone(), to: accent.clone().lerp(pink, 0.5) },
      ]
    : [
        { from: accent.clone().lerp(pink, 0.3), to: pink.clone().lerp(new Color(0xffffff), 0.35) },
        { from: accent.clone(), to: glow.clone().lerp(pink, 0.5) },
      ];
  materials.forEach((material, index) => {
    const { from, to } = tones[index];
    material.uniforms.uFrom.value.copy(from);
    material.uniforms.uTo.value.copy(to);
    material.uniforms.uRim.value.copy(to).lerp(new Color(0xffffff), dark ? 0.2 : 0.45);
  });
}
