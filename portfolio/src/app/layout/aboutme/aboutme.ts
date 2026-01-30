import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-aboutme',
  imports: [ TranslatePipe],
  templateUrl: './aboutme.html',
  styleUrl: './aboutme.scss',
})
export class Aboutme {

}
