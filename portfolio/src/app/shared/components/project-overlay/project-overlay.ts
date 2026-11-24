import {
  afterNextRender,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { AnimatedButton } from '../animated-button/animated-button';
import { TranslatePipe } from '@ngx-translate/core';
import { ProjectVideo, VideoLightbox } from '../video-lightbox/video-lightbox';

export interface ProjectTech {
  iconUrl: string;
  name: string;
}

/**
 * Ein Knopf in der Fussleiste des Overlays. `labelKey` ist ein i18n-Schluessel,
 * damit die Beschriftung je Projekt frei waehlbar und trotzdem zweisprachig
 * bleibt. Die Liste ersetzt die frueheren Felder `github` und `livetest`, weil
 * nicht jedes Projekt ein Repository oder eine laufende Fassung hat.
 */
export interface ProjectLink {
  url: string;
  labelKey: string;
}

export interface ProjectData {
  title: string;
  subtitle: string;
  descriptionKey: string;
  imageUrl: string;
  techs: ProjectTech[];
  links: ProjectLink[];
  video?: ProjectVideo;
}

@Component({
  selector: 'app-project-overlay',
  imports: [AnimatedButton, TranslatePipe, VideoLightbox],
  templateUrl: './project-overlay.html',
  styleUrl: './project-overlay.scss',
})
export class ProjectOverlay implements OnDestroy {
  @Input({ required: true }) project!: ProjectData;
  @Output() closed = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  @ViewChild('dialog') private dialog?: ElementRef<HTMLElement>;
  @ViewChild('closeButton') private closeButton?: ElementRef<HTMLButtonElement>;

  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly hiddenBackground: HTMLElement[] = [];

  videoOpen = false;
  private videoOpener: HTMLElement | null = null;

  constructor() {
    afterNextRender(() => {
      this.hideBackground();
      this.closeButton?.nativeElement.focus();
    });
  }

  ngOnDestroy(): void {
    for (const element of this.hiddenBackground) element.inert = false;
  }

  /**
   * Makes the page behind the overlay inert, so screen readers cannot leave
   * the dialog with their reading cursor either. Walks up from the overlay and
   * marks every sibling on the way, leaving elements that were inert already.
   */
  private hideBackground(): void {
    let node: HTMLElement = this.host.nativeElement;
    while (node.parentElement && node !== document.body) {
      for (const sibling of Array.from(node.parentElement.children)) {
        if (sibling === node || !(sibling instanceof HTMLElement) || sibling.inert) continue;
        sibling.inert = true;
        this.hiddenBackground.push(sibling);
      }
      node = node.parentElement;
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePressed(): void {
    this.closed.emit();
  }

  /**
   * Keeps Tab and Shift+Tab inside the overlay while it is open, so keyboard
   * users do not wander into the page hidden behind it. While the video is
   * open, the video lightbox handles the focus itself.
   */
  @HostListener('document:keydown.tab', ['$event'])
  @HostListener('document:keydown.shift.tab', ['$event'])
  onTabPressed(event: Event): void {
    if (this.videoOpen || !this.dialog) return;
    const focusable = this.focusableElements(this.dialog.nativeElement);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    const outside = !this.dialog.nativeElement.contains(active);
    const backwards = (event as KeyboardEvent).shiftKey;

    if (backwards && (active === first || outside)) {
      event.preventDefault();
      last.focus();
    } else if (!backwards && (active === last || outside)) {
      event.preventDefault();
      first.focus();
    }
  }

  onClose(): void {
    this.closed.emit();
  }

  onNext(): void {
    this.videoOpen = false;
    this.next.emit();
  }

  openVideo(): void {
    this.videoOpener =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.videoOpen = true;
  }

  /** Returns the visible elements inside the overlay that Tab can reach, in order. */
  private focusableElements(container: HTMLElement): HTMLElement[] {
    const candidates = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])',
    );
    return Array.from(candidates).filter((element) =>
      typeof element.checkVisibility === 'function' ? element.checkVisibility() : true,
    );
  }

  closeVideo(): void {
    this.videoOpen = false;
    this.changeDetector.detectChanges();
    this.videoOpener?.focus();
    this.videoOpener = null;
  }
}
