/**
 * Renders a JSON-LD structured-data block. Pass a schema.org object (or array).
 * Server-rendered into the page <head>/<body>; safe (no user input interpolated
 * unescaped beyond JSON.stringify, which escapes for a script context).
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
