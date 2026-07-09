import { getTranslations } from "next-intl/server";
import { MeshHeroSlide } from "@/components/marketing/home/MeshHeroSlide";

/**
 * Home hero: a single, value-led block (the living mesh + headline + cert badges).
 * The H1 lives in MeshHeroSlide (with its gradient accent); the seed `hero.headline`
 * mirrors that copy for reference. Only `subhead` is threaded through and editable
 * via the `hero` setting.
 */
export async function Hero({ subhead }: { subhead?: string }) {
  const t = await getTranslations("homeServer");
  return (
    <section className="relative overflow-hidden" aria-label={t("hero.ariaLabel")}>
      <MeshHeroSlide subhead={subhead} />
    </section>
  );
}
