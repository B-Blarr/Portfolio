import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected title = 'ngx';
  private translate = inject(TranslateService);

   activeLanguage = (localStorage.getItem('language') || 'en') as 'de' | 'en';


  setActiveLanguage(language: 'de' | 'en' ) {
    this.translate.use(language);
    this.activeLanguage = language;
    localStorage.setItem('language', language);
  }
}
