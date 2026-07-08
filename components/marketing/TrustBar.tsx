import { cn } from "@/lib/utils";
import { LogoRow } from "@/components/marketing/home/ClientLogos";
import { getClientBands } from "@/lib/client-bands";

/**
 * Self-fetching "trusted by" client-logo strip, for reuse on sales/company
 * pages beyond the home page. Drops in with one line (like LeadershipStrip /
 * LatestPosts). Renders nothing if no client logos are configured.
 *
 * Deliberately NOT wrapped in <Section>: a logo bar wants a compact band, not
 * the full section rhythm (py-14/20/24), which left a sea of white around it.
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
    <section className={cn("py-12 md:py-14", tint && "section-tint")}>
      <div className="container-page">
        <div className="mb-14 flex justify-center">
          <span className="eyebrow">{label}</span>
        </div>
        <LogoRow logos={bands.top} />
      </div>
    </section>
  );
}
