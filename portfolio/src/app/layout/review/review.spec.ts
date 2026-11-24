import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { Review } from './review';

describe('Review', () => {
  let fixture: ComponentFixture<Review>;

  beforeEach(async () => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      imports: [Review],
      providers: [provideTranslateService()],
    });
    fixture = TestBed.createComponent(Review);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function liveRegion(): HTMLElement {
    return fixture.nativeElement.querySelector('[aria-live="polite"]');
  }

  it('keeps only the visible card reachable', () => {
    const cards: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.reference-card'),
    );

    expect(cards.map((card) => card.inert)).toEqual([false, true, true, true]);
  });

  it('announces nothing before the first slide', () => {
    expect(liveRegion().textContent?.trim()).toBe('');
  });

  it('announces the new reference after a slide', () => {
    fixture.componentInstance.nextSlide();
    vi.advanceTimersByTime(20);
    fixture.detectChanges();

    expect(liveRegion().textContent).toContain('references.position');
    expect(liveRegion().textContent).toContain('references.serhat.evaluator');
  });
});
