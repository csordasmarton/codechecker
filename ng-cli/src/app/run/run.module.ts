import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  ActivatedRouteSnapshot,
  RouterModule,
  RouterStateSnapshot
} from '@angular/router';

import { DataTableModule } from 'angular5-data-table';

import { DbService } from '../shared';
import { SharedModule } from '../shared/shared.module';
import { RunListComponent } from './run-list.component';

@NgModule({
  imports: [
    BrowserModule,
    DataTableModule.forRoot(),
    RouterModule,
    SharedModule
  ],
  declarations: [
    RunListComponent
  ],
  providers: [ DbService ]
})
export class RunModule {}
