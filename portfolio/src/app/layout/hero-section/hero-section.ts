import { Component } from '@angular/core';
import { Header } from '../header/header';
import { AnimatedButton } from '../../shared/components/animated-button/animated-button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-hero-section',
  imports: [Header, AnimatedButton, TranslatePipe],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSection {

}
