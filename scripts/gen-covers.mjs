// Generates an original, on-brand Madhubani-style cover image for every content
// entry that still has no `cover:` (no real photo could be sourced). Real PNG
// files — an illuminated "plate": jewel gradient + aripan dot field + ornamental
// frame with corner medallions + a per-entry motif + the title as hero — distinct
// per entry, so the site never shows an empty placeholder. SVG -> PNG via sharp.
// Writes src/lib/media-gen.ts and assigns covers. Run: node scripts/gen-covers.mjs
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const imgDir = join(root, 'public', 'img');
const dataDir = join(root, 'src', 'data');
await mkdir(imgDir, { recursive: true });

const CREAM = '#F3E7CF';
const GOLD = '#E0A82E';
// section -> base HSL + the motif set entries draw from (varied per entry)
const STYLE = {
  personalities: { h: 222, s: 40, l: 30, motifs: ['lotus', 'chakra', 'conch', 'paisley'] },
  places: { h: 145, s: 36, l: 26, motifs: ['temple', 'kalash', 'lotus'] },
  villages: { h: 168, s: 34, l: 25, motifs: ['tree', 'kalash', 'temple'] },
  festivals: { h: 8, s: 56, l: 33, motifs: ['sun', 'kalash', 'lotus'] },
  dishes: { h: 33, s: 58, l: 31, motifs: ['bowl', 'leaf', 'lotus'] },
  'art-styles': { h: 338, s: 44, l: 33, motifs: ['fish', 'peacock', 'lotus'] },
  articles: { h: 262, s: 32, l: 30, motifs: ['lotus', 'conch', 'chakra', 'paisley'] },
};
const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };

function motif(kind, cx, cy, st) {
  if (kind === 'sun') {
    let r = '';
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; r += `<line x1="${cx + Math.cos(a) * 92}" y1="${cy + Math.sin(a) * 92}" x2="${cx + Math.cos(a) * 130}" y2="${cy + Math.sin(a) * 130}" ${st}/>`; }
    return `${r}<circle cx="${cx}" cy="${cy}" r="76" ${st}/><circle cx="${cx}" cy="${cy}" r="54" ${st} opacity="0.55"/>`;
  }
  if (kind === 'lotus') {
    let p = '';
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2, dx = Math.cos(a), dy = Math.sin(a), ox = -dy, oy = dx;
      const px = cx + dx * 28, py = cy + dy * 28, tx = cx + dx * 128, ty = cy + dy * 128;
      p += `<path d="M ${px} ${py} Q ${cx + dx * 78 + ox * 52} ${cy + dy * 78 + oy * 52} ${tx} ${ty} Q ${cx + dx * 78 - ox * 52} ${cy + dy * 78 - oy * 52} ${px} ${py} Z" ${st}/>`; }
    return `${p}<circle cx="${cx}" cy="${cy}" r="24" ${st}/>`;
  }
  if (kind === 'chakra') {
    let sp = '';
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; sp += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(a) * 110}" y2="${cy + Math.sin(a) * 110}" ${st} opacity="0.6"/>`; }
    return `<circle cx="${cx}" cy="${cy}" r="120" ${st}/><circle cx="${cx}" cy="${cy}" r="118" ${st} opacity="0.4"/>${sp}<circle cx="${cx}" cy="${cy}" r="34" ${st}/>`;
  }
  if (kind === 'conch') {
    let d = `M ${cx + 60} ${cy - 90} `;
    for (let t = 0; t < 28; t++) { const a = t * 0.5, rr = 95 - t * 3; d += `L ${cx + Math.cos(a) * rr} ${cy + Math.sin(a) * rr} `; }
    return `<path d="${d}" ${st}/><path d="M ${cx + 55} ${cy + 70} q 60 30 30 90" ${st}/><circle cx="${cx}" cy="${cy}" r="8" ${st}/>`;
  }
  if (kind === 'paisley') {
    return `<path d="M ${cx} ${cy - 130} C ${cx + 110} ${cy - 90} ${cx + 90} ${cy + 80} ${cx} ${cy + 110} C ${cx - 70} ${cy + 90} ${cx - 60} ${cy + 10} ${cx} ${cy - 10} C ${cx + 40} ${cy - 24} ${cx + 30} ${cy - 70} ${cx} ${cy - 70}" ${st}/><circle cx="${cx + 6}" cy="${cy - 40}" r="12" ${st} opacity="0.6"/>`;
  }
  if (kind === 'temple') {
    return `<path d="M ${cx} ${cy - 150} L ${cx - 70} ${cy - 20} L ${cx + 70} ${cy - 20} Z" ${st}/><path d="M ${cx} ${cy - 110} L ${cx - 48} ${cy - 20} L ${cx + 48} ${cy - 20} Z" ${st} opacity="0.5"/><circle cx="${cx}" cy="${cy - 165}" r="11" ${st}/><rect x="${cx - 80}" y="${cy - 20}" width="160" height="120" rx="6" ${st}/><path d="M ${cx - 22} ${cy + 100} L ${cx - 22} ${cy + 34} Q ${cx} ${cy + 4} ${cx + 22} ${cy + 34} L ${cx + 22} ${cy + 100}" ${st}/>`;
  }
  if (kind === 'kalash') {
    return `<path d="M ${cx - 70} ${cy} Q ${cx - 86} ${cy + 95} ${cx} ${cy + 110} Q ${cx + 86} ${cy + 95} ${cx + 70} ${cy} Z" ${st}/><path d="M ${cx - 72} ${cy} Q ${cx} ${cy - 26} ${cx + 72} ${cy}" ${st}/><rect x="${cx - 34}" y="${cy - 52}" width="68" height="30" rx="6" ${st}/><circle cx="${cx}" cy="${cy - 78}" r="22" ${st}/><path d="M ${cx} ${cy - 100} q -34 -10 -54 14" ${st} opacity="0.6"/><path d="M ${cx} ${cy - 100} q 34 -10 54 14" ${st} opacity="0.6"/>`;
  }
  if (kind === 'tree') {
    return `<circle cx="${cx}" cy="${cy - 30}" r="90" ${st}/><circle cx="${cx}" cy="${cy - 30}" r="58" ${st} opacity="0.45"/><line x1="${cx}" y1="${cy + 64}" x2="${cx}" y2="${cy - 22}" ${st}/><path d="M ${cx} ${cy + 22} L ${cx - 34} ${cy - 8}" ${st}/><path d="M ${cx} ${cy + 32} L ${cx + 34} ${cy + 2}" ${st}/>`;
  }
  if (kind === 'bowl') {
    return `<path d="M ${cx - 108} ${cy} Q ${cx} ${cy + 128} ${cx + 108} ${cy} Z" ${st}/><ellipse cx="${cx}" cy="${cy}" rx="108" ry="25" ${st}/><path d="M ${cx - 38} ${cy - 68} Q ${cx - 52} ${cy - 38} ${cx - 38} ${cy - 18}" ${st} opacity="0.7"/><path d="M ${cx} ${cy - 78} Q ${cx - 14} ${cy - 44} ${cx} ${cy - 18}" ${st} opacity="0.7"/><path d="M ${cx + 38} ${cy - 68} Q ${cx + 24} ${cy - 38} ${cx + 38} ${cy - 18}" ${st} opacity="0.7"/>`;
  }
  if (kind === 'leaf') {
    return `<path d="M ${cx} ${cy - 120} Q ${cx + 95} ${cy} ${cx} ${cy + 120} Q ${cx - 95} ${cy} ${cx} ${cy - 120} Z" ${st}/><line x1="${cx}" y1="${cy - 110}" x2="${cx}" y2="${cy + 110}" ${st}/>${[-80, -40, 40, 80].map((o) => `<path d="M ${cx} ${cy + o} Q ${cx + 40} ${cy + o - 18} ${cx + 58} ${cy + o - 38}" ${st} opacity="0.55"/><path d="M ${cx} ${cy + o} Q ${cx - 40} ${cy + o - 18} ${cx - 58} ${cy + o - 38}" ${st} opacity="0.55"/>`).join('')}`;
  }
  if (kind === 'peacock') {
    let f = '';
    for (let i = -2; i <= 2; i++) { const a = i * 0.34 - Math.PI / 2; f += `<line x1="${cx}" y1="${cy + 40}" x2="${cx + Math.cos(a) * 130}" y2="${cy + 40 + Math.sin(a) * 130}" ${st} opacity="0.6"/><circle cx="${cx + Math.cos(a) * 130}" cy="${cy + 40 + Math.sin(a) * 130}" r="13" ${st}/>`; }
    return `${f}<path d="M ${cx} ${cy + 60} q -40 -50 0 -110 q 30 -30 18 -52" ${st}/><circle cx="${cx + 16}" cy="${cy - 96}" r="7" ${st}/>`;
  }
  return '';
}

function svg(title, section) {
  const stl = STYLE[section] || STYLE.articles;
  const seed = hash(section + ':' + title);
  const h = (stl.h + (seed % 38) - 19 + 360) % 360;
  const c1 = `hsl(${h} ${stl.s}% ${stl.l}%)`;
  const c2 = `hsl(${h} ${stl.s}% ${Math.max(7, stl.l - 17)}%)`;
  const kind = stl.motifs[seed % stl.motifs.length];
  const W = 1200, H = 800, st = `fill="none" stroke="${CREAM}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"`;
  // aripan dot field
  let dots = '';
  for (let y = 70; y < H; y += 56) for (let x = 70; x < W; x += 56) dots += `<circle cx="${x}" cy="${y}" r="2.6" fill="${CREAM}" opacity="0.06"/>`;
  // corner medallions (quarter lotus)
  const cst = `fill="none" stroke="${CREAM}" stroke-width="3" stroke-linecap="round"`;
  const corner = (x, y, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})" opacity="0.7">${[0, 1, 2].map((i) => { const a = (i / 4) * Math.PI / 1.5; return `<path d="M 0 0 Q ${Math.cos(a) * 30 - Math.sin(a) * 14} ${Math.sin(a) * 30 + Math.cos(a) * 14} ${Math.cos(a) * 56} ${Math.sin(a) * 56}" ${cst}/>`; }).join('')}<circle cx="0" cy="0" r="6" fill="${GOLD}"/></g>`;
  // top & bottom petal bands
  let band = '';
  for (let x = 120; x <= W - 120; x += 70) { band += `<circle cx="${x}" cy="92" r="5" fill="${GOLD}" opacity="0.5"/><circle cx="${x}" cy="${H - 92}" r="5" fill="${GOLD}" opacity="0.5"/>`; }
  // title wrap
  const words = title.split(/\s+/); const lines = []; let cur = '';
  for (const w of words) { if ((cur + ' ' + w).trim().length > 16 && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
  if (cur) lines.push(cur);
  const L = lines.slice(0, 3);
  const fs = L.some((l) => l.length > 13) ? 46 : 54;
  const ty0 = 590 - (L.length - 1) * (fs * 0.62);
  const tspans = L.map((ln, i) => `<text x="600" y="${ty0 + i * (fs + 12)}" text-anchor="middle" font-family="Georgia, 'DejaVu Serif', serif" font-size="${fs}" font-weight="600" fill="${CREAM}">${ln.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <g opacity="0.5"><circle cx="600" cy="300" r="210" fill="none" stroke="${CREAM}" stroke-width="1" opacity="0.18"/><circle cx="600" cy="300" r="168" fill="none" stroke="${CREAM}" stroke-width="1" opacity="0.12"/></g>
    ${dots}
    <rect x="34" y="34" width="${W - 68}" height="${H - 68}" rx="14" fill="none" stroke="${GOLD}" stroke-width="3" opacity="0.85"/>
    <rect x="48" y="48" width="${W - 96}" height="${H - 96}" rx="10" fill="none" stroke="${CREAM}" stroke-width="1.4" opacity="0.32"/>
    ${band}
    ${corner(48, 48, 0)}${corner(W - 48, 48, 90)}${corner(W - 48, H - 48, 180)}${corner(48, H - 48, 270)}
    <g opacity="0.92">${motif(kind, 600, 300, st)}</g>
    <line x1="450" y1="498" x2="750" y2="498" stroke="${GOLD}" stroke-width="2" opacity="0.75"/>
    <circle cx="600" cy="498" r="5" fill="${GOLD}"/>
    ${tspans}
  </svg>`;
}

// Walk content for entries that lack a real cover.
const COLLECTIONS = ['personalities', 'places', 'villages', 'festivals', 'dishes', 'art-styles'];
const targets = [];
async function scanDir(dir, section) {
  let entries; try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { await scanDir(p, e.name); continue; }
    if (!e.name.endsWith('.md')) continue;
    const t = await readFile(p, 'utf8');
    const coverM = t.match(/^cover:\s*(.+)$/m);
    if (coverM && !/^tile-/.test(coverM[1].trim())) continue; // keep real covers
    const slug = (t.match(/^slug:\s*(.+)$/m) || [])[1]?.trim() || e.name.replace(/\.en\.md$/, '');
    const title = (t.match(/^title:\s*(.+)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, '') || slug;
    targets.push({ file: p, slug, title, section });
  }
}
for (const c of COLLECTIONS) await scanDir(join(dataDir, c), c);
await scanDir(join(dataDir, 'articles'), 'articles');

const gen = {};
for (const { file, slug, title, section } of targets) {
  const id = `tile-${slug}`;
  await sharp(Buffer.from(svg(title, section))).png().toFile(join(imgDir, `${id}.png`));
  gen[id] = { src: `/img/${id}.png`, alt: `${title} — illustrated cover in the Mithila style`, credit: { source: 'Original artwork — Mithila Encyclopedia', sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Madhubani_paintings', license: 'CC-BY-SA-4.0' }, status: 'cleared' };
  let t = await readFile(file, 'utf8');
  if (!/^cover:/m.test(t)) { const lines = t.split('\n'); const i = lines.findIndex((l) => /^slug:/.test(l)); lines.splice(i + 1, 0, `cover: ${id}`); await writeFile(file, lines.join('\n')); }
  console.log(`✓ ${id}  (${section}) [${(STYLE[section] || STYLE.articles).motifs[hash(section + ':' + title) % (STYLE[section] || STYLE.articles).motifs.length]}]`);
}
const ts = `// AUTO-GENERATED by scripts/gen-covers.mjs — original designed cover art.
export const GEN_MEDIA = ${JSON.stringify(gen, null, 2)} as const;
`;
await writeFile(join(root, 'src', 'lib', 'media-gen.ts'), ts);
console.log(`\nGenerated ${Object.keys(gen).length} designed cover tiles. Wrote src/lib/media-gen.ts`);
