import { Component } from '@angular/core';
import {ProjectOverlay,ProjectData,} from '../../shared/components/project-overlay/project-overlay';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-projects',
  imports: [ProjectOverlay, NgIf, NgFor],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  projectsList: ProjectData[] = [
    {
      title: '01',
      subtitle: 'Join',
      description:
        'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users and categories.',
      imageUrl: '/images/join.jpg',
      techs: [
        { name: 'Angular', iconUrl: '/icons/angular.svg' },
        { name: 'TypeScript', iconUrl: '/icons/typescript.svg' },
        { name: 'HTML', iconUrl: '/icons/html.svg' },
        { name: 'SCSS', iconUrl: '/icons/sass.svg' },
        { name: 'Supabase', iconUrl: '/icons/supabase.svg' },
      ],
      github: 'https://github.com/B-Blarr',
    },

    {
      title: '02',
      subtitle: 'El Pollo Loco',
      description:
        'Jump, run and throw game based on object-oriented approach. Help Pepe to find coins and tabasco salsa to fight against the crazy boss hen.',
      imageUrl: '/images/pollo-loco.jpg',
      techs: [
        { name: 'JavaScript', iconUrl: '/icons/javascript.svg' },
        { name: 'HTML', iconUrl: '/icons/html.svg' },
        { name: 'CSS', iconUrl: '/icons/css.svg' },
      ],
      github: 'https://github.com/B-Blarr/El-Pollo-Loco',
    },

    {
      title: '03',
      subtitle: 'Pokédex',
      description:
        'Based on the PokéAPI a simple library that provides and catalogues pokemon information.',
      imageUrl: '/images/pokedex.jpg',
      techs: [
        { name: 'JavaScript', iconUrl: '/icons/javascript.svg' },
        { name: 'HTML', iconUrl: '/icons/html.svg' },
        { name: 'CSS', iconUrl: '/icons/css.svg' },
        { name: 'REST-API', iconUrl: '/icons/rest-api.svg' },
      ],
      github: 'https://github.com/B-Blarr/Pokedex',
    },
  ];

  selectedProject: ProjectData | null = null;
  isOverlayOpen = false;

  openOverlay(project: ProjectData): void {
    this.selectedProject = project;
    this.isOverlayOpen = true;
  }

  closeOverlay(): void {
    this.isOverlayOpen = false;
  }

  nextProject() {
    const currentIndex = this.projectsList.indexOf(this.selectedProject!);
    const nextIndex = (currentIndex + 1) % this.projectsList.length;
    this.selectedProject = this.projectsList[nextIndex];
  }
}
