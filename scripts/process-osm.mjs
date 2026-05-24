// Converts raw Overpass JSON (places + rivers) into compact data files the
// atlas map fetches at runtime. Run after fetching to /tmp/osm_*.json.
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'data');
const tmpDir = join(root, '.osmtmp');
await mkdir(outDir, { recursive: true });

const r5 = (n) => Math.round(n * 1e5) / 1e5;
const r4 = (n) => Math.round(n * 1e4) / 1e4;

// ── places ──
const placesRaw = JSON.parse(await readFile(join(tmpDir, 'osm_places.json'), 'utf8'));
const seen = new Set();
const places = [];
for (const el of placesRaw.elements) {
  if (el.type !== 'node' || !el.tags?.name) continue;
  const t = el.tags;
  const key = `${t.name}|${r4(el.lon)}|${r4(el.lat)}`;
  if (seen.has(key)) continue;
  seen.add(key);
  const native = t['name:hi'] || t['name:mai'] || t['name:ne'] || t['name:bh'] || '';
  places.push({
    n: t.name,
    a: native && native !== t.name ? native : '',
    p: t.place, // city | town | village
    g: [r5(el.lon), r5(el.lat)],
  });
}
await writeFile(join(outDir, 'mithila-places.json'), JSON.stringify({ places }));

// ── rivers ──
const riversRaw = JSON.parse(await readFile(join(tmpDir, 'osm_rivers.json'), 'utf8'));
const rivers = [];
for (const el of riversRaw.elements) {
  if (el.type !== 'way' || !el.geometry || el.geometry.length < 6) continue;
  const full = el.geometry.map((p) => [r4(p.lon), r4(p.lat)]);
  const dec = full.filter((_, i) => i % 3 === 0);
  const last = full[full.length - 1];
  if (dec[dec.length - 1][0] !== last[0] || dec[dec.length - 1][1] !== last[1]) dec.push(last);
  if (dec.length < 3) continue;
  rivers.push({ n: (el.tags?.name || '').replace(/\s*\(.*\)\s*/, ''), pts: dec });
}
await writeFile(join(outDir, 'mithila-rivers.json'), JSON.stringify({ rivers }));

const ps = (await stat(join(outDir, 'mithila-places.json'))).size;
const rs = (await stat(join(outDir, 'mithila-rivers.json'))).size;
console.log(`places: ${places.length} (${(ps / 1024).toFixed(0)} KB)`);
console.log(`rivers: ${rivers.length} (${(rs / 1024).toFixed(0)} KB)`);
