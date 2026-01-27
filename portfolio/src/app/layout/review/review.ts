// import { Component, ChangeDetectorRef } from '@angular/core';
// import { Reference, ReferenceData } from '../../shared/components/reference/reference';

// @Component({
//   selector: 'app-review',
//   imports: [Reference],
//   templateUrl: './review.html',
//   styleUrl: './review.scss',
// })
// export class Review {
//   reviewList: ReferenceData[] = [
//     {
//       text: 'Benjamin has proven to be a reliable group partner. His technical skills and proactive approach were crucial to the success of our project.',
//       evaluator: 'H. Janisch - Team Partner',
//     },
//     {
//       text: 'I had the good fortune of working with Benjamin in a group project at the Developer Akademie that involved a lot of effort. He always stayed calm, cool and focused and made sure our team was set up for success. He is super knowledgeable, easy to work with and I would happily work with him again given the chance.',
//       evaluator: 'A. Fischer - Team Partner',
//     },
//     {
//       text: 'Our project benefited enormously from Benjamins efficient way of working.',
//       evaluator: 'T. Schulz - Frontend Developer',
//     },
//     {
//       text: 'Working with Benjamin was a great experience. His problem-solving skills are exceptional.',
//       evaluator: 'M. Weber - Project Manager',
//     },
//   ];

//   // Card-Breite + Gap für die Positionsberechnung
//   private readonly CARD_OFFSET = 560;
//   private readonly ANIMATION_DURATION = 600;

//   // Jede Card hat ihre eigene Position
//   // 0 = Mitte, -1 = links sichtbar, 1 = rechts sichtbar
//   // -2 = links außen (bereit zum reinsliden), 2 = rechts außen (bereit zum reinsliden)
//   cardPositions: number[] = [];

//   // Welche Card gerade KEINE Transition haben soll (für instant Teleport)
//   noTransitionIndex: number = -1;

//   isAnimating = false;

//   constructor(private cdr: ChangeDetectorRef) {
//     this.initializePositions();
//   }

//   /**
//    * Initialisiert die Positionen so, dass immer Cards auf -2 und 2 bereitstehen
//    * Position -2 = links außen, bereit zum reinsliden bei previousSlide
//    * Position 2 = rechts außen, bereit zum reinsliden bei nextSlide
//    */
//   private initializePositions(): void {
//     const total = this.reviewList.length;
//     this.cardPositions = [];

//     // Positionen: ..., -2, -1, 0, 1, 2, ...
//     // Card 0 = Mitte (0)
//     // Card 1 = Rechts (1)
//     // Card 2 = Rechts außen (2) - bereit zum reinsliden bei nextSlide
//     // Letzte Card = Links (-1)
//     // Vorletzte Card = Links außen (-2) - bereit zum reinsliden bei previousSlide

//     for (let i = 0; i < total; i++) {
//       if (i === 0) {
//         this.cardPositions.push(0);   // Mitte
//       } else if (i === 1) {
//         this.cardPositions.push(1);   // Rechts sichtbar
//       } else if (i === 2 && total > 3) {
//         this.cardPositions.push(2);   // Rechts außen (bereit)
//       } else if (i === total - 1) {
//         this.cardPositions.push(-1);  // Links sichtbar
//       } else if (i === total - 2 && total > 3) {
//         this.cardPositions.push(-2);  // Links außen (bereit)
//       } else {
//         // Restliche Cards weiter außen parken
//         this.cardPositions.push(3 + i);
//       }
//     }
//   }

//   get currentIndex(): number {
//     return this.cardPositions.findIndex(pos => pos === 0);
//   }

//   /**
//    * Linker Pfeil: Alle Cards nach RECHTS
//    * - Card von -2 slidet nach -1 (reinsliden von links)
//    * - Card von -1 slidet nach 0
//    * - Card von 0 slidet nach 1
//    * - Card von 1 slidet nach 2 (raussliden nach rechts)
//    * - Card von 2 wird nach -2 teleportiert (bereit für nächstes Mal)
//    */
//   previousSlide(): void {
//     if (this.isAnimating) return;
//     this.isAnimating = true;

//     const total = this.reviewList.length;

//     // Finde die Card die ganz nach rechts rausfahren wird (aktuell auf Position 2)
//     // Falls keine auf 2 ist, nimm die auf 1 (bei 3 Cards)
//     let exitingCardIndex = this.cardPositions.findIndex(pos => pos === 2);
//     if (exitingCardIndex === -1) {
//       exitingCardIndex = this.cardPositions.findIndex(pos => pos === 1);
//     }

//     // SCHRITT 1: Alle Positionen um 1 nach rechts verschieben (mit Animation)
//     for (let i = 0; i < total; i++) {
//       this.cardPositions[i] += 1;
//     }
//     this.cdr.detectChanges();

//     // SCHRITT 2: Nach der Animation - die am weitesten rechts rausgefahrene Card teleportieren
//     setTimeout(() => {
//       // Finde Card mit höchster Position (die am weitesten rechts ist)
//       let maxPos = -999;
//       let teleportIndex = -1;
//       for (let i = 0; i < total; i++) {
//         if (this.cardPositions[i] > maxPos) {
//           maxPos = this.cardPositions[i];
//           teleportIndex = i;
//         }
//       }

//       // Diese Card teleportiert nach -2 (links außen, bereit für nächstes Mal)
//       this.noTransitionIndex = teleportIndex;
//       this.cdr.detectChanges();

//       setTimeout(() => {
//         this.cardPositions[teleportIndex] = -2;
//         this.cdr.detectChanges();

//         setTimeout(() => {
//           this.noTransitionIndex = -1;
//           this.isAnimating = false;
//           this.cdr.detectChanges();
//         }, 50);
//       }, 20);

//     }, this.ANIMATION_DURATION);
//   }

//   /**
//    * Rechter Pfeil: Alle Cards nach LINKS
//    * - Card von 2 slidet nach 1 (reinsliden von rechts)
//    * - Card von 1 slidet nach 0
//    * - Card von 0 slidet nach -1
//    * - Card von -1 slidet nach -2 (raussliden nach links)
//    * - Card von -2 wird nach 2 teleportiert (bereit für nächstes Mal)
//    */
//   nextSlide(): void {
//     if (this.isAnimating) return;
//     this.isAnimating = true;

//     const total = this.reviewList.length;

//     // SCHRITT 1: Alle Positionen um 1 nach links verschieben (mit Animation)
//     for (let i = 0; i < total; i++) {
//       this.cardPositions[i] -= 1;
//     }
//     this.cdr.detectChanges();

//     // SCHRITT 2: Nach der Animation - die am weitesten links rausgefahrene Card teleportieren
//     setTimeout(() => {
//       // Finde Card mit niedrigster Position (die am weitesten links ist)
//       let minPos = 999;
//       let teleportIndex = -1;
//       for (let i = 0; i < total; i++) {
//         if (this.cardPositions[i] < minPos) {
//           minPos = this.cardPositions[i];
//           teleportIndex = i;
//         }
//       }

//       // Diese Card teleportiert nach 2 (rechts außen, bereit für nächstes Mal)
//       this.noTransitionIndex = teleportIndex;
//       this.cdr.detectChanges();

//       setTimeout(() => {
//         this.cardPositions[teleportIndex] = 2;
//         this.cdr.detectChanges();

//         setTimeout(() => {
//           this.noTransitionIndex = -1;
//           this.isAnimating = false;
//           this.cdr.detectChanges();
//         }, 50);
//       }, 20);

//     }, this.ANIMATION_DURATION);
//   }

//   /**
//    * Zu bestimmtem Slide springen (über Dots)
//    */
//   goToSlide(targetIndex: number): void {
//     if (this.isAnimating) return;

//     const current = this.currentIndex;
//     if (targetIndex === current) return;

//     const total = this.reviewList.length;
//     let diff = targetIndex - current;

//     if (Math.abs(diff) > total / 2) {
//       diff = diff > 0 ? diff - total : diff + total;
//     }

//     if (diff > 0) {
//       this.nextSlide();
//     } else {
//       this.previousSlide();
//     }

//     const remainingSteps = Math.abs(diff) - 1;
//     if (remainingSteps > 0) {
//       setTimeout(() => {
//         this.goToSlide(targetIndex);
//       }, this.ANIMATION_DURATION + 150);
//     }
//   }

//   // ============ TEMPLATE HELPER METHODEN ============

//   getCardTransform(index: number): string {
//     const position = this.cardPositions[index];
//     return `translateX(${position * this.CARD_OFFSET}px)`;
//   }

//   getCardTransition(index: number): string {
//     if (this.noTransitionIndex === index) {
//       return 'none';
//     }
//     return `all ${this.ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;
//   }

//   getCardOpacity(index: number): number {
//     const position = this.cardPositions[index];

//     if (position === 0) return 1;                         // Mitte
//     if (position === 1 || position === -1) return 0.6;    // Links/Rechts sichtbar
//     return 0;                                              // Alles andere unsichtbar
//   }

//   getCardZIndex(index: number): number {
//     const position = Math.abs(this.cardPositions[index]);

//     if (position === 0) return 3;
//     if (position === 1) return 2;
//     return 1;
//   }

//   isActive(index: number): boolean {
//     return this.cardPositions[index] === 0;
//   }

//   isPrev(index: number): boolean {
//     return this.cardPositions[index] === -1;
//   }

//   isNext(index: number): boolean {
//     return this.cardPositions[index] === 1;
//   }

//   getPrevIndex(): number {
//     return this.cardPositions.findIndex(pos => pos === -1);
//   }

//   getNextIndex(): number {
//     return this.cardPositions.findIndex(pos => pos === 1);
//   }
// }

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

  private readonly CARD_OFFSET = 560;
  private readonly ANIMATION_DURATION = 600;

  cardPositions: number[] = [];
  noTransitionIndex = -1;
  isAnimating = false;

  constructor(private cdr: ChangeDetectorRef) {
    this.initializePositions();
  }

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

  get currentIndex(): number {
    return this.cardPositions.findIndex(pos => pos === 0);
  }

  previousSlide(): void {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const total = this.reviewList.length;

    // Finde min/max Positionen und Card mit höchster Position
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

    // Teleport rechteste Card nach links-außen (instant)
    this.noTransitionIndex = teleportIndex;
    this.cardPositions[teleportIndex] = minPos - 1;
    this.cdr.detectChanges();

    // Animation starten
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

    // Shift alle nach links (mit Animation)
    for (let i = 0; i < total; i++) {
      this.cardPositions[i] -= 1;
    }
    this.cdr.detectChanges();

    // Nach Animation: rausgeslidete Card teleportieren
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

  // Template Helper Methoden
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
