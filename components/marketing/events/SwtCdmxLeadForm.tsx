"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// Shared with ContactForm's own input styling, so the two forms match.
const inputCls =
  "w-full rounded border border-border bg-surface2 px-4 py-3 text-foreground aria-[invalid=true]:border-danger";

/**
 * Lead capture for one dated event (Snowflake World Tour Mexico City, Oct 13,
 * 2026): a lighter form than ContactForm (no "what can we help with" select,
 * message is optional), posting to /api/events/swt-cdmx, which saves a `Lead`
 * and emails the team via Resend. Confirms inline rather than redirecting to
 * /thank-you: leaving the event page would lose the date/booth context that's
 * the whole point of being here.
 */
export function SwtCdmxLeadForm() {
  const t = useTranslations("forms.eventLead");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
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

    if (!form.checkValidity()) {
      const errs: Record<string, string> = {};
      let firstInvalid: HTMLElement | null = null;
      form
        .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input[name], textarea[name]")
        .forEach((el) => {
          if (el.name === "website") return; // honeypot: never surface
          if (!el.checkValidity()) {
            errs[el.name] = el.validationMessage;
            if (!firstInvalid) firstInvalid = el;
          }
        });
      setFieldErrors(errs);
      (firstInvalid as HTMLElement | null)?.focus();
      return;
    }

    setStatus("loading");
    setFieldErrors({});

    const data = new FormData(form);
    const payload = {
      firstName: String(data.get("firstName") || ""),
      lastName: String(data.get("lastName") || ""),
      email: String(data.get("email") || ""),
      company: String(data.get("company") || ""),
      message: String(data.get("message") || ""),
      website: String(data.get("website") || ""),
    };

    try {
      const res = await fetch("/api/events/swt-cdmx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="card p-8 text-center">
        <p className="font-display text-xl font-bold text-foreground">{t("successTitle")}</p>
        <p className="mt-2 leading-relaxed text-muted">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card p-8">
      {/* Honeypot field: hidden from humans, catches bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="swt-website">Website</label>
        <input id="swt-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="swt-first" className="mb-2 block text-sm text-muted">
              {t("firstName")}
            </label>
            <input
              id="swt-first"
              name="firstName"
              type="text"
              required
              autoComplete="given-name"
              onInput={() => clearField("firstName")}
              aria-invalid={fieldErrors.firstName ? true : undefined}
              aria-describedby={fieldErrors.firstName ? "swt-first-error" : undefined}
              className={inputCls}
            />
            {fieldErrors.firstName && (
              <p id="swt-first-error" role="alert" className="mt-1 text-sm text-danger">
                {fieldErrors.firstName}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="swt-last" className="mb-2 block text-sm text-muted">
              {t("lastName")}
            </label>
            <input
              id="swt-last"
              name="lastName"
              type="text"
              required
              autoComplete="family-name"
              onInput={() => clearField("lastName")}
              aria-invalid={fieldErrors.lastName ? true : undefined}
              aria-describedby={fieldErrors.lastName ? "swt-last-error" : undefined}
              className={inputCls}
            />
            {fieldErrors.lastName && (
              <p id="swt-last-error" role="alert" className="mt-1 text-sm text-danger">
                {fieldErrors.lastName}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="swt-email" className="mb-2 block text-sm text-muted">
            {t("email")}
          </label>
          <input
            id="swt-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            onInput={() => clearField("email")}
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? "swt-email-error" : undefined}
            className={inputCls}
          />
          {fieldErrors.email && (
            <p id="swt-email-error" role="alert" className="mt-1 text-sm text-danger">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="swt-company" className="mb-2 block text-sm text-muted">
            {t("company")}
          </label>
          <input id="swt-company" name="company" type="text" autoComplete="organization" className={inputCls} />
        </div>

        <div>
          <label htmlFor="swt-message" className="mb-2 block text-sm text-muted">
            {t("messageLabel")}
          </label>
          <textarea
            id="swt-message"
            name="message"
            rows={3}
            placeholder={t("messagePlaceholder")}
            className={inputCls}
          />
        </div>

        {status === "error" && (
          <p role="alert" className="text-sm text-danger">
            {t("error")}
          </p>
        )}

        <button type="submit" disabled={status === "loading"} className="btn-primary w-full justify-center">
          {status === "loading" ? t("sending") : t("send")}
        </button>
      </div>
    </form>
  );
}
