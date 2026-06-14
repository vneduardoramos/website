import { prisma } from "@/lib/db";
import { getClientBands, LOGO_CATALOG } from "@/lib/client-bands";
import { ClientBandsEditor } from "@/components/admin/ClientBandsEditor";

export const dynamic = "force-dynamic";

export default async function ClientLogosAdminPage() {
  const [bands, media] = await Promise.all([
    getClientBands(),
    prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
  ]);
  const library = media.map((m) => ({ url: m.url, alt: m.alt, filename: m.filename }));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Client logos</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Configure the two client-logo bands on the home page (above and below the “Leading teams”
        section). Choose which logos appear in each band and how many, nudge each logo up/down/left/right,
        and resize it. Defaults match the current site. Changes go live when you save.
      </p>
      <ClientBandsEditor initial={bands} catalog={LOGO_CATALOG} library={library} />
    </div>
  );
}
