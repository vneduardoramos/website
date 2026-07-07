import { Img as Image } from "@/components/marketing/Img";
import { pageMeta } from "@/lib/seo";
import { Section } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { ContactForm } from "@/components/marketing/ContactForm";
import { SectionDecor } from "@/components/marketing/Decor";
import { SnowflakeLockup } from "@/components/marketing/SnowflakeLockup";
import { LeadershipStrip } from "@/components/marketing/LeadershipStrip";
import { getSetting, getTeam } from "@/lib/queries";
import { theme } from "@/config/theme";

export const metadata = pageMeta({
  title: "Contact: start your data & AI practice",
  description:
    "Get in touch with Viewnear. We help enterprises stand up data & AI practices on Snowflake, run by their own teams, across the Americas.",
  path: "/contact",
});

type ContactSetting = { email: string; blurb: string };

const steps = [
  {
    title: "We review your note",
    body: "An architect on our team reads your message and routes it to the right person.",
  },
  {
    title: "Intro conversation",
    body: "We schedule a short call to understand your goals, data landscape, and timeline.",
  },
  {
    title: "A tailored plan",
    body: "You receive a clear, no-pressure proposal: the first use cases, a sprint-by-sprint plan, and the enablement your team gets from day one.",
  },
];

// Both offices, exactly as listed on /life-at-viewnear.
const offices = ["Austin, TX · 10900 Stonelake Blvd", "Monterrey, MX · Valle Alto"];

export default async function ContactPage() {
  const [contact, team] = await Promise.all([
    getSetting<ContactSetting>("contact"),
    getTeam(),
  ]);
  const email = contact?.email ?? theme.brand.email;
  // First published member with a booking link, if any (none seeded today:
  // the block below renders nothing until a bookingUrl lands in the CMS).
  const bookingUrl = team.find((m) => m.bookingUrl)?.bookingUrl;

  return (
    <>
      <div className="relative overflow-hidden">
        <SectionDecor variant="blobs" />
        <div className="relative">
          <PageHero
            eyebrow={`Contact ${theme.brand.name}`}
            title={
              <>
                Start your <span className="text-gradient">data &amp; AI</span>{" "}
                practice
              </>
            }
            description={
              contact?.blurb ??
              "Tell us about your data & AI ambitions. Whether you are modernizing on Snowflake or starting from scratch, we'll map the fastest path to governed, AI-ready data."
            }
          />
        </div>
      </div>

      <Section className="section-warm">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="order-2 lg:order-1">
            <div>
              <p className="text-sm text-muted">Prefer email?</p>
              <a
                href={`mailto:${email}`}
                className="mt-1 inline-block font-display text-xl font-bold text-primaryDeep"
              >
                {email}
              </a>
            </div>

            <div className="relative mt-10 overflow-hidden rounded-2xl border border-border shadow-lg">
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-primary/25 via-transparent to-accent/15" />
              <Image
                src="/assets/images/photos/contact-handshake.jpg"
                alt="A warm handshake welcoming a new Viewnear client"
                width={720}
                height={480}
                className="aspect-[3/2] w-full object-cover"
              />
            </div>

            <div className="mt-12">
              <h2 className="font-display text-lg font-bold text-foreground">
                What happens next
              </h2>
              <p className="mt-2 text-sm text-muted">
                An architect replies within one business day.
              </p>
              <ol className="relative mt-6 space-y-6 before:absolute before:left-[15px] before:top-3 before:bottom-3 before:w-px before:bg-border">
                {steps.map((step, i) => (
                  <li key={step.title} className="relative flex gap-4">
                    <span className="relative z-10 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primaryDeep font-mono text-sm text-primary-fg shadow-md ring-4 ring-background">
                      {i + 1}
                    </span>
                    <div className="pt-1">
                      <h3 className="font-semibold text-foreground">{step.title}</h3>
                      <p className="mt-1 text-sm text-muted">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <LeadershipStrip label="The team that picks up your project." className="mt-8" />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="mb-5">
              <p className="eyebrow">Verified credentials</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="pill-chip">Snowflake Premier Partner</span>
                <span className="pill-chip">CoCo Preferred Partner</span>
                <span className="pill-chip">SnowPro-certified</span>
              </div>
              <SnowflakeLockup variant="default" height={26} className="mt-5" />
              <div className="mt-5 flex flex-wrap gap-2">
                {offices.map((o) => (
                  <span
                    key={o}
                    className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 font-mono text-[0.66rem] tracking-wide text-muted"
                  >
                    {o}
                  </span>
                ))}
              </div>
            </div>
            <ContactForm />
            {bookingUrl && (
              <p className="mt-6 text-sm text-muted">
                Prefer to skip the form?{" "}
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primaryDeep underline-offset-4 hover:underline"
                >
                  Book 30 minutes with an architect &rarr;
                </a>
              </p>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
