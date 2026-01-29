import { Component } from '@angular/core';
import { Form } from '../../shared/components/form/form';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [Form, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {

}
