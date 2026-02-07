import { Component, ChangeDetectorRef, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
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
  mailTest = false;
  mailSent = false;
  mailError = false;

  post = {
    endPoint: '/sendMail.php',
    body: (payload: any) => JSON.stringify(payload),
    options: {
      headers: {
        'Content-Type': 'text/plain',
        responseType: 'text',
      },
    },
  };

  userform = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    message: new FormControl('', {
      validators: [Validators.required, Validators.maxLength(2500)],
    }),
    privacyAccepted: new FormControl(false, {
      validators: [Validators.requiredTrue],
    }),
  });

  onSubmit() {
    this.formSubmitted = true;

    this.mailSent = false;
    this.mailError = false;

    if (this.userform.valid && !this.mailTest) {
      // Echtes E-Mail-Versenden
      this.http.post(this.post.endPoint, this.post.body(this.userform.value)).subscribe({
        next: (response) => {
          console.log('E-Mail erfolgreich versendet:', response);
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
        complete: () => console.info('send post complete'),
      });
    } else if (this.userform.valid && this.mailTest) {
      // Test-Modus: Nur Formular zurücksetzen
      console.log('Test-Modus: Formular-Daten:', this.userform.value);
      this.mailSent = true;
      setTimeout(() => {
        this.formReset();
      }, 3000);

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
    });
  }

  autoResize(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
