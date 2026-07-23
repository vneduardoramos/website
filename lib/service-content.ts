/**
 * Parse a service's long-form markdown body into the semantic sections the
 * service detail page lays out (lead standfirst, deliverables, engagement,
 * nearshore differentiator, FAQ). Content is authored to a stable shape in
 * prisma/seed/data.ts + prisma/seed/es/services.ts:
 *
 *   <lead paragraph(s)>
 *   ## What we deliver        -> a bullet list (deliverables)
 *   ## How ... runs           -> prose (the engagement mechanism)
 *   ## <nearshore section>    -> prose mentioning "nearshore" / Monterrey
 *   ## <FAQ heading>          -> ### question + answer pairs
 *
 * The parser classifies by structure, not by heading wording, so it works for
 * both locales and survives copy edits. Any section may be absent.
 */

export type DeliverItem = { term?: string; body: string };
export type Faq = { q: string; a: string };
export type ProseSection = { heading: string; body: string };

export type ServiceContent = {
  lead: string;
  deliverables?: {
    heading: string;
    intro: string;
    outro: string;
    items: DeliverItem[];
    /** "cards" when bullets carry a **bold** lead-in title; "list" otherwise. */
    mode: "cards" | "list";
  };
  engagement?: ProseSection;
  nearshore?: ProseSection;
  faq?: { heading: string; items: Faq[] };
  /** Any prose sections that were neither engagement nor nearshore. */
  extras: ProseSection[];
};

type RawSection = { heading: string; body: string };

/** Split a markdown body into a lead (pre-heading) chunk and its `##` sections. */
function splitSections(md: string): { lead: string; sections: RawSection[] } {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const leadLines: string[] = [];
  const sections: RawSection[] = [];
  let current: RawSection | null = null;

  for (const line of lines) {
    const m = /^##\s+(.*\S)\s*$/.exec(line);
    if (m) {
      if (current) sections.push(current);
      current = { heading: m[1].trim(), body: "" };
    } else if (current) {
      current.body += (current.body ? "\n" : "") + line;
    } else {
      leadLines.push(line);
    }
  }
  if (current) sections.push(current);

  return { lead: leadLines.join("\n").trim(), sections };
}

/** Parse one deliverables bullet: `**Term.** body` -> {term, body}, else plain. */
function parseItem(bullet: string): DeliverItem {
  const text = bullet.replace(/^-\s+/, "").trim();
  const m = /^\*\*(.+?)\*\*\s*(.*)$/.exec(text);
  if (m) {
    const term = m[1].replace(/[.:]\s*$/, "").trim();
    return { term, body: m[2].trim() };
  }
  return { body: text };
}

function parseDeliverables(s: RawSection): NonNullable<ServiceContent["deliverables"]> {
  const lines = s.body.split("\n");
  const intro: string[] = [];
  const bullets: string[] = [];
  const outro: string[] = [];
  let phase: "intro" | "bullets" | "outro" = "intro";

  for (const line of lines) {
    const isBullet = /^-\s+/.test(line);
    if (isBullet) {
      phase = "bullets";
      bullets.push(line);
    } else if (phase === "bullets") {
      // Blank lines inside the list are skipped; the first real paragraph
      // after the bullets flips us into the outro.
      if (line.trim()) {
        phase = "outro";
        outro.push(line);
      }
    } else if (phase === "intro") {
      intro.push(line);
    } else {
      outro.push(line);
    }
  }

  const items = bullets.map(parseItem);
  return {
    heading: s.heading,
    intro: intro.join("\n").trim(),
    outro: outro.join("\n").trim(),
    items,
    mode: items.some((i) => i.term) ? "cards" : "list",
  };
}

function parseFaq(s: RawSection): NonNullable<ServiceContent["faq"]> {
  // Split on `### ` question markers; the text before the first one (if any) is
  // an optional section intro and is ignored for the accordion.
  const chunks = s.body.split(/^###\s+/m).slice(1);
  const items: Faq[] = chunks.map((chunk) => {
    const nl = chunk.indexOf("\n");
    const q = (nl === -1 ? chunk : chunk.slice(0, nl)).trim();
    const a = (nl === -1 ? "" : chunk.slice(nl + 1)).trim();
    return { q, a };
  });
  return { heading: s.heading, items };
}

/** Strip inline markdown to plain text (for FAQ JSON-LD answer strings). */
export function stripMd(s: string): string {
  return s
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseServiceBody(md: string): ServiceContent {
  const { lead, sections } = splitSections(md ?? "");
  const out: ServiceContent = { lead, extras: [] };
  const prose: ProseSection[] = [];

  for (const s of sections) {
    if (/^###\s+/m.test(s.body)) {
      if (!out.faq) out.faq = parseFaq(s);
    } else if (/^-\s+/m.test(s.body)) {
      if (!out.deliverables) out.deliverables = parseDeliverables(s);
    } else {
      prose.push({ heading: s.heading, body: s.body.trim() });
    }
  }

  // The nearshore section is the prose block that talks about the delivery
  // model; "nearshore" and "Monterrey" are stable across both locales.
  const nearshoreIdx = prose.findIndex((p) =>
    /nearshore|monterrey/i.test(`${p.heading} ${p.body}`),
  );
  if (nearshoreIdx !== -1) {
    out.nearshore = prose.splice(nearshoreIdx, 1)[0];
  }
  if (prose.length) out.engagement = prose.shift();
  out.extras = prose;

  return out;
}
