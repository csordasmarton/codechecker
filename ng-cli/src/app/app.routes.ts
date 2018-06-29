import { Routes } from '@angular/router';

import { AuthGuard } from './_guards';
import { BugComponent } from './bug';
import { LoginComponent } from './login';
import {
  ProductComponent,
  ProductDetailComponent,
  ProductNewComponent,
  ProductEditComponent } from './product';
import { ReportComponent } from './report';
import { RunListComponent } from './run';
import { CheckerStatisticsComponent } from './statistics';

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
    path: ':product',
    component: ProductDetailComponent,
    children: [
      { path: '', redirectTo: 'runs', pathMatch: 'full' },
      { path: 'runs', component: RunListComponent },
      { path: 'statistics', component: CheckerStatisticsComponent },
      { path: 'reports', component: ReportComponent },
      { path: 'bug', component: BugComponent }
    ],
    canActivate: [AuthGuard]
  }
];