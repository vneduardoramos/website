import { Section } from "@/components/marketing/ui";
import { LogoRow } from "@/components/marketing/home/ClientLogos";
import { getClientBands } from "@/lib/client-bands";

/**
 * Just the "trusted by" content, eyebrow + uniform logo row, with no section
 * chrome of its own. Reused two ways: wrapped in a plain <Section> by
 * <TrustBar> for standalone use, or dropped into <PageHero footer> so the hero
 * background bleeds down behind the logos. Renders nothing if no client logos
 * are configured.
 */
export async function TrustLogos({
  label = "Trusted by teams across the Americas",
}: {
  label?: string;
}) {
  const bands = await getClientBands();
  if (!bands.top || bands.top.length === 0) return null;
  // Keep the per-logo scale/horizontal nudges (they equalize visual weight,
  // e.g. the compact H-E-B badge), but zero the vertical nudge tuned for the
  // home band, and scale from center (not the home baseline) so every logo
  // stays vertically centered in this uniform strip.
  const logos = bands.top.map((l) => ({ ...l, dy: 0 }));
  return (
    <div className="flex flex-col items-center gap-8">
      <span className="eyebrow">{label}</span>
      <div className="w-full">
        <LogoRow logos={logos} scaleOrigin="center" />
      </div>
    </div>
  );
}

/**
 * Self-fetching "trusted by" client-logo strip in its own section, for pages
 * that want it as a standalone band. Pages that stack it under a PageHero pass
 * <TrustLogos /> into <PageHero footer> instead, so the hero background carries
 * through the strip.
 */
export async function TrustBar({
  label,
  tint = false,
}: {
  label?: string;
  tint?: boolean;
}) {
  return (
    <Section className={tint ? "section-tint" : undefined}>
      <TrustLogos label={label} />
    </Section>
  );
}
