import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { ProjectVideo, VideoLightbox } from './video-lightbox';

const video: ProjectVideo = {
  language: 'de',
  src: '/videos/demo.mp4',
  srcSmall: '/videos/demo-720p.mp4',
  poster: '/videos/demo-poster.jpg',
  subtitles: [
    { src: '/videos/demo.de.vtt', lang: 'de', label: 'Deutsch' },
    { src: '/videos/demo.en.vtt', lang: 'en', label: 'English' },
  ],
};

describe('VideoLightbox', () => {
  let fixture: ComponentFixture<VideoLightbox>;
  let closed: ReturnType<typeof vi.fn>;
  let play: ReturnType<typeof vi.spyOn>;

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
  });

  beforeEach(async () => {
    play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockReturnValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockReturnValue(undefined);

    TestBed.configureTestingModule({
      imports: [VideoLightbox],
      providers: [provideTranslateService()],
    });
    TestBed.inject(TranslateService).use('de');
    fixture = TestBed.createComponent(VideoLightbox);
    fixture.componentRef.setInput('video', video);
    closed = vi.fn();
    fixture.componentInstance.closed.subscribe(closed);
    await fixture.whenStable();
  });

  function click(selector: string): void {
    fixture.nativeElement.querySelector(selector).click();
  }

  it('offers the small file to narrow screens first, then the full one', () => {
    const sources: HTMLSourceElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('source'),
    );

    expect(sources.map((source) => source.getAttribute('src'))).toEqual([
      video.srcSmall,
      video.src,
    ]);
    expect(sources[0].media).toContain('max-width');
  });

  it('lists every subtitle track and turns none on when the site matches the spoken language', () => {
    const tracks: HTMLTrackElement[] = Array.from(fixture.nativeElement.querySelectorAll('track'));

    expect(tracks.map((track) => track.srclang)).toEqual(['de', 'en']);
    for (const track of tracks) {
      expect(track.hasAttribute('default')).toBe(false);
    }
  });

  it('turns on the subtitles of a site language that differs from the spoken one', async () => {
    TestBed.inject(TranslateService).use('en');
    const english = TestBed.createComponent(VideoLightbox);
    english.componentRef.setInput('video', video);
    await english.whenStable();

    const tracks: HTMLTrackElement[] = Array.from(english.nativeElement.querySelectorAll('track'));

    expect(tracks.map((track) => track.hasAttribute('default'))).toEqual([false, true]);
  });

  it('closes on a click on the dark area, but not on a click on the player', () => {
    click('.box');
    expect(closed).not.toHaveBeenCalled();

    click('.layer');
    expect(closed).toHaveBeenCalledTimes(1);
  });

  it('closes exactly once via the close button', () => {
    click('.close-btn');

    expect(closed).toHaveBeenCalledTimes(1);
  });

  it('keeps its clicks away from the overlay behind it', () => {
    const outside = vi.fn();
    fixture.nativeElement.addEventListener('click', outside);

    click('.close-btn');
    click('.layer');

    expect(outside).not.toHaveBeenCalled();
  });

  it('closes on Escape and keeps the key from the overlay behind it', () => {
    const behind = vi.fn();
    document.addEventListener('keydown', behind);

    fixture.nativeElement
      .querySelector('video')
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    document.removeEventListener('keydown', behind);

    expect(closed).toHaveBeenCalledTimes(1);
    expect(behind).not.toHaveBeenCalled();
  });

  it('leads Tab from behind the player back to the close button', () => {
    fixture.nativeElement.querySelector('.focus-wrap').dispatchEvent(new FocusEvent('focus'));

    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('.close-btn'));
  });

  it('moves the focus to the close button', () => {
    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('.close-btn'));
  });

  it('stays open when a desktop visitor leaves fullscreen', () => {
    fixture.nativeElement.querySelector('video').dispatchEvent(new Event('fullscreenchange'));

    expect(closed).not.toHaveBeenCalled();
  });

  it('starts the video itself and plays it in the page', () => {
    expect(play).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.querySelector('video').hasAttribute('playsinline')).toBe(true);
  });

  it('stays open when a tablet visitor leaves the native fullscreen player', () => {
    fixture.nativeElement.querySelector('video').dispatchEvent(new Event('webkitendfullscreen'));

    expect(closed).not.toHaveBeenCalled();
  });

  it('stops the download when it is removed', () => {
    const player: HTMLVideoElement = fixture.nativeElement.querySelector('video');

    fixture.destroy();

    expect(player.querySelectorAll('source').length).toBe(0);
    expect(HTMLMediaElement.prototype.load).toHaveBeenCalled();
  });

  describe('on a phone', () => {
    let phone: ComponentFixture<VideoLightbox>;
    let phoneClosed: ReturnType<typeof vi.fn>;

    async function open(): Promise<void> {
      phone = TestBed.createComponent(VideoLightbox);
      phone.componentRef.setInput('video', video);
      phoneClosed = vi.fn();
      phone.componentInstance.closed.subscribe(phoneClosed);
      await phone.whenStable();
    }

    function player(): HTMLVideoElement {
      return phone.nativeElement.querySelector('video');
    }

    beforeEach(() => {
      vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
    });

    afterEach(() => {
      vi.unstubAllGlobals();
      delete (HTMLVideoElement.prototype as Partial<HTMLVideoElement>).requestFullscreen;
    });

    describe('with a fullscreen API', () => {
      let requestFullscreen: ReturnType<typeof vi.fn>;

      beforeEach(async () => {
        requestFullscreen = vi.fn().mockResolvedValue(undefined);
        HTMLVideoElement.prototype.requestFullscreen = requestFullscreen as never;
        await open();
      });

      it('sends the video to fullscreen right away', () => {
        expect(requestFullscreen).toHaveBeenCalledTimes(1);
      });

      it('closes once the visitor leaves fullscreen', () => {
        player().dispatchEvent(new Event('fullscreenchange'));

        expect(phoneClosed).toHaveBeenCalledTimes(1);
      });
    });

    describe('without a fullscreen API, as on an iPhone', () => {
      beforeEach(open);

      it('leaves fullscreen to the system player', () => {
        expect(player().hasAttribute('playsinline')).toBe(false);
      });

      it('closes once the visitor leaves the system player', () => {
        player().dispatchEvent(new Event('webkitendfullscreen'));

        expect(phoneClosed).toHaveBeenCalledTimes(1);
      });
    });
  });
});
