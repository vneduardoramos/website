import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import path from "path";
import crypto from "crypto";
import type { StorageAdapter, StoredFile, PrivateFile } from "./index";

/**
 * S3-compatible storage adapter (AWS S3, Cloudflare R2, etc.). Selected via
 * STORAGE_DRIVER="s3". Required env: S3_BUCKET, S3_ACCESS_KEY_ID,
 * S3_SECRET_ACCESS_KEY. Optional: S3_REGION, S3_ENDPOINT (R2), S3_PUBLIC_URL.
 * Private uploads (applicant resumes) require S3_PRIVATE_BUCKET (public access
 * disabled); objects there are served only through the authenticated admin API.
 */
function env(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`${key} is required when STORAGE_DRIVER="s3"`);
  return v;
}

// The bucket for private objects (resumes). Must have public access disabled.
// In production it is mandatory; in dev we fall back to the public bucket under
// the private/ prefix (still no public-read ACL) so local s3 testing works.
function privateBucket(): string {
  const bucket = process.env.S3_PRIVATE_BUCKET;
  if (bucket) return bucket;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "S3_PRIVATE_BUCKET is required for private resume storage when STORAGE_DRIVER=\"s3\" in production.",
    );
  }
  console.warn(
    "[storage/s3] S3_PRIVATE_BUCKET unset; falling back to S3_BUCKET under private/ (dev only).",
  );
  return env("S3_BUCKET");
}

const EXT_MIME: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

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
  // Wall-clock plus entropy so two same-named uploads in the same millisecond
  // cannot produce an identical key and overwrite each other.
  const stamp = `${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 6)}`;
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
  async savePrivate(buffer, ext, mimeType): Promise<{ storageKey: string }> {
    const key = `private/resumes/${crypto.randomUUID()}${ext}`;
    await client().send(
      new PutObjectCommand({
        Bucket: privateBucket(),
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        // Force download (never inline-render) and never grant public read.
        ContentDisposition: "attachment",
      })
    );
    return { storageKey: key };
  },
  async readPrivate(storageKey): Promise<PrivateFile> {
    const res = await client().send(
      new GetObjectCommand({ Bucket: privateBucket(), Key: storageKey })
    );
    if (!res.Body) throw new Error(`Private object "${storageKey}" has no body.`);
    const body = Buffer.from(await res.Body.transformToByteArray());
    const ext = path.extname(storageKey).toLowerCase();
    const contentType = res.ContentType || EXT_MIME[ext] || "application/octet-stream";
    return { body, contentType, filename: path.basename(storageKey) };
  },
};
