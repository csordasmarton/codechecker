import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterModule,
  RouterStateSnapshot
} from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { DataTableModule } from 'angular5-data-table';

import { CheckerStatisticsComponent } from './checker-statistics.component';
import { SeverityStatisticsComponent } from './severity-statistics.component';
import { SharedModule } from '../shared/shared.module';
import { DbService } from '../shared';
import { StatisticsComponent } from '.';

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
