"use client";
import { useEffect, useRef, useState } from "react";
import type { EditRequest } from "@/components/marketing/EditModeProvider";
import { MIN_ZOOM, MAX_ZOOM } from "@/lib/image-overrides";

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

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function ImageEditOverlay({ request, onClose }: { request: EditRequest; onClose: () => void }) {
  const [mediaUrl, setMediaUrl] = useState<string | null>(request.override?.mediaUrl ?? null);
  const [focalX, setFocalX] = useState(request.override?.focalX ?? 50);
  const [focalY, setFocalY] = useState(request.override?.focalY ?? 50);
  const [zoom, setZoom] = useState(request.override?.zoom ?? 1);
  const [alt, setAlt] = useState(request.override?.alt ?? request.alt);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const frameRef = useRef<HTMLDivElement>(null);
  // Natural dimensions of the previewed image, needed to calibrate the
  // grab-to-pan so the image tracks the cursor 1:1 within its cover overflow.
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  // Drag origin: cursor position + focal point at mousedown.
  const dragRef = useRef<{ x: number; y: number; fx: number; fy: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const [pexelsQuery, setPexelsQuery] = useState("");
  const [pexelsState, setPexelsState] = useState<PexelsState>({ status: "idle" });
  const [pexelsPickBusy, setPexelsPickBusy] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const [urlInput, setUrlInput] = useState("");
  const [urlBusy, setUrlBusy] = useState(false);

  const previewSrc = mediaUrl || request.baseSrc;

  // Match the editor preview to the real slot's shape (WYSIWYG). Fall back to
  // 16:10 only if the slot couldn't be measured.
  const slotW = request.slotWidth > 0 ? request.slotWidth : 16;
  const slotH = request.slotHeight > 0 ? request.slotHeight : 10;

  // Grab-to-pan: while dragging, move the image with the cursor (mapped through
  // the real cover overflow at the current zoom), clamped so the slot stays
  // covered. Identical focal/zoom is applied live, so what you see ships.
  useEffect(() => {
    if (!dragging) return;
    function move(e: MouseEvent) {
      const d = dragRef.current;
      const frame = frameRef.current;
      if (!d || !frame || !natural) return;
      const r = frame.getBoundingClientRect();
      const coverScale = Math.max(r.width / natural.w, r.height / natural.h);
      const coverW = natural.w * coverScale;
      const coverH = natural.h * coverScale;
      // On-screen pannable range per axis = the displayed content size (cover
      // size magnified by zoom) minus the frame. This counts BOTH the cover
      // overflow (loose axis) and the overflow that zoom itself creates (tight
      // axis), so panning works in either axis once there is room.
      const rangeX = Math.max(0, coverW * zoom - r.width);
      const rangeY = Math.max(0, coverH * zoom - r.height);
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;
      // Drag right -> reveal the left of the image -> focal decreases.
      setFocalX(rangeX > 0 ? clamp(d.fx - (dx / rangeX) * 100, 0, 100) : d.fx);
      setFocalY(rangeY > 0 ? clamp(d.fy - (dy / rangeY) * 100, 0, 100) : d.fy);
    }
    function up() { setDragging(false); }
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging, zoom, natural]);

  function startDrag(e: React.MouseEvent) {
    e.preventDefault();
    dragRef.current = { x: e.clientX, y: e.clientY, fx: focalX, fy: focalY };
    setDragging(true);
  }

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

  async function snapFromUrl() {
    const u = urlInput.trim();
    if (!u) return;
    setUrlBusy(true); setError(null);
    try {
      const res = await fetch("/api/image-from-url", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: u }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not fetch that image");
      setMediaUrl(json.url);
      setUrlInput("");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not fetch that image"); }
    finally { setUrlBusy(false); }
  }

  async function save() {
    setBusy(true); setError(null);
    try {
      const res = await fetch("/api/image-overrides", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key: request.key, mediaUrl, focalX, focalY, zoom, alt }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Save failed");
      window.location.reload();
    } catch (e) { setError(e instanceof Error ? e.message : "Save failed"); setBusy(false); }
  }

  async function reset() {
    setBusy(true); setError(null);
    try {
      const res = await fetch(`/api/image-overrides?key=${encodeURIComponent(request.key)}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Reset failed");
      window.location.reload();
    } catch (e) { setError(e instanceof Error ? e.message : "Reset failed"); setBusy(false); }
  }

  function recenter() {
    setFocalX(50); setFocalY(50); setZoom(1);
  }

  async function searchPexelsPage(q: string, targetPage: number) {
    if (!q) return;
    setPexelsState({ status: "loading" });
    setError(null);
    try {
      const res = await fetch(`/api/pexels/search?q=${encodeURIComponent(q)}&page=${targetPage}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Search failed");
      if (!json.configured) { setPexelsState({ status: "not-configured" }); return; }
      if (!json.photos || json.photos.length === 0) { setPexelsState({ status: "empty" }); return; }
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
      <div className="flex w-full max-w-4xl flex-col rounded-2xl bg-background shadow-soft-lg" style={{ maxHeight: "90vh" }}>

        {/* Header */}
        <div className="flex flex-none items-center justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">Edit image</h2>
            <p className="text-xs text-muted">Drag the image to reposition. The frame matches where this image appears on the page.</p>
          </div>
          <button type="button" onClick={onClose} disabled={busy} aria-label="Close" className="rounded-md p-1 text-muted hover:text-foreground">✕</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid gap-6 md:grid-cols-[1.15fr_1fr]">

            {/* LEFT: true-shape preview + framing controls */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center rounded-xl bg-surface2 p-3">
                <div
                  ref={frameRef}
                  onMouseDown={startDrag}
                  className={`relative select-none overflow-hidden rounded-lg border border-border bg-surface ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
                  // Honor BOTH caps while keeping the slot's exact aspect: width is
                  // the smaller of the column width and the width that a 48vh-tall
                  // box of this aspect would have, so height (derived via
                  // aspect-ratio) never exceeds 48vh and the shape always matches.
                  style={{ aspectRatio: `${slotW} / ${slotH}`, width: `min(100%, calc(48vh * ${slotW} / ${slotH}))` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewSrc}
                    alt=""
                    draggable={false}
                    onLoad={(e) => setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
                    className="pointer-events-none h-full w-full object-cover"
                    style={{
                      objectPosition: `${focalX}% ${focalY}%`,
                      transform: zoom !== 1 ? `scale(${zoom})` : undefined,
                      transformOrigin: `${focalX}% ${focalY}%`,
                    }}
                  />
                  <span className="pointer-events-none absolute bottom-2 left-2 rounded bg-foreground/70 px-2 py-0.5 text-xs text-white">
                    Drag to reposition
                  </span>
                </div>
              </div>

              <label className="block text-sm font-medium text-foreground">
                Zoom <span className="font-normal text-muted">{zoom.toFixed(2)}×</span>
                <input type="range" min={MIN_ZOOM} max={MAX_ZOOM} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="mt-1 w-full" />
                <span className="mt-1 flex justify-between text-[0.7rem] text-muted">
                  <span>Zoom out to fit</span>
                  <span>Zoom in to crop</span>
                </span>
              </label>

              <button type="button" onClick={recenter} className="self-start text-xs font-semibold text-primaryDeep underline-offset-4 hover:underline">
                Recenter &amp; reset zoom
              </button>

              <label className="block text-sm font-medium text-foreground">Alt text
                <input value={alt} onChange={(e) => setAlt(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
              </label>
            </div>

            {/* RIGHT: replace the image (optional) */}
            <div className="flex flex-col gap-4">
              <p className="text-sm font-semibold text-foreground">Replace image <span className="font-normal text-muted">(optional)</span></p>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-foreground/70">Upload from your computer</span>
                <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} className="block text-sm" />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-foreground/70">Paste an image URL</span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); snapFromUrl(); } }}
                    placeholder="https://example.com/photo.jpg"
                    className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                  />
                  <button type="button" onClick={snapFromUrl} disabled={urlBusy || !urlInput.trim()} className="btn-ghost btn-sm whitespace-nowrap">
                    {urlBusy ? "Snapping..." : "Snap it"}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t border-border pt-4">
                <span className="text-xs font-medium text-foreground/70">Search free stock photos (Pexels)</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pexelsQuery}
                    onChange={(e) => setPexelsQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") searchPexels(); }}
                    placeholder="e.g. data analytics"
                    className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                  />
                  <button type="button" onClick={searchPexels} disabled={pexelsState.status === "loading" || !pexelsQuery.trim()} className="btn-ghost btn-sm">
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
                    <div className="overflow-y-auto rounded-lg" style={{ maxHeight: "260px" }}>
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
                            <img src={photo.thumb} alt={photo.alt} className="h-full w-full object-cover" />
                            {pexelsPickBusy === photo.id && (
                              <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-foreground/50 text-xs text-white">Loading...</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button type="button" disabled={page <= 1} onClick={() => searchPexelsPage(pexelsQuery.trim(), page - 1)} className="btn-ghost btn-sm">Prev</button>
                      <span className="text-xs text-foreground/60">Page {page}</span>
                      <button type="button" disabled={!pexelsState.hasMore} onClick={() => searchPexelsPage(pexelsQuery.trim(), page + 1)} className="btn-ghost btn-sm">Next</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red">{error}</p>}
        </div>

        {/* Footer */}
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
