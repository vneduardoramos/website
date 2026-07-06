"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputCls =
  "w-full rounded border border-border bg-surface2 px-4 py-3 text-foreground aria-[invalid=true]:border-danger";

export function ApplicationForm({ openingTitle }: { openingTitle?: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function clearField(name: string) {
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    // Native Constraint Validation API → accessible per-field messages (no deps).
    if (!form.checkValidity()) {
      const errs: Record<string, string> = {};
      let firstInvalid: HTMLElement | null = null;
      form
        .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input[name], textarea[name]")
        .forEach((el) => {
          if (!el.checkValidity()) {
            errs[el.name] = el.validationMessage;
            if (!firstInvalid) firstInvalid = el;
          }
        });
      setFieldErrors(errs);
      setStatus("idle");
      (firstInvalid as HTMLElement | null)?.focus();
      return;
    }

    setStatus("loading");
    setError(null);
    setFieldErrors({});

    // Send as multipart so the optional resume file rides along.
    const data = new FormData(form);

    try {
      const res = await fetch("/api/careers", { method: "POST", body: data });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || "Request failed");
      }
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

  return (
    <form onSubmit={handleSubmit} noValidate className="card p-8">
      <h3 className="font-display text-xl font-bold text-foreground">Apply now</h3>
      {openingTitle ? (
        <p className="mt-2 text-sm text-muted">
          Applying for: <span className="text-primaryDeep">{openingTitle}</span>
        </p>
      ) : null}

      <input type="hidden" name="openingTitle" value={openingTitle ?? ""} />

      <p className="mt-6 text-sm text-muted">
        Fields marked <span className="text-danger">*</span> are required.
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="app-name" className="mb-2 block text-sm text-muted">
            Full name <span className="text-danger" aria-hidden="true">*</span>
          </label>
          <input
            id="app-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            onInput={() => clearField("name")}
            aria-invalid={fieldErrors.name ? true : undefined}
            aria-describedby={fieldErrors.name ? "app-name-error" : undefined}
            className={inputCls}
          />
          {fieldErrors.name && (
            <p id="app-name-error" role="alert" className="mt-1 text-sm text-danger">
              {fieldErrors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="app-email" className="mb-2 block text-sm text-muted">
            Email <span className="text-danger" aria-hidden="true">*</span>
          </label>
          <input
            id="app-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            onInput={() => clearField("email")}
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? "app-email-error" : undefined}
            className={inputCls}
          />
          {fieldErrors.email && (
            <p id="app-email-error" role="alert" className="mt-1 text-sm text-danger">
              {fieldErrors.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="app-linkedin" className="mb-2 block text-sm text-muted">
            LinkedIn profile
          </label>
          <input
            id="app-linkedin"
            name="linkedinUrl"
            type="url"
            inputMode="url"
            placeholder="https://www.linkedin.com/in/your-profile"
            onInput={() => clearField("linkedinUrl")}
            aria-invalid={fieldErrors.linkedinUrl ? true : undefined}
            aria-describedby={fieldErrors.linkedinUrl ? "app-linkedin-error" : undefined}
            className={inputCls}
          />
          {fieldErrors.linkedinUrl && (
            <p id="app-linkedin-error" role="alert" className="mt-1 text-sm text-danger">
              {fieldErrors.linkedinUrl}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="app-message" className="mb-2 block text-sm text-muted">
            Tell us about yourself <span className="text-danger" aria-hidden="true">*</span>
          </label>
          <textarea
            id="app-message"
            name="message"
            rows={5}
            required
            onInput={() => clearField("message")}
            aria-invalid={fieldErrors.message ? true : undefined}
            aria-describedby={fieldErrors.message ? "app-message-error" : undefined}
            className={inputCls}
          />
          {fieldErrors.message && (
            <p id="app-message-error" role="alert" className="mt-1 text-sm text-danger">
              {fieldErrors.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="app-resume" className="mb-2 block text-sm text-muted">
            Resume <span className="text-muted">(PDF or Word, max 8 MB)</span>
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
