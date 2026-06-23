/**
 * LLM providers available in Snowflake Cortex, for the Data + AI page.
 *
 * `family` is the durable label (versions rot fast). `token` is a representative
 * AI_COMPLETE() model string for the "swap models" demo and is illustrative only;
 * re-check against the Cortex AISQL model list (docs.snowflake.com) before relying
 * on exact strings. `claude-opus-4-8` is current per the build environment.
 *
 * Marks are official brand glyphs (Simple Icons), rendered monochrome via CSS mask
 * so they can light up in `color` when active. Reka has no mark asset → wordmark.
 */
export type ModelProvider = {
  key: string;
  name: string; // lab / provider
  family: string; // model family (the durable label)
  token: string; // a representative Cortex model string
  src?: string; // monochrome mark SVG (omit → render the name as a wordmark)
  color: string; // brand color for the active "lit" state
};

export const MODEL_PROVIDERS: ModelProvider[] = [
  { key: "anthropic", name: "Anthropic", family: "Claude", token: "claude-opus-4-8", src: "/assets/images/providers/anthropic.svg", color: "#D97757" },
  { key: "openai", name: "OpenAI", family: "GPT", token: "openai-gpt-4.1", src: "/assets/images/providers/openai.svg", color: "#0F0F0F" },
  { key: "meta", name: "Meta", family: "Llama", token: "llama3.3-70b", src: "/assets/images/providers/meta.svg", color: "#1877F2" },
  { key: "mistral", name: "Mistral AI", family: "Mistral", token: "mistral-large2", src: "/assets/images/providers/mistral.svg", color: "#FA520F" },
  { key: "gemini", name: "Google", family: "Gemini", token: "gemini-2.5-pro", src: "/assets/images/providers/gemini.svg", color: "#1C69FF" },
  { key: "deepseek", name: "DeepSeek", family: "DeepSeek", token: "deepseek-r1", src: "/assets/images/providers/deepseek.svg", color: "#4D6BFE" },
  { key: "snowflake", name: "Snowflake", family: "Arctic", token: "snowflake-arctic", src: "/assets/images/providers/snowflake.svg", color: "#29B5E8" },
  { key: "reka", name: "Reka AI", family: "Reka", token: "reka-flash", color: "#5B5BD6" },
];
