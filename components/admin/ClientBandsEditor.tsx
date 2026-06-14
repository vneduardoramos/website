"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { LogoRow } from "@/components/marketing/home/ClientLogos";
import type { BandLogo, ClientBands } from "@/lib/client-bands";

type CatalogItem = { key: string; src: string; alt: string; w: number; h: number };
type LibItem = { url: string; alt: string | null; filename: string };
type BandKey = "top" | "bottom";

const STEP = 2; // px per arrow nudge

export function ClientBandsEditor({
  initial,
  catalog,
  library,
}: {
  initial: ClientBands;
  catalog: CatalogItem[];
  library: LibItem[];
}) {
  const [bands, setBands] = useState<ClientBands>(initial);
  const [picker, setPicker] = useState<BandKey | null>(null);
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function dirty() {
    setSaved(false);
  }
  function update(band: BandKey, idx: number, patch: Partial<BandLogo>) {
    setBands((b) => ({
      ...b,
      [band]: b[band].map((l, i) => (i === idx ? { ...l, ...patch } : l)),
    }));
    dirty();
  }
  function removeLogo(band: BandKey, idx: number) {
    setBands((b) => ({ ...b, [band]: b[band].filter((_, i) => i !== idx) }));
    dirty();
  }
  function reorder(band: BandKey, idx: number, dir: -1 | 1) {
    setBands((b) => {
      const arr = [...b[band]];
      const j = idx + dir;
      if (j < 0 || j >= arr.length) return b;
      [arr[idx], arr[j]] = [arr[j], arr[idx]];
      return { ...b, [band]: arr };
    });
    dirty();
  }
  function addLogo(band: BandKey, logo: BandLogo) {
    setBands((b) => ({ ...b, [band]: [...b[band], logo] }));
    dirty();
  }
  function addCatalog(band: BandKey, c: CatalogItem) {
    addLogo(band, { src: c.src, alt: c.alt, w: c.w, h: c.h, dx: 0, dy: 0, scale: 1 });
  }
  async function addFromUrl(band: BandKey, src: string, alt: string) {
    const dims = await new Promise<{ w: number; h: number }>((resolve) => {
      const img = new window.Image();
      img.onload = () => resolve({ w: img.naturalWidth || 200, h: img.naturalHeight || 115 });
      img.onerror = () => resolve({ w: 200, h: 115 });
      img.src = src;
    });
    addLogo(band, { src, alt, w: dims.w, h: dims.h, dx: 0, dy: 0, scale: 1 });
  }
  async function onUpload(band: BandKey, file: File) {
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error ?? "Upload failed");
      return;
    }
    await addFromUrl(band, json.media.url, json.media.alt ?? file.name);
  }
  async function save() {
    setPending(true);
    setError("");
    try {
      const res = await fetch("/api/admin/client-bands", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(bands),
      });
      if (!res.ok) throw new Error("save failed");
      setSaved(true);
    } catch {
      setError("Save failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-6 space-y-8">
      {/* save bar */}
      <div className="sticky top-0 z-10 -mx-6 flex items-center gap-4 border-b border-border bg-background/95 px-6 py-3 backdrop-blur">
        <button type="button" onClick={save} disabled={pending} className="btn-primary btn-sm">
          {pending ? "Saving…" : "Save changes"}
        </button>
        {saved && <span className="text-sm font-medium text-emerald-600">Saved. The site is updated.</span>}
        {error && <span className="text-sm font-medium text-red-600">{error}</span>}
      </div>

      <BandSection
        title="Top band"
        subtitle="Above the “Leading teams” section (on white)."
        band="top"
        logos={bands.top}
        catalog={catalog}
        library={library}
        pickerOpen={picker === "top"}
        tint={false}
        onTogglePicker={() => setPicker((p) => (p === "top" ? null : "top"))}
        onAddCatalog={(c) => addCatalog("top", c)}
        onAddUrl={(url, alt) => addFromUrl("top", url, alt)}
        onUpload={(f) => onUpload("top", f)}
        onUpdate={(i, p) => update("top", i, p)}
        onRemove={(i) => removeLogo("top", i)}
        onReorder={(i, d) => reorder("top", i, d)}
      />

      <BandSection
        title="Bottom band"
        subtitle="Below the featured case-study card (on the tinted section)."
        band="bottom"
        logos={bands.bottom}
        catalog={catalog}
        library={library}
        pickerOpen={picker === "bottom"}
        tint
        onTogglePicker={() => setPicker((p) => (p === "bottom" ? null : "bottom"))}
        onAddCatalog={(c) => addCatalog("bottom", c)}
        onAddUrl={(url, alt) => addFromUrl("bottom", url, alt)}
        onUpload={(f) => onUpload("bottom", f)}
        onUpdate={(i, p) => update("bottom", i, p)}
        onRemove={(i) => removeLogo("bottom", i)}
        onReorder={(i, d) => reorder("bottom", i, d)}
      />
    </div>
  );
}

function BandSection({
  title,
  subtitle,
  logos,
  catalog,
  library,
  pickerOpen,
  tint,
  onTogglePicker,
  onAddCatalog,
  onAddUrl,
  onUpload,
  onUpdate,
  onRemove,
  onReorder,
}: {
  title: string;
  subtitle: string;
  band: BandKey;
  logos: BandLogo[];
  catalog: CatalogItem[];
  library: LibItem[];
  pickerOpen: boolean;
  tint: boolean;
  onTogglePicker: () => void;
  onAddCatalog: (c: CatalogItem) => void;
  onAddUrl: (url: string, alt: string) => void;
  onUpload: (f: File) => void;
  onUpdate: (idx: number, patch: Partial<BandLogo>) => void;
  onRemove: (idx: number) => void;
  onReorder: (idx: number, dir: -1 | 1) => void;
}) {
  return (
    <section className="card">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold">{title}</h2>
          <p className="text-sm text-muted">{subtitle}</p>
        </div>
        <span className="font-mono text-xs text-muted">{logos.length} logos</span>
      </div>

      {/* live preview */}
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-muted">Live preview</p>
      <div className={cn("mt-2 rounded-xl border border-border p-5", tint ? "section-tint" : "bg-background")}>
        {logos.length > 0 ? (
          <LogoRow logos={logos} />
        ) : (
          <p className="text-center text-sm text-muted">No logos in this band.</p>
        )}
      </div>

      {/* per-logo controls */}
      <div className="mt-4 space-y-3">
        {logos.map((logo, i) => (
          <LogoCard
            key={`${logo.src}-${i}`}
            logo={logo}
            isFirst={i === 0}
            isLast={i === logos.length - 1}
            onUpdate={(patch) => onUpdate(i, patch)}
            onRemove={() => onRemove(i)}
            onReorder={(dir) => onReorder(i, dir)}
          />
        ))}
      </div>

      {/* add controls */}
      <div className="mt-4 rounded-lg border border-dashed border-border p-3">
        <p className="text-xs font-semibold text-muted">Add a logo to this band</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {catalog.map((c) => (
            <button
              key={c.key}
              type="button"
              title={`Add ${c.alt}`}
              onClick={() => onAddCatalog(c)}
              className="flex h-9 items-center rounded border border-border bg-white px-2 hover:border-primary"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.src} alt={c.alt} className="h-5 w-auto" />
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <label className="btn-ghost btn-sm cursor-pointer">
            Upload new
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(f);
                e.target.value = "";
              }}
            />
          </label>
          <button type="button" className="btn-ghost btn-sm" onClick={onTogglePicker}>
            {pickerOpen ? "Hide library" : "Pick from library"}
          </button>
        </div>
        {pickerOpen && (
          <div className="mt-3 grid max-h-56 grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-6">
            {library.length === 0 && <p className="text-xs text-muted">No media uploaded yet.</p>}
            {library.map((m) => (
              <button
                key={m.url}
                type="button"
                onClick={() => {
                  onAddUrl(m.url, m.alt ?? m.filename);
                  onTogglePicker();
                }}
                className="flex h-12 items-center justify-center rounded-md border border-border bg-white p-1 hover:border-primary"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.alt ?? "Media library image"} className="max-h-10 max-w-full object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function LogoCard({
  logo,
  isFirst,
  isLast,
  onUpdate,
  onRemove,
  onReorder,
}: {
  logo: BandLogo;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (patch: Partial<BandLogo>) => void;
  onRemove: () => void;
  onReorder: (dir: -1 | 1) => void;
}) {
  const arrow =
    "flex h-7 w-7 items-center justify-center rounded border border-border bg-background text-xs hover:border-primary disabled:opacity-30";
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-surface2 p-3">
      {/* thumbnail */}
      <div className="flex h-12 w-24 shrink-0 items-center justify-center rounded bg-white p-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo.src} alt={logo.alt} className="max-h-10 max-w-full object-contain" />
      </div>

      {/* move pad */}
      <div className="grid grid-cols-3 gap-0.5">
        <span />
        <button type="button" className={arrow} title="Up" onClick={() => onUpdate({ dy: logo.dy - STEP })}>
          ↑
        </button>
        <span />
        <button type="button" className={arrow} title="Left" onClick={() => onUpdate({ dx: logo.dx - STEP })}>
          ←
        </button>
        <button
          type="button"
          className={arrow}
          title="Reset position & size"
          onClick={() => onUpdate({ dx: 0, dy: 0, scale: 1 })}
        >
          ⟲
        </button>
        <button type="button" className={arrow} title="Right" onClick={() => onUpdate({ dx: logo.dx + STEP })}>
          →
        </button>
        <span />
        <button type="button" className={arrow} title="Down" onClick={() => onUpdate({ dy: logo.dy + STEP })}>
          ↓
        </button>
        <span />
      </div>

      {/* numeric fields */}
      <div className="flex flex-wrap items-end gap-3 text-xs text-muted">
        <label className="flex flex-col gap-1">
          X (px)
          <input
            type="number"
            value={logo.dx}
            onChange={(e) => onUpdate({ dx: Number(e.target.value) || 0 })}
            className="w-16 rounded border border-border bg-background px-2 py-1 text-sm text-foreground"
          />
        </label>
        <label className="flex flex-col gap-1">
          Y (px)
          <input
            type="number"
            value={logo.dy}
            onChange={(e) => onUpdate({ dy: Number(e.target.value) || 0 })}
            className="w-16 rounded border border-border bg-background px-2 py-1 text-sm text-foreground"
          />
        </label>
        <label className="flex flex-col gap-1">
          Size ({logo.scale.toFixed(2)}×)
          <input
            type="range"
            min={0.3}
            max={3}
            step={0.05}
            value={logo.scale}
            onChange={(e) => onUpdate({ scale: Number(e.target.value) })}
            className="w-40"
          />
        </label>
      </div>

      {/* reorder + remove */}
      <div className="ml-auto flex items-center gap-1">
        <button type="button" className={arrow} title="Move earlier" disabled={isFirst} onClick={() => onReorder(-1)}>
          ‹
        </button>
        <button type="button" className={arrow} title="Move later" disabled={isLast} onClick={() => onReorder(1)}>
          ›
        </button>
        <button
          type="button"
          title="Remove from band"
          onClick={onRemove}
          className="flex h-7 w-7 items-center justify-center rounded border border-border bg-background text-xs text-red-600 hover:border-red-400"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
