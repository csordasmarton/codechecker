import { Routes } from '@angular/router';

import { BugComponent } from './bug';
import { HomeComponent } from './home';
import { ProductComponent } from './product';
import { ReportComponent } from './report';
import { RunListComponent } from './run';

export const ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: ProductComponent
      },
      {
        path: ':product',
        component: RunListComponent
      },
      {
        path: ':product/:report',
        component: ReportComponent
      },
      {
        path: ':product/:report/:bug',
        component: BugComponent
      }
    ]
  }
];