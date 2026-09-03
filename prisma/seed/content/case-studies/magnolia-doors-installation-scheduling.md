## Challenge

Magnolia Doors builds custom iron and aluminum doors, gates, railings and glass for high-end homes and builders around San Antonio, and its own crews install everything it makes. Getting a crew to a house is the bottleneck of the whole business, and it was done by hand.

A request arrives from sales as a PDF. Someone then works out whether the paperwork is complete, whether the unit and the glass are physically in the shop, who is already booked that day and where, what trip plan the job needs, and what arrival window to promise. Five questions, five places to look, and no single screen answers any of them.

The company runs 30 to 40 installation events a week, and 157 in its busiest month on record.

## The line we drew

The solution automates everything except the booking.

The assistant validates the request against the intake checklist and against Odoo, proves the material is in the shop trip by trip, reads the live calendar for occupancy and time off, works out the trip plan, the arrival window, the crew and the priority, groups the jobs geographically, and writes the event exactly as their calendar expects to receive it. Then it stops and shows its work. A person approves, and only then does anything change in the ERP.

That line is not a policy note bolted on at the end. It is the architecture. Four of the five stages hold no write tool at all, so they could not book a job if instructed to. The fifth writes, and its barriers are structural: allowlists loaded at boot, a signed approval token bound to the exact operation, ids and values, and a confirmation asked again at the moment of execution. An instruction in a prompt can be talked around. None of those three can.

## The write gate

Every calendar write passes through two phases and three barriers that do not depend on each other. Removing any one still leaves the other two standing.

1. **Governance**, checked in memory before any network call. Model not listed, field not listed, or file absent means denied. Anything not explicitly permitted is refused, so missing configuration fails closed rather than open. This barrier never reaches the network, so nothing on the Odoo side can defeat it.
2. **The proposal and its token.** The connector reads the records back and returns what would change, field by field, current value against new one. The approval token is signed and bound to the exact operation, model, ids and a hash of the values, and it expires in 15 minutes. An approval issued to create cannot be spent to modify, and one issued for record seven cannot be spent on record eight.
3. **Confirmation at the moment of execution.** The question is asked again immediately before the write. If it does not come back accepted, nothing happens.

Update and delete work by explicit ids only, never by search criteria, because one filtered operation could reach hundreds of records from a proposal that looked small. A repeating series is refused rather than guessed at, because which occurrence a write would reach is unverified on this instance.

## Three layers, with a narrow contract between them

- **The connector** is the only thing that touches Odoo: six tools, the governance engine, the two-phase approval gate. It is customer-agnostic and instance-agnostic, so nothing about Magnolia is written into its source.
- **The skills** carry Magnolia's operations knowledge: the intake checklist, the readiness tests, the trip rules, the arrival windows, the crew roster, the title convention, the postal code tables. No credentials, no Odoo access of their own, no write tool.
- **The client** is where the person sits, in Claude on the desktop or the web, with the same tools and the same governance either way.

The connector exposes no general method-call tool. It cannot confirm a quotation or post an invoice, and anything it creates sits in draft for a person to finish inside Odoo. On the calendar side the scoping is harder still: creating, modifying and deleting all point at one model, `calendar.event`, and at eight fields. Nothing else in the instance can be changed by this system at all.

## What the instance actually was

Magnolia runs Odoo 18 Enterprise, on-premise and heavily customized, so the solution discovers the instance at runtime rather than assuming its shape. We measured the live instance before designing anything, and almost everything a reasonable person would assume about a scheduling calendar turned out to be false here. Each false assumption carried a concrete cost.

- **The event does not carry the address.** The location field is empty on every one of the last 500 events, and no address carries coordinates. Geography takes three hops through the order.
- **The stored time is not the arrival time.** The window lives in the title text, and of 166 titles carrying one, only 11 agreed with the stored hour. Hour-level conflict checks against their data are meaningless, so occupancy is checked by day.
- **An order is not found by searching a prefix plus digits.** 256 of 3,380 events carry more than one order and only the first takes the prefix. That pattern missed 132 of 954 order numbers, one job in seven.
- **A cancelled event is not archived.** Cancelled work is marked in the title, so an archive filter reads dropped jobs as live.
- **Time off lives in no HR record.** It exists only as all-day calendar events, which makes the calendar the single source for availability.

None of that came from asking. All of it came from reading the instance, and the distinction is worth carrying forward: a kickoff meeting gives you the process as designed, the data gives you the process as it runs.

One finding killed a feature, and should have. The obvious pitch is to promise you will surface the jobs that fell through the cracks, so we looked for those twice: once for orders with material ready and no event, once for first visits done with the glass in and no return booked. Both came back empty. They are not behind on their work. That replaced the pitch with speed and consolidation, which is the honest offer.

## Results

Batch scheduling is where it multiplies. An internal rehearsal, before the customer saw it, took **21 minutes and 20 separate steps** to schedule several jobs, and the second event came out as a duplicate of the first. That was not a connector fault; the connector did exactly what it was asked, twice. Today up to **20 events travel in a single proposal under one approval, created atomically**, so it is all of them or none. A full day is approved in about a minute and a week fits in two or three proposals. The duplicate problem is gone by design rather than by being careful.

Measured against production:

- **28.5 fewer miles** over a real week from ordering the day properly. On one Hill Country spread, evaluating every possible order including the drive home produced 137.3 miles against 153.4 for the greedy route: 16 miles on a single day, from sequencing alone.
- **8 of 8** material readiness cases agreed with the production workbook.
- **6 of 344** delivery addresses carry a postal code that contradicts its own city by more than 25 miles. That data is confidently wrong, which is worse than missing.
- **343 tests passing**, with Odoo mocked, so the suite runs without a live instance.
- **Zero** ERP records written without an explicit human approval.

The title-reading rule prevents something that already happened during development: a street number read as an order number put a job 175 miles off route into the day. Order numbers in titles are free text written by a person in a hurry, and 440 are written glued against 139 spaced, so the obvious pattern silently loses three quarters of them.

### What is estimated, and what that means

The per-event minutes are an estimate. Scheduling by hand is put at 23 to 35 minutes and roughly 3 minutes with the connector, which is where the weekly figure of 15 to 19 hours comes from. Those minutes were built by listing the work the data proves has to happen, not by timing a person doing it, so they are a reasoned estimate rather than a measurement, and we are not going to present them as one.

Turning that into hard data is cheap: time 10 jobs before and 10 after, from the request arriving to the event landing on the calendar. Then the number belongs to Magnolia rather than to our assumption.

## What is not built

The solution is in production against the live instance, and three things are deliberately incomplete.

- **Intake is still manual.** The skill accepts a mailbox source, but the mailbox is not connected, so somebody still carries the PDF across by hand.
- **Crew matching is partial.** The roster is readable and availability is checked, but who is qualified for what exists in no system.
- **The 45-minute travel rule is answered only where real routing data covers the pair of postal codes.** Everywhere else the time is reported as unconfirmed and never estimated from the distance. In the Hill Country the two genuinely diverge: postal codes twelve miles apart on a map can be fifty minutes apart by road.

Of the twelve constraints the owner called the most important part of scheduling, three are covered by data that exists somewhere and seven exist in no system at all. Those live in a PDF and in one person's head, and automating them means capturing them somewhere first, which is a business change before it is a software one.

## Business impact

What a run delivers are proposals, not bookings. Missing is missing: a trip count, an address, an access detail, a drive time or a crew's availability is never invented, and a job whose facts are not there is blocked and named rather than quietly scheduled. Zero rows is not zero work, because "no events match the filter" and "I could not read" are different statements and are never collapsed.

That is what makes the rest of it trustworthy against a live ERP, and it is what makes the same pattern safe to extend to the next process.
