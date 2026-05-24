import type { Locale } from '../i18n/locales';

export interface SectionDef {
  /** URL slug under /[lang]/ */
  id: string;
  /** Icon name resolved by the Icon component. */
  icon: string;
  /** Section accent (CSS color value). */
  accent: string;
  /** Whether the section is fully built (vs. an expanding stub). */
  flagship: boolean;
  labels: Record<Locale, string>;
  /** Optional shorter labels for the nav (falls back to labels). */
  nav?: Partial<Record<Locale, string>>;
  blurbs: Record<Locale, string>;
}

/** The 11 content pillars. Order = nav order. */
export const SECTIONS: SectionDef[] = [
  {
    id: 'history',
    icon: 'temple',
    accent: '#2e4374',
    flagship: true,
    labels: { en: 'History', hi: 'इतिहास', mai: 'इतिहास' },
    blurbs: {
      en: 'From the Videha kingdom and King Janaka to the Karnat, Oiniwar and Darbhanga dynasties.',
      hi: 'विदेह राज्य और राजा जनक से लेकर कर्णाट, ओइनवार और दरभंगा राजवंश तक।',
      mai: 'विदेह राज्य आ राजा जनक सँ कर्णाट, ओइनवार आ दरभंगा राजवंश धरि।',
    },
  },
  {
    id: 'art',
    icon: 'lotus',
    accent: '#c8341e',
    flagship: true,
    labels: { en: 'Art & Craft', hi: 'कला और शिल्प', mai: 'कला आ शिल्प' },
    nav: { en: 'Art', hi: 'कला', mai: 'कला' },
    blurbs: {
      en: 'Madhubani painting — Bharni, Katchni, Godna, Kohbar — plus Sikki, Sujani and the artists who carry it.',
      hi: 'मधुबनी चित्रकला — भरनी, कचनी, गोदना, कोहबर — और सिक्की, सुजनी एवं इसके कलाकार।',
      mai: 'मधुबनी चित्रकला — भरनी, कचनी, गोदना, कोहबर — आ सिक्की, सुजनी आ ओकर कलाकार।',
    },
  },
  {
    id: 'language',
    icon: 'script',
    accent: '#e0a82e',
    flagship: false,
    labels: { en: 'Language', hi: 'भाषा', mai: 'भाषा' },
    blurbs: {
      en: 'Maithili, the Tirhuta (Mithilakshar) script, Vidyapati, and the Panji genealogies.',
      hi: 'मैथिली, तिरहुता (मिथिलाक्षर) लिपि, विद्यापति और पंजी वंशावली।',
      mai: 'मैथिली, तिरहुता (मिथिलाक्षर) लिपि, विद्यापति आ पंजी वंशावली।',
    },
  },
  {
    id: 'festivals',
    icon: 'sun',
    accent: '#d86b7e',
    flagship: true,
    labels: { en: 'Festivals', hi: 'पर्व-त्योहार', mai: 'पाबनि-तिहार' },
    blurbs: {
      en: 'Chhath, Sama-Chakeva, Jur Sital, Kojagara and the rhythm of the Maithil year.',
      hi: 'छठ, सामा-चकेवा, जुड़ शीतल, कोजागरा और मैथिल वर्ष की लय।',
      mai: 'छठि, सामा-चकेबा, जुड़शीतल, कोजागरा आ मैथिल वर्षक ताल।',
    },
  },
  {
    id: 'rituals',
    icon: 'kohbar',
    accent: '#a02817',
    flagship: false,
    labels: { en: 'Rituals & Customs', hi: 'रीति-रिवाज', mai: 'रीति-रेवाज' },
    nav: { en: 'Rituals', hi: 'रीति', mai: 'रीति' },
    blurbs: {
      en: 'Maithil Vivah, Upanayan, Mundan, the Kohbar chamber and the Panji marriage system.',
      hi: 'मैथिल विवाह, उपनयन, मुंडन, कोहबर और पंजी विवाह प्रणाली।',
      mai: 'मैथिल विवाह, उपनयन, मुंडन, कोहबर आ पंजी विवाह प्रणाली।',
    },
  },
  {
    id: 'cuisine',
    icon: 'pot',
    accent: '#3e7c4f',
    flagship: true,
    labels: { en: 'Cuisine', hi: 'व्यंजन', mai: 'भोजन' },
    blurbs: {
      en: 'Makhana, thekua, dahi-chura, tarua and the proverb: Maachh, Paan, Makhaan.',
      hi: 'मखाना, ठेकुआ, दही-चूड़ा, तरुआ और कहावत: माछ, पान, मखान।',
      mai: 'मखान, ठेकुआ, दही-चूड़ा, तरुआ आ कहबी: माछ, पान, मखान।',
    },
  },
  {
    id: 'places',
    icon: 'arch',
    accent: '#2e4374',
    flagship: true,
    labels: { en: 'Places & Tourism', hi: 'स्थल और पर्यटन', mai: 'स्थान आ पर्यटन' },
    nav: { en: 'Places', hi: 'स्थल', mai: 'स्थान' },
    blurbs: {
      en: 'Janakpur, Sitamarhi, Darbhanga, Ugratara and the 15-day Mithila Parikrama circuit.',
      hi: 'जनकपुर, सीतामढ़ी, दरभंगा, उग्रतारा और 15-दिवसीय मिथिला परिक्रमा।',
      mai: 'जनकपुर, सीतामढ़ी, दरभंगा, उग्रतारा आ 15-दिनक मिथिला परिक्रमा।',
    },
  },
  {
    id: 'people',
    icon: 'person',
    accent: '#e0a82e',
    flagship: true,
    labels: { en: 'People', hi: 'विभूतियाँ', mai: 'विभूति' },
    blurbs: {
      en: 'From sage Yajnavalkya and Vidyapati to Sharda Sinha, Karpoori Thakur and Manoj Bajpayee.',
      hi: 'ऋषि याज्ञवल्क्य और विद्यापति से शारदा सिन्हा, कर्पूरी ठाकुर और मनोज बाजपेयी तक।',
      mai: 'ऋषि याज्ञवल्क्य आ विद्यापति सँ शारदा सिन्हा, कर्पूरी ठाकुर आ मनोज बाजपेयी धरि।',
    },
  },
  {
    id: 'living-culture',
    icon: 'peacock',
    accent: '#d86b7e',
    flagship: false,
    labels: { en: 'Living Culture', hi: 'जीवंत संस्कृति', mai: 'जीवंत संस्कृति' },
    nav: { en: 'Culture', hi: 'संस्कृति', mai: 'संस्कृति' },
    blurbs: {
      en: 'Maithili cinema, folk music, Salhesh and Gonu Jha tales, and the statehood movement.',
      hi: 'मैथिली सिनेमा, लोक संगीत, सलहेस और गोनू झा की कथाएँ, और राज्य आंदोलन।',
      mai: 'मैथिली सिनेमा, लोक संगीत, सलहेस आ गोनू झाक कथा, आ राज्य आन्दोलन।',
    },
  },
  {
    id: 'villages',
    icon: 'hut',
    accent: '#3e7c4f',
    flagship: false,
    labels: { en: 'Villages', hi: 'गाँव', mai: 'गाम' },
    blurbs: {
      en: 'A growing, mappable directory — Bisfi, Jitwarpur, Saurath and beyond.',
      hi: 'एक बढ़ती हुई, मानचित्र-योग्य निर्देशिका — बिस्फी, जितवारपुर, सौराठ और आगे।',
      mai: 'एक बढ़ैत, नक्शा-योग्य सूची — बिस्फी, जितवारपुर, सौराठ आ ओहि सँ आगाँ।',
    },
  },
  {
    id: 'discover',
    icon: 'fish',
    accent: '#c8341e',
    flagship: false,
    labels: { en: 'Discover', hi: 'खोजें', mai: 'खोजू' },
    blurbs: {
      en: 'What and where is Mithila — an interactive map and surprising facts.',
      hi: 'मिथिला क्या और कहाँ है — एक इंटरैक्टिव मानचित्र और रोचक तथ्य।',
      mai: 'मिथिला की आ कतय अछि — एक इंटरैक्टिव नक्शा आ रोचक तथ्य।',
    },
  },
];

export function getSection(id: string): SectionDef | undefined {
  return SECTIONS.find((s) => s.id === id);
}

/** Nav order for the header (Discover first). */
export const NAV_ORDER = [
  'discover',
  'history',
  'art',
  'language',
  'festivals',
  'rituals',
  'cuisine',
  'places',
  'people',
  'living-culture',
  'villages',
];

export const SITE_NAME = 'Mithila';
/** Tirhuta-script wordmark "Mithila" (𑒧𑒱𑒟𑒱𑒪𑒰). */
export const SITE_NAME_TIRHUTA = '𑒧𑒱𑒟𑒱𑒪𑒰';
