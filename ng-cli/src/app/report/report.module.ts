import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  RouterModule,
} from '@angular/router';

import { DataTableModule } from 'angular5-data-table';
import { PopoverModule } from 'ngx-popover';

import { SharedModule } from '../shared/shared.module';
import { ReportComponent } from './report.component';
import { SharedService } from './shared.service';

import {
  CheckerMessageFilterComponent,
  CheckerNameFilterComponent,
  ClearAllReportsComponent,
  DetectionStatusFilterComponent,
  FileFilterComponent,
  ReportCountComponent,
  ReportFilterComponent,
  ReportHashFilterComponent,
  ReviewStatusFilterComponent,
  RunFilterComponent,
  RunTagFilterComponent,
  SeverityFilterComponent,
  SourceComponentComponent,
  UniqueReportsFilterComponent
} from './filter';

@NgModule({
  imports: [
    BrowserModule,
    DataTableModule,
    FormsModule,
    RouterModule,
    SharedModule,
    PopoverModule
  ],
  declarations: [
    ClearAllReportsComponent,
    CheckerMessageFilterComponent,
    CheckerNameFilterComponent,
    DetectionStatusFilterComponent,
    ReportCountComponent,
    FileFilterComponent,
    ReportComponent,
    ReportFilterComponent,
    ReportHashFilterComponent,
    ReviewStatusFilterComponent,
    RunFilterComponent,
    RunTagFilterComponent,
    SeverityFilterComponent,
    SourceComponentComponent,
    UniqueReportsFilterComponent
  ],
  exports: [
    ClearAllReportsComponent,
    CheckerMessageFilterComponent,
    CheckerNameFilterComponent,
    DetectionStatusFilterComponent,
    ReportCountComponent,
    FileFilterComponent,
    ReportComponent,
    ReportFilterComponent,
    ReportHashFilterComponent,
    ReviewStatusFilterComponent,
    RunFilterComponent,
    RunTagFilterComponent,
    SeverityFilterComponent,
    SourceComponentComponent,
    UniqueReportsFilterComponent
  ],
  providers: [ SharedService ]
})
export class ReportModule {}
