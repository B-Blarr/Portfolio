import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

import de from '../../public/i18n/de.json';
import en from '../../public/i18n/en.json';

const TRANSLATIONS: Record<string, TranslationObject> = { de, en };

/**
 * Serves the translations from the bundle instead of fetching them.
 * of() emits synchronously, so the first render already has its texts.
 */
export class StaticTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    return of(TRANSLATIONS[lang] ?? TRANSLATIONS['de']);
  }
}
