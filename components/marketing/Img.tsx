"use client";
import Image, { type ImageProps } from "next/image";
import blur from "@/lib/blur-manifest.json";
import { applyOverride } from "@/lib/image-overrides";
import { useImageOverride } from "@/components/marketing/ImageOverrideProvider";
import { useEditMode } from "@/components/marketing/EditModeProvider";

const MANIFEST = blur as Record<string, string>;
const FALLBACK_BLUR =
  "data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAAAQAwCdASoUABQAPxGCuVWsKKWjKAgBgCIJaQDH5BhwXgAA/u8T3uP1gtQAAA==";

export function Img({ src, alt, placeholder, blurDataURL, editKey, style, ...props }: ImageProps & { editKey?: string }) {
  const key = editKey ?? (typeof src === "string" ? src : "");
  const override = useImageOverride(key);
  const { isAdmin, editMode, openEditor } = useEditMode();

  const baseSrc = typeof src === "string" ? src : "";
  const resolved = applyOverride(baseSrc, override);
  const effSrc = typeof src === "string" ? resolved.src : src;
  const effAlt = resolved.alt ?? alt;
  const mergedStyle = { ...resolved.style, ...(style as object) };

  const isSvg = typeof effSrc === "string" && effSrc.toLowerCase().endsWith(".svg");
  const isRemote = typeof effSrc === "string" && /^https?:\/\//.test(effSrc);
  const fill = (props as { fill?: boolean }).fill;
  const img = isSvg ? (
    <Image src={effSrc} alt={effAlt} style={mergedStyle} {...props} />
  ) : (
    <Image
      src={effSrc}
      alt={effAlt}
      placeholder={placeholder ?? "blur"}
      blurDataURL={blurDataURL ?? (typeof effSrc === "string" ? MANIFEST[effSrc] : undefined) ?? FALLBACK_BLUR}
      style={mergedStyle}
      unoptimized={isRemote || undefined}
      {...props}
    />
  );

  if (!(isAdmin && editMode) || !key) return img;
  return (
    <span className={fill ? "group/imgedit absolute inset-0" : "group/imgedit relative block"}>
      {img}
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); openEditor({ key, baseSrc, alt: typeof effAlt === "string" ? effAlt : "" }); }}
        className="absolute right-2 top-2 z-20 rounded-md bg-royal/90 px-2 py-1 text-xs font-semibold text-white opacity-0 shadow-soft transition-opacity group-hover/imgedit:opacity-100"
      >
        Edit
      </button>
    </span>
  );
}
