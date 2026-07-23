import { describe, it, expect } from "vitest";
import { parseServiceBody, stripMd } from "@/lib/service-content";

const CARDS_BODY = `Lead sentence one. Lead sentence two.

## What our services deliver

Intro line before the bullets.

- **An AI readiness assessment.** An honest read of data quality with a [link](/x).
- **A board-ready roadmap.** Use cases sequenced by ROI.

Closing note after the bullets.

## How a strategy engagement runs

We price on outcomes, not hours. First value lands in 8 weeks.

## Strategy built in live sessions, in your time zone

Our senior strategists work nearshore from Monterrey. [See the model](/nearshore).

## Frequently asked questions

### How do I know if we are ready?

Readiness is measurable, not a feeling.

### What should it include?

Four things at minimum.`;

const LIST_BODY = `Lead paragraph.

## What a governed foundation includes

A typical build covers:

- Cloud architecture design: topology and access.
- Ingestion built on Openflow and Zero-Copy Integrations.

That discipline produces the numbers.

## How a foundation build runs

A paid discovery fixes scope.

## Nearshore architecture depth, on your hours

Our hub in Monterrey works US hours.`;

describe("parseServiceBody", () => {
  it("extracts the lead paragraph before the first heading", () => {
    expect(parseServiceBody(CARDS_BODY).lead).toBe(
      "Lead sentence one. Lead sentence two.",
    );
  });

  it("parses bold-lead-in bullets as titled cards with intro and outro", () => {
    const d = parseServiceBody(CARDS_BODY).deliverables!;
    expect(d.mode).toBe("cards");
    expect(d.intro).toBe("Intro line before the bullets.");
    expect(d.outro).toBe("Closing note after the bullets.");
    expect(d.items).toHaveLength(2);
    expect(d.items[0].term).toBe("An AI readiness assessment");
    expect(d.items[0].body).toContain("[link](/x)");
  });

  it("parses plain bullets as a list (no titles)", () => {
    const d = parseServiceBody(LIST_BODY).deliverables!;
    expect(d.mode).toBe("list");
    expect(d.items[0].term).toBeUndefined();
    expect(d.items[0].body).toContain("Cloud architecture design");
    expect(d.outro).toBe("That discipline produces the numbers.");
  });

  it("classifies engagement vs nearshore prose sections", () => {
    const c = parseServiceBody(CARDS_BODY);
    expect(c.engagement!.heading).toBe("How a strategy engagement runs");
    expect(c.nearshore!.heading).toContain("live sessions");
    expect(c.nearshore!.body).toContain("Monterrey");
    expect(c.extras).toHaveLength(0);
  });

  it("parses FAQ question/answer pairs", () => {
    const faq = parseServiceBody(CARDS_BODY).faq!;
    expect(faq.items).toHaveLength(2);
    expect(faq.items[0].q).toBe("How do I know if we are ready?");
    expect(faq.items[0].a).toBe("Readiness is measurable, not a feeling.");
  });

  it("is safe on empty input", () => {
    const c = parseServiceBody("");
    expect(c.lead).toBe("");
    expect(c.deliverables).toBeUndefined();
    expect(c.extras).toEqual([]);
  });
});

describe("stripMd", () => {
  it("removes links, bold, and code markers", () => {
    expect(stripMd("A **bold** word and a [link](/x) plus `code`.")).toBe(
      "A bold word and a link plus code.",
    );
  });
});
