import { Component, inject } from '@angular/core';
import {TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [TranslatePipe,],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected title = 'ngx';
  private translate = inject(TranslateService);

  activeLanguage: 'de' | 'en' = 'en';

  setActiveLanguage(language: 'de' | 'en' ) {
    this.translate.use(language);
    this.activeLanguage = language;
  }
}
