/**
 * Email notification wrapper. Uses Resend if RESEND_API_KEY is set; otherwise
 * logs to the console (dev no-op). Swap the provider here without touching callers.
 */
type NotifyArgs = { subject: string; text: string };

export async function notify({ subject, text }: NotifyArgs): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_TO || "contact@viewnear.com";

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[notify:dev] To: ${to} | ${subject}\n${text}`);
    } else {
      console.error("[notify] RESEND_API_KEY not set; notification not sent.");
    }
    return;
  }

  let res: Response;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Viewnear <noreply@viewnear.com>",
        to,
        subject,
        text,
      }),
    });
  } catch (err) {
    console.error("[notify] failed to send email:", err);
    throw err;
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[notify] Resend ${res.status}: ${body}`);
    throw new Error(`Resend responded ${res.status}`);
  }
}
