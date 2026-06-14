import { prisma } from "@/lib/db";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { MediaDeleteButton } from "@/components/admin/MediaDeleteButton";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Media</h1>
      <p className="mt-1 text-sm text-muted">
        Uploaded images are stored under <code className="font-mono">/public/uploads</code> in dev.
      </p>

      <div className="mt-6 max-w-md">
        <MediaUploader />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {media.length === 0 && <p className="text-muted">No media uploaded yet.</p>}
        {media.map((m) => (
          <div key={m.id} className="overflow-hidden rounded-xl border border-border bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.url} alt={m.alt || "Uploaded media"} className="aspect-video w-full object-cover" />
            <div className="p-2">
              <p className="truncate text-xs text-muted">{m.filename}</p>
              <p className="truncate font-mono text-[10px] text-muted">{m.url}</p>
              <div className="mt-1.5">
                <MediaDeleteButton id={m.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
