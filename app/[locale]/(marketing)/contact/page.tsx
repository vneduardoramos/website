import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Img as Image } from "@/components/marketing/Img";
import { pageMeta } from "@/lib/seo";
import { officesLd } from "@/lib/offices";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { ContactForm } from "@/components/marketing/ContactForm";
import { SectionDecor } from "@/components/marketing/Decor";
import { SnowflakeLockup } from "@/components/marketing/SnowflakeLockup";
import { LeadershipStrip } from "@/components/marketing/LeadershipStrip";
import { getSetting, getTeam } from "@/lib/queries";
import type { Locale } from "@/lib/i18n-content";
import { theme } from "@/config/theme";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  return pageMeta({ title: t("title"), description: t("description"), path: "/contact", locale });
}

type ContactSetting = { email: string; blurb: string };

export default async function ContactPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  const [contact, team] = await Promise.all([
    getSetting<ContactSetting>("contact", locale as Locale),
    getTeam(locale as Locale),
  ]);
  const email = contact?.email ?? theme.brand.email;
  // First published member with a booking link, if any (none seeded today:
  // the block below renders nothing until a bookingUrl lands in the CMS).
  const bookingUrl = team.find((m) => m.bookingUrl)?.bookingUrl;

  const steps = t.raw("steps") as { title: string; body: string }[];
  const credentialPills = t.raw("credentials.pills") as string[];
  // Both offices, exactly as listed on /life-at-viewnear.
  const offices = t.raw("offices") as string[];

  return (
    <>
      {/* Both offices as ProfessionalService: this is the page with the
          strongest location intent, so the NAP belongs here. */}
      <JsonLd data={officesLd()} />
      <div className="relative overflow-hidden">
        <SectionDecor variant="blobs" />
        <div className="relative">
          <PageHero
            eyebrow={t("hero.eyebrow")}
            title={t.rich("hero.title", { hl: (c) => <span className="text-gradient">{c}</span> })}
            description={contact?.blurb ?? t("hero.description")}
          />
        </div>
      </div>

      <Section className="section-warm">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="order-2 lg:order-1">
            <div>
              <p className="text-sm text-muted">{t("preferEmail")}</p>
              <a
                href={`mailto:${email}`}
                className="mt-1 inline-block font-display text-xl font-bold text-primaryDeep"
              >
                {email}
              </a>
            </div>

            <div className="relative mt-10 overflow-hidden rounded-2xl border border-border shadow-soft">
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-primary/25 via-transparent to-accent/15" />
              <Image
                src="/assets/images/photos/contact-handshake.jpg"
                alt={t("imageAlt")}
                width={720}
                height={480}
                className="aspect-[3/2] w-full object-cover"
              />
            </div>

            <div className="mt-12">
              <h2 className="font-display text-lg font-bold text-foreground">
                {t("next.title")}
              </h2>
              <p className="mt-2 text-sm text-muted">
                {t("next.reply")}
              </p>
              {theme.brand.phone && (
                <p className="mt-2 text-sm text-muted">
                  {t("next.call")}{" "}
                  <a
                    href={`tel:${theme.brand.phone.replace(/[^+\d]/g, "")}`}
                    className="font-semibold text-primaryDeep underline-offset-4 hover:underline"
                  >
                    {theme.brand.phone}
                  </a>
                </p>
              )}
              <ol className="relative mt-6 space-y-6 before:absolute before:left-[15px] before:top-3 before:bottom-3 before:w-px before:bg-border">
                {steps.map((step, i) => (
                  <li key={step.title} className="relative flex gap-4">
                    <span className="relative z-10 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primaryDeep font-mono text-sm text-primary-fg shadow-soft ring-4 ring-background">
                      {i + 1}
                    </span>
                    <div className="pt-1">
                      <h3 className="font-semibold text-foreground">{step.title}</h3>
                      <p className="mt-1 text-sm text-muted">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <LeadershipStrip label={t("leadershipLabel")} className="mt-8" />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="mb-5">
              <p className="eyebrow">{t("credentials.eyebrow")}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {credentialPills.map((c) => (
                  <span key={c} className="pill-chip">{c}</span>
                ))}
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
                {t("booking.prefer")}{" "}
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primaryDeep underline-offset-4 hover:underline"
                >
                  {t("booking.cta")}
                </a>
              </p>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
