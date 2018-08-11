import { Component } from '@angular/core';

import Int64 = require('node-int64');

import { RunFilterComponent } from './run-filter.component';

@Component({
  selector: 'run-newcheck-filter',
  templateUrl: './select-filter-base.html',
  styleUrls: ['./select-filter-base.scss']
})
export class RunNewcheckFilterComponent extends RunFilterComponent {
  updateReportFilter(runIds: Int64[]) {
    this.shared.cmpData.runIds = runIds;
  }
}
