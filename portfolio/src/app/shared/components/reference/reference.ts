import { Component, Input } from '@angular/core';



export type ReferenceData = {
  text: string;
  evaluator: string;
}

@Component({
  selector: 'app-reference',
  imports: [],
  templateUrl: './reference.html',
  styleUrl: './reference.scss',
})
export class Reference {
@Input({ required: true }) reference!: ReferenceData;






}
