import { Component, ChangeDetectorRef } from '@angular/core';
import { Reference, ReferenceData } from '../../shared/components/reference/reference';

@Component({
  selector: 'app-review',
  imports: [Reference],
  templateUrl: './review.html',
  styleUrl: './review.scss',
})
export class Review {
  reviewList: ReferenceData[] = [
    {
      text: 'Benjamin has proven to be a reliable group partner. His technical skills and proactive approach were crucial to the success of our project.',
      evaluator: 'H. Janisch - Team Partner',
    },
    {
      text: 'I had the good fortune of working with Benjamin in a group project at the Developer Akademie that involved a lot of effort. He always stayed calm, cool and focused and made sure our team was set up for success. He is super knowledgeable, easy to work with and I would happily work with him again given the chance.',
      evaluator: 'A. Fischer - Team Partner',
    },
    {
      text: 'Our project benefited enormously from Benjamins efficient way of working.',
      evaluator: 'T. Schulz - Frontend Developer',
    },
    {
      text: 'Working with Benjamin was a great experience. His problem-solving skills are exceptional.',
      evaluator: 'M. Weber - Project Manager',
    },
  ];

  CARD_OFFSET = 560;
  ANIMATION_DURATION = 600;

  cardPositions: number[] = [];
  noTransitionIndex = -1;
  isAnimating = false;

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
    return this.cardPositions.findIndex(pos => pos === 0);
  }

  previousSlide(): void {
    if (this.isAnimating) return;
    this.isAnimating = true;
    const total = this.reviewList.length;
    let maxPos = -999, minPos = 999, teleportIndex = -1;
    for (let i = 0; i < total; i++) {
      if (this.cardPositions[i] > maxPos) {
        maxPos = this.cardPositions[i];
        teleportIndex = i;
      }
      if (this.cardPositions[i] < minPos) {
        minPos = this.cardPositions[i];
      }
    }
    this.noTransitionIndex = teleportIndex;
    this.cardPositions[teleportIndex] = minPos - 1;
    this.cdr.detectChanges();

    requestAnimationFrame(() => {
      this.noTransitionIndex = -1;
      this.cdr.detectChanges();

      requestAnimationFrame(() => {
        for (let i = 0; i < total; i++) {
          this.cardPositions[i] += 1;
        }
        this.cdr.detectChanges();

        setTimeout(() => {
          this.isAnimating = false;
          this.cdr.detectChanges();
        }, this.ANIMATION_DURATION);
      });
    });
  }

  nextSlide(): void {
    if (this.isAnimating) return;
    this.isAnimating = true;
    const total = this.reviewList.length;

    for (let i = 0; i < total; i++) {
      this.cardPositions[i] -= 1;
    }
    this.cdr.detectChanges();

    setTimeout(() => {
      let minPos = 999, maxPos = -999, teleportIndex = -1;
      for (let i = 0; i < total; i++) {
        if (this.cardPositions[i] < minPos) {
          minPos = this.cardPositions[i];
          teleportIndex = i;
        }
        if (this.cardPositions[i] > maxPos) {
          maxPos = this.cardPositions[i];
        }
      }
      this.noTransitionIndex = teleportIndex;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.cardPositions[teleportIndex] = maxPos + 1;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.noTransitionIndex = -1;
          this.isAnimating = false;
          this.cdr.detectChanges();
        }, 50);
      }, 20);
    }, this.ANIMATION_DURATION);
  }

  goToSlide(targetIndex: number): void {
    if (this.isAnimating || targetIndex === this.currentIndex) return;
    const total = this.reviewList.length;
    let diff = targetIndex - this.currentIndex;

    if (Math.abs(diff) > total / 2) {
      diff = diff > 0 ? diff - total : diff + total;
    }
    diff > 0 ? this.nextSlide() : this.previousSlide();
    if (Math.abs(diff) > 1) {
      setTimeout(() => this.goToSlide(targetIndex), this.ANIMATION_DURATION + 150);
    }
  }

  getCardTransform(index: number): string {
    return `translateX(${this.cardPositions[index] * this.CARD_OFFSET}px)`;
  }

  getCardTransition(index: number): string {
    return this.noTransitionIndex === index
      ? 'none'
      : `all ${this.ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;
  }

  getCardOpacity(index: number): number {
    const pos = this.cardPositions[index];
    if (pos === 0) return 1;
    if (pos === 1 || pos === -1) return 0.6;
    return 0;
  }

  getCardZIndex(index: number): number {
    const pos = Math.abs(this.cardPositions[index]);
    if (pos === 0) return 3;
    if (pos === 1) return 2;
    return 1;
  }

  getPrevIndex(): number {
    return this.cardPositions.findIndex(pos => pos === -1);
  }

  getNextIndex(): number {
    return this.cardPositions.findIndex(pos => pos === 1);
  }
}
