import { prisma } from "@/lib/db";
import { setSetting } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const KEYS: { key: string; label: string; help: string }[] = [
  { key: "hero", label: "Hero", help: '{ "headline": "...", "subhead": "..." }' },
  { key: "contact", label: "Contact", help: '{ "email": "...", "blurb": "..." }' },
  { key: "stats", label: "Stats", help: '[ { "label": "...", "value": "..." } ]' },
  {
    key: "partnership",
    label: "Partnership",
    help: '{ "title": "...", "points": [ { "title": "...", "body": "..." } ] }',
  },
  { key: "faqs", label: "FAQs", help: '[ { "category": "...", "q": "...", "a": "..." } ]' },
];

function pretty(value?: string): string {
  if (!value) return "";
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

export default async function SettingsPage() {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: KEYS.map((k) => k.key) } },
  });
  const byKey = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Site settings</h1>
      <p className="mt-1 text-sm text-muted">
        Content shown across the marketing site (hero, contact, partnership, stats, FAQs). Each value
        is JSON; saving validates it and updates the live site.
      </p>

      <div className="mt-6 max-w-2xl space-y-8">
        {KEYS.map((k) => (
          <form key={k.key} action={setSetting.bind(null, k.key)} className="card">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">{k.label}</h2>
              <code className="font-mono text-xs text-muted">{k.key}</code>
            </div>
            <p className="mt-1 font-mono text-[11px] text-muted">{k.help}</p>
            <textarea
              name="value"
              defaultValue={pretty(byKey[k.key])}
              rows={10}
              spellCheck={false}
              className="mt-3 w-full rounded-lg border border-border bg-background p-3 font-mono text-xs leading-relaxed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            />
            <button type="submit" className="btn-primary btn-sm mt-3">
              Save {k.label}
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
