"use client";
import Image, { type ImageProps } from "next/image";
import blur from "@/lib/blur-manifest.json";
import { applyOverride, isOverrideActive } from "@/lib/image-overrides";
import { useImageOverride } from "@/components/marketing/ImageOverrideProvider";
import { useEditMode } from "@/components/marketing/EditModeProvider";

const MANIFEST = blur as Record<string, string>;
const FALLBACK_BLUR =
  "data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAAAQAwCdASoUABQAPxGCuVWsKKWjKAgBgCIJaQDH5BhwXgAA/u8T3uP1gtQAAA==";

// The public media host (R2/S3), if configured, so remote images from THAT
// host can go through next/image optimization instead of the blanket
// unoptimized bypass. Unset or malformed -> null, which keeps the crash-safe
// all-remote-unoptimized behavior from before.
let MEDIA_HOST: string | null = null;
try {
  MEDIA_HOST = process.env.NEXT_PUBLIC_S3_PUBLIC_URL
    ? new URL(process.env.NEXT_PUBLIC_S3_PUBLIC_URL).hostname
    : null;
} catch {
  MEDIA_HOST = null;
}

export function Img({ src, alt, placeholder, blurDataURL, editKey, style, ...props }: ImageProps & { editKey?: string }) {
  const key = editKey ?? (typeof src === "string" ? src : "");
  const rawOverride = useImageOverride(key);
  // No stable key (e.g. a StaticImport src with no explicit editKey) => no
  // override can apply: neutralize so resolved src/style and `active` stay
  // consistent and we never emit a clip wrapper for a keyless image.
  const override = key ? rawOverride : null;
  const { isAdmin, editMode, openEditor } = useEditMode();

  const baseSrc = typeof src === "string" ? src : "";
  const resolved = applyOverride(baseSrc, override);
  const effSrc = typeof src === "string" ? resolved.src : src;
  const effAlt = resolved.alt ?? alt;
  const mergedStyle = { ...resolved.style, ...(style as object) };

  const isSvg = typeof effSrc === "string" && effSrc.toLowerCase().endsWith(".svg");
  const isRemote = typeof effSrc === "string" && /^https?:\/\//.test(effSrc);
  const fill = (props as { fill?: boolean }).fill;
  // Treat as overlay-positioned (absolute) when the image fills via the `fill`
  // prop OR its className positions it absolutely (e.g. `absolute inset-0
  // h-full w-full`). Such images give a wrapper no intrinsic height, so the
  // wrapper must itself be `absolute inset-0` to avoid collapsing to 0px.
  const cls = typeof (props as { className?: string }).className === "string" ? (props as { className?: string }).className! : "";
  const overlay = Boolean(fill) || /\babsolute\b/.test(cls);
  const active = isOverrideActive(override);
  const img = isSvg ? (
    <Image src={effSrc} alt={effAlt} style={mergedStyle} {...props} />
  ) : (
    <Image
      src={effSrc}
      alt={effAlt}
      placeholder={placeholder ?? "blur"}
      blurDataURL={blurDataURL ?? (typeof effSrc === "string" ? MANIFEST[effSrc] : undefined) ?? FALLBACK_BLUR}
      style={mergedStyle}
      unoptimized={
        (isRemote && (!MEDIA_HOST || new URL(effSrc as string).hostname !== MEDIA_HOST)) || undefined
      }
      {...props}
    />
  );

  const editing = isAdmin && editMode && Boolean(key);

  // CRITICAL: with no active override and not editing, return the bare image so
  // the anonymous / unedited render path stays byte-identical to before.
  if (!active && !editing) return img;

  // A clip wrapper is needed whenever the cropper CSS is applied (so the
  // magnified image is clipped to its slot) and/or while editing (for the Edit
  // button). Make it fill-aware exactly like the original edit wrapper so it
  // never collapses a `fill` image or alters layout for a sized one.
  const wrapperClass = [
    editing ? "group/imgedit" : "",
    overlay ? "absolute inset-0" : "relative block",
    active ? "overflow-hidden" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={wrapperClass}>
      {img}
      {editing && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            const slot = e.currentTarget.parentElement?.getBoundingClientRect();
            openEditor({
              key,
              baseSrc,
              alt: typeof effAlt === "string" ? effAlt : "",
              override: override ?? null,
              slotWidth: slot?.width ?? 0,
              slotHeight: slot?.height ?? 0,
            });
          }}
          className="absolute right-2 top-2 z-20 rounded-md bg-royal/90 px-2 py-1 text-xs font-semibold text-white opacity-0 shadow-soft transition-opacity group-hover/imgedit:opacity-100"
        >
          Edit
        </button>
      )}
    </span>
  );
}
