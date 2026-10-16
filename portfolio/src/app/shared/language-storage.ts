export type AppLanguage = 'de' | 'en';

const STORAGE_KEY = 'language';
const SUPPORTED_LANGUAGES: AppLanguage[] = ['de', 'en'];
const DEFAULT_LANGUAGE: AppLanguage = 'de';

/**
 * Reads the stored language. Returns the default when storage is blocked or
 * holds a value this app does not support.
 *
 * Browsers throw on localStorage when the visitor blocks all site data, and
 * both call sites run before the first render, so an unguarded read would
 * leave the page blank.
 */
export function readStoredLanguage(): AppLanguage {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED_LANGUAGES.includes(stored as AppLanguage)
      ? (stored as AppLanguage)
      : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

/** Stores the language. A blocked storage leaves the choice session only. */
export function storeLanguage(language: AppLanguage): void {
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    return;
  }
}
