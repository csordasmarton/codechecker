import { Routes } from '@angular/router';

import { AuthGuard } from './_guards';
import { BugComponent } from './bug';
import { LoginComponent } from './login';
import { PermissionComponent } from './permission';
import {
  ProductComponent,
  ProductDetailComponent,
  ProductEditComponent,
  ProductNewComponent
} from './product';
import { ReportComponent } from './report';
import { RunListComponent } from './run';
import { StatisticsComponent } from './statistics';

export const ROUTES: Routes = [
  {
    path: '',
    component: ProductComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'products/new',
    component: ProductNewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'products/edit/:endpoint',
    component: ProductEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'products/permission/:endpoint',
    component: PermissionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':product',
    component: ProductDetailComponent,
    children: [
      { path: '', redirectTo: 'runs', pathMatch: 'full' },
      { path: 'runs', component: RunListComponent },
      { path: 'statistics', component: StatisticsComponent },
      { path: 'reports', component: ReportComponent },
      { path: 'bug', component: BugComponent }
    ],
    canActivate: [AuthGuard]
  }
];
