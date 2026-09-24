import Image from "next/image";
import type { ShowcaseImage } from "./types";

/** One screenshot fills the frame; several become the diagonal slices (same shape as before). */
export function ProjectImages({
  images,
  sizes,
  priority = false,
}: Readonly<{ images: ShowcaseImage[]; sizes: string; priority?: boolean }>) {
  if (images.length === 0)
    return <span aria-hidden="true" className="project-panel block h-full w-full" />;

  if (images.length === 1) {
    const [image] = images;
    return (
      <Image
        src={image.src}
        width={image.width}
        height={image.height}
        alt={image.alt}
        sizes={sizes}
        priority={priority}
        style={{ objectPosition: image.focus }}
        className="h-full w-full object-cover object-center"
      />
    );
  }

  return (
    <span className="flex h-full w-full">
      {images.map((image, index) => (
        <span key={image.src} className="project-slice block min-w-0 flex-1 overflow-hidden">
          <Image
            src={image.src}
            width={image.width}
            height={image.height}
            alt={image.alt}
            sizes={sizes}
            priority={priority && index === 0}
            className="h-full w-full object-cover object-[30%_50%]"
          />
        </span>
      ))}
    </span>
  );
}
