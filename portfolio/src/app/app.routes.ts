import { PrivatePolicyWrapper } from './wrapper/private-policy-wrapper/private-policy-wrapper';
import { Routes } from '@angular/router';
import { Home } from './layout/home/home';
import { ImprintWrapper } from './wrapper/imprint-wrapper/imprint-wrapper';

export const routes: Routes = [
  {path:"", component: Home},
  {path:"legal-notice", component: ImprintWrapper},
  {path:"private-policy", component: PrivatePolicyWrapper}
];
