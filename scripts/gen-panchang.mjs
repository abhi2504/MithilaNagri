// Generates the daily Maithili Panchang for the whole year (computed, astronomical)
// using mhah-panchang, anchored to Darbhanga, Bihar. Output: public/data/panchang-<year>.json
// The festival/ekadashi/muhurat layer is curated separately in src/data/panchang.ts.
// Run: node scripts/gen-panchang.mjs
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pkg from 'mhah-panchang';
const { MhahPanchang } = pkg;

const YEAR = 2026;
const LAT = 26.17, LNG = 85.9; // Darbhanga
const IST = 5.5 * 60; // minutes
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// ── Devanagari / Maithili name maps ──────────────────────────────────────────
const VAAR = ['रवि', 'सोम', 'मंगल', 'बुध', 'बृहस्पति', 'शुक्र', 'शनि'];
const VAAR_EN = ['Ravi', 'Som', 'Mangal', 'Budh', 'Brihaspati', 'Shukra', 'Shani'];
// Tithi.ino runs 0–29 across the lunar month (Shukla 0–14, Krishna 15–29).
const TITHI = ['प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी'];
const TITHI_EN = ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi'];
const NAK = ['अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'आश्लेषा', 'मघा', 'पूर्वाफाल्गुनी', 'उत्तराफाल्गुनी', 'हस्त', 'चित्रा', 'स्वाति', 'विशाखा', 'अनुराधा', 'ज्येष्ठा', 'मूल', 'पूर्वाषाढा', 'उत्तराषाढा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वाभाद्रपदा', 'उत्तराभाद्रपदा', 'रेवती'];
// The library's English nakshatra labels are unreliable (e.g. ino 1 → "Dwija"); use ino.
const NAK_EN = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
const PAKSHA = { Shukla: 'शुक्ल', Krishna: 'कृष्ण' };

// Maithil SOLAR months (Tirhuta reckoning) — Sankranti boundaries for 2026.
// Each: [startMonthIndex(0=Jan), startDay, name_en, name_dev]
const SOLAR_MONTHS = [
  ['2026-01-01', 'Poos', 'पूस'],   // Dhanu (entered 16 Dec 2025)
  ['2026-01-14', 'Magh', 'माघ'],
  ['2026-02-13', 'Phalgun', 'फाल्गुन'],
  ['2026-03-15', 'Chait', 'चैत'],
  ['2026-04-14', 'Baisakh', 'बैसाख'],
  ['2026-05-15', 'Jeth', 'जेठ'],
  ['2026-06-15', 'Asadh', 'असाढ़'],
  ['2026-07-16', 'Sawan', 'सावन'],
  ['2026-08-17', 'Bhado', 'भादो'],
  ['2026-09-17', 'Aaswin', 'आश्विन'],
  ['2026-10-17', 'Kartik', 'कार्तिक'],
  ['2026-11-16', 'Aghan', 'अगहन'],
  ['2026-12-16', 'Poos', 'पूस'],
];
function solarMonth(ymd) {
  let cur = SOLAR_MONTHS[0];
  for (const m of SOLAR_MONTHS) if (ymd >= m[0]) cur = m;
  return { en: cur[1], dev: cur[2] };
}

// ── helpers ──────────────────────────────────────────────────────────────────
const pad = (n) => String(n).padStart(2, '0');
function istParts(iso) {
  // shift a UTC instant to IST, return {ymd, hhmm}
  const t = new Date(new Date(iso).getTime() + IST * 60000);
  const ymd = `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
  const hhmm = `${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())}`;
  return { ymd, hhmm };
}
function tithiName(ino) {
  if (ino === 14) return 'पूर्णिमा';
  if (ino === 29) return 'अमावस्या';
  return TITHI[ino % 15] || '';
}
function tithiNameEn(ino) {
  if (ino === 14) return 'Purnima';
  if (ino === 29) return 'Amavasya';
  return TITHI_EN[ino % 15] || '';
}

const o = new MhahPanchang();
const days = [];
const start = new Date(Date.UTC(YEAR, 0, 1));
const end = new Date(Date.UTC(YEAR, 11, 31));

for (let dt = new Date(start); dt <= end; dt.setUTCDate(dt.getUTCDate() + 1)) {
  const ymd = `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
  // local IST midnight for this calendar date
  const istMidnight = new Date(Date.UTC(YEAR, dt.getUTCMonth(), dt.getUTCDate(), 0, 0) - IST * 60000);
  // sunrise
  let srISO, ssISO;
  try {
    const st = o.sunTimer(istMidnight, LAT, LNG);
    srISO = st.sunRise; ssISO = st.sunSet;
  } catch { srISO = ssISO = null; }
  const sunrise = srISO ? istParts(srISO).hhmm : '';
  const sunset = ssISO ? istParts(ssISO).hhmm : '';
  // panchang AT sunrise (fallback: 06:00 IST)
  const atSunrise = srISO ? new Date(srISO) : new Date(istMidnight.getTime() + 6 * 3600000);
  const c = o.calculate(atSunrise);
  let masaEn = '';
  try { const cal = o.calendar(atSunrise, LAT, LNG); masaEn = cal.Masa?.name_en_IN || ''; } catch {}

  const pakEn = c.Paksha?.name_en_IN || 'Shukla';
  const tEndIst = c.Tithi?.end ? istParts(c.Tithi.end) : null;
  const nEndIst = c.Nakshatra?.end ? istParts(c.Nakshatra.end) : null;
  const sm = solarMonth(ymd);

  days.push({
    d: ymd,
    wd: VAAR_EN[dt.getUTCDay()],
    wdDev: VAAR[dt.getUTCDay()],
    sr: sunrise,
    ss: sunset,
    pakEn,
    pak: PAKSHA[pakEn] || pakEn,
    tithiEn: tithiNameEn(c.Tithi?.ino ?? 0),
    tithi: tithiName(c.Tithi?.ino ?? 0),
    tEnd: tEndIst ? tEndIst.hhmm : '',
    tNext: tEndIst ? tEndIst.ymd > ymd : false,
    nakEn: NAK_EN[c.Nakshatra?.ino ?? 0] || '',
    nak: NAK[c.Nakshatra?.ino ?? 0] || '',
    nEnd: nEndIst ? nEndIst.hhmm : '',
    nNext: nEndIst ? nEndIst.ymd > ymd : false,
    yoga: c.Yoga?.name_en_IN || '',
    karana: c.Karna?.name_en_IN || '',
    raasi: c.Raasi?.name_en_IN || '',
    masaEn,
    smEn: sm.en,
    sm: sm.dev,
  });
}

const out = {
  meta: {
    year: YEAR,
    place: 'Darbhanga, Bihar',
    lat: LAT, lng: LNG, tz: 'IST (UTC+5:30)',
    engine: 'mhah-panchang',
    note: 'Computed for reference. Confirm exact muhurat/lagan with a local panji/pandit before any ceremony.',
  },
  days,
};
await mkdir(join(root, 'public', 'data'), { recursive: true });
await writeFile(join(root, 'public', 'data', `panchang-${YEAR}.json`), JSON.stringify(out));
console.log(`Wrote public/data/panchang-${YEAR}.json — ${days.length} days.`);
// sample
console.log('sample (today 2026-05-24):', JSON.stringify(days.find((x) => x.d === '2026-05-24')));
