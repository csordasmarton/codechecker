import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterModule,
  RouterStateSnapshot
} from '@angular/router';
import { BrowserModule }  from '@angular/platform-browser';

import { RunListComponent } from './run-list.component';
import { DbService } from '../shared';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule
  ],
  declarations: [
    RunListComponent
  ],
  providers: [ DbService ]
})
export class RunModule {}