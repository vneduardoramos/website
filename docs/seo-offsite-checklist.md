# SEO: off-site + measurement checklist

The on-site foundation is strong (metadata, structured data, sitemap, keyword-targeted
pages, internal linking). The commercial "Snowflake services / partner / talent" SERPs,
though, are won **off-site** (directories, reviews, listicles, backlinks) and none of it
can be measured until the site is verified in Search Console. This is the highest-ROI
half of the work, and most of it needs your accounts, not code.

Do these in order. Items marked **(code)** are follow-ups someone can wire into the site
after the account work is done.

---

## Canonical NAP (use this exact wording everywhere)

Consistency of Name / Address / Phone across every profile is itself a ranking signal.
Copy-paste from here so nothing drifts.

- **Name:** Viewnear
- **Website:** https://www.viewnear.com
- **Email:** contact@viewnear.com
- **Phone:** _(not published yet — add a real, answerable business line before creating Google Business Profiles; a profile with no phone is weaker, and the number must match everywhere)_
- **LinkedIn:** https://www.linkedin.com/company/viewnear/
- **Austin, TX office:** 10900 Stonelake Blvd, Bldg 2, Suite 100, Austin, TX 78759, USA
- **Monterrey office:** Carr. Nacional 500, Valle Alto, Monterrey, NL 64983, Mexico

**One-paragraph company blurb** (paste into directory "About" fields; keep it identical):

> Viewnear is a Snowflake Premier and CoCo Preferred Partner that helps enterprises stand
> up two capabilities they keep: a governed data foundation for real decisions, and an AI
> practice that ships use cases into production, built on Snowflake and anchored on
> Anthropic Claude. A nearshore team works in US time zones from Monterrey, Mexico and
> Austin, Texas, delivering data engineering, migrations, analytics, and AI agents across
> the Americas, priced on outcomes rather than hours.

> Note: the words "consulting/consultant" are banned on viewnear.com by brand rule, but
> they are fine (and useful) on third-party directories, where buyers literally search
> "Snowflake consulting." Let the directories carry that term; keep the site clean.

---

## 1. Measurement (do this FIRST — free, fully in your control)

Until this exists, you cannot see impressions, positions, or which pages Google has
indexed. Everything below is unmeasurable without it.

- [ ] **Google Search Console.** Add a "URL prefix" property for `https://www.viewnear.com`.
      Choose the **HTML tag** verification method and copy the `content="..."` token.
- [ ] Set `GOOGLE_SITE_VERIFICATION` to that token in the **Render** environment (production),
      not just locally. Redeploy. (The site already emits the meta tag when the var is set —
      see `.env.example`.) Then click **Verify** in Search Console.
- [ ] In Search Console, submit the sitemap: `https://www.viewnear.com/sitemap.xml`.
- [ ] Use **URL Inspection** to request indexing of the priority pages: `/`, `/services`,
      `/nearshore`, `/partnership`, `/migrations`, and each `/services/<slug>`.
- [ ] **Bing Webmaster Tools.** Add the site; either import from Search Console or set
      `BING_SITE_VERIFICATION` on Render the same way. Submit the sitemap.
- [ ] **GA4** is already wired (`NEXT_PUBLIC_GA_ID`, consent-gated). Confirm the ID is set on
      Render so you can segment organic landing pages and contact-form conversions.
- [ ] After ~2 weeks, open the Search Console **Performance** report and start tracking the
      target queries (snowflake services / partner / team / nearshore snowflake / migration)
      by impressions and average position. This is your source of truth for progress.

## 2. Snowflake Partner Network listing (highest-authority external asset — you already have it)

Your listing exists: `snowflake.com/.../all-partners/viewnear/`. The directory itself ranks
for "snowflake partners/services," so a complete listing is the single strongest signal.

- [ ] Confirm the listing reflects **Premier + CoCo Preferred** status.
- [ ] Use the blurb above; make sure it says **nearshore** and **Americas**.
- [ ] Confirm it links to `https://www.viewnear.com`.
- [ ] List competencies/regions (data engineering, migrations, AI/Cortex; United States,
      Canada, Mexico) so it surfaces for filtered searches.

## 3. Review / directory profiles (this is where "Snowflake consulting" SERPs are won)

Page one for "snowflake consulting companies/firms" is Clutch, G2, GoodFirms, and listicles.
Reviews are the ranking lever on those sites. Claim each, fill with the blurb, then drive
**3–5 real client reviews** to each (ask your best 5 case-study clients).

- [ ] **Clutch** (clutch.co) — claim/create; category "Snowflake" / "Big Data / BI & Analytics".
- [ ] **G2** (g2.com) — create a seller profile; request reviews from clients.
- [ ] **GoodFirms** (goodfirms.co).
- [ ] **TrustRadius** and **DesignRush** (optional, lower priority).
- [ ] Pitch to be included in the "Top Snowflake service providers" listicles that already
      rank (e.g. inVerita, Medium roundups) — those are how new buyers discover firms.

## 4. Google Business Profiles (captures "near me" / map-pack / geo intent)

- [ ] Create/claim a profile for the **Austin, TX** office and the **Monterrey** office.
- [ ] Category: "Software company" (+ "Data analytics service" / "IT consultant" as secondary).
- [ ] Identical NAP to the block above; link to the site. (Needs a real phone line first.)

## 5. LinkedIn

- [ ] Optimize the company page tagline/about with the same positioning and keywords
      (Snowflake Premier Partner, nearshore, data & AI, Americas).
- [ ] Post the blog content (including the new decision-stage posts) to build referral traffic.

## 6. Wire the results back into the site **(code)**

Once the profiles above are live, expand the site's structured data so search engines
connect them to the brand:

- [ ] Add each profile URL (Clutch, G2, GoodFirms, Google Business Profile, the Snowflake
      partner page) to `sameAs` in `ORG_JSONLD` (`app/[locale]/layout.tsx`) — currently only
      LinkedIn is listed.
- [ ] Add a business `address` node to the Organization schema (the offices already appear
      as `ProfessionalService` on `/life-at-viewnear`; the top-level Organization has none).
- [ ] **Do NOT** add `aggregateRating` to the schema until real third-party reviews exist —
      fabricated ratings are a manual-action risk. Let the reviews live on the directories.

## 7. Backlinks / co-marketing (foundations tier)

- [ ] Get the real case-study clients to link back from their sites where possible.
- [ ] Pursue joint content or a co-listing with Snowflake and any tech partners.
- [ ] A sustained backlink / digital-PR campaign is the follow-on if the hardest head terms
      ("snowflake consulting/services") stall after these foundations — revisit in Search
      Console monthly and escalate if positions plateau.

---

### Why this order

Head terms like "snowflake services" are dominated by Snowflake's own directory, large
system integrators, and review sites; on-page work alone will not crack page one. Branded
and long-tail terms (your name, "nearshore snowflake team," the new decision-stage posts)
are winnable quickly. Measurement first, then authority — the site is ready to receive the
traffic once these signals point at it.
