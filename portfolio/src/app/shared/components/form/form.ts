import { Component, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnimatedButton } from '../animated-button/animated-button';

@Component({
  selector: 'app-form',
  imports: [ ReactiveFormsModule, AnimatedButton],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class Form {
constructor(private cdr: ChangeDetectorRef) {}

ngOnInit() {

  this.userform.valueChanges.subscribe(() => {
    this.cdr.detectChanges();
  });
}

  isFormInvalid = true;
  formSubmitted = false;

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

formSubmit(){
this.formSubmitted = true;

  if (this.userform.valid) {
    console.warn(this.userform.value);

  }

}

formReset(){
  this.userform.reset();
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
