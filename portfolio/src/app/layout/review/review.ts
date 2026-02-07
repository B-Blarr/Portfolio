import { Component, ChangeDetectorRef } from '@angular/core';
import { Reference, ReferenceData } from '../../shared/components/reference/reference';
import { TranslatePipe } from '@ngx-translate/core';

type Direction = 'next' | 'prev';

@Component({
  selector: 'app-review',
  imports: [Reference, TranslatePipe],
  templateUrl: './review.html',
  styleUrl: './review.scss',
})
export class Review {
  reviewList: ReferenceData[] = [
    {
      textKey: 'references.janisch.text',
      evaluatorKey: 'references.janisch.evaluator',
    },
    {
      textKey: 'references.fischer.text',
      evaluatorKey: 'references.fischer.evaluator',
    },
    {
      textKey: 'references.schulz.text',
      evaluatorKey: 'references.schulz.evaluator',
    },
    {
      textKey: 'references.weber.text',
      evaluatorKey: 'references.weber.evaluator',
    },
  ];

  CARD_OFFSET = 560;
  ANIMATION_DURATION = 600;
  cardPositions: number[] = [];
  noTransitionIndex = -1;
  isAnimating = false;
  animationQueue: Direction[] = [];

  constructor(private cdr: ChangeDetectorRef) {
    this.initializePositions();
  }

  initializePositions(): void {
    const total = this.reviewList.length;
    this.cardPositions = new Array(total).fill(0);

    for (let i = 0; i < total; i++) {
      if (i === 0) {
        this.cardPositions[i] = 0;
      } else if (i <= Math.floor(total / 2)) {
        this.cardPositions[i] = i;
      } else {
        this.cardPositions[i] = i - total;
      }
    }
  }

  get currentIndex(): number {
    return this.cardPositions.findIndex((pos) => pos === 0);
  }

  previousSlide(): void {
    this.animationQueue.push('prev');
    if (!this.isAnimating) {
      this.processQueue();
    }
  }

  nextSlide(): void {
    this.animationQueue.push('next');
    if (!this.isAnimating) {
      this.processQueue();
    }
  }

  processQueue(): void {
    if (this.animationQueue.length === 0) {
      this.isAnimating = false;
      return;
    }
    this.isAnimating = true;
    const direction = this.animationQueue.shift()!;
    if (direction === 'next') this.prepareNextSlide();
    setTimeout(() => this.executeSlide(direction), 20);
  }

  prepareNextSlide(): void {
    this.reviewList.forEach((_, index) => {
      if (this.cardPositions[index] === -2) {
        this.performInstantTeleport(index, 2);
      }
    });
  }

  executeSlide(direction: string): void {
    this.reviewList.forEach((_, i) => {
      this.cardPositions[i] += direction === 'next' ? -1 : 1;
    });
    this.cdr.detectChanges();
    setTimeout(() => this.finalizeSlide(direction), this.ANIMATION_DURATION);
  }

  finalizeSlide(direction: string): void {
    if (direction === 'prev') this.cleanupPreviousSlide();
    this.isAnimating = false;
    this.processQueue();
  }

  cleanupPreviousSlide(): void {
    this.reviewList.forEach((_, index) => {
      if (this.cardPositions[index] === 2) {
        this.performInstantTeleport(index, -2);
      }
    });
  }

  performInstantTeleport(index: number, newPos: number) {
    this.noTransitionIndex = index;
    this.cardPositions[index] = newPos;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.noTransitionIndex = -1;
      this.cdr.detectChanges();
    }, 10);
  }

  goToSlide(targetIndex: number): void {
    if (targetIndex === this.currentIndex) return;
    const total = this.reviewList.length;
    let diff = targetIndex - this.currentIndex;

    if (Math.abs(diff) > total / 2) {
      diff = diff > 0 ? diff - total : diff + total;
    }
    const direction = diff > 0 ? 'next' : 'prev';
    const steps = Math.abs(diff);

    for (let i = 0; i < steps; i++) {
      this.animationQueue.push(direction);
    }
    if (!this.isAnimating) {
      this.processQueue();
    }
  }

  getCardTransform(index: number): string {
    return `translate3d(${this.cardPositions[index] * this.CARD_OFFSET}px, 0, 0)`;
  }

  getCardTransition(index: number): string {
    return this.noTransitionIndex === index
      ? 'none'
      : `all ${this.ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;
  }

  getCardOpacity(index: number): number {
    if (this.noTransitionIndex === index) {
      return 0;
    }

    const pos = this.cardPositions[index];
    if (pos === 0) return 1;
    if (pos === 1 || pos === -1) return 0.6;
    return 0;
  }

  getCardZIndex(index: number): number {
    if (this.noTransitionIndex === index) {
      return -1;
    }
    const pos = Math.abs(this.cardPositions[index]);
    if (pos === 0) return 3;
    if (pos === 1) return 2;
    return 1;
  }

  getPrevIndex(): number {
    return this.cardPositions.findIndex((pos) => pos === -1);
  }

  getNextIndex(): number {
    return this.cardPositions.findIndex((pos) => pos === 1);
  }
}
