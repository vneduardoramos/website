import { slugify } from "@/lib/utils";
import type { AdminModel } from "@/lib/admin/config";

/** Build a Prisma scalar data object from submitted FormData per the model's field config. */
export function buildEntityData(model: AdminModel, form: FormData, isCreate: boolean) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, any> = {};

  for (const field of model.fields) {
    const raw = form.get(field.name);
    switch (field.type) {
      case "boolean":
        data[field.name] = raw === "on" || raw === "true";
        break;
      case "number": {
        const n = raw != null && raw !== "" ? parseInt(String(raw), 10) : null;
        data[field.name] = Number.isNaN(n as number) ? 0 : (n ?? 0);
        break;
      }
      case "date":
        data[field.name] = raw ? new Date(String(raw)) : null;
        break;
      case "image": {
        const s = String(raw ?? "").trim();
        data[field.name] = s === "" ? null : s;
        break;
      }
      case "relation": {
        // Multiple (M2M) relations are connected separately via m2mConnections().
        if (field.relation?.multiple) break;
        const s = String(raw ?? "").trim();
        data[field.name] = s === "" ? null : s; // scalar FK (e.g. authorTeamId)
        break;
      }
      case "jsonList":
      case "jsonObjects": {
        const s = String(raw ?? "").trim();
        if (s === "") {
          data[field.name] = null;
        } else {
          try {
            JSON.parse(s);
            data[field.name] = s;
          } catch {
            throw new Error(`Field "${field.label}" must be valid JSON`);
          }
        }
        break;
      }
      case "repeater":
      case "group": {
        const s = String(raw ?? "").trim();
        if (s === "" || s === "[]" || s === "{}") {
          data[field.name] = null;
        } else {
          try {
            JSON.parse(s);
            data[field.name] = s; // stored as JSON-encoded string
          } catch {
            throw new Error(`Field "${field.label}" must be valid JSON`);
          }
        }
        break;
      }
      default: {
        const s = raw == null ? "" : String(raw);
        data[field.name] = s === "" ? (field.required ? "" : null) : s;
      }
    }
  }

  // Auto-slug from title/name if a slug field exists and is empty.
  if ("slug" in data && (!data.slug || data.slug === "")) {
    const source = (data.title || data.name || "").toString();
    if (source) data.slug = slugify(source);
  }

  // Publish workflow (create only; update transition handled in updateEntity).
  if (model.hasStatus && isCreate) {
    if (!data.status) data.status = "DRAFT";
    if (data.status === "PUBLISHED") data.publishedAt = new Date();
  }

  return data;
}

/**
 * Build Prisma nested writes for multiple (M2M) relation fields.
 * On create, Prisma rejects `set`, so we use `connect`; on update we use `set`
 * (which replaces the full set, correctly clearing relations when none are selected).
 */
export function m2mConnections(model: AdminModel, form: FormData, isCreate: boolean) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rel: Record<string, any> = {};
  for (const f of model.fields) {
    if (f.type === "relation" && f.relation?.multiple) {
      const ids = form.getAll(f.name).map(String).filter(Boolean);
      const refs = ids.map((id) => ({ id }));
      rel[f.name] = isCreate ? { connect: refs } : { set: refs };
    }
  }
  return rel;
}
