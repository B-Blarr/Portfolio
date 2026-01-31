import { Component } from '@angular/core';
import { HeroWrapper } from '../../wrapper/hero-wrapper/hero-wrapper';
import { MainWrapper } from '../../wrapper/main-wrapper/main-wrapper';

@Component({
  selector: 'app-home',
  imports: [ HeroWrapper, MainWrapper],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
