import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Int64 = require('node-int64');

import { SharedService } from '..';
import { DbService, UtilService } from '../../shared';
import { SelectFilterBase } from './select-filter-base';

@Component({
  selector: 'checker-message-filter',
  templateUrl: './select-filter-base.html',
  styleUrls: ['./select-filter-base.scss']
})
export class CheckerMessageFilterComponent extends SelectFilterBase {
  constructor(
    protected dbService: DbService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected shared: SharedService,
    protected util: UtilService
  ) {
    super('Checker message', route, router, shared, util);
  }

  updateReportFilter(checkerMessages: string[]) {
    this.shared.reportFilter.checkerMsg = checkerMessages;
  }

  getReportFilter() {
    const reportFilter = super.getReportFilter();
    reportFilter.checkerMsg = null;
    return reportFilter;
  }

  public notify() {
    const limit = new Int64(10);
    const offset = new Int64(0);

    this.dbService.getClient().getCheckerMsgCounts(
      this.getRunIds(),
      this.getReportFilter(),
      this.getCompareData(),
      limit,
      offset
    ).then((checkerMsgCounts: Map<string, Int64>) => {
      this.items = Array.from(checkerMsgCounts).map(([key, value]) => {
        const item = {
          label: key,
          count: value.toNumber()
        };

        if (this.selectedItems[key] !== undefined) {
          this.selectedItems[key] = item;
        }

        return item;
      });
    });
  }
}
