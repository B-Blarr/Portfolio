import { Component } from '@angular/core';
import { Aboutme } from "../../layout/aboutme/aboutme";
import { Skills } from "../../layout/skills/skills";

@Component({
  selector: 'app-main-wrapper',
  imports: [Aboutme, Skills],
  templateUrl: './main-wrapper.html',
  styleUrl: './main-wrapper.scss',
})
export class MainWrapper {

}
