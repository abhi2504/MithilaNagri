// Curated, source-cited 2026 almanac layer for the Maithili Panchang.
// The DAILY tithi/nakshatra grid is computed separately (scripts/gen-panchang.mjs
// → /data/panchang-2026.json). This file holds the human-verified events whose
// accuracy matters most: festivals, ekadashi, sankranti, the no-ceremony windows
// (Kharmas / Adhik-Maas / Chaturmas) and the ceremony muhurat lists.
//
// Sources: Drik Panchang (Darbhanga calendar — tithi/nakshatra-rich cross-check)
// + the Maithili Patra (patra.maithili.org.in) and printed Mithila Panchang 2026
// (KSDSU Vishwavidyalaya / Vidyapati / Dr. Mukti Kant Jha). Dates are for the
// Mithila reference region; confirm exact lagan with a local panji/pandit.

export const PANCHANG_YEAR = 2026;
export const PANCHANG_PLACE = 'Darbhanga, Bihar';
export const PANCHANG_DISCLAIMER =
  'संदर्भ लेल — कोनो शुभ कार्य (विवाह, उपनयन, मुंडन आदि) सं पहिने अपन पंजी / पंडित सं तिथि-लग्न मिला लिअ। · For reference only — confirm the exact date and lagna with your panji/pandit before any ceremony.';

export interface PEvent {
  date: string; // YYYY-MM-DD
  endDate?: string;
  en: string;
  dev?: string;
  note?: string;
  link?: string; // relative, e.g. /festivals/chhath/
  major?: boolean;
}

// ── No-ceremony / special periods (the "why some months are empty" layer) ──
export interface PWindow {
  kind: 'kharmas' | 'malmas' | 'chaturmas';
  start: string;
  end: string;
  en: string;
  dev: string;
  note: string;
}
export const WINDOWS: PWindow[] = [
  { kind: 'kharmas', start: '2026-01-01', end: '2026-01-14', en: 'Dhanu Kharmas', dev: 'धनु खरमास (मलमास)', note: 'Sun in Sagittarius — no marriages or auspicious ceremonies. Ends at Makar Sankranti (14 Jan).' },
  { kind: 'kharmas', start: '2026-03-15', end: '2026-04-14', en: 'Meen Kharmas', dev: 'मीन खरमास', note: 'Sun in Pisces — no marriages or auspicious ceremonies. Ends at Mesha Sankranti (14 Apr).' },
  { kind: 'malmas', start: '2026-05-17', end: '2026-06-15', en: 'Adhik Maas (Malmas)', dev: 'अधिक मास (मलमास · पुरुषोत्तम मास)', note: 'The 2026 intercalary "extra" month (Adhik Jyeshtha). All saṃskāras are suspended; devotional worship is encouraged.' },
  { kind: 'chaturmas', start: '2026-07-25', end: '2026-11-20', en: 'Chaturmas', dev: 'चातुर्मास', note: 'From Devshayani Ekadashi (25 Jul) to Devuthana/Prabodhini Ekadashi (20 Nov) — Vishnu’s rest; weddings, upanayan, mundan and griha-pravesh pause.' },
  { kind: 'kharmas', start: '2026-12-16', end: '2026-12-31', en: 'Dhanu Kharmas', dev: 'धनु खरमास (मलमास)', note: 'Sun re-enters Sagittarius (16 Dec) — no marriages until Makar Sankranti, mid-Jan 2027.' },
];

// ── 12 Sankranti ──
export const SANKRANTI: PEvent[] = [
  { date: '2026-01-14', en: 'Makar Sankranti', dev: 'मकर संक्रांति', major: true, link: '/festivals/makar-sankranti/', note: 'Sun enters Capricorn; Uttarayan; end of Dhanu Kharmas.' },
  { date: '2026-02-13', en: 'Kumbh Sankranti', dev: 'कुम्भ संक्रांति' },
  { date: '2026-03-15', en: 'Meen Sankranti', dev: 'मीन संक्रांति', note: 'Begins Meen Kharmas.' },
  { date: '2026-04-14', en: 'Mesh Sankranti', dev: 'मेष संक्रांति', note: 'Maithil solar New Year; Satuain. End of Meen Kharmas.' },
  { date: '2026-05-15', en: 'Vrishabh Sankranti', dev: 'वृषभ संक्रांति' },
  { date: '2026-06-15', en: 'Mithun Sankranti', dev: 'मिथुन संक्रांति' },
  { date: '2026-07-16', en: 'Karka Sankranti', dev: 'कर्क संक्रांति', note: 'Dakshinayan begins.' },
  { date: '2026-08-17', en: 'Simha Sankranti', dev: 'सिंह संक्रांति' },
  { date: '2026-09-17', en: 'Kanya Sankranti', dev: 'कन्या संक्रांति', note: 'Vishwakarma Puja.' },
  { date: '2026-10-17', en: 'Tula Sankranti', dev: 'तुला संक्रांति' },
  { date: '2026-11-16', en: 'Vrishchik Sankranti', dev: 'वृश्चिक संक्रांति' },
  { date: '2026-12-16', en: 'Dhanu Sankranti', dev: 'धनु संक्रांति', note: 'Begins Dhanu Kharmas.' },
];

// ── 24 Ekadashi ──
export const EKADASHI: PEvent[] = [
  { date: '2026-01-14', en: 'Shattila Ekadashi', dev: 'षटतिला एकादशी' },
  { date: '2026-01-29', en: 'Jaya Ekadashi', dev: 'जया एकादशी' },
  { date: '2026-02-13', en: 'Vijaya Ekadashi', dev: 'विजया एकादशी' },
  { date: '2026-02-27', en: 'Amalaki Ekadashi', dev: 'आमलकी एकादशी' },
  { date: '2026-03-15', en: 'Papamochani Ekadashi', dev: 'पापमोचनी एकादशी' },
  { date: '2026-03-29', en: 'Kamada Ekadashi', dev: 'कामदा एकादशी' },
  { date: '2026-04-13', en: 'Varuthini Ekadashi', dev: 'वरूथिनी एकादशी' },
  { date: '2026-04-27', en: 'Mohini Ekadashi', dev: 'मोहिनी एकादशी' },
  { date: '2026-05-13', en: 'Apara Ekadashi', dev: 'अपरा एकादशी' },
  { date: '2026-05-27', en: 'Padmini (Adhik) Ekadashi', dev: 'पद्मिनी (अधिक) एकादशी' },
  { date: '2026-06-11', en: 'Parama (Adhik) Ekadashi', dev: 'परमा (अधिक) एकादशी' },
  { date: '2026-06-25', en: 'Nirjala Ekadashi', dev: 'निर्जला एकादशी', note: 'The most rigorous waterless Ekadashi.' },
  { date: '2026-07-10', en: 'Yogini Ekadashi', dev: 'योगिनी एकादशी' },
  { date: '2026-07-25', en: 'Devshayani Ekadashi', dev: 'देवशयनी एकादशी', major: true, note: 'Vishnu sleeps — Chaturmas begins; auspicious ceremonies pause.' },
  { date: '2026-08-09', en: 'Kamika Ekadashi', dev: 'कामिका एकादशी' },
  { date: '2026-08-23', en: 'Shravana Putrada Ekadashi', dev: 'श्रावण पुत्रदा एकादशी' },
  { date: '2026-09-07', en: 'Aja Ekadashi', dev: 'अजा एकादशी' },
  { date: '2026-09-22', en: 'Parivartini Ekadashi', dev: 'परिवर्तिनी एकादशी' },
  { date: '2026-10-06', en: 'Indira Ekadashi', dev: 'इन्दिरा एकादशी' },
  { date: '2026-10-22', en: 'Papankusha Ekadashi', dev: 'पापांकुशा एकादशी' },
  { date: '2026-11-05', en: 'Rama Ekadashi', dev: 'रमा एकादशी' },
  { date: '2026-11-20', en: 'Devuthana Ekadashi', dev: 'देवोत्थान (प्रबोधिनी) एकादशी', major: true, note: 'Vishnu wakes — Chaturmas ends; the wedding season reopens.' },
  { date: '2026-12-04', en: 'Utpanna Ekadashi', dev: 'उत्पन्ना एकादशी' },
  { date: '2026-12-20', en: 'Mokshada Ekadashi', dev: 'मोक्षदा एकादशी', note: 'Gita Jayanti.' },
];

// ── Festivals & vrats ──
export const FESTIVALS: PEvent[] = [
  { date: '2026-01-14', en: 'Makar Sankranti', dev: 'मकर संक्रांति', major: true, link: '/festivals/makar-sankranti/' },
  { date: '2026-01-23', en: 'Saraswati Puja (Vasant Panchami)', dev: 'सरस्वती पूजा · बसन्त पञ्चमी', major: true, link: '/festivals/saraswati-puja/', note: 'Vidyarambh — the classic day to begin a child’s learning.' },
  { date: '2026-02-15', en: 'Maha Shivaratri', dev: 'महाशिवरात्रि', major: true },
  { date: '2026-03-03', en: 'Holika Dahan (Sammat)', dev: 'होलिका दहन · सम्मत', link: '/festivals/phaguaa/', note: 'Eve of Holi; a possible lunar eclipse on 3 Mar may affect timings — verify.' },
  { date: '2026-03-04', en: 'Holi / Phaguaa', dev: 'होली · फगुआ', major: true, link: '/festivals/phaguaa/' },
  { date: '2026-03-19', en: 'Vikram Samvat 2083 begins', dev: 'विक्रम संवत् २०८३ आरम्भ', note: 'Chaitra Shukla Pratipada; Chaitra Navratri begins.' },
  { date: '2026-03-26', en: 'Ram Navami', dev: 'रामनवमी', major: true, link: '/festivals/ram-navami/' },
  { date: '2026-04-14', en: 'Satuain', dev: 'सतुआइन', link: '/festivals/jur-sital/', note: 'Eve of the Maithil New Year.' },
  { date: '2026-04-15', en: 'Jur Sital (Maithil New Year)', dev: 'जुड़ शीतल · मैथिल नव वर्ष', major: true, link: '/festivals/jur-sital/' },
  { date: '2026-04-19', en: 'Akshaya Tritiya', dev: 'अक्षय तृतीया', note: 'An abuja (self-auspicious) muhurat needing no other reckoning.' },
  { date: '2026-05-01', en: 'Buddha Purnima', dev: 'बुद्ध पूर्णिमा' },
  { date: '2026-05-16', en: 'Vat Savitri (Barsait)', dev: 'वट सावित्री · बरसाइत', major: true, link: '/festivals/vat-savitri/', note: 'Mithila keeps the vrat on Jyeshtha Amavasya.' },
  { date: '2026-05-26', en: 'Ganga Dussehra', dev: 'गंगा दशहरा' },
  { date: '2026-07-15', en: 'Jagannath Rath Yatra', dev: 'जगन्नाथ रथयात्रा' },
  { date: '2026-07-29', en: 'Guru Purnima', dev: 'गुरु पूर्णिमा', major: true },
  { date: '2026-08-04', endDate: '2026-08-15', en: 'Madhushravani (vrat)', dev: 'मधुश्रावणी', major: true, link: '/festivals/madhushravani/', note: 'The ~13-day newlywed women’s vrat; main puja ~15 Aug.' },
  { date: '2026-08-15', en: 'Naag Panchami', dev: 'नाग पञ्चमी', link: '/festivals/naag-panchami/' },
  { date: '2026-08-28', en: 'Raksha Bandhan', dev: 'रक्षाबन्धन', major: true, note: 'Shravana Purnima (27–28 Aug by Bhadra timing).' },
  { date: '2026-09-03', en: 'Krishna Janmashtami', dev: 'कृष्ण जन्माष्टमी', major: true, note: 'Smarta 3 Sep / Vaishnava 4 Sep.' },
  { date: '2026-09-14', en: 'Hartalika Teej', dev: 'हरितालिका तीज', note: '13–14 Sep by tithi at sunrise.' },
  { date: '2026-09-14', en: 'Ganesh Chaturthi', dev: 'गणेश चतुर्थी', major: true },
  { date: '2026-09-17', en: 'Vishwakarma Puja', dev: 'विश्वकर्मा पूजा', note: 'Fixed to Kanya Sankranti.' },
  { date: '2026-09-17', endDate: '2026-09-26', en: 'Indra Puja (Mithila)', dev: 'इन्द्र पूजा', link: '/festivals/indra-puja/', note: 'Approximate Bhadrapada window — confirm from a Maithil panchang.' },
  { date: '2026-09-27', endDate: '2026-10-10', en: 'Pitru Paksha (Shraddh)', dev: 'पितृ पक्ष · श्राद्ध', major: true, note: 'Ends at Mahalaya/Sarvapitri Amavasya (10 Oct).' },
  { date: '2026-10-03', en: 'Jitiya (Jivitputrika)', dev: 'जितिया · जिमूतवाहन', major: true, link: '/festivals/jitiya/' },
  { date: '2026-10-11', endDate: '2026-10-20', en: 'Jhijhiya (Navratri nights)', dev: 'झिझिया', link: '/festivals/jhijhiya/', note: 'Danced through the goddess’s nights.' },
  { date: '2026-10-11', en: 'Durga Puja — Ghatasthapana', dev: 'कलश स्थापना · दुर्गा पूजा', major: true, link: '/festivals/durga-puja/', note: 'Sharadiya Navratri Day 1 (11–12 Oct).' },
  { date: '2026-10-19', en: 'Maha Ashtami', dev: 'महाअष्टमी', link: '/festivals/durga-puja/' },
  { date: '2026-10-20', en: 'Maha Navami', dev: 'महानवमी', link: '/festivals/durga-puja/' },
  { date: '2026-10-20', en: 'Vijayadashami (Dashain)', dev: 'विजयादशमी · दशहरा', major: true, link: '/festivals/durga-puja/', note: '20–21 Oct by tithi; Dashain tika.' },
  { date: '2026-10-25', en: 'Kojagara (Sharad Purnima)', dev: 'कोजगरा · शरद पूर्णिमा', major: true, link: '/festivals/kojagara/', note: 'The Maithil son-in-law’s full-moon night (25–26 Oct).' },
  { date: '2026-11-08', en: 'Diwali (Lakshmi Puja)', dev: 'दीपावली · लक्ष्मी पूजा', major: true, note: 'Kartika Amavasya (8–9 Nov).' },
  { date: '2026-11-13', en: 'Chhath — Nahay-Khay', dev: 'छठ · नहाय-खाय', major: true, link: '/festivals/chhath/' },
  { date: '2026-11-14', en: 'Chhath — Kharna', dev: 'छठ · खरना', link: '/festivals/chhath/' },
  { date: '2026-11-15', en: 'Chhath — Sandhya Arghya', dev: 'छठ · सन्ध्या अर्घ्य', major: true, link: '/festivals/chhath/' },
  { date: '2026-11-16', en: 'Chhath — Usha Arghya', dev: 'छठ · उषा अर्घ्य', link: '/festivals/chhath/' },
  { date: '2026-11-16', endDate: '2026-11-24', en: 'Sama-Chakeva', dev: 'सामा-चकेवा', major: true, link: '/festivals/sama-chakeva/', note: 'Kartik Shukla Saptami to Kartik Purnima.' },
  { date: '2026-11-24', en: 'Kartik Purnima (Dev Diwali)', dev: 'कार्तिक पूर्णिमा · देव दीपावली' },
  { date: '2026-12-14', en: 'Vivah Panchami', dev: 'विवाह पञ्चमी', major: true, link: '/festivals/vivaha-panchami/', note: 'The Ram–Sita wedding day at Janakpur.' },
];

// ── Muhurat (auspicious ceremony dates) ──
// Merged from Drik Panchang (tithi/nakshatra-rich) + Maithili Patra. NO dates fall
// inside Kharmas, Adhik-Maas or Chaturmas (see WINDOWS) — that is why whole months
// are empty. Confirm the exact lagna with a pandit.
export interface MuhuratCat {
  key: string;
  en: string;
  dev: string;
  emoji: string;
  blurb: string;
  dates: string[];
  link?: string; // related ritual page
}
export const MUHURAT: MuhuratCat[] = [
  {
    key: 'vivah', en: 'Vivah (Marriage)', dev: 'विवाह', emoji: '💍',
    blurb: 'Auspicious wedding dates for 2026. None fall in Kharmas (mid-Dec–mid-Jan, mid-Mar–mid-Apr), Adhik-Maas (17 May–15 Jun) or Chaturmas (25 Jul–20 Nov).',
    link: '/rituals/maithil-vivah/',
    dates: [
      '2026-01-29',
      '2026-02-05', '2026-02-06', '2026-02-08', '2026-02-10', '2026-02-12', '2026-02-14', '2026-02-15', '2026-02-19', '2026-02-20', '2026-02-21', '2026-02-22', '2026-02-24', '2026-02-25', '2026-02-26',
      '2026-03-02', '2026-03-03', '2026-03-04', '2026-03-07', '2026-03-08', '2026-03-09', '2026-03-11', '2026-03-12', '2026-03-13',
      '2026-04-15', '2026-04-17', '2026-04-20', '2026-04-21', '2026-04-25', '2026-04-26', '2026-04-27', '2026-04-28', '2026-04-29', '2026-04-30',
      '2026-05-01', '2026-05-03', '2026-05-05', '2026-05-06', '2026-05-07', '2026-05-08', '2026-05-10', '2026-05-13', '2026-05-14',
      '2026-06-19', '2026-06-21', '2026-06-22', '2026-06-23', '2026-06-24', '2026-06-25', '2026-06-26', '2026-06-27', '2026-06-28', '2026-06-29',
      '2026-07-01', '2026-07-02', '2026-07-03', '2026-07-06', '2026-07-07', '2026-07-09', '2026-07-11', '2026-07-12',
      '2026-11-21', '2026-11-24', '2026-11-25', '2026-11-26',
      '2026-12-02', '2026-12-03', '2026-12-04', '2026-12-05', '2026-12-06', '2026-12-11', '2026-12-12',
    ],
  },
  {
    key: 'upanayan', en: 'Upanayan (Janeu)', dev: 'उपनयन · यज्ञोपवीत', emoji: '🧵',
    blurb: 'Sacred-thread muhurat. In Mithila these cluster Jan–mid-July (peaking around Basant Panchami); Chaturmas is avoided.',
    link: '/rituals/upanayan/',
    dates: [
      '2026-01-03', '2026-01-04', '2026-01-05', '2026-01-07', '2026-01-21', '2026-01-23', '2026-01-28', '2026-01-29', '2026-01-30',
      '2026-02-02', '2026-02-06', '2026-02-19', '2026-02-20', '2026-02-21', '2026-02-22',
      '2026-03-04', '2026-03-05', '2026-03-08',
      '2026-04-02', '2026-04-03', '2026-04-04', '2026-04-06', '2026-04-20',
      '2026-05-03', '2026-05-06', '2026-05-07',
      '2026-06-17', '2026-06-19', '2026-06-24',
      '2026-07-01', '2026-07-02', '2026-07-04', '2026-07-05', '2026-07-15', '2026-07-16', '2026-07-18', '2026-07-24',
    ],
  },
  {
    key: 'mundan', en: 'Mundan (Chudakarana)', dev: 'मुंडन · चूड़ाकरण', emoji: '✂️',
    blurb: 'First-tonsure muhurat. None Aug–Dec (Chaturmas, then Guru/Shukra combustion).',
    link: '/rituals/mundan/',
    dates: [
      '2026-01-20', '2026-01-21', '2026-01-22', '2026-01-31',
      '2026-02-06', '2026-02-11', '2026-02-12', '2026-02-18', '2026-02-26', '2026-02-27',
      '2026-03-05', '2026-03-06', '2026-03-16', '2026-03-17',
      '2026-04-21', '2026-04-22', '2026-04-23', '2026-04-29',
      '2026-05-04', '2026-05-09', '2026-05-11', '2026-05-12', '2026-05-14', '2026-05-15',
      '2026-06-17', '2026-06-24', '2026-06-25',
      '2026-07-02', '2026-07-09', '2026-07-15', '2026-07-20', '2026-07-21',
    ],
  },
  {
    key: 'gharbas', en: 'Gharbas (Griha Pravesh)', dev: 'घरबास · गृहप्रवेश', emoji: '🏠',
    blurb: 'Gharbas (घरबास) is the Maithil term for settling into / entering a home — the house-warming muhurat. (Drik Griha-Pravesh dates; confirm the Maithil list in the printed Mithila Panchang.)',
    dates: [
      '2026-02-06', '2026-02-11', '2026-02-19', '2026-02-20', '2026-02-21', '2026-02-25', '2026-02-26',
      '2026-03-04', '2026-03-05', '2026-03-06', '2026-03-09', '2026-03-13', '2026-03-14',
      '2026-04-20',
      '2026-05-04', '2026-05-08', '2026-05-13',
      '2026-06-24', '2026-06-26', '2026-06-27',
      '2026-07-01', '2026-07-02', '2026-07-06',
      '2026-11-11', '2026-11-14', '2026-11-20', '2026-11-21', '2026-11-25', '2026-11-26',
      '2026-12-02', '2026-12-03', '2026-12-04', '2026-12-11', '2026-12-12', '2026-12-18', '2026-12-19', '2026-12-30',
    ],
  },
];

export const PANCHANG_SOURCES = [
  { label: 'Drik Panchang — Darbhanga calendar, muhurat & ekadashi', url: 'https://www.drikpanchang.com/' },
  { label: 'Maithili Patra (पतरा) — patra.maithili.org.in', url: 'https://patra.maithili.org.in/' },
  { label: 'Vishwavidyalaya Panchang — KSDSU, Darbhanga (printed)', url: 'https://en.wikipedia.org/wiki/Kameshwar_Singh_Darbhanga_Sanskrit_University' },
];
