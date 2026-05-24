// Resizes/recompresses downloaded images in public/img so none are oversized.
// Run: node scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'img');
const MAX_W = 1400;
const files = await readdir(dir);
let changed = 0;

for (const f of files) {
  const ext = extname(f).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;
  const src = join(dir, f);
  const before = (await stat(src)).size;
  const tmp = src + '.tmp';
  try {
    let pipe = sharp(src).rotate().resize({ width: MAX_W, withoutEnlargement: true });
    pipe = ext === '.png' ? pipe.png({ compressionLevel: 9 }) : pipe.jpeg({ quality: 80, mozjpeg: true });
    await pipe.toFile(tmp);
    const after = (await stat(tmp)).size;
    if (after < before) {
      await rename(tmp, src);
      changed++;
      console.log(`✓ ${f}  ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB`);
    } else {
      await unlink(tmp);
      console.log(`· ${f}  kept (${(before / 1024).toFixed(0)}KB)`);
    }
  } catch (e) {
    console.error(`✗ ${f} — ${e.message}`);
    try {
      await unlink(tmp);
    } catch {}
  }
}
console.log(`\nOptimized ${changed} image(s).`);
