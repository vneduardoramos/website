/**
 * Storage abstraction. Local filesystem adapter for dev; an S3/blob adapter
 * can be added for production (Vercel's FS is ephemeral). Selected via
 * STORAGE_DRIVER env var.
 */
import { localStorageAdapter } from "./local";

export interface StoredFile {
  url: string;
  storageKey: string;
}

/** A privately stored object read back through the server (never web-served). */
export interface PrivateFile {
  body: Buffer;
  contentType: string;
  filename: string;
}

export interface StorageAdapter {
  save(buffer: Buffer, filename: string, mimeType: string): Promise<StoredFile>;
  /** Remove a stored object by its storageKey. Should not throw if already gone. */
  delete(storageKey: string): Promise<void>;
  /**
   * Store a file privately under an unguessable random key (never web-served).
   * The server chooses the name; `ext` (e.g. ".pdf") is the only client-derived
   * hint and is validated by content upstream. Used for applicant resumes (PII).
   */
  savePrivate(buffer: Buffer, ext: string, mimeType: string): Promise<{ storageKey: string }>;
  /** Read a privately stored object by its storageKey, for authenticated admins only. */
  readPrivate(storageKey: string): Promise<PrivateFile>;
}

export function getStorage(): StorageAdapter {
  const driver = process.env.STORAGE_DRIVER ?? "local";
  switch (driver) {
    case "local":
      return localStorageAdapter;
    case "s3": {
      // Lazy import so the AWS SDK isn't bundled for local-only deployments.
      const { s3StorageAdapter } = require("./s3") as typeof import("./s3");
      return s3StorageAdapter;
    }
    default:
      throw new Error(`Unknown STORAGE_DRIVER "${driver}" (expected "local" or "s3").`);
  }
}
