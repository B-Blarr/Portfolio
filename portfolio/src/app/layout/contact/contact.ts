import { Component } from '@angular/core';
import { Form } from '../../shared/components/form/form';
import { AnimatedButton } from '../../shared/components/animated-button/animated-button';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [Form, AnimatedButton, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  isFormInvalid = true;
}
