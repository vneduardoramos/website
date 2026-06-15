"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ApplicationForm({ openingTitle }: { openingTitle?: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const form = e.currentTarget;
    // Send as multipart so the optional resume file rides along.
    const data = new FormData(form);

    try {
      const res = await fetch("/api/careers", { method: "POST", body: data });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || "Request failed");
      }
      setStatus("success");
      form.reset();
      router.push("/thank-you");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error && err.message !== "Request failed"
          ? err.message
          : "Something went wrong. Please try again or email us directly.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="card p-8">
        <h3 className="font-display text-xl font-bold text-foreground">Application received</h3>
        <p className="mt-3 text-muted">
          Thanks for your interest in Viewnear. Our team will review your application and reach out
          if there is a fit.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-8">
      <h3 className="font-display text-xl font-bold text-foreground">Apply now</h3>
      {openingTitle ? (
        <p className="mt-2 text-sm text-muted">
          Applying for: <span className="text-primaryDeep">{openingTitle}</span>
        </p>
      ) : null}

      <input type="hidden" name="openingTitle" value={openingTitle ?? ""} />

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="app-name" className="mb-2 block text-sm text-muted">
            Full name
          </label>
          <input
            id="app-name"
            name="name"
            type="text"
            required
            className="w-full rounded border border-border bg-surface2 px-4 py-3 text-foreground"
          />
        </div>
        <div>
          <label htmlFor="app-email" className="mb-2 block text-sm text-muted">
            Email
          </label>
          <input
            id="app-email"
            name="email"
            type="email"
            required
            className="w-full rounded border border-border bg-surface2 px-4 py-3 text-foreground"
          />
        </div>
        <div>
          <label htmlFor="app-linkedin" className="mb-2 block text-sm text-muted">
            LinkedIn profile <span className="text-muted/70">(optional)</span>
          </label>
          <input
            id="app-linkedin"
            name="linkedinUrl"
            type="url"
            inputMode="url"
            placeholder="https://www.linkedin.com/in/your-profile"
            className="w-full rounded border border-border bg-surface2 px-4 py-3 text-foreground"
          />
        </div>
        <div>
          <label htmlFor="app-message" className="mb-2 block text-sm text-muted">
            Tell us about yourself
          </label>
          <textarea
            id="app-message"
            name="message"
            rows={5}
            required
            className="w-full rounded border border-border bg-surface2 px-4 py-3 text-foreground"
          />
        </div>
        <div>
          <label htmlFor="app-resume" className="mb-2 block text-sm text-muted">
            Resume <span className="text-muted/70">(optional, PDF or Word, max 8 MB)</span>
          </label>
          <input
            id="app-resume"
            name="resume"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="w-full rounded border border-border bg-surface2 px-4 py-3 text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary/15 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primaryDeep hover:file:bg-primary/20"
          />
        </div>
      </div>

      {status === "error" && error ? (
        <p role="alert" className="mt-4 text-sm font-medium text-danger">{error}</p>
      ) : null}

      <button type="submit" disabled={status === "loading"} className="btn-primary mt-6 disabled:opacity-60">
        {status === "loading" ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
}
