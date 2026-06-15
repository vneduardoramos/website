/**
 * Shared benefits, surfaced both on /life-at-viewnear and on each job page so
 * the two never drift. `icon` keys map to the PATHS set used by the Life page's
 * Ico component; the careers page renders them with its own icon.
 */
export type BenefitIcon =
  | "heart"
  | "shieldPlus"
  | "smile"
  | "sun"
  | "dollar"
  | "cap"
  | "mountain"
  | "sparkles";

export type Benefit = { icon: BenefitIcon; title: string; body: string };

export const BENEFITS: Benefit[] = [
  {
    icon: "heart",
    title: "Health insurance",
    body: "Comprehensive medical coverage for you and your whole family.",
  },
  {
    icon: "shieldPlus",
    title: "Dental & vision",
    body: "Optional dental and vision plans for the everyday essentials.",
  },
  {
    icon: "smile",
    title: "Emotional wellness",
    body: "Optional mental-health and emotional-wellbeing support, because sustained excellence needs real balance.",
  },
  {
    icon: "sun",
    title: "Flexible time off",
    body: "Time off follows local law and stays flexible (no fixed cap) as long as outcomes stay strong and teams stay covered.",
  },
  {
    icon: "dollar",
    title: "Pay above market",
    body: "Compensation targeted ~25% above market, plus performance bonuses tied to real outcomes.",
  },
  {
    icon: "cap",
    title: "Learning & certifications",
    body: "Training, SnowPro certifications, conference travel, and event sponsorships: we reinvest in your growth.",
  },
  {
    icon: "mountain",
    title: "Team retreats",
    body: "Company retreats and in-person gatherings that build the relationships behind great delivery.",
  },
  {
    icon: "sparkles",
    title: "Best-in-class tools",
    body: "Premium tooling and licensing (including the AI-native stack) so you always do your best work.",
  },
];
