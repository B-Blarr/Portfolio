import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subscription, TimeoutError } from 'rxjs';
import { AnimatedButton } from '../../shared/components/animated-button/animated-button';
import {
  AssistantApi,
  AssistantResponse,
  MAX_QUESTION_LENGTH,
} from '../../shared/services/assistant-api';

/** Rejects a value that is empty once its surrounding whitespace is removed. */
function notBlank(control: AbstractControl): ValidationErrors | null {
  return control.value?.trim() ? null : { required: true };
}

@Component({
  selector: 'app-assistant',
  imports: [ReactiveFormsModule, TranslatePipe, AnimatedButton],
  templateUrl: './assistant.html',
  styleUrl: './assistant.scss',
})
export class Assistant implements OnInit, OnDestroy {
  private api = inject(AssistantApi);
  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);
  private langChange?: Subscription;

  @ViewChild('questionBox') private questionBox?: ElementRef<HTMLTextAreaElement>;

  readonly maxLength = MAX_QUESTION_LENGTH;

  readonly suggestionKeys = [
    'assistant.suggestions.stack',
    'assistant.suggestions.project',
    'assistant.suggestions.assistant',
  ];

  askForm = new FormGroup({
    question: new FormControl('', {
      nonNullable: true,
      validators: [notBlank, Validators.maxLength(MAX_QUESTION_LENGTH)],
    }),
  });

  /** Shorthand for the single control, used by the template. */
  get question(): FormControl<string> {
    return this.askForm.controls.question;
  }

  submitted = false;
  isLoading = false;
  result: AssistantResponse | null = null;
  errorKey: string | null = null;
  retryMinutes = 0;

  ngOnInit(): void {
    this.langChange = this.translate.onLangChange.subscribe(() => this.clearResult());
  }

  ngOnDestroy(): void {
    this.langChange?.unsubscribe();
  }

  /**
   * Submits on Enter. Shift+Enter is not bound here and therefore inserts a
   * line break, which is why the field is a textarea and not a single-line input.
   */
  onEnter(event: Event): void {
    event.preventDefault();
    this.submit();
  }

  /** Grows the field with its content, the same way the contact form does. */
  autoResize(): void {
    const field = this.questionBox?.nativeElement;
    if (!field) return;
    field.style.height = 'auto';
    field.style.height = `${field.scrollHeight}px`;
  }

  /** Sends the current question unless one is already on its way. */
  submit(): void {
    this.submitted = true;
    if (this.isLoading || this.askForm.invalid) return;

    this.isLoading = true;
    this.result = null;
    this.errorKey = null;

    this.api.ask(this.question.value.trim(), this.translate.getCurrentLang()).subscribe({
      next: (response) => this.handleResponse(response),
      error: (error: unknown) => this.handleError(error),
    });
  }

  /**
   * Fills the field with a suggested question and sends it straight away.
   *
   * @param key - Translation key of the suggestion.
   */
  askSuggestion(key: string): void {
    if (this.isLoading) return;
    this.question.setValue(this.translate.instant(key));
    this.autoResize();
    this.submit();
  }

  private handleResponse(response: AssistantResponse): void {
    this.isLoading = false;
    this.result = response;
    this.cdr.detectChanges();
  }

  private handleError(error: unknown): void {
    this.isLoading = false;
    this.result = null;
    this.retryMinutes = 0;
    this.errorKey = this.errorKeyFor(error);
    this.cdr.detectChanges();
  }

  /** Maps a failed request to a translation key. Backend messages are never shown. */
  private errorKeyFor(error: unknown): string {
    if (error instanceof TimeoutError) return 'assistant.errors.timeout';
    if (!(error instanceof HttpErrorResponse)) return 'assistant.errors.generic';

    switch (error.status) {
      case 400:
        return 'assistant.errors.invalid';
      case 403:
        return 'assistant.errors.rejected';
      case 429:
        this.retryMinutes = this.retryMinutesFrom(error);
        return this.retryMinutes > 1
          ? 'assistant.errors.rateLimited'
          : 'assistant.errors.rateLimitedSoon';
      case 503:
        return 'assistant.errors.unavailable';
      default:
        return 'assistant.errors.generic';
    }
  }

  /** Reads the `Retry-After` header and rounds it up to whole minutes. */
  private retryMinutesFrom(error: HttpErrorResponse): number {
    const seconds = Number(error.headers.get('Retry-After'));
    return Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds / 60) : 0;
  }

  /**
   * Drops a shown answer. The backend writes it in the language that was asked
   * for, so after a language switch it would no longer match the page.
   */
  private clearResult(): void {
    this.result = null;
    this.errorKey = null;
    this.submitted = false;
    this.cdr.detectChanges();
  }
}
