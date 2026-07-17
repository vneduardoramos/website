import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import type { StorageAdapter, StoredFile, PrivateFile } from "./index";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
// Private uploads live OUTSIDE public/ so they are never web-served.
const PRIVATE_DIR = path.join(process.cwd(), "var", "private-uploads");

// Maps a stored file's extension back to a content type for readPrivate. The
// private files themselves carry no metadata on disk.
const EXT_MIME: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

function safeName(filename: string): string {
  const ext = path.extname(filename);
  const base = path
    .basename(filename, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  // Wall-clock + random suffix: performance.now() resets to ~0 on every process
  // restart, so two same-named uploads at a similar offset across restarts could
  // collide and silently overwrite. Date.now() plus entropy avoids that.
  const stamp = `${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 6)}`;
  return `${base || "file"}-${stamp}${ext}`;
}

export const localStorageAdapter: StorageAdapter = {
  async save(buffer, filename, _mimeType): Promise<StoredFile> {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const name = safeName(filename);
    await fs.writeFile(path.join(UPLOAD_DIR, name), buffer);
    return { url: `/uploads/${name}`, storageKey: name };
  },
  async delete(storageKey): Promise<void> {
    try {
      await fs.unlink(path.join(UPLOAD_DIR, path.basename(storageKey)));
    } catch {
      // already gone, ignore
    }
  },
  async savePrivate(buffer, ext, _mimeType): Promise<{ storageKey: string }> {
    await fs.mkdir(PRIVATE_DIR, { recursive: true });
    const name = `${crypto.randomUUID()}${ext}`;
    await fs.writeFile(path.join(PRIVATE_DIR, name), buffer);
    return { storageKey: name };
  },
  async readPrivate(storageKey): Promise<PrivateFile> {
    // basename() defends against path traversal in a stored key.
    const name = path.basename(storageKey);
    const body = await fs.readFile(path.join(PRIVATE_DIR, name));
    const ext = path.extname(name).toLowerCase();
    return { body, contentType: EXT_MIME[ext] ?? "application/octet-stream", filename: name };
  },
};
