import { Component } from '@angular/core';
import { AnimatedButton } from '../../shared/components/animated-button/animated-button';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-skills',
  imports: [AnimatedButton, TranslatePipe, RouterLink],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {

}
