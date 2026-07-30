import { Component, ChangeDetectorRef, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AnimatedButton } from '../animated-button/animated-button';
import { HttpClient } from '@angular/common/http';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, AnimatedButton, FormsModule, TranslatePipe, RouterLink],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class Form {
  http = inject(HttpClient);
  translate = inject(TranslateService);

  constructor(private cdr: ChangeDetectorRef) {}

  contactData = {
    name: '',
    mail: '',
    message: '',
  };

  ngOnInit() {
    this.userform.valueChanges.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  isFormInvalid = true;
  formSubmitted = false;
  mailSent = false;
  mailError = false;

  post = {
    endPoint: '/api/contact/',
    body: (payload: any) => payload,
  };

  userform = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.pattern(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/)],
    }),
    message: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(2500),
      ],
    }),
    privacyAccepted: new FormControl(false, {
      validators: [Validators.requiredTrue],
    }),
    // Honeypot: fuer Besucher unsichtbar. Nur Bots fuellen dieses Feld
    // aus, der Server verwirft solche Einsendungen stillschweigend.
    website: new FormControl(''),
  });

  onSubmit() {
    this.formSubmitted = true;

    this.mailSent = false;
    this.mailError = false;

    if (this.userform.valid) {
      this.http.post(this.post.endPoint, this.post.body(this.userform.value)).subscribe({
        next: () => {
          this.mailSent = true;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.formReset();
          }, 3000);
        },
        error: (error) => {
          console.error('Fehler beim E-Mail-Versand:', error);
          this.mailError = true;
        },
      });
    }
  }

  formReset() {
    this.formSubmitted = false;
    this.mailSent = false;
    this.mailError = false;
    this.userform.reset();
  }

  fillForm() {
    this.userform.setValue({
      name: 'Your name goes here.',
      email: 'youremail@email.com',
      message: 'Hello Benjamin, I am interested in...',
      privacyAccepted: false,
      website: '',
    });
  }

  autoResize(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
