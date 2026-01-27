import { Component } from '@angular/core';
import { Aboutme } from "../../layout/aboutme/aboutme";
import { Skills } from "../../layout/skills/skills";
import { Projects } from "../../layout/projects/projects";
import { Review } from "../../layout/review/review";
import { Contact } from "../../layout/contact/contact";

@Component({
  selector: 'app-main-wrapper',
  imports: [Aboutme, Skills, Projects, Review, Contact],
  templateUrl: './main-wrapper.html',
  styleUrl: './main-wrapper.scss',
})
export class MainWrapper {

}
