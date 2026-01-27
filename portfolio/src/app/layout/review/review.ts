import { Component } from '@angular/core';
import { Reference, ReferenceData } from '../../shared/components/reference/reference';

@Component({
  selector: 'app-review',
  imports: [Reference],
  templateUrl: './review.html',
  styleUrl: './review.scss',
})
export class Review {
  reviewList: ReferenceData[] = [
    {
      text: 'Benjamin has proven to be a reliable group partner. His technical skills and proactive approach were crucial to the success of our project.',
      evaluator: 'H. Janisch - Team Partner',
    },

    {
      text: 'I had the good fortune of working with Benjamin in a group project at the Developer Akademie that involved a lot of effort. He always stayed calm, cool and focused and made sure our team was set up for success. He is super knowledgeable, easy to work with and I would happily work with him again given the chance.',
      evaluator: 'A. Fischer - Team Partner',
    },

    {
      text: 'Our project benefited enormously from Benjamins efficient way of working.',
      evaluator: 'T. Schulz - Frontend Developer',
    },
  ];
}
