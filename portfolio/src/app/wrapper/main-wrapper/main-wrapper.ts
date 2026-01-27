import { Component } from '@angular/core';
import { Aboutme } from "../../layout/aboutme/aboutme";
import { Skills } from "../../layout/skills/skills";
import { Projects } from "../../layout/projects/projects";
import { Review } from "../../layout/review/review";

@Component({
  selector: 'app-main-wrapper',
  imports: [Aboutme, Skills, Projects, Review],
  templateUrl: './main-wrapper.html',
  styleUrl: './main-wrapper.scss',
})
export class MainWrapper {

}
