import type { MetadataRoute } from "next";
import { theme } from "@/config/theme";

/**
 * Crawler policy, stated per agent instead of relying on a single wildcard.
 *
 * `User-Agent: *` already allowed everything, so this grants no new access. It
 * makes the decision explicit and auditable, which matters because these agents
 * do different jobs: a future "block the AI bots" reflex would otherwise take
 * the retrieval bots down together with the training ones.
 *
 * The distinction worth preserving:
 *
 *   Retrieval and citation. These fetch a page so an assistant can answer a
 *   question now, and they attribute the answer with a link. Blocking them
 *   removes the site from AI answers, which is the opposite of the goal.
 *     OAI-SearchBot        ChatGPT's search index
 *     ChatGPT-User         a user-initiated fetch during a conversation
 *     PerplexityBot        Perplexity's index
 *     Perplexity-User      a user-initiated fetch
 *     ClaudeBot            Claude's index and user-initiated fetches
 *     Google-Extended      gates Gemini grounding and AI Overviews
 *     Applebot-Extended    gates Apple Intelligence
 *     DuckAssistBot        DuckDuckGo's assistant
 *     meta-externalagent   Meta AI
 *
 *   Training corpora. These feed model training rather than answering a live
 *   question, so allowing them earns no citation today. Left allowed, because
 *   appearing in training data is how a brand becomes a name a model knows
 *   unprompted, and this site publishes nothing it would not want quoted.
 *   Flip any of these to a disallow to opt out; the retrieval agents above are
 *   unaffected by that choice.
 *     GPTBot               OpenAI training
 *     CCBot                Common Crawl, which many models train on
 *     anthropic-ai         legacy Anthropic training agent
 *     cohere-ai            Cohere
 *     Bytespider           ByteDance
 *
 * `/admin` and `/api` stay closed to every agent: middleware.ts gates them and
 * they return 404 in production regardless.
 */
const RETRIEVAL_AGENTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "DuckAssistBot",
  "meta-externalagent",
];

const TRAINING_AGENTS = ["GPTBot", "CCBot", "anthropic-ai", "cohere-ai", "Bytespider"];

const DISALLOW = ["/admin", "/api"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      ...[...RETRIEVAL_AGENTS, ...TRAINING_AGENTS].map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${theme.brand.url}/sitemap.xml`,
  };
}
