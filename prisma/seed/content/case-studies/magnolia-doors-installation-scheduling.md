## What scheduling by hand was costing

Magnolia Doors builds custom iron and aluminum doors, gates, railings and glass for high-end homes and builders around San Antonio, and its own crews install everything it makes. Getting a crew to a house is the bottleneck of the whole business.

A request arrived from sales as a PDF. Someone then worked out whether the paperwork was complete, whether the unit and the glass were physically in the shop, who was already booked that day and where, what trip plan the job needed, and what arrival window to promise. Five questions, five places to look, and no single screen that answered any of them.

At 30 to 40 installations a week, and 157 in the busiest month on record, that came to 13 to 17 hours every week spent getting jobs onto a calendar. Somewhere between a third and half of a full-time position, doing nothing but gathering information that already existed somewhere in the business.

The mistakes cost more than the hours. Contradictory postal codes, wrong addresses and details read off the wrong title all change where a crew is sent. During the work, one misread title would have put an installation 175 miles off route.

## What changed

**Scheduling an installation now takes about three minutes**, against 23 to 35 by hand. The weekly load drops from 13 to 17 hours to roughly one and a half to two.

**15 to 19 administrative hours come back every week**, about 3 to 4 hours per business day, without adding a person.

**A full day of installations is approved in about a minute.** Up to 20 jobs travel in a single proposal and are created together, where each one previously moved through its own sequence of checks. An internal rehearsal of the old job-by-job approach took 21 minutes and 20 separate steps, and produced a duplicate booking along the way. A whole week now fits in two or three proposals.

**28.5 fewer miles in a measured week**, from ordering each day properly. On one Hill Country run across Fredericksburg, Bandera, Boerne and Kerrville, sequencing the stops and the drive home came to 137.3 miles against 153.4 for the obvious nearest-first route: 16 miles on a single day.

**Bad data gets caught before a crew is dispatched.** The checks flag 6 of 344 delivery addresses whose postal code contradicts its own city by more than 25 miles, which is worse than a missing address because it is confidently wrong. Material readiness agreed with the production workbook on 8 of 8 cases tested.

**Nothing lands in the ERP that a person has not approved.** Every booking is proposed, reviewed and confirmed by the coordinator, so the speed never came at the cost of control.

## How Claude does it

Claude works through five stages for every request, and Magnolia's operations knowledge lives in five Claude skills the whole team reaches through their own Claude organization, with nothing installed on anybody's machine.

1. **Validate the request.** Claude checks the paperwork against the intake checklist and confirms every order in Odoo, the system of record, where the request sheet is only a claim somebody typed.
2. **Prove the material is in the shop.** Trip by trip, against the production workbook and Odoo purchasing, never against an estimated arrival.
3. **Plan the day.** One calendar read covers who is booked, who is off, what is cancelled and whether the job already has an event. Claude then works out the trip plan, arrival window, crew and priority, and groups the jobs geographically.
4. **Propose, and wait.** The coordinator sees the proposed calendar entries and approves them. Only then do records change in Odoo.
5. **Report on Wednesday.** A five-point operations summary in Spanish, from Magnolia's own guide, confirming what was actually visited against crew timesheet hours rather than assuming a calendar entry means the work happened.

Deterministic rules handle everything that has to be exact: required fields, material readiness, trip counts per product and job type, arrival windows per client type. Claude handles the judgment those rules cannot:

- **Reading the written scope instead of the checkboxes**, because the request form frequently carries several boxes marked at once and the prose is the reliable half. Ten job types are read that way.
- **Explaining the hold-ups in plain terms**, so a job waiting on something arrives with its reason and its owner rather than dropping quietly out of the plan, and priority always carries the reason behind it.
- **Showing its reasoning**, so crew choice states what it was inferred from and the coordinator can weigh it.
- **Reconciling records that disagree**, where the same builder is spelled three different ways across the workbook, the request and Odoo.

And the decision that stays with a person by design: marking a job confirmed is a claim about a conversation with a client, so it belongs to whoever had that conversation.

## Why the old process was so slow

Magnolia runs Odoo 18 Enterprise, on-premise and heavily customized. Reading the live instance before designing anything explained where the 23 to 35 minutes went, because almost nothing about the calendar was where you would expect it.

- **The event does not carry the address.** The location field is empty on every one of the last 500 events, so finding out where a job is takes three hops through the order.
- **The stored time is not the arrival time.** The window lives in the title text, and of 166 titles carrying one, only 11 agreed with the stored hour.
- **An order is not found by searching a prefix plus digits.** 256 of 3,380 events carry more than one order, and the obvious search pattern missed 132 of 954 order numbers: one job in seven.
- **Time off exists only as all-day calendar events**, so the calendar is the single source for who is available.

None of that came from asking. It came from reading the instance, and it is why the same five questions cost a person half an hour every time.

One check ran twice and came back empty both times: no orders sitting with material ready and no event, and no first visits done with the glass in and no return booked. Magnolia is not behind on its work, so the gains here are speed and consolidation rather than recovered backlog.

## How the approval works

Speed only counts if the coordinator stays in control of the calendar, so every write is proposed first and committed second.

![Propose, then commit. Claude calls the tool, the allowlist is checked before anything leaves the process, and the connector reads the records back from Odoo and returns a proposal with a signed token that expires in 15 minutes. The coordinator reviews and approves. The token is verified against the operation, model, ids and values it was issued for, and confirmation is asked again at the moment of execution. The write reaches Odoo once a person has approved it, and only then.](/assets/images/cases/magnolia-doors-write-gate.svg)

The proposal shows each field as it stands against what it would become, so a change is reviewed on its merits rather than approved blind. Four of the five stages are read-only by construction, so planning stays planning. The connector reaches one model and eight fields on the calendar and nothing else in the instance, and it ships with 343 passing tests.

## What is measured and what is estimated

Measured against production: the event volume, the steps the old process forced you through, the 21 minutes and the duplicate in the batch rehearsal, the 28.5 miles, the 8 of 8 on material readiness, and the 6 bad postal codes.

The per-event minutes are a reasoned estimate. They were built by listing the work the data proves has to happen, not by timing a person doing it, and that is where the 23 to 35 minutes and the 15 to 19 hours a week come from. Turning it into hard data is cheap and worth doing: time 10 jobs before and 10 after, from the request arriving to the event landing on the calendar, and the number becomes Magnolia's own.

## What is not built yet

Three things are deliberately incomplete, and each is a next increment rather than a limitation to defend.

- **Intake is still manual.** The mailbox is not connected, so somebody carries the PDF across by hand. Connecting it is the obvious next step.
- **Crew matching is partial.** Availability is checked, but which crew is qualified for what exists in no system yet.
- **Drive times are answered where real routing data covers the pair of postal codes**, and reported as unconfirmed elsewhere rather than estimated from distance. In the Hill Country the two genuinely diverge: postal codes twelve miles apart can be fifty minutes apart by road.

Of the twelve constraints the owner called the most important part of scheduling, three are covered by data that exists somewhere and seven exist in no system at all. Capturing those is a business change before it is a software one, and it is where the next tranche of time comes from.

## Business impact

Magnolia Doors turned up to 17 hours of weekly scheduling into a workflow that handles each installation in about three minutes, and got back the equivalent of a third to half a position without hiring. The team still works inside Odoo rather than maintaining a second scheduling system.

The value is not only the hours. Jobs now reach the calendar with their material proven, their address resolved, their day sequenced and their exceptions named, and the coordinator approves each one. That combination is what makes the same pattern worth extending to the next process.
