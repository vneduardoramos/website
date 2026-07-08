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
  // Keep the per-logo scale/horizontal nudges (they equalize visual weight,
  // e.g. the compact H-E-B badge), but zero the vertical nudge tuned for the
  // home band, and scale from center (not the home baseline) so every logo
  // stays vertically centered in this uniform strip.
  const logos = bands.top.map((l) => ({ ...l, dy: 0 }));
  return (
    <Section className={tint ? "section-tint" : undefined}>
      <div className="flex flex-col items-center gap-12">
        <span className="eyebrow">{label}</span>
        <div className="w-full">
          <LogoRow logos={logos} scaleOrigin="center" />
        </div>
      </div>
    </Section>
  );
}
