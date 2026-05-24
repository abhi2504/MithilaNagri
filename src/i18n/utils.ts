import { DEFAULT_LOCALE, isLocale, type Locale } from './locales';
import { UI, type UIKey } from './ui';

/** Read the active locale from a URL's first path segment. */
export function getLangFromUrl(url: URL): Locale {
  const seg = url.pathname.split('/').filter(Boolean)[0];
  return seg && isLocale(seg) ? seg : DEFAULT_LOCALE;
}

/** Returns a translator that falls back to English for missing keys. */
export function useTranslations(lang: Locale) {
  return function t(key: UIKey): string {
    return (UI[lang] as Record<string, string>)[key] ?? UI[DEFAULT_LOCALE][key] ?? key;
  };
}

/** Build a locale-prefixed path: localizedPath('hi', '/art') → '/hi/art'. */
export function localizedPath(lang: Locale, path = '/'): string {
  const clean = '/' + path.replace(/^\/+/, '');
  return clean === '/' ? `/${lang}/` : `/${lang}${clean}`;
}

/** Remove a leading locale segment, returning the bare path (always leading slash). */
export function stripLocale(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length && isLocale(parts[0])) parts.shift();
  return '/' + parts.join('/');
}

/** Map the current path to its equivalent in another locale (for the switcher). */
export function switchLocalePath(pathname: string, target: Locale): string {
  return localizedPath(target, stripLocale(pathname));
}

export { isLocale, DEFAULT_LOCALE };
export type { Locale };
