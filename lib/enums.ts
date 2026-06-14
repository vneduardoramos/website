// App-level enums (SQLite stores these as plain strings; see schema.prisma).

export const PublishStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;
export type PublishStatus = (typeof PublishStatus)[keyof typeof PublishStatus];
export const PUBLISH_STATUSES = Object.values(PublishStatus);

export const UserRole = { ADMIN: "ADMIN", EDITOR: "EDITOR" } as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const ServiceTier = {
  THINK: "THINK",
  BUILD: "BUILD",
  GROW: "GROW",
} as const;
export type ServiceTier = (typeof ServiceTier)[keyof typeof ServiceTier];

export const LeadStatus = {
  NEW: "NEW",
  CONTACTED: "CONTACTED",
  QUALIFIED: "QUALIFIED",
  CLOSED: "CLOSED",
} as const;
export type LeadStatus = (typeof LeadStatus)[keyof typeof LeadStatus];
export const LEAD_STATUSES = Object.values(LeadStatus);

export const NewsKind = {
  announcement: "announcement",
  event: "event",
  press: "press",
} as const;
export type NewsKind = (typeof NewsKind)[keyof typeof NewsKind];
