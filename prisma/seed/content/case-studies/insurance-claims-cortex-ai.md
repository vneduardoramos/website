## Challenge

A claims processing company classified PDFs and digitized documents from many insurance providers by hand. The documents ranged widely, from structured forms to long reports and handwritten notes, and accurate, timely classification is what keeps claims moving. Three frictions made the manual process hard to scale:

- **Document variability.** Formats were not standardized, so template-based OCR did not work consistently.
- **Manual review.** Each document took seconds to minutes, and the backlog slowed claim resolution.
- **Inconsistent classification.** Human judgment produced errors, recategorization, and unreliable volume metrics.

## When the Discard bucket becomes a leak

Incoming documents were sorted by purpose so each could be routed and handled correctly:

- **Verifications** confirm coverage.
- **Denials** record a claim rejection.
- **Payments** cover disbursements and checks.
- **Correspondence** covers letters and notes.
- **Discard** is reserved only for irrelevant items: blank pages, duplicates, and unrelated material.

In practice, Discard became a leak point for information. Under time pressure, valid Verifications and Denials were wrongly discarded and dropped out of the active claims flow, which caused:

- **Data loss.** Key documents left the workflow entirely.
- **Interruptions.** Cases had to be reopened and reclassified.
- **Skewed metrics.** The true volume of work was distorted, throwing off resource planning.

## Solution: an intelligent pipeline on Snowflake

Viewnear built a data product and pipeline on **Snowflake Cortex AI** to classify, extract, and route documents automatically, with the AI functions called directly in SQL rather than a separate model to host:

- **Ingest from Azure.** PDFs landed in an Azure Blob Storage container and were read through a Snowflake external stage.
- **Parse.** `PARSE_DOCUMENT` turned each PDF, including the externally digitized scans, into the text and layout the next steps could use.
- **Classify and extract.** Stored procedures invoked Cortex AI functions per document: `AI_CLASSIFY` sorted each into Denials, Verifications, Payments, and Correspondence without rigid templates, and `AI_EXTRACT` pulled claim numbers, check amounts, dates, and customer details, at 95% accuracy.
- **Route by business rules.** Classified documents were sent to the correct downstream system, removing manual handoffs.
- **Review the 5%.** Uncertain cases were flagged for human review and fed a continuous improvement cycle, so accuracy kept rising. Because the Cortex AI functions run inside Snowflake, there is no separate AI stack to manage.

## Governed by design

Claims documents carry sensitive personal and financial data, so governance was built in from the first table rather than bolted on afterward:

- **Lineage with Horizon Catalog.** Every document, classification, and extracted field is traceable, so the team can show where any value came from and how it was processed.
- **One trusted business context.** Horizon Context gives every team and AI function the same definitions for document types, claim fields, and statuses, so classification and downstream reporting always agree.
- **Least-privilege access.** Role-based access controls (RBAC) limit who can see raw documents and extracted data, with separation of duties across processing, review, and reporting.
- **PII protected in place.** Sensitive fields are classified and masked by policy, and the Cortex AI functions run on the data inside the client's governed Snowflake account, so nothing is copied to an external service.
- **Audit-ready and certified.** The work inherits Snowflake's independently audited controls (SOC 2 Type II, ISO 27001, HIPAA) and adds full access history for audits and incident response.

## Results

Automation turned a manual workflow into a measurable, auditable, scalable process:

- Classification accuracy rose from **60% to 95%**, a 35-point gain.
- Average per-document classification dropped to **4 seconds**.
- Over **40%** of previously discarded documents were recovered and reintegrated.
- Classification errors fell by **95%**.

## Business impact

Beyond classification, the work created a foundation ready to automate more document decisions:

- **Scalable automation.** Fewer repetitive tasks and the capacity to absorb far more document volume.
- **More trustworthy data.** Consistent classification, reliable extraction of key fields, and full traceability of the process.
- **Continuous improvement.** Flagged errors are reviewed and feed new iterations, so the system keeps getting better.

The result is a move from manual review to intelligent, precise, growth-ready document processing, freeing the team to focus on resolving claims rather than sorting paper.
