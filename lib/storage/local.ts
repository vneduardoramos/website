import { promises as fs } from "fs";
import path from "path";
import type { StorageAdapter, StoredFile } from "./index";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function safeName(filename: string): string {
  const ext = path.extname(filename);
  const base = path
    .basename(filename, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  const stamp = Math.floor(performance.now()).toString(36);
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
};
