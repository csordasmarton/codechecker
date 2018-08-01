import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  ActivatedRouteSnapshot,
  RouterModule,
  RouterStateSnapshot
} from '@angular/router';

import { DbService } from '../shared';
import { SharedModule } from '../shared/shared.module';
import { RunListComponent } from './run-list.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    RunListComponent
  ],
  providers: [ DbService ]
})
export class RunModule {}
