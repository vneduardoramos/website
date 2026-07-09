import { Fragment } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { Img as Image } from "@/components/marketing/Img";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeading, Pill } from "@/components/marketing/ui";
import { LedgerCard } from "@/components/marketing/Cards";
import { InlineCta } from "@/components/marketing/Blocks";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { ApplicationForm } from "@/components/marketing/ApplicationForm";
import { getJobOpenings } from "@/lib/queries";
import { BENEFITS } from "@/lib/benefits";
import { BenefitsGrid } from "@/components/marketing/BenefitsGrid";
import { asStringArray } from "@/lib/utils";
import { theme } from "@/config/theme";
import { JsonLd } from "@/components/JsonLd";
import type { Locale } from "@/lib/i18n-content";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "lifeAtViewnear.meta" });
  return pageMeta({ title: t("title"), description: t("description"), path: "/life-at-viewnear", locale });
}

/* ---- Inline icon set (Lucide-style strokes) ---- */
const PATHS: Record<string, React.ReactNode> = {
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" />
    </>
  ),
  sparkles: (
    <path d="M12 3l1.8 4.7L18.5 9l-4.7 1.3L12 15l-1.8-4.7L5.5 9l4.7-1.3L12 3z" />
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
      <path d="M16 3.1a4 4 0 0 1 0 7.8" />
    </>
  ),
  trendingUp: (
    <>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </>
  ),
  scale: (
    <>
      <path d="M12 3v18" />
      <path d="M5 7h14" />
      <path d="M5 7l-3 6a3 3 0 0 0 6 0z" />
      <path d="M19 7l-3 6a3 3 0 0 0 6 0z" />
      <path d="M8 21h8" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="8" r="5" />
      <path d="M8.5 12.5 7 21l5-3 5 3-1.5-8.5" />
    </>
  ),
  heart: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
  ),
  shieldPlus: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 8v6" />
      <path d="M9 11h6" />
    </>
  ),
  smile: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9.5" x2="9.01" y2="9.5" />
      <line x1="15" y1="9.5" x2="15.01" y2="9.5" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  dollar: (
    <>
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </>
  ),
  cap: (
    <>
      <path d="M22 9 12 5 2 9l10 4 10-4z" />
      <path d="M6 10.6V16c0 1.1 2.7 2 6 2s6-.9 6-2v-5.4" />
    </>
  ),
  mountain: <path d="m8 3 4 8 5-5 5 14H2L8 3z" />,
  trophy: (
    <>
      <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4z" />
      <path d="M5 4H3v2a3 3 0 0 0 3 3M19 4h2v2a3 3 0 0 1-3 3" />
    </>
  ),
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  refresh: (
    <>
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 21v-5h5" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
};

function Ico({ name, className = "h-6 w-6" }: { name: keyof typeof PATHS; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

/* ---- Content (structural: image paths + layout; copy lives in messages) ---- */
// building left, city (skyline) right for Austin; flipped for Monterrey so the
// full Cerro de la Silla saddle shows on the right.
const officeAssets = [
  {
    flag: "🇺🇸",
    building: "/assets/images/life/austin-building.jpg",
    image: "/assets/images/life/austin.jpg",
    flip: false,
    cityPosition: "center",
  },
  {
    flag: "🇲🇽",
    building: "/assets/images/life/monterrey-building.jpg",
    image: "/assets/images/life/monterrey.jpg",
    flip: true,
    cityPosition: "right",
  },
];

// Diagonal halves of an office card; the divider runs from 58% (top) to 42% (bottom).
const LEFT_CLIP = "polygon(0 0, 58% 0, 42% 100%, 0 100%)";
const RIGHT_CLIP = "polygon(58% 0, 100% 0, 100% 100%, 42% 100%)";

// LocalBusiness structured data for the two offices (helps local SEO + AI engines).
const OFFICES_LD = [
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: theme.brand.name,
    url: theme.brand.url,
    parentOrganization: { "@type": "Organization", name: theme.brand.name, url: theme.brand.url },
    areaServed: "Americas",
    address: {
      "@type": "PostalAddress",
      streetAddress: "10900 Stonelake Blvd, Bldg 2, Suite 100",
      addressLocality: "Austin",
      addressRegion: "TX",
      postalCode: "78759",
      addressCountry: "US",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: theme.brand.name,
    url: theme.brand.url,
    parentOrganization: { "@type": "Organization", name: theme.brand.name, url: theme.brand.url },
    areaServed: "Americas",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Carr. Nacional 500, Valle Alto",
      addressLocality: "Monterrey",
      addressRegion: "NL",
      postalCode: "64983",
      addressCountry: "MX",
    },
  },
];

// Real moments from the team: Snowflake events, the booth, and the dinners in
// between. Image assets here; captions + alt text live in messages.
const momentAssets = [
  { src: "/assets/images/life/team-group.jpg", w: 1700, h: 1275 },
  { src: "/assets/images/life/team-booth.jpg", w: 1700, h: 1275 },
  { src: "/assets/images/life/team-breakfast.jpg", w: 1700, h: 1275 },
  { src: "/assets/images/life/team-stage.jpg", w: 1275, h: 1700 },
  { src: "/assets/images/life/team-dinner.jpg", w: 1700, h: 1275 },
  { src: "/assets/images/life/partner-momentum.jpg", w: 1700, h: 1275 },
];

// Icon + tint assignments per content block; the copy is read from messages by index.
const modelIcons = ["target", "sparkles", "users"] as const;

const meaningStyles = [
  { icon: "trendingUp", tint: "bg-primary/15 text-primaryDeep" },
  { icon: "target", tint: "bg-primary/15 text-primaryDeep" },
  { icon: "scale", tint: "bg-primary/15 text-primaryDeep" },
  { icon: "award", tint: "bg-amber/15 text-amber" },
  { icon: "heart", tint: "bg-primary/15 text-primaryDeep" },
] as const;

const standApartIcons = ["users"] as const;

const flywheelIcons = ["target", "sparkles", "refresh", "users", "trendingUp"] as const;

export default async function LifeAtViewnearPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("lifeAtViewnear");
  const openings = await getJobOpenings(locale as Locale);

  const offices = (
    t.raw("offices.items") as {
      city: string;
      region: string;
      place: string;
      alt: string;
      street: string;
      cityZip: string;
    }[]
  ).map((o, i) => ({ ...o, ...officeAssets[i] }));

  const moments = (t.raw("field.moments") as { caption: string; alt: string }[]).map(
    (m, i) => ({ ...m, ...momentAssets[i] }),
  );

  const model = (t.raw("model.items") as { title: string; body: string }[]).map(
    (m, i) => ({ ...m, icon: modelIcons[i] }),
  );

  const meaning = (t.raw("meaning.items") as { title: string; body: string }[]).map(
    (m, i) => ({ ...m, ...meaningStyles[i] }),
  );

  const standApart = (t.raw("standApart.items") as string[]).map((text, i) => ({
    text,
    icon: standApartIcons[i],
  }));

  const flywheel = (t.raw("standApart.flywheel") as string[]).map((label, i) => ({
    label,
    icon: flywheelIcons[i],
  }));

  return (
    <>
      <JsonLd data={OFFICES_LD} />
      {/* HERO */}
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t.rich("hero.title", { hl: (c) => <span className="text-gradient">{c}</span> })}
        description={t("hero.description")}
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="#open-roles" className="btn-primary btn-lg">
            {t("hero.seeRoles")}
          </Link>
          <Link href="/about#team" className="btn-ghost btn-lg">
            {t("hero.meetTeam")}
          </Link>
        </div>
      </PageHero>

      {/* OUR OFFICES - two HQs */}
      <Section className="section-tint relative overflow-hidden">
        <SectionDecor variant="dots" />
        <div className="relative">
          <SectionHeading
            eyebrow={t("offices.eyebrow")}
            title={t("offices.title")}
            intro={t("offices.intro")}
            center
          />
          <div className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2">
            {offices.map((o) => (
              <figure
                key={o.city}
                className="group relative overflow-hidden rounded-2xl border border-border shadow-soft-lg"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  {/* office building + its city, split by a diagonal divider (city on the side that shows its best view) */}
                  <Image
                    src={o.building}
                    alt=""
                    aria-hidden
                    fill
                    className="object-cover"
                    style={{ clipPath: o.flip ? RIGHT_CLIP : LEFT_CLIP }}
                    sizes="(min-width: 768px) 25vw, 50vw"
                  />
                  <Image
                    src={o.image}
                    alt={o.alt}
                    fill
                    className="object-cover"
                    style={{ clipPath: o.flip ? LEFT_CLIP : RIGHT_CLIP, objectPosition: o.cityPosition }}
                    sizes="(min-width: 768px) 25vw, 50vw"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(0deg, rgb(var(--color-foreground) / 0.85) 0%, rgb(var(--color-foreground) / 0.15) 45%, transparent 70%)",
                    }}
                  />
                  {/* the diagonal divider line itself */}
                  <svg
                    aria-hidden
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <line
                      x1="58"
                      y1="0"
                      x2="42"
                      y2="100"
                      stroke="white"
                      strokeWidth={2.5}
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/70">
                    {o.flag} {o.region}
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold text-white">{o.city}</p>
                  <p className="mt-1 text-sm text-white/85">{o.place}</p>
                  <p className="mt-1 text-xs leading-snug text-white/70">{o.street}</p>
                  <p className="text-xs leading-snug text-white/70">{o.cityZip}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* WHERE WE WORK + INTRO */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow mb-3">{t("whereWeWork.eyebrow")}</p>
            <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t("whereWeWork.title")}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {t("whereWeWork.body")}
            </p>
            <ul className="mt-6 space-y-3">
              {(t.raw("whereWeWork.bullets") as string[]).map((bullet) => (
                <li key={bullet} className="flex gap-3 text-foreground/85">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primaryDeep">
                    <Ico name="check" className="h-3.5 w-3.5" />
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border shadow-soft-lg">
            <Image
              src="/assets/images/life/lounge.jpg"
              alt={t("whereWeWork.imageAlt")}
              width={1500}
              height={1023}
              className="h-auto w-full"
              sizes="(min-width: 1024px) 560px, 100vw"
            />
          </div>
        </div>
      </Section>

      {/* THE VIEWNEAR MODEL */}
      <Section className="section-warm relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <SectionHeading
            eyebrow={t("model.eyebrow")}
            title={t("model.title")}
            intro={t("model.intro")}
            center
          />
          <div className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-3">
            {model.map((m, i) => (
              <div key={m.title} className="card flex h-full flex-col">
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                      i === 0 ? "bg-primaryDeep text-white" : "bg-primary/15 text-primaryDeep"
                    }`}
                  >
                    <Ico name={m.icon} />
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                    {t("model.stepLabel")} {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-foreground">{m.title}</h3>
                <p className="mt-3 text-muted">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* OUT IN THE FIELD - real team & event photos */}
      <Section className="relative overflow-hidden">
        <SectionDecor variant="dots" />
        <div className="relative">
          <SectionHeading
            eyebrow={t("field.eyebrow")}
            title={t("field.title")}
            intro={t("field.intro")}
            center
          />
          <div className="mt-12 gap-4 sm:columns-2 lg:columns-3">
            {moments.map((m) => (
              <figure
                key={m.src}
                className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border shadow-soft"
              >
                <Image
                  src={m.src}
                  alt={m.alt}
                  width={m.w}
                  height={m.h}
                  className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.04]"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-1 p-4 text-sm font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {m.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Section>

      {/* THE VIEWNEAR STANDARD - dark band */}
      <Section>
        <div className="panel-dark relative overflow-hidden rounded-3xl p-10 shadow-xl md:p-14">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber/20 blur-3xl" />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-8">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-amber/15 text-amber">
              <Ico name="trophy" className="h-8 w-8" />
            </span>
            <div>
              <p className="eyebrow mb-2">{t("standard.eyebrow")}</p>
              <p className="font-display text-2xl font-bold leading-snug text-foreground md:text-3xl">
                {t("standard.body")}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* WHAT IT MEANS FOR THE TEAM */}
      <Section className="section-tint">
        <SectionHeading
          eyebrow={t("meaning.eyebrow")}
          title={t("meaning.title")}
          center
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 md:auto-rows-fr lg:grid-cols-5">
          {meaning.map((m) => (
            <div key={m.title} className="card flex h-full flex-col text-center">
              <span className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${m.tint}`}>
                <Ico name={m.icon} />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{m.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* BENEFITS */}
      <Section>
        <SectionHeading
          eyebrow={t("benefits.eyebrow")}
          title={t("benefits.title")}
          intro={t("benefits.intro")}
        />
        <BenefitsGrid items={BENEFITS} className="mt-12" />
      </Section>

      {/* WHY VIEWNEAR STANDS APART + FLYWHEEL */}
      <Section className="section-warm relative overflow-hidden">
        <SectionDecor variant="flow" />
        <div className="relative">
          <SectionHeading
            eyebrow={t("standApart.eyebrow")}
            title={t("standApart.title")}
            intro={t("standApart.intro")}
          />

          <div className="mt-10 grid gap-6">
            {standApart.map((s) => (
              <div key={s.text} className="card flex h-full items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primaryDeep">
                  <Ico name={s.icon} className="h-5 w-5" />
                </span>
                <p className="text-foreground/85">{s.text}</p>
              </div>
            ))}
          </div>

          {/* Flywheel */}
          <div className="mt-14">
            <ol className="flex flex-col items-stretch gap-2 md:flex-row md:items-start md:justify-center md:gap-3">
              {flywheel.map((f, i) => (
                <Fragment key={f.label}>
                  <li className="flex items-center gap-4 md:w-28 md:flex-col md:gap-3 md:text-center">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border bg-background text-primaryDeep shadow-soft">
                      <Ico name={f.icon} />
                    </span>
                    <span className="font-display text-sm font-semibold text-foreground">
                      {f.label}
                    </span>
                  </li>
                  {i < flywheel.length - 1 && (
                    <span
                      className="flex justify-center pl-6 text-primary md:pl-0 md:pt-[18px]"
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5 rotate-90 md:rotate-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  )}
                </Fragment>
              ))}
            </ol>
          </div>
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* OPEN ROLES */}
      <Section id="open-roles">
        <SectionHeading
          eyebrow={t("openRoles.eyebrow")}
          title={t("openRoles.title")}
          intro={t("openRoles.intro")}
        />
        {openings.length === 0 ? (
          <p className="mt-8 text-muted">
            {t("openRoles.empty")}
          </p>
        ) : (
          <div className="mt-12 grid gap-5">
            {openings.map((job) => {
              const skills = asStringArray(job.skills);
              return (
                <LedgerCard
                  key={job.slug}
                  eyebrow={job.employment}
                  title={job.title}
                  foot={job.location ? [t("openRoles.locationLabel"), job.location] : undefined}
                >
                  <p>{job.description}</p>
                  {skills.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {skills.map((s) => (
                        <Pill key={s}>{s}</Pill>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-5">
                    <Link
                      href={`/careers/${job.slug}`}
                      className="inline-flex items-center gap-1 font-semibold text-primaryDeep"
                    >
                      {t("openRoles.viewRole")}
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </LedgerCard>
              );
            })}
          </div>
        )}
        <div className="mt-12">
          <InlineCta
            title={t("openRoles.ctaTitle")}
            href="#apply"
            label={t("openRoles.ctaLabel")}
          />
        </div>
      </Section>

      {/* APPLY */}
      <Section id="apply" className="section-tint">
        <SectionHeading
          eyebrow={t("apply.eyebrow")}
          title={t("apply.title")}
          intro={t("apply.intro")}
        />
        <div className="mx-auto mt-12 max-w-2xl">
          <ApplicationForm />
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="panel-dark relative overflow-hidden rounded-3xl p-10 text-center shadow-soft md:p-16">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-secondary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t("cta.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted">
              {t("cta.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="#open-roles" className="btn-primary btn-lg">
                {t("cta.seeRoles")}
              </Link>
              <Link href="/contact" className="btn-ghost btn-lg">
                {t("cta.getInTouch")}
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
