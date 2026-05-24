// Resolves lead images for Wikipedia topics via the REST summary API, downloads
// the (free, Commons-hosted) image into public/img/, and writes credit metadata
// to src/lib/media-extra.ts. Skips non-free (en.wikipedia-hosted) images.
// Run: node scripts/fetch-wiki-images.mjs
import { writeFile, readFile, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const imgDir = join(root, 'public', 'img');
const cacheFile = join(imgDir, '_wiki.json');
await mkdir(imgDir, { recursive: true });

// id | wikipedia title | alt | license
const MANIFEST = [
  // people
  ['person-udit-narayan', 'Udit Narayan', 'The playback singer Udit Narayan', 'CC-BY-SA-4.0'],
  ['person-maithili-thakur', 'Maithili Thakur', 'The folk singer Maithili Thakur', 'CC-BY-SA-4.0'],
  ['person-nagarjun', 'Nagarjun', 'The Maithili & Hindi poet Nagarjun (Vaidyanath Mishra)', 'CC-BY-SA-4.0'],
  ['person-dinkar', 'Ramdhari Singh Dinkar', 'The poet Ramdhari Singh Dinkar', 'public-domain'],
  ['person-renu', 'Phanishwar Nath Renu', 'The writer Phanishwar Nath Renu', 'public-domain'],
  ['person-ln-mishra', 'Lalit Narayan Mishra', 'The statesman Lalit Narayan Mishra', 'public-domain'],
  ['person-lk-jha', 'Lakshmi Kant Jha', 'L. K. Jha, 8th Governor of the RBI', 'public-domain'],
  ['person-imtiaz-ali', 'Imtiaz Ali', 'The film director Imtiaz Ali', 'CC-BY-SA-4.0'],
  ['person-neha-sharma', 'Neha Sharma', 'The actor Neha Sharma', 'CC-BY-SA-4.0'],
  ['person-sushant', 'Sushant Singh Rajput', 'The actor Sushant Singh Rajput', 'CC-BY-SA-4.0'],
  ['person-kirti-azad', 'Kirti Azad', 'The cricketer and politician Kirti Azad', 'CC-BY-SA-4.0'],
  ['person-bhawana-kanth', 'Bhawana Kanth', 'Bhawana Kanth, a fighter pilot of the IAF', 'CC-BY-SA-4.0'],
  ['person-ganga-devi', 'Ganga Devi (painter)', 'The Madhubani painter Ganga Devi', 'CC-BY-SA-4.0'],
  ['person-mahasundari', 'Mahasundari Devi', 'The Madhubani painter Mahasundari Devi', 'CC-BY-SA-4.0'],
  ['person-baua-devi', 'Baua Devi', 'The Madhubani painter Baua Devi', 'CC-BY-SA-4.0'],
  ['person-godavari-dutta', 'Godawari Dutta', 'The Madhubani painter Godavari Dutta', 'CC-BY-SA-4.0'],
  ['person-dulari-devi', 'Dulari Devi (artist)', 'The Madhubani painter Dulari Devi', 'CC-BY-SA-4.0'],
  ['person-harimohan-jha', 'Hari Mohan Jha', 'The Maithili writer Harimohan Jha', 'public-domain'],
  // dishes
  ['food-litti', 'Litti chokha', 'Litti-chokha', 'CC-BY-SA-4.0'],
  ['food-sattu', 'Sattu', 'Sattu, roasted gram flour', 'CC-BY-SA-4.0'],
  ['food-malpua', 'Malpua', 'Malpua, a sweet pancake', 'CC-BY-SA-4.0'],
  ['food-pittha', 'Pitha', 'Pittha, rice-flour dumplings', 'CC-BY-SA-4.0'],
  ['food-tilkut', 'Tilkut', 'Tilkut, a sesame-jaggery sweet', 'CC-BY-SA-4.0'],
  ['food-khaja', 'Khaja', 'Khaja, a layered sweet', 'CC-BY-SA-4.0'],
  ['food-ghughni', 'Ghugni', 'Ghughni, a chickpea curry', 'CC-BY-SA-4.0'],
  // festivals
  ['festival-jitiya', 'Jitiya', 'The Jitiya festival', 'CC-BY-SA-4.0'],
  ['festival-vivaha-panchami', 'Vivaha Panchami', 'Vivaha Panchami at Janakpur', 'CC-BY-SA-4.0'],
  ['festival-makar-sankranti', 'Makar Sankranti', 'Makar Sankranti', 'CC-BY-SA-4.0'],
  ['festival-jhijhiya', 'Jhijhiya', 'The Jhijhiya folk dance', 'CC-BY-SA-4.0'],
  // places
  ['place-kanwar', 'Kanwar Lake Bird Sanctuary', 'Kanwar (Kabar) Lake', 'CC-BY-SA-4.0'],
  ['place-vaishali', 'Vaishali (ancient city)', 'The Ashokan pillar at Vaishali', 'CC-BY-SA-4.0'],
  ['place-kesaria', 'Kesariya', 'The Kesaria Stupa', 'CC-BY-SA-4.0'],
  // batch 2
  ['person-kameshwar-singh', 'Kameshwar Singh', 'Maharaja Kameshwar Singh of Darbhanga', 'public-domain'],
  ['person-lakshmeshwar-singh', 'Lakshmeshwar Singh', 'Maharaja Lakshmeshwar Singh of Darbhanga', 'public-domain'],
  ['person-jagannath-mishra', 'Jagannath Mishra', 'Jagannath Mishra, former Chief Minister of Bihar', 'CC-BY-SA-4.0'],
  ['person-bhagwat-jha-azad', 'Bhagwat Jha Azad', 'Bhagwat Jha Azad, former Chief Minister of Bihar', 'public-domain'],
  ['person-ganganath-jha', 'Ganganath Jha', 'The Sanskrit scholar Sir Ganganath Jha', 'public-domain'],
  ['person-rajkamal', 'Rajkamal Chaudhary', 'The writer Rajkamal Chaudhary', 'public-domain'],
  ['person-dulari-devi', 'Dulari Devi (artist)', 'The Madhubani painter Dulari Devi', 'CC-BY-SA-4.0'],
  ['person-sita-devi', 'Sita Devi (painter)', 'The Madhubani painter Sita Devi', 'CC-BY-SA-4.0'],
  ['place-chandradhari', 'Chandradhari Museum', 'The Chandradhari Museum, Darbhanga', 'CC-BY-SA-4.0'],
  ['festival-holi', 'Holi', 'Holi, the festival of colours', 'CC-BY-SA-4.0'],
  ['festival-durga-puja', 'Durga Puja', 'Durga Puja', 'CC-BY-SA-4.0'],
  ['festival-saraswati', 'Vasant Panchami', 'Saraswati Puja on Vasant Panchami', 'CC-BY-SA-4.0'],
  ['food-anarsa', 'Anarsa', 'Anarsa, a fried rice-flour sweet', 'CC-BY-SA-4.0'],
  ['food-kheer', 'Kheer', 'Kheer, rice pudding', 'CC-BY-SA-4.0'],
  ['craft-sikki', 'Sikki grass craft', 'Sikki golden-grass craft of Mithila', 'CC-BY-SA-4.0'],
  // batch 3
  ['festival-vat-savitri', 'Vat Savitri', 'Vat Savitri vrat', 'CC-BY-SA-4.0'],
  ['festival-naag-panchami', 'Nag Panchami', 'Nag Panchami', 'CC-BY-SA-4.0'],
  ['food-kadhi', 'Kadhi', 'Kadhi with pakora', 'CC-BY-SA-4.0'],
  ['culture-jat-jatin', 'Jat-Jatin', 'The Jat-Jatin folk dance', 'CC-BY-SA-4.0'],
  // batch 4
  ['person-sachchidananda-sinha', 'Sachchidananda Sinha', 'Sachchidananda Sinha, first president of the Constituent Assembly', 'public-domain'],
  ['person-amarnath-jha', 'Amarnath Jha', 'The educationist Amarnath Jha', 'public-domain'],
  ['person-neetu-chandra', 'Nitu Chandra', 'The actor-producer Neetu Chandra', 'CC-BY-SA-4.0'],
  ['person-bharti-dayal', 'Bharti Dayal', 'The Madhubani artist Bharti Dayal', 'CC-BY-SA-4.0'],
  ['person-pushpa-kumari', 'Pushpa Kumari', 'The Madhubani artist Pushpa Kumari', 'CC-BY-SA-4.0'],
  ['person-karpoori-thakur', 'Karpoori Thakur', 'Karpoori Thakur, Bharat Ratna', 'public-domain'],
  // batch 5 — places, festivals, dishes (high-probability Commons lead images)
  ['food-khichdi', 'Khichdi', 'Khichdi, rice cooked with lentils', 'CC-BY-SA-4.0'],
  ['food-maach', 'Fish curry', 'Maithil-style fish curry (maach)', 'CC-BY-SA-4.0'],
  ['food-dahi-chura', 'Chiura', 'Dahi-chura — flattened rice with curd', 'CC-BY-SA-4.0'],
  ['festival-ram-navami', 'Rama Navami', 'Ram Navami celebrations', 'CC-BY-SA-4.0'],
  ['festival-kojagara', 'Kojagara', 'The Kojagara festival', 'CC-BY-SA-4.0'],
  ['festival-madhushravani', 'Madhushravani', 'The Madhushravani festival', 'CC-BY-SA-4.0'],
  ['place-simraungadh', 'Simraungadh', 'Ruins at Simraungadh, capital of the Karnat dynasty', 'CC-BY-SA-4.0'],
  ['place-kesaria', 'Kesaria Stupa', 'The Kesaria Stupa, among the tallest Buddhist stupas', 'CC-BY-SA-4.0'],
  ['place-uchhaith', 'Uchhaith', 'The Uchhaith Bhagwati temple in Madhubani', 'CC-BY-SA-4.0'],
  ['place-singheshwar', 'Singheshwar', 'Singheshwar Sthan, a Shiva temple of the Kosi region', 'CC-BY-SA-4.0'],
  ['place-ugratara', 'Ugratara', 'The Ugratara temple at Mahishi', 'CC-BY-SA-4.0'],
  ['place-naulakha', 'Naulakha Palace', 'The Naulakha Palace at Rajnagar', 'CC-BY-SA-4.0'],
  ['place-sitamarhi', 'Sitamarhi', 'Sitamarhi, revered as the birthplace of Sita', 'CC-BY-SA-4.0'],
  // batch 6
  ['person-grierson', 'George Abraham Grierson', 'The linguist Sir George Abraham Grierson', 'public-domain'],
  ['person-jagdamba-devi', 'Jagdamba Devi', 'The Madhubani painter Jagdamba Devi', 'CC-BY-SA-4.0'],
  ['person-nanyadeva', 'Nanyadeva', 'Nanyadeva, founder of the Karnat dynasty', 'public-domain'],
];

const FILE_RE = /\/commons\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/]+\.(?:jpg|jpeg|png|gif|svg|JPG|JPEG|PNG))/;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let out = {};
try {
  out = JSON.parse(await readFile(cacheFile, 'utf8'));
} catch {
  // seed from a previously generated media-extra.ts
  try {
    const prev = await readFile(join(root, 'src', 'lib', 'media-extra.ts'), 'utf8');
    const m = prev.match(/EXTRA_MEDIA\s*=\s*(\{[\s\S]*\})\s*as const/);
    if (m) out = JSON.parse(m[1]);
  } catch {}
}
let ok = Object.keys(out).length;

for (const [id, title, alt, license] of MANIFEST) {
  if (out[id]) {
    console.log(`· ${id} (cached)`);
    continue;
  }
  try {
    const api = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`;
    const res = await fetch(api, { headers: { 'User-Agent': 'MithilaEncyclopedia/0.1 (educational)' } });
    if (!res.ok) {
      console.error(`✗ ${id}: summary HTTP ${res.status}`);
      await sleep(300);
      continue;
    }
    const j = await res.json();
    const url = j.originalimage?.source || j.thumbnail?.source;
    if (!url || !url.includes('/wikipedia/commons/')) {
      console.error(`✗ ${id}: no free Commons image`);
      await sleep(300);
      continue;
    }
    const m = url.match(FILE_RE);
    const file = m ? decodeURIComponent(m[1]) : `${id}`;
    const ext = (file.split('.').pop() || 'jpg').toLowerCase().replace('jpeg', 'jpg');
    const dest = join(imgDir, `${id}.${ext}`);
    let skip = false;
    try {
      await access(dest);
      skip = true;
    } catch {}
    if (!skip) {
      const ir = await fetch(url, { headers: { 'User-Agent': 'MithilaEncyclopedia/0.1 (educational)' } });
      if (!ir.ok) {
        console.error(`✗ ${id}: image HTTP ${ir.status}`);
        await sleep(300);
        continue;
      }
      await writeFile(dest, Buffer.from(await ir.arrayBuffer()));
    }
    out[id] = {
      src: `/img/${id}.${ext}`,
      alt,
      credit: {
        source: 'Wikimedia Commons',
        sourceUrl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`,
        license,
      },
      status: 'review',
    };
    ok++;
    console.log(`✓ ${id}  ←  ${file}`);
    await writeFile(cacheFile, JSON.stringify(out, null, 2));
    await sleep(1500);
  } catch (e) {
    console.error(`✗ ${id}: ${e.message}`);
  }
}

await writeFile(cacheFile, JSON.stringify(out, null, 2));
const ts = `// AUTO-GENERATED by scripts/fetch-wiki-images.mjs — do not edit by hand.
export const EXTRA_MEDIA = ${JSON.stringify(out, null, 2)} as const;
`;
await writeFile(join(root, 'src', 'lib', 'media-extra.ts'), ts);
console.log(`\nResolved ${ok}/${MANIFEST.length}. Wrote src/lib/media-extra.ts`);
