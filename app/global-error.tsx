"use client";

import { useEffect } from "react";

/**
 * Root-level error boundary. Replaces the root layout entirely, so it must
 * render its own <html>/<body> and can't rely on the app fonts/chrome. Kept
 * deliberately minimal and inline-styled for maximum robustness.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          color: "#0f2530",
          background: "#f6fbfe",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>
          Something went wrong.
        </h1>
        <p style={{ maxWidth: "28rem", color: "#4a5b63", margin: 0 }}>
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "0.5rem",
            cursor: "pointer",
            borderRadius: "0.75rem",
            border: "1px solid #29b5e8",
            background: "#c4e4f7",
            color: "#0f2530",
            padding: "0.75rem 1.5rem",
            fontWeight: 600,
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
