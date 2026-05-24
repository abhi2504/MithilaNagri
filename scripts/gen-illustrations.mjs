// Manifest-driven Madhubani illustration generator (Pollinations/FLUX, keyless).
// Two manifests:
//   MEDIA_MANIFEST — generates /img/<id>.jpg AND a media registry entry (writes
//     src/lib/media-illus.ts → ILLUS_MEDIA), for things referenced by `cover:`.
//   PLAIN_MANIFEST — generates /img/<file>.jpg only (no media entry), for images
//     referenced by direct <img src> with onerror fallback (e.g. timeline events).
// Run: node scripts/gen-illustrations.mjs
import { writeFile, readFile, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const imgDir = join(root, 'public', 'img');
const HEADERS = { 'User-Agent': 'MithilaEncyclopedia/0.1 (educational)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };
await mkdir(imgDir, { recursive: true });

const M = 'Authentic Mithila Madhubani folk-art painting, intricate double-line work, natural earthy pigments (ochre, vermilion, indigo, leaf green), ornamental hand-drawn border, flat figures, no text, devotional and dignified, museum quality';

// id | prompt | alt  → /img/<id>.jpg + media-illus.ts entry
const MEDIA_MANIFEST = [
  ['illus-govindadas', `${M}. Subject: a Vaishnava poet-saint of Mithila singing kirtan, holding cymbals (jhaal), an ektara beside him, devotees and a flowering lotus, fully clothed`, 'A Vaishnava poet-saint singing kirtan — illustration for the lyricist Govindadas'],
  ['illus-manbodh', `${M}. Subject: a poet reciting the story of Krishna from a palm-leaf to villagers under a tree, Krishna with a flute depicted above in a halo, fully clothed devotional scene`, 'A poet reciting the Krishna story — illustration for Manbodh’s Haribans'],
];

// id-key | prompt  → /img/illus-history-<key>.jpg  (no media entry; direct <img>)
const TIMELINE = [
  ['videha', 'King Janaka of Videha on his throne with sages, the infant Sita found in a furrow, a plough'],
  ['republic', 'an open-air assembly of the Vajji republic at Vaishali, elders voting with raised hands, a pillared hall'],
  ['mahavira', 'Mahavira the Jain Tirthankara in meditation under a tree near Vaishali, and the Buddha teaching, two serene haloed figures'],
  ['magadha', 'the army of Magadha king Ajatashatru with elephants conquering the Vaishali republic, banners'],
  ['karnat', 'the founding king Nanyadeva enthroned at the fort-city of Simraungadh, courtiers and a citadel gate'],
  ['varna-ratnakara', 'a Maithil scholar Jyotirishwar writing the first Maithili prose on a palm-leaf, a genealogist beginning the Panji registers'],
  ['oiniwar', 'the poet Vidyapati singing his padavali to the Oiniwar king, a vina, Radha-Krishna motifs above'],
  ['darbhanga-raj', 'the scholar-king Mahesh Thakur receiving a royal grant from emperor Akbar, a grand Darbhanga palace'],
  ['sugauli', 'a treaty map of Mithila being split by a border line between British India and Nepal, two flags, the year 1816'],
  ['tirhut-railway', 'the first steam train of the Tirhut Railway crossing the Mithila plains in 1874, the Maharaja of Darbhanga watching, fish-and-lotus border'],
  ['janaki-mandir', 'the grand white marble Janaki Mandir temple of Janakpur with its domes and arches, pilgrims'],
  ['akademi', 'a celebration of the Maithili language — books and palm-leaves of Maithili literature, a laurel, the year 1965'],
  ['eighth-schedule', 'the Constitution of India honouring the Maithili language, a scroll and an inkpot, the Tirhuta script, the year 2003'],
  ['makhana-gi', 'women harvesting and popping makhana fox-nuts from a Mithila pond, heaps of white puffed makhana, a GI seal'],
  ['karpoori-bharat-ratna', 'a dignified portrait of a humble leader (Karpoori Thakur) garlanded, the Bharat Ratna medal, crowds of common people'],
  ['statehood', 'a peaceful march of Maithil people holding a Mithila flag and banners calling for statehood and the Maithili language'],
];

async function genOne(dest, prompt, seedKey) {
  try { await access(dest); return true; } catch {}
  const seed = hash(seedKey) % 100000;
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1200&height=800&nologo=true&seed=${seed}&model=flux`;
  for (let a = 0; a < 3; a++) {
    try {
      const c = new AbortController(); const tm = setTimeout(() => c.abort(), 70000);
      const r = await fetch(url, { headers: HEADERS, signal: c.signal }); clearTimeout(tm);
      if (!r.ok) { await sleep(2500); continue; }
      const b = Buffer.from(await r.arrayBuffer());
      if (b.length < 6000 || b.subarray(0, 2).toString('hex') !== 'ffd8') { await sleep(2500); continue; }
      await writeFile(dest, b);
      return true;
    } catch { await sleep(2500); }
  }
  return false;
}

// 1) media-registry illustrations
let illus = {};
try { illus = JSON.parse(await readFile(join(imgDir, '_illus.json'), 'utf8')); } catch {}
for (const [id, prompt, alt] of MEDIA_MANIFEST) {
  const ok = await genOne(join(imgDir, `${id}.jpg`), prompt, id);
  if (!ok) { console.error(`✗ ${id}`); continue; }
  illus[id] = { src: `/img/${id}.jpg`, alt, credit: { source: 'AI illustration (Pollinations · FLUX)', sourceUrl: 'https://pollinations.ai', author: 'Generated in Madhubani style', license: 'CC0' }, status: 'cleared' };
  console.log(`✓ ${id}`);
  await sleep(700);
}
await writeFile(join(imgDir, '_illus.json'), JSON.stringify(illus, null, 2));
await writeFile(join(root, 'src', 'lib', 'media-illus.ts'),
  `// AUTO-GENERATED by scripts/gen-illustrations.mjs — AI Madhubani illustrations.\nexport const ILLUS_MEDIA = ${JSON.stringify(illus, null, 2)} as const;\n`);

// 2) timeline illustrations (plain files)
let tok = 0;
for (const [key, subj] of TIMELINE) {
  const ok = await genOne(join(imgDir, `illus-history-${key}.jpg`), `${M}. Subject: ${subj}`, `history-${key}`);
  if (ok) { tok++; console.log(`✓ illus-history-${key}`); } else console.error(`✗ illus-history-${key}`);
  await sleep(700);
}
console.log(`\nDone. media illustrations: ${Object.keys(illus).length}; timeline: ${tok}/${TIMELINE.length}. Wrote src/lib/media-illus.ts`);
