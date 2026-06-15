"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ContactForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const form = e.currentTarget;
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
      setStatus("success");
      form.reset();
      router.push("/thank-you");
    } catch (err) {
      setStatus("error");
      setError("Something went wrong. Please try again or email us directly.");
    }
  }

  if (status === "success") {
    return (
      <div className="card p-8">
        <h3 className="font-display text-xl font-bold text-foreground">Message sent</h3>
        <p className="mt-3 text-muted">
          Thanks for reaching out. A member of the Viewnear team will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-8">
      {/* Honeypot field: hidden from humans, catches bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-first" className="mb-2 block text-sm text-muted">
              First name
            </label>
            <input
              id="contact-first"
              name="firstName"
              type="text"
              required
              className="w-full rounded border border-border bg-surface2 px-4 py-3 text-foreground"
            />
          </div>
          <div>
            <label htmlFor="contact-last" className="mb-2 block text-sm text-muted">
              Last name
            </label>
            <input
              id="contact-last"
              name="lastName"
              type="text"
              required
              className="w-full rounded border border-border bg-surface2 px-4 py-3 text-foreground"
            />
          </div>
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-2 block text-sm text-muted">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            className="w-full rounded border border-border bg-surface2 px-4 py-3 text-foreground"
          />
        </div>
        <div>
          <label htmlFor="contact-company" className="mb-2 block text-sm text-muted">
            Company
          </label>
          <input
            id="contact-company"
            name="company"
            type="text"
            className="w-full rounded border border-border bg-surface2 px-4 py-3 text-foreground"
          />
        </div>
        <div>
          <label htmlFor="contact-role" className="mb-2 block text-sm text-muted">
            What do you need help with? <span className="text-muted/70">(optional)</span>
          </label>
          <select
            id="contact-role"
            name="role"
            defaultValue=""
            className="w-full rounded border border-border bg-surface2 px-4 py-3 text-foreground"
          >
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
            How can we help?
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            className="w-full rounded border border-border bg-surface2 px-4 py-3 text-foreground"
          />
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
