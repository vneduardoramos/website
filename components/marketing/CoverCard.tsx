import { getTranslations } from "next-intl/server";
import { Img as Image } from "@/components/marketing/Img";
import { Link } from "@/i18n/navigation";

/**
 * Cover-image card for blog posts, news, case studies, industries. When `image`
 * is missing it renders an on-brand gradient placeholder (deterministic per
 * title) so cards always look intentional. `featured` renders a larger,
 * horizontal hero treatment.
 */

// deterministic gradient pick from the title so placeholders vary but stay on-brand
const GRADIENTS = [
  "from-primary/80 via-primary to-secondary/90",
  "from-secondary/80 via-primary to-accent/70",
  "from-primary via-secondary to-cyan/80",
  "from-accent/70 via-primary to-secondary",
  "from-purple/70 via-primary to-secondary/90",
];
function pickGradient(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

function Placeholder({ kicker, seed }: { kicker?: string; seed: string }) {
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center bg-gradient-to-br ${pickGradient(
        seed
      )}`}
    >
      {/* faint wave motif */}
      <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 400 240" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,150 C100,110 180,180 260,150 C330,124 370,110 400,130 L400,240 L0,240 Z" fill="white" fillOpacity="0.18" />
        <path d="M-10,120 C90,80 180,150 270,110 C340,80 380,70 410,95" stroke="white" strokeOpacity="0.35" strokeWidth="2" fill="none" />
      </svg>
      <span className="relative font-display text-sm font-bold uppercase tracking-[0.18em] text-white/90">
        {kicker || "Viewnear"}
      </span>
    </div>
  );
}

export async function CoverCard({
  href,
  image,
  imageAlt = "",
  kicker,
  title,
  excerpt,
  meta,
  author,
  chip,
  featured = false,
}: {
  href: string;
  image?: string | null;
  imageAlt?: string;
  kicker?: string;
  title: string;
  excerpt?: string | null;
  meta?: string;
  author?: { name: string; photo?: string | null };
  /**
   * A quiet line naming what the work was built on, for case studies. One of
   * the low-weight places the two partners are stated; it sits below the
   * excerpt so it never competes with the kicker.
   */
  chip?: string;
  featured?: boolean;
}) {
  const t = await getTranslations("sharedUi");
  // Fall back to the title when no explicit alt is given, so covers are never
  // announced with an empty alt. The Img wrapper renders remote covers through
  // next/image: images from the configured media host (NEXT_PUBLIC_S3_PUBLIC_URL)
  // are optimized via remotePatterns; any other remote host falls back to
  // `unoptimized`. Either way covers get lazy-loading, a blur placeholder, and
  // a reserved box.
  const alt = imageAlt || title;
  const media = (
    <div className={`relative overflow-hidden ${featured ? "h-full min-h-[260px]" : "aspect-[16/10]"}`}>
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-deep/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {image ? (
        <Image
          src={image}
          alt={alt}
          fill
          sizes={featured ? "(max-width:768px) 100vw, 50vw" : "(max-width:768px) 100vw, 33vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <Placeholder kicker={kicker} seed={title} />
      )}
    </div>
  );

  const bodyBlock = (
    <div className={`flex flex-1 flex-col ${featured ? "p-8 md:p-10" : "p-6"}`}>
      {kicker && (
        <span className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-primaryDeep">
          {kicker}
        </span>
      )}
      <h3
        className={`font-display font-bold tracking-tight text-foreground ${
          featured ? "text-2xl md:text-3xl" : "text-lg line-clamp-2"
        }`}
      >
        {title}
      </h3>
      {excerpt && (
        <p className={`mt-2 text-muted ${featured ? "text-base" : "line-clamp-3 text-sm"}`}>
          {excerpt}
        </p>
      )}
      {author ? (
        <div className="mt-4 flex items-center gap-2 text-xs text-muted">
          {author.photo ? (
            <Image
              src={author.photo}
              alt={author.name}
              width={24}
              height={24}
              sizes="24px"
              className="h-6 w-6 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface2 font-display text-[10px] font-bold uppercase text-muted">
              {author.name.charAt(0)}
            </span>
          )}
          <span className="font-medium text-foreground">{author.name}</span>
          {meta && (
            <>
              <span aria-hidden>·</span>
              <span>{meta}</span>
            </>
          )}
        </div>
      ) : (
        meta && <p className="mt-4 text-xs text-muted">{meta}</p>
      )}
      {chip && (
        <span className="mt-4 font-mono text-xs uppercase tracking-widest text-muted">{chip}</span>
      )}
      <span className="mt-auto pt-4 inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep">
        {t("coverCard.readMore")}
        <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </div>
  );

  return (
    <Link
      href={href}
      className={`group flex h-full overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft-lg ${
        featured ? "flex-col md:grid md:grid-cols-2 md:items-stretch" : "flex-col"
      }`}
    >
      {media}
      {bodyBlock}
    </Link>
  );
}
