// Generates lib/blur-manifest.json: a map of /assets/images/... paths to tiny
// base64 blur previews, so <Img> can render placeholder="blur" for images that
// are referenced by path (Next.js only auto-generates blur for static imports).
//
// Run after adding or changing images:  npm run blur
import sharp from "sharp";
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = "public/assets/images";
const OUT = "lib/blur-manifest.json";
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const manifest = {};
let count = 0;
for await (const file of walk(ROOT)) {
  if (!EXTS.has(path.extname(file).toLowerCase())) continue;
  try {
    const buf = await sharp(file)
      .resize(20, 20, { fit: "inside" })
      .blur()
      .webp({ quality: 30 })
      .toBuffer();
    // Public path as referenced in components, e.g. "/assets/images/cases/foo-hero.jpg"
    const key = "/" + path.relative("public", file).split(path.sep).join("/");
    manifest[key] = `data:image/webp;base64,${buf.toString("base64")}`;
    count++;
  } catch (err) {
    console.warn(`skip ${file}: ${err.message}`);
  }
}

// Sort keys for stable diffs.
const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]));
await writeFile(OUT, JSON.stringify(sorted));
console.log(`blur-manifest: ${count} images -> ${OUT}`);
