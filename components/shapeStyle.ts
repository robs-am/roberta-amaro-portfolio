import {
  AmbientLight,
  Color,
  DirectionalLight,
  MeshPhysicalMaterial,
  type Scene,
} from "three";

// The look shared by the 3D shapes behind the hero and behind the menu: two soft, glossy materials
// (tone 0 and tone 1), three lights, and the colours they take from the theme.

export type ShapeLights = { ambient: AmbientLight; key: DirectionalLight; rim: DirectionalLight };

// `opacity` below 1 makes the shapes translucent, so the page's glow shows through them.
export function createShapeMaterials(opacity = 1) {
  return [0, 1].map(
    () =>
      new MeshPhysicalMaterial({
        roughness: 0.6,
        metalness: 0,
        clearcoat: 0.5,
        clearcoatRoughness: 0.35,
        sheen: 1,
        sheenRoughness: 0.35,
        transparent: opacity < 1,
        opacity,
      }),
  );
}

export function createShapeLights(scene: Scene): ShapeLights {
  const ambient = new AmbientLight(0xffffff, 0.35);
  const key = new DirectionalLight(0xffffff, 2.5);
  key.position.set(-4, 5, 5);
  const rim = new DirectionalLight(0xffffff, 1.5);
  rim.position.set(5, -3, 3);
  scene.add(ambient, key, rim);
  return { ambient, key, rim };
}

// Reads the current theme from the page, so call it once at start and again whenever the theme changes.
export function applyShapeColors(materials: MeshPhysicalMaterial[], { ambient, key, rim }: ShapeLights) {
  const styles = getComputedStyle(document.documentElement);
  const token = (name: string) => new Color(styles.getPropertyValue(name).trim());
  const dark = document.documentElement.classList.contains("dark");
  // On the dark page the surface tokens are nearly the background, so the shapes would vanish:
  // one tone is a neutral stone grey and the other a deeper wine red, so the two read apart (and the
  // pink stays with the text's accent).
  materials[0].color = dark ? new Color(0x9d9797) : token("--glow-2").lerp(new Color(0xd9855f), 0.35);
  materials[1].color = dark ? token("--glow-1").lerp(new Color(0x6b2a35), 0.5) : token("--accent").lerp(new Color(0x5a4652), 0.45);
  // Sheen lifts the grazing edges toward the tone itself, so the rim fades instead of going black.
  materials.forEach((material) => material.sheenColor.copy(material.color).lerp(new Color(0xffffff), dark ? 0.15 : 0.5));
  // The theme's highlight and glow tokens are pink and would tint the stone shape, so on dark the
  // lights are plain white.
  key.color = dark ? new Color(0xffffff) : token("--card");
  rim.color = dark ? new Color(0xf2f2f6) : token("--glow-2");
  ambient.intensity = dark ? 0.8 : 1.0;
  key.intensity = dark ? 2.5 : 1.6;
  rim.intensity = dark ? 1.5 : 0.8;
}
