import { Component, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { AnimatedButton } from '../animated-button/animated-button';
import { TranslatePipe } from '@ngx-translate/core';

export interface ProjectTech {
  iconUrl: string;
  name: string;
}

export interface ProjectData {
  title: string;
  subtitle: string;
  descriptionKey: string;
  imageUrl: string;
  techs: ProjectTech[];
  github: string;
  livetest: string;
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
