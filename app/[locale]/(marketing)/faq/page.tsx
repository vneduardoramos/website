import { pageMeta } from "@/lib/seo";
import { Section, CtaBand } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { getSetting, safe } from "@/lib/queries";
import { JsonLd } from "@/components/JsonLd";

export const metadata = pageMeta({
  title: "FAQ: partnership, delivery & pricing",
  description:
    "Answers to the questions teams ask Viewnear first: about our Snowflake partnership, how engagements run, commercials, and security.",
  path: "/faq",
});

export const revalidate = 60;

type FaqRow = { category?: string; q: string; a: string };

export default async function FaqPage() {
  const faqs = await safe(getSetting<FaqRow[]>("faqs"), []);
  const rows = faqs ?? [];

  // Group by category, preserving first-seen order.
  const groups: { category: string; items: FaqRow[] }[] = [];
  for (const row of rows) {
    const category = row.category ?? "General";
    let group = groups.find((g) => g.category === category);
    if (!group) {
      group = { category, items: [] };
      groups.push(group);
    }
    group.items.push(row);
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: rows.map((r) => ({
      "@type": "Question",
      name: r.q,
      acceptedAnswer: { "@type": "Answer", text: r.a },
    })),
  };

  return (
    <>
      {rows.length > 0 && <JsonLd data={faqLd} />}
      <PageHero
        eyebrow="FAQ"
        title={
          <>
            Questions, <span className="text-gradient">answered</span>.
          </>
        }
        description="The things teams ask us first: about our Snowflake partnership, how we deliver, what it costs, and how we keep client data safe."
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-12">
          {groups.map((group) => (
            <div key={group.category}>
              <h2 className="font-display text-xl font-bold text-foreground">{group.category}</h2>
              <div className="mt-5 space-y-4">
                {group.items.map((faq) => (
                  <details key={faq.q} className="card group">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-display text-lg font-bold">
                      {faq.q}
                      <span className="ml-4 text-2xl text-primary transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-4 text-muted">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand
        title="Still have a question?"
        subtitle="Ask us anything about standing up a data practice, a migration, or a specific AI use case: an architect on our team will reply."
      />
    </>
  );
}
