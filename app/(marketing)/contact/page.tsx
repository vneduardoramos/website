import Image from "next/image";
import { Section } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { ContactForm } from "@/components/marketing/ContactForm";
import { SectionDecor } from "@/components/marketing/Decor";
import { LeadershipStrip } from "@/components/marketing/LeadershipStrip";
import { getSetting } from "@/lib/queries";
import { theme } from "@/config/theme";

export const metadata = {
  title: "Contact: start a data & AI project",
  description:
    "Get in touch with Viewnear, a Snowflake data & AI consultancy serving the Americas.",
  alternates: { canonical: "/contact" },
};

type ContactSetting = { email: string; blurb: string };

const steps = [
  {
    title: "We review your note",
    body: "A consultant on our team reads your message and routes it to the right person.",
  },
  {
    title: "Intro conversation",
    body: "We schedule a short call to understand your goals, data landscape, and timeline.",
  },
  {
    title: "A tailored plan",
    body: "You receive a clear, no-pressure proposal outlining how we would approach the work.",
  },
];

export default async function ContactPage() {
  const contact = await getSetting<ContactSetting>("contact");
  const email = contact?.email ?? theme.brand.email;

  return (
    <>
      <div className="relative overflow-hidden">
        <SectionDecor variant="blobs" />
        <div className="relative">
          <PageHero
            align="left"
            eyebrow={`Contact ${theme.brand.name}`}
            title={
              <>
                Start your Snowflake{" "}
                <span className="text-gradient">data &amp; AI</span> project
              </>
            }
            description={
              contact?.blurb ??
              "Tell us about your data and AI ambitions. Whether you are modernizing on Snowflake or starting from scratch, we are here to help."
            }
          />
        </div>
      </div>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <div>
              <p className="text-sm text-muted">Prefer email?</p>
              <a
                href={`mailto:${email}`}
                className="mt-1 inline-block font-display text-xl font-bold text-accent"
              >
                {email}
              </a>
            </div>

            <div className="relative mt-10 overflow-hidden rounded-2xl border border-border shadow-lg">
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-primary/25 via-transparent to-accent/15" />
              <Image
                src="/assets/images/photos/collaboration.jpg"
                alt="Viewnear consultants collaborating"
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
                A Snowflake consultant replies within one business day.
              </p>
              <ol className="relative mt-6 space-y-6 before:absolute before:left-[15px] before:top-3 before:bottom-3 before:w-px before:bg-border">
                {steps.map((step, i) => (
                  <li key={step.title} className="relative flex gap-4">
                    <span className="relative z-10 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary font-mono text-sm text-primary-fg shadow-md ring-4 ring-background">
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

          <div>
            <div className="mb-5">
              <p className="eyebrow">Verified credentials</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="pill-chip">Snowflake Premier Partner</span>
                <span className="pill-chip">CoCo Catalyst</span>
                <span className="pill-chip">SnowPro-certified</span>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
