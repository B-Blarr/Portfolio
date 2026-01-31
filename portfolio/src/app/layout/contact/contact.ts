import { Component } from '@angular/core';
import { Form } from '../../shared/components/form/form';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  imports: [Form, ReactiveFormsModule, TranslatePipe, RouterLink],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {

}
