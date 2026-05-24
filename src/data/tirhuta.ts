// Tirhuta (Mithilakshar) script data + a Devanagari → Tirhuta transliteration map.
// Used by the Language section's alphabet chart and live transliterator.

export interface Glyph {
  deva: string;
  tirhuta: string;
  roman: string;
  code: string; // Unicode codepoint of the Tirhuta glyph
}

export const VOWELS: Glyph[] = [
  { deva: 'अ', tirhuta: '𑒁', roman: 'a', code: 'U+11481' },
  { deva: 'आ', tirhuta: '𑒂', roman: 'ā', code: 'U+11482' },
  { deva: 'इ', tirhuta: '𑒃', roman: 'i', code: 'U+11483' },
  { deva: 'ई', tirhuta: '𑒄', roman: 'ī', code: 'U+11484' },
  { deva: 'उ', tirhuta: '𑒅', roman: 'u', code: 'U+11485' },
  { deva: 'ऊ', tirhuta: '𑒆', roman: 'ū', code: 'U+11486' },
  { deva: 'ऋ', tirhuta: '𑒇', roman: 'ṛ', code: 'U+11487' },
  { deva: 'ए', tirhuta: '𑒊', roman: 'e', code: 'U+1148A' },
  { deva: 'ऐ', tirhuta: '𑒋', roman: 'ai', code: 'U+1148B' },
  { deva: 'ओ', tirhuta: '𑒌', roman: 'o', code: 'U+1148C' },
  { deva: 'औ', tirhuta: '𑒍', roman: 'au', code: 'U+1148D' },
];

export const CONSONANTS: Glyph[] = [
  { deva: 'क', tirhuta: '𑒏', roman: 'ka', code: 'U+1148F' },
  { deva: 'ख', tirhuta: '𑒐', roman: 'kha', code: 'U+11490' },
  { deva: 'ग', tirhuta: '𑒑', roman: 'ga', code: 'U+11491' },
  { deva: 'घ', tirhuta: '𑒒', roman: 'gha', code: 'U+11492' },
  { deva: 'ङ', tirhuta: '𑒓', roman: 'ṅa', code: 'U+11493' },
  { deva: 'च', tirhuta: '𑒔', roman: 'ca', code: 'U+11494' },
  { deva: 'छ', tirhuta: '𑒕', roman: 'cha', code: 'U+11495' },
  { deva: 'ज', tirhuta: '𑒖', roman: 'ja', code: 'U+11496' },
  { deva: 'झ', tirhuta: '𑒗', roman: 'jha', code: 'U+11497' },
  { deva: 'ञ', tirhuta: '𑒘', roman: 'ña', code: 'U+11498' },
  { deva: 'ट', tirhuta: '𑒙', roman: 'ṭa', code: 'U+11499' },
  { deva: 'ठ', tirhuta: '𑒚', roman: 'ṭha', code: 'U+1149A' },
  { deva: 'ड', tirhuta: '𑒛', roman: 'ḍa', code: 'U+1149B' },
  { deva: 'ढ', tirhuta: '𑒜', roman: 'ḍha', code: 'U+1149C' },
  { deva: 'ण', tirhuta: '𑒝', roman: 'ṇa', code: 'U+1149D' },
  { deva: 'त', tirhuta: '𑒞', roman: 'ta', code: 'U+1149E' },
  { deva: 'थ', tirhuta: '𑒟', roman: 'tha', code: 'U+1149F' },
  { deva: 'द', tirhuta: '𑒠', roman: 'da', code: 'U+114A0' },
  { deva: 'ध', tirhuta: '𑒡', roman: 'dha', code: 'U+114A1' },
  { deva: 'न', tirhuta: '𑒢', roman: 'na', code: 'U+114A2' },
  { deva: 'प', tirhuta: '𑒣', roman: 'pa', code: 'U+114A3' },
  { deva: 'फ', tirhuta: '𑒤', roman: 'pha', code: 'U+114A4' },
  { deva: 'ब', tirhuta: '𑒥', roman: 'ba', code: 'U+114A5' },
  { deva: 'भ', tirhuta: '𑒦', roman: 'bha', code: 'U+114A6' },
  { deva: 'म', tirhuta: '𑒧', roman: 'ma', code: 'U+114A7' },
  { deva: 'य', tirhuta: '𑒨', roman: 'ya', code: 'U+114A8' },
  { deva: 'र', tirhuta: '𑒩', roman: 'ra', code: 'U+114A9' },
  { deva: 'ल', tirhuta: '𑒪', roman: 'la', code: 'U+114AA' },
  { deva: 'व', tirhuta: '𑒫', roman: 'va', code: 'U+114AB' },
  { deva: 'श', tirhuta: '𑒬', roman: 'śa', code: 'U+114AC' },
  { deva: 'ष', tirhuta: '𑒭', roman: 'ṣa', code: 'U+114AD' },
  { deva: 'स', tirhuta: '𑒮', roman: 'sa', code: 'U+114AE' },
  { deva: 'ह', tirhuta: '𑒯', roman: 'ha', code: 'U+114AF' },
];

export const DIGITS: Glyph[] = [
  { deva: '०', tirhuta: '𑓐', roman: '0', code: 'U+114D0' },
  { deva: '१', tirhuta: '𑓑', roman: '1', code: 'U+114D1' },
  { deva: '२', tirhuta: '𑓒', roman: '2', code: 'U+114D2' },
  { deva: '३', tirhuta: '𑓓', roman: '3', code: 'U+114D3' },
  { deva: '४', tirhuta: '𑓔', roman: '4', code: 'U+114D4' },
  { deva: '५', tirhuta: '𑓕', roman: '5', code: 'U+114D5' },
  { deva: '६', tirhuta: '𑓖', roman: '6', code: 'U+114D6' },
  { deva: '७', tirhuta: '𑓗', roman: '7', code: 'U+114D7' },
  { deva: '८', tirhuta: '𑓘', roman: '8', code: 'U+114D8' },
  { deva: '९', tirhuta: '𑓙', roman: '9', code: 'U+114D9' },
];

// Dependent vowel signs (matras), virama and nasal marks — needed so the
// transliterator can render real words, not just isolated letters.
const SIGNS: Array<[string, string]> = [
  ['ा', '\u{114B0}'],
  ['ि', '\u{114B1}'],
  ['ी', '\u{114B2}'],
  ['ु', '\u{114B3}'],
  ['ू', '\u{114B4}'],
  ['ृ', '\u{114B5}'],
  ['े', '\u{114B9}'],
  ['ै', '\u{114BB}'],
  ['ो', '\u{114BC}'],
  ['ौ', '\u{114BE}'],
  ['्', '\u{114C2}'], // virama
  ['ं', '\u{114C0}'], // anusvara
  ['ँ', '\u{114FF}'], // candrabindu
];

/** Devanagari character → Tirhuta character map. */
export const TRANSLITERATE_MAP: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const g of [...VOWELS, ...CONSONANTS, ...DIGITS]) m[g.deva] = g.tirhuta;
  for (const [d, t] of SIGNS) m[d] = t;
  return m;
})();

/** Transliterate a Devanagari string to Tirhuta (character mapping; the font
 *  shapes conjuncts via the virama). Unmapped characters pass through. */
export function toTirhuta(input: string): string {
  let out = '';
  for (const ch of input) out += TRANSLITERATE_MAP[ch] ?? ch;
  return out;
}
