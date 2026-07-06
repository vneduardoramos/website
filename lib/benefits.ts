/**
 * Shared benefits, surfaced both on /life-at-viewnear and on each job page so
 * the two never drift. `label` is the short ledger eyebrow BenefitsGrid renders.
 */
export type Benefit = {
  label: string;
  title: string;
  body: string;
};

export const BENEFITS: Benefit[] = [
  {
    label: "Health",
    title: "Health insurance",
    body: "Comprehensive medical coverage for you and your whole family.",
  },
  {
    label: "Health",
    title: "Dental & vision",
    body: "Optional dental and vision plans for the everyday essentials.",
  },
  {
    label: "Wellness",
    title: "Emotional wellness",
    body: "Optional mental-health and emotional-wellbeing support, because demanding work needs real balance.",
  },
  {
    label: "Balance",
    title: "Flexible time off",
    body: "Time off follows local law and stays flexible (no fixed cap) as long as outcomes stay strong and teams stay covered.",
  },
  {
    label: "Growth",
    title: "Learning & certifications",
    body: "Training, SnowPro certifications, conference travel, and event sponsorships: we reinvest in your growth.",
  },
  {
    label: "Together",
    title: "Team retreats",
    body: "Company retreats and in-person gatherings that build the relationships behind great delivery.",
  },
  {
    label: "Tooling",
    title: "The tools to do the work",
    body: "Modern hardware, paid AI tooling, and the licenses your projects need, from day one.",
  },
];
