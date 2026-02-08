import { Component, inject, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

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
  isMenuOpen = false;

  setActiveLanguage(language: 'de' | 'en') {
    this.translate.use(language);
    this.activeLanguage = language;
    localStorage.setItem('language', language);
  }

  toggleBurgerMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    const burgerMenu = target.closest('.burger-menu');
    const burgerContainer = target.closest('.burger-links-container');

    if (this.isMenuOpen && !burgerMenu && !burgerContainer) {
      this.isMenuOpen = false;
    }
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
