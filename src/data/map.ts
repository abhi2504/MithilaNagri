// Data for the interactive Mithila map (offline SVG map of India + Nepal).
// Coordinates are approximate (schematic map). Points link to content pages
// where one exists; otherwise the detail panel shows the blurb only.

export interface MapType {
  color: string;
  label: string;
  emoji: string;
}

export const MAP_TYPES: Record<string, MapType> = {
  temple: { color: '#c8341e', label: 'Temple / pilgrimage', emoji: '🛕' },
  shakti: { color: '#a02817', label: 'Shakti-peetha', emoji: '🔱' },
  palace: { color: '#2e4374', label: 'Palace / fort', emoji: '🏰' },
  museum: { color: '#7a4fa0', label: 'Museum', emoji: '🖼️' },
  ghat: { color: '#2e7d8a', label: 'River-ghat', emoji: '🌊' },
  art: { color: '#e0a82e', label: 'Art village', emoji: '🎨' },
  town: { color: '#5b4636', label: 'Town / city', emoji: '🏙️' },
  village: { color: '#3e7c4f', label: 'Village', emoji: '🏡' },
  natural: { color: '#2e7d8a', label: 'Lake / sanctuary', emoji: '🌳' },
  venue: { color: '#d86b7e', label: 'Cultural venue', emoji: '🎭' },
  heritage: { color: '#8a6d3b', label: 'Ancient / Buddhist site', emoji: '🏛️' },
};

export type MapTypeKey = keyof typeof MAP_TYPES;

export interface MapPoint {
  id: string;
  name: string;
  type: MapTypeKey;
  lng: number;
  lat: number;
  blurb: string;
  img?: string; // media id
  link?: { section: string; slug: string };
}

export const MAP_POINTS: MapPoint[] = [
  // ── Janakpur & Nepal (Madhesh) ──
  { id: 'janaki-mandir', name: 'Janaki Mandir', type: 'temple', lng: 85.924, lat: 26.731, blurb: 'The grand marble temple of Sita at Janakpur — the spiritual heart of Mithila.', img: 'place-janaki', link: { section: 'places', slug: 'janaki-mandir' } },
  { id: 'janakpur', name: 'Janakpur', type: 'town', lng: 85.925, lat: 26.708, blurb: 'Capital of Nepal’s Madhesh province and the mythic capital of Videha.' },
  { id: 'matihani', name: 'Matihani', type: 'village', lng: 85.85, lat: 26.652, blurb: 'Site of the Matkor soil-gathering ritual on the Mithila Parikrama.', link: { section: 'villages', slug: 'matihani' } },
  { id: 'jaleshwar', name: 'Jaleshwar', type: 'town', lng: 85.80, lat: 26.652, blurb: 'Headquarters of Mahottari district, Nepal — grown around the Jaleshwarnath Mahadev temple.', link: { section: 'places', slug: 'jaleshwar-mahadev' } },
  { id: 'malangwa', name: 'Malangwa', type: 'town', lng: 85.563, lat: 26.862, blurb: 'Headquarters of Sarlahi district, Nepal.' },
  { id: 'siraha', name: 'Siraha', type: 'town', lng: 86.205, lat: 26.655, blurb: 'A Maithili-speaking district town of the Nepal Terai.' },
  { id: 'rajbiraj', name: 'Rajbiraj', type: 'town', lng: 86.747, lat: 26.543, blurb: 'Headquarters of Saptari district, easternmost Madhesh.' },
  { id: 'birgunj', name: 'Birgunj', type: 'town', lng: 84.88, lat: 27.01, blurb: 'The “gateway of Nepal” and its commercial capital, in Parsa district.' },
  { id: 'biratnagar', name: 'Biratnagar', type: 'town', lng: 87.28, lat: 26.45, blurb: 'A major eastern-Terai city; Eastern Maithili is widely spoken.' },
  { id: 'simraungadh', name: 'Simraungadh', type: 'heritage', lng: 84.95, lat: 27.01, blurb: 'Ruined capital of the Karnat dynasty (founded 1097) on the India–Nepal border.' },

  // ── Sitamarhi ──
  { id: 'punaura-dham', name: 'Punaura Dham', type: 'temple', lng: 85.44, lat: 26.59, blurb: 'Revered as the birthplace of Sita, where she rose from a furrow.', img: 'place-punaura', link: { section: 'places', slug: 'punaura-dham' } },
  { id: 'sitamarhi', name: 'Sitamarhi', type: 'town', lng: 85.49, lat: 26.595, blurb: 'District town built around the Sita-birthplace shrines.' },

  // ── Darbhanga ──
  { id: 'darbhanga-fort', name: 'Darbhanga Raj Fort', type: 'palace', lng: 85.902, lat: 26.171, blurb: 'The walled seat of the Darbhanga Raj — Rambagh, Nargona and Bela palaces.', img: 'place-darbhanga-palace', link: { section: 'places', slug: 'darbhanga-fort' } },
  { id: 'chandradhari', name: 'Chandradhari Museum', type: 'museum', lng: 85.905, lat: 26.158, blurb: 'A Darbhanga museum of Mithila miniatures, manuscripts and artefacts.' },
  { id: 'darbhanga', name: 'Darbhanga', type: 'town', lng: 85.897, lat: 26.152, blurb: 'The historic capital of Mithila and proposed capital of a Mithila state.' },
  { id: 'ahilya-asthan', name: 'Ahilya Asthan', type: 'temple', lng: 85.75, lat: 26.35, blurb: 'Where Rama’s touch is said to have freed Ahalya — among the oldest Ram-Janaki shrines.', link: { section: 'places', slug: 'ahilya-asthan' } },
  { id: 'kamtaul', name: 'Kamtaul', type: 'village', lng: 85.78, lat: 26.36, blurb: 'Railway gateway to Ahilya Asthan and the Gautam Ashram.', link: { section: 'villages', slug: 'kamtaul' } },
  { id: 'brahmpur', name: 'Brahmpur', type: 'village', lng: 85.781, lat: 26.351, blurb: 'Home of the Gautam Ashram and Mithila’s ancient school of Nyaya.', link: { section: 'villages', slug: 'brahmpur' } },
  { id: 'bahadurpur', name: 'Bahadurpur', type: 'village', lng: 85.95, lat: 26.17, blurb: 'Birthplace of the Padma Shri Madhubani painter Godavari Dutta.', link: { section: 'villages', slug: 'bahadurpur' } },
  { id: 'kusheshwar', name: 'Kusheshwar Asthan', type: 'natural', lng: 86.27, lat: 26.42, blurb: 'A Shiva shrine and bird sanctuary in the Kosi wetlands.' },

  // ── Madhubani ──
  { id: 'madhubani', name: 'Madhubani', type: 'town', lng: 86.071, lat: 26.355, blurb: 'The district that gave Mithila painting its world-famous name.' },
  { id: 'jitwarpur', name: 'Jitwarpur', type: 'art', lng: 86.09, lat: 26.345, blurb: 'The painting village of the Bharni style — home of Sita Devi and Baua Devi.', img: 'hero-madhubani', link: { section: 'villages', slug: 'jitwarpur' } },
  { id: 'ranti', name: 'Ranti', type: 'art', lng: 86.095, lat: 26.355, blurb: 'The painting village of the fine-line Katchni style.', img: 'art-asha-jha', link: { section: 'villages', slug: 'ranti' } },
  { id: 'bisfi', name: 'Bisfi', type: 'village', lng: 86.067, lat: 26.433, blurb: 'Birthplace of the poet Vidyapati.', link: { section: 'villages', slug: 'bisfi' } },
  { id: 'saurath', name: 'Saurath', type: 'village', lng: 86.03, lat: 26.37, blurb: 'Home of the Sabha Gachhi — Mithila’s historic marriage assembly.', link: { section: 'villages', slug: 'saurath' } },
  { id: 'rajnagar', name: 'Rajnagar Naulakha Palace', type: 'palace', lng: 86.083, lat: 26.417, blurb: 'The earthquake-ruined palace-town of Maharaja Rameshwar Singh.', link: { section: 'places', slug: 'rajnagar-naulakha-palace' } },
  { id: 'phulhar', name: 'Phulhar (Girija Sthan)', type: 'temple', lng: 86.00, lat: 26.60, blurb: 'Where, by legend, Rama and Sita first met in the flower garden.', link: { section: 'villages', slug: 'phulhar' } },
  { id: 'kapileshwar', name: 'Kapileshwar Sthan', type: 'temple', lng: 86.04, lat: 26.34, blurb: 'An ancient Shiva temple near Madhubani.' },
  { id: 'uchhaith', name: 'Uchhaith Bhagwati', type: 'shakti', lng: 86.13, lat: 26.45, blurb: 'A Durga shrine where the poet Kalidasa is said to have been blessed.' },
  { id: 'mithila-haat', name: 'Mithila Haat', type: 'venue', lng: 86.28, lat: 26.26, blurb: 'A cultural theme-park near Jhanjharpur — crafts, cuisine and performance.', link: { section: 'places', slug: 'mithila-haat' } },
  { id: 'andhratharhi', name: 'Andhra Tharhi', type: 'village', lng: 86.20, lat: 26.30, blurb: 'A historic block town of the Madhubani countryside.', link: { section: 'villages', slug: 'andhratharhi' } },
  { id: 'gehuma-bairiya', name: 'Gehuma Bairiya', type: 'village', lng: 86.397, lat: 26.392, blurb: 'A large gram-panchayat village of the Phulparas block in eastern Madhubani.', img: 'ai-gehuma-bairiya', link: { section: 'villages', slug: 'gehuma-bairiya' } },
  { id: 'siswar', name: 'Siswar', type: 'village', lng: 86.456, lat: 26.430, blurb: 'A Maithili farming village of the Phulparas block, near the Nepal border.', img: 'ai-siswar', link: { section: 'villages', slug: 'siswar' } },

  // ── Saharsa / Madhepura / Supaul (Kosi) ──
  { id: 'ugratara', name: 'Ugratara Sthan, Mahishi', type: 'shakti', lng: 86.47, lat: 25.983, blurb: 'A revered Shakti shrine — the only Ugratara temple in Bihar.', link: { section: 'places', slug: 'ugratara-mahishi' } },
  { id: 'mahishi', name: 'Mahishi', type: 'village', lng: 86.47, lat: 25.98, blurb: 'Home of the philosopher Mandan Mishra and the Ugratara shrine.', link: { section: 'villages', slug: 'mahishi' } },
  { id: 'saharsa', name: 'Saharsa', type: 'town', lng: 86.60, lat: 25.88, blurb: 'Divisional town of the Kosi region.' },
  { id: 'singheshwar', name: 'Singheshwar', type: 'temple', lng: 86.66, lat: 25.96, blurb: 'An ancient Shiva temple, the “Deoghar of the Kosi region”.' },
  { id: 'madhepura', name: 'Madhepura', type: 'town', lng: 86.79, lat: 25.92, blurb: 'A Kosi-region district town.' },
  { id: 'supaul', name: 'Supaul', type: 'town', lng: 86.60, lat: 26.13, blurb: 'A Kosi-region district town; birthplace of singer Udit Narayan nearby.' },

  // ── Samastipur / Muzaffarpur / Begusarai ──
  { id: 'samastipur', name: 'Samastipur', type: 'town', lng: 85.78, lat: 25.86, blurb: 'A district town; birthplace of Karpoori Thakur is nearby.' },
  { id: 'muzaffarpur', name: 'Muzaffarpur', type: 'town', lng: 85.39, lat: 26.12, blurb: 'The “Litchi kingdom”, a major town of western Mithila.' },
  { id: 'begusarai', name: 'Begusarai', type: 'town', lng: 86.13, lat: 25.42, blurb: 'Birthplace-district of the poet Ramdhari Singh Dinkar.' },
  { id: 'kanwar-lake', name: 'Kabar Taal (Kanwar Lake)', type: 'natural', lng: 86.18, lat: 25.55, blurb: 'Asia’s largest freshwater oxbow lake — a Ramsar wetland of migratory birds.' },

  // ── Buddhist / ancient (south & west) ──
  { id: 'vaishali', name: 'Vaishali', type: 'heritage', lng: 85.13, lat: 25.99, blurb: 'Ancient republic and Buddhist site — Ashoka’s lion pillar still stands.' },
  { id: 'kesaria', name: 'Kesaria Stupa', type: 'heritage', lng: 84.85, lat: 26.33, blurb: 'One of the world’s tallest Buddhist stupas, in East Champaran.' },

  // ── more temples, ghats & heritage ──
  { id: 'ram-mandir-janakpur', name: 'Ram Mandir, Janakpur', type: 'temple', lng: 85.927, lat: 26.726, blurb: 'A pagoda-style Ram temple of the 1700s — among Janakpur’s oldest shrines.' },
  { id: 'vivah-mandap', name: 'Vivah Mandap, Janakpur', type: 'temple', lng: 85.921, lat: 26.732, blurb: 'The marble pavilion marking the marriage of Rama and Sita.' },
  { id: 'ganga-sagar', name: 'Ganga Sagar, Janakpur', type: 'ghat', lng: 85.93, lat: 26.724, blurb: 'A sacred tank at Janakpur, central to its Chhath observance.' },
  { id: 'dhanushadham', name: 'Dhanushadham', type: 'temple', lng: 86.04, lat: 26.82, blurb: 'Where a fragment of Shiva’s broken bow is said to have fallen — a major Mithila pilgrimage in Dhanusha, Nepal.', link: { section: 'places', slug: 'dhanushadham' } },
  { id: 'salhesh', name: 'Salhesh Shrine, Mahisautha', type: 'temple', lng: 86.2, lat: 26.64, blurb: 'A shrine of Raja Salhesh, the egalitarian Dusadh folk-hero.' },
  { id: 'hariharnath', name: 'Hariharnath, Sonepur', type: 'temple', lng: 85.18, lat: 25.7, blurb: 'A Harihar temple at Sonepur, site of Asia’s famed cattle fair.' },
  { id: 'vishnupad', name: 'Vishnupad, Gaya', type: 'temple', lng: 84.99, lat: 24.78, blurb: 'Vishnu’s footprint shrine, the focus of the Pind-Daan rites.' },
  { id: 'gautam-asthan', name: 'Gautam Asthan', type: 'temple', lng: 85.79, lat: 26.36, blurb: 'Ashram of sage Gautama, tied to Mithila’s ancient school of logic.' },
  { id: 'lauriya', name: 'Lauriya Nandangarh', type: 'heritage', lng: 84.41, lat: 26.99, blurb: 'An Ashokan lion-pillar and great stupa-mounds in West Champaran.' },
  { id: 'areraj', name: 'Someshwar Nath, Areraj', type: 'temple', lng: 84.66, lat: 26.55, blurb: 'A revered ancient Shiva temple of the Champaran plains.' },
  { id: 'simaria-ghat', name: 'Simaria Ghat', type: 'ghat', lng: 86.13, lat: 25.43, blurb: 'A great Ganga bathing-ghat at Begusarai, site of a month-long Kalpvas.' },
  { id: 'rasidpur', name: 'Rasidpur', type: 'art', lng: 86.05, lat: 26.34, blurb: 'A Madhubani painting village near Jitwarpur.' },

  // ── newly added sites & literary villages ──
  { id: 'saurath-sabha', name: 'Saurath Sabha Gachhi', type: 'venue', lng: 86.041, lat: 26.394, blurb: 'The mango grove where Maithil Brahmins gathered for centuries to arrange marriages by the Panji genealogies.', link: { section: 'places', slug: 'saurath-sabha' } },
  { id: 'bisfi-dih', name: 'Bisfi Vidyapati Dih', type: 'heritage', lng: 86.06, lat: 26.44, blurb: 'The residence-mound of the poet Vidyapati at Bisfi, his ancestral village.', link: { section: 'places', slug: 'bisfi-vidyapati-dih' } },
  { id: 'kandaha-surya', name: 'Kandaha Surya Mandir', type: 'temple', lng: 86.47, lat: 25.86, blurb: 'A medieval black-stone Sun temple in Saharsa, with a finely carved Surya panel.', link: { section: 'places', slug: 'kandaha-surya-mandir' } },
  { id: 'salahesh-fulbari', name: 'Salahesh Fulbari', type: 'heritage', lng: 86.448, lat: 26.714, blurb: 'The legendary flower-garden of the folk-hero Raja Salhesh at Siraha, Nepal.', link: { section: 'places', slug: 'salahesh-fulbari' } },
  { id: 'tarauni', name: 'Tarauni', type: 'village', lng: 85.965, lat: 26.225, blurb: 'Ancestral village of the poet Nagarjun (Vaidyanath Mishra).', link: { section: 'villages', slug: 'tarauni' } },
  { id: 'kariyan', name: 'Kariyan', type: 'village', lng: 86.010, lat: 25.854, blurb: 'Traditional birthplace of the Nyaya logician Udayanacharya.', link: { section: 'villages', slug: 'kariyan' } },
  { id: 'mangrauni', name: 'Mangrauni', type: 'village', lng: 86.072, lat: 26.348, blurb: 'An old Maithil temple village near Madhubani, long a seat of astrology and scholarship.', link: { section: 'villages', slug: 'mangrauni' } },
  { id: 'lohna', name: 'Lohna', type: 'village', lng: 86.250, lat: 26.225, blurb: 'Birthplace of the medieval Maithili dramatist Umapati Upadhyaya.', link: { section: 'villages', slug: 'lohna' } },
];

export interface River {
  name: string;
  path: [number, number][]; // [lng, lat] north → south
}

export const RIVERS: River[] = [
  { name: 'Gandak', path: [[84.6, 27.3], [84.7, 26.6], [84.85, 26.0], [85.05, 25.6], [85.25, 25.35]] },
  { name: 'Budhi Gandak', path: [[84.95, 26.9], [85.25, 26.3], [85.6, 25.85], [85.95, 25.5]] },
  { name: 'Bagmati', path: [[85.35, 27.3], [85.45, 26.6], [85.65, 26.1], [85.95, 25.65]] },
  { name: 'Kamala', path: [[86.0, 27.0], [86.05, 26.5], [86.25, 26.1], [86.5, 25.85]] },
  { name: 'Kosi', path: [[86.95, 27.2], [86.95, 26.6], [86.9, 26.0], [87.0, 25.55], [87.2, 25.35]] },
  { name: 'Mahananda', path: [[88.0, 26.8], [87.9, 26.2], [87.75, 25.7], [87.6, 25.4]] },
];

export interface DistrictLabel {
  name: string;
  lng: number;
  lat: number;
}

export const DISTRICTS: DistrictLabel[] = [
  { name: 'Sitamarhi', lng: 85.45, lat: 26.7 },
  { name: 'Madhubani', lng: 86.2, lat: 26.55 },
  { name: 'Darbhanga', lng: 85.95, lat: 26.05 },
  { name: 'Samastipur', lng: 85.8, lat: 25.7 },
  { name: 'Muzaffarpur', lng: 85.3, lat: 26.3 },
  { name: 'Saharsa', lng: 86.55, lat: 25.7 },
  { name: 'Madhepura', lng: 86.85, lat: 26.05 },
  { name: 'Supaul', lng: 86.5, lat: 26.45 },
  { name: 'Begusarai', lng: 86.0, lat: 25.35 },
  { name: 'Dhanusha', lng: 86.0, lat: 26.85 },
  { name: 'Mahottari', lng: 85.75, lat: 26.85 },
  { name: 'Sarlahi', lng: 85.45, lat: 27.05 },
];

// Geographic bounds of the canvas.
export const BOUNDS = { lng0: 84.3, lng1: 88.1, lat0: 25.0, lat1: 27.45 };
