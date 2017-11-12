import { Routes } from '@angular/router';

import { BugComponent } from './bug';
import { ProductComponent, ProductDetailComponent } from './product';
import { ReportComponent } from './report';
import { RunListComponent } from './run';

export const ROUTES: Routes = [
  { path: '', component: ProductComponent },
  { path: ':product', component: ProductDetailComponent,
    children: [
      { path: '', redirectTo: 'runs', pathMatch: 'full' },
      { path: 'runs', component: RunListComponent },
      { path: 'reports', component: ReportComponent },
      { path: 'bug', component: BugComponent }
    ]
  }
];