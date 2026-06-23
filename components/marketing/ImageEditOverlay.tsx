"use client";
import { useRef, useState } from "react";
import type { EditRequest } from "@/components/marketing/EditModeProvider";

export function ImageEditOverlay({ request, onClose }: { request: EditRequest; onClose: () => void }) {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [focalX, setFocalX] = useState(50);
  const [focalY, setFocalY] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [alt, setAlt] = useState(request.alt);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const previewSrc = mediaUrl || request.baseSrc;

  async function upload(file: File) {
    setBusy(true); setError(null);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setMediaUrl(json.media.url);
    } catch (e) { setError(e instanceof Error ? e.message : "Upload failed"); }
    finally { setBusy(false); }
  }

  function onDrag(e: React.MouseEvent) {
    if (e.buttons !== 1 || !frameRef.current) return;
    const r = frameRef.current.getBoundingClientRect();
    setFocalX(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
    setFocalY(Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100)));
  }

  async function save() {
    setBusy(true); setError(null);
    try {
      const res = await fetch("/api/image-overrides", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key: request.key, mediaUrl, focalX, focalY, zoom, alt }),
      });
      if (!res.ok) throw new Error("Save failed");
      window.location.reload();
    } catch (e) { setError(e instanceof Error ? e.message : "Save failed"); setBusy(false); }
  }

  async function reset() {
    setBusy(true); setError(null);
    try {
      const res = await fetch(`/api/image-overrides?key=${encodeURIComponent(request.key)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Reset failed");
      window.location.reload();
    } catch (e) { setError(e instanceof Error ? e.message : "Reset failed"); setBusy(false); }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-2xl bg-background p-6 shadow-soft-lg">
        <h2 className="font-display text-lg font-bold text-foreground">Edit image</h2>
        <div
          ref={frameRef}
          onMouseMove={onDrag}
          className="relative mt-4 aspect-[16/10] w-full cursor-move overflow-hidden rounded-xl border border-border bg-surface2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewSrc}
            alt=""
            className="h-full w-full object-cover"
            style={{ objectPosition: `${focalX}% ${focalY}%`, transform: zoom > 1 ? `scale(${zoom})` : undefined }}
          />
          <span className="pointer-events-none absolute bottom-2 left-2 rounded bg-foreground/70 px-2 py-0.5 text-xs text-white">
            Drag to reposition
          </span>
        </div>

        <label className="mt-4 block text-sm font-medium text-foreground">Zoom
          <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="mt-1 w-full" />
        </label>

        <label className="mt-3 block text-sm font-medium text-foreground">Alt text
          <input value={alt} onChange={(e) => setAlt(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
        </label>

        <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} className="mt-3 block text-sm" />

        {error && <p className="mt-3 text-sm text-red">{error}</p>}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={reset} disabled={busy} className="btn-ghost btn-sm">Reset to default</button>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} disabled={busy} className="btn-ghost btn-sm">Cancel</button>
            <button type="button" onClick={save} disabled={busy} className="btn-primary btn-sm">{busy ? "Saving..." : "Save"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
