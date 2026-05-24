// Downloads the site's source images from Wikimedia Commons into public/img/
// so they are served from our own origin (no runtime dependency on remote hosts).
// Run: node scripts/fetch-images.mjs
import { mkdir, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'img');

// id | commons thumb hash | file name | thumb width | local extension
const MANIFEST = [
  ['hero-janaki', '8/8e', 'Pano_of_Janaki_Mandir-Janakpur_Nepal-.jpg', 1280, 'jpg'],
  ['hero-madhubani', '6/67', 'Madhubani_Mahavidyas.jpg', 1280, 'jpg'],
  ['hero-chhath', '0/0f', 'JanakpurChhathParvaFestival.jpg', 1280, 'jpg'],
  ['art-madhubani-1', '6/67', 'Madhubani_Mahavidyas.jpg', 1280, 'jpg'],
  ['art-madhubani-2', 'b/b3', 'Mithila_Painting_at_Patna_Junction.jpg', 1280, 'jpg'],
  ['art-asha-jha', 'c/c1', 'Asha_Jha_Madhubani_Artist_Bihar.jpg', 1024, 'jpg'],
  ['place-janaki', '1/16', 'Janki_Mandir_alt_version.jpg', 1280, 'jpg'],
  ['place-darbhanga-palace', 'd/d2', 'Old_Darbhanga_Raj_Palace-Damaged_by_earthquake.jpg', 1280, 'jpg'],
  ['place-nargona', '8/8b', 'NargonaPalace.jpg', 1280, 'jpg'],
  ['place-palace-area', '4/4e', 'Palacearea1.jpg', 1280, 'jpg'],
  ['festival-chhath', '6/68', 'Chhath_Puja_at_Basuki_Bihari_North.jpg', 1280, 'jpg'],
  ['festival-chhath-janakpur', '0/0f', 'JanakpurChhathParvaFestival.jpg', 1280, 'jpg'],
  ['festival-sama-chakeva', '8/83', 'Sama_Chakeva_Sarlahi_2.jpg', 1280, 'jpg'],
  ['festival-sama-chakeva-2', '3/31', 'Shama_Chakeva_characters28.jpg', 1280, 'jpg'],
  ['food-makhana', 'a/a4', 'Phool_Makhana.JPG', 512, 'jpg'],
  ['food-makhana-pond', '0/05', 'Makhanak_Pokhari.jpg', 1280, 'jpg'],
  ['person-vidyapati', 'c/ce', 'Statue_of_Maha_Kavi_Kokil_Vidyapati.jpg', 1024, 'jpg'],
  ['person-vidyapati-portrait', 'f/f0', 'Vidyapati.jpg', 400, 'jpg'],
  ['person-sharda-sinha', '7/76', 'Sharda_Sinha_%28cropped%29.jpg', 800, 'jpg'],
  ['lang-tirhuta-chart', '6/64', 'Tirhuta_aksharamala.png', 700, 'png'],
  ['lang-tirhuta-inscription', '0/09', 'Tirhuta_Script_at_Mandar_Hills_of_Banka_District.jpg', 1280, 'jpg'],
  ['person-karpoori', '1/15', 'Karpoori_Thakur_2024_stamp_of_India.jpg', 500, 'jpg'],
  ['person-manoj', '7/75', 'Manoj_Bajpai_at_52nd_IFFI.jpg', 600, 'jpg'],
  ['food-thekua', '9/9c', 'Thekua_-_Chhath_Festival_-_Kolkata_2013-11-09_4316.JPG', 800, 'jpg'],
  ['place-punaura', '6/67', 'Punaura_Sitamarhi.jpg', 800, 'jpg'],
];

const thumbUrl = (hash, file, width) =>
  `https://upload.wikimedia.org/wikipedia/commons/thumb/${hash}/${file}/${width}px-${file}`;
const origUrl = (hash, file) =>
  `https://upload.wikimedia.org/wikipedia/commons/${hash}/${file}`;

const HEADERS = { 'User-Agent': 'MithilaEncyclopedia/0.1 (educational; contact: site admin)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function tryFetch(u) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(u, { headers: HEADERS });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if (res.status === 429) {
      await sleep(2500 * (attempt + 1)); // back off on rate-limit
      continue;
    }
    return null; // 400/404 etc — caller falls back to original
  }
  return null;
}

await mkdir(outDir, { recursive: true });
let ok = 0;
for (const [id, hash, file, width, ext] of MANIFEST) {
  const dest = join(outDir, `${id}.${ext}`);
  try {
    await access(dest);
    console.log(`· skip   ${id} (exists)`);
    ok++;
    continue;
  } catch {}
  try {
    let buf = await tryFetch(thumbUrl(hash, file, width));
    if (!buf) {
      await sleep(800);
      buf = await tryFetch(origUrl(hash, file)); // fall back to the original file
    }
    if (!buf) {
      console.error(`✗ FAIL   ${id}`);
    } else {
      await writeFile(dest, buf);
      console.log(`✓ saved  ${id}.${ext}  (${(buf.length / 1024).toFixed(0)} KB)`);
      ok++;
    }
  } catch (e) {
    console.error(`✗ ERROR  ${id} — ${e.message}`);
  }
  await sleep(1200); // throttle to avoid 429
}
console.log(`\nDone: ${ok}/${MANIFEST.length} images in public/img/`);
