import { Section } from "@/components/marketing/ui";
import { LogoRow } from "@/components/marketing/home/ClientLogos";
import { getClientBands } from "@/lib/client-bands";

/**
 * Self-fetching "trusted by" client-logo strip, for reuse on sales/company
 * pages beyond the home page. Drops in with one line (like LeadershipStrip /
 * LatestPosts). Renders nothing if no client logos are configured.
 */
export async function TrustBar({
  label = "Trusted by teams across the Americas",
  tint = false,
}: {
  label?: string;
  tint?: boolean;
}) {
  const bands = await getClientBands();
  if (!bands.top || bands.top.length === 0) return null;
  return (
    <Section className={tint ? "section-tint" : undefined}>
      <div className="mb-12 flex justify-center">
        <span className="eyebrow">{label}</span>
      </div>
      <LogoRow logos={bands.top} />
    </Section>
  );
}
