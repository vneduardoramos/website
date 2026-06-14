"use client";

import { useState } from "react";

type MediaItem = { url: string; alt: string | null };

export function ImageField({
  name,
  defaultValue,
  library,
}: {
  name: string;
  defaultValue?: string;
  library: MediaItem[];
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [picking, setPicking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(json.error ?? "Upload failed");
      return;
    }
    setUrl(json.media.url);
  }

  return (
    <div className="rounded-lg border border-border bg-surface2 p-3">
      <input type="hidden" name={name} value={url} />
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Selected image preview" className="mb-3 aspect-video w-full max-w-sm rounded-md object-cover" />
      ) : (
        <p className="mb-3 text-sm text-muted">No image set.</p>
      )}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="btn-ghost btn-sm cursor-pointer">
          {busy ? "Uploading…" : "Upload"}
          <input type="file" accept="image/*" className="hidden" onChange={upload} disabled={busy} />
        </label>
        <button type="button" className="btn-ghost btn-sm" onClick={() => setPicking((p) => !p)}>
          Pick from library
        </button>
        {url && (
          <button type="button" className="text-xs font-semibold text-red-600" onClick={() => setUrl("")}>
            Clear
          </button>
        )}
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      {picking && (
        <div className="mt-3 grid max-h-64 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
          {library.length === 0 && <p className="text-xs text-muted">No media uploaded yet.</p>}
          {library.map((m) => (
            <button
              key={m.url}
              type="button"
              onClick={() => {
                setUrl(m.url);
                setPicking(false);
              }}
              className="overflow-hidden rounded-md border border-border hover:border-primary"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.url} alt={m.alt ?? ""} className="aspect-video w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
