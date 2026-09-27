import { asStringArray } from "@/lib/utils";

/**
 * Which half of the practice an engagement came from, read off its stack.
 *
 * Case cards carry a quiet line naming it, which is one of the places the two
 * partners are stated at low weight. Classification is by the stack's
 * *contents*, never by whether a stack exists: an earlier version keyed off the
 * presence of the array and silently mislabeled every Snowflake engagement the
 * moment those rows gained one.
 *
 * Claude wins a tie. An engagement that puts an agent on the work is an agentic
 * engagement even when the data under it is governed on Snowflake, which is the
 * usual case.
 */
export type CaseStackKey = "claude" | "snowflake";

export function caseStackKey(stack: unknown): CaseStackKey | null {
  const items = asStringArray(stack).map((s) => s.toLowerCase());
  if (items.some((s) => s.includes("claude") || s.includes("anthropic"))) return "claude";
  if (items.some((s) => s.includes("snowflake") || s.includes("cortex"))) return "snowflake";
  return null;
}
