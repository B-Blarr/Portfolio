import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

/**
 * Uses the `title` of a route as a translation key, so the browser tab shows
 * the page name in the active language and follows a language switch. Routes
 * without a title fall back to the title of the home page.
 */
@Injectable({ providedIn: 'root' })
export class TranslatedTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly translate = inject(TranslateService);
  private titleKey = 'pageTitle.home';

  constructor() {
    super();
    this.translate.onLangChange.subscribe(() => this.applyTitle());
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.titleKey = this.buildTitle(snapshot) ?? 'pageTitle.home';
    this.applyTitle();
  }

  private applyTitle(): void {
    this.translate.get(this.titleKey).subscribe((text: string) => this.title.setTitle(text));
  }
}
