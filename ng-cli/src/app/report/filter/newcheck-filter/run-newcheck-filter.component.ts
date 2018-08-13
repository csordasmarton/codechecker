import { Component } from '@angular/core';

import Int64 = require('node-int64');

import { RunFilterComponent } from '../run-filter/run-filter.component';

@Component({
  selector: 'run-newcheck-filter',
  templateUrl: '../_base/select-filter-base.html',
  styleUrls: ['../_base/select-filter-base.scss']
})
export class RunNewcheckFilterComponent extends RunFilterComponent {
  updateReportFilter(runIds: Int64[]) {
    this.shared.cmpData.runIds = runIds;
  }
}
