// Searches the OPEN WEB via the Openverse API (aggregates Flickr, museums,
// Smithsonian, Wikimedia, etc. — all openly licensed) for real, on-theme images,
// downloads them locally, and records creator + license + source page.
// Use for entries with no Wikipedia/Commons photo. Writes src/lib/media-open.ts.
// Run: node scripts/fetch-openverse.mjs
import { writeFile, readFile, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const imgDir = join(root, 'public', 'img');
const cacheFile = join(imgDir, '_openverse.json');
const API = 'https://api.openverse.org/v1/images/';
const HEADERS = { 'User-Agent': 'MithilaEncyclopedia/0.1 (educational; contact: site admin)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await mkdir(imgDir, { recursive: true });

// id | Openverse query | alt  (queries chosen to return real, on-theme images)
const MANIFEST = [
  // Madhubani painters -> real Madhubani artworks (on-theme, vivid)
  ['person-sita-devi', 'Madhubani painting', 'A Madhubani painting in the tradition of Sita Devi'],
  ['person-ganga-devi', 'Mithila painting Bihar', 'A Madhubani painting in the tradition of Ganga Devi'],
  ['person-jagdamba-devi', 'Madhubani painting Krishna', 'A Madhubani painting in the Bharni tradition of Jagdamba Devi'],
  ['person-bharti-dayal', 'Madhubani painting peacock', 'A contemporary Madhubani painting like Bharti Dayal’s'],
  ['person-pushpa-kumari', 'Madhubani art Bihar', 'A Madhubani painting in the tradition of Pushpa Kumari'],
  ['person-mahalaxmi-karn', 'Mithila painting Durga', 'A Mithila painting like Mahalaxmi Karn’s'],
  ['person-shanti-paswan', 'Madhubani folk painting', 'A Godna-style Madhubani painting like Shanti Devi Paswan’s'],
  // poets / scholars -> real manuscripts & devotional art (apt for authors)
  ['person-jyotirishwar', 'Sanskrit palm leaf manuscript', 'A palm-leaf manuscript, the form of early Maithili prose'],
  ['person-vachaspati', 'Sanskrit manuscript page old', 'An old Sanskrit philosophical manuscript'],
  ['person-gangesha', 'Sanskrit manuscript India', 'A manuscript of the Nyaya school'],
  ['person-mahesh-thakur', 'illustrated Sanskrit manuscript India', 'An illustrated Sanskrit manuscript'],
  ['person-chanda-jha', 'Ramayana manuscript painting', 'A Ramayana manuscript painting'],
  ['person-shankara-mishra', 'old Sanskrit manuscript folio', 'A Sanskrit manuscript folio'],
  ['person-ayachi-mishra', 'palm leaf manuscript India', 'A Maithili manuscript'],
  ['person-bharati-mishra', 'Saraswati Hindu goddess painting', 'Saraswati, goddess of learning, for the philosopher Bharati'],
];

function normLicense(l, v) {
  const s = (l || '').toLowerCase();
  if (s === 'cc0' || s === 'pdm') return 'public-domain';
  if (s === 'by-sa') return `CC-BY-SA-${v || '4.0'}`;
  if (s === 'by') return `CC-BY-${v || '4.0'}`;
  return s ? `CC-${s.toUpperCase()} ${v || ''}`.trim() : 'unknown';
}
async function getJson(u) {
  for (let i = 0; i < 4; i++) {
    const r = await fetch(u, { headers: HEADERS });
    if (r.ok) return r.json();
    if (r.status === 429) { await sleep(3000 * (i + 1)); continue; }
    return null;
  }
  return null;
}

let out = {};
try { out = JSON.parse(await readFile(cacheFile, 'utf8')); } catch {}
let ok = Object.keys(out).length;

for (const [id, query, alt] of MANIFEST) {
  if (out[id]) { console.log(`· ${id} (cached)`); continue; }
  const u = `${API}?q=${encodeURIComponent(query)}&page_size=12&mature=false`;
  try {
    const j = await getJson(u);
    const results = j?.results || [];
    let chosen = null;
    for (const it of results) {
      if (!/\.(jpe?g|png)(\?|$)/i.test(it.url || '')) continue;
      if (it.width && it.width < 500) continue;
      chosen = it;
      break;
    }
    if (!chosen) { console.error(`✗ ${id}: no image for "${query}"`); await sleep(500); continue; }
    const ext = /png(\?|$)/i.test(chosen.url) ? 'png' : 'jpg';
    const dest = join(imgDir, `${id}.${ext}`);
    let skip = false;
    try { await access(dest); skip = true; } catch {}
    if (!skip) {
      const ir = await fetch(chosen.url, { headers: HEADERS });
      if (!ir.ok) { console.error(`✗ ${id}: download HTTP ${ir.status}`); await sleep(500); continue; }
      await writeFile(dest, Buffer.from(await ir.arrayBuffer()));
    }
    out[id] = {
      src: `/img/${id}.${ext}`,
      alt,
      credit: {
        source: chosen.provider ? `Openverse / ${chosen.provider}` : 'Openverse',
        sourceUrl: chosen.foreign_landing_url || chosen.url,
        author: chosen.creator || undefined,
        license: normLicense(chosen.license, chosen.license_version),
      },
      status: 'review',
    };
    ok++;
    console.log(`✓ ${id}  ←  ${(chosen.title || '').slice(0, 50)}  [${chosen.license}] (${chosen.provider})`);
    await writeFile(cacheFile, JSON.stringify(out, null, 2));
    await sleep(1000);
  } catch (e) { console.error(`✗ ${id}: ${e.message}`); }
}

await writeFile(cacheFile, JSON.stringify(out, null, 2));
const ts = `// AUTO-GENERATED by scripts/fetch-openverse.mjs — open-web images via Openverse.
export const OPEN_MEDIA = ${JSON.stringify(out, null, 2)} as const;
`;
await writeFile(join(root, 'src', 'lib', 'media-open.ts'), ts);
console.log(`\nResolved ${ok}/${MANIFEST.length} via Openverse. Wrote src/lib/media-open.ts`);
