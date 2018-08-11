import { Component } from '@angular/core';

import Int64 = require('node-int64');

import { RunTagFilterComponent } from './run-tag-filter.component';

@Component({
  selector: 'run-tag-newcheck-filter',
  templateUrl: './select-filter-base.html',
  styleUrls: ['./select-filter-base.scss']
})
export class RunTagNewcheckFilterComponent extends RunTagFilterComponent {
  updateReportFilter(runTagIds: Int64[]) {
    this.shared.cmpData.runTag = runTagIds;
  }
}
