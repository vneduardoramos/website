/**
 * Shared benefits, surfaced both on /life-at-viewnear and on each job page so
 * the two never drift. `icon` + `accent` are rendered by BenefitsGrid.
 */
export type BenefitIcon =
  | "heart"
  | "shieldPlus"
  | "smile"
  | "sun"
  | "cap"
  | "mountain"
  | "sparkles";

export type BenefitAccent =
  | "red"
  | "blue"
  | "purple"
  | "amber"
  | "cyan"
  | "green"
  | "indigo";

export type Benefit = {
  icon: BenefitIcon;
  accent: BenefitAccent;
  title: string;
  body: string;
};

export const BENEFITS: Benefit[] = [
  {
    icon: "heart",
    accent: "red",
    title: "Health insurance",
    body: "Comprehensive medical coverage for you and your whole family.",
  },
  {
    icon: "shieldPlus",
    accent: "blue",
    title: "Dental & vision",
    body: "Optional dental and vision plans for the everyday essentials.",
  },
  {
    icon: "smile",
    accent: "purple",
    title: "Emotional wellness",
    body: "Optional mental-health and emotional-wellbeing support, because sustained excellence needs real balance.",
  },
  {
    icon: "sun",
    accent: "amber",
    title: "Flexible time off",
    body: "Time off follows local law and stays flexible (no fixed cap) as long as outcomes stay strong and teams stay covered.",
  },
  {
    icon: "cap",
    accent: "cyan",
    title: "Learning & certifications",
    body: "Training, SnowPro certifications, conference travel, and event sponsorships: we reinvest in your growth.",
  },
  {
    icon: "mountain",
    accent: "green",
    title: "Team retreats",
    body: "Company retreats and in-person gatherings that build the relationships behind great delivery.",
  },
  {
    icon: "sparkles",
    accent: "indigo",
    title: "Best-in-class tools",
    body: "Premium tooling and licensing (including the AI-native stack) so you always do your best work.",
  },
];
