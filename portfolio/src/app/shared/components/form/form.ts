import { Component, ChangeDetectorRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnimatedButton } from '../animated-button/animated-button';
import { HttpClient } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, AnimatedButton, TranslatePipe, RouterLink],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class Form implements OnInit {
  http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.userform.valueChanges.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  formSubmitted = false;
  mailSent = false;
  mailError = false;

  post = {
    endPoint: '/api/contact/',
  };

  userform = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern(
          /^\s*[a-zA-Z0-9_%+-]+(?:\.[a-zA-Z0-9_%+-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\s*$/,
        ),
      ],
    }),
    message: new FormControl('', {
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(2500)],
    }),
    privacyAccepted: new FormControl(false, {
      validators: [Validators.requiredTrue],
    }),
    // Honeypot
    website: new FormControl(''),
  });

  onSubmit() {
    this.formSubmitted = true;

    this.mailSent = false;
    this.mailError = false;

    if (this.userform.valid) {
      this.http.post(this.post.endPoint, this.userform.value).subscribe({
        next: () => {
          this.mailSent = true;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.formReset();
          }, 3000);
        },
        error: (error) => {
          console.error('Contact form submission failed:', error);
          this.mailError = true;
          this.cdr.detectChanges();
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

  autoResize(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
