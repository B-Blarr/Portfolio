import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { Assistant } from './assistant';

describe('Assistant', () => {
  let fixture: ComponentFixture<Assistant>;
  let component: Assistant;
  let httpTesting: HttpTestingController;
  let translate: TranslateService;

  const ANSWER = {
    kind: 'answer',
    answer: 'Coderr ist eine REST-API mit Django.',
    answered: true,
    sources: [{ source: 'projekte.md', heading: 'Coderr' }],
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [Assistant],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService({ lang: 'de', fallbackLang: 'en' }),
      ],
    });
    fixture = TestBed.createComponent(Assistant);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    translate = TestBed.inject(TranslateService);
    await fixture.whenStable();
  });

  afterEach(() => {
    httpTesting.verify();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function field(): HTMLTextAreaElement {
    return fixture.nativeElement.querySelector('textarea');
  }

  function ask(question = 'Was steckt hinter Coderr?'): void {
    component.question.setValue(question);
    component.submit();
  }

  function pressEnter(shiftKey = false): KeyboardEvent {
    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      shiftKey,
      bubbles: true,
      cancelable: true,
    });
    field().dispatchEvent(event);
    return event;
  }

  describe('validation, kept in line with the backend serializer', () => {
    it('rejects an empty question and one made of whitespace only', () => {
      component.question.setValue('');
      expect(component.question.hasError('required')).toBe(true);
      component.question.setValue('   ');
      expect(component.question.hasError('required')).toBe(true);
    });

    it('accepts a question up to 500 characters and rejects a longer one', () => {
      component.question.setValue('a'.repeat(500));
      expect(component.question.valid).toBe(true);
      component.question.setValue('a'.repeat(501));
      expect(component.question.hasError('maxlength')).toBe(true);
    });

    it('sends nothing and shows the error message when the question is empty', async () => {
      fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
      await fixture.whenStable();

      httpTesting.expectNone('/api/assistant/');
      expect(fixture.nativeElement.querySelector('.error-message')).not.toBeNull();
    });
  });

  describe('request', () => {
    it('posts the trimmed question and the current language', () => {
      ask('  Was steckt hinter Coderr?  ');

      const request = httpTesting.expectOne('/api/assistant/');
      expect(request.request.method).toBe('POST');
      expect(request.request.body).toEqual({
        question: 'Was steckt hinter Coderr?',
        lang: 'de',
      });
      request.flush(ANSWER);
    });

    it('sends the language the page is switched to', () => {
      translate.use('en');
      ask();

      const request = httpTesting.expectOne('/api/assistant/');
      expect(request.request.body.lang).toBe('en');
      request.flush(ANSWER);
    });

    it('does not send a second request while one is still running', () => {
      ask();
      const request = httpTesting.expectOne('/api/assistant/');

      ask('Eine zweite Frage');
      httpTesting.expectNone('/api/assistant/');

      request.flush(ANSWER);
    });

    it('sends the suggestion that was clicked', () => {
      component.askSuggestion(component.suggestionKeys[0]);

      const request = httpTesting.expectOne('/api/assistant/');
      expect(request.request.body.question).toBe(component.suggestionKeys[0]);
      request.flush(ANSWER);
    });
  });

  describe('the field', () => {
    it('submits on Enter and keeps the line break out of the question', () => {
      component.question.setValue('Was steckt hinter Coderr?');
      const event = pressEnter();

      expect(event.defaultPrevented).toBe(true);
      httpTesting.expectOne('/api/assistant/').flush(ANSWER);
    });

    it('leaves Shift and Enter to the browser so a line break is inserted', () => {
      component.question.setValue('Was steckt hinter Coderr?');
      const event = pressEnter(true);

      expect(event.defaultPrevented).toBe(false);
      httpTesting.expectNone('/api/assistant/');
    });

    it('grows with its content', () => {
      Object.defineProperty(field(), 'scrollHeight', { value: 96, configurable: true });
      component.autoResize();

      expect(field().style.height).toBe('96px');
    });
  });

  describe('answer', () => {
    it('shows the answer', () => {
      ask();
      httpTesting.expectOne('/api/assistant/').flush(ANSWER);

      expect(fixture.nativeElement.querySelector('.answer').textContent).toContain(
        'Coderr ist eine REST-API mit Django.',
      );
      expect(fixture.nativeElement.querySelector('.hint')).toBeNull();
    });

    it('points to the contact form when the knowledge base has no answer', () => {
      ask();
      httpTesting.expectOne('/api/assistant/').flush({ ...ANSWER, answered: false, sources: [] });

      expect(fixture.nativeElement.querySelector('.hint')).not.toBeNull();
    });

    it.each([
      ['greeting', 'assistant.greeting'],
      ['off_topic', 'assistant.offTopic'],
    ])('shows the own text for kind %j', (kind, key) => {
      ask();
      httpTesting.expectOne('/api/assistant/').flush({ kind });

      expect(fixture.nativeElement.querySelector('.answer').textContent).toContain(key);
    });

    it('drops a shown answer when the language is switched', () => {
      ask();
      httpTesting.expectOne('/api/assistant/').flush(ANSWER);
      expect(component.result).not.toBeNull();

      translate.use('en');

      expect(component.result).toBeNull();
      expect(fixture.nativeElement.querySelector('.answer')).toBeNull();
    });
  });

  describe('errors, never taken from the backend message', () => {
    it.each([
      [400, 'assistant.errors.invalid'],
      [403, 'assistant.errors.rejected'],
      [503, 'assistant.errors.unavailable'],
      [500, 'assistant.errors.generic'],
    ])('maps status %i to its own text', (status, key) => {
      ask();
      httpTesting
        .expectOne('/api/assistant/')
        .flush({ detail: 'Serverseitige Meldung' }, { status, statusText: 'Error' });

      expect(component.errorKey).toBe(key);
      expect(fixture.nativeElement.querySelector('.error-box').textContent).toContain(key);
    });

    it('turns Retry-After into whole minutes', () => {
      ask();
      httpTesting.expectOne('/api/assistant/').flush(null, {
        status: 429,
        statusText: 'Too Many Requests',
        headers: { 'Retry-After': '740' },
      });

      expect(component.errorKey).toBe('assistant.errors.rateLimited');
      expect(component.retryMinutes).toBe(13);
    });

    it('falls back to a text without a time when Retry-After is missing', () => {
      ask();
      httpTesting
        .expectOne('/api/assistant/')
        .flush(null, { status: 429, statusText: 'Too Many Requests' });

      expect(component.errorKey).toBe('assistant.errors.rateLimitedSoon');
    });

    it('stops waiting after 70 seconds', () => {
      vi.useFakeTimers();
      ask();
      httpTesting.expectOne('/api/assistant/');

      vi.advanceTimersByTime(70_000);

      expect(component.errorKey).toBe('assistant.errors.timeout');
      expect(component.isLoading).toBe(false);
    });
  });
});
