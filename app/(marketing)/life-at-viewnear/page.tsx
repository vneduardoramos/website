import { Fragment } from "react";
import { pageMeta } from "@/lib/seo";
import { Img as Image } from "@/components/marketing/Img";
import Link from "next/link";
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

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Life at Viewnear",
  description:
    "Outcome-led, AI-native, team-powered: how we work at Viewnear, what we stand for, and the benefits behind it, from healthcare to emotional wellness.",
  path: "/life-at-viewnear",
});

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

/* ---- Content ---- */
const offices = [
  {
    city: "Austin",
    region: "Texas, USA",
    flag: "🇺🇸",
    place: "Quarry Oaks II · Stonelake Office Park",
    building: "/assets/images/life/austin-building.jpg",
    image: "/assets/images/life/austin.jpg",
    alt: "Viewnear's Austin home: a glass office tower in Stonelake Office Park, set against the downtown Austin skyline",
    street: "10900 Stonelake Blvd, Bldg 2, Suite 100",
    cityZip: "Austin, TX 78759",
    // building left, city (skyline) right
    flip: false,
    cityPosition: "center",
  },
  {
    city: "Monterrey",
    region: "Nuevo León, México",
    flag: "🇲🇽",
    place: "Pueblo Serena",
    building: "/assets/images/life/monterrey-building.jpg",
    image: "/assets/images/life/monterrey.jpg",
    alt: "Viewnear's Monterrey home: a modern office building at Pueblo Serena, at the foot of the Sierra Madre",
    street: "Carr. Nacional 500, Valle Alto",
    cityZip: "Monterrey, MX 64983",
    // flipped: city (Cerro de la Silla) left, building right; framed right so the full saddle shows
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

// Real moments from the team: Snowflake events, the booth, and the dinners in between.
const moments = [
  {
    src: "/assets/images/life/team-group.jpg",
    w: 1700,
    h: 1275,
    caption: "Customer conversations at the booth",
    alt: "The Viewnear team behind their data + ai booth at a Snowflake event",
  },
  {
    src: "/assets/images/life/team-booth.jpg",
    w: 1700,
    h: 1275,
    caption: "A full house at the live demo",
    alt: "A crowd gathered around the Viewnear booth watching a live product demo",
  },
  {
    src: "/assets/images/life/team-breakfast.jpg",
    w: 1700,
    h: 1275,
    caption: "Team breakfast on the road",
    alt: "Viewnear team members sharing breakfast at a Snowflake event",
  },
  {
    src: "/assets/images/life/team-stage.jpg",
    w: 1275,
    h: 1700,
    caption: "Snowflake Data for Breakfast",
    alt: "A Viewnear team member at the Snowflake Data for Breakfast welcome signage",
  },
  {
    src: "/assets/images/life/team-dinner.jpg",
    w: 1700,
    h: 1275,
    caption: "Dinner with the team",
    alt: "The Viewnear team and partners gathered for a team dinner",
  },
  {
    src: "/assets/images/life/partner-momentum.jpg",
    w: 1700,
    h: 1275,
    caption: "Among Snowflake's CoCo partners",
    alt: "Snowflake CoCo Global Partner Momentum wall listing Viewnear among Snowflake partners",
  },
];

const model = [
  {
    icon: "target" as const,
    title: "Outcomes first",
    body: "We organize our work around measurable business outcomes, not activity. Success is defined by client impact, quality, and trust, not hours logged.",
  },
  {
    icon: "sparkles" as const,
    title: "AI-native delivery",
    body: "AI is embedded in how we work: our operating model, our tooling, our delivery rhythm. AI-native execution plus human judgment means one team ships more work in parallel, with the same people owning it throughout.",
  },
  {
    icon: "users" as const,
    title: "One team, flexible capacity",
    body: "We collaborate in person often, because shared time strengthens alignment, trust, and execution. We believe in remote work, but not remote-first. Our model is remote-augmented: anchored by in-person collaboration, extended by flexibility.",
  },
];

const meaning = [
  {
    icon: "trendingUp" as const,
    title: "Growth",
    body: "Meaningful work that expands your learning, business context, and technical range.",
    tint: "bg-primary/15 text-primaryDeep",
  },
  {
    icon: "target" as const,
    title: "Focus",
    body: "Less repetitive work, more time on judgment, delivery, and leadership.",
    tint: "bg-primary/15 text-primaryDeep",
  },
  {
    icon: "scale" as const,
    title: "Balance",
    body: "Great work over the long run requires recovery. Time off is flexible (no fixed cap) provided outcomes stay strong and teams stay covered.",
    tint: "bg-primary/15 text-primaryDeep",
  },
  {
    icon: "award" as const,
    title: "Rewards",
    body: "Stronger economics fund better compensation, bonuses, and benefits.",
    tint: "bg-amber/15 text-amber",
  },
  {
    icon: "heart" as const,
    title: "Pride",
    body: "Hard problems, real ownership, and work you can put your name on.",
    tint: "bg-primary/15 text-primaryDeep",
  },
];

const standApart = [
  {
    icon: "users" as const,
    text: "Collaboration is real: teams work together in person and remotely, with shared accountability for outcomes.",
  },
];

const flywheel = [
  { icon: "target" as const, label: "Outcomes" },
  { icon: "sparkles" as const, label: "Higher-value work" },
  { icon: "refresh" as const, label: "Reinvestment" },
  { icon: "users" as const, label: "Stronger team" },
  { icon: "trendingUp" as const, label: "Better outcomes" },
];

export default async function LifeAtViewnearPage() {
  const openings = await getJobOpenings();

  return (
    <>
      <JsonLd data={OFFICES_LD} />
      {/* HERO */}
      <PageHero
        eyebrow="Careers · Culture"
        title={
          <>
            Building the{" "}
            <span className="text-gradient">data &amp; AI home team</span> for the Americas.
          </>
        }
        description={`${theme.brand.name} is outcome-led, AI-native, and built around one team that shares in every win. Here's how we work, what we stand for, and the benefits behind it.`}
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="#open-roles" className="btn-primary btn-lg">
            See open roles
          </Link>
          <Link href="/about#team" className="btn-ghost btn-lg">
            Meet the team
          </Link>
        </div>
      </PageHero>

      {/* OUR OFFICES - two HQs */}
      <Section className="section-tint relative overflow-hidden">
        <SectionDecor variant="dots" />
        <div className="relative">
          <SectionHeading
            eyebrow="Our offices"
            title="Two homes. One team."
            intro="We're headquartered in Austin and Monterrey: two flagship spaces that anchor a team working across the Americas, in person and remote-augmented."
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
            <p className="eyebrow mb-3">Where we work</p>
            <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Two hubs for coming together, flexibility for everything else.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Inside, our offices are made for focus and for coming together: quiet corners for deep
              work, open lounges for the conversations that move projects forward. We gather in
              person because shared time builds the trust and alignment behind every outcome, and we
              stay flexible so life and great work can coexist.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Flexible, modern offices designed for focus and collaboration",
                "In-person collaboration, extended by remote flexibility",
                "Regular time together: retreats, Snowflake events, and team dinners",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-foreground/85">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primaryDeep">
                    <Ico name="check" className="h-3.5 w-3.5" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border shadow-soft-lg">
            <Image
              src="/assets/images/life/lounge.jpg"
              alt="Inside a Viewnear office: an open lounge and work area with sofas, plants, a café bar, and wood-lined meeting rooms"
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
            eyebrow="The Viewnear model"
            title="Outcome-led. AI-native. Team-powered."
            intro="We deliver outcomes, expand leverage through AI-native execution, and operate as one team with shared accountability."
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
                    Step {i + 1}
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
            eyebrow="Out in the field"
            title="Where we show up"
            intro="Snowflake Summit, Data for Breakfast, partner stages, and the dinners in between. A few moments from the team."
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
              <p className="eyebrow mb-2">The Viewnear standard</p>
              <p className="font-display text-2xl font-bold leading-snug text-foreground md:text-3xl">
                High standards are mutual. We ask a lot of our team, and our team should expect
                just as much from Viewnear.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* WHAT THIS MEANS FOR YOU */}
      <Section className="section-tint">
        <SectionHeading
          eyebrow="What this means for you"
          title="A better model is a better place to work"
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
          eyebrow="Benefits"
          title="We reinvest in the team"
          intro="Better outcomes create stronger economics, and we put those economics back into the people who deliver them. Healthcare, dental, emotional wellness, and more."
        />
        <BenefitsGrid items={BENEFITS} className="mt-12" />
      </Section>

      {/* WHY VIEWNEAR STANDS APART + FLYWHEEL */}
      <Section className="section-warm relative overflow-hidden">
        <SectionDecor variant="flow" />
        <div className="relative">
          <SectionHeading
            eyebrow="Why Viewnear stands apart"
            title="A win for one is a win for all"
            intro="Stronger economics build a stronger team, and a stronger team delivers better outcomes. It's a flywheel, and everyone shares in it."
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
          eyebrow="Open roles"
          title="Current openings"
          intro="If you do not see a perfect fit, we still want to hear from you."
        />
        {openings.length === 0 ? (
          <p className="mt-8 text-muted">
            No open roles right now, but we are always meeting great people. Reach out below.
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
                  foot={job.location ? ["Location", job.location] : undefined}
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
                      View role &amp; apply
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
            title="Not sure which role fits? Tell us how you can help."
            href="#apply"
            label="Apply now"
          />
        </div>
      </Section>

      {/* APPLY */}
      <Section id="apply" className="section-tint">
        <SectionHeading
          eyebrow="Apply"
          title="Tell us about you"
          intro="Send your details and the role you are interested in. We read every application."
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
              Start with outcomes. Build the team that delivers them.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted">
              If you want meaningful work, peers who push your craft, and a young firm you can help shape, let&apos;s talk.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="#open-roles" className="btn-primary btn-lg">
                See open roles
              </Link>
              <Link href="/contact" className="btn-ghost btn-lg">
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
