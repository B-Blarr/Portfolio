import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
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
export class ProjectOverlay {
  @Input({ required: true }) project!: ProjectData;
  @Output() closed = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  private readonly changeDetector = inject(ChangeDetectorRef);

  videoOpen = false;
  private videoOpener: HTMLElement | null = null;

  @HostListener('document:keydown.escape')
  onEscapePressed(): void {
    this.closed.emit();
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

  closeVideo(): void {
    this.videoOpen = false;
    this.changeDetector.detectChanges();
    this.videoOpener?.focus();
    this.videoOpener = null;
  }
}
