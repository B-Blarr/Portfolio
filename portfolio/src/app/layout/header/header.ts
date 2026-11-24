import { Component, inject, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AppLanguage, readStoredLanguage, storeLanguage } from '../../shared/language-storage';

@Component({
  selector: 'app-header',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private translate = inject(TranslateService);

  activeLanguage: AppLanguage = readStoredLanguage();
  isMenuOpen = false;

  setActiveLanguage(language: AppLanguage): void {
    this.translate.use(language);
    this.activeLanguage = language;
    storeLanguage(language);
    document.documentElement.lang = language;
  }

  toggleBurgerMenu(): void {
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

  /**
   * Moves the keyboard focus past the navigation to the page content. A plain
   * fragment link only scrolls, so the next Tab would start at the top again.
   */
  skipToContent(event: Event): void {
    const target = document.getElementById('main-content');
    if (!target) return;
    event.preventDefault();
    target.focus();
  }
}
