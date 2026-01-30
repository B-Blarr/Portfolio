import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';



export type ReferenceData = {
  textKey: string;
  evaluatorKey: string;
}

@Component({
  selector: 'app-reference',
  imports: [TranslatePipe],
  templateUrl: './reference.html',
  styleUrl: './reference.scss',
})
export class Reference {
@Input({ required: true }) reference!: ReferenceData;






}
