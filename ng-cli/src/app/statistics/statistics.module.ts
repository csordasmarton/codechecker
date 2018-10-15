import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  RouterModule,
} from '@angular/router';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { StatisticsComponent } from '.';
import { ReportModule } from '../report/report.module';
import { DbService } from '../shared';
import { SharedModule } from '../shared/shared.module';
import { CheckerStatisticsComponent } from './checker-statistics';
import { SeverityStatisticsComponent } from './severity-statistics';
import { StatisticsFilterComponent } from './statistics-filter';

@NgModule({
  imports: [
    BrowserModule,
    NgxDatatableModule,
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
