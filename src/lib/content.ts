import { getCollection, type CollectionKey } from 'astro:content';
import { DEFAULT_LOCALE, type Locale } from '../i18n/locales';
import { getSection } from './constants';

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

export interface RelatedCard {
  key: string;
  title: string;
  summary?: string;
  cover?: string;
  /** URL section the card links into (e.g. people, places, history). */
  urlSection: string;
  icon: string;
  /** Number of shared tags (ranking weight). */
  shared: number;
}

// Collections that have their own URL section. `articles` is handled separately
// because it routes by its per-entry `section` field (rituals/history/…).
const RELATED_COLLECTIONS: { collection: CollectionKey; urlSection: string }[] = [
  { collection: 'personalities', urlSection: 'people' },
  { collection: 'places', urlSection: 'places' },
  { collection: 'villages', urlSection: 'villages' },
  { collection: 'dishes', urlSection: 'cuisine' },
  { collection: 'artStyles', urlSection: 'art' },
  { collection: 'festivals', urlSection: 'festivals' },
];

function iconFor(urlSection: string): string {
  return getSection(urlSection)?.icon ?? 'fish';
}

/**
 * Cross-section "See also" suggestions ranked by number of shared tags.
 * Excludes the current entry; returns [] when the entry carries no tags.
 * Loads only entries in the requested language (with English fallback).
 */
export async function getRelatedEntries(
  lang: Locale,
  current: { key: string; tags?: string[]; urlSection: string },
  limit = 4
): Promise<RelatedCard[]> {
  const want = new Set((current.tags ?? []).map((t) => String(t).toLowerCase()));
  if (want.size === 0) return [];
  const countShared = (tags: string[] = []) =>
    tags.reduce((n, t) => n + (want.has(String(t).toLowerCase()) ? 1 : 0), 0);

  const out: RelatedCard[] = [];
  const consider = (e: any, urlSection: string) => {
    const key = e.data.slug;
    if (urlSection === current.urlSection && key === current.key) return;
    const shared = countShared(e.data.tags);
    if (shared > 0)
      out.push({
        key,
        title: e.data.title,
        summary: e.data.summary,
        cover: e.data.cover,
        urlSection,
        icon: iconFor(urlSection),
        shared,
      });
  };

  for (const { collection, urlSection } of RELATED_COLLECTIONS) {
    const entries = await getLocalizedEntries(collection, lang);
    for (const e of entries) consider(e, urlSection);
  }
  const articles = await getLocalizedEntries('articles', lang);
  for (const e of articles) consider(e, e.data.section);

  out.sort((a, b) => b.shared - a.shared || a.title.localeCompare(b.title));
  return out.slice(0, limit);
}
