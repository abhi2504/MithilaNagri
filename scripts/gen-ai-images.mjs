// Generates on-brand Madhubani/Mithila-style illustrations via Pollinations.ai
// (free, keyless, FLUX model) for every entry that still has only a designed
// "tile-" cover — i.e. no real photo could be sourced. These are clearly marked
// as AI illustrations (not photos). Real photos elsewhere are untouched.
// Writes src/lib/media-ai.ts and reassigns covers. Run: node scripts/gen-ai-images.mjs
import { readdir, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const imgDir = join(root, 'public', 'img');
const dataDir = join(root, 'src', 'data');
const cacheFile = join(imgDir, '_ai.json');
const HEADERS = { 'User-Agent': 'MithilaEncyclopedia/0.1 (educational)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await mkdir(imgDir, { recursive: true });
const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };

const STYLE = 'Authentic Mithila Madhubani folk-art painting, intricate double-line work, natural earthy pigments (ochre, vermilion, indigo, leaf green), ornamental hand-drawn border, flat figures, no text, museum quality';

// Per-entry overrides; otherwise built from section + title.
const SPECIAL = {
  // crafts
  'khatwa': `${STYLE}. Subject: Khatwa appliqué — bold cut-cloth figures of elephants, peacocks and the tree of life stitched onto a festive canopy`,
  'mithila-masks': `${STYLE}. Subject: painted papier-mache Mithila festival masks of gods and folk heroes arranged on a wall`,
  'sujani': `${STYLE}. Subject: a Sujani embroidery quilt covered with stitched village scenes, mother and child, sun and birds`,
  // rituals
  'mundan': `${STYLE}. Subject: a child's first-haircut Mundan ceremony, mother holding the child, a priest with scissors, lamps and offerings`,
  'panji-system': `${STYLE}. Subject: a Maithil genealogist (Panjikar) seated, writing family lineage records on long palm-leaf manuscripts`,
  'shradh': `${STYLE}. Subject: an ancestral Shraddha rite beside a river, a man offering rice-balls and water, crows, solemn mood`,
  'sohar-chhathi': `${STYLE}. Subject: women joyfully singing Sohar birth-songs around a new mother and her newborn, lamps, drums`,
  // dishes / festivals
  'aloo-bhujia': `${STYLE}. Subject: a Maithil meal still-life — spiced potato curry served on a green banana leaf with rice and pickle`,
  'jur-sital': `${STYLE}. Subject: the Jur Sital Maithil New Year — elders sprinkling cool water on the young, green paddy fields, mango trees`,
  // people (symbolic, NOT a fake likeness)
  'bharati-mishra': `${STYLE}. Subject: Ubhaya Bharati, a learned woman philosopher of Mithila seated as judge between two debating scholars, books and palm-le aves`,
  'kirti-azad': `${STYLE}. Subject: the joy of cricket in Bihar — a batsman striking a ball, cheering crowd, festive bunting`,
  'nitin-chandra': `${STYLE}. Subject: Maithili cinema — an old film camera, a clapperboard and a village storyteller under a tree`,
  // places
  'ahilya-asthan': `${STYLE}. Subject: the legend of Ahilya at Ahilya Sthan — a woman emerging from stone as Rama blesses her, a small shrine`,
  'gautam-asthan': `${STYLE}. Subject: the forest ashram of sage Gautama, huts, deer, a sacred pond and trees`,
  'haleshwar-sthan': `${STYLE}. Subject: a Shiva temple with a Shiva-linga said to be founded by King Janaka, devotees with offerings`,
  'hariharnath': `${STYLE}. Subject: the Hariharnath temple deity, half Vishnu and half Shiva, ornate shrine`,
  'kusheshwar-asthan': `${STYLE}. Subject: a Shiva shrine amid vast wetlands crowded with migratory cranes, pelicans and herons`,
};

function buildPrompt(section, slug, title) {
  if (SPECIAL[slug]) return SPECIAL[slug];
  if (section === 'villages')
    return `${STYLE}. Subject: a North Bihar / Mithila village scene of "${title}" — painted mud houses with kohbar art, a lotus pond, green paddy fields, a banyan tree, women in saris carrying pots`;
  if (section === 'places')
    return `${STYLE}. Subject: the Mithila pilgrimage site "${title}", an ornate temple shrine with devotees and lamps`;
  if (section === 'festivals')
    return `${STYLE}. Subject: the Mithila festival "${title}", celebrating figures, lamps, rangoli and ornamental motifs`;
  if (section === 'dishes')
    return `${STYLE}. Subject: the Maithil dish "${title}" served on a banana leaf, warm and appetising`;
  if (section === 'art-styles')
    return `${STYLE}. Subject: an example of the "${title}" craft of Mithila`;
  if (section === 'personalities')
    return `${STYLE}. Subject: a dignified imagined portrait of the Mithila scholar-sage "${title}", seated with palm-leaf manuscripts, halo of learning`;
  return `${STYLE}. Subject: ${title}, a theme of Mithila culture`;
}

const COLLECTIONS = ['personalities', 'places', 'villages', 'festivals', 'dishes', 'art-styles'];
const targets = [];
async function scan(dir, section) {
  let entries; try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { await scan(p, e.name); continue; }
    if (!e.name.endsWith('.md')) continue;
    const t = await readFile(p, 'utf8');
    const m = t.match(/^cover:\s*(.+)$/m);
    if (!m || !/^tile-/.test(m[1].trim())) continue; // only entries still on a tile
    const slug = (t.match(/^slug:\s*(.+)$/m) || [])[1]?.trim() || e.name.replace(/\.en\.md$/, '');
    const title = (t.match(/^title:\s*(.+)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, '') || slug;
    targets.push({ file: p, slug, title, section });
  }
}
for (const c of COLLECTIONS) await scan(join(dataDir, c), c);
await scan(join(dataDir, 'articles'), 'articles');

let out = {};
try { out = JSON.parse(await readFile(cacheFile, 'utf8')); } catch {}

let ok = 0;
for (const { file, slug, title, section } of targets) {
  const id = `ai-${slug}`;
  const dest = join(imgDir, `${id}.jpg`);
  let have = false;
  try { await access(dest); have = true; } catch {}
  if (!have) {
    const prompt = buildPrompt(section, slug, title);
    const seed = hash(id) % 100000;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1200&height=800&nologo=true&seed=${seed}&model=flux`;
    let okimg = false;
    for (let attempt = 0; attempt < 3 && !okimg; attempt++) {
      try {
        const c = new AbortController(); const tm = setTimeout(() => c.abort(), 60000);
        const r = await fetch(url, { headers: HEADERS, signal: c.signal }); clearTimeout(tm);
        if (!r.ok) { await sleep(2500); continue; }
        const b = Buffer.from(await r.arrayBuffer());
        if (b.length < 6000 || b.slice(0, 2).toString('hex') !== 'ffd8') { await sleep(2500); continue; } // not a JPEG
        await writeFile(dest, b);
        okimg = true;
      } catch { await sleep(2500); }
    }
    if (!okimg) { console.error(`✗ ${id} (kept tile)`); continue; }
  }
  out[id] = {
    src: `/img/${id}.jpg`,
    alt: `${title} — AI-generated illustration in the Mithila (Madhubani) style`,
    credit: { source: 'AI illustration (Pollinations · FLUX)', sourceUrl: 'https://pollinations.ai', author: 'Generated in Madhubani style', license: 'CC0' },
    status: 'cleared',
  };
  // swap tile -> ai cover
  let t = await readFile(file, 'utf8');
  t = t.replace(/^cover:\s*tile-.*$/m, `cover: ${id}`);
  await writeFile(file, t);
  ok++;
  console.log(`✓ ${id}  (${section})`);
  await writeFile(cacheFile, JSON.stringify(out, null, 2));
  await sleep(800);
}

await writeFile(cacheFile, JSON.stringify(out, null, 2));
const ts = `// AUTO-GENERATED by scripts/gen-ai-images.mjs — AI illustrations (Pollinations/FLUX), Madhubani style.
export const AI_MEDIA = ${JSON.stringify(out, null, 2)} as const;
`;
await writeFile(join(root, 'src', 'lib', 'media-ai.ts'), ts);
console.log(`\nGenerated/assigned ${ok}/${targets.length} AI illustrations. Wrote src/lib/media-ai.ts`);
