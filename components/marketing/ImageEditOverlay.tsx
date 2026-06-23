"use client";
import { useRef, useState } from "react";
import type { EditRequest } from "@/components/marketing/EditModeProvider";

interface PexelsPhoto {
  id: number;
  thumb: string;
  full: string;
  alt: string;
  photographer: string;
}

type PexelsState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "not-configured" }
  | { status: "results"; photos: PexelsPhoto[]; hasMore: boolean }
  | { status: "empty" };

export function ImageEditOverlay({ request, onClose }: { request: EditRequest; onClose: () => void }) {
  const [mediaUrl, setMediaUrl] = useState<string | null>(request.override?.mediaUrl ?? null);
  const [focalX, setFocalX] = useState(request.override?.focalX ?? 50);
  const [focalY, setFocalY] = useState(request.override?.focalY ?? 50);
  const [zoom, setZoom] = useState(request.override?.zoom ?? 1);
  const [alt, setAlt] = useState(request.override?.alt ?? request.alt);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const [pexelsQuery, setPexelsQuery] = useState("");
  const [pexelsState, setPexelsState] = useState<PexelsState>({ status: "idle" });
  const [pexelsPickBusy, setPexelsPickBusy] = useState<number | null>(null);
  const [page, setPage] = useState(1);

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

  async function searchPexelsPage(q: string, targetPage: number) {
    if (!q) return;
    setPexelsState({ status: "loading" });
    setError(null);
    try {
      const res = await fetch(`/api/pexels/search?q=${encodeURIComponent(q)}&page=${targetPage}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Search failed");
      if (!json.configured) {
        setPexelsState({ status: "not-configured" });
        return;
      }
      if (!json.photos || json.photos.length === 0) {
        setPexelsState({ status: "empty" });
        return;
      }
      setPage(json.page as number);
      setPexelsState({ status: "results", photos: json.photos, hasMore: Boolean(json.hasMore) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Pexels search failed");
      setPexelsState({ status: "idle" });
    }
  }

  async function searchPexels() {
    const q = pexelsQuery.trim();
    if (!q) return;
    setPage(1);
    await searchPexelsPage(q, 1);
  }

  async function pickPexelsPhoto(photo: PexelsPhoto) {
    setPexelsPickBusy(photo.id);
    setError(null);
    try {
      const res = await fetch("/api/pexels/select", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: photo.full }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to select photo");
      setMediaUrl(json.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to select photo");
    } finally {
      setPexelsPickBusy(null);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 p-4" role="dialog" aria-modal="true">
      <div className="flex w-full max-w-4xl flex-col rounded-2xl bg-background shadow-soft-lg" style={{ maxHeight: "88vh" }}>

        {/* Header */}
        <div className="flex-none px-6 pt-6 pb-4 border-b border-border">
          <h2 className="font-display text-lg font-bold text-foreground">Edit image</h2>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="grid md:grid-cols-2 gap-6">

            {/* LEFT — preview, zoom, alt, upload */}
            <div className="flex flex-col gap-4">
              <div
                ref={frameRef}
                onMouseMove={onDrag}
                onMouseDown={(e) => e.preventDefault()}
                className="relative aspect-[16/10] w-full cursor-move select-none overflow-hidden rounded-xl border border-border bg-surface2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewSrc}
                  alt=""
                  draggable={false}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: `${focalX}% ${focalY}%`, transform: zoom > 1 ? `scale(${zoom})` : undefined }}
                />
                <span className="pointer-events-none absolute bottom-2 left-2 rounded bg-foreground/70 px-2 py-0.5 text-xs text-white">
                  Drag to reposition
                </span>
              </div>

              <label className="block text-sm font-medium text-foreground">Zoom
                <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="mt-1 w-full" />
              </label>

              <label className="block text-sm font-medium text-foreground">Alt text
                <input value={alt} onChange={(e) => setAlt(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
              </label>

              <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} className="block text-sm" />
            </div>

            {/* RIGHT — Pexels search */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-foreground">Search Pexels</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pexelsQuery}
                  onChange={(e) => setPexelsQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") searchPexels(); }}
                  placeholder="e.g. data analytics"
                  className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={searchPexels}
                  disabled={pexelsState.status === "loading" || !pexelsQuery.trim()}
                  className="btn-ghost btn-sm"
                >
                  {pexelsState.status === "loading" ? "Searching..." : "Search"}
                </button>
              </div>

              {pexelsState.status === "not-configured" && (
                <p className="text-xs text-foreground/50">Pexels search isn&apos;t set up.</p>
              )}

              {pexelsState.status === "empty" && (
                <p className="text-sm text-foreground/60">No results.</p>
              )}

              {pexelsState.status === "results" && (
                <div className="flex flex-col gap-2">
                  <div className="overflow-y-auto rounded-lg" style={{ maxHeight: "320px" }}>
                    <div className="grid grid-cols-3 gap-2">
                      {pexelsState.photos.map((photo) => (
                        <button
                          key={photo.id}
                          type="button"
                          onClick={() => pickPexelsPhoto(photo)}
                          disabled={pexelsPickBusy !== null}
                          className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                          title={photo.photographer ? `Photo by ${photo.photographer}` : photo.alt}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.thumb}
                            alt={photo.alt}
                            className="h-full w-full object-cover"
                          />
                          {pexelsPickBusy === photo.id && (
                            <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-foreground/50 text-xs text-white">
                              Loading...
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pagination controls */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => searchPexelsPage(pexelsQuery.trim(), page - 1)}
                      className="btn-ghost btn-sm"
                    >
                      Prev
                    </button>
                    <span className="text-xs text-foreground/60">Page {page}</span>
                    <button
                      type="button"
                      disabled={!pexelsState.hasMore}
                      onClick={() => searchPexelsPage(pexelsQuery.trim(), page + 1)}
                      className="btn-ghost btn-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red">{error}</p>}
        </div>

        {/* Footer — always visible */}
        <div className="flex-none border-t border-border px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={reset} disabled={busy} className="btn-ghost btn-sm">Reset to default</button>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} disabled={busy} className="btn-ghost btn-sm">Cancel</button>
              <button type="button" onClick={save} disabled={busy} className="btn-primary btn-sm">{busy ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
