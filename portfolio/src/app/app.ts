import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeroWrapper } from './wrapper/hero-wrapper/hero-wrapper';
import { MainWrapper } from "./wrapper/main-wrapper/main-wrapper";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeroWrapper, MainWrapper],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('portfolio');
}
