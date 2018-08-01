import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  ActivatedRouteSnapshot,
  RouterModule,
  RouterStateSnapshot
} from '@angular/router';

import { DataTableModule } from 'angular5-data-table';

import { StatisticsComponent } from '.';
import { DbService } from '../shared';
import { SharedModule } from '../shared/shared.module';
import { CheckerStatisticsComponent } from './checker-statistics.component';
import { SeverityStatisticsComponent } from './severity-statistics.component';

@NgModule({
  imports: [
    BrowserModule,
    DataTableModule.forRoot(),
    RouterModule,
    SharedModule
  ],
  declarations: [
    CheckerStatisticsComponent,
    SeverityStatisticsComponent,
    StatisticsComponent
  ],
  providers: [ DbService ]
})
export class StatisticsModule {}
