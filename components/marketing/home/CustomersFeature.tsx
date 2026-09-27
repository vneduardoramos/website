import { getTranslations } from "next-intl/server";
import { LogoRow } from "@/components/marketing/home/ClientLogos";
import type { BandLogo } from "@/lib/client-bands";
import { LOGO_CATALOG } from "@/lib/client-bands";
import {
  CustomerStories,
  type CustomerStoriesLabels,
  type CustomerStory,
} from "@/components/marketing/home/CustomerStories";

/**
 * "Customers": one proof engagement per half of the practice, in a card the
 * reader pages through.
 *
 * The hero claims Viewnear builds both the data foundation and the AI that runs
 * on it. Showing one engagement proved one half and asserted the other, so both
 * are here: Magnolia Doors, the named agentic engagement, and the claims
 * processor, the governed-data one.
 *
 * Magnolia leads. It is the only customer the site may name, it carries the
 * strongest measured result, and it evidences the half a visitor would
 * otherwise have to take on trust.
 *
 * NOTE: real, permissioned client logos ship in the <LogoRow /> bands framing
 * this section, backed by files in /public/assets/images/clients/. Most
 * case-study CLIENTS stay anonymized by agreement, so their card names the
 * sector and region; Magnolia Doors is named with permission and shows its logo.
 */

// The two engagements, exported so the case-studies grid can exclude them.
export const FEATURED_CASE_SLUG = "insurance-claims-cortex-ai";
export const AGENTIC_CASE_SLUG = "magnolia-doors-installation-scheduling";

const AGENTIC = {
  slug: AGENTIC_CASE_SLUG,
  metricValues: ["15–19 hrs", "~3 min"],
  image: "/assets/images/cases/magnolia-doors-installation-scheduling-hero.jpg",
};

const FEATURED = {
  slug: FEATURED_CASE_SLUG,
  metricValues: ["60→95%", "4 sec"],
  image: "/assets/images/industries/financial-services.jpg",
};

export async function CustomersFeature({ bottomLogos }: { bottomLogos: BandLogo[] }) {
  const t = await getTranslations("homeServer");
  const carousel = t.raw("customersFeature.carousel") as { prev: string; next: string; counter: string };
  const labels: CustomerStoriesLabels = {
    ...carousel,
    readCaseStudy: t("customersFeature.readCaseStudy"),
    viewAll: t("customersFeature.viewCaseStudies"),
  };

  // The one named customer shows its logo; the catalog already holds the
  // normalized artwork used in the bands above and below.
  const magnolia = LOGO_CATALOG.find((c) => c.key === "magnolia-doors");

  const stories: CustomerStory[] = [
    {
      client: t("customersFeature.agentic.client"),
      logo: magnolia
        ? { src: magnolia.src, alt: magnolia.alt, w: magnolia.w, h: magnolia.h }
        : undefined,
      badge: t("customersFeature.badgeAgentic"),
      sector: t("customersFeature.agentic.sector"),
      region: t("customersFeature.agentic.region"),
      title: t("customersFeature.agentic.title"),
      summary: t("customersFeature.agentic.summary"),
      href: `/case-studies/${AGENTIC.slug}`,
      image: AGENTIC.image,
      imageAlt: `${t("customersFeature.agentic.sector")}: ${t("customersFeature.agentic.title")}`,
      metrics: [
        { value: AGENTIC.metricValues[0], label: t("customersFeature.agentic.metricLabel1") },
        { value: AGENTIC.metricValues[1], label: t("customersFeature.agentic.metricLabel2") },
      ],
    },
    {
      client: t("customersFeature.featured.client"),
      badge: t("customersFeature.badge"),
      sector: t("customersFeature.featured.sector"),
      region: t("customersFeature.featured.region"),
      title: t("customersFeature.featured.title"),
      summary: t("customersFeature.featured.summary"),
      href: `/case-studies/${FEATURED.slug}`,
      image: FEATURED.image,
      imageAlt: `${t("customersFeature.featured.sector")}: ${t("customersFeature.featured.title")}`,
      metrics: [
        { value: FEATURED.metricValues[0], label: t("customersFeature.featured.metricLabel1") },
        { value: FEATURED.metricValues[1], label: t("customersFeature.featured.metricLabel2") },
      ],
    },
  ];

  // The heading sits 35% nearer the top edge of the warm band than
  // `.section` would put it: 56/80/96px of top padding become 36/52/62.
  // The band then closes on the same gap the logo row opens with: its
  // margin-top is 48px, 56px from md, so the padding below it matches
  // rather than the 96px `.section` would leave.
  return (
    <section className="section section-warm relative overflow-hidden pb-12 pt-9 md:pb-14 md:pt-[52px] lg:pt-[62px]">
      <div className="container-page">
        <CustomerStories
          title={t.rich("customersFeature.title", {
            br: () => <br />,
            hl: (c) => <span className="text-gradient">{c}</span>,
          })}
          stories={stories}
          labels={labels}
        />
        <LogoRow logos={bottomLogos} className="mt-12 md:mt-14" />
      </div>
    </section>
  );
}
