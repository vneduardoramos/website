## Challenge

Magnolia Doors designs, manufactures, installs, and services custom iron and aluminum doors, windows, gates, railings, and architectural metalwork.

Scheduling a custom installation is not a standard service appointment. Before a date can be assigned, the team has to confirm that the request is complete, that the correct job has been identified, that the physical materials are ready, that the installation information is accurate, and that the appointment fits the operational schedule.

The company runs roughly 30 to 40 installation events a week. Preparing each one took 23 to 35 minutes of administrative work across request validation, material checks, scheduling, calendar creation, and reporting: 13 to 17 hours every week spent getting jobs onto a calendar.

Data quality made it riskier than it was slow. Contradictory ZIP codes, incorrect addresses, and information read from the wrong title all affect routing and scheduling. In one representative case, a misread title would have placed an installation about 175 miles off the correct route.

A faster process alone would not have solved it. Magnolia Doors also needed a guarantee that incomplete jobs could not be scheduled, and that an AI assistant could not change production data without a person authorizing it.

## Solution: five stages, with Odoo as the system of record

Viewnear rebuilt the process as a controlled five-stage workflow around Claude and Odoo 18/19.

A custom Model Context Protocol connector gives Claude structured access to the operational data and actions that installation scheduling needs. Odoo stays the system of record. Claude coordinates retrieval, applies the workflow, explains exceptions, and prepares the actions it recommends.

1. **Request validation.** Claude checks that the service request carries the required customer, project, address, and installation information. Contradictory or incomplete records are flagged before scheduling continues.
2. **Material-readiness verification.** The workflow reads the related Odoo records to confirm the physical materials are ready. Jobs that fail the readiness rules are excluded and reported with the reason.
3. **Batched schedule generation.** Eligible jobs are processed together. Claude prepares one consolidated proposal for the whole group rather than making the team schedule each job separately.
4. **Human approval and execution.** Claude presents the proposed calendar actions for review. Only after an authorized user approves does a separate execution call create or update the records in Odoo.
5. **Weekly management reporting.** Claude produces an operational summary of scheduled installations, blocked requests, material issues, exceptions, and follow-ups.

## Deterministic rules, and where the model actually helps

The design separates business rules from the model's reasoning. Required fields and material-readiness conditions are enforced as defined rules, not left to interpretation. Claude handles what rules are bad at: reading operational context, organizing results, spotting contradictions, and explaining why a job can or cannot proceed.

The connector draws the same line between reading and writing. Claude can retrieve everything it needs to build a recommendation without holding authority to change Odoo records.

## Delivery to production

Viewnear delivered in phases through August 2026.

The first phase established the read-only connector, the business rules engine, and the approval-gate architecture. Claude could retrieve and evaluate live Odoo data and could not modify production records.

Internal testing surfaced a scalability problem. Jobs were being processed one at a time, which produced a 20-minute run and one duplicate action in a representative test. The workflow was redesigned around batch processing so multiple requests are evaluated together, grouped into one proposal, and submitted through a single approval, with additional checks against duplicate execution.

For the customer demonstration, Claude read live data from the production environment while every write was directed into an isolated sandbox, so the workflow could be exercised against realistic records without touching production calendars.

After the customer validated it, Viewnear deployed a hosted connector with the required authentication and environment controls. The first production release deliberately created approved records only. Modification and deletion came later, once the creation path had proven itself, because those actions carry more operational risk.

## Results

- Scheduling dropped from **23 to 35 minutes** per event to **about 3 minutes**, a reduction of **87% to 91%**.
- Weekly scheduling workload fell from **13 to 17 hours** to roughly **1.5 to 2 hours**.
- Around **15 to 19 administrative hours** are returned each week, about 3 to 4 hours per business day.
- **30 to 40 installation events** a week run through one governed workflow instead of an independent sequence of manual checks per job.

Error reduction has not been measured as a percentage yet, so there is no figure to publish. What the workflow does do is catch contradictory operational data before anything reaches the calendar: the validation logic surfaced the conflicting ZIP code and title that would have sent an installation 175 miles off route, and it surfaced it for review rather than acting on it.

Every state-changing operation stays behind the approval gate. Claude evaluates records and recommends actions; it cannot create, modify, or delete production data without explicit authorization.

## Business impact

Magnolia Doors turned up to 17 hours of weekly scheduling into a workflow that handles each event in about three minutes, and the team still works inside Odoo rather than maintaining a second scheduling system.

The value is not only speed. The workflow verifies whether an installation is genuinely ready, detects contradictory information, explains exceptions, consolidates eligible jobs into one schedule, and leaves a person in control of every production action. That combination is what makes it safe to extend the same pattern to the next process.
