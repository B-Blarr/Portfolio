import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-animated-button',
  imports: [],
  templateUrl: './animated-button.html',
  styleUrl: './animated-button.scss',
})
export class AnimatedButton {
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' = "button";
  /**
   * Set to false when this button sits inside a surrounding <a>.
   * The link is then the only tab stop, so keyboard users do not
   * land on a shell element that does nothing.
   */
  @Input() tabbable: boolean = true;
}
