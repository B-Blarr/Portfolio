import { Component } from '@angular/core';
import {ProjectOverlay,ProjectData,} from '../../shared/components/project-overlay/project-overlay';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-projects',
  imports: [ProjectOverlay, TranslatePipe],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})

export class Projects {
  projectsList: ProjectData[] = [
    {
      title: '01',
      subtitle: 'Join',
      descriptionKey: 'projects.join.description',
      imageUrl: '/images/join.jpg',
      techs: [
        { name: 'Angular', iconUrl: '/icons/angular.svg' },
        { name: 'TypeScript', iconUrl: '/icons/typescript.svg' },
        { name: 'HTML', iconUrl: '/icons/html.svg' },
        { name: 'SCSS', iconUrl: '/icons/sass.svg' },
        { name: 'Supabase', iconUrl: '/icons/supabase.svg' },
      ],
      github: 'https://github.com/B-Blarr',
      livetest: 'https://github.com/B-Blarr',
    },

    {
      title: '02',
      subtitle: 'El Pollo Loco',
      descriptionKey: 'projects.polloLoco.description',
      imageUrl: '/images/pollo-loco.jpg',
      techs: [
        { name: 'JavaScript', iconUrl: '/icons/javascript.svg' },
        { name: 'HTML', iconUrl: '/icons/html.svg' },
        { name: 'CSS', iconUrl: '/icons/css.svg' },
      ],
      github: 'https://github.com/B-Blarr/El-Pollo-Loco',
      livetest: 'https://github.com/B-Blarr',
    },

    {
      title: '03',
      subtitle: 'Pokédex',
      descriptionKey: 'projects.pokedex.description',
      imageUrl: '/images/pokedex.jpg',
      techs: [
        { name: 'JavaScript', iconUrl: '/icons/javascript.svg' },
        { name: 'HTML', iconUrl: '/icons/html.svg' },
        { name: 'CSS', iconUrl: '/icons/css.svg' },
        { name: 'REST-API', iconUrl: '/icons/rest-api.svg' },
      ],
      github: 'https://github.com/B-Blarr/Pokedex',
      livetest: 'https://github.com/B-Blarr',
    },
  ];

  selectedProject: ProjectData | null = null;
  isOverlayOpen = false;
  hoveredProjectSubtitle: string | null = null;

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

  setHover(subtitle: string): void {
  this.hoveredProjectSubtitle = subtitle;
}

clearHover(): void {
  this.hoveredProjectSubtitle = null;
}
}
