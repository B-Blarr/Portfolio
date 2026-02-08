import { Component } from '@angular/core';
import { Header } from '../header/header';
import { AnimatedButton } from '../../shared/components/animated-button/animated-button';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  imports: [Header, AnimatedButton, TranslatePipe, RouterLink ],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSection {

}
