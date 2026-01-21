import { Component } from '@angular/core';
import { HeroSection } from '../../layout/hero-section/hero-section';

@Component({
  selector: 'app-hero-wrapper',
  imports: [HeroSection],
  templateUrl: './hero-wrapper.html',
  styleUrl: './hero-wrapper.scss',
})
export class HeroWrapper {

}
