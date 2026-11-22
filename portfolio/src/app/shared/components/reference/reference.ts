import {
  Component,
  DestroyRef,
  ElementRef,
  Input,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

export interface ReferenceData {
  textKey: string;
  evaluatorKey: string;
}

@Component({
  selector: 'app-reference',
  imports: [TranslatePipe],
  templateUrl: './reference.html',
  styleUrl: './reference.scss',
})
export class Reference {
  @Input({ required: true }) reference!: ReferenceData;

  @ViewChild('text', { static: true }) private text!: ElementRef<HTMLElement>;

  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);

  constructor() {
    afterNextRender(() => {
      this.updateFade();
      this.watchSize();
      document.fonts?.ready.then(() => this.updateFade());
      this.translate.onLangChange
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => requestAnimationFrame(() => this.updateFade()));
    });
  }

  /**
   * Shows the bottom fade only while more text is hidden below, so the last
   * line is fully readable once the reader has scrolled to the end.
   */
  updateFade(): void {
    const element = this.text.nativeElement;
    const hiddenBelow = element.scrollHeight - element.clientHeight - element.scrollTop > 1;
    element.classList.toggle('has-more', hiddenBelow);
  }

  /** Re-checks the fade whenever the card changes size, for example on resize. */
  private watchSize(): void {
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => this.updateFade());
    observer.observe(this.text.nativeElement);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}
