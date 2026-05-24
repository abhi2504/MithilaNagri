// Generates a Madhubani-style illustration for each ritual STAGE via Pollinations
// (free, keyless, FLUX). Output: /img/stage-<ritualSlug>-<key>.jpg. The RitualStages
// component references these directly and falls back gracefully if one is missing.
// Run: node scripts/gen-stage-images.ts   (Node 24 strips the .ts types natively)
import { writeFile, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { RITUAL_STAGES } from '../src/data/ritual-stages.ts';
import { FESTIVAL_STAGES } from '../src/data/festival-stages.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const imgDir = join(root, 'public', 'img');
const HEADERS = { 'User-Agent': 'MithilaEncyclopedia/0.1 (educational)' };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const hash = (s: string) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };
await mkdir(imgDir, { recursive: true });

// festivals first (newest), then any missing ritual stages
const ALL: Record<string, any> = { ...FESTIVAL_STAGES, ...RITUAL_STAGES };
const ORDER = [
  'chhath', 'sama-chakeva', 'jitiya', 'madhushravani', 'kojagara', 'sita-navami', 'jur-sital',
  'upanayan', 'maithil-vivah', 'sohar-chhathi', 'mundan', 'shradh', 'panji-system',
];
let ok = 0, total = 0, fail = 0;

for (const slug of ORDER) {
  const stages = ALL[slug];
  if (!stages) continue;
  for (const s of stages) {
    total++;
    const id = `stage-${slug}-${s.key}`;
    const dest = join(imgDir, `${id}.jpg`);
    try { await access(dest); ok++; console.log(`· ${id} (exists)`); continue; } catch {}
    const seed = hash(id) % 100000;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(s.prompt)}?width=1200&height=800&nologo=true&seed=${seed}&model=flux`;
    let done = false;
    for (let a = 0; a < 3 && !done; a++) {
      try {
        const c = new AbortController(); const tm = setTimeout(() => c.abort(), 70000);
        const r = await fetch(url, { headers: HEADERS, signal: c.signal }); clearTimeout(tm);
        if (!r.ok) { await sleep(2500); continue; }
        const b = Buffer.from(await r.arrayBuffer());
        if (b.length < 6000 || b.subarray(0, 2).toString('hex') !== 'ffd8') { await sleep(2500); continue; }
        await writeFile(dest, b);
        done = true; ok++;
        console.log(`✓ ${id}`);
      } catch { await sleep(2500); }
    }
    if (!done) { fail++; console.error(`✗ ${id}`); }
    await sleep(700);
  }
}
console.log(`\nStage images: ${ok}/${total} present, ${fail} failed.`);
