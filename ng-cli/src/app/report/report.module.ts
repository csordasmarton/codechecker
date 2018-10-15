import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  RouterModule,
} from '@angular/router';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PopoverModule } from 'ngx-popover';

import { SharedModule } from '../shared/shared.module';
import { ReportComponent } from './report.component';
import { SharedService } from './shared.service';

import {
  BaselineFiltersComponent,
  CheckerMessageFilterComponent,
  CheckerNameFilterComponent,
  ClearAllReportsComponent,
  DetectionStatusFilterComponent,
  FileFilterComponent,
  FilterToggleDirective,
  NewcheckFiltersComponent,
  ReportCountComponent,
  ReportFilterComponent,
  ReportHashFilterComponent,
  ReviewStatusFilterComponent,
  RunFilterComponent,
  RunNewcheckFilterComponent,
  RunTagFilterComponent,
  RunTagNewcheckFilterComponent,
  SeverityFilterComponent,
  SourceComponentComponent,
  UniqueReportsFilterComponent
} from './filter';

@NgModule({
  imports: [
    BrowserModule,
    NgxDatatableModule,
    FormsModule,
    RouterModule,
    SharedModule,
    PopoverModule
  ],
  declarations: [
    BaselineFiltersComponent,
    ClearAllReportsComponent,
    CheckerMessageFilterComponent,
    CheckerNameFilterComponent,
    DetectionStatusFilterComponent,
    ReportCountComponent,
    FileFilterComponent,
    FilterToggleDirective,
    NewcheckFiltersComponent,
    ReportComponent,
    ReportFilterComponent,
    ReportHashFilterComponent,
    ReviewStatusFilterComponent,
    RunFilterComponent,
    RunNewcheckFilterComponent,
    RunTagFilterComponent,
    RunTagNewcheckFilterComponent,
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
    FilterToggleDirective,
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
