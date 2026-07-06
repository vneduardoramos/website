# Site-wide content audit and rewrite (2026-07-05)

Six parallel audits swept every marketing page against the content style guide,
the canonical metric set, and the messaging decisions (no self-labeled caliber,
no senior-only promises, deliverable is never "the/your platform", no
overclaimed AI, no lock-in filler). Mechanical hygiene was near-perfect
site-wide: no em dashes, no British spellings, no banned third-party brands,
no retired product names in rendered copy. The real findings are structural:
redundancy, filler sections, and a handful of canon violations.

## Page grades

| Page | Grade | Main problem |
|------|-------|--------------|
| services | C+ | Doing four pages' jobs; duplicates platform/data-ai/solutions; "governed" x22 |
| life-at-viewnear | C+ | Self-praise filler ("greatness", "premium", "excellence"); flywheel stated 3x |
| industries/[slug] | C+ | Invented "Impact you can expect" metrics presented as engagement outcomes |
| resources | C | Two grids with no argument |
| home | B | Credentials proven 3x in two screens; 700-word pricing manifesto above the offer |
| pricing | B | Process-first, outcome content generic and below the fold |
| nearshore | B | Deep-dive splits restate the reasons grid one-for-one |
| industries index | B | "Pair sector specialists + engineers" said 4x |
| about | B+ | "Versed at every level" x4, "one accountable team" x5 |
| approach | B+ | "De-risk" x3; handover line duplicated from about |
| partnership | B+ | "end to end" x3, "rotating bench" x3; uses "consultancy" as the competitor foil |
| solutions | B+ | Disciplined; minor jargon ("delivered native") |
| blog template | B+ | Clean |
| migrations | A- | Best offering page; minor internal duplication |
| data-ai | A- | Best-differentiated page |
| platform | A- | Owns the stack; services duplicates it |
| case studies (index + template) | A- | Honest anonymization, verified-proof panel |
| contact | A- | Sells the conversation; one soft filler clause |
| nav / footer | A- | Tight scent; "proven delivery" tic |
| security | A | Model compliance-inheritance framing |
| privacy / terms | A | Clean within legal scope |

## Canon violations (all get fixed)

1. prisma/seed/data.ts:69 "governed, Snowflake-first data **platform**" -> data foundation (renders on home + services).
2. pricing/page.tsx:21 "defined **platform builds**" -> governed data foundations and migrations.
3. industries/page.tsx:91 "one governed **platform**" -> one governed foundation (align :85 imageAlt).
4. industries flavor retail bullet "one near-real-time **platform**" -> governed foundation.
5. home page.tsx:35 "That work is more senior, not less, and it is where we concentrate" -> senior-only slip; reframe to senior judgment + depth at every level.
6. lib/benefits.ts "Best-in-class tools" / "Premium tooling" -> concrete, no self-labels (renders on life + careers).
7. life-at-viewnear self-labels: "headed to greatness", "building something exceptional", "premium work", "Premium value", "excellence", "high-performance team" -> concrete claims.
8. Industry flavor metric bands: unsourced absolutes (100%, 99.9%) presented as "Outcomes from our engagements" -> reframe intro as what engagements build toward; replace absolute overclaims; manufacturing "99.9% pipeline uptime" -> canonical 3x reliability.
9. partnership uses "consultancy" pejoratively for competitors while it is our category word -> foil becomes "global systems integrators".

## Kill list (sections cut outright)

- home: badge strip under hero (proof band already shows the same three badges); ServicesGrid "short version" filler tile.
- home: outcomes manifesto condensed (thesis + three beats; drop the two restatements).
- services: "Why now / already moving" FOMO ShowcaseBand; "Built on Snowflake, delivered end-to-end" FeatureSplit (duplicates /platform); AI production grid shrunk to a pointer (owned by /data-ai and /solutions); stack section cut to a teaser for /platform.
- nearshore: three deep-dive FeatureSplits collapsed (they restate the reasons grid).
- life: duplicate flywheel prose; standApart duplicate block; stray credential line.
- about/approach: duplicated handover line kept once; "versed at every level" kept once (best phrasing).

## Rewrite priorities (surgical)

- Home hero H1 outcome-led; "SnowPro-certified, end to end" trimmed; FAQ end-to-end budget.
- Pricing: value-by-horizon tied to canonical metrics (8-16 weeks, 60%, 40%); "First 90 days" aligned to canonical first-value language.
- Partnership/nearshore: dedupe "Snowflake is what we do, not one of ten stacks" (verbatim on both); "rotating bench" once per site page; "US Central" 5x -> 2x.
- Industries index: keep one "pair sector specialists" statement, differentiate hero/intro/showcase; [slug]:144 differentiated from index.
- Contact:55 drop "we are here to help"; "data and AI" -> "data & AI".
- Security:156 drop no-lock-in tail, keep the Iceberg fact; :121 untangle double-negative.
- Nav: Resources tile concretized; "proven delivery" used once; "/partnership: and why partner" trimmed.
- Resources: one line of real positioning; "From the lab" -> "Field notes".
- Case-studies index:38 sharpen generic hero phrase.
- Manufacturing industry copy: "end-to-end" 4x -> 1x.

## Explicitly NOT changed

- "Lower platform run cost" label: canonical metric label per style guide (platform = Snowflake, correct usage).
- Migrations "rising license and support costs" (line 87): refers to legacy vendors, correct contrast.
- data-ai "14+ models / 6 labs / 1 line to swap": product facts, not firm metrics.
- home "6-12 months building the team in-house": defensible hiring-runway contrast.
- Legal pages: untouched beyond scope check (clean).
- URL slug data-visualisation: stays British per SEO exception.

## Images (done in this pass)

- network.jpg override: Snowflake Workspaces screenshot re-cropped to remove the
  embedded status bar (red "Invalid semantic view" SQL error); re-uploaded, DB repointed.
- circuit.jpg override: Cortex terminal re-cropped to end cleanly below the ASCII
  art (cut-off "ENTER to send" hint line removed); re-uploaded, DB repointed.
- Note: terminal artwork still shows the retired "Cortex Code" name inside the
  image; replace the asset when a CoCo-branded shot exists. Overrides live in the
  local dev DB; production rows need the same repointing when this ships.
