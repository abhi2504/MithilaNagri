import { getCollection, type CollectionKey } from 'astro:content';
import { DEFAULT_LOCALE, type Locale } from '../i18n/locales';

const isProd = import.meta.env.PROD;

function keyOf(entry: any): string {
  return entry.data?.slug ?? entry.data?.id ?? entry.id;
}
function langOf(entry: any): Locale {
  return (entry.data?.lang as Locale) ?? DEFAULT_LOCALE;
}
function isDraft(entry: any): boolean {
  return Boolean(entry.data?.draft);
}

/**
 * Return one entry per translationKey, preferring the requested language and
 * falling back to English (then any). Drafts are dropped in production.
 */
export async function getLocalizedEntries<C extends CollectionKey>(
  collection: C,
  lang: Locale
) {
  const all = await getCollection(collection);
  const groups = new Map<string, any[]>();
  for (const e of all) {
    const k = keyOf(e);
    (groups.get(k) ?? groups.set(k, []).get(k)!).push(e);
  }
  const out: any[] = [];
  for (const entries of groups.values()) {
    const pick =
      entries.find((e) => langOf(e) === lang) ??
      entries.find((e) => langOf(e) === DEFAULT_LOCALE) ??
      entries[0];
    if (pick && !(isProd && isDraft(pick))) out.push(pick);
  }
  return out.sort(byOrderThenTitle);
}

/** A single entry by translationKey, language-aware with English fallback. */
export async function getLocalizedEntry<C extends CollectionKey>(
  collection: C,
  slug: string,
  lang: Locale
) {
  const all = await getCollection(collection);
  const matches = all.filter((e) => keyOf(e) === slug);
  if (matches.length === 0) return undefined;
  return (
    matches.find((e) => langOf(e) === lang) ??
    matches.find((e) => langOf(e) === DEFAULT_LOCALE) ??
    matches[0]
  );
}

/** Distinct translationKeys in a collection (for getStaticPaths). */
export async function getEntryKeys<C extends CollectionKey>(collection: C) {
  const all = await getCollection(collection);
  return [...new Set(all.map(keyOf))];
}

function byOrderThenTitle(a: any, b: any): number {
  const oa = a.data?.order ?? 9999;
  const ob = b.data?.order ?? 9999;
  if (oa !== ob) return oa - ob;
  const ta = a.data?.title ?? '';
  const tb = b.data?.title ?? '';
  return String(ta).localeCompare(String(tb));
}
