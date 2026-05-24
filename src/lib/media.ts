// Central credited-media registry.
// Images are downloaded into /public/img (see scripts/fetch-images.mjs) and
// served from our own origin, so they never depend on a remote host at view
// time. Each entry keeps its Wikimedia Commons source for attribution.
// CreditedImage throws at build if an id is missing or flagged for takedown.
import { EXTRA_MEDIA } from './media-extra';
import { COMMONS_MEDIA } from './media-commons';
import { GEN_MEDIA } from './media-gen';
import { WIKI_MEDIA } from './media-wiki';
import { OPEN_MEDIA } from './media-open';
import { AI_MEDIA } from './media-ai';
import { ILLUS_MEDIA } from './media-illus';

export type License =
  | 'CC0'
  | 'CC-BY-4.0'
  | 'CC-BY-SA-4.0'
  | 'CC-BY-SA-3.0'
  | 'CC-BY-SA-2.0'
  | 'CC-BY-2.0'
  | 'public-domain'
  | 'unknown';

export type MediaStatus = 'cleared' | 'review' | 'takedown';

export interface MediaItem {
  src: string;
  alt: string;
  credit: {
    source: string;
    sourceUrl: string;
    author?: string;
    license: License;
  };
  status?: MediaStatus;
}

/** Local image + Wikimedia Commons attribution. id maps to /img/<id>.<ext>. */
function c(
  id: string,
  file: string,
  alt: string,
  opts: { ext?: string; author?: string; license?: License; status?: MediaStatus } = {}
): MediaItem {
  return {
    src: `/img/${id}.${opts.ext ?? 'jpg'}`,
    alt,
    credit: {
      source: 'Wikimedia Commons',
      sourceUrl: `https://commons.wikimedia.org/wiki/File:${file}`,
      author: opts.author,
      license: opts.license ?? 'CC-BY-SA-4.0',
    },
    status: opts.status ?? 'review',
  };
}

const BASE_MEDIA: Record<string, MediaItem> = {
  // Hero / region
  'hero-janaki': c('hero-janaki', 'Pano_of_Janaki_Mandir-Janakpur_Nepal-.jpg', 'Panorama of Janaki Mandir, the marble temple of Sita at Janakpur, Nepal'),
  'hero-madhubani': c('hero-madhubani', 'Madhubani_Mahavidyas.jpg', 'A Madhubani (Mithila) painting of the Mahavidyas'),
  'hero-chhath': c('hero-chhath', 'JanakpurChhathParvaFestival.jpg', 'Devotees during the Chhath festival at Janakpur'),

  // Art & Craft
  'art-madhubani-1': c('art-madhubani-1', 'Madhubani_Mahavidyas.jpg', 'Madhubani painting of the Mahavidyas'),
  'art-madhubani-2': c('art-madhubani-2', 'Mithila_Painting_at_Patna_Junction.jpg', 'Large Mithila painting mural at Patna Junction'),
  'art-asha-jha': c('art-asha-jha', 'Asha_Jha_Madhubani_Artist_Bihar.jpg', 'Madhubani artist Asha Jha of Bihar at work'),

  // History / Places
  'place-janaki': c('place-janaki', 'Janki_Mandir_alt_version.jpg', 'Janaki Mandir, Janakpur, Nepal'),
  'place-darbhanga-palace': c('place-darbhanga-palace', 'Old_Darbhanga_Raj_Palace-Damaged_by_earthquake.jpg', 'The old Darbhanga Raj palace, damaged in the 1934 earthquake'),
  'place-nargona': c('place-nargona', 'NargonaPalace.jpg', 'Nargona Palace, Darbhanga'),
  'place-palace-area': c('place-palace-area', 'Palacearea1.jpg', 'The Darbhanga Raj palace grounds'),
  'place-punaura': c('place-punaura', 'Punaura_Sitamarhi.jpg', 'Punaura Dham at Sitamarhi, revered as Sita’s birthplace'),

  // Festivals
  'festival-chhath': c('festival-chhath', 'Chhath_Puja_at_Basuki_Bihari_North.jpg', 'Chhath Puja offerings at a river ghat'),
  'festival-chhath-janakpur': c('festival-chhath-janakpur', 'JanakpurChhathParvaFestival.jpg', 'Chhath festival at Janakpur'),
  'festival-sama-chakeva': c('festival-sama-chakeva', 'Sama_Chakeva_Sarlahi_2.jpg', 'Clay birds and idols made for the Sama-Chakeva festival'),
  'festival-sama-chakeva-2': c('festival-sama-chakeva-2', 'Shama_Chakeva_characters28.jpg', 'Sama-Chakeva festival figures'),

  // Cuisine
  'food-makhana': c('food-makhana', 'Phool_Makhana.JPG', 'Makhana — the puffed fox-nut of Mithila'),
  'food-makhana-pond': c('food-makhana-pond', 'Makhanak_Pokhari.jpg', 'A makhana (fox-nut) cultivation pond in Mithila'),
  'food-thekua': c('food-thekua', 'Thekua_-_Chhath_Festival_-_Kolkata_2013-11-09_4316.JPG', 'Thekua, the wheat-and-jaggery sweet of Chhath'),

  // People
  'person-vidyapati': c('person-vidyapati', 'Statue_of_Maha_Kavi_Kokil_Vidyapati.jpg', 'Statue of the poet Vidyapati, the "Maithil Kavi Kokil"'),
  'person-sharda-sinha': c('person-sharda-sinha', 'Sharda_Sinha_%28cropped%29.jpg', 'Sharda Sinha, the "Bihar Kokila" folk singer'),
  'person-vidyapati-portrait': c('person-vidyapati-portrait', 'Vidyapati.jpg', 'A portrait of the poet Vidyapati', { license: 'public-domain' }),
  'person-karpoori': c('person-karpoori', 'Karpoori_Thakur_2024_stamp_of_India.jpg', 'Karpoori Thakur on a 2024 stamp of India', { author: 'India Post', license: 'public-domain' }),
  'person-manoj': c('person-manoj', 'Manoj_Bajpai_at_52nd_IFFI.jpg', 'The actor Manoj Bajpayee at the 52nd IFFI'),

  // Language
  'lang-tirhuta-inscription': c('lang-tirhuta-inscription', 'Tirhuta_Script_at_Mandar_Hills_of_Banka_District.jpg', 'A Tirhuta-script inscription at Mandar Hills'),
  'lang-tirhuta-chart': c('lang-tirhuta-chart', 'Tirhuta_aksharamala.png', 'The Tirhuta (Mithilakshar) alphabet chart', { ext: 'png' }),
};

// Merge auto-fetched Wikipedia/Commons images (scripts/fetch-wiki-images.mjs).
export const MEDIA: Record<string, MediaItem> = {
  ...BASE_MEDIA,
  ...(EXTRA_MEDIA as unknown as Record<string, MediaItem>),
  ...(COMMONS_MEDIA as unknown as Record<string, MediaItem>),
  ...(GEN_MEDIA as unknown as Record<string, MediaItem>),
  ...(WIKI_MEDIA as unknown as Record<string, MediaItem>),
  ...(OPEN_MEDIA as unknown as Record<string, MediaItem>),
  ...(AI_MEDIA as unknown as Record<string, MediaItem>),
  ...(ILLUS_MEDIA as unknown as Record<string, MediaItem>),
};

export class MissingCreditError extends Error {}

/** Resolve a media id. Throws if unknown or flagged for takedown. */
export function getMedia(id: string): MediaItem {
  const item = MEDIA[id];
  if (!item) {
    throw new MissingCreditError(
      `No credited media registered for id "${id}". Add it to src/lib/media.ts.`
    );
  }
  if (item.status === 'takedown') {
    throw new MissingCreditError(`Media "${id}" is flagged for takedown and cannot be rendered.`);
  }
  return item;
}

/** All media for the /credits page. */
export function allMedia(): Array<{ id: string } & MediaItem> {
  return Object.entries(MEDIA).map(([id, item]) => ({ id, ...item }));
}

export const LICENSE_URL: Record<License, string> = {
  CC0: 'https://creativecommons.org/publicdomain/zero/1.0/',
  'CC-BY-4.0': 'https://creativecommons.org/licenses/by/4.0/',
  'CC-BY-SA-4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
  'CC-BY-SA-3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
  'CC-BY-SA-2.0': 'https://creativecommons.org/licenses/by-sa/2.0/',
  'CC-BY-2.0': 'https://creativecommons.org/licenses/by/2.0/',
  'public-domain': 'https://en.wikipedia.org/wiki/Public_domain',
  unknown: '',
};
