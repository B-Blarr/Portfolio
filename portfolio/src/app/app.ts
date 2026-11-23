import { ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { readStoredLanguage } from './shared/language-storage';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private translate = inject(TranslateService);
  private viewportScroller = inject(ViewportScroller);

  constructor() {
    this.viewportScroller.setOffset([0, 40]);
    this.translate.setFallbackLang('en');
    const savedLanguage = readStoredLanguage();
    this.translate.use(savedLanguage);
    document.documentElement.lang = savedLanguage;
  }
}
