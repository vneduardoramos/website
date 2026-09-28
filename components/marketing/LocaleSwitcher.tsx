"use client";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

// Endonyms: a language's own name for itself, the same regardless of which
// UI language is currently showing, so these aren't translation keys.
const LANGS = [
  { code: "en", label: "EN", name: "English" },
  { code: "es", label: "ES", name: "Español" },
] as const;

/**
 * A small segmented toggle rather than the single "the other one" link this
 * used to be: both languages sit in one pill, the current one filled solid,
 * the other a real link. Two letters read as a mystery abbreviation on their
 * own; shown as a pair with one lit up, it reads as a language switch.
 *
 * The active language is a `<span>`, not a link to itself: clicking your own
 * current language should do nothing, and a link that goes nowhere is worse
 * than no link.
 */
export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname(); // locale-stripped, e.g. /industries/healthcare
  const t = useTranslations("nav");

  return (
    <div
      role="group"
      aria-label={t("languageLabel")}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border bg-surface p-0.5",
        className,
      )}
    >
      {LANGS.map((l) => {
        const active = l.code === locale;
        return active ? (
          <span
            key={l.code}
            aria-current="true"
            className="rounded-full bg-primary px-2.5 py-1 font-mono text-[0.7rem] font-bold tracking-wider text-white"
          >
            {l.label}
          </span>
        ) : (
          <Link
            key={l.code}
            href={pathname}
            locale={l.code}
            lang={l.code}
            hrefLang={l.code}
            aria-label={t("switchTo", { language: l.name })}
            className="rounded-full px-2.5 py-1 font-mono text-[0.7rem] font-bold tracking-wider text-muted transition-colors hover:bg-surface2 hover:text-foreground"
          >
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
