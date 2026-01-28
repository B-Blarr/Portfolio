import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-animated-button',
  imports: [],
  templateUrl: './animated-button.html',
  styleUrl: './animated-button.scss',
})
export class AnimatedButton {
@Input() disabled: boolean = false;
}
