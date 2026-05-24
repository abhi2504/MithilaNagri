// Maithili glossary + phrasebook (seed). Devanagari · romanization · English.

export interface Term {
  deva: string;
  roman: string;
  en: string;
}
export interface TermGroup {
  title: string;
  terms: Term[];
}

export const GLOSSARY: TermGroup[] = [
  {
    title: 'Family',
    terms: [
      { deva: 'माय', roman: 'māy', en: 'mother' },
      { deva: 'बाबू', roman: 'bābū', en: 'father' },
      { deva: 'भाय', roman: 'bhāy', en: 'brother' },
      { deva: 'बहिन', roman: 'bahin', en: 'sister' },
      { deva: 'नाना', roman: 'nānā', en: 'maternal grandfather' },
      { deva: 'नानी', roman: 'nānī', en: 'maternal grandmother' },
      { deva: 'मामा', roman: 'māmā', en: 'maternal uncle' },
      { deva: 'बेटा', roman: 'beṭā', en: 'son' },
      { deva: 'बेटी', roman: 'beṭī', en: 'daughter' },
    ],
  },
  {
    title: 'Food & home',
    terms: [
      { deva: 'भात', roman: 'bhāt', en: 'cooked rice' },
      { deva: 'माछ', roman: 'māch', en: 'fish' },
      { deva: 'दूध', roman: 'dūdh', en: 'milk' },
      { deva: 'दही', roman: 'dahi', en: 'curd' },
      { deva: 'घी', roman: 'ghī', en: 'clarified butter' },
      { deva: 'अचार', roman: 'achār', en: 'pickle' },
      { deva: 'घर', roman: 'ghar', en: 'house' },
      { deva: 'पानि', roman: 'pāni', en: 'water' },
    ],
  },
  {
    title: 'Nature',
    terms: [
      { deva: 'सूरज', roman: 'sūraj', en: 'sun' },
      { deva: 'चान', roman: 'chān', en: 'moon' },
      { deva: 'नदी', roman: 'nadī', en: 'river' },
      { deva: 'गाछ', roman: 'gāch', en: 'tree' },
      { deva: 'फूल', roman: 'phūl', en: 'flower' },
      { deva: 'माटि', roman: 'māṭi', en: 'earth, soil' },
    ],
  },
  {
    title: 'Numbers 1–10',
    terms: [
      { deva: 'एक', roman: 'ek', en: 'one' },
      { deva: 'दू', roman: 'dū', en: 'two' },
      { deva: 'तीन', roman: 'tīn', en: 'three' },
      { deva: 'चारि', roman: 'chāri', en: 'four' },
      { deva: 'पाँच', roman: 'pā̃ch', en: 'five' },
      { deva: 'छह', roman: 'chhah', en: 'six' },
      { deva: 'सात', roman: 'sāt', en: 'seven' },
      { deva: 'आठ', roman: 'āṭh', en: 'eight' },
      { deva: 'नौ', roman: 'nau', en: 'nine' },
      { deva: 'दस', roman: 'das', en: 'ten' },
    ],
  },
];

export interface Phrase {
  deva: string;
  roman: string;
  en: string;
}

export const PHRASES: Phrase[] = [
  { deva: 'प्रणाम', roman: 'praṇām', en: 'Hello / greetings (respectful)' },
  { deva: 'अहाँ केहन छी?', roman: 'ahā̃ kehan chhī?', en: 'How are you?' },
  { deva: 'हम ठीक छी', roman: 'ham ṭhīk chhī', en: 'I am fine' },
  { deva: 'हमर नाम … थिक', roman: 'hamar nām … thik', en: 'My name is …' },
  { deva: 'धन्यवाद', roman: 'dhanyavād', en: 'Thank you' },
  { deva: 'हँ', roman: 'hã', en: 'Yes' },
  { deva: 'नै', roman: 'nai', en: 'No' },
  { deva: '… कतय अछि?', roman: '… katay achhi?', en: 'Where is …?' },
  { deva: 'ई कतेक मोल छै?', roman: 'ī katek mol chhai?', en: 'How much does this cost?' },
  { deva: 'हमरा बुझल नै गेल', roman: 'hamrā bujhal nai gel', en: "I didn't understand" },
  { deva: 'फेर भेंट होयत', roman: 'pher bheṇṭ hoyat', en: 'See you again' },
];

export interface CanonWork {
  year: string;
  author: string;
  work: string;
  note: string;
}

export const LITERARY_CANON: CanonWork[] = [
  {
    year: '1324',
    author: 'Jyotirishwar Thakur',
    work: 'Varna Ratnakara',
    note: 'The oldest Maithili prose — among the earliest prose in any modern Indian language.',
  },
  {
    year: 'c. 1400',
    author: 'Vidyapati',
    work: 'Padavali, Kirtilata',
    note: 'Lyric love-songs that made Maithili a literary language and inspired Bengal’s Vaishnavas and Tagore.',
  },
  {
    year: '17th c.',
    author: 'Govindadas',
    work: 'Padavali',
    note: 'A celebrated successor to Vidyapati in the devotional lyric tradition.',
  },
  {
    year: '1930',
    author: 'Harimohan Jha',
    work: 'Kanyadan',
    note: 'A landmark social novel — the “Vidyapati of modern Maithili prose”.',
  },
  {
    year: '1965–66',
    author: 'Sahitya Akademi',
    work: 'Recognition of Maithili',
    note: 'Maithili recognised as an independent literary language; first award to Yashodhar Jha (1966).',
  },
  {
    year: '20th c.',
    author: 'Nagarjun & Rajkamal Chaudhary',
    work: 'Modern poetry & fiction',
    note: 'The “People’s Poet” and the firebrand of new poetry carried Maithili into the modern age.',
  },
];
