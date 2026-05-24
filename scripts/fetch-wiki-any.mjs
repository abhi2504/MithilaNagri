// Downloads the Wikipedia REST lead image for each topic REGARDLESS of host
// (Commons OR non-free en.wikipedia uploads). Use only where the user has
// explicitly accepted non-free/editorial use; every image is credited to its
// Wikipedia page and covered by the site's instant-takedown net.
// Writes src/lib/media-wiki.ts. Cached + idempotent.
// Run: node scripts/fetch-wiki-any.mjs
import { writeFile, readFile, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const imgDir = join(root, 'public', 'img');
const cacheFile = join(imgDir, '_wikiany.json');
const HEADERS = { 'User-Agent': 'MithilaEncyclopedia/0.1 (educational; contact: site admin)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await mkdir(imgDir, { recursive: true });

// id | Wikipedia article title | alt
const MANIFEST = [
  // modern people (real photos, often non-free)
  ['person-sita-devi', 'Sita Devi (painter)', 'The Madhubani painter Sita Devi'],
  ['person-ganga-devi', 'Ganga Devi (painter)', 'The Madhubani painter Ganga Devi'],
  ['person-nagarjun', 'Nagarjun', 'The poet Nagarjun (Vaidyanath Mishra)'],
  ['person-kirti-azad', 'Kirti Azad', 'The cricketer and politician Kirti Azad'],
  ['person-bharti-dayal', 'Bharti Dayal', 'The Madhubani artist Bharti Dayal'],
  ['person-pushpa-kumari', 'Pushpa Kumari', 'The Madhubani artist Pushpa Kumari'],
  ['person-jagdamba-devi', 'Jagdamba Devi', 'The Madhubani painter Jagdamba Devi'],
  ['person-nitin-chandra', 'Nitin Chandra', 'The filmmaker Nitin Chandra'],
  ['person-shanti-paswan', 'Shanti Devi Paswan', 'The Godna artist Shanti Devi Paswan'],
  ['person-mahalaxmi-karn', 'Mahalaxmi Karn', 'The Mithila artist Mahalaxmi Karn'],
  // medieval/ancient scholars — statues / depictions if any
  ['person-udayana', 'Udayana', 'The Nyaya logician Udayana'],
  ['person-vachaspati', 'Vachaspati Mishra', 'The philosopher Vachaspati Mishra'],
  ['person-gangesha', 'Gangesha Upadhyaya', 'Gangesha Upadhyaya, founder of Navya-Nyaya'],
  ['person-jyotirishwar', 'Jyotirishwar Thakur', 'Jyotirishwar Thakur, author of the Varna Ratnakara'],
  ['person-mahesh-thakur', 'Mahesha Thakura', 'Mahesh Thakur, founder of the Darbhanga Raj'],
  ['person-govindadas', 'Govindadas (Maithili language poet)', 'The Vaishnava poet Govindadas'],
  // places / villages
  ['place-kusheshwar', 'Kusheshwar Asthan Bird Sanctuary', 'Kusheshwar Asthan, a wetland bird sanctuary'],
  ['place-ahilya', 'Ahilya Asthan', 'Ahilya Asthan, in the Ramayana legend'],
  ['village-gaur', 'Gaur, Nepal', 'Gaur, headquarters of Rautahat'],
  ['village-pandaul', 'Pandaul', 'Pandaul'],
  ['village-saurath', 'Saurath', 'Saurath, the marriage assembly ground'],
  ['village-jaleshwar', 'Jaleswar, Mahottari', 'Jaleshwar, Mahottari'],
];

const FILE_NAME = /\/(?:commons|en)\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/]+\.(?:jpg|jpeg|png|gif|JPG|JPEG|PNG))/;
let out = {};
try { out = JSON.parse(await readFile(cacheFile, 'utf8')); } catch {}
let ok = Object.keys(out).length;

for (const [id, title, alt] of MANIFEST) {
  if (out[id]) { console.log(`· ${id} (cached)`); continue; }
  try {
    const api = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`;
    const res = await fetch(api, { headers: HEADERS });
    if (!res.ok) { console.error(`✗ ${id}: summary HTTP ${res.status}`); await sleep(400); continue; }
    const j = await res.json();
    const url = j.originalimage?.source || j.thumbnail?.source;
    if (!url) { console.error(`✗ ${id}: no lead image`); await sleep(400); continue; }
    const m = url.match(FILE_NAME);
    const file = m ? decodeURIComponent(m[1]) : `${id}.jpg`;
    const ext = (file.split('.').pop() || 'jpg').toLowerCase().replace('jpeg', 'jpg');
    const dest = join(imgDir, `${id}.${ext}`);
    let skip = false;
    try { await access(dest); skip = true; } catch {}
    if (!skip) {
      const ir = await fetch(url, { headers: HEADERS });
      if (!ir.ok) { console.error(`✗ ${id}: image HTTP ${ir.status}`); await sleep(400); continue; }
      await writeFile(dest, Buffer.from(await ir.arrayBuffer()));
    }
    const free = url.includes('/wikipedia/commons/');
    out[id] = {
      src: `/img/${id}.${ext}`,
      alt,
      credit: {
        source: free ? 'Wikimedia Commons' : 'Wikipedia',
        sourceUrl: j.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
        license: free ? 'CC-BY-SA-4.0' : 'unknown',
      },
      status: 'review',
    };
    ok++;
    console.log(`✓ ${id}  ←  ${file}  ${free ? '[commons]' : '[wikipedia/editorial]'}`);
    await writeFile(cacheFile, JSON.stringify(out, null, 2));
    await sleep(1200);
  } catch (e) { console.error(`✗ ${id}: ${e.message}`); }
}

await writeFile(cacheFile, JSON.stringify(out, null, 2));
const ts = `// AUTO-GENERATED by scripts/fetch-wiki-any.mjs — Wikipedia lead images (may be editorial-use).
export const WIKI_MEDIA = ${JSON.stringify(out, null, 2)} as const;
`;
await writeFile(join(root, 'src', 'lib', 'media-wiki.ts'), ts);
console.log(`\nResolved ${ok}/${MANIFEST.length}. Wrote src/lib/media-wiki.ts`);
