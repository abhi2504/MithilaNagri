// Prepare the photographs for the "In Loving Memory" tribute page.
//
// Source photos live in /MemoryOf (originals, untouched). This script crops each
// to a clean portrait of Ranju Jha — removing screenshot chrome, date stamps and
// other people — and writes web-ready images to /public/img/memory.
//
// To re-tune a crop or add a new photo: adjust the fractions below (left, top,
// width, height — all as a fraction of the source dimensions) and re-run:
//     node scripts/process-memory-photos.mjs
import sharp from 'sharp';

const SRC = 'MemoryOf';
const OUT = 'public/img/memory';

// [sourceFile, outName, leftFrac, topFrac, widthFrac, heightFrac]
const portraits = [
  ['WhatsApp Image 2026-05-26 at 00.23.20.jpeg',     'ranju-smile',    0.00,  0.29,  1.00,  0.50],  // green saree, radiant smile
  ['WhatsApp Image 2026-05-26 at 00.23.20 (1).jpeg', 'ranju-festival', 0.105, 0.175, 0.495, 0.36],  // yellow saree at a festival (FB chrome + others removed)
  ['WhatsApp Image 2026-05-26 at 00.23.21.jpeg',     'ranju-home',     0.24,  0.14,  0.37,  0.50],  // green saree at home (grandchild cropped out)
];

for (const [file, name, l, t, w, h] of portraits) {
  const { width: W, height: H } = await sharp(`${SRC}/${file}`).rotate().metadata();
  const left = Math.round(W * l), top = Math.round(H * t);
  const width = Math.min(Math.round(W * w), W - left), height = Math.min(Math.round(H * h), H - top);
  await sharp(`${SRC}/${file}`).rotate()
    .extract({ left, top, width, height })
    .resize({ width: 1000, withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(`${OUT}/${name}.jpg`);
  console.log(`${name}.jpg  ${width}x${height}`);
}

// Square face medallion for the circular hero portrait (cropped from the smile).
{
  const src = `${SRC}/WhatsApp Image 2026-05-26 at 00.23.20.jpeg`;
  const { width: W, height: H } = await sharp(src).rotate().metadata();
  const size = 470;
  const left = Math.max(0, Math.round(0.60 * W - size / 2));
  const top = Math.max(0, Math.round(0.505 * H - size / 2));
  await sharp(src).rotate()
    .extract({ left, top, width: size, height: size })
    .resize({ width: 600 })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(`${OUT}/ranju-portrait.jpg`);
  console.log('ranju-portrait.jpg  600x600');
}
