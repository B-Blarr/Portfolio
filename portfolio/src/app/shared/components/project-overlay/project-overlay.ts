import { Component, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { AnimatedButton } from '../animated-button/animated-button';
import { TranslatePipe } from '@ngx-translate/core';

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
}

@Component({
  selector: 'app-project-overlay',
  imports: [AnimatedButton, TranslatePipe],
  templateUrl: './project-overlay.html',
  styleUrl: './project-overlay.scss',
})
export class ProjectOverlay {
  @Input({ required: true }) project!: ProjectData;
  @Output() closed = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscapePressed(): void {
    this.closed.emit();
  }

  onClose(): void {
    this.closed.emit();
  }

  onNext(): void {
    this.next.emit();
  }
}
