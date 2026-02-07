import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

@Component({
  selector: 'app-private-policy',
  imports: [ TranslatePipe, Footer, Header ],
  templateUrl: './private-policy.html',
  styleUrl: './private-policy.scss',
})
export class PrivatePolicy {

}
