import { Component } from '@angular/core';
import { Header } from '../header/header';
import { AnimatedButton } from '../../shared/components/animated-button/animated-button';

@Component({
  selector: 'app-hero-section',
  imports: [Header, AnimatedButton],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSection {

}
