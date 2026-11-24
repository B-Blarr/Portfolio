import { booleanAttribute, Component, Input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-animated-button',
  imports: [NgTemplateOutlet],
  templateUrl: './animated-button.html',
  styleUrl: './animated-button.scss',
})
export class AnimatedButton {
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' = 'button';
  /**
   * Set when this button sits inside a surrounding <a>. It then renders a
   * plain <span> with the same look, so the link stays the only tab stop and
   * screen readers announce one link instead of a button inside a link.
   */
  @Input({ transform: booleanAttribute }) insideLink = false;
}
