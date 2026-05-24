// Locale configuration for the trilingual site.
export type Locale = 'en' | 'hi' | 'mai';

export const LOCALES: Locale[] = ['en', 'hi', 'mai'];
export const DEFAULT_LOCALE: Locale = 'en';

export interface LocaleInfo {
  code: Locale;
  /** Name shown in the language switcher, in its own language. */
  native: string;
  /** English label, for aria/SEO. */
  english: string;
  /** Text direction. */
  dir: 'ltr' | 'rtl';
  /** BCP-47 tag for <html lang> and hreflang. */
  bcp47: string;
}

export const LOCALE_INFO: Record<Locale, LocaleInfo> = {
  en: { code: 'en', native: 'English', english: 'English', dir: 'ltr', bcp47: 'en-IN' },
  hi: { code: 'hi', native: 'हिन्दी', english: 'Hindi', dir: 'ltr', bcp47: 'hi-IN' },
  mai: { code: 'mai', native: 'मैथिली', english: 'Maithili', dir: 'ltr', bcp47: 'mai' },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}
