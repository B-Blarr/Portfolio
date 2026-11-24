import { ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, Scroll } from '@angular/router';
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
  private router = inject(Router);

  constructor() {
    this.viewportScroller.setOffset([0, 40]);
    this.translate.setFallbackLang('en');
    const savedLanguage = readStoredLanguage();
    this.translate.use(savedLanguage);
    document.documentElement.lang = savedLanguage;
    this.router.events.subscribe((event) => {
      if (event instanceof Scroll && event.anchor) this.focusAnchor(event.anchor);
    });
  }

  /**
   * Moves the keyboard focus to the section a fragment link jumped to. The
   * router only scrolls, so the next Tab would otherwise continue in the menu.
   */
  private focusAnchor(anchor: string): void {
    const target = document.getElementById(anchor);
    if (!target) return;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
}
