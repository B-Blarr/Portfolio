import { Component, ChangeDetectorRef, HostListener } from '@angular/core';
import { Reference, ReferenceData } from '../../shared/components/reference/reference';
import { TranslatePipe } from '@ngx-translate/core';

/** Carousel slide direction. */
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
      textKey: 'references.vadim.text',
      evaluatorKey: 'references.vadim.evaluator',
    },
    {
      textKey: 'references.serhat.text',
      evaluatorKey: 'references.serhat.evaluator',
    },
    {
      textKey: 'references.vladislav.text',
      evaluatorKey: 'references.vladislav.evaluator',
    },
    {
      textKey: 'references.gregor.text',
      evaluatorKey: 'references.gregor.evaluator',
    },
  ];

  private touchStartX = 0;
  private touchEndX = 0;
  private readonly minSwipeDistance = 50;

  /** Duration of the slide animation in milliseconds. */
  readonly ANIMATION_DURATION = 500;

  /**
   * Per-card slot positions. The active card is always at `0`, its visible
   * neighbours at `±1`, and the off-screen waiting card at `±2`.
   */
  cardPositions: number[] = [];

  /**
   * Index of the card whose CSS transition is temporarily disabled during a
   * teleport. `-1` when no teleport is in progress.
   */
  noTransitionIndex = -1;

  isAnimating = false;
  animationQueue: Direction[] = [];

  constructor(private cdr: ChangeDetectorRef) {
    this.initializePositions();
  }

  /**
   * Initialises the position ring.
   * Card `0` starts at the active slot. Cards `1…floor(n/2)` fill the positive
   * slots, and the remaining cards wrap to negative slots so that the ring is
   * contiguous from `-floor(n/2)` to `floor(n/2)`.
   */
  private initializePositions(): void {
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

  /** Index of the card currently at slot `0` (the active card). */
  get currentIndex(): number {
    return this.cardPositions.findIndex((pos) => pos === 0);
  }

  /** Index of the card currently at slot `-1` (left-visible). */
  getPrevIndex(): number {
    return this.cardPositions.findIndex((pos) => pos === -1);
  }

  /** Index of the card currently at slot `+1` (right-visible). */
  getNextIndex(): number {
    return this.cardPositions.findIndex((pos) => pos === 1);
  }

  /** Queues a backwards slide and starts processing if idle. */
  previousSlide(): void {
    this.animationQueue.push('prev');
    if (!this.isAnimating) this.processQueue();
  }

  /** Queues a forwards slide and starts processing if idle. */
  nextSlide(): void {
    this.animationQueue.push('next');
    if (!this.isAnimating) this.processQueue();
  }

  /**
   * Dequeues and executes the next slide direction.
   * Teleports the wrap card into position before the animation begins, then
   * waits one tick (`setTimeout 20 ms`) to allow the browser to commit the
   * snap before the transition starts.
   */
  processQueue(): void {
    if (this.animationQueue.length === 0) {
      this.isAnimating = false;
      return;
    }
    this.isAnimating = true;
    const direction = this.animationQueue.shift()!;
    if (direction === 'next') this.prepareNextSlide();
    else this.preparePrevSlide();
    setTimeout(() => this.executeSlide(direction), 20);
  }

  /**
   * Pre-teleports the `next` direction wrap card.
   * The card at slot `−2` (far left, off-screen) would jump three slots
   * if left in place during a `next` slide. Moving it to `+2` first lets it
   * animate a single step into slot `+1`.
   */
  private prepareNextSlide(): void {
    this.cardPositions.forEach((pos, index) => {
      if (pos === -2) this.performInstantTeleport(index, 2);
    });
  }

  /**
   * Pre-teleports the `prev` direction wrap card.
   * The card at slot `+2` (far right, off-screen) would jump three slots
   * if left in place during a `prev` slide. Moving it to `−2` first lets it
   * animate a single step into slot `−1`.
   */
  private preparePrevSlide(): void {
    this.cardPositions.forEach((pos, index) => {
      if (pos === 2) this.performInstantTeleport(index, -2);
    });
  }

  /**
   * Shifts all card positions by `±1` to execute the slide, then waits for
   * the CSS animation to complete before finalising.
   *
   * @param direction - The direction of the slide.
   */
  private executeSlide(direction: string): void {
    this.cardPositions = this.cardPositions.map((pos) =>
      pos + (direction === 'next' ? -1 : 1),
    );
    this.cdr.detectChanges();
    setTimeout(() => this.finalizeSlide(direction), this.ANIMATION_DURATION);
  }

  /**
   * Finalises a completed slide. For the `prev` direction, the card that
   * moved to slot `+2` is teleported back to `−2` so it is ready for the
   * next `prev` slide without crossing the visible area.
   *
   * @param direction - The direction of the completed slide.
   */
  private finalizeSlide(direction: string): void {
    if (direction === 'prev') this.cleanupAfterPrevSlide();
    this.isAnimating = false;
    this.processQueue();
  }

  /**
   * Post-animation cleanup for the `prev` direction.
   * Teleports the card that reached slot `+2` to `−2` (off-screen left)
   * so it is positioned correctly for future `prev` slides.
   */
  private cleanupAfterPrevSlide(): void {
    this.cardPositions.forEach((pos, index) => {
      if (pos === 2) this.performInstantTeleport(index, -2);
    });
  }

  /**
   * Snaps a card instantly to a new slot position without a visible transition.
   * Disables the card's CSS transition, moves it, then re-enables the transition
   * after a short delay so the browser has time to commit the snap.
   *
   * @param index  - Index of the card in `cardPositions` / `reviewList`.
   * @param newPos - Target slot position.
   */
  private performInstantTeleport(index: number, newPos: number): void {
    this.noTransitionIndex = index;
    this.cardPositions[index] = newPos;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.noTransitionIndex = -1;
      this.cdr.detectChanges();
    }, 10);
  }

  /**
   * Navigates directly to a slide by computing the shortest path through the
   * ring and queuing the required number of steps.
   *
   * @param targetIndex - Index of the target card in `reviewList`.
   */
  goToSlide(targetIndex: number): void {
    if (targetIndex === this.currentIndex) return;
    const total = this.reviewList.length;
    let diff = targetIndex - this.currentIndex;
    if (Math.abs(diff) > total / 2) {
      diff = diff > 0 ? diff - total : diff + total;
    }
    const direction: Direction = diff > 0 ? 'next' : 'prev';
    for (let i = 0; i < Math.abs(diff); i++) this.animationQueue.push(direction);
    if (!this.isAnimating) this.processQueue();
  }

  /**
   * Returns the CSS `translate3d` transform for a card based on its current slot position.
   *
   * @param index - Card index in `reviewList`.
   */
  getCardTransform(index: number): string {
    return `translate3d(calc(var(--card-offset) * ${this.cardPositions[index]}), 0, 0)`;
  }

  /**
   * Returns the CSS transition string for a card.
   * Returns `'none'` while the card is being teleported to prevent a visible snap.
   *
   * @param index - Card index in `reviewList`.
   */
  getCardTransition(index: number): string {
    return this.noTransitionIndex === index
      ? 'none'
      : `all ${this.ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;
  }

  /**
   * Returns the opacity for a card based on its slot position.
   *
   * - `0`  → active (`1.0`)
   * - `±1` → visible neighbours (`0.6`)
   * - `±2` → off-screen (`0`)
   *
   * Returns `0` while the card is being teleported.
   *
   * @param index - Card index in `reviewList`.
   */
  getCardOpacity(index: number): number {
    if (this.noTransitionIndex === index) return 0;
    const pos = this.cardPositions[index];
    if (pos === 0) return 1;
    if (pos === 1 || pos === -1) return 0.6;
    return 0;
  }

  /**
   * Returns the z-index for a card based on its slot position.
   * Returns `-100` while the card is being teleported to keep it behind all content.
   *
   * @param index - Card index in `reviewList`.
   */
  getCardZIndex(index: number): number {
    if (this.noTransitionIndex === index) return -100;
    const pos = Math.abs(this.cardPositions[index]);
    if (pos === 0) return 3;
    if (pos === 1) return 2;
    return -10;
  }

  /** Records the horizontal start position of a touch gesture. */
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  /** Records the horizontal end position of a touch gesture and evaluates the swipe. */
  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  /**
   * Triggers a slide if the swipe distance exceeds `minSwipeDistance`.
   * A positive distance (swipe left) advances to the next slide; negative goes to the previous.
   */
  private handleSwipe(): void {
    const swipeDistance = this.touchStartX - this.touchEndX;
    if (Math.abs(swipeDistance) > this.minSwipeDistance) {
      swipeDistance > 0 ? this.nextSlide() : this.previousSlide();
    }
  }
}
