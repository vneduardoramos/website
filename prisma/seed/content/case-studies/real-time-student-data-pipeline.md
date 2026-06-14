## Challenge

A group of universities serving 20,000+ students across Miami and Latin America could not see the student in real time. Academic records lived in their Anthology / Blackboard environment, while learning-activity events (Caliper) came off the LMS on their own schedule, and the two were never joined in one governed place. Across many campuses, that meant:

- **No single, current view of the student.** Academic and learning-activity data sat in separate systems on different refresh cycles.
- **Batch, not real time.** Learning events were not streamed, so questions about engagement could not be answered as they happened.
- **Hard to govern at scale.** Standing this up consistently across a multi-campus group needed access control, policy, and lineage designed in, not bolted on.

## Solution: a real-time student data pipeline on Snowflake

Viewnear built a governed, real-time student data pipeline on Snowflake, in the group's own account:

- **Governed Snowflake environment.** Warehouses, roles, RBAC, network policies, and resource monitors stood up from day one, with a clear governance model.
- **Native Blackboard integration.** A direct connection to Anthology / Blackboard Data Share lands academic data in a RAW layer, with schema discovery and refresh, volume, and usage validation.
- **Real-time Caliper events.** Learning-activity events stream from the LMS through Azure Event Hub into Snowflake RAW, validated end to end from the LMS to Snowflake.
- **Student analytics model.** An analytics model of the student, documented and aligned to Blackboard, on top of the RAW layers.
- **Documentation and knowledge transfer.** Technical and functional documentation plus knowledge-transfer sessions, so the group's own team can run and extend it.

Delivery ran in two-week agile sprints with a shared backlog, demos, and a joint technical and business committee.

## Governed by design

Student data is sensitive and spread across many campuses, so governance was designed in from the first table:

- **Least-privilege access.** Roles, RBAC, and network policies define who can reach what, by campus and function.
- **Controlled consumption.** Resource monitors keep compute and cost predictable across the group.
- **Traceable by design.** A governed RAW-to-analytics structure keeps clear lineage back to each source system, so every figure can be traced to its origin.
- **Data stays in place.** Everything runs in the group's own Snowflake account; no copies leave their perimeter.

## What we delivered

- A **governed Snowflake foundation**, set up with RBAC, network policies, and resource monitors.
- **Academic data** from Anthology / Blackboard Data Share flowing into a stable RAW layer.
- **Real-time Caliper learning events** streaming end to end from the LMS into Snowflake.
- A **documented student analytics model**, plus knowledge transfer so the group's team can run and extend it.
- A single, governed, real-time view of the student, ready for analytics and AI on top.
