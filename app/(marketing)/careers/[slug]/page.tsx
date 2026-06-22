import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section, SectionHeading, Pill, CtaBand } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { ApplicationForm } from "@/components/marketing/ApplicationForm";
import { JsonLd } from "@/components/JsonLd";
import { getJobOpeningBySlug, getJobSlugs } from "@/lib/queries";
import { BENEFITS } from "@/lib/benefits";
import { BenefitsGrid } from "@/components/marketing/BenefitsGrid";
import { Markdown } from "@/lib/content";
import { asStringArray } from "@/lib/utils";
import { theme } from "@/config/theme";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getJobSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const job = await getJobOpeningBySlug(params.slug);
  if (!job) return { title: "Careers" };
  return pageMeta({
    title: `${job.title}: Careers`,
    description: job.description,
    path: `/careers/${params.slug}`,
    type: "article",
  });
}

// Map the human "employment" string (e.g. "Full-time · Hybrid") to a
// schema.org employmentType token, defaulting to FULL_TIME.
function employmentType(employment: string): string {
  const v = employment.toLowerCase();
  if (v.includes("part-time") || v.includes("part time")) return "PART_TIME";
  if (v.includes("contract")) return "CONTRACTOR";
  if (v.includes("intern")) return "INTERN";
  return "FULL_TIME";
}

export default async function CareerDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const job = await getJobOpeningBySlug(params.slug);
  if (!job) notFound();

  const skills = asStringArray(job.skills);
  const isRemote = (job.location ?? "").toLowerCase().includes("remote");

  const jobLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    employmentType: employmentType(job.employment),
    datePosted: (job.publishedAt ?? job.createdAt).toISOString(),
    // Google drops postings with no validThrough after ~30 days; keep it open
    // for 90 days from posting.
    validThrough: new Date(
      (job.publishedAt ?? job.createdAt).getTime() + 90 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    hiringOrganization: {
      "@type": "Organization",
      name: theme.brand.name,
      sameAs: theme.brand.url,
      logo: `${theme.brand.url}/assets/viewnear-logo.png`,
    },
    directApply: true,
    url: `${theme.brand.url}/careers/${job.slug}`,
  };

  if (job.location) {
    jobLd.jobLocation = {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.location },
    };
  }

  if (isRemote) {
    jobLd.jobLocationType = "TELECOMMUTE";
    jobLd.applicantLocationRequirements = {
      "@type": "Country",
      name: "Americas",
    };
  }

  return (
    <>
      <JsonLd data={jobLd} />

      <PageHero
        align="left"
        eyebrow="Careers · Open role"
        title={job.title}
        description={job.description}
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-primaryDeep">{job.employment}</span>
          {job.location ? (
            <span className="text-sm text-muted">· {job.location}</span>
          ) : null}
        </div>
        <div className="mt-6">
          <Link
            href="/life-at-viewnear"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep"
          >
            <span aria-hidden="true">&larr;</span> Back to all roles
          </Link>
        </div>
      </PageHero>

      <Section className="pt-8 md:pt-10">
        <div className="mx-auto max-w-3xl">
          {job.body ? (
            <div className="prose-vn">
              <Markdown>{job.body}</Markdown>
            </div>
          ) : (
            // Fallback for roles without a detailed body yet.
            <>
              <SectionHeading eyebrow="About the role" title="What you'll do" />
              <p className="mt-6 text-lg leading-relaxed text-muted">{job.description}</p>
            </>
          )}

          {skills.length > 0 ? (
            <div className="mt-10 border-t border-border pt-8">
              <p className="eyebrow mb-3">Skills &amp; tools</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <Pill key={s}>{s}</Pill>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </Section>

      {/* Life at Viewnear: culture + benefits, so candidates see the whole picture. */}
      <Section className="section-warm">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Life at Viewnear"
            title="More than the role"
            intro="You'd join a young, high-performance team that is outcome-led, AI-native, and remote-augmented. Here is some of what comes with it."
          />
          <BenefitsGrid items={BENEFITS} className="mt-10" />
          <div className="mt-8">
            <Link
              href="/life-at-viewnear"
              className="group inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep"
            >
              <span className="link-underline">See life at Viewnear</span>
              <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </Section>

      <Section id="apply">
        <SectionHeading
          eyebrow="Apply"
          title="Apply for this role"
          intro="Send your details and we will review your application. We read every one."
          center
        />
        <div className="mx-auto mt-12 max-w-2xl">
          <ApplicationForm openingTitle={job.title} />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
