import { getTranslations } from "next-intl/server";

/** A short "Key takeaways" summary panel shown near the top of an article.
 * `items` is the parsed string[] from the post's keyTakeaways field; renders
 * nothing when empty. */
export async function KeyTakeaways({ items }: { items: string[] }) {
  if (!items?.length) return null;
  const t = await getTranslations("articleUi");

  return (
    <div className="mx-auto mt-10 max-w-3xl">
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primaryDeep">
          {t("keyTakeaways.heading")}
        </p>
        <ul className="mt-4 space-y-3">
          {items.map((text, i) => (
            <li key={i} className="flex gap-3">
              <svg
                viewBox="0 0 20 20"
                className="mt-0.5 h-5 w-5 shrink-0 text-primaryDeep"
                fill="none"
                aria-hidden
              >
                <circle cx="10" cy="10" r="9" className="fill-primary/20" />
                <path
                  d="M6 10.5l2.5 2.5L14 7.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm leading-relaxed text-foreground">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
