// "On this day in Mithila / Bihar" — calendar-date-anchored historical notes
// surfaced in the Panchang's day view. Keyed by Gregorian MM-DD. Only firmly
// datable, well-established entries are included (medieval figures such as
// Vidyapati have debated dates and are deliberately omitted). Extend over time.

export interface HistDate {
  md: string; // 'MM-DD'
  y?: number;
  en: string;
  dev?: string;
}

export const HISTORY_DATES: HistDate[] = [
  { md: '01-03', y: 1975, en: 'Lalit Narayan Mishra, Union Railway Minister from Saharsa (Mithila), died in a bomb blast at Samastipur. LNMU, Darbhanga is named after him.', dev: 'ललित नारायण मिश्र (मिथिलाक रेल मन्त्री) क निधन — समस्तीपुर बम विस्फोटमे।' },
  { md: '01-15', y: 1934, en: 'The Great Nepal–Bihar earthquake (M8.0) devastated Darbhanga, Madhubani and the Mithila plains — one of the deadliest in the region’s history.', dev: 'महाविनाशकारी नेपाल–बिहार भूकम्प — दरभंगा, मधुबनी आ समस्त मिथिला तबाह।' },
  { md: '01-24', y: 1924, en: 'Karpoori Thakur, “Jannayak” and two-time Chief Minister of Bihar (Bharat Ratna, 2024), was born in Pitaunjhia (now Karpoori Gram), Samastipur.', dev: 'जननायक कर्पूरी ठाकुर (बिहारक मुख्यमन्त्री, भारत रत्न) क जन्म — समस्तीपुर।' },
  { md: '02-02', y: 1923, en: 'Lalit Narayan Mishra, the Maithil statesman, was born in Balua Bazar, Saharsa.', dev: 'ललित नारायण मिश्र क जन्म — सहरसा।' },
  { md: '02-17', y: 1988, en: 'Karpoori Thakur, champion of the backward classes and prohibition, died.', dev: 'जननायक कर्पूरी ठाकुर क निधन।' },
  { md: '02-28', y: 1963, en: 'Dr. Rajendra Prasad, the first President of India (born in Bihar), died at Patna.', dev: 'भारतक प्रथम राष्ट्रपति डॉ. राजेन्द्र प्रसाद क निधन — पटना।' },
  { md: '03-04', y: 1921, en: 'Phanishwar Nath “Renu”, author of Maila Anchal and chronicler of the Kosi-Mithila countryside, was born in Aurahi Hingna, Araria.', dev: 'आँचलिक कथाकार फणीश्वर नाथ रेणु क जन्म — अररिया।' },
  { md: '03-22', y: 1912, en: 'The Province of Bihar was carved out of the Bengal Presidency — observed every year as Bihar Diwas.', dev: 'बिहार प्रान्तक स्थापना — बिहार दिवस।' },
  { md: '04-11', y: 1977, en: 'Phanishwar Nath “Renu” died.', dev: 'फणीश्वर नाथ रेणु क निधन।' },
  { md: '04-24', y: 1974, en: 'Ramdhari Singh “Dinkar”, the Rashtrakavi, died.', dev: 'राष्ट्रकवि रामधारी सिंह दिनकर क निधन।' },
  { md: '04-26', y: 1858, en: 'Veer Kunwar Singh, the octogenarian leader of the 1857 revolt in Bihar, died at Jagdishpur.', dev: 'वीर कुँवर सिंह (१८५७ क क्रान्तिनायक) क निधन।' },
  { md: '06-30', y: 1911, en: 'Baba Nagarjun (Vaidyanath Mishra), the great Maithili–Hindi poet, was born in Tarauni, Darbhanga.', dev: 'मैथिली-हिन्दीक महाकवि बाबा नागार्जुन (वैद्यनाथ मिश्र) क जन्म — तरौनी, दरभंगा।' },
  { md: '08-21', y: 1988, en: 'A strong earthquake (M6.9) on the Nepal–Bihar border again struck the Mithila region.', dev: 'नेपाल–बिहार सीमा पर प्रबल भूकम्प — मिथिला क्षेत्र प्रभावित।' },
  { md: '09-23', y: 1908, en: 'Ramdhari Singh “Dinkar”, the Rashtrakavi of Simaria (Begusarai), was born.', dev: 'राष्ट्रकवि रामधारी सिंह दिनकर क जन्म — सिमरिया, बेगूसराय।' },
  { md: '10-01', y: 1952, en: 'Sharda Sinha, the “Bihar Kokila” whose voice defined Chhath, was born in Supaul.', dev: 'बिहार कोकिला शारदा सिन्हा क जन्म — सुपौल।' },
  { md: '10-08', y: 1979, en: 'Jayaprakash Narayan (“JP”), leader of the Total Revolution, died.', dev: 'लोकनायक जयप्रकाश नारायण क निधन।' },
  { md: '10-11', y: 1902, en: 'Jayaprakash Narayan (“JP”) was born at Sitabdiara, on the Bihar–UP border.', dev: 'लोकनायक जयप्रकाश नारायण क जन्म — सिताबदियारा।' },
  { md: '11-05', y: 1998, en: 'Baba Nagarjun, the wandering people’s poet, died.', dev: 'जनकवि बाबा नागार्जुन क निधन।' },
  { md: '11-05', y: 2024, en: 'Sharda Sinha died — on the eve of Chhath, the festival her songs are inseparable from.', dev: 'शारदा सिन्हा क निधन — छठक साँझमे, जाहि पाबनिक हुनक स्वर पर्याय छल।' },
  { md: '11-15', y: 2000, en: 'Jharkhand was separated from Bihar, reshaping the state’s map.', dev: 'बिहार सं झारखण्ड अलग भेल।' },
  { md: '11-28', y: 1907, en: 'Maharajadhiraj Kameshwar Singh of Darbhanga — philanthropist and founder of the Kameshwar Singh Darbhanga Sanskrit University — was born.', dev: 'दरभंगा महाराजाधिराज कामेश्वर सिंह क जन्म — संस्कृत विश्वविद्यालयक संस्थापक।' },
  { md: '12-03', y: 1884, en: 'Dr. Rajendra Prasad, free India’s first President, was born at Ziradei, Siwan.', dev: 'डॉ. राजेन्द्र प्रसाद क जन्म — जीरादेई, सिवान।' },
];
