/** Accordion FAQ using native <details> (no client JS needed). */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
      {items.map((item) => (
        <details key={item.q} className="group p-5 [&_svg]:open:rotate-45">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-semibold text-foreground">
            {item.q}
            <svg
              className="h-5 w-5 shrink-0 text-primary transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </summary>
          <p className="mt-3 text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
