import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { breadcrumbLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export type Crumb = { label: string; href?: string };

/**
 * Breadcrumb trail for 2-level detail pages (e.g. Home › Blog › Post). The last
 * item is the current page (no href). Also emits BreadcrumbList JSON-LD for SEO
 * rich results (via the shared `breadcrumbLd` helper in lib/seo.ts, the single
 * source of truth for breadcrumb structured data). Best practice: use only
 * where there's a real hierarchy, not on top-level pages.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const t = useTranslations("sharedUi");
  const locale = useLocale();
  const jsonLd = breadcrumbLd(
    items.map((c) => ({ name: c.label, url: c.href })),
    locale,
  );

  return (
    <nav aria-label={t("breadcrumbAria")} className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-muted">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex min-w-0 items-center gap-x-1.5">
              {c.href && !last ? (
                <Link href={c.href} className="transition-colors hover:text-primaryDeep">
                  {c.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className="max-w-[16rem] truncate text-foreground sm:max-w-[28rem]"
                >
                  {c.label}
                </span>
              )}
              {!last && (
                <span aria-hidden="true" className="text-muted/50">
                  ›
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd data={jsonLd} />
    </nav>
  );
}
