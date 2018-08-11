import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Int64 = require('node-int64');

import { CheckerCounts } from '@cc/db-access';

import { SharedService } from '..';
import { DbService, UtilService } from '../../shared';
import { SelectFilterBase } from './select-filter-base';

@Component({
  selector: 'checker-name-filter',
  templateUrl: './select-filter-base.html',
  styleUrls: ['./select-filter-base.scss']
})
export class CheckerNameFilterComponent extends SelectFilterBase {
  constructor(
    protected dbService: DbService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected shared: SharedService,
    protected util: UtilService
  ) {
    super('Checker name', route, router, shared, util);
  }

  updateReportFilter(checkerNames: string[]) {
    this.shared.reportFilter.checkerName = checkerNames;
  }

  getReportFilter() {
    const reportFilter = super.getReportFilter();
    reportFilter.checkerName = null;
    return reportFilter;
  }

  public notify() {
    const limit = new Int64(10);
    const offset = new Int64(0);

    this.dbService.getClient().getCheckerCounts(
      this.getRunIds(),
      this.getReportFilter(),
      this.getCompareData(),
      limit,
      offset
    ).then((checkerCounts: CheckerCounts) => {
      this.items = checkerCounts.map((checkerCount) => {
        const name = checkerCount.name;
        const item = {
          label: name,
          count: checkerCount.count.toNumber()
        };

        if (this.selectedItems[name] !== undefined) {
          this.selectedItems[name] = item;
        }

        return item;
      });
    });
  }
}
