import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter, Router, TitleStrategy } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';

import { TranslatedTitleStrategy } from './translated-title-strategy';

@Component({ template: '' })
class EmptyPage {}

describe('TranslatedTitleStrategy', () => {
  let router: Router;
  let title: Title;
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: EmptyPage },
          { path: 'legal-notice', component: EmptyPage, title: 'pageTitle.legalNotice' },
        ]),
        provideTranslateService(),
        { provide: TitleStrategy, useClass: TranslatedTitleStrategy },
      ],
    });
    router = TestBed.inject(Router);
    title = TestBed.inject(Title);
    translate = TestBed.inject(TranslateService);
    translate.setTranslation('de', {
      pageTitle: { home: 'Start', legalNotice: 'Impressum' },
    });
    translate.setTranslation('en', {
      pageTitle: { home: 'Home', legalNotice: 'Legal Notice' },
    });
    translate.use('de');
  });

  it('shows the translated title of the page', async () => {
    await router.navigateByUrl('/legal-notice');
    expect(title.getTitle()).toBe('Impressum');
  });

  it('falls back to the home title for a route without one', async () => {
    await router.navigateByUrl('/');
    expect(title.getTitle()).toBe('Start');
  });

  it('follows a language switch', async () => {
    await router.navigateByUrl('/legal-notice');
    translate.use('en');
    expect(title.getTitle()).toBe('Legal Notice');
  });
});
