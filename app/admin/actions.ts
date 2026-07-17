"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getModel, type AdminModel } from "@/lib/admin/config";
import { buildEntityData, m2mConnections } from "@/lib/admin/build-data";
import { getStorage } from "@/lib/storage";

async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  return session;
}

function delegate(model: AdminModel) {
  return (prisma as any)[model.key];
}

/** First-publish timestamp: stamp now only if the entity has never been published. */
async function stampPublishedAt(
  model: AdminModel,
  id: string,
  data: Record<string, any>
) {
  if (!model.hasStatus || data.status !== "PUBLISHED") return;
  const existing = await delegate(model).findUnique({
    where: { id },
    select: { publishedAt: true },
  });
  if (!existing?.publishedAt) data.publishedAt = new Date();
}

export async function createEntity(modelKey: string, form: FormData) {
  await requireSession();
  const model = getModel(modelKey);
  if (!model) throw new Error("Unknown model");
  const data = buildEntityData(model, form, true);
  await delegate(model).create({ data: { ...data, ...m2mConnections(model, form, true) } });
  revalidatePath("/", "layout");
  redirect(`/admin/${modelKey}`);
}

export async function updateEntity(modelKey: string, id: string, form: FormData) {
  await requireSession();
  const model = getModel(modelKey);
  if (!model) throw new Error("Unknown model");
  const data = buildEntityData(model, form, false);
  await stampPublishedAt(model, id, data);
  await delegate(model).update({ where: { id }, data: { ...data, ...m2mConnections(model, form, false) } });
  revalidatePath("/", "layout");
  redirect(`/admin/${modelKey}`);
}

export async function deleteEntity(modelKey: string, id: string) {
  await requireSession();
  const model = getModel(modelKey);
  if (!model) throw new Error("Unknown model");
  await delegate(model).delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect(`/admin/${modelKey}`);
}

export async function setStatus(modelKey: string, id: string, status: string) {
  await requireSession();
  const model = getModel(modelKey);
  if (!model || !model.hasStatus) throw new Error("Model has no status");
  const data: Record<string, any> = { status };
  await stampPublishedAt(model, id, data);
  await delegate(model).update({ where: { id }, data });
  revalidatePath("/", "layout");
}

export async function updateLeadStatus(id: string, status: string) {
  await requireSession();
  await prisma.lead.update({ where: { id }, data: { status } });
  revalidatePath("/admin/leads");
}

/** Upsert a SiteSetting from the settings admin. `value` is a JSON string. */
export async function setSetting(key: string, form: FormData) {
  await requireSession();
  const raw = String(form.get("value") ?? "").trim();
  if (raw === "") throw new Error("Value is required");
  try {
    JSON.parse(raw);
  } catch {
    throw new Error(`Setting "${key}" must be valid JSON`);
  }
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value: raw },
    create: { key, value: raw },
  });
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

/** Delete a media item: remove the stored file (best-effort) then the DB row. */
export async function deleteMedia(id: string) {
  await requireSession();
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return;
  try {
    await getStorage().delete(media.storageKey);
  } catch (e) {
    console.error("[media] file delete failed:", e);
  }
  await prisma.media.delete({ where: { id } });
  revalidatePath("/admin/media");
}
