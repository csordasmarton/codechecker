import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  ActivatedRouteSnapshot,
  RouterModule,
  RouterStateSnapshot
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
  ReviewStatusFilterComponent,
  RunFilterComponent,
  RunTagFilterComponent,
  SeverityFilterComponent,
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
    ReviewStatusFilterComponent,
    RunFilterComponent,
    RunTagFilterComponent,
    SeverityFilterComponent,
    UniqueReportsFilterComponent
  ],
  providers: [ SharedService ]
})
export class ReportModule {}
