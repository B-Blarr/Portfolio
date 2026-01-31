import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Header } from "../header/header";
import { Footer } from "../footer/footer";

@Component({
  selector: 'app-legal-notice',
  imports: [TranslatePipe, Header, Footer],
  templateUrl: './legal-notice.html',
  styleUrl: './legal-notice.scss',
})
export class LegalNotice {

}
