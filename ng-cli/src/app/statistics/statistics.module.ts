import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  RouterModule,
} from '@angular/router';

import { DataTableModule } from 'angular5-data-table';

import { StatisticsComponent } from '.';
import { ReportModule } from '../report/report.module';
import { DbService } from '../shared';
import { SharedModule } from '../shared/shared.module';
import { CheckerStatisticsComponent } from './checker-statistics.component';
import { SeverityStatisticsComponent } from './severity-statistics.component';
import { StatisticsFilterComponent } from './statistics-filter.component';

@NgModule({
  imports: [
    BrowserModule,
    DataTableModule.forRoot(),
    ReportModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    CheckerStatisticsComponent,
    SeverityStatisticsComponent,
    StatisticsComponent,
    StatisticsFilterComponent
  ],
  providers: [ DbService ]
})
export class StatisticsModule {}
