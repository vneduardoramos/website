import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import type { StorageAdapter, StoredFile } from "./index";

/**
 * S3-compatible storage adapter (AWS S3, Cloudflare R2, etc.). Selected via
 * STORAGE_DRIVER="s3". Required env: S3_BUCKET, S3_ACCESS_KEY_ID,
 * S3_SECRET_ACCESS_KEY. Optional: S3_REGION, S3_ENDPOINT (R2), S3_PUBLIC_URL.
 */
function env(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`${key} is required when STORAGE_DRIVER="s3"`);
  return v;
}

let _client: S3Client | null = null;
function client(): S3Client {
  if (_client) return _client;
  _client = new S3Client({
    region: process.env.S3_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT || undefined,
    credentials: {
      accessKeyId: env("S3_ACCESS_KEY_ID"),
      secretAccessKey: env("S3_SECRET_ACCESS_KEY"),
    },
  });
  return _client;
}

function safeName(filename: string): string {
  const ext = path.extname(filename);
  const base = path
    .basename(filename, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  const stamp = Date.now().toString(36);
  return `${base || "file"}-${stamp}${ext}`;
}

export const s3StorageAdapter: StorageAdapter = {
  async save(buffer, filename, mimeType): Promise<StoredFile> {
    const bucket = env("S3_BUCKET");
    const key = `uploads/${safeName(filename)}`;
    await client().send(
      new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: mimeType })
    );
    const base = process.env.S3_PUBLIC_URL?.replace(/\/$/, "");
    const url = base
      ? `${base}/${key}`
      : `https://${bucket}.s3.${process.env.S3_REGION || "us-east-1"}.amazonaws.com/${key}`;
    return { url, storageKey: key };
  },
  async delete(storageKey): Promise<void> {
    await client().send(new DeleteObjectCommand({ Bucket: env("S3_BUCKET"), Key: storageKey }));
  },
};
