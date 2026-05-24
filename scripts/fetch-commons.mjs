// Searches Wikimedia Commons (File namespace = only free-licensed media) for each
// topic, downloads the best matching image into public/img/, and records proper
// attribution (author + license) from the file's extmetadata. This works even when
// a Wikipedia article's lead image is NOT on Commons (the limitation of
// fetch-wiki-images.mjs). Writes src/lib/media-commons.ts. Cached + idempotent.
// Run: node scripts/fetch-commons.mjs
import { writeFile, readFile, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const imgDir = join(root, 'public', 'img');
const cacheFile = join(imgDir, '_commons.json');
const API = 'https://commons.wikimedia.org/w/api.php';
const HEADERS = { 'User-Agent': 'MithilaEncyclopedia/0.1 (educational; contact: site admin)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await mkdir(imgDir, { recursive: true });

// id | Commons search query | alt text
const MANIFEST = [
  // --- already resolved (cached, skipped instantly) ---
  ['article-paag', 'Mithila Paag', 'The paag, the traditional Maithil headdress'],
  ['article-jat-jatin', 'Jat Jatin folk dance Bihar', 'The Jat-Jatin folk dance of Mithila'],
  ['article-folk-stories', 'Salhesh', 'The shrine of Raja Salhesh, hero of Mithila folklore'],
  ['article-statehood', 'Mithila flag', 'A flag of the Mithila identity movement'],
  ['art-godna', 'Godna tattoo Bihar', 'Godna — the traditional tattoo art of Mithila'],
  ['art-sikki', 'Sikki grass craft Bihar', 'Sikki golden-grass craft of Mithila'],
  ['person-harimohan-jha', 'Harimohan Jha', 'The Maithili writer Harimohan Jha'],
  ['place-kapileshwar', 'Kapileshwar temple Janakpur', 'Kapileshwar Mahadev temple'],
  ['place-singheshwar', 'Singheshwar temple Madhepura', 'Singheshwar Sthan, a Shiva temple'],
  ['place-chandradhari', 'Chandradhari Museum Darbhanga', 'The Chandradhari Museum, Darbhanga'],
  ['place-ram-janakpur', 'Janakpur Ram Mandir', 'The Ram Mandir at Janakpur'],
  ['festival-holi', 'Holi festival colours India', 'Holi, the festival of colours'],
  ['festival-kojagara', 'Kojagari Lakshmi Puja', 'Kojagara, the full-moon worship'],
  ['food-fish-curry', 'fish curry mustard Bengali', 'A mustard-based fish curry'],
  ['food-chura-dahi', 'Dahi Chura', 'Dahi-chura, the Maithil curd-and-flattened-rice meal'],
  // --- places ---
  ['place-kusheshwar', 'Kusheshwar Asthan', 'Kusheshwar Asthan wetland and temple'],
  ['place-mithila-haat', 'Mithila Haat', 'Mithila Haat at Jhanjharpur'],
  ['place-girija', 'Girija Sthan Phulhar Madhubani', 'Girija Sthan, where Ram met Sita'],
  ['place-haleshwar', 'Haleshwar Sthan Sitamarhi', 'Haleshwar Sthan, a Shiva temple near Sitamarhi'],
  ['place-sita-kund', 'Sita Kund pond', 'Sita Kund, a sacred tank near Sitamarhi'],
  ['place-parikrama', 'Mithila Parikrama Janakpur pilgrimage', 'The Mithila parikrama pilgrimage'],
  ['place-gautam', 'Gautam Sthan Darbhanga', 'Gautam Asthan, linked to the sage Gautama'],
  // --- festivals ---
  ['festival-indra', 'Indra Jatra', 'Indra worship, surviving in Mithila as Indra Puja'],
  ['festival-sita-navami', 'Sita Rama Ravi Varma', 'Sita, whose birth Sita Navami celebrates'],
  // --- food ---
  ['food-fritter', 'Vegetable pakora fritter', 'Tarua-style vegetable fritters'],
  ['food-sattu', 'Sattu', 'Sattu, roasted gram flour'],
  ['food-sattu-drink', 'Sattu drink sharbat', 'Sattu sharbat, a summer cooler'],
  ['food-lauki', 'Lauki ki sabzi', 'Bottle-gourd curry, as in kaddu-bhaat'],
  ['food-pithe', 'Pithe rice dumpling jaggery', 'Steamed rice-flour dumpling, like bagiya'],
  // --- people: classical depictions ---
  ['person-janaka', 'Janaka Sita Ramayana painting', 'King Janaka, father of Sita'],
  ['person-yajnavalkya', 'Yajnavalkya', 'The sage Yajnavalkya'],
  ['person-gargi', 'Gargi Vachaknavi', 'The philosopher Gargi'],
  ['person-ashtavakra', 'Ashtavakra', 'The sage Ashtavakra'],
  ['person-mandan-mishra', 'Adi Shankara debate', 'The philosopher Mandana Mishra'],
  ['person-udayana', 'Udayana Acharya', 'The logician Udayana'],
  // --- people: modern ---
  ['person-nagarjun', 'Nagarjun Hindi poet', 'The poet Nagarjun'],
  ['person-shanti-paswan', 'Shanti Devi Paswan', 'The Godna artist Shanti Devi Paswan'],
  // --- villages / towns ---
  ['village-biratnagar', 'Biratnagar', 'Biratnagar, Nepal'],
  ['village-birgunj', 'Birgunj', 'Birgunj, gateway to Nepal'],
  ['village-rajbiraj', 'Rajbiraj', 'Rajbiraj, Saptari'],
  ['village-saharsa', 'Saharsa', 'Saharsa town'],
  ['village-madhepura', 'Madhepura', 'Madhepura town'],
  ['village-jaynagar', 'Jaynagar Bihar', 'Jaynagar, on the Nepal border'],
  ['village-jhanjharpur', 'Jhanjharpur', 'Jhanjharpur'],
  ['village-lahan', 'Lahan Nepal', 'Lahan, Siraha'],
  ['village-siraha', 'Siraha Nepal', 'Siraha town'],
  ['village-gaur', 'Gaur Nepal town', 'Gaur, Rautahat'],
  ['village-malangwa', 'Malangawa', 'Malangwa, Sarlahi'],
  ['village-kosi-barrage', 'Kosi Barrage', 'The Kosi Barrage near Birpur'],
  ['village-pusa', 'Pusa Samastipur agricultural', 'Pusa, the agricultural university town'],
  ['village-bisfi', 'Bisfi Vidyapati', 'Bisfi, birthplace of Vidyapati'],
  ['village-pandaul', 'Pandaul railway station', 'Pandaul'],
  ['village-saurath', 'Somnath temple Saurath', 'Saurath, the marriage assembly ground'],
  ['village-mahishi', 'Mahishi Ugratara', 'Mahishi, seat of the Ugratara shrine'],
  ['village-matihani', 'Matihani Mahottari', 'Matihani'],
  // --- rituals ---
  ['ritual-mundan', 'Tonsure ceremony Hindu child', 'The Mundan first-haircut rite'],
  ['ritual-upanayan', 'Upanayana sacred thread ceremony', 'The Upanayan sacred-thread rite'],
  ['ritual-shradh', 'Pind Daan Gaya', 'Shraddha rites for the ancestors'],
];

const stripHtml = (s) => (s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
function normLicense(short) {
  const s = (short || '').toLowerCase();
  if (s.includes('cc0') || s.includes('public domain') || s.includes('pd')) return 'public-domain';
  if (s.includes('by-sa') && s.includes('4.0')) return 'CC-BY-SA-4.0';
  if (s.includes('by-sa') && s.includes('3.0')) return 'CC-BY-SA-3.0';
  if (s.includes('by-sa') && s.includes('2.0')) return 'CC-BY-SA-2.0';
  if (s.includes('by') && s.includes('4.0')) return 'CC-BY-4.0';
  if (s.includes('by') && s.includes('2.0')) return 'CC-BY-2.0';
  if (s.includes('by-sa')) return 'CC-BY-SA-4.0';
  return 'unknown';
}

async function getJson(url) {
  for (let i = 0; i < 4; i++) {
    const res = await fetch(url, { headers: HEADERS });
    if (res.ok) return res.json();
    if (res.status === 429) { await sleep(2500 * (i + 1)); continue; }
    return null;
  }
  return null;
}

let out = {};
try {
  out = JSON.parse(await readFile(cacheFile, 'utf8'));
} catch {}

let ok = Object.keys(out).length;
for (const [id, query, alt] of MANIFEST) {
  if (out[id]) { console.log(`· ${id} (cached)`); continue; }
  const url =
    `${API}?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=12` +
    `&gsrsearch=${encodeURIComponent(query)}` +
    `&prop=imageinfo&iiprop=url|mime|size|extmetadata&iiurlwidth=1200`;
  try {
    const j = await getJson(url);
    const pages = j?.query?.pages ? Object.values(j.query.pages) : [];
    pages.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    let chosen = null;
    for (const p of pages) {
      const ii = p.imageinfo?.[0];
      if (!ii) continue;
      if (!/image\/(jpeg|png)/.test(ii.mime || '')) continue; // skip svg/gif/tif/pdf
      if ((ii.width || 0) < 320) continue; // skip icons/stamps but allow small portraits
      chosen = { p, ii };
      break;
    }
    if (!chosen) { console.error(`✗ ${id}: no suitable Commons image for "${query}"`); await sleep(600); continue; }
    const { p, ii } = chosen;
    const dl = ii.thumburl || ii.url;
    const ext = /png/.test(ii.mime) ? 'png' : 'jpg';
    const dest = join(imgDir, `${id}.${ext}`);
    let skip = false;
    try { await access(dest); skip = true; } catch {}
    if (!skip) {
      const ir = await fetch(dl, { headers: HEADERS });
      if (!ir.ok) { console.error(`✗ ${id}: download HTTP ${ir.status}`); await sleep(600); continue; }
      await writeFile(dest, Buffer.from(await ir.arrayBuffer()));
    }
    const meta = ii.extmetadata || {};
    out[id] = {
      src: `/img/${id}.${ext}`,
      alt,
      credit: {
        source: 'Wikimedia Commons',
        sourceUrl: ii.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title || '')}`,
        author: stripHtml(meta.Artist?.value) || undefined,
        license: normLicense(meta.LicenseShortName?.value),
      },
      status: 'review',
    };
    ok++;
    console.log(`✓ ${id}  ←  ${(p.title || '').replace('File:', '')}  [${normLicense(meta.LicenseShortName?.value)}]`);
    await writeFile(cacheFile, JSON.stringify(out, null, 2));
    await sleep(1200);
  } catch (e) {
    console.error(`✗ ${id}: ${e.message}`);
  }
}

await writeFile(cacheFile, JSON.stringify(out, null, 2));
const ts = `// AUTO-GENERATED by scripts/fetch-commons.mjs — do not edit by hand.
export const COMMONS_MEDIA = ${JSON.stringify(out, null, 2)} as const;
`;
await writeFile(join(root, 'src', 'lib', 'media-commons.ts'), ts);
console.log(`\nResolved ${ok}/${MANIFEST.length} via Commons search. Wrote src/lib/media-commons.ts`);
