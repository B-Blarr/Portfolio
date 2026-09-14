import { Component } from '@angular/core';
import {
  ProjectOverlay,
  ProjectData,
} from '../../shared/components/project-overlay/project-overlay';
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
      links: [
        { url: 'https://github.com/B-Blarr/join', labelKey: 'projects.githubButton' },
        { url: 'https://benjaminblarr.de/join', labelKey: 'projects.liveButton' },
      ],
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
      links: [
        { url: 'https://github.com/B-Blarr/El-Pollo-Loco', labelKey: 'projects.githubButton' },
        { url: 'https://benjaminblarr.de/el-pollo-loco', labelKey: 'projects.liveButton' },
      ],
    },

    {
      title: '03',
      subtitle: 'Cardelia',
      descriptionKey: 'projects.cardelia.description',
      imageUrl: '/images/cardelia.jpg',
      techs: [
        { name: 'Python', iconUrl: '/icons/python.svg' },
        { name: 'Django', iconUrl: '/icons/django.svg' },
        { name: 'PostgreSQL', iconUrl: '/icons/postgresql.svg' },
        { name: 'Supabase', iconUrl: '/icons/supabase.svg' },
      ],
      // Kein Repository und keine oeffentliche Fassung. Beide Knoepfe zeigen
      // auf die Architekturseite, der zweite auf den Bilderteil darin.
      links: [
        { url: 'https://benjaminblarr.de/cardelia/', labelKey: 'projects.architectureButton' },
        {
          url: 'https://benjaminblarr.de/cardelia/#bilder',
          labelKey: 'projects.screenshotsButton',
        },
      ],
    },

    {
      title: '04',
      subtitle: 'Coderr',
      descriptionKey: 'projects.coderr.description',
      imageUrl: '/images/coderr.jpg',
      techs: [
        { name: 'Python', iconUrl: '/icons/python.svg' },
        { name: 'Django', iconUrl: '/icons/django.svg' },
        { name: 'REST-API', iconUrl: '/icons/rest-api.svg' },
        { name: 'Linux', iconUrl: '/icons/linux.svg' },
      ],
      links: [
        { url: 'https://github.com/B-Blarr/Coderr-Backend', labelKey: 'projects.githubButton' },
        { url: 'https://coderr.benjaminblarr.de', labelKey: 'projects.liveButton' },
      ],
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

  nextProject(): void {
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
