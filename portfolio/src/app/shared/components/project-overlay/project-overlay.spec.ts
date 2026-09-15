import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { ProjectData, ProjectOverlay } from './project-overlay';

const project: ProjectData = {
  title: 'Join',
  subtitle: 'Angular | TypeScript',
  descriptionKey: 'projects.join.description',
  imageUrl: '/images/join.png',
  techs: [{ iconUrl: '/icons/angular.svg', name: 'Angular' }],
  links: [
    { url: 'https://github.com/B-Blarr/join', labelKey: 'projects.githubButton' },
    { url: 'https://benjaminblarr.de/join', labelKey: 'projects.liveButton' },
  ],
};

describe('ProjectOverlay', () => {
  let fixture: ComponentFixture<ProjectOverlay>;
  let closed: ReturnType<typeof vi.fn>;
  let next: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ProjectOverlay],
      providers: [provideTranslateService()],
    });
    fixture = TestBed.createComponent(ProjectOverlay);
    fixture.componentRef.setInput('project', project);
    closed = vi.fn();
    next = vi.fn();
    fixture.componentInstance.closed.subscribe(closed);
    fixture.componentInstance.next.subscribe(next);
    await fixture.whenStable();
  });

  function click(selector: string): void {
    fixture.nativeElement.querySelector(selector).click();
  }

  it('closes on Escape', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(closed).toHaveBeenCalledTimes(1);
  });

  it('closes on a click on the backdrop, but not on a click inside the content', () => {
    click('.content');
    expect(closed).not.toHaveBeenCalled();

    click('.backdrop');
    expect(closed).toHaveBeenCalledTimes(1);
  });

  it('closes exactly once via the close button', () => {
    click('.close-btn');

    expect(closed).toHaveBeenCalledTimes(1);
  });

  it('asks for the next project without closing', () => {
    click('.next-project-button');

    expect(next).toHaveBeenCalledTimes(1);
    expect(closed).not.toHaveBeenCalled();
  });

  it('opens every link in a new tab, with the button inside the link', () => {
    const links: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.button-links a'),
    );

    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      project.links.map((link) => link.url),
    );
    for (const link of links) {
      expect(link.target).toBe('_blank');
      expect(link.rel).toContain('noopener');
      expect(link.querySelector('button')?.getAttribute('tabindex')).toBe('-1');
    }
  });
});
