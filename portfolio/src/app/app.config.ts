import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, TitleStrategy, withInMemoryScrolling } from '@angular/router';
import { provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';

import { StaticTranslateLoader } from './static-translate-loader';
import { TranslatedTitleStrategy } from './translated-title-strategy';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
    provideHttpClient(),
    { provide: TitleStrategy, useClass: TranslatedTitleStrategy },
    provideTranslateService({
      lang: 'de',
      fallbackLang: 'en',
      loader: provideTranslateLoader(StaticTranslateLoader),
    }),
  ],
};
