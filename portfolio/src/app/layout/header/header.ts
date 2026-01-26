import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  activeLanguage: 'de' | 'en' = 'en';

  setActiveLanguage(language: 'de' | 'en' ) {
    this.activeLanguage = language;
  }
}
