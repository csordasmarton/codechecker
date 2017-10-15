import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterModule,
  RouterStateSnapshot
} from '@angular/router';
import { BrowserModule }  from '@angular/platform-browser';

import { ReportComponent } from './report.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule
  ],
  declarations: [
    ReportComponent
  ]
})
export class ReportModule {}