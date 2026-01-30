import { Component } from '@angular/core';
import { AnimatedButton } from '../../shared/components/animated-button/animated-button';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-skills',
  imports: [AnimatedButton, TranslatePipe],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {

}
