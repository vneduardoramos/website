/**
 * Config-driven admin: each content type declares its Prisma delegate key and
 * editable fields. The generic admin list/form pages and server actions read
 * this so there is one implementation for all models.
 */
import { PUBLISH_STATUSES } from "@/lib/enums";

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"      // now rendered as a WYSIWYG editor
  | "number"
  | "boolean"
  | "date"
  | "select"
  | "jsonList"      // JSON-encoded string[]
  | "jsonObjects"   // JSON-encoded [{...}]
  | "image"         // URL string, set via upload/library picker
  | "relation"      // FK (single) or M2M (multiple) to another model
  | "repeater"      // JSON-encoded array of objects with fixed itemFields
  | "group";        // JSON-encoded single object with fixed itemFields

export interface RepeaterItemField {
  name: string;
  label: string;
  type: "text" | "textarea";
}

export interface AdminField {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  help?: string;
  required?: boolean;
  /** For type "relation": the related prisma model + the field to show as the label. */
  relation?: { model: string; labelField: string; multiple?: boolean };
  /** For type "repeater"/"group": the per-row/object fields. */
  itemFields?: RepeaterItemField[];
}

export interface AdminModel {
  key: string; // prisma delegate, e.g. "blogPost"
  label: string; // singular
  plural: string;
  hasStatus: boolean; // uses PublishStatus + publishedAt
  listFields: string[]; // columns to show
  fields: AdminField[];
  defaultOrderBy?: Record<string, "asc" | "desc">;
}

const statusField: AdminField = {
  name: "status",
  label: "Status",
  type: "select",
  options: [...PUBLISH_STATUSES],
};

export const ADMIN_MODELS: Record<string, AdminModel> = {
  blogPost: {
    key: "blogPost",
    label: "Blog Post",
    plural: "Blog Posts",
    hasStatus: true,
    listFields: ["title", "status", "publishedAt"],
    defaultOrderBy: { updatedAt: "desc" },
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", help: "Auto-generated from title if blank" },
      { name: "excerpt", label: "Excerpt", type: "textarea", help: "Short blurb shown on the listing card and as the meta description fallback" },
      { name: "keyTakeaways", label: "Key Takeaways", type: "jsonList", help: 'Optional summary points shown near the top. JSON: ["First point","Second point"]' },
      { name: "coverImageUrl", label: "Cover Image", type: "image" },
      { name: "authorTeamId", label: "Author", type: "relation", relation: { model: "teamMember", labelField: "name" }, help: "Shown with photo, title & LinkedIn on the post" },
      { name: "tags", label: "Tags", type: "relation", relation: { model: "tag", labelField: "name", multiple: true } },
      { name: "body", label: "Body (Markdown)", type: "markdown", required: true },
      { name: "seoTitle", label: "SEO Title", type: "text" },
      { name: "seoDescription", label: "SEO Description", type: "textarea" },
      // --- Spanish (es) ---
      { name: "titleEs", label: "Title (ES)", type: "text" },
      { name: "excerptEs", label: "Excerpt (ES)", type: "textarea" },
      { name: "bodyEs", label: "Body (Markdown) (ES)", type: "markdown" },
      { name: "keyTakeawaysEs", label: "Key Takeaways (ES)", type: "jsonList", help: 'Optional summary points shown near the top. JSON: ["First point","Second point"]' },
      { name: "seoTitleEs", label: "SEO Title (ES)", type: "text" },
      { name: "seoDescriptionEs", label: "SEO Description (ES)", type: "textarea" },
      statusField,
    ],
  },
  caseStudy: {
    key: "caseStudy",
    label: "Case Study",
    plural: "Case Studies",
    hasStatus: true,
    listFields: ["title", "sector", "region", "status"],
    defaultOrderBy: { order: "asc" },
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "summary", label: "Summary", type: "textarea", required: true },
      { name: "heroImage", label: "Hero Image", type: "image" },
      { name: "clientId", label: "Client", type: "relation", relation: { model: "client", labelField: "name" } },
      { name: "industryId", label: "Industry", type: "relation", relation: { model: "industry", labelField: "name" } },
      { name: "sector", label: "Sector", type: "text", required: true },
      { name: "region", label: "Region", type: "text", required: true },
      { name: "challenge", label: "Challenge", type: "markdown" },
      { name: "solution", label: "Solution", type: "markdown" },
      { name: "results", label: "Results", type: "markdown" },
      { name: "body", label: "Body (Markdown)", type: "markdown" },
      {
        name: "metrics",
        label: "Metrics",
        type: "repeater",
        help: "Headline numbers shown on the case study",
        itemFields: [
          { name: "value", label: "Value", type: "text" },
          { name: "label", label: "Label", type: "text" },
        ],
      },
      {
        name: "quote",
        label: "Client Quote",
        type: "group",
        itemFields: [
          { name: "text", label: "Quote", type: "textarea" },
          { name: "author", label: "Author", type: "text" },
          { name: "role", label: "Role", type: "text" },
        ],
      },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "order", label: "Order", type: "number" },
      { name: "seoTitle", label: "SEO Title", type: "text" },
      { name: "seoDescription", label: "SEO Description", type: "textarea" },
      // --- Spanish (es) ---
      { name: "titleEs", label: "Title (ES)", type: "text" },
      { name: "summaryEs", label: "Summary (ES)", type: "textarea" },
      { name: "sectorEs", label: "Sector (ES)", type: "text" },
      { name: "bodyEs", label: "Body (Markdown) (ES)", type: "markdown" },
      { name: "challengeEs", label: "Challenge (ES)", type: "markdown" },
      { name: "solutionEs", label: "Solution (ES)", type: "markdown" },
      { name: "resultsEs", label: "Results (ES)", type: "markdown" },
      {
        name: "metricsEs",
        label: "Metrics (ES)",
        type: "repeater",
        help: "Headline numbers shown on the case study",
        itemFields: [
          { name: "value", label: "Value", type: "text" },
          { name: "label", label: "Label", type: "text" },
        ],
      },
      {
        name: "quoteEs",
        label: "Client Quote (ES)",
        type: "group",
        itemFields: [
          { name: "text", label: "Quote", type: "textarea" },
          { name: "author", label: "Author", type: "text" },
          { name: "role", label: "Role", type: "text" },
        ],
      },
      { name: "seoTitleEs", label: "SEO Title (ES)", type: "text" },
      { name: "seoDescriptionEs", label: "SEO Description (ES)", type: "textarea" },
      statusField,
    ],
  },
  newsEvent: {
    key: "newsEvent",
    label: "News / Event",
    plural: "News & Events",
    hasStatus: true,
    listFields: ["title", "kind", "status", "publishedAt"],
    defaultOrderBy: { updatedAt: "desc" },
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "kind", label: "Kind", type: "select", options: ["announcement", "event", "press"] },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "keyTakeaways", label: "Key Takeaways", type: "jsonList", help: 'Optional summary points shown near the top. JSON: ["First point","Second point"]' },
      { name: "coverImage", label: "Cover Image", type: "image" },
      { name: "body", label: "Body (Markdown)", type: "markdown", required: true },
      { name: "eventDate", label: "Event Date", type: "date" },
      { name: "venue", label: "Venue (events)", type: "text" },
      {
        name: "agenda",
        label: "Agenda",
        type: "repeater",
        itemFields: [
          { name: "time", label: "Time", type: "text" },
          { name: "item", label: "Item", type: "text" },
        ],
      },
      { name: "readMinutes", label: "Read Minutes", type: "number" },
      { name: "externalUrl", label: "External URL", type: "text" },
      { name: "seoTitle", label: "SEO Title", type: "text" },
      { name: "seoDescription", label: "SEO Description", type: "textarea" },
      statusField,
    ],
  },
  service: {
    key: "service",
    label: "Service",
    plural: "Services",
    hasStatus: true,
    listFields: ["title", "tier", "status"],
    defaultOrderBy: { order: "asc" },
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "tier", label: "Tier", type: "select", options: ["THINK", "BUILD", "GROW"] },
      { name: "summary", label: "Summary", type: "textarea", required: true },
      { name: "body", label: "Body", type: "textarea" },
      { name: "tools", label: "Tools", type: "jsonList", help: 'JSON: ["Snowflake","Openflow"]' },
      { name: "order", label: "Order", type: "number" },
      // --- Spanish (es) ---
      { name: "titleEs", label: "Title (ES)", type: "text" },
      { name: "summaryEs", label: "Summary (ES)", type: "textarea" },
      { name: "bodyEs", label: "Body (ES)", type: "textarea" },
      { name: "seoTitleEs", label: "SEO Title (ES)", type: "text" },
      { name: "seoDescriptionEs", label: "SEO Description (ES)", type: "textarea" },
      statusField,
    ],
  },
  industry: {
    key: "industry",
    label: "Industry",
    plural: "Industries",
    hasStatus: true,
    listFields: ["name", "status"],
    defaultOrderBy: { order: "asc" },
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "headline", label: "Headline", type: "text", required: true },
      { name: "intro", label: "Intro", type: "textarea", required: true },
      { name: "challenges", label: "Challenges", type: "jsonObjects", help: 'JSON: [{"problem":"","response":""}]' },
      { name: "deliverables", label: "Deliverables", type: "jsonObjects", help: 'JSON: [{"title":"","description":""}]' },
      { name: "tools", label: "Tools", type: "jsonList" },
      { name: "stats", label: "Stats", type: "jsonObjects", help: 'JSON: [{"label":"","value":""}]' },
      { name: "faq", label: "Sector FAQ", type: "jsonObjects", help: 'JSON: [{"q":"","a":""}] rendered on the page and emitted as FAQPage schema' },
      { name: "order", label: "Order", type: "number" },
      // --- Spanish (es) ---
      { name: "nameEs", label: "Name (ES)", type: "text" },
      { name: "headlineEs", label: "Headline (ES)", type: "text" },
      { name: "introEs", label: "Intro (ES)", type: "textarea" },
      { name: "bodyEs", label: "Body (ES)", type: "markdown" },
      { name: "challengesEs", label: "Challenges (ES)", type: "jsonObjects", help: 'JSON: [{"problem":"","response":""}]' },
      { name: "deliverablesEs", label: "Deliverables (ES)", type: "jsonObjects", help: 'JSON: [{"title":"","description":""}]' },
      { name: "statsEs", label: "Stats (ES)", type: "jsonObjects", help: 'JSON: [{"label":"","value":""}]' },
      { name: "faqEs", label: "Sector FAQ (ES)", type: "jsonObjects", help: 'JSON: [{"q":"","a":""}]' },
      { name: "seoTitleEs", label: "SEO Title (ES)", type: "text" },
      { name: "seoDescriptionEs", label: "SEO Description (ES)", type: "textarea" },
      statusField,
    ],
  },
  teamMember: {
    key: "teamMember",
    label: "Team Member",
    plural: "Team",
    hasStatus: false,
    listFields: ["name", "title"],
    defaultOrderBy: { order: "asc" },
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "bio", label: "Bio", type: "textarea" },
      { name: "bookingUrl", label: "Booking URL", type: "text" },
      { name: "bookingTopics", label: "Booking topics", type: "text", help: "Shown on the booking pill, e.g. \"Delivery model, timelines, migrations\"" },
      { name: "bookingTopicsEs", label: "Booking topics (ES)", type: "text" },
      { name: "linkedinUrl", label: "LinkedIn URL", type: "text" },
      { name: "order", label: "Order", type: "number" },
      { name: "published", label: "Published", type: "boolean" },
      // --- Spanish (es) ---
      { name: "titleEs", label: "Title (ES)", type: "text" },
      { name: "bioEs", label: "Bio (ES)", type: "textarea" },
    ],
  },
  jobOpening: {
    key: "jobOpening",
    label: "Job Opening",
    plural: "Job Openings",
    hasStatus: true,
    listFields: ["title", "employment", "status"],
    defaultOrderBy: { order: "asc" },
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "employment", label: "Employment", type: "text", required: true },
      { name: "location", label: "Location", type: "text" },
      { name: "description", label: "Description (short summary)", type: "textarea", required: true },
      { name: "body", label: "Role details (Markdown)", type: "markdown" },
      { name: "skills", label: "Skills", type: "jsonList" },
      { name: "order", label: "Order", type: "number" },
      // --- Spanish (es) ---
      { name: "titleEs", label: "Title (ES)", type: "text" },
      { name: "descriptionEs", label: "Description (short summary) (ES)", type: "textarea" },
      { name: "bodyEs", label: "Role details (Markdown) (ES)", type: "markdown" },
      { name: "employmentEs", label: "Employment (ES)", type: "text" },
      statusField,
    ],
  },
  client: {
    key: "client",
    label: "Client",
    plural: "Clients",
    hasStatus: false,
    listFields: ["name", "sector", "region"],
    defaultOrderBy: { name: "asc" },
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", help: "Auto-generated from name if blank" },
      { name: "sector", label: "Sector", type: "text" },
      { name: "region", label: "Region", type: "text" },
    ],
  },
  tag: {
    key: "tag",
    label: "Tag",
    plural: "Tags",
    hasStatus: false,
    listFields: ["name", "slug"],
    defaultOrderBy: { name: "asc" },
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", help: "Auto-generated from name if blank" },
      // --- Spanish (es) ---
      { name: "nameEs", label: "Name (ES)", type: "text" },
    ],
  },
};

export const ADMIN_MODEL_KEYS = Object.keys(ADMIN_MODELS);

export function getModel(key: string): AdminModel | undefined {
  return ADMIN_MODELS[key];
}
