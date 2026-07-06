"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Shared input styling; `aria-[invalid=true]` firms the border to danger red
// when a field has a validation error (JIT emits this arbitrary aria variant).
const inputCls =
  "w-full rounded border border-border bg-surface2 px-4 py-3 text-foreground aria-[invalid=true]:border-danger";

export function ContactForm() {
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

    // Client-side validation via the native Constraint Validation API (no deps).
    // `noValidate` on the form suppresses the browser's own bubbles so we can
    // render accessible, per-field messages instead.
    if (!form.checkValidity()) {
      const errs: Record<string, string> = {};
      let firstInvalid: HTMLElement | null = null;
      form
        .querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
          "input[name], textarea[name], select[name]",
        )
        .forEach((el) => {
          if (el.name === "website") return; // honeypot: never surface
          if (!el.checkValidity()) {
            errs[el.name] = el.validationMessage;
            if (!firstInvalid) firstInvalid = el;
          }
        });
      setFieldErrors(errs);
      setStatus("idle");
      // firstInvalid is an HTMLElement assigned in the loop above.
      (firstInvalid as HTMLElement | null)?.focus();
      return;
    }

    setStatus("loading");
    setError(null);
    setFieldErrors({});

    const data = new FormData(form);
    const payload = {
      firstName: String(data.get("firstName") || ""),
      lastName: String(data.get("lastName") || ""),
      email: String(data.get("email") || ""),
      company: String(data.get("company") || ""),
      role: String(data.get("role") || ""),
      message: String(data.get("message") || ""),
      website: String(data.get("website") || ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      // /thank-you is the single post-submit confirmation ("what happens next").
      router.push("/thank-you");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again or email us directly.");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card p-8">
      {/* Honeypot field: hidden from humans, catches bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <p className="mb-5 text-sm text-muted">
        Fields marked <span className="text-danger">*</span> are required.
      </p>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-first" className="mb-2 block text-sm text-muted">
              First name <span className="text-danger" aria-hidden="true">*</span>
            </label>
            <input
              id="contact-first"
              name="firstName"
              type="text"
              required
              autoComplete="given-name"
              onInput={() => clearField("firstName")}
              aria-invalid={fieldErrors.firstName ? true : undefined}
              aria-describedby={fieldErrors.firstName ? "contact-first-error" : undefined}
              className={inputCls}
            />
            {fieldErrors.firstName && (
              <p id="contact-first-error" role="alert" className="mt-1 text-sm text-danger">
                {fieldErrors.firstName}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="contact-last" className="mb-2 block text-sm text-muted">
              Last name <span className="text-danger" aria-hidden="true">*</span>
            </label>
            <input
              id="contact-last"
              name="lastName"
              type="text"
              required
              autoComplete="family-name"
              onInput={() => clearField("lastName")}
              aria-invalid={fieldErrors.lastName ? true : undefined}
              aria-describedby={fieldErrors.lastName ? "contact-last-error" : undefined}
              className={inputCls}
            />
            {fieldErrors.lastName && (
              <p id="contact-last-error" role="alert" className="mt-1 text-sm text-danger">
                {fieldErrors.lastName}
              </p>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-2 block text-sm text-muted">
            Email <span className="text-danger" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            onInput={() => clearField("email")}
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
            className={inputCls}
          />
          {fieldErrors.email && (
            <p id="contact-email-error" role="alert" className="mt-1 text-sm text-danger">
              {fieldErrors.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="contact-company" className="mb-2 block text-sm text-muted">
            Company
          </label>
          <input
            id="contact-company"
            name="company"
            type="text"
            autoComplete="organization"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="contact-role" className="mb-2 block text-sm text-muted">
            What do you need help with?
          </label>
          <select id="contact-role" name="role" defaultValue="" className={inputCls}>
            <option value="">Select an option</option>
            <option value="strategy">Data &amp; AI strategy / business outcomes</option>
            <option value="platform">Snowflake platform &amp; architecture</option>
            <option value="migration">Migration or modernization</option>
            <option value="analytics">Analytics, BI &amp; data products</option>
            <option value="other">Something else</option>
          </select>
        </div>
        <div>
          <label htmlFor="contact-message" className="mb-2 block text-sm text-muted">
            How can we help? <span className="text-danger" aria-hidden="true">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            onInput={() => clearField("message")}
            aria-invalid={fieldErrors.message ? true : undefined}
            aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
            className={inputCls}
          />
          {fieldErrors.message && (
            <p id="contact-message-error" role="alert" className="mt-1 text-sm text-danger">
              {fieldErrors.message}
            </p>
          )}
        </div>
      </div>

      {status === "error" && error ? (
        <p role="alert" className="mt-4 text-sm font-medium text-danger">{error}</p>
      ) : null}

      <button type="submit" disabled={status === "loading"} className="btn-primary mt-6 disabled:opacity-60">
        {status === "loading" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
