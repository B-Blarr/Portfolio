import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { HeroSection } from "./layout/hero-section/hero-section";
import { HeroWrapper } from './wrapper/hero-wrapper/hero-wrapper';
import { MainWrapper } from "./wrapper/main-wrapper/main-wrapper";
import { Aboutme } from "./layout/aboutme/aboutme";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, HeroSection, HeroWrapper, MainWrapper, Aboutme],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('portfolio');
}
