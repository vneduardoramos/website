# Questions only you can answer

Answer inline under each question, then tell me it is filled in and I will write
the copy and ship it. Everything here is blocked on a fact the site does not
publish, and I will not invent any of it.

**"No" and "we do not have that" are useful answers.** Several of these change
what gets written rather than whether anything gets written. If the honest answer
is that Viewnear holds no attestation of its own, I will say what is true (the
environment inherits Snowflake's) and stop there, which is stronger than a vague
implication. If an answer should stay private, write `do not publish` and I will
leave the topic alone rather than hint at it.

Notation used below:
- **Unlocks N** means how many separate pending items the answer releases.
- `[ ]` is a blank for you. Free text is fine.

---

## Start here: 6 answers that unlock the most

These six release roughly twenty pending items between them. If you only fill in
one section, make it this one.

**1. Founding year, and the city it was founded in.** Unlocks 4.
Third-party records already publish "Founded 2024, 1-10 employees, Austin" in a
form assistants can quote, and the site publishes nothing to outweigh it. Goes
into the `Organization` entity (`foundingDate`, `foundingLocation`) and one
sentence in the /about timeline.

> Year: `[ ]`
> City and country: `[ ]`

**2. Registered legal entity name(s).** Unlocks 3.
Goes into `Organization.legalName`. If there are separate US and Mexico entities,
both, and note which one contracts with clients.

> `[ ]`

**3. Headcount, as a band.** Unlocks 2.
A band is fine and is what schema expects ("11-50"). This is the fact most likely
to be answered wrongly about you today.

> `[ ]`

**4. How many SnowPro certifications the team currently holds.** Unlocks 2.
The site says "SnowPro-certified" with no number. A real count is far more
citable. A rough current figure is fine, and I will date it so it ages honestly.

> Count: `[ ]`   As of (month/year): `[ ]`

**5. Two or three sentences per leader, for a real bio.** Unlocks 3.
The six `Person` entities are live with role, LinkedIn and headshot, but no
description, so nothing on the site says who the person CRN quotes actually is.
Name a concrete credential held and work actually delivered. Do not stretch: if
someone holds no certification, leave that out.

> Eduardo Javier Ramos (CEO): `[ ]`
> JC Rodriguez (Head of Service Delivery): `[ ]`
> René Treviño (Head of Document Intelligence): `[ ]`
> Carlos Egremy (Head of Operations): `[ ]`
> Karen Berber (Head of People & HR): `[ ]`
> Aydhé Mota (Head of Finance): `[ ]`

**6. Where the 60% / 3x / 40% numbers come from.** Unlocks 3.
These appear on nine surfaces with no basis and no date, which makes them
unquotable: an answer engine will not cite an unattributed statistic, and a
sceptical buyer discounts it. I need either a basis I can publish, or permission
to soften the claim.

> How many engagements are behind them: `[ ]`
> Measured how, against what baseline: `[ ]`
> Over what period: `[ ]`
> If there is no formal basis, may I reframe them as typical ranges observed
> rather than measured results? `[ ]`

---

## Contracting and legal

This block is the single biggest gap. The site answers none of it, and it is
exactly what an enterprise buyer asks an assistant before they ever contact you.
Answers become a FAQ cluster plus a section on /security. Unlocks 11.

**7. Who owns what an engagement produces?** Does the agreement assign work
product (code, data models, documentation) to the client, and is there a carve-out
for Viewnear's pre-existing accelerators, frameworks or reusable tooling?

> `[ ]`

**8. Contract structure.** A master services agreement with SOWs under it, or one
agreement per project? And will Viewnear sign a client's own MSA and security
addendum?

> `[ ]`

**9. Mutual NDA before discovery: standard or not, and who issues it?**

> `[ ]`

**10. Data processing agreement.** Do you execute one, and under what mechanism
for processing between Mexico and the United States (standard contractual clauses
or equivalent)?

> `[ ]`

**11. Governing law and venue** that are standard in your agreements.

> `[ ]`

**12. Insurance.** What professional liability and cyber cover is carried, and can
a certificate be issued on request? Limits are optional; "yes, on request" is
already a useful answer.

> `[ ]`

**13. Security incident notification.** What do you commit to a client, and within
what window?

> `[ ]`

**14. End of engagement.** Do you commit to returning or deleting client
materials and revoking delivery access within a defined window? What window?

> `[ ]`

---

## Security posture

Answers correct and date the /security page. Unlocks 6.

**15. Does Viewnear itself hold any security attestation?** SOC 2 Type II, ISO
27001, or similar, as the Viewnear entity rather than inherited from Snowflake.
A plain "no" is fine and is what I will write around.

> `[ ]`

**16. Is there a recent penetration test summary, or a pre-completed standard
questionnaire (CAIQ, SIG) you can send during a vendor review?**

> `[ ]`

**17. Subprocessors and subcontracting.** Who else touches client data or client
environments? Is any part of delivery subcontracted?

> `[ ]`

**18. Personnel controls.** Background checks, security training, device
management, and the scope of confidentiality agreements for people on an
engagement.

> `[ ]`

**19. FedRAMP.** An internal decision doc lists it as inherited from Snowflake,
but /security does not mention it. Should it be listed as inherited, or dropped?

> `[ ]`

**20. What does the "GDPR-ready" badge actually promise?** Its note is currently
just "Data residency & controls", which is too thin to survive being quoted alone.

> `[ ]`

**21. HIPAA.** Will Viewnear sign a BAA for engagements involving PHI?

> `[ ]`

---

## Delivery facts

Answers close specific unanswered buyer questions. Unlocks 5.

**22. From signed agreement to the delivery team starting: how long?** And does
that window change by engagement size? This question has no answer anywhere on
the site today.

> `[ ]`

**23. Daily overlap with a US working day: is there a number you will commit to?**
For example "8 hours" or "9am to 6pm client time". Note the site correctly says
Monterrey holds CST year-round while US Central shifts, so I will keep the
schedule-absorbs-the-difference framing either way.

> `[ ]`

**24. Is a published migration cost range possible?** Even a wide band ("most
first production builds land between X and Y") would win a high-volume query the
site currently declines to answer. If not publishable, say so and I will compete
on the cost-driver table instead.

> `[ ]`

**25. What does "near real time" mean in minutes** for the retail, media and
student-data cases? A number is quotable; the phrase is not.

> `[ ]`

**26. Are the governance specifics standard on every governed build,** or were
they specific to the master data engagement? This decides whether they are
described as how Viewnear works or as one project's design.

> `[ ]`

---

## Case studies and references

Answers fix a real mismatch and fill three empty sectors. Unlocks 5.

**27. Do you have a retail or CPG engagement to feature?** `/industries/retail-cpg`
currently features the commercial-vehicle dealer group. It is now labelled
honestly as automotive, but the sector page still has no sector-matched proof.

> `[ ]`

**28. Any technology/telco engagement, and any media/entertainment/advertising
engagement** that could be added, even anonymized?

> `[ ]`

**29. Year, duration and rough scale for the five existing case studies.** Three
of five carry none, so a reader cannot tell whether the work was recent or
whether the scale resembles theirs. Anonymity is preserved: a year, a duration
and a scale band give away nothing.

> sku-catalog-governance: `[ ]`
> construction-cad-data-foundation: `[ ]`
> real-time-student-data-pipeline: `[ ]`
> insurance-claims-cortex-ai: `[ ]`
> corporate-mdm-golden-record: `[ ]`

**30. Has the dealer group's twelve-month, three-release master data roadmap
finished?** The copy speaks as though it is in progress, which will read as stale.

> `[ ]`

**31. Can a buyer be put in touch with a reference in their sector?** Yes/no is
enough; I will not name anyone.

> `[ ]`

---

## Sector and product specifics

Smaller, but each closes a query the site loses today.

**32. Which construction and real-estate source systems do you connect to?**
(Procore, Autodesk, Sage, and so on.)

> `[ ]`

**33. Which retail, POS, e-commerce or CPG source systems?**

> `[ ]`

**34. FERPA.** Will Viewnear sign a FERPA data agreement, or act as a school
official / designated agent for student data?

> `[ ]`

**35. How does machine and sensor data actually reach Snowflake,** and on which
engagement? The manufacturing page implies this without describing the path.

> `[ ]`

**36. Are the per-industry `tools` lists a record of delivered work, or the stack
you lead with?** This changes how they are described.

> `[ ]`

**37. Which Claude model should the Cortex AISQL example name?** The post names a
model identifier that is now dated.

> `[ ]`

---

## Decisions, not facts

Quick calls that need your preference rather than research.

**38. "An architect replies within one business day"** appears on /contact and
/faq. The same claim was deliberately dropped from the booking block because the
bookable people are the CEO, delivery and document intelligence, not architects.
Keep it, soften it, or remove it?

> `[ ]`

**39. `/services` repeats all 19 FAQ answers verbatim from `/faq`.** May I cut it
to about four questions genuinely about choosing between services?

> `[ ]`

**40. Should a phone number be published?** `theme.brand.phone` is empty, so the
`Organization` and both office nodes carry no `telephone`, which is a weak signal
for a business with two physical addresses.

> `[ ]`

**41. Service showcase images are still placeholder art** with the service name
burned into them, visible behind the closing section on all six service pages.
Want me to source real photography (the way the industry and case-study images
were done), or will you supply it?

> `[ ]`

**42. The dated Premier / CoCo announcement sits on `/news`, which is `noindex`
and intentionally dormant.** It is your only dated first-party record of the
credential. Move a dated version onto `/partnership`, or leave it?

> `[ ]`

**43. Two proposed new pages.** Both target real gaps; both are a few hours of
writing plus review.
- `/document-intelligence`: René leads it and the insurance case (60% to 95%
  accuracy, four seconds per document) is the strongest quantified proof on the
  site, but no page owns the topic.
- `/snowflake-cost`: the highest-volume factual question in the category, with
  zero coverage today.

> Build which, if either: `[ ]`

---

## Not blocked on you, but still open

Listed so nothing is lost, no answer needed:

- Search Console and Bing are unverified and GA4 is not loading, because
  `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION` and `NEXT_PUBLIC_GA_ID`
  are unset on Render. Until that is done, none of the AEO work is measurable.
- The Render API key pasted into a chat session should be rotated.
- The 404 page's body paints after hydration rather than in the streamed HTML.
  Status code, title and `noindex` are all correct, and fixing the paint would
  cost `<html lang>` on 62 Spanish URLs, so it is deliberately left.
