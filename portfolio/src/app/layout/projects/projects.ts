// import { Component } from '@angular/core';
// import { ProjectOverlay} from '../../shared/components/project-overlay/project-overlay';

// @Component({
//   selector: 'app-projects',
//   imports: [ProjectOverlay],
//   templateUrl: './projects.html',
//   styleUrl: './projects.scss',
// })
// export class Projects {

// }

import { Component } from '@angular/core';
import {
  ProjectOverlay,
  ProjectData,
} from '../../shared/components/project-overlay/project-overlay';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-projects',
  imports: [ProjectOverlay, NgIf],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
// export class Projects {
//   projects: ProjectData[] = [
//     {
//       title: 'Join',
//       subtitle: 'Kanban Board',
//       description: 'A task manager with auth and realtime features.',
//       imageUrl: 'assets/img/projects/join.png',
//       techs: [
//         { name: 'Angular', iconUrl: 'assets/img/tech/angular.svg' },
//         { name: 'TypeScript', iconUrl: 'assets/img/tech/typescript.svg' },
//       ],
//     },
//     {
//       title: 'Pokedex',
//       subtitle: 'PokeAPI App',
//       description: 'Search, filter and detail views powered by an API.',
//       imageUrl: 'assets/img/projects/pokedex.png',
//       techs: [
//         { name: 'HTML', iconUrl: 'assets/img/tech/html.svg' },
//         { name: 'CSS', iconUrl: 'assets/img/tech/css.svg' },
//       ],
//     },
//   ];

//   selectedProject: ProjectData = this.projects[0];
// }
export class Projects {
  joinProject: ProjectData = {
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
  };

  selectedProject: ProjectData | null = null;
  isOverlayOpen = false;

  openJoinOverlay(): void {
    this.selectedProject = this.joinProject;
    this.isOverlayOpen = true;
  }

  closeOverlay(): void {
    this.isOverlayOpen = false;
  }
}
