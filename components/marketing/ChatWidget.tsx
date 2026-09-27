"use client";

import Script from "next/script";
import { useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { consentIsCurrent, readConsent } from "@/lib/consent";
import { cn } from "@/lib/utils";

/**
 * Nova: the site's chat agent, mounted once in the marketing layout so it
 * survives client-side navigation between pages. The conversation is also
 * mirrored to localStorage (capped, with a freshness window) so it survives
 * a hard reload or a closed tab, not just an in-app route change.
 *
 * All the intelligence lives server-side in /api/chat: this component only
 * renders the transcript, sends what the visitor types, and turns a
 * `booking` reply into a real Calendly popup. Calendly's widget.js loads
 * lazily, only once a reply actually asks for it, so a conversation that
 * never reaches booking never fetches it.
 */

type Role = "user" | "assistant";
type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  booking?: { name: string; url: string } | null;
};

const STORAGE_KEY = "vn-chat-v1";
const MAX_STORED = 20;
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // a day: old chats start fresh rather than resurface stale context
const CALENDLY_CSS = "https://assets.calendly.com/assets/external/widget.css";
const CALENDLY_JS = "https://assets.calendly.com/assets/external/widget.js";

type StoredSession = { ts: number; open: boolean; messages: ChatMessage[] };

function loadSession(): StoredSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    if (Date.now() - parsed.ts > MAX_AGE_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveSession(session: StoredSession) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...session, messages: session.messages.slice(-MAX_STORED) }),
    );
  } catch {
    // Storage-hostile environment (private mode, quota): the chat still
    // works for this pageview, it just won't survive a reload.
  }
}

function popupUrl(raw: string): string {
  try {
    const u = new URL(raw);
    if (u.hostname === "calendly.com" || u.hostname.endsWith(".calendly.com")) {
      u.searchParams.set("hide_event_type_details", "1");
      u.searchParams.set("hide_gdpr_banner", "1");
    }
    return u.toString();
  } catch {
    return raw;
  }
}

let idCounter = 0;
const nextId = () => `m${Date.now()}-${idCounter++}`;

export function ChatWidget() {
  const t = useTranslations("chatUi");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [needsCalendly, setNeedsCalendly] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  // Starts false to match the server render; an effect below corrects it
  // client-side, after hydration, so the two never disagree on className.
  const [bannerVisible, setBannerVisible] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelId = useId();

  // Restore a prior session on mount. Runs once, client-only: nothing here
  // needs to match a server render, since the widget starts empty on the
  // server and every visitor's stored session is different.
  useEffect(() => {
    const stored = loadSession();
    if (stored) {
      setMessages(stored.messages);
      setOpen(stored.open);
      if (stored.messages.some((m) => m.booking)) setNeedsCalendly(true);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveSession({ ts: Date.now(), open, messages });
  }, [hydrated, open, messages]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, sending]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Mirrors ConsentBanner's own visibility so the launcher and panel sit
  // above its full-width bar instead of under it, and follow it up or down
  // as the visitor makes (or reopens) their choice.
  useEffect(() => {
    setBannerVisible(!consentIsCurrent(readConsent()));
    const onOpen = () => setBannerVisible(true);
    // Either choice dismisses the banner, so a change event always means "hidden now".
    const onChange = () => setBannerVisible(false);
    window.addEventListener("vn-consent-open", onOpen);
    window.addEventListener("vn-consent-change", onChange);
    return () => {
      window.removeEventListener("vn-consent-open", onOpen);
      window.removeEventListener("vn-consent-change", onChange);
    };
  }, []);

  const openBooking = (url: string) => {
    if (window.Calendly?.initPopupWidget) {
      window.Calendly.initPopupWidget({ url: popupUrl(url) });
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setNotice(null);
    const userMsg: ChatMessage = { id: nextId(), role: "user", content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locale,
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (res.status === 429) {
        setNotice(t("rateLimited"));
        return;
      }
      if (!res.ok) {
        setNotice(t("error"));
        return;
      }

      const data = (await res.json()) as {
        reply?: string;
        booking?: { name: string; url: string } | null;
      };
      if (data.booking) setNeedsCalendly(true);
      setMessages((cur) => [
        ...cur,
        { id: nextId(), role: "assistant", content: data.reply || "", booking: data.booking ?? null },
      ]);
    } catch {
      setNotice(t("error"));
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {needsCalendly && (
        <>
          <link href={CALENDLY_CSS} rel="stylesheet" />
          <Script src={CALENDLY_JS} strategy="afterInteractive" />
        </>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t("close") : t("launcherLabel")}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          "fixed right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primaryDeep text-white shadow-soft-lg transition-transform hover:-translate-y-0.5",
          bannerVisible ? "bottom-24" : "bottom-6",
        )}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={t("title")}
          className={cn(
            "fixed right-5 z-40 flex w-[min(22rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-soft-lg",
            bannerVisible ? "bottom-[8.5rem]" : "bottom-24",
          )}
          style={{ maxHeight: "min(32rem, calc(100vh - 8rem))" }}
        >
          <div className="flex items-center justify-between border-b border-border bg-surface2 px-4 py-3">
            <div>
              <p className="font-display text-sm font-bold text-foreground">{t("title")}</p>
              <p className="text-xs text-muted">{t("subtitle")}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("close")}
              className="rounded-full p-1.5 text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              <CloseIcon small />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <ChatBubble role="assistant">{t("greeting")}</ChatBubble>
            )}
            {messages.map((m) => (
              <div key={m.id}>
                <ChatBubble role={m.role}>{m.content}</ChatBubble>
                {m.booking && (
                  <button
                    type="button"
                    onClick={() => openBooking(m.booking!.url)}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-surface2 px-3 py-1.5 text-xs font-semibold text-primaryDeep transition-colors hover:bg-primary/10"
                  >
                    {t("bookCta", { name: m.booking.name })}
                    <span aria-hidden="true">→</span>
                  </button>
                )}
              </div>
            ))}
            {sending && <ChatBubble role="assistant" muted>{t("typing")}</ChatBubble>}
            {notice && <p className="text-center text-xs text-red">{notice}</p>}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("placeholder")}
              maxLength={600}
              disabled={sending}
              className="min-w-0 flex-1 rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground outline-none focus:border-primary/60"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label={t("send")}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primaryDeep text-white transition-opacity disabled:opacity-40"
            >
              <SendIcon />
            </button>
          </form>
          <p className="border-t border-border px-4 py-2 text-center text-[0.65rem] text-muted">
            {t("disclaimer")}
          </p>
        </div>
      )}
    </>
  );
}

function ChatBubble({
  role,
  muted,
  children,
}: {
  role: Role;
  muted?: boolean;
  children: React.ReactNode;
}) {
  const isUser = role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <p
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
          isUser
            ? "rounded-br-sm bg-primaryDeep text-white"
            : cn("rounded-bl-sm bg-surface2 text-foreground", muted && "text-muted"),
        )}
      >
        {children}
      </p>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function CloseIcon({ small }: { small?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={small ? "h-4 w-4" : "h-6 w-6"} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}
