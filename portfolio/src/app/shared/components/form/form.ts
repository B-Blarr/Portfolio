import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnimatedButton } from '../animated-button/animated-button';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form',
  imports: [ ReactiveFormsModule, AnimatedButton, FormsModule ],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class Form {

http = inject(HttpClient);

constructor(private cdr: ChangeDetectorRef,

) {}

contactData = {
  name: "",
  mail: "",
  message: "",
}



ngOnInit() {

  this.userform.valueChanges.subscribe(() => {
    this.cdr.detectChanges();
  });
}

  isFormInvalid = true;
  formSubmitted = false;
  mailTest = false;

 post = {
    endPoint: 'https://deineDomain.de/sendMail.php',
    body: (payload: any) => JSON.stringify(payload),
    options: {
      headers: {
        'Content-Type': 'text/plain',
        responseType: 'text',
      },
    },
  };




  userform = new FormGroup({
    name: new FormControl("Your name goes here.", {
     validators: [Validators.required, Validators.minLength(3)]
    }),
     email: new FormControl("youremail@email.com", {
     validators: [Validators.required, Validators.email]
     }),
     message: new FormControl("Hello Benjamin, I am interested in...", {
     validators: [Validators.required, Validators.maxLength(2500)]
     }),
     privacyAccepted: new FormControl(false, {
      validators: [Validators.requiredTrue]
    })
  })

  getNamePlaceholder(): string {
    const nameControl = this.userform.get('name');

    if (nameControl?.touched && nameControl?.hasError('required')) {
      return 'Oops it seems your name is missing.';
    }
    if (nameControl?.touched && nameControl?.hasError('minlength')) {
      return 'Name must be at least 2 characters.';
    }
    return 'Your name goes here.';
  }

  getEmailPlaceholder(): string {
    const emailControl = this.userform.get('email');

    if (emailControl?.touched && emailControl?.hasError('required')) {
      return 'Hoppla! Your email is required.';
    }
    if (emailControl?.touched && emailControl?.hasError('email')) {
      return 'Please enter a valid email address.';
    }
    return 'youremail@email.com';
  }

  getMessagePlaceholder(): string {
    const messageControl = this.userform.get('message');

    if (messageControl?.touched && messageControl?.hasError('required')) {
      return 'What is your message to me?';
    }
    if (messageControl?.touched && messageControl?.hasError('maxlength')) {
      return 'Message is too long (max 2500 characters).';
    }
    return 'Hello Benjamin, I am interested in...';
  }

onSubmit(){

this.formSubmitted = true;

if (this.userform.valid && !this.mailTest) {
      // Echtes E-Mail-Versenden
      this.http.post(this.post.endPoint, this.post.body(this.userform.value))
        .subscribe({
          next: (response) => {
            console.log('E-Mail erfolgreich versendet:', response);
            this.formReset();
          },
          error: (error) => {
            console.error('Fehler beim E-Mail-Versand:', error);
          },
          complete: () => console.info('send post complete'),
        });
    } else if (this.userform.valid && this.mailTest) {
      // Test-Modus: Nur Formular zurücksetzen
      console.log('Test-Modus: Formular-Daten:', this.userform.value);
      this.formReset();
    }
}

formReset(){
  this.userform.reset();
  this.formSubmitted = false;
}

fillForm(){
  this.userform.setValue({
    name: "Your name goes here.",
    email: "youremail@email.com",
    message: "Hello Benjamin, I am interested in...",
    privacyAccepted: false,
  })
}





}
