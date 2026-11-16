import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

export interface VideoSubtitle {
  src: string;
  lang: string;
  label: string;
}

/**
 * A self-hosted video. `srcSmall` is the lighter file that narrow screens
 * load instead of `src`. `language` is the language spoken in the video.
 * Subtitles are offered in the player menu. They start switched off, except
 * for visitors who read the site in another language than the spoken one.
 */
export interface ProjectVideo {
  language: string;
  src: string;
  srcSmall: string;
  poster: string;
  subtitles: VideoSubtitle[];
}

/** Touch devices up to tablet width, where the video opens in fullscreen. */
const PHONE = '(pointer: coarse) and (max-width: 990px)';

type LockableOrientation = ScreenOrientation & { lock?: (orientation: string) => Promise<void> };

@Component({
  selector: 'app-video-lightbox',
  imports: [TranslatePipe],
  templateUrl: './video-lightbox.html',
  styleUrl: './video-lightbox.scss',
})
export class VideoLightbox implements AfterViewInit, OnDestroy {
  @Input({ required: true }) video!: ProjectVideo;
  @Output() closed = new EventEmitter<void>();

  @ViewChild('player') private player?: ElementRef<HTMLVideoElement>;
  @ViewChild('closeButton') private closeButton?: ElementRef<HTMLButtonElement>;

  private readonly phone =
    typeof window.matchMedia === 'function' && window.matchMedia(PHONE).matches;

  /**
   * iPhones have no fullscreen API for elements. Without `playsinline` iOS
   * opens its own fullscreen player as soon as the video starts, which is
   * what a phone should get. Everywhere else the video plays in the page.
   */
  readonly playsInline = !(this.phone && !('requestFullscreen' in HTMLVideoElement.prototype));

  private readonly siteLanguage = inject(TranslateService).getCurrentLang();

  private openedInFullscreen = false;

  // Listens in the capture phase and stops the event there, so the project
  // overlay behind does not close together with the video. Browsers keep key
  // events to themselves while the focus is inside the player's own controls,
  // which is why Tab leads back to the close button (see the template).
  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') return;
    event.stopImmediatePropagation();
    this.closed.emit();
  };

  ngAfterViewInit(): void {
    document.addEventListener('keydown', this.onKeydown, true);

    const video = this.player?.nativeElement;
    // Started by hand while the click still counts as a user gesture: the
    // fullscreen request below uses that gesture up, and some browsers then
    // refuse to start a video with sound from the autoplay attribute alone.
    void video?.play()?.catch(() => undefined);

    if (this.phone) {
      void this.enterFullscreen();
    } else {
      // Keyboard users continue inside the lightbox, not behind it.
      this.closeButton?.nativeElement.focus();
    }
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.onKeydown, true);

    // A removed video element keeps downloading until the browser collects
    // it. Dropping its sources stops the transfer right away.
    const video = this.player?.nativeElement;
    if (!video) return;
    video.pause();
    video.querySelectorAll('source').forEach((source) => source.remove());
    video.load();
  }

  /** Whether this track is shown without the visitor asking for it. */
  startsVisible(subtitle: VideoSubtitle): boolean {
    return this.siteLanguage !== this.video.language && subtitle.lang === this.siteLanguage;
  }

  onClose(event: Event): void {
    // The lightbox sits inside the overlay backdrop, whose own click handler
    // would close the whole project overlay.
    event.stopPropagation();
    this.closed.emit();
  }

  onFullscreenChange(): void {
    // A video this component sent to fullscreen is only ever shown that way,
    // so leaving fullscreen means the visitor is done with it. The flag and
    // not the media query decides: turning the phone changes its width.
    if (!document.fullscreenElement && this.openedInFullscreen) {
      this.closed.emit();
    }
  }

  onNativeFullscreenEnd(): void {
    // The same for the iOS player. Tablets fire this event too when someone
    // leaves fullscreen by hand, and there the lightbox stays.
    if (!this.playsInline) {
      this.closed.emit();
    }
  }

  private async enterFullscreen(): Promise<void> {
    const video = this.player?.nativeElement;
    if (!video?.requestFullscreen) return;
    try {
      await video.requestFullscreen();
      this.openedInFullscreen = true;
      // Upright, the video is too small to read. Android can turn the screen
      // itself, other systems reject the call.
      await (screen.orientation as LockableOrientation).lock?.('landscape');
    } catch {
      // Without fullscreen or orientation lock the player stays open in the page.
    }
  }
}
