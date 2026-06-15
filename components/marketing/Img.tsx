import Image, { type ImageProps } from "next/image";
import blur from "@/lib/blur-manifest.json";

const MANIFEST = blur as Record<string, string>;

// Neutral surface-toned preview for images not in the manifest (e.g. just
// added, before `npm run blur` is re-run): they still fade in from this wash
// instead of popping. Regenerate the manifest to give them a real preview.
const FALLBACK_BLUR =
  "data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAAAQAwCdASoUABQAPxGCuVWsKKWjKAgBgCIJaQDH5BhwXgAA/u8T3uP1gtQAAA==";

/**
 * Drop-in next/image replacement that always renders a blur-up placeholder, so
 * images sharpen into place instead of popping in once they load. Path-based
 * images get their preview from lib/blur-manifest.json (regenerate with
 * `npm run blur`); unknown paths fall back to a neutral wash. SVGs pass straight
 * through, since next/image rejects blur placeholders on SVG.
 */
export function Img({ src, alt, placeholder, blurDataURL, ...props }: ImageProps) {
  const key = typeof src === "string" ? src : undefined;
  if (key && key.toLowerCase().endsWith(".svg")) {
    return <Image src={src} alt={alt} {...props} />;
  }
  return (
    <Image
      src={src}
      alt={alt}
      placeholder={placeholder ?? "blur"}
      blurDataURL={blurDataURL ?? (key ? MANIFEST[key] : undefined) ?? FALLBACK_BLUR}
      {...props}
    />
  );
}
