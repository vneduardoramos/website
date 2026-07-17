# Site Audit Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix every confirmed finding from the 2026-07-13 full-site audit (90 findings across messaging, Spanish voice, i18n plumbing, SEO, accessibility, design system, security, lead pipeline, consent, performance, and repo hygiene), each finding independently verified by an adversarial pass.

**Architecture:** No new subsystems. This is a remediation sweep over the existing Next.js 14 App Router site: copy edits in `messages/{en,es}/*.json` and `prisma/seed/`, plumbing fixes in `app/[locale]/`, `components/`, and `lib/`, plus config hardening. Tasks are grouped into independent workstreams; each task compiles, passes verification, and commits on its own.

**Tech Stack:** Next.js 14.2 (App Router), next-intl 4.13 (`localePrefix: "as-needed"`, en at root, es under `/es`), Prisma 5.22 + Postgres, Tailwind 3.4, NextAuth 4 (credentials), Resend (email), Playwright/Vitest.

## Global Constraints

Copied verbatim from `docs/content-style-guide.md` and owner rules. Every task's requirements implicitly include this section.

- **Never use an em dash (U+2014) anywhere**: copy, JSX, string literals, comments, docs. Use colon, commas, parentheses, semicolon, or reword. En dashes for numeric ranges stay (`8–16 weeks`).
- **Banned words in visible copy** (including metadata, SEO strings, manifest): "consultancy", "consulting", "consultant(s)", "consultative", and Spanish "consultoría/consultor(es)".
- **Snowflake is the platform; never call the deliverable "the/your platform"** (Spanish: never "la plataforma" for our deliverable).
- **Spanish register:** formal Mexican `usted`, human, not literal-translation. Do NOT translate: `sponsor`, `POC`, `build`, `scope`, `backlog`, `discovery`, `stack`, `dashboard`, `pipeline`, `Time & materials`, `Staff augmentation`, `compliance`. Use `números` (never "cifras"), `juntas` (not "reuniones" as the meeting noun), generic "AI" is "IA" but the pairing "Data + AI" stays English. The exemplar register is `messages/es/home.json` / `homeServer.json` / `heroUi.json`.
- **Never frame Snowflake as per-seat "licenses"**; it is consumption-based capacity ("license" is fine only in the legal IP sense, e.g. Terms).
- **Tailwind color-opacity utilities only exist in 5-step increments** (`/5 /10 /15 ...`). Non-5-step (e.g. `/12`) silently renders transparent. When another alpha is needed, use inline `style` with `rgb(var(--color-x) / 0.12)`.
- **No colored accent bars/rails on cards**; neutral hairlines only.
- **Use semantic color tokens, never raw hex** in classNames (`config/theme.ts` is the single rebrand point).
- **News is intentionally dormant**: do not add News to nav/footer/resources/sitemap, and do not delete its dormant routes/queries/seed.
- **American English spelling** in copy; URL slugs never change (the `data-visualisation` slug stays British).
- After ANY change to `prisma/seed/**`: run `npm run db:seed` then `npm run content:export` and commit the regenerated `prisma/content-snapshot.json`.
- Verification before completion, every task: run the task's verify command AND `npm run typecheck` before committing. `npm run lint` and `npm run test` must pass at each workstream boundary.

## Branch & Baseline

### Task 0: Create branch and record baseline

**Files:** none (git only)

- [ ] **Step 1: Branch off the es-voice branch** (it contains the approved home register that Workstream 2 aligns to; if `feat/home-es-mx-v3` has merged to main by execution time, branch from `main` instead)

```bash
cd /Users/eduardoramos/Documents/VN
git checkout feat/home-es-mx-v3 && git pull
git checkout -b fix/site-audit-2026-07
```

- [ ] **Step 2: Record the baseline**

```bash
npm run typecheck && npm run lint && npm run test
```

Expected: all three pass (audit confirmed a clean baseline). If any fail, stop and report before proceeding.

---

## Workstream 1: English editorial fixes

### Task 1: Remove banned "consultancy" from public/llms.txt

**Files:**
- Modify: `public/llms.txt:3`

- [ ] **Step 1: Edit the summary line.** Replace the line

```
Viewnear is a data and AI consultancy and Snowflake Premier and CoCo Preferred Partner serving the Americas
```

with (keep the `> ` blockquote prefix if present in the file):

```
Viewnear builds data and AI practices inside enterprise teams and is a Snowflake Premier and CoCo Preferred Partner serving the Americas (Canada, USA, Mexico, LATAM, and the Caribbean). We take enterprises from data strategy to governed AI in production, built natively on Snowflake.
```

- [ ] **Step 2: Verify no consult-stem remains on served surfaces**

```bash
grep -rniE "consultan|consulting|consultative|consultor" public app components messages config lib prisma/seed/data.ts prisma/seed/es | cat
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add public/llms.txt && git commit -m "fix(content): drop banned consultancy wording from llms.txt"
```

### Task 2: Fix "licensing" framing on the partnership page

**Files:**
- Modify: `messages/en/partnership.json:26`

- [ ] **Step 1: Edit the procurement card.** In the sentence ending `"...with licensing and delivery under one accountable partner."` replace `licensing` with `capacity`, giving: `...with capacity and delivery under one accountable partner.` (The card already opens with "Procuring that capacity"; if the repetition reads badly in context, use `commercial terms` instead of `capacity`.)

- [ ] **Step 2: Check the es counterpart.** Open `messages/es/partnership.json` and mirror the same de-licensing edit on the equivalent string if it uses "licenciamiento/licencias" (keep the usted register).

- [ ] **Step 3: Verify**

```bash
grep -n "licen" messages/en/partnership.json messages/es/partnership.json
```

Expected: no hits that frame Snowflake procurement as licensing (legal-IP uses in terms.json are fine and out of scope).

- [ ] **Step 4: Commit**

```bash
git add messages/en/partnership.json messages/es/partnership.json && git commit -m "fix(content): Snowflake procurement is capacity, not licensing"
```

### Task 3: Fix platform OG alt calling Viewnear "the platform"

**Files:**
- Modify: `app/[locale]/(marketing)/platform/opengraph-image.tsx:5`

- [ ] **Step 1: Replace the alt export**

```tsx
export const alt = "Viewnear: the Snowflake-native stack";
```

(matches the renderOg title on line 8; static alt exports cannot vary by locale, that is handled separately in Task 18).

- [ ] **Step 2: Verify + commit**

```bash
grep -rn "Snowflake-native platform" app components messages
```

Expected: no output.

```bash
git add "app/[locale]/(marketing)/platform/opengraph-image.tsx" && git commit -m "fix(seo): platform og alt violated deliverable-naming rule"
```

---

## Workstream 2: Spanish voice and vocabulary pass

These tasks bring the rest of the site to the approved Mexican professional register (spec: `docs/content-style-guide.md`, section "Spanish (es) voice"). Rules applied throughout: `patrocinador(es)` -> `sponsor(s)`; `prueba de concepto` -> `POC`; `descubrimiento (pagado)` -> `discovery (pagado)`; `alcance` -> `scope` (ONLY where it means engagement/project scope; leave other senses); `tablero(s)` -> `dashboard(s)`; `cifras` -> `números` (whole-word only, fix gender agreement: cifra is feminine, número masculine); `reunión/reuniones` -> `junta(s)` (noun only; leave verb forms reunirse/reunidos alone). Do NOT touch "Data + AI", brand nouns, or `cifrado` (encryption). Retranslate against each string's OWN English source; do not paste home.json translations onto paraphrased cards.

### Task 4: Voice-pass messages/es/approach.json + approachUi.json

**Files:**
- Modify: `messages/es/approach.json` (lines 4, 9, 13, 14, 18, 19, 24, 28, 32)
- Modify: `messages/es/approachUi.json` (lines 5, 13, 17, 21)

- [ ] **Step 1: approach.json edits.** Read the file, then apply per line against the en source (`messages/en/approach.json`):
  - line 4 (meta): "revisiones de dirección" -> "juntas de seguimiento"; "puntos de control de prueba de concepto" -> "puntos de control de POC".
  - lines 9, 13, 14, 18, 19, 28: every `patrocinador(es)` -> `sponsor(s)` (e.g. line 13 title becomes "Cómo se vive un proyecto desde la perspectiva del sponsor").
  - line 24: "descubrimiento pagada... fija el alcance" -> "discovery pagado... fija el scope".
  - line 28: align to the en card content ("Regular steering reviews... keep sponsors in control of scope... throughout") in the approved register: "Juntas de seguimiento periódicas, un backlog compartido y puntos de decisión claros mantienen a los sponsors en control del scope, el presupuesto y las prioridades en todo momento."
  - line 32: "prueba de concepto" -> "POC".
  - remaining `alcance` (engagement-scope sense, lines 14, 28) -> `scope`.
- [ ] **Step 2: approachUi.json edits.** CRITICAL: preserve the `<art>...</art>` ICU rich-text tags exactly around replacements (mismatched tags break next-intl parsing):
  - line 5: "El patrocinador sale con un `<art>`alcance fijo`</art>`" -> "El sponsor sale con un `<art>`scope fijo`</art>`"; "descubrimiento pagado" -> "discovery pagado".
  - line 13: `patrocinador` -> `sponsor`; `alcance` -> `scope`.
  - line 17: "una `<art>`prueba de concepto`</art>` enfocada" -> "un `<art>`POC`</art>` enfocado" (gender: el POC).
  - line 21: both "cifras" -> "números" with agreement ("los números en los que los equipos confían hoy", "Los nuevos números ganan su credibilidad").
- [ ] **Step 3: Verify**

```bash
grep -nE "patrocinador|prueba de concepto|descubrimiento|\bcifras?\b" messages/es/approach.json messages/es/approachUi.json
```

Expected: no output. Then `npm run typecheck` (catches nothing here but keeps the habit) and spot-render:

```bash
npm run dev & sleep 6 && curl -s http://localhost:3000/es/approach | grep -oE "sponsor|scope|POC|discovery" | sort | uniq -c; kill %1
```

Expected: all four terms present in the rendered page.

- [ ] **Step 4: Commit**

```bash
git add messages/es/approach.json messages/es/approachUi.json && git commit -m "feat(i18n): approach es voice pass (sponsor/POC/discovery/scope, numeros)"
```

### Task 5: Voice-pass messages/es/services.json

**Files:**
- Modify: `messages/es/services.json` (lines 33, 58, 71-92, 114, 120, 123)

- [ ] **Step 1: Apply, each against its own en source string in `messages/en/services.json`:**
  - lines 33, 58: `cifras` -> `números` (adjust articles/adjectives for gender).
  - run.phases block (lines 71-92): line 80 becomes "Juntas de seguimiento periódicas, un backlog compartido y puntos de decisión claros mantienen a los sponsors en control del scope, el presupuesto y las prioridades en todo momento."; line 85 `prueba de concepto` -> `POC`; line 75 `descubrimiento` -> `discovery`.
  - line 114: "Definimos el scope del trabajo en un discovery pagado y breve" (replaces "alcance del trabajo" and "descubrimiento").
  - line 120: "trabajo guiado por el discovery".
  - line 123: "Discovery, POCs y scope cambiante".
- [ ] **Step 2: Verify**

```bash
grep -nE "patrocinador|prueba de concepto|descubrimiento|\bcifras?\b|alcance" messages/es/services.json
```

Expected: no output (if a remaining `alcance` is genuinely not engagement scope, leave it and note why in the commit body).

- [ ] **Step 3: Commit**

```bash
git add messages/es/services.json && git commit -m "feat(i18n): services es voice pass"
```

### Task 6: Voice-pass messages/es/pricing.json

**Files:**
- Modify: `messages/es/pricing.json` (lines 4, 14, 26, 31, 32, 42, 48, 52, 63)

- [ ] **Step 1: Apply all nine edits** (masculine articles: "el scope", "el discovery"):
  - line 4: "El alcance y el precio" -> "El scope y el precio"
  - line 14: "Alcance claro." -> "Scope claro."
  - line 26: "Un alcance, un cronograma..." -> "Un scope, un cronograma..."
  - line 31: "guiado por el descubrimiento" -> "guiado por el discovery"
  - line 32: "Descubrimiento, POCs y alcance cambiante" -> "Discovery, POCs y scope cambiante"
  - line 42: "un descubrimiento pagado fija el alcance y el precio" -> "un discovery pagado fija el scope y el precio"; "que el patrocinador conoce" -> "que el sponsor conoce"
  - line 48: "estimado con alcance definido" -> "estimado con scope definido"
  - line 52: "dentro del alcance" -> "dentro del scope"
  - line 63: "el alcance queda fijado en un descubrimiento pagado" -> "el scope queda fijado en un discovery pagado"
- [ ] **Step 2: Verify**

```bash
grep -nE "alcance|descubrimiento|patrocinador" messages/es/pricing.json
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add messages/es/pricing.json && git commit -m "feat(i18n): pricing es voice pass"
```

### Task 7: Voice-pass platform/migrations/methodology es catalogs

**Files:**
- Modify: `messages/es/platform.json` (lines 83, 92)
- Modify: `messages/es/platformUi.json` (lines 8, 39, 43)
- Modify: `messages/es/migrationsUi.json` (lines 16, 26, 46)
- Modify: `messages/es/methodology.json` (line 4)
- Modify: `messages/es/migrations.json` (lines 9, 89, 99)

- [ ] **Step 1: Apply:**
  - `tablero(s)` -> `dashboard(s)` preserving capitalization ("Tableros" -> "Dashboards"): platform.json:83,92; platformUi.json:8,39; migrationsUi.json:16,46.
  - `descubrimiento` -> `discovery`: platformUi.json:43; methodology.json:4 ("desde el discovery").
  - `cifras` -> `números` with gender agreement: migrationsUi.json:26; migrations.json:9, 89, 99 (line 99 example: "la reconciliación de fila, agregado y hash que demuestra que los números nuevos coinciden con los anteriores").
- [ ] **Step 2: Verify**

```bash
grep -nE "tablero|descubrimiento|\bcifras?\b" messages/es/platform.json messages/es/platformUi.json messages/es/migrationsUi.json messages/es/methodology.json messages/es/migrations.json
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add messages/es/platform.json messages/es/platformUi.json messages/es/migrationsUi.json messages/es/methodology.json messages/es/migrations.json && git commit -m "feat(i18n): platform/migrations/methodology es vocabulary (dashboards, discovery, numeros)"
```

### Task 8: Sweep remaining es catalogs (juntas, cifras, vanity metrics)

**Files:**
- Modify: `messages/es/dataAi.json` (lines 25, 40)
- Modify: `messages/es/about.json` (line 60)
- Modify: `messages/es/security.json` (line 47)
- Modify: `messages/es/nearshore.json` (line 58)
- Modify: `messages/es/contentData.json` (lines 40, 47)
- Modify: `messages/es/lifeAtViewnear.json` (line 45)

- [ ] **Step 1: Apply:**
  - dataAi.json:40 full replacement (meeting noun + cifra + trailing pronoun gender): "...para que la junta del lunes empiece desde el mismo número y no desde tres versiones de él."
  - dataAi.json:25: `cifras` -> `números` (agreement).
  - about.json:60: "Sin cifras de vanidad: ..." -> "Sin métricas de vanidad: ..." (matches nearshore's approved phrasing).
  - security.json:47, contentData.json:40 and 47: `cifras` -> `números` (agreement).
  - nearshore.json:58: eyebrow `"En cifras"` -> `"En números"`.
  - lifeAtViewnear.json:45: "salas de reuniones" -> "salas de juntas". Do NOT touch verb forms (reunirnos/reunirse/reunidas) in lifeAtViewnear.json:38-39/78/90 or strips.json:26/34.
- [ ] **Step 2: Verify**

```bash
grep -rnE "\bcifras?\b" messages/es/ | grep -v cifrado
grep -rn "salas de reuniones" messages/es/
```

Expected: no output from either.

- [ ] **Step 3: Commit**

```bash
git add messages/es && git commit -m "feat(i18n): es catalog sweep (juntas, numeros, vanity metrics)"
```

### Task 9: Voice-pass Spanish DB seed content and reseed

**Files:**
- Modify: `prisma/seed/es/settings.ts` (lines 42, 50: faqsEs)
- Modify: `prisma/seed/es/blog.ts` (line 34 and any sibling teasers)
- Modify: `prisma/seed/es/industries.ts` (lines 15, 34, 47)
- Modify: `prisma/seed/content/blog/agi-ready-data-cloud.es.md` (lines 5, 45, 48)
- Modify: `prisma/seed/content/case-studies/corporate-mdm-golden-record.es.md` (line 6), `real-time-student-data-pipeline.es.md` (line 27), `construction-cad-data-foundation.es.md` (lines 3, 6, 15, 16, 25)
- Modify (regenerated): `prisma/content-snapshot.json`

- [ ] **Step 1: seed/es TypeScript overlays.** In settings.ts faqsEs and line 42: "prueba de concepto" -> "POC", "revisiones de dirección periódicas" -> "juntas de seguimiento periódicas". blog.ts:34: "Comience con una prueba de concepto enfocada" -> "Comience con un POC enfocado". industries.ts: line 15 and 34 "Tableros" -> "Dashboards"; line 47 "cifras actuales y confiables" -> "números actuales y confiables". Leave `prisma/seed/es/settings.ts` hero blob untouched (it IS the exemplar).
- [ ] **Step 2: Markdown bodies.** Whole-word `cifra(s)` -> `número(s)` with gender agreement ONLY in the five files listed above (e.g. agi-ready line 5 "Las cifras" -> "Los números", line 45 "nuestras cifras de ventas" -> "nuestros números de ventas", line 48 "la cifra exacta en dólares" -> "el número exacto en dólares"). Do NOT run a blanket replace: `zero-copy-cloning-snowflake.es.md:67` and `data-warehouse-revolution-five-years.es.md:59` contain `cifrado` (encryption), which must not change.
- [ ] **Step 3: Verify the sweep is clean**

```bash
grep -rnE "\bcifras?\b|prueba de concepto|patrocinador|Tableros" prisma/seed/es prisma/seed/content | grep -v cifrado
```

Expected: no output.

- [ ] **Step 4: Reseed and export** (local Postgres must be running)

```bash
npm run db:seed && npm run content:export
git status --short prisma/content-snapshot.json
```

Expected: seed completes; content-snapshot.json shows as modified.

- [ ] **Step 5: Commit**

```bash
git add prisma/seed prisma/content-snapshot.json && git commit -m "feat(i18n): es seed content voice pass + snapshot"
```

---

## Workstream 3: i18n plumbing

### Task 10: ConsentBanner i18n, locale link, and dialog semantics

Merges three findings (hardcoded English banner, English privacy link on /es, `role="dialog"` with no focus management). NOTE: Workstream 9 (consent lifecycle) builds on this component; do this task first.

**Files:**
- Create: `messages/en/consent.json`, `messages/es/consent.json`
- Modify: `app/[locale]/layout.tsx` (CLIENT_NS list ~line 94-99; move `<ConsentBanner />` from line 109 to inside the provider closing on line 108)
- Modify: `components/ConsentBanner.tsx`

**Interfaces:**
- Produces: namespace `consent` with keys `ariaLabel`, `body`, `privacyLink`, `decline`, `accept` (Workstream 9 adds more keys to this file).

- [ ] **Step 1: Create the catalogs**

`messages/en/consent.json`:
```json
{
  "ariaLabel": "Cookie consent",
  "body": "We use cookies to understand site usage and improve the experience. See our {privacyLink}.",
  "privacyLink": "Privacy Policy",
  "decline": "Decline",
  "accept": "Accept"
}
```

`messages/es/consent.json` (formal usted register):
```json
{
  "ariaLabel": "Consentimiento de cookies",
  "body": "Usamos cookies para entender el uso del sitio y mejorar la experiencia. Consulte nuestro {privacyLink}.",
  "privacyLink": "Aviso de Privacidad",
  "decline": "Rechazar",
  "accept": "Aceptar"
}
```

(If the current JSX interleaves the link differently, adapt keys; the point is every visible string and the aria-label come from the catalog. Match the actual sentence structure in the component when wiring `t.rich`.)

- [ ] **Step 2: Wire the layout.** In `app/[locale]/layout.tsx`: add `"consent"` to the `CLIENT_NS` array, and move `<ConsentBanner />` so it renders INSIDE `NextIntlClientProvider` (it currently sits outside, which is why `useTranslations` would throw today). Leave `<Analytics />` where it is.

- [ ] **Step 3: Rework the component.** In `components/ConsentBanner.tsx`:
  - Replace `import Link from "next/link"` with `import { Link } from "@/i18n/navigation";`
  - Add `import { useTranslations } from "next-intl";` and `const t = useTranslations("consent");`
  - Replace `role="dialog"` (line 48) with `role="region"`, and `aria-label="Cookie consent"` with `aria-label={t("ariaLabel")}`. Do NOT add focus trapping; a region is the correct, non-hostile semantic for a consent bar.
  - Replace body copy, privacy-link text, and both button labels with `t(...)` / `t.rich("body", { privacyLink: (chunk) => <Link href="/privacy" ...>{chunk}</Link> })`.

- [ ] **Step 4: Verify.** `npm run typecheck`, then:

```bash
npm run dev & sleep 6
curl -s http://localhost:3000/es | grep -o "Consentimiento de cookies"
curl -s http://localhost:3000/es | grep -o 'href="/es/privacy"'
kill %1
```

Expected: both greps hit (first-visit HTML includes the banner; the link is locale-prefixed).

- [ ] **Step 5: Commit**

```bash
git add messages/en/consent.json messages/es/consent.json "app/[locale]/layout.tsx" components/ConsentBanner.tsx
git commit -m "fix(i18n,a11y): localize consent banner, locale-aware privacy link, region semantics"
```

### Task 11: Localized 404 pages and locale catch-all

**Files:**
- Create: `messages/en/notFound.json`, `messages/es/notFound.json`
- Create: `app/[locale]/[...rest]/page.tsx`
- Modify: `app/[locale]/not-found.tsx`

- [ ] **Step 1: Catalogs.** Keys: `metaTitle`, `metaDescription`, `eyebrow`, `heading`, `body`, `backHome`, `contact`, and one label per LINKS chip (`services`, `industries`, `caseStudies`, `resources`, `contactChip`). English mirrors the current hardcoded copy ("This page wandered off." etc.); Spanish in formal usted (e.g. heading "Esta página no existe", body "El enlace puede estar roto o la página pudo haberse movido. Vuelva al inicio o contáctenos y le ayudamos a encontrar lo que busca.", backHome "Volver al inicio", contact "Contáctenos").

- [ ] **Step 2: Rework `app/[locale]/not-found.tsx`:**
  - `import { Link } from "@/i18n/navigation";` instead of next/link (all six links keep their hrefs; the wrapper adds /es).
  - Make the component async and read copy with `const t = await getTranslations("notFound");` (locale context is available; the layout calls `setRequestLocale`).
  - Replace the static `export const metadata` with `export async function generateMetadata() { const t = await getTranslations("notFound"); return { title: t("metaTitle"), description: t("metaDescription") }; }`

- [ ] **Step 3: Catch-all so arbitrary bad URLs under /es hit this boundary** (today they fall through to the English root `app/not-found.tsx` with `lang="en"`). Create `app/[locale]/[...rest]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export default function CatchAll({ params }: { params: { locale: string } }) {
  if (routing.locales.includes(params.locale as never)) {
    setRequestLocale(params.locale);
  }
  notFound();
}
```

(Match the exact locale-validation + setRequestLocale idiom used by sibling pages; adjust the import names to what `i18n/routing.ts` actually exports.)

- [ ] **Step 4: Verify**

```bash
npm run typecheck && npm run dev & sleep 6
curl -s http://localhost:3000/es/no-such-page | grep -o 'lang="es"'
curl -s http://localhost:3000/es/no-such-page | grep -o 'href="/es/services"' | head -1
kill %1
```

Expected: both greps hit.

- [ ] **Step 5: Commit**

```bash
git add "app/[locale]/not-found.tsx" "app/[locale]/[...rest]" messages/en/notFound.json messages/es/notFound.json
git commit -m "fix(i18n): localized 404 with locale catch-all; links keep /es prefix"
```

### Task 12: Localize the error boundary

**Files:**
- Modify: `app/[locale]/error.tsx`
- Modify: `messages/en/misc.json`, `messages/es/misc.json` (or a new `errorPage` namespace; follow whichever pattern Task 10 established)
- Modify: `app/[locale]/layout.tsx` (add the namespace to CLIENT_NS; error.tsx is a client component)

- [ ] **Step 1:** Add keys `title` ("Something went wrong" / "Algo salió mal"), `body`, `tryAgain` ("Try again" / "Intentar de nuevo"), `backHome` ("Back home" / "Volver al inicio"). In `error.tsx`: swap `import Link from "next/link"` for `import { Link } from "@/i18n/navigation"`, read copy via `useTranslations`, keep the `reset()` button behavior.
- [ ] **Step 2: Verify:** `npm run typecheck` passes; temporarily throw inside a page to eyeball the es boundary if convenient, then revert.
- [ ] **Step 3: Commit** `git commit -m "fix(i18n): localize error boundary and keep /es on its home link"`

### Task 13: Pass locale to formatDate (12 call sites)

**Files:**
- Modify: `app/[locale]/(marketing)/blog/page.tsx` lines 81, 82, 114, 115
- Modify: `app/[locale]/(marketing)/blog/[slug]/page.tsx` lines 171, 191, 265, 266
- Modify: `app/[locale]/(marketing)/resources/page.tsx` lines 101, 102, 161, 162

- [ ] **Step 1:** At each call, change `formatDate(x)` to `formatDate(x, locale as Locale)`. `locale` is already in scope in all three files and `Locale` from `@/lib/i18n-content` is already imported. Both branches of each ternary call formatDate; do not miss the second one.
- [ ] **Step 2: Verify**

```bash
grep -rn "formatDate(" "app/[locale]/(marketing)" components | grep -v "locale"
```

Expected: no output. Then on the dev server: `curl -s http://localhost:3000/es/blog | grep -oE "de (enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)" | head -1` returns a Spanish month.

- [ ] **Step 3: Commit** `git commit -m "fix(i18n): Spanish dates on blog and resources pages"`

### Task 14: Translate hardcoded aria-labels (nav logo, breadcrumbs, locale switcher)

**Files:**
- Modify: `components/marketing/Nav.tsx:444`
- Modify: `components/marketing/Breadcrumbs.tsx:17`
- Modify: `components/marketing/LocaleSwitcher.tsx:11`
- Modify: `messages/en/nav.json`, `messages/es/nav.json`, `messages/en/sharedUi.json`, `messages/es/sharedUi.json`

- [ ] **Step 1: Nav logo link.** Add to nav.json: en `"homeAriaLabel": "{brand} home"`, es `"homeAriaLabel": "Inicio de {brand}"`. At Nav.tsx:444: `aria-label={t("homeAriaLabel", { brand: theme.brand.name })}`.
- [ ] **Step 2: Breadcrumbs.** Breadcrumbs.tsx is a server component with NO "use client": add `import { useTranslations } from "next-intl";` (synchronous hook works in server components), `const t = useTranslations("sharedUi");`, and `aria-label={t("breadcrumbAria")}`. Add `"breadcrumbAria": "Breadcrumb"` / `"breadcrumbAria": "Ruta de navegación"` to sharedUi.json en/es.
- [ ] **Step 3: LocaleSwitcher.** Add nav.json keys naming the TARGET language in that language: en `"switchToTarget": "Cambiar a español"`, es `"switchToTarget": "Switch to English"`. Use `aria-label={t("switchToTarget")}` and add `lang={other} hrefLang={other}` to the Link.
- [ ] **Step 4: Verify:** `npm run typecheck`; on dev server `curl -s http://localhost:3000/es | grep -o "Inicio de Viewnear"` hits.
- [ ] **Step 5: Commit** `git commit -m "fix(a11y,i18n): translated aria-labels for nav logo, breadcrumbs, locale switcher"`

### Task 15: Stop surfacing raw English API errors in ApplicationForm

**Files:**
- Modify: `components/marketing/ApplicationForm.tsx:66`

- [ ] **Step 1:** Mirror ContactForm: replace the `err.message` passthrough with the translated generic error, i.e. the catch branch always sets `t("application.error")`. (The richer alternative, stable error codes from `/api/careers` mapped to `forms.application.errors.*` keys in BOTH en and es catalogs, is acceptable if Workstream 8 already touches the route; otherwise keep it simple.)
- [ ] **Step 2: Verify:** `npm run typecheck`; grep the component for `err.message`, expect no output.
- [ ] **Step 3: Commit** `git commit -m "fix(i18n): never surface raw API error strings on /es application form"`

### Task 16: Localize dynamic OG images (blog, case studies, industries)

**Files:**
- Modify: `app/[locale]/(marketing)/blog/[slug]/opengraph-image.tsx`
- Modify: `app/[locale]/(marketing)/case-studies/[slug]/opengraph-image.tsx`
- Modify: `app/[locale]/(marketing)/industries/[slug]/opengraph-image.tsx`

Do NOT touch `news/[slug]/opengraph-image.tsx` (dormant).

- [ ] **Step 1:** In each file: type params as `{ params: { locale: string; slug: string } }`, thread locale into the query (e.g. `getBlogPostBySlug(params.slug, params.locale as Locale)`), and localize the eyebrow/fallback strings with a small inline map, e.g. blog: `{ en: { eyebrow: "Blog", fallback: "Field notes" }, es: { eyebrow: "Blog", fallback: "Notas de campo" } }`; case studies: es eyebrow "Casos de éxito", fallback "Caso de éxito"; industries: replace the hardcoded template with locale-branched text (es: `` `${industry.name}: datos e IA en Snowflake` ``).
- [ ] **Step 2: Verify**

```bash
npm run dev & sleep 6
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/es/blog/why-snowflake-ai-strategy-matters/opengraph-image"
kill %1
```

Expected: 200 (and when eyeballed, the image shows the Spanish title).

- [ ] **Step 3: Commit** `git commit -m "fix(seo,i18n): dynamic og images render localized titles"`

### Task 17: Localize static OG images (root, platform, partnership, services)

**Files:**
- Modify: `app/[locale]/opengraph-image.tsx`, `app/[locale]/(marketing)/platform/opengraph-image.tsx`, `.../partnership/opengraph-image.tsx`, `.../services/opengraph-image.tsx`

- [ ] **Step 1:** Change each default export to accept `{ params }: { params: { locale: string } }` and pick eyebrow/title from an inline en/es map. Keep "THINK · BUILD · GROW" and "Data + AI" in English (brand vocabulary). Localize the root image's tagline via the map, not by editing `theme`.
- [ ] **Step 2 (alt text):** static `export const alt` cannot vary by locale. Either accept English alt (fine) or replace the static exports with `generateImageMetadata({ params })` returning localized `alt` + `size` + `contentType`. Choose ONE approach and apply it consistently to all four files.
- [ ] **Step 3: Verify:** dev server; `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/es/opengraph-image` returns 200.
- [ ] **Step 4: Commit** `git commit -m "fix(seo,i18n): static og images branch on locale"`

### Task 18: Localize JSON-LD URLs (breadcrumbs + article/case/job)

**Files:**
- Modify: `lib/seo.ts` (`breadcrumbLd`, ~line 79 `absolute()`)
- Modify: `components/marketing/Breadcrumbs.tsx` (~line 14)
- Modify: `app/[locale]/(marketing)/blog/[slug]/page.tsx:112`, `case-studies/[slug]/page.tsx:112`, `careers/[slug]/page.tsx:89`
- Modify: direct page-level `breadcrumbLd(...)` callers: about, pricing, services, security, industries index pages

- [ ] **Step 1: lib/seo.ts.** Give `breadcrumbLd` an optional `locale` param (default `"en"`) and a locale-aware resolver that mirrors pageMeta's isHome behavior: for es, path `"/"` or `""` resolves to `${base}/es` (NO trailing slash), any other relative path to `${base}/es${path}`; absolute URLs pass through; en behaves as today.
- [ ] **Step 2: Breadcrumbs.tsx.** Get the locale via `useLocale()` from next-intl and pass it to `breadcrumbLd`. Do NOT prefix the visible Link hrefs (the i18n Link already auto-prefixes; pre-prefixing renders /es/es/...).
- [ ] **Step 3: Page-level JSON-LD.** In the three detail pages, build entity URLs with a shared helper or inline: `const localePath = locale === "es" ? "/es" : "";` then e.g. `mainEntityOfPage: \`${theme.brand.url}${localePath}/blog/${post.slug}\``. Pass `params.locale` to the direct `breadcrumbLd` calls on the five static pages.
- [ ] **Step 4: Verify**

```bash
npm run dev & sleep 6
curl -s http://localhost:3000/es/blog/why-snowflake-ai-strategy-matters | grep -o '"mainEntityOfPage":"[^"]*"'
kill %1
```

Expected: URL contains `/es/blog/`.

- [ ] **Step 5: Commit** `git commit -m "fix(seo,i18n): structured-data URLs match the rendering locale"`

---

## Workstream 4: SEO and metadata

### Task 19: Restore og:image on every page + og:site_name

**Files:**
- Modify: `lib/seo.ts` (~lines 36-52)

Background (verified empirically): Next 14 replaces the `openGraph` object per segment, so the site-wide default image in `app/[locale]/layout.tsx` never survives `pageMeta`, and the `[locale]`-level `opengraph-image.tsx` is suppressed because that layout's metadata declares an `images` key. Today only the 7 routes with their own `opengraph-image.tsx` get any social image.

- [ ] **Step 1:** In `pageMeta`, add a `DEFAULT_OG` constant pointing at the brand's default social image (reuse whatever `app/[locale]/layout.tsx:26` declares) and a new `ownOgFile?: boolean` option. Behavior: if `image` is passed, use it (current behavior); else if `ownOgFile` is true, OMIT the `images` key entirely (so the route's `opengraph-image.tsx` file wins); else fall back to `DEFAULT_OG`. Apply the same to `twitter.images`.
- [ ] **Step 2:** Set `ownOgFile: true` in the `pageMeta` calls of the 7 routes that have their own `opengraph-image.tsx`: platform, partnership, services, industries/[slug], blog/[slug], case-studies/[slug], news/[slug].
- [ ] **Step 3:** Add `siteName: theme.brand.name` to the openGraph object built in pageMeta (~line 50), and update the now-false comment at lines 36-40 describing a layout fallback that does not exist.
- [ ] **Step 4: Verify**

```bash
npm run dev & sleep 6
curl -s http://localhost:3000/ | grep -c "og:image"          # expect >= 1
curl -s http://localhost:3000/about | grep -c "twitter:image" # expect >= 1
curl -s http://localhost:3000/platform | grep -o 'og:image" content="[^"]*opengraph-image[^"]*"' | head -1  # file route still wins
curl -s http://localhost:3000/ | grep -c "og:site_name"       # expect 1
kill %1
```

- [ ] **Step 5: Commit** `git commit -m "fix(seo): default og:image fallback + og:site_name on every page"`

### Task 20: Real HTTP 404s for unknown content slugs

**Files:**
- Delete: `app/[locale]/loading.tsx`
- Modify: `app/[locale]/(marketing)/blog/[slug]/page.tsx` (~line 41), `case-studies/[slug]/page.tsx` (~line 40), `industries/[slug]/page.tsx` (~line 44), `careers/[slug]/page.tsx` (~line 34)

Background (verified): the root streaming boundary flushes a 200 shell before `notFound()` runs, so dead URLs answer HTTP 200 (soft 404). With the root `loading.tsx` gone, unknown slugs return real 404s with no page changes. Do NOT use `dynamicParams=false` (content is admin-created after deploy).

- [ ] **Step 1:** `git rm "app/[locale]/loading.tsx"`. (This also removes the English "Loading" aria-label finding; nothing else needs to change. If a per-section spinner is ever wanted back, add `loading.tsx` only inside segments that do NOT wrap the four DB-backed detail routes.)
- [ ] **Step 2:** Defense-in-depth: in each of the four `generateMetadata` fallback returns, add `robots: { index: false, follow: false }` (matching the pattern in `news/[slug]/page.tsx:38`).
- [ ] **Step 3: Verify on a production build** (dev server does not reproduce):

```bash
npm run build && npm run start & sleep 8
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/blog/no-such-post   # expect 404
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/es/case-studies/nope # expect 404
kill %1
```

- [ ] **Step 4: Commit** `git commit -m "fix(seo): unknown slugs return real 404s (drop root streaming boundary)"`

### Task 21: Sitemap honesty (lastmod + x-default)

**Files:**
- Modify: `app/sitemap.ts` (lines ~51 and ~60)

- [ ] **Step 1:** In `langs()`, add `"x-default": p ? `${base}${p}` : base` so sitemap hreflang clusters match on-page alternates.
- [ ] **Step 2:** Stop stamping the request time on the 19 static routes: drop the `lastModified` field for static paths (keep the honest per-record `updatedAt` on dynamic entries).
- [ ] **Step 3: Verify:** `curl -s http://localhost:3000/sitemap.xml | grep -c "x-default"` returns > 0, and static URLs carry no `<lastmod>`.
- [ ] **Step 4: Commit** `git commit -m "fix(seo): sitemap x-default + honest lastmod"`

### Task 22: FAQPage JSON-LD on one page only

**Files:**
- Modify: `app/[locale]/(marketing)/page.tsx` (~line 70)

- [ ] **Step 1:** Delete the `faqLd` construction and its `<JsonLd>` emission from the home page; keep the visible FAQ teaser section. `/faq` remains the only FAQPage markup.
- [ ] **Step 2: Verify:** `curl -s http://localhost:3000/ | grep -c "FAQPage"` returns 0; `curl -s http://localhost:3000/faq | grep -c "FAQPage"` returns 1.
- [ ] **Step 3: Commit** `git commit -m "fix(seo): FAQPage structured data only on /faq"`

### Task 23: Tighten over-length meta descriptions

**Files:**
- Modify: `messages/en/home.json:4`, `messages/es/home.json` (meta), `messages/es/migrations.json`, `messages/es/partnership.json`, `messages/es/dataAi.json`, `messages/es/about.json`, `messages/es/approach.json` (meta blocks)

- [ ] **Step 1:** Rewrite each `meta.description` to <= 160 characters with the differentiator in the first ~155 chars (en home is currently 255; es home 268, es migrations 251, es partnership 237, es dataAi 226, es approach 216). Spanish rewrites keep the usted register, IA not AI (except "Data + AI"), and no banned words.
- [ ] **Step 2: Verify**

```bash
python3 - <<'EOF'
import json, glob
for f in glob.glob('messages/*/[a-z]*.json'):
    try: d = json.load(open(f))
    except Exception: continue
    m = d.get('meta', {})
    desc = m.get('description', '')
    if len(desc) > 165: print(f, len(desc))
EOF
```

Expected: no output.

- [ ] **Step 3: Commit** `git commit -m "fix(seo): meta descriptions within SERP length"`

---

## Workstream 5: Accessibility

### Task 24: Visible, AA-compliant focus indicators

**Files:**
- Modify: `app/globals.css` (line ~65 global `:focus-visible`; line ~149 `.btn` rule)

- [ ] **Step 1:** Change the global focus outline color from `rgb(var(--color-primary))` (2.37:1 on white) to `rgb(var(--color-primary-deep))` (#0B6E99, 4.9:1).
- [ ] **Step 2:** In the `.btn` rule, replace `focus-visible:ring-primary/50` with `focus-visible:ring-primaryDeep` (full opacity). Keep `focus:outline-none` only if the ring fully replaces it.
- [ ] **Step 3: Verify:** tab through the home page in a browser; every link/button shows a clearly visible deep-blue indicator. `npm run typecheck` passes (CSS only, but keep the gate).
- [ ] **Step 4: Commit** `git commit -m "fix(a11y): focus indicators meet 3:1 non-text contrast"`

### Task 25: Mega-menu keyboard behavior (Escape restore + close on focus exit)

**Files:**
- Modify: `components/marketing/Nav.tsx` (Escape handler ~line 484; menu `<li>` ~line 483)

- [ ] **Step 1: Escape.** The current handler hides the panel while a panel link is focused, dropping focus to `<body>`. Rework so focus is restored BEFORE closing (order matters: the trigger button has `onFocus={() => openMega(item.label)}` at ~line 495, so closing first then focusing reopens it):

```tsx
onKeyDown={(e) => {
  if (e.key !== "Escape") return;
  e.stopPropagation();
  const trigger = e.currentTarget.querySelector<HTMLButtonElement>('button[aria-haspopup]');
  restoringFocus.current = true;      // ref flag; openMega no-ops while set
  trigger?.focus();
  restoringFocus.current = false;
  setOpenMenu(null);
}}
```

Add `const restoringFocus = useRef(false);` and guard `openMega` with `if (restoringFocus.current) return;`.

- [ ] **Step 2: Focus exit.** On the same mega-menu `<li>`, add:

```tsx
onBlur={(e) => {
  if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenMenu(null);
}}
```

so the panel and the full-page scrim close when tab focus leaves the menu.

- [ ] **Step 3: Verify manually:** keyboard-only: open a mega panel with focus, tab into a link, press Escape (focus lands on the trigger, panel closed, panel does not reopen); tab from the last panel link out to the CTA (panel + scrim close).
- [ ] **Step 4: Commit** `git commit -m "fix(a11y): mega menu escape restores focus; closes when focus leaves"`

### Task 26: Text-contrast fixes (menu group headers + muted token)

**Files:**
- Modify: `components/marketing/Nav.tsx:578`
- Modify: `app/globals.css` (`--color-muted` definition) and `config/theme.ts` (keep the two in sync; theme.ts is the source of truth)

- [ ] **Step 1:** Nav.tsx:578: drop the alpha modifiers: `text-accentDeep/80` -> `text-accentDeep`, `text-royal/75` -> `text-royal` (lighten via font-weight if a lighter look is wanted, never via alpha on small text).
- [ ] **Step 2:** Darken muted so it clears 4.5:1 on surface2: in `config/theme.ts` change `muted` from `"92 115 133"` (#5C7385, 4.44:1 on #EAF4FB) to `"84 108 126"` (#546C7E), and mirror wherever globals.css declares the var if it is not generated from theme.ts.
- [ ] **Step 3: Verify:** contrast-check the new pairs (e.g. with a quick script or webaim): #546C7E on #EAF4FB >= 4.5, #B45309 on #F6FAFD >= 4.5. Visually skim pages for any muted text that now looks off.
- [ ] **Step 4: Commit** `git commit -m "fix(a11y): AA text contrast for menu headers and muted token"`

### Task 27: Footer heading levels

**Files:**
- Modify: `components/marketing/Footer.tsx:89`

- [ ] **Step 1:** Change the four footer column titles from `<h4>` to `<h2>` keeping the exact same className (visual style is unchanged; h2 after the page h1 is always a valid outline).
- [ ] **Step 2: Verify:** `grep -n "<h4" components/marketing/Footer.tsx` returns nothing; `npm run typecheck`.
- [ ] **Step 3: Commit** `git commit -m "fix(a11y): footer headings no longer skip levels"`

---

## Workstream 6: Design system

### Task 28: Fix warm-band-before-sunset-CTA on four templates

**Files:**
- Modify: `app/[locale]/(marketing)/blog/page.tsx` (~line 89), `resources/page.tsx` (~line 136), `blog/[slug]/page.tsx` (~line 239, related posts), `careers/[slug]/page.tsx` (~line 161)

Rule: never a warm band directly before the sunset CTA, AND every page keeps at least one warm band. So do not just cool the final band: MOVE the warm treatment one slot earlier on each page.

- [ ] **Step 1:** Per template: make the band immediately before `<CtaBand />` cool (remove `section-warm`, use plain `section` or `section-tint`), and add `section-warm` to an earlier band: blog index -> warm an earlier band (e.g. the band before the post grid); resources -> warm the first resource Section instead of the conditional last one; blog/[slug] -> warm an earlier article-adjacent band, not related-posts; careers/[slug] -> warm the role-details Section (~line 100s), not the ApplicationForm band. If a page truly has no sensible earlier slot, keep all bands cool and add a `panel-warm` callout inside a cool band (warm-on-cool pops).
- [ ] **Step 2: Verify**

```bash
for f in "app/[locale]/(marketing)/blog/page.tsx" "app/[locale]/(marketing)/resources/page.tsx" "app/[locale]/(marketing)/blog/[slug]/page.tsx" "app/[locale]/(marketing)/careers/[slug]/page.tsx"; do
  grep -c "section-warm" "$f"
done
```

Expected: each file still contains exactly one `section-warm` (or a documented panel-warm fallback), and reading each file confirms the section right before `<CtaBand />` is not warm. Screenshot-skim the four pages.

- [ ] **Step 3: Commit** `git commit -m "fix(design): warm band no longer abuts the sunset CTA on four templates"`

### Task 29: One dark authority slab per page on /data-ai

**Files:**
- Modify: `app/[locale]/(marketing)/data-ai/page.tsx` (~lines 84-120)

- [ ] **Step 1:** Keep `BuiltWithAnthropic` (line ~167) as the page's single `panel-indigo` moment. Convert the line-84 slab to the light panel treatment used on `case-studies/[slug]:161` and `life-at-viewnear:474`: container class `panel-dark relative overflow-hidden rounded-3xl p-7 shadow-xl md:p-12` (`.panel-dark` is a light gradient-mesh panel in globals.css:275 despite the name), and retint its inner typography: `eyebrow--invert` -> `eyebrow`, `text-white` heading -> default foreground, `text-white/75` and `text-white/70` -> `text-muted`, white footnote link -> `text-primaryDeep`. The LedgerCard children already work on light surfaces.
- [ ] **Step 2: Verify:** `grep -c "panel-indigo" "app/[locale]/(marketing)/data-ai/page.tsx" components/marketing/data-ai/BuiltWithAnthropic.tsx` totals 1 across both. Screenshot the page: one dark band only, line-84 panel legible.
- [ ] **Step 3: Commit** `git commit -m "fix(design): single dark authority band on /data-ai"`

### Task 30: Replace raw hex with tokens (codeInk + fill-foreground)

**Files:**
- Modify: `config/theme.ts`, `tailwind.config.ts`, `components/marketing/data-ai/BuiltWithAnthropic.tsx:44`, `app/globals.css` (~line 318), `components/marketing/migrations/Crossing.tsx:87`

- [ ] **Step 1:** Register the mock code-editor navy as a token: in `config/theme.ts` add `codeInk: "10 17 48", // #0a1130 mock code-editor surface on .panel-indigo`, expose it in `tailwind.config.ts` exactly like sibling tokens, then replace `bg-[#0a1130]` with `bg-codeInk` in BuiltWithAnthropic.tsx:44. (Do NOT use `bg-royalDeep`: the panel's own gradient starts at royalDeep, the editor window must stay darker than the panel.)
- [ ] **Step 2:** Same-pass sibling: `.panel-indigo` in globals.css (~line 318) hardcodes `rgb(12 20 56)` in its gradient; register/reuse a token or `var(--color-royal-deep)` math so the gradient endpoint is tokenized too (add `panelInk: "12 20 56"` if needed).
- [ ] **Step 3:** Crossing.tsx:87: `fill-[#0f2530]` -> `fill-foreground`.
- [ ] **Step 4: Verify**

```bash
grep -rnE "\[#[0-9a-fA-F]{3,8}\]" app components | grep -vE "node_modules"
```

Expected: no marketing-surface hits (admin-only hits, if any, are out of scope; list them in the commit body instead of fixing).

- [ ] **Step 5: Commit** `git commit -m "fix(design): tokenize code-editor navy and SVG fill (no raw hex)"`

### Task 31: Warm-on-cool corrections (/pricing nested panel, /nearshore cyan tiles)

**Files:**
- Modify: `app/[locale]/(marketing)/pricing/page.tsx:111`
- Modify: `app/[locale]/(marketing)/nearshore/page.tsx:158`

- [ ] **Step 1:** pricing:111: the `panel-warm` callout sits inside a `section-warm` band and vanishes. Replace its class with `card p-8` (`.card` supplies rounded-2xl, border, surface, shadow-soft; utility `p-8` overrides the component p-6). Do not move the panel or cool the band (the page must keep its warm band).
- [ ] **Step 2:** nearshore:158: the four delivery-card icon tiles use reserved cyan on a warm band at ~1.7:1. Replace `bg-secondary/15 text-secondary` with `text-accentDeep` on `bg-accent/10` (matches the warm band; alternatively `text-primaryDeep` on `bg-primary/15`, the pricing checklist pattern). Remember the 5-step opacity rule: `/10` and `/15` are valid.
- [ ] **Step 3: Verify:** screenshot both pages; the pricing callout reads as a distinct card, nearshore icons clearly visible.
- [ ] **Step 4: Commit** `git commit -m "fix(design): pricing callout pops again; nearshore tiles match warm band"`

### Task 32: Standardize on Glacier elevation tokens

**Files:**
- Modify: ~15 call sites: `app/[locale]/(marketing)/page.tsx:261`, `about/page.tsx:166`, `data-ai/page.tsx:84`, `case-studies/[slug]/page.tsx:161,204`, `life-at-viewnear/page.tsx:474`, `contact/page.tsx:69,101`, `blog/[slug]/page.tsx:202`, `components/marketing/data-ai/BuiltWithAnthropic.tsx:17,44`, `CoverCard.tsx:147`, `TeamCard.tsx:42`
- Possibly modify: `tailwind.config.ts` (optional `soft-xl` token)

- [ ] **Step 1:** Replace stock shadows: `shadow-xl`/`shadow-2xl` on large panels and image frames -> `shadow-soft-lg` (or add a `soft-xl` token to tailwind.config.ts first if the slabs visibly need more depth; decide once, apply everywhere); `shadow-lg`/`shadow-md` on small cards/hover states -> `shadow-soft`.
- [ ] **Step 2: Verify**

```bash
grep -rnE "shadow-(sm|md|lg|xl|2xl)\b" "app/[locale]/(marketing)" components/marketing | grep -v shadow-soft
```

Expected: no output. Screenshot home + about to confirm the panels still read elevated.

- [ ] **Step 3: Commit** `git commit -m "fix(design): Glacier soft shadows everywhere"`

### Task 33: Document the warm/cool rhythm in the design system doc

**Files:**
- Modify: `docs/design-system.md` (Layout conventions, ~line 71)

- [ ] **Step 1:** Add a "Warm/cool rhythm" subsection documenting: the classes (`.section-warm`, `.panel-sunset`, `.panel-warm`, `.panel-indigo`, `.panel-dark`), the rules (alternate warm/cool; never two warm bands adjacent; never a warm band directly before the sunset CTA; every page keeps at least one warm moment; hero + data cards untouched; warm-on-cool pops for callouts), and update the stale "Sections alternate white / section-tint" bullet. Also correct the stale HeroDiagram references (lines ~59, ~79) if Task 56 deletes it. No em dashes in the new text.
- [ ] **Step 2: Commit** `git commit -m "docs(design): record warm/cool rhythm rules"`

---

## Workstream 7: Security hardening

### Task 34: Escape breadcrumb JSON-LD through the shared JsonLd component

**Files:**
- Modify: `components/marketing/Breadcrumbs.tsx` (~line 46)

- [ ] **Step 1:** Delete the inline `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />` and render `<JsonLd data={jsonLd} />` instead (`components/JsonLd.tsx` already applies `.replace(/</g, "\\u003c")` before injecting). One escaped code path for all structured data.
- [ ] **Step 2: Verify:** `grep -rn "dangerouslySetInnerHTML" components/marketing/` returns nothing; view-source a blog post page and confirm the BreadcrumbList script is still present.
- [ ] **Step 3: Commit** `git commit -m "fix(security): breadcrumb JSON-LD goes through the escaping JsonLd component"`

### Task 35: Rate limiter: trusted IP extraction + eviction

**Files:**
- Modify: `lib/ratelimit.ts` (clientIp ~lines 33-36; buckets Map ~line 11)

- [ ] **Step 1: clientIp.** Stop trusting the leftmost X-Forwarded-For token (attacker-supplied). Behind Render's single trusted proxy, take the RIGHTMOST entry:

```ts
const xff = req.headers.get("x-forwarded-for");
if (xff) {
  const parts = xff.split(",");
  return parts[parts.length - 1]!.trim();
}
```

Remove (or move below the XFF branch AND treat as last resort) the `x-real-ip` fallback; it is equally client-settable. After deploying, confirm empirically: `curl -H "X-Forwarded-For: 1.2.3.4" https://<prod-host>/api/contact ...` and check the logged/limited key is NOT 1.2.3.4.

- [ ] **Step 2: Eviction.** At the top of `rateLimit()` add an opportunistic sweep (spoofed unique keys are written once and never read again, so lazy delete-on-read does not help):

```ts
if (buckets.size > 10_000) {
  for (const [k, b] of buckets) if (now > b.resetAt) buckets.delete(k);
}
```

- [ ] **Step 3:** Keep the in-memory design (single Render instance) but note in the file header that multi-instance deploys need a shared store (Upstash), as the existing comment already suggests.
- [ ] **Step 4: Verify:** `npm run test` (ratelimit.test.ts exists; update its expectations for the rightmost-XFF change and add a test for the sweep).
- [ ] **Step 5: Commit** `git commit -m "fix(security): rate limiter uses trusted XFF hop and evicts stale buckets"`

### Task 36: Rate-limit admin login

**Files:**
- Modify: `lib/auth.ts` (authorize, ~line 31)

- [ ] **Step 1:** NextAuth v4 passes the request as the second authorize arg. Key primarily on the normalized email, secondarily on IP, and check BEFORE the prisma lookup:

```ts
async authorize(credentials, req) {
  if (!credentials?.email || !credentials.password) return null;
  const email = credentials.email.toLowerCase();
  const ip = (req?.headers?.["x-forwarded-for"] as string | undefined)?.split(",").pop()?.trim() ?? "unknown";
  if (!rateLimit(`login:${email}`, { limit: 5, windowMs: 15 * 60_000 }).ok ||
      !rateLimit(`login-ip:${ip}`, { limit: 20, windowMs: 15 * 60_000 }).ok) {
    return null; // NextAuth surfaces a generic CredentialsSignin error
  }
  // ...existing lookup + bcrypt.compare...
```

(Adapt to `lib/ratelimit.ts`'s actual return shape; check its signature first. Do NOT implement this in middleware.ts: edge module state is not shared with the Node handlers.)

- [ ] **Step 2: Verify:** with `ADMIN_ENABLED=true npm run dev`, submit 6 wrong passwords to /admin/login; the 6th fails immediately even with the correct password until the window passes. `npm run typecheck`.
- [ ] **Step 3: Commit** `git commit -m "fix(security): brute-force rate limit on admin credentials login"`

### Task 37: Close the DNS-rebinding TOCTOU in image-from-url

**Files:**
- Modify: `app/api/image-from-url/route.ts` (~line 97)

- [ ] **Step 1:** The route validates resolved IPs, then `fetch()` re-resolves DNS independently. Pin the connection to the already-validated address with an undici dispatcher (Node runtime):

```ts
import { Agent } from "undici";
// after the lookup + private/metadata check passes, with addrs the validated list:
const pinned = new Agent({
  connect: {
    lookup: (_host, _opts, cb) => cb(null, addrs.map(a => ({ address: a.address, family: a.family })) as never),
  },
});
imgRes = await fetch(parsed.toString(), { redirect: "error", dispatcher: pinned } as RequestInit & { dispatcher: unknown });
```

(The dispatcher option is untyped in DOM fetch types; cast as shown or `as any`. Keep TLS verification intact by NOT rewriting the URL to a bare IP. Check undici's lookup callback signature against the installed version and adapt; `node:dns` lookup-style `(err, address, family)` single-result form also works.)

- [ ] **Step 2: Verify:** `npm run typecheck`; exercise the route from the admin image dialog with a normal https image URL (still works) and with `http://localhost/x.png` (still rejected).
- [ ] **Step 3: Commit** `git commit -m "fix(security): pin image-from-url fetch to the validated IP (DNS rebinding)"`

### Task 38: Stream-cap pexels/select downloads

**Files:**
- Modify: `app/api/pexels/select/route.ts` (~lines 80-85)

- [ ] **Step 1:** Replace the buffer-then-check with the image-from-url pattern: reject early when `Content-Length` is finite and > MAX_BYTES (413); otherwise read `imgRes.body` via `getReader()`, accumulate chunks with a running total, `reader.cancel()` + 413 the moment total > MAX_BYTES; `Buffer.concat(chunks)` at the end; 400 on empty body.
- [ ] **Step 2: Verify:** `npm run typecheck`; select a Pexels image from the admin editor and confirm it still saves.
- [ ] **Step 3: Commit** `git commit -m "fix(security): pexels select enforces size cap while streaming"`

### Task 39: Baseline Content-Security-Policy

**Files:**
- Modify: `next.config.mjs` (headers array, ~line 34)

- [ ] **Step 1:** Add to the existing headers array:

```js
{ key: "Content-Security-Policy", value: "object-src 'none'; base-uri 'self'; frame-ancestors 'self'" },
```

This is safe today (no script-src, so Next inline bootstrap and GA are unaffected). Do NOT add an enforced `script-src` without nonces. Optionally also add a `Content-Security-Policy-Report-Only` with a candidate script-src to gather data.

- [ ] **Step 2: Verify:** `curl -sI http://localhost:3000/ | grep -i content-security-policy` shows the header; site renders normally.
- [ ] **Step 3: Commit** `git commit -m "fix(security): baseline CSP (object-src, base-uri, frame-ancestors)"`

### Task 40: Stop the seed from resetting the admin password

**Files:**
- Modify: `prisma/seed/seed.ts` (~line 44)

- [ ] **Step 1:** Guard both upsert branches:

```ts
const seedPassword = process.env.SEED_ADMIN_PASSWORD;
if ((process.env.NODE_ENV === "production" || process.env.RENDER) && !seedPassword) {
  throw new Error("SEED_ADMIN_PASSWORD must be set when seeding production");
}
const password = seedPassword || "changeme123"; // dev-only fallback
const passwordHash = await bcrypt.hash(password, 10);
await prisma.user.upsert({
  where: { email },
  update: { role: "admin", name, ...(seedPassword ? { passwordHash } : {}) },
  create: { email, name, role: "admin", passwordHash },
});
```

Re-running the seed locally without the var no longer downgrades an existing password; production seeding without the var fails loudly before creating anything.

- [ ] **Step 2: Verify:** run `npm run db:seed` twice locally (no error, password unchanged on second run when var unset); `SEED_ADMIN_PASSWORD=x RENDER=1 npm run db:seed` succeeds, `RENDER=1 npm run db:seed` (unset) throws.
- [ ] **Step 3: Commit** `git commit -m "fix(security): seed never silently resets admin password; prod requires SEED_ADMIN_PASSWORD"`

### Task 41: CRITICAL: take applicant resumes off the public bucket

**Files:**
- Modify: `prisma/schema.prisma` (JobApplication: add `resumeKey String?`)
- Modify: `lib/storage/index.ts`, `lib/storage/s3.ts`, `lib/storage/local.ts` (private-access saves)
- Modify: `app/api/careers/route.ts` (~line 71 and the notify block ~line 101)
- Create: `app/api/admin/resume/[id]/route.ts`
- Modify: `.env.example` (document `S3_PRIVATE_BUCKET`)

Background (verified): resumes are PutObject'd with no ACL into the public R2 bucket (`S3_PUBLIC_URL=https://pub-*.r2.dev`) under keys built from the applicant's filename + `Date.now().toString(36)`, and the public URL is persisted and emailed. Keys are guessable (bounded ms window x common names like "resume"/"cv"), so third parties can enumerate and download real applicant PII.

- [ ] **Step 1: Schema.** Add `resumeKey String?` to `model JobApplication`. Deploys via the existing `prisma db push` build step; run `npx prisma db push && npx prisma generate` locally.
- [ ] **Step 2: Storage API.** Extend the adapter signature: `save(buffer, filename, mimeType, opts?: { access?: "public" | "private" })`.
  - `s3.ts`: when `access === "private"`, use bucket `env("S3_PRIVATE_BUCKET")` (a NEW bucket with public access disabled; falls back with a thrown error if unset in production, console.warn + public-random-key fallback in dev), and key `private/resumes/${crypto.randomUUID()}${safeExt}`. Return `{ url: null, storageKey: key }` for private saves. Type note: rather than widening `StoredFile.url` to `string | null` (which ripples into the public media callers: upload, pexels/select, image-from-url), add a discriminated result or a separate `savePrivate()` method returning `{ storageKey: string }`; pick whichever keeps the three media routes untouched.
  - `local.ts`: when private, write under `path.join(process.cwd(), "var", "private-uploads")` (outside `public/`), same UUID key, return `url: null`.
  - Keep the human filename ONLY as metadata (S3 `ContentDisposition: attachment; filename="..."` with the sanitized name).
- [ ] **Step 3: Careers route.** Call `getStorage().save(buffer, resume.name || "resume", resume.type, { access: "private" })`; persist `resumeKey: stored.storageKey` and set `resumeUrl` to `null` (legacy rows keep their old value). In the notify() email body, replace the raw resume link with the admin surface: `Resume: ${process.env.NEXTAUTH_URL ?? "https://viewnear.com"}/api/admin/resume/<application-id>` (send the email AFTER `prisma.jobApplication.create` so the id exists).
- [ ] **Step 4: Admin download route.** Create `app/api/admin/resume/[id]/route.ts`: authenticate exactly like the existing admin APIs (mirror the `getServerSession(authOptions)` + role check in `app/api/upload/route.ts`), load the application, then: s3 driver -> issue a 5-minute pre-signed GET (`npm i @aws-sdk/s3-request-presigner`, `getSignedUrl(client, new GetObjectCommand({ Bucket: privateBucket, Key: app.resumeKey }), { expiresIn: 300 })`) and 302-redirect to it; local driver -> stream the file from `var/private-uploads` with `Content-Type: application/octet-stream` and `Content-Disposition: attachment`. 404 when `resumeKey` is null (legacy rows keep using their stored public resumeUrl until manually migrated).
- [ ] **Step 5: Ops note (manual, record in the PR description):** create the private R2 bucket, set `S3_PRIVATE_BUCKET` on Render, and migrate/delete the existing public resume objects.
- [ ] **Step 6: Verify:** locally with driver `local`: submit an application with a PDF from /careers/<slug>; confirm the file lands in `var/private-uploads` (NOT `public/uploads`), the DB row has `resumeKey` set and `resumeUrl` null, and `/api/admin/resume/<id>` downloads when signed in and 401/403s when not. `npm run typecheck && npm run test`.
- [ ] **Step 7: Commit** `git commit -m "fix(security)!: applicant resumes stored privately with admin-only, expiring access"`

### Task 42: Validate resume uploads by content, not client MIME

**Files:**
- Modify: `app/api/careers/route.ts` (~lines 60-71)

- [ ] **Step 1:** `resume.type` is attacker-controlled; the original extension survives into the stored key. Enforce server-side:

```ts
const RESUME_EXTS: Record<string, string> = { ".pdf": "application/pdf", ".doc": "application/msword", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };
function sniffResume(buf: Buffer): ".pdf" | ".doc" | ".docx" | null {
  if (buf.subarray(0, 5).toString("latin1") === "%PDF-") return ".pdf";
  if (buf.readUInt32BE(0) === 0xd0cf11e0) return ".doc";           // OLE compound file
  if (buf.readUInt32BE(0) === 0x504b0304) return ".docx";          // ZIP (OOXML)
  return null;
}
```

After reading the buffer: `const ext = sniffResume(buffer); if (!ext) return 415;` and pass a SERVER-CHOSEN name to storage: `getStorage().save(buffer, `resume${ext}`, RESUME_EXTS[ext], { access: "private" })` so neither the extension nor the base name comes from the client. Keep the existing size check.

- [ ] **Step 2:** Note: `.docx`/`.doc` sniffing is container-level (any ZIP/OLE passes); that is acceptable because files are now private, never served from a web origin, and downloaded as attachments (Task 41). The XSS vector needed origin-served HTML/SVG, which the extension allowlist now excludes.
- [ ] **Step 3: Verify:** submit a real PDF (accepted); rename an .html file to resume.pdf and submit (rejected 415); `npm run typecheck`.
- [ ] **Step 4: Commit** `git commit -m "fix(security): magic-byte validation and server-chosen names for resume uploads"`

---

## Workstream 8: Lead pipeline integrity

### Task 43: notify() must surface Resend HTTP failures

**Files:**
- Modify: `lib/notify.ts` (~line 21)

- [ ] **Step 1:** After the fetch:

```ts
if (!res.ok) {
  const body = await res.text().catch(() => "");
  console.error(`[notify] Resend ${res.status}: ${body}`);
  throw new Error(`Resend responded ${res.status}`);
}
```

This makes the callers' existing `.catch` handlers (contact route line ~57, careers route line ~107) live code instead of dead code.

- [ ] **Step 2: Verify:** `npm run test`; with a bogus `RESEND_API_KEY=re_invalid` submit the contact form locally and confirm a `[notify] Resend 401` log appears while the form submission still succeeds for the user (lead is persisted first).
- [ ] **Step 3: Commit** `git commit -m "fix(leads): Resend HTTP errors are logged, not swallowed"`

### Task 44: Persist the contact enquiry type

**Files:**
- Modify: `prisma/schema.prisma` (model Lead: add `role String?`)
- Modify: `app/api/contact/route.ts` (~line 40)
- Modify: `app/admin/(panel)/leads/page.tsx`

- [ ] **Step 1:** Add nullable `role String?` to `model Lead`; `npx prisma db push && npx prisma generate`.
- [ ] **Step 2:** In the `prisma.lead.create` data, add `role: data.role || null`.
- [ ] **Step 3:** Render it in the admin leads table (small badge/text next to the name).
- [ ] **Step 4: Verify:** submit the contact form with enquiry type "migration"; the row in /admin/leads shows it. `npm run typecheck`.
- [ ] **Step 5: Commit** `git commit -m "fix(leads): persist enquiry type on Lead"`

### Task 45: ApplicationForm sends openingId + honeypot

**Files:**
- Modify: `components/marketing/ApplicationForm.tsx` (~lines 43, 74, 82)
- Modify: `app/[locale]/(marketing)/careers/[slug]/page.tsx` (~line 191)

- [ ] **Step 1: openingId.** Add an optional `openingId?: string` prop, render `<input type="hidden" name="openingId" value={openingId ?? ""} />` next to the existing openingTitle input, and pass `openingId={job.id}` from careers/[slug]/page.tsx. Keep the prop optional: `life-at-viewnear/page.tsx:642` legitimately renders a general `<ApplicationForm />` where null is correct.
- [ ] **Step 2: Honeypot.** Copy ContactForm's hidden honeypot block (input `name="website"`, tabIndex -1, autoComplete off, visually hidden wrapper, ContactForm.tsx ~lines 90-93) into ApplicationForm, AND mirror ContactForm.tsx:43's `if (el.name === "website") return;` skip in the client-side validity loop. The careers API already checks the field (route.ts ~lines 44, 52-54); today that check is dead code.
- [ ] **Step 3: Verify:** apply to a job locally; the JobApplication row has `openingId` set. `curl -X POST` the careers API with `website=spam` filled: request short-circuits. `npm run typecheck`.
- [ ] **Step 4: Commit** `git commit -m "fix(careers): applications record their opening; honeypot actually rendered"`

### Task 46: Admin surface for job applications

**Files:**
- Create: `app/admin/(panel)/applications/page.tsx`
- Modify: `app/admin/(panel)/layout.tsx` (~line 39, nav links)

- [ ] **Step 1:** Mirror `app/admin/(panel)/leads/page.tsx` exactly (same auth/layout/table idioms): `prisma.jobApplication.findMany({ include: { opening: true }, orderBy: { createdAt: "desc" } })`, columns: name, email, LinkedIn (link), opening title (fallback "General"), message, createdAt, and a Resume link pointing at `/api/admin/resume/<id>` when `resumeKey` is set (falls back to the legacy `resumeUrl` when present). Do NOT register jobApplication in `lib/admin/config.ts` (that config drives content CRUD; inbox data uses bespoke pages, same as Leads).
- [ ] **Step 2:** Add the nav link next to Leads in the admin panel layout.
- [ ] **Step 3: Verify:** /admin/applications lists the test application from Task 45 with a working resume download.
- [ ] **Step 4: Commit** `git commit -m "feat(admin): applications inbox page"`

### Task 47: Fail loudly when production storage is local

**Files:**
- Modify: `lib/storage/index.ts` (~line 20)

- [ ] **Step 1:** Mirror the NEXTAUTH_SECRET guard pattern from lib/auth.ts (per ADR 0028: "Production requires ... STORAGE_DRIVER=s3"):

```ts
const driver = process.env.STORAGE_DRIVER ?? "local";
if (process.env.NODE_ENV === "production" && driver === "local") {
  throw new Error("STORAGE_DRIVER=s3 is required in production (local uploads are ephemeral on Render)");
}
```

- [ ] **Step 2: Verify:** `npm run typecheck`; `NODE_ENV=production node -e "require('tsx/cjs'); ..."` is awkward, so verify via `npm run build && npm run start` with STORAGE_DRIVER unset locally only if uploads are exercised; the unit test in `lib/` (add one if trivial) or a code read is sufficient.
- [ ] **Step 3: Commit** `git commit -m "fix(storage): refuse local driver in production"`

---

## Workstream 9: Consent lifecycle (depends on Task 10)

### Task 48: Consent record + GA gated on consent + change events

**Files:**
- Create: `lib/consent.ts` (client helper)
- Modify: `components/ConsentBanner.tsx`
- Modify: `components/Analytics.tsx`

Background (verified): GA's gtag.js loads and `gtag('config')` fires for every visitor (before any choice, and forever after Decline; the stored value only ever upgrades to granted). Consent is a bare localStorage string with no version/timestamp, and Analytics does an exact `=== 'granted'` string compare, so the storage format and both consumers must change together.

- [ ] **Step 1: lib/consent.ts** (client-only module):

```ts
export type ConsentValue = "granted" | "denied";
export type ConsentRecord = { v: number; value: ConsentValue; ts: number };
const KEY = "vn-consent";
export const CONSENT_VERSION = 1;
const MAX_AGE_MS = 12 * 30 * 24 * 60 * 60 * 1000; // ~12 months, EDPB re-prompt window

export function readConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  if (raw === "granted" || raw === "denied") return { v: 0, value: raw, ts: 0 }; // legacy
  try {
    const rec = JSON.parse(raw) as ConsentRecord;
    if (rec.value !== "granted" && rec.value !== "denied") return null;
    return rec;
  } catch { return null; }
}
export function consentIsCurrent(rec: ConsentRecord | null): rec is ConsentRecord {
  // v0 = legacy bare-string records: honored indefinitely (do not re-prompt existing visitors)
  return !!rec && (rec.v === 0 || (rec.v >= CONSENT_VERSION && Date.now() - rec.ts < MAX_AGE_MS));
}
export function writeConsent(value: ConsentValue) {
  window.localStorage.setItem(KEY, JSON.stringify({ v: CONSENT_VERSION, value, ts: Date.now() }));
  window.dispatchEvent(new CustomEvent<ConsentValue>("vn-consent-change", { detail: value }));
}
export function openConsentBanner() {
  window.dispatchEvent(new Event("vn-consent-open"));
}
```

Decision baked in: legacy bare `"granted"`/`"denied"` strings (mapped to `v: 0` above) are honored, not re-prompted; new records carry version + timestamp so future policy changes CAN force a re-prompt by bumping `CONSENT_VERSION`.

- [ ] **Step 2: ConsentBanner.** Read via `readConsent()`/`consentIsCurrent()` on mount (show the banner when not current); write via `writeConsent(...)`; add a `window.addEventListener("vn-consent-open", ...)` that pre-loads the stored value and sets `show=true` (this is the reopen hook Task 49 uses). When the user picks Decline from a reopened banner, also call `window.gtag?.("consent", "update", { analytics_storage: "denied" })` so an active GA session downgrades without reload.
- [ ] **Step 3: Analytics.** Convert to a client component ("basic" Consent Mode): initialize state from `consentIsCurrent(readConsent()) && value === "granted"`, subscribe to `vn-consent-change`, and render the two `<Script>` tags ONLY when granted. Nothing loads from googletagmanager.com before consent or after Decline. Post-accept injection happens via the event subscription (no reload needed). Keep the `gtag('consent','default',...denied)` line inside the injected script as belt-and-braces.
- [ ] **Step 4: Verify** in a browser with devtools network panel: fresh profile -> no googletagmanager request before choosing; Accept -> gtag.js loads immediately; clear storage, Decline -> no gtag requests on subsequent navigations. `npm run typecheck`.
- [ ] **Step 5: Commit** `git commit -m "fix(privacy): GA loads only after consent; versioned consent record with change events"`

### Task 49: Cookie-settings entry point + privacy policy touch-up

**Files:**
- Modify: `components/marketing/Footer.tsx` (~line 113, legal row)
- Modify: `messages/en/footer.json`, `messages/es/footer.json`
- Modify: `messages/en/privacy.json:48`, `messages/es/privacy.json:48`
- Modify: `messages/en/consent.json`, `messages/es/consent.json` (settings label if placed in the consent namespace instead)

- [ ] **Step 1:** In the footer legal row next to the Privacy link, add a button (not a link): label from footer.json (`"cookieSettings": "Cookie settings"` / es `"cookieSettings": "Configuración de cookies"`), onClick `openConsentBanner()` from `lib/consent.ts`. The footer is a server component; wrap the button in a tiny client component (e.g. `components/marketing/CookieSettingsButton.tsx`, "use client", takes the label as a prop) so the footer stays server-rendered.
- [ ] **Step 2:** Extend the privacy policy cookies paragraph (en line ~48 and the es mirror, usted register): keep the existing browser-settings sentence and append one sentence describing the actual mechanism, e.g. en: "You can also change or withdraw your consent at any time using the Cookie settings link in the footer."; es: "También puede cambiar o retirar su consentimiento en cualquier momento con el enlace Configuración de cookies en el pie de página."
- [ ] **Step 3: Verify:** click Cookie settings in the footer on /es: the banner reopens in Spanish; choosing Decline stops GA (network panel). `npm run typecheck`.
- [ ] **Step 4: Commit** `git commit -m "feat(privacy): cookie settings reopen + accurate withdrawal copy (en/es)"`

---

## Workstream 10: Performance

### Task 50: Author avatars through next/image at their rendered size

**Files:**
- Modify: `components/marketing/CoverCard.tsx:112` (24px avatar)
- Modify: `app/[locale]/(marketing)/blog/[slug]/page.tsx:153` (48px header avatar)
- Modify: `components/marketing/article/AuthorBio.tsx:24` (64px bio avatar)

- [ ] **Step 1:** Replace each raw `<img>` with the project's `Img` wrapper (or `next/image` directly, matching whichever the surrounding file already uses), sized per call site: CoverCard `width={24} height={24} sizes="24px"`; post header `width={48} height={48} sizes="48px"`; AuthorBio `width={64} height={64} sizes="64px"`. Keep the existing rounded-full classes. Today these download the original ~1MB 900x900 team PNGs to paint 24-64px circles.
- [ ] **Step 2:** Remove the now-unneeded `eslint-disable @next/next/no-img-element` comments at all three sites.
- [ ] **Step 3: Verify:** dev server, network panel on /blog: avatar requests go through `/_next/image` at small widths. `npm run lint`.
- [ ] **Step 4: Commit** `git commit -m "perf: author avatars optimized at rendered size"`

### Task 51: Stop shipping admin edit-mode scaffolding to anonymous visitors

**Files:**
- Modify: `components/marketing/EditModeProvider.tsx` (~line 4)
- Modify: `app/[locale]/(marketing)/layout.tsx` (~line 58)

- [ ] **Step 1 (load-bearing half):** In EditModeProvider.tsx replace the static ImageEditOverlay import with a dynamic one so the 363-line editor (plus its Pexels UI) is code-split out of the shared bundle:

```tsx
import dynamic from "next/dynamic";
const ImageEditOverlay = dynamic(
  () => import("@/components/marketing/ImageEditOverlay").then((m) => m.ImageEditOverlay),
  { ssr: false }
);
```

(Adjust to the actual export name. Note: `components/marketing/Img.tsx:6` statically imports `useEditMode` from this module, so the provider itself stays in the bundle; only the overlay gets split, which is the bulk.)

- [ ] **Step 2:** In the server MarketingLayout, gate the providers on the same condition middleware uses (middleware.ts:6-7): `const adminEnabled = process.env.ADMIN_ENABLED === "true" || process.env.NODE_ENV === "development";` and render `<AuthProvider><EditModeProvider>...` only when true, plain children otherwise. Keep `ImageOverrideProvider` unconditional (visitors need overrides). This removes the guaranteed-failing `/api/auth/session` XHR fired on every anonymous page view. Safe: `EditModeCtx` has a default value (isAdmin false, noop openEditor) so `Img` degrades gracefully without the provider.
- [ ] **Step 3: Verify:** with ADMIN_ENABLED unset and `npm run build && npm run start`: network panel shows NO `/api/auth/session` request on the home page and no ImageEditOverlay chunk; with `ADMIN_ENABLED=true npm run dev`, admin edit mode still works end to end (sign in, toggle Edit images, open the overlay).
- [ ] **Step 4: Commit** `git commit -m "perf: code-split image editor; no auth/session fetch for anonymous visitors"`

### Task 52: Let next/image optimize the R2/S3 media host

**Files:**
- Modify: `components/marketing/Img.tsx` (~line 46)
- Modify: `next.config.mjs` (~lines 4-9), `.env.example`
- Modify: `components/marketing/CoverCard.tsx` (~lines 68-70, stale comment)

- [ ] **Step 1:** Today `unoptimized={isRemote || undefined}` bypasses optimization for ALL remote images, making the remotePatterns allowlist dead code. Plumb the public media host to the client: set `NEXT_PUBLIC_S3_PUBLIC_URL` (same value as S3_PUBLIC_URL) in .env.example and Render BUILD env; in next.config.mjs read `process.env.NEXT_PUBLIC_S3_PUBLIC_URL ?? process.env.S3_PUBLIC_URL` for remotePatterns.
- [ ] **Step 2:** In Img.tsx compute at module scope:

```tsx
let MEDIA_HOST: string | null = null;
try {
  MEDIA_HOST = process.env.NEXT_PUBLIC_S3_PUBLIC_URL ? new URL(process.env.NEXT_PUBLIC_S3_PUBLIC_URL).hostname : null;
} catch { MEDIA_HOST = null; }
```

and change line 46 to `unoptimized={(isRemote && (!MEDIA_HOST || new URL(effSrc as string).hostname !== MEDIA_HOST)) || undefined}`. When the env var is unset, behavior is unchanged (everything remote stays unoptimized, crash-safe).

- [ ] **Step 3:** Update the stale comment in CoverCard.tsx:68-70 documenting the blanket bypass.
- [ ] **Step 4: Verify:** with NEXT_PUBLIC_S3_PUBLIC_URL set locally, an admin-uploaded remote cover renders via `/_next/image`; without it, pages still render. `npm run typecheck`.
- [ ] **Step 5: Commit** `git commit -m "perf: optimize R2-hosted media through next/image"`

### Task 53: Consistent ISR on DB-backed index pages

**Files:**
- Modify: `app/[locale]/(marketing)/blog/page.tsx`, `case-studies/page.tsx`, `about/page.tsx`, `services/page.tsx`, `industries/page.tsx`, `contact/page.tsx`

- [ ] **Step 1:** Add `export const revalidate = 60;` to each (their detail routes already use 60s ISR; the indexes are currently frozen at build time, so manually seeded prod content appears on detail pages but never on indexes until redeploy).
- [ ] **Step 2: Verify:** `npm run build` output marks these routes ISR (revalidate: 60) rather than Static.
- [ ] **Step 3: Commit** `git commit -m "perf: index pages revalidate like their detail routes"`

### Task 54: PartnerBadges request sane image variants

**Files:**
- Modify: `components/marketing/PartnerBadges.tsx` (~lines 17, 53-60)

- [ ] **Step 1:** In the `logos` variant `<Image>`, add `sizes={size === "sm" ? "70px" : "140px"}` (footer badges render 56-68px wide, page-body ones ~112-136px; today a DPR-2 visitor downloads a ~3820w variant for the footer). Also correct the `coco-preferred.png` entry's declared dimensions to the file's actual 900x741 (verify with `sips -g pixelWidth -g pixelHeight public/assets/images/certs/coco-preferred.png`).
- [ ] **Step 2: Verify:** network panel: footer badge requests are <= 256w variants.
- [ ] **Step 3: Commit** `git commit -m "perf: partner badges request footer-sized variants"`

### Task 55: Dedupe double Prisma queries on detail routes

**Files:**
- Modify: `lib/queries.ts`

- [ ] **Step 1:** Wrap the four by-slug getters in React cache: `import { cache } from "react";` then `export const getBlogPostBySlug = cache(async (slug: string, locale?: Locale) => { ... });` for `getBlogPostBySlug`, `getCaseStudyBySlug`, `getIndustryBySlug`, `getJobOpeningBySlug`. generateMetadata + page currently run each query twice per render; cache() dedupes per-request with zero call-site changes.
- [ ] **Step 2: Verify:** `npm run typecheck && npm run test`; detail pages still render both locales.
- [ ] **Step 3: Commit** `git commit -m "perf: request-dedupe by-slug queries with React cache()"`

### Task 56: Dead weight: unused chart deps, stale blur manifest, dead hero components

**Files:**
- Modify: `package.json`, `package-lock.json`
- Modify (regenerated): `lib/blur-manifest.json`
- Delete: `components/marketing/home/HeroCarousel.tsx`, `PartnershipSlide.tsx`, `HeroDiagram.tsx`, `HorizonScene.tsx`, `MeshConverge.tsx`
- Modify: `components/marketing/Motion.tsx` (~line 269, `useHeroConverge`), `docs/design-system.md` (HeroDiagram refs, lines ~59/79), `docs/image-inventory-and-shotlist.md` (~line 13), `docs/CHANGELOG.md`, `messages/{en,es}/heroUi.json`, `messages/{en,es}/partnershipUi.json` (orphaned keys)

- [ ] **Step 1:** `npm uninstall chart.js react-chartjs-2` (verified imported nowhere; @uiw/react-md-editor stays, admin-only and dynamic).
- [ ] **Step 2:** `npm run blur` to regenerate `lib/blur-manifest.json` (the /platform and /migrations product screenshots currently fall back to the generic placeholder). Consider adding `npm run blur` to a pre-build or content-sync step; if added, wire it in package.json in this same commit.
- [ ] **Step 3:** Delete the five dead home components (zero importers, verified). Also remove `useHeroConverge` from Motion.tsx (only consumer was MeshConverge) and prune heroUi/partnershipUi keys that only those components consumed (keep any key another component still reads: grep each key before deleting). Do NOT delete `public/assets/images/certs/coco-momentum-summit-2026.png` (PartnershipHighlight still renders it). NOTE: docs/CHANGELOG.md line ~172 records HeroCarousel/PartnershipSlide as intentionally kept for reuse; this plan reverses that decision, so add a CHANGELOG entry recording the reversal.
- [ ] **Step 4: Verify:** `npm run typecheck && npm run lint && npm run test && npm run build` all pass; `grep -rn "HeroCarousel\|HeroDiagram\|HorizonScene\|MeshConverge\|PartnershipSlide\|useHeroConverge" app components lib` returns nothing.
- [ ] **Step 5: Commit** `git commit -m "chore: drop unused chart deps, dead hero components; refresh blur manifest"`

---

## Workstream 11: Repo hygiene

### Task 57: Remove the stale Prisma migrations directory

**Files:**
- Delete: `prisma/migrations/` (both migrations + `migration_lock.toml`)
- Modify: `docs/superpowers/specs/2026-06-14-sqlite-to-postgres-design.md` (stale migrate-reset reference)

- [ ] **Step 1:** `git rm -r prisma/migrations`. The history still creates the dropped Testimonial table and lacks ImageOverride and every *Es column; anyone running `prisma migrate dev/deploy/reset` gets a broken DB. The live workflow is `prisma db push` everywhere (build script + db:reset); nothing in package.json invokes `prisma migrate`.
- [ ] **Step 2:** Update the stale doc reference: the reset command is `npm run db:reset` (`prisma db push --force-reset && prisma db seed`).
- [ ] **Step 3: Verify:** `npm run db:reset` completes locally; `npm run build` completes.
- [ ] **Step 4: Commit** `git commit -m "chore(db): remove stale migrations; db push is the only schema path"`

### Task 58: Make the e2e suite runnable and unhardcode credentials

**Files:**
- Modify: `playwright.config.ts` (line 1 import; add webServer; baseURL)
- Modify: `package.json` (add `"e2e": "playwright test"`; drop the bare `playwright` devDependency)
- Modify: `e2e/image-editor-bugs.spec.ts` (~lines 15-16), `e2e/reposition-verify.spec.ts` (~lines 29-30, 207, 240)
- Create: `e2e/helpers.ts` (shared login)

- [ ] **Step 1:** Switch `playwright/test` imports to `@playwright/test` in the config AND both specs (three files); then `npm uninstall playwright` (the `@playwright/test` package remains).
- [ ] **Step 2:** Add to playwright.config.ts: `webServer: { command: "PORT=3005 npm run dev", url: "http://localhost:3005", reuseExistingServer: true }`. Change the two absolute `page.goto("http://localhost:3005/")` calls in reposition-verify.spec.ts to relative `page.goto("/")` so the port lives in one place.
- [ ] **Step 3:** Factor a login helper into `e2e/helpers.ts` reading `process.env.E2E_ADMIN_EMAIL ?? "admin@viewnear.com"` and `process.env.E2E_ADMIN_PASSWORD ?? "changeme123"`; use it in both specs.
- [ ] **Step 4: Verify:** `ADMIN_ENABLED=true npm run e2e` runs (pass/fail per spec is informative; the suite must at least launch and reach the app).
- [ ] **Step 5: Commit** `git commit -m "chore(e2e): runnable playwright suite, env-driven credentials"`

### Task 59: Small hygiene sweep

**Files:**
- Modify: `lib/storage/local.ts:15`
- Delete: the empty `undefined/` directory at repo root
- Modify: `.eslintrc.json` + 9 files carrying dead eslint-disable comments

- [ ] **Step 1:** local.ts filename stamp: `performance.now()` resets per process and collides across restarts. Match s3.ts and add entropy: `const stamp = Date.now().toString(36) + "-" + crypto.randomUUID().slice(0, 6);` (import crypto or use the global; also apply the same random suffix in s3.ts's safeName for media uploads while there).
- [ ] **Step 2:** `rmdir undefined` at the repo root (empty artifact of an unset shell variable, created Jul 6).
- [ ] **Step 3:** `@typescript-eslint/no-explicit-any` is globally off, so the ~12 per-line disables for it are dead. Keep the rule off and delete the dead comments (files include app/admin/actions.ts, lib/admin/build-data.ts, lib/admin/relations.ts, components/admin/EntityForm.tsx, components/marketing/Motion.tsx:88, scripts/content-sync.ts:55). Add `"reportUnusedDisableDirectives": true` to .eslintrc.json to catch future dead directives.
- [ ] **Step 4: Verify:** `npm run lint` (must be clean, including no unused-directive warnings) and `npm run typecheck`.
- [ ] **Step 5: Commit** `git commit -m "chore: upload stamp entropy, drop undefined dir, prune dead lint directives"`

---

## Workstream 12: Final verification

### Task 60: Full-sweep gate before PR

- [ ] **Step 1: Guard greps** (all must return nothing):

```bash
EMDASH=$(printf '\xe2\x80\x94')
grep -rl "$EMDASH" --include="*.tsx" --include="*.ts" --include="*.json" app components lib config messages prisma/seed/data.ts prisma/seed/es prisma/seed/content public/llms.txt | cat
grep -rniE "consultan|consulting|consultative|consultor" public app components messages config lib prisma/seed/data.ts prisma/seed/es | cat
grep -rnE "\bcifras?\b" messages/es prisma/seed/es prisma/seed/content | grep -v cifrado | cat
grep -rnoE "(bg|text|ring|border|fill|from|to|via)-[a-zA-Z]+([A-Za-z0-9-]*)/[0-9]+" app components --include="*.tsx" | grep -vE "/(5|10|15|20|25|30|35|40|45|50|55|60|65|70|75|80|85|90|95|100)([^0-9]|$)" | cat
grep -rniE "matillion|fivetran|thoughtspot|power ?bi|alation|tableau|looker|snowflake intelligence|cortex code" app components messages prisma/seed/data.ts config lib | cat
```

(If the third-party-brands grep hits inside `prisma/seed/content/blog/*.md` editorial bodies, list them for the owner rather than editing: long-form competitive commentary may be intentionally exempt; the style guide's guard covers UI surfaces.)

- [ ] **Step 2: Toolchain gate**

```bash
npm run typecheck && npm run lint && npm run test && npm run build
```

Expected: all pass.

- [ ] **Step 3: Runtime spot-checks** (`npm run start` after the build):

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/blog/no-such-post        # 404
curl -s http://localhost:3000/ | grep -c "og:image"                                      # >= 1
curl -s http://localhost:3000/es | grep -c 'lang="es"'                                   # 1
curl -s http://localhost:3000/es/approach | grep -c "sponsor"                            # >= 1
curl -sI http://localhost:3000/ | grep -ci "content-security-policy"                     # 1
```

- [ ] **Step 4: Visual pass:** skim home, /es home, approach, pricing, nearshore, data-ai, blog index, one blog post, contact, careers detail at desktop + 390px. Confirm the warm/cool rhythm reads right and focus indicators are visible.

- [ ] **Step 5: Open the PR** against `main` (or against the es-voice branch's PR if it has not merged), listing the workstreams and linking this plan. Include the Task 41 ops note (create private R2 bucket, set `S3_PRIVATE_BUCKET`, migrate existing resume objects, set `NEXT_PUBLIC_S3_PUBLIC_URL` build env).

---

## Appendix: severity index

Fix first if cherry-picking:

| Severity | Tasks |
|----------|-------|
| Critical | 41 (public resume PII), 42 (upload validation) |
| High | 1 (llms.txt), 4-9 (es voice), 10-13 (consent banner, 404, error, dates), 19 (og:image), 20 (soft 404), 24 (focus), 43-45 (notify, lead role, openingId), 48 (GA before consent), 50 (avatar payloads) |
| Medium | 2, 14-18, 21-23, 25-32, 34-40, 46, 47, 49, 51-55, 57 |
| Low / polish | 3, 33, 56, 58, 59 |

Notes for the implementer:
- Everything here was independently re-verified against the code on 2026-07-13; line numbers are anchors, not gospel. If a cited line moved, find the quoted evidence string.
- Known-accepted, do NOT "fix": `prisma db push` in the build script, dormant news code, manual seed on prod, the `data-visualisation` slug, placeholder client/team names.
- Out of scope, tracked separately: legal counsel review of machine-translated privacy/terms es pages; creating the private R2 bucket (ops); multi-instance shared rate limiting (single instance today).




