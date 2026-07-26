## Why this matters

At Snowflake Summit 2025, the company unveiled [Cortex AISQL](/data-ai), a family of built-in functions that embed state-of-the-art LLMs directly inside the Snowflake engine. For teams that already store [governed data in Snowflake](/platform), this brings three immediate benefits:

- **No extra infrastructure:** Everything executes inside the platform, so you avoid spinning up a separate AI service.
- **Unified security:** Data never leaves Snowflake, and existing roles, masking policies, and row access controls still apply.
- **Rapid iteration:** Analysts can prototype LLM workflows using nothing more than a SELECT statement.

## What's in the toolbox?

### Core text and document functions

- **AI_COMPLETE:** free-form completions, summarization, Q&A
- **AI_CLASSIFY:** zero-shot and few-shot text classification
- **AI_FILTER:** policy or sentiment filtering
- **AI_SIMILARITY:** vector similarity search over text
- **PARSE_DOCUMENT:** OCR and structural parsing for PDFs, images, and Word docs

### Image-aware features

The same AI_COMPLETE interface can caption images, extract entities, and answer questions about visuals such as charts or diagrams.

## A quick, practical demo

Imagine you store product-review screenshots in a stage named `@reviews_stage`. You want to classify each review as positive, neutral, or negative and pull out the star rating shown in the image.

```sql
-- Extract review text, classify sentiment, and pull the star rating
WITH IMGS AS (
  SELECT
    RELATIVE_PATH                              AS FILE_NAME,
    TO_FILE('@REVIEWS_STAGE', RELATIVE_PATH)   AS IMG_FILE
  FROM DIRECTORY(@REVIEWS_STAGE)
),
TEXT AS (
  SELECT
    FILE_NAME,
    -- 1) Extract the visible text from each screenshot
    AI_COMPLETE(
      'claude-3-5-sonnet',
      'Extract the visible product-review text. Respond with raw text only.',
      IMG_FILE
    )::STRING AS REVIEW_TEXT
  FROM IMGS
)
SELECT
  FILE_NAME,
  REVIEW_TEXT,
  -- 2) Classify overall sentiment
  AI_CLASSIFY(
    REVIEW_TEXT,
    ARRAY_CONSTRUCT('positive','neutral','negative')
  )['LABEL']::STRING AS SENTIMENT,
  -- 3) Parse the star rating (1-5) mentioned in the text
  AI_COMPLETE(
    'claude-3-5-sonnet',
    'Return only the star rating (1-5) mentioned in this review.',
    REVIEW_TEXT
  )::STRING AS RATING
FROM TEXT;
```

All three steps run inside Snowflake with no batch exports or external endpoints.

## Governance and cost notes

- **Privileges:** Grant the `CORTEX_USER` role plus warehouse usage. Fine-grained masking and row-level security continue to apply.
- **Credits:** Each function consumes credits based on input tokens and the chosen model. Prototype with limited data first, then track usage through credit-consumption views to avoid surprises.

## Early lessons from the Viewnear team

1. **Barrier to entry is low.** Analysts with some coding experience built sentiment dashboards in a morning.
2. **Prompt clarity matters.** A clear system prompt plus a handful of few-shot examples cut wrong answers by roughly 40%.
3. **Hybrid workflows shine.** Pairing PARSE_DOCUMENT with AI_COMPLETE lets us handle PDF contracts and mobile photos in the same pipeline, ideal for mortgage and insurance clients.
4. **Warehouse sizing affects latency.** LLM calls run in a single thread, so moving from a small to a medium warehouse often halves response time.

## Where it was heading in mid-2025

- **Real-time agents:** Combine AISQL with Snowpark Container Services to create always-on AI copilots that can invoke external APIs when needed.
- **Safer packaging and sharing:** As of mid-2025, the Native App Framework supported restricted-caller rights, making it safer to package and share custom AI models.
- **Industry blueprints:** Pre-built templates such as invoice extraction, support-ticket triage, and clinical note summarization were expected to arrive via partners, including Viewnear.

## Closing thoughts

Cortex AISQL blurs the line between data warehousing and generative AI. The question is no longer "Where do we host the model?" but "Which business problem do we tackle first?" If you are ready to experiment, the barrier is now a single SQL query.

The Viewnear team weaves AISQL into client sprints. If you would like to see a live demo tailored to your data, get in touch. Happy querying!
