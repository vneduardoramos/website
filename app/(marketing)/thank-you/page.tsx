import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Thank you, we'll be in touch",
  description:
    "Thanks for reaching out to Viewnear. Someone from our team will reply within one business day.",
  robots: { index: false },
  alternates: { canonical: "/thank-you" },
};

export default function ThankYouPage() {
  return (
    <>
      <PageHero
        eyebrow="Thank you"
        title={
          <>
            Thank you. <span className="text-gradient">We&apos;ll be in touch</span>.
          </>
        }
        description="Someone from our team will reply within one business day. In the meantime, explore how we help enterprises turn data into a competitive advantage."
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-primary btn-lg">
            Back to home
          </Link>
          <Link href="/case-studies" className="btn-ghost btn-lg">
            See case studies
          </Link>
          <Link href="/resources" className="btn-ghost btn-lg">
            Browse resources
          </Link>
        </div>
      </PageHero>

      <Section>
        <div className="mx-auto max-w-2xl text-center text-muted">
          <p>
            We read every message and route it to the right person on our team. If your request is
            time-sensitive, you can also reach us by email and we will prioritize accordingly.
          </p>
        </div>
      </Section>
    </>
  );
}
