import {Component, HostListener, Output, EventEmitter, Input} from '@angular/core';
import { NgFor } from '@angular/common';
import { AnimatedButton } from '../animated-button/animated-button';

export type ProjectTech = {
  iconUrl: string;
  name: string;
};

export type ProjectData = {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  techs: ProjectTech[];
  github: string;
};

@Component({
  selector: 'app-project-overlay',
  imports: [AnimatedButton, NgFor],
  templateUrl: './project-overlay.html',
  styleUrl: './project-overlay.scss',
})
export class ProjectOverlay {
@Input({ required: true }) project!: ProjectData;
@Output() close = new EventEmitter<void>();
@Output() next = new EventEmitter<void>();

 @HostListener('document:keydown.escape')
  onEscapePressed() {
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }

  onNext(){
  this.next.emit();
  }
}
