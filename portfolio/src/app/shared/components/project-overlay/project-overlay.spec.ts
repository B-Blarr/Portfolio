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

const projectWithVideo: ProjectData = {
  ...project,
  video: {
    language: 'de',
    src: '/videos/demo.mp4',
    srcSmall: '/videos/demo-720p.mp4',
    poster: '/videos/demo-poster.jpg',
    subtitles: [{ src: '/videos/demo.de.vtt', lang: 'de', label: 'Deutsch' }],
  },
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

  it('offers no video for a project without one', () => {
    expect(fixture.nativeElement.querySelector('.video-button')).toBeNull();
    expect(fixture.nativeElement.querySelector('.video-teaser')).toBeNull();
    expect(fixture.nativeElement.querySelector('.project-image').getAttribute('src')).toBe(
      project.imageUrl,
    );
  });

  describe('with a video', () => {
    beforeEach(async () => {
      // jsdom has no media playback.
      vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
      vi.spyOn(HTMLMediaElement.prototype, 'pause').mockReturnValue(undefined);
      vi.spyOn(HTMLMediaElement.prototype, 'load').mockReturnValue(undefined);
      fixture.componentRef.setInput('project', projectWithVideo);
      await fixture.whenStable();
    });

    afterEach(() => {
      // Destroy the fixture first: an open video still pauses itself then.
      TestBed.resetTestingModule();
      vi.restoreAllMocks();
    });

    function lightbox(): HTMLElement | null {
      return fixture.nativeElement.querySelector('app-video-lightbox');
    }

    it('shows the start image instead of the project image', () => {
      expect(fixture.nativeElement.querySelector('.video-still').getAttribute('src')).toBe(
        projectWithVideo.video!.poster,
      );
    });

    it('opens the video from the button and from the start image', async () => {
      expect(lightbox()).toBeNull();

      click('.video-button button');
      await fixture.whenStable();
      expect(lightbox()).not.toBeNull();

      click('app-video-lightbox .close-btn');
      await fixture.whenStable();
      expect(lightbox()).toBeNull();

      click('.video-teaser');
      await fixture.whenStable();
      expect(lightbox()).not.toBeNull();
    });

    it('closes only the video on the first Escape and the overlay on the second', async () => {
      click('.video-button button');
      await fixture.whenStable();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await fixture.whenStable();
      expect(lightbox()).toBeNull();
      expect(closed).not.toHaveBeenCalled();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(closed).toHaveBeenCalledTimes(1);
    });

    it('names the play button on the start image', () => {
      const teaser: HTMLElement = fixture.nativeElement.querySelector('.video-teaser');

      // Without loaded translations the pipe returns the key itself.
      expect(teaser.getAttribute('aria-label')).toBe('projects.videoPlay');
    });

    it('takes the content behind an open video out of reach', async () => {
      const content: HTMLElement = fixture.nativeElement.querySelector('.content');
      expect(content.hasAttribute('inert')).toBe(false);

      click('.video-button button');
      await fixture.whenStable();
      expect(content.hasAttribute('inert')).toBe(true);

      click('app-video-lightbox .close-btn');
      await fixture.whenStable();
      expect(content.hasAttribute('inert')).toBe(false);
    });

    it('returns the focus to the button that opened the video', async () => {
      const opener: HTMLButtonElement = fixture.nativeElement.querySelector('.video-button button');
      opener.focus();
      opener.click();
      await fixture.whenStable();
      expect(document.activeElement).not.toBe(opener);

      click('app-video-lightbox .close-btn');
      await fixture.whenStable();

      expect(document.activeElement).toBe(opener);
    });

    it('does not carry an open video over to the next project', async () => {
      click('.video-button button');
      await fixture.whenStable();

      click('.next-project-button');
      fixture.componentRef.setInput('project', project);
      await fixture.whenStable();
      fixture.componentRef.setInput('project', projectWithVideo);
      await fixture.whenStable();
      expect(lightbox()).toBeNull();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(closed).toHaveBeenCalledTimes(1);
    });

    it('keeps the overlay open when the video is closed by a click', async () => {
      click('.video-button button');
      await fixture.whenStable();

      click('app-video-lightbox .layer');
      await fixture.whenStable();

      expect(lightbox()).toBeNull();
      expect(closed).not.toHaveBeenCalled();
    });
  });
});
