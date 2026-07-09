"use client";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, Link } from "@/i18n/navigation";

export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname(); // locale-stripped, e.g. /industries/healthcare
  const other = locale === "en" ? "es" : "en";
  const t = useTranslations("nav");
  return (
    <Link
      href={pathname}
      locale={other}
      aria-label={t("switchLanguage")}
      className={className || "rounded-lg px-2 py-1 text-sm font-medium text-foreground/80 transition-colors hover:text-primaryDeep"}
    >
      {other.toUpperCase()}
    </Link>
  );
}
