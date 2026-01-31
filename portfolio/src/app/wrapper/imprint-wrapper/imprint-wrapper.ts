import { Component } from '@angular/core';
import { LegalNotice } from "../../layout/legal-notice/legal-notice";

@Component({
  selector: 'app-imprint-wrapper',
  imports: [LegalNotice],
  templateUrl: './imprint-wrapper.html',
  styleUrl: './imprint-wrapper.scss',
})
export class ImprintWrapper {

}
