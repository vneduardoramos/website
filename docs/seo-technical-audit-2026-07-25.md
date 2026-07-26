# SEO technical audit: full crawl of production

Date: 2026-07-25. Audited commit: `f741144`. Target: `https://www.viewnear.com`.

> **Status: every finding below is fixed.** Re-measured with the same crawl
> against a local production build. Before → after:
>
> | Metric | Before | After |
> | --- | --- | --- |
> | Unknown URLs returning 200 (soft 404) | 7 of 7 probes | 0, all return 404 |
> | Dotted URLs (`/favicon.ico`, `*.xml`) | HTTP 500 | 404, favicon serves 200 |
> | Sitemap `lastmod` distinct days | 1 | 20 |
> | Titles over 60 chars | 66 of 124 (worst 114) | 0 (longest 60) |
> | Descriptions over 160 chars | 72 of 124 (worst 514) | 0 (longest 154) |
> | Pages with no `<h1>` | 2 | 0 |
> | Optimized image cache | `max-age=60` | `max-age=31536000` |
> | Blog posts with in-body topical links | 3 of 19 | 19 of 19 |
> | `/en` prefix redirect | 307 | 308 |
> | Regressions | n/a | none: 124/124 still 200, hreflang 124/124 reciprocal, canonicals 124/124, 0 images missing alt |
>
> Also fixed while in here: `npm run build` no longer dies at
> `max_connections` (every build worker was opening its own Prisma pool because
> `NODE_ENV=production` skipped the singleton), and `/es/contact`'s title no
> longer uses `ponga`, which broke the impersonal-Spanish rule.
>
> One residual, documented in `components/marketing/NotFoundView.tsx`: the 404
> **body** paints after hydration rather than in the streamed HTML. Status code,
> title and `noindex` are all correct, which is what search engines act on. See
> C1 for why fixing the paint would cost `<html lang>` on 62 Spanish URLs.

This is the **technical and structured-data** half of the SEO picture. The
content and keyword half is `docs/seo-keyword-audit-2026-07.md` (P0 to P2
shipped); this audit does not repeat it. Everything below was measured against
production, not inferred from source.

## Method

- Full crawl of all 124 sitemap URLs (62 en + 62 es), one request per URL,
  parsing title, description, canonical, `robots`, `hreflang`, headings,
  JSON-LD, images, internal links, and payload size.
- 28 status-code probes: bogus URLs per template, every configured redirect,
  locale-prefix normalization, case variance, well-known file paths.
- Header, compression, cache and TTFB sampling on 4 representative templates.
- Internal-link graph built twice: once including nav and footer chrome, once
  with both stripped, so "orphan" and "contextual link" are not confused.
- Structured-data field inspection against Google's required and recommended
  properties for `Article`, `JobPosting`, `Service`, `ProfessionalService`.

Raw crawl output: not committed (regenerate with the script in the session
scratchpad if needed).

## Scorecard

| Area | Result |
| --- | --- |
| Canonical tags | 124/124 correct, zero mismatches |
| Hreflang | 124/124 present, reciprocal, correct `en`/`es`/`x-default` |
| Image alt text | 922 images, 0 missing `alt`, 52 intentionally decorative |
| Duplicate titles / descriptions | 0 / 0 |
| Layout stability | 0 images without explicit dimensions |
| Host canonicalization | non-www 301 to www, matches canonical |
| Delivery | Cloudflare, gzip, Next cache HIT, TTFB 150 to 470ms |
| Status codes for unknown URLs | **broken**, see C1 and C2 |
| Sitemap freshness signal | **broken**, see H1 |
| Title / description length | **66 and 72 of 124 out of range**, see H2 |

The foundations that are usually wrong on a site this size are right here. The
findings below are concentrated in three places: error-status handling, the
freshness signal, and metadata length.

---

## Critical

### C1. Every unknown URL returns HTTP 200, and the server HTML is only a spinner

`notFound()` never produces a 404. Verified on `/no-such-page-xyz`,
`/blog/definitely-not-real`, `/services/totally-made-up`, `/case-studies/nope`,
`/industries/nope`, `/careers/nope`, `/es/no-such-page-xyz`, and
`/data-modernization` (removed, so it should 404). All return **200**.

Worse than the status code: the served HTML body is, in full,

```html
<body class="font-sans">
  <!--$!--><template data-dgst="NEXT_NOT_FOUND"></template>
  <div class="flex min-h-[60vh] items-center justify-center" aria-label="Loading" role="status">
    <span class="h-8 w-8 animate-spin rounded-full ..."></span>
  </div><!--/$-->
</body>
```

No `<h1>`, no nav, no footer, no links, and the generic homepage `<title>`
("Viewnear | Data & AI Practices | Snowflake Partner"). The real 404 content
exists only in the RSC payload and renders after hydration.

**Root cause:** `app/[locale]/loading.tsx` wraps the entire locale segment in a
Suspense boundary. `notFound()` throws inside that boundary, so Next streams the
Suspense fallback with a 200, tags it `data-dgst="NEXT_NOT_FOUND"`, and defers
the not-found UI to the client. `app/[locale]/not-found.tsx` (the good localized
404 with nav, footer and five recovery links) therefore **never renders
server-side at all**, in either locale.

Impact:
- Google Search Console will report these as Soft 404. Crawl budget is spent
  re-fetching URLs that should be closed off with a 404.
- Users see a spinner that resolves only if JS runs. With JS blocked or failed,
  the page is a permanent spinner with no way out.
- `role="status"` with `aria-label="Loading"` is announced to screen readers and
  never resolves server-side.

**Not affected:** indexing. `<meta name="robots" content="noindex">` *is*
present on these responses, so they will not enter the index. This narrows the
damage to crawl efficiency, GSC noise, and the user experience.

### C2. Every URL containing a dot returns HTTP 500

```
/favicon.ico      500   (2105 bytes, "500: Internal Server Error")
/opensearch.xml   500
/nonexistent.xml  500
```

`/icon.png` and `/apple-icon.png` return 200, so the site icon does work through
the `<link rel="icon">` tag that `app/icon.png` generates. But the conventional
`/favicon.ico` path, which browsers and crawlers request unprompted on nearly
every visit, throws a 500.

**Root cause:** the middleware matcher `"/((?!api|_next|_vercel|.*\\..*).*)"`
deliberately excludes any path containing a dot, so dotted URLs bypass
next-intl entirely and reach the App Router with no locale context and no
matching route. The response is the Pages Router error page (note
`next-head-count` in the markup), not `app/not-found.tsx`.

A 500 on `/favicon.ico` is also the kind of thing uptime and monitoring checks
flag as site instability.

---

## High

### H1. All 76 dynamic sitemap URLs share a single `lastmod`, and it is the deploy time

Every dynamic URL in `sitemap.xml` carries `lastmod: 2026-07-25`, the moment of
the last content import. Grouped by section: case studies 5/5, blog 19/19,
services 6/6, industries 7/7, careers 1/1, all identical, both locales.

`app/sitemap.ts` was written specifically to avoid this. Its comment reads:

> Dynamic content carries its real `updatedAt` so crawlers get an honest
> per-URL freshness signal (instead of every URL sharing the build time).

That intent is defeated by `scripts/content-sync.ts`, which upserts **every**
row on **every** deploy. The upsert writes each record whether or not its
content changed, so Prisma bumps `updatedAt` globally. The comment is now false.

This is a consequence of the natural-key content-sync fix shipped earlier today
(`f570496` lineage). Owning it: the pipeline change is what made every row's
`updatedAt` move in lockstep.

Impact: 76 URLs claim to change on every deploy. Google discounts `lastmod` it
learns is unreliable, so the site loses the freshness signal for the pages where
it would actually help (new blog posts, updated case studies).

Related: `Article.datePublished` on case studies is also the import timestamp
(`2026-07-25T17:48:03.738Z`, with `dateModified` 0.13s later), so every case
study claims to have been published today. Blog posts are fine here, they carry
a real `date` from seed (for example `2025-06-29`).

**Fix direction:** make the import skip writes when the payload is unchanged
(compare a content hash before upserting), or carry an explicit
`publishedAt`/`contentUpdatedAt` column that only moves on real edits and feed
*that* to the sitemap and to `Article`.

### H2. Titles too long on 66 of 124 URLs, descriptions too long on 72 of 124

Titles over ~60 characters get truncated in SERPs; descriptions over ~160.

| Metric | Count | Worst |
| --- | --- | --- |
| Title > 60 chars | 66 / 124 | 114 chars (`/es/case-studies/real-time-student-data-pipeline`) |
| Description > 160 chars | 72 / 124 | **514 chars** (`/es/case-studies/sku-catalog-governance`) |

The pattern is uniform: blog and case-study detail pages pass the full article
title and the full excerpt straight through to `<title>` and
`<meta name="description">`. Spanish is worse than English because the
translations run longer.

A 514-character description is not a near-miss, it is roughly 3.3x the limit.
These need a dedicated short `metaTitle` / `metaDescription` (or a truncation
helper at the `pageMeta` boundary), not hand-editing 72 pages.

Zero duplicates and zero missing values, so this is purely a length problem.

### H3. `/press` and `/es/press` have no `<h1>`

The page's heading sequence starts at `<h2>Coverage</h2>`. There is no `<h1>`
anywhere in the document. Every other page in the crawl has exactly one.

`/press` is also the thinnest page on the site at 284 words.

### H4. Industry pages waste the title and the H1 (7 pages, both locales)

| URL | Title (chars) | H1 |
| --- | --- | --- |
| `/industries/education` | "Education \| Viewnear" (20) | "Institutions are rich in student data and starved of insight." |
| `/industries/retail-cpg` | "Retail & CPG \| Viewnear" (23) | "Retail margin is thin. Data-driven decisions are where it's recovered." |
| `/industries/manufacturing` | "Manufacturing \| Viewnear" (24) | "The factory floor produces data faster than most teams can use it." |
| `/industries/technology-telco` | "Technology & Telco \| Viewnear" (29) | "Software and telco firms sit on usage data most companies would envy..." |
| `/industries/financial-services` | "Financial Services \| Viewnear" (29) | "In financial services, data is worth more than the products..." |

Three problems compound on each of these 14 URLs:

1. The title is the bare vertical name with no qualifier. Nothing about
   Snowflake, data, AI, or outcome. 20 to 45 characters, so there is room.
2. The H1 is an editorial hook that **does not contain the vertical keyword**.
   `/industries/manufacturing` never says "manufacturing" in its H1.
3. The meta description is a verbatim copy of the H1, so the snippet adds no
   information beyond the heading, and it runs short (61 to 111 chars).

The `/industries` index was rewritten in the earlier audit; these seven detail
pages were not in that list and still carry the original metadata. They are the
pages that would rank for sector-plus-technology queries.

---

## Medium

### M1. Optimized images are cached for 60 seconds

```
/_next/image?url=...&w=1920&q=75
  content-type: image/webp
  cache-control: public, max-age=60, must-revalidate
```

WebP conversion and sizing work correctly, but `images.minimumCacheTTL` is not
set in `next.config.mjs`, so Next's 60-second default applies. Optimized image
URLs are immutable for a given `url`+`w`+`q`, so this should be a year. Today
every repeat visitor revalidates every image after a minute.

### M2. Blog bodies contain no contextual internal links, and no topic clusters

Across all 19 posts, every internal link comes from template chrome. 16 of 19
have exactly the same two commercial targets, `/contact` and `/services`, which
are the shared CTA block. Only three posts link anywhere topical:

- `/blog/how-to-choose-a-snowflake-partner` to `/migrations`, `/nearshore`
- `/blog/nearshore-vs-offshore-snowflake` to `/nearshore`
- `/blog/snowflake-migration-cost` to `/migrations`, `/services/data-engineering`

There is **no post-to-post linking at all**, so the 19 posts form no topic
cluster. For a site whose organic upside is Snowflake informational terms
feeding commercial pages, this is the largest remaining on-site lever. The
markdown in `content/blog/*.md` is where the links belong.

For the record on orphans: there are none. Every page has inbound chrome links.
Four pages (`/`, `/privacy`, `/terms`, `/resources`) have **only** chrome links
and no contextual inbound link, which is normal for three of them.

### M3. Head terms with zero title or H1 presence

| Term | In any title | In any H1 |
| --- | --- | --- |
| "snowflake services" | 0 | 0 |
| "data governance" | 0 | 0 |
| "staff augmentation" | 0 | 0 |
| "snowflake developers / engineers / talent" | 0 | 0 |

`/pricing` and `/services` name the engagement models in body copy (shipped in
the earlier audit's P1 item 9), but no page puts them in a title or H1. Same for
data governance, which appears in `Organization.knowsAbout` schema and in prose
but never in a heading.

### M4. `JobPosting` has two schema correctness problems

```json
"applicantLocationRequirements": {"@type": "Country", "name": "Americas"}
"jobLocation": {"@type": "Place", "address": {"@type": "PostalAddress", "addressLocality": "Remote (Americas)"}}
```

"Americas" is not a country, so `Country.name` is invalid and likely to draw a
GSC warning. And with `jobLocationType: TELECOMMUTE` already set correctly, the
synthetic `jobLocation` with a locality of "Remote (Americas)" is redundant.
Google's guidance is `jobLocationType` plus a real
`applicantLocationRequirements` (list actual countries: US, Mexico, Canada).

### M5. Schema type and coverage gaps

- Blog posts use `Article` where `BlogPosting` is the more specific type.
- `/blog`, `/case-studies`, `/press`, `/resources` have no `BreadcrumbList` and
  no `CollectionPage` or `ItemList`. `/services` does have `ItemList`.
- `/careers/senior-data-ai-engineer` has `JobPosting` but no `BreadcrumbList`.
- The homepage carries `Organization` + `WebSite` only. Given the geography
  positioning, `ProfessionalService` (already used on 4 other pages via
  `lib/offices.ts`) would fit here too.
- `FAQPage` is emitted on 16 URLs. Worth knowing that Google removed FAQ rich
  results for non-authoritative sites in 2023, so these are correct markup that
  will not produce SERP features. No reason to remove them, but do not count on
  them.

### M6. `/en` and `/en/*` redirect with 307 instead of a permanent redirect

`/en` to `/`, and `/en/pricing` to `/pricing`, both **307** (temporary). These
URLs never legitimately exist under `localePrefix: "as-needed"`, so a permanent
redirect is the honest signal. This is next-intl's default behavior, so changing
it means overriding the middleware response.

Configured content redirects are all **308**, which is correct and equivalent to
301 for ranking purposes.

---

## Low

- **Team headshots are 950KB to 1.2MB PNGs** (7 files, about 7MB of the 28MB in
  `public/assets`). Served fine through `next/image` as WebP, so this is repo
  and build weight rather than a user-facing cost. Converting the originals
  would speed up builds.
- **Brotli is not used.** Responses come back `content-encoding: gzip` even when
  `br` is offered. Roughly 15 to 20% more bytes than necessary on HTML.
- **`/PRICING` returns 200** with the not-found body, a consequence of C1 rather
  than a separate issue. Once C1 is fixed this becomes a correct 404.
- **`npm run build` fails locally** at `max_connections=100` while prerendering
  163 pages (`FATAL: sorry, too many clients already`, `P2037`). This is a local
  Postgres limit, not a code defect, and production builds against Neon succeed.
  Still worth a `connection_limit` on the build-time datasource so a connection
  spike cannot produce a partially-exported deploy, given that the last silent
  content-pipeline failure went unnoticed for five commits.
- `/news` and `/thank-you` are correctly `noindex, nofollow` and correctly
  absent from the sitemap. Verified, no action.
- `robots.txt` is correct: allows all, disallows `/admin` and `/api`, declares
  the sitemap. `/admin` also returns 404 in production.

---

## Prioritized actions

**Do first, they are defects rather than optimizations**

1. **C2**, dotted URLs 500. Add a handler so `/favicon.ico` and any other dotted
   path returns 404 (or serve a real `favicon.ico`). Smallest fix on the list.
2. **C1**, soft 404s and the spinner. Either scope `loading.tsx` to the segments
   that need it instead of the whole locale root, or move the `notFound()`
   trigger outside the Suspense boundary. Verify by asserting a real 404 status
   and a rendered `<h1>` in the server HTML.
3. **H1**, sitemap `lastmod`. Make `content-sync import` skip unchanged rows, or
   introduce a column that only moves on real content edits.

**Then, ordered by ranking value per unit of work**

4. **H4**, industry titles, H1s and descriptions. 14 URLs, pure copy, and they
   are commercial pages currently spending their two strongest on-page elements
   on nothing.
5. **H2**, title and description length. Fix at the `pageMeta` boundary for blog
   and case studies rather than per page.
6. **M2**, contextual links in blog bodies plus post-to-post clustering.
7. **H3**, add an `<h1>` to `/press`.
8. **M1**, set `images.minimumCacheTTL`. One line.
9. **M3**, put the missing head terms into titles and H1s where honest.
10. **M4** and **M5**, schema corrections and the `BlogPosting` switch.
11. **M6**, low value, only if the middleware override is cheap.

**Still blocking measurement of all of the above**

Search Console remains unverified. `GOOGLE_SITE_VERIFICATION`,
`BING_SITE_VERIFICATION` and `NEXT_PUBLIC_GA_ID` are all unset on Render, so the
`verification` block in `app/[locale]/layout.tsx` emits nothing and GA4 never
loads. None of this audit is trackable until that is done. See
`docs/seo-offsite-checklist.md` section 1.
