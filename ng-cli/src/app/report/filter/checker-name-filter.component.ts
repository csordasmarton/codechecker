import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverModule } from 'ngx-popover';

import Int64 = require('node-int64');

import { DbService, UtilService } from '../../shared';
import { SelectFilterBase } from './select-filter-base';
import { SharedService } from '..';
import { CheckerCount } from '../../../../api/codeCheckerDBAccess_v6';

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
    super('checker-name', 'Checker name', route, router, shared, util);
  }

  updateReportFilter(value: any) {
    this.shared.reportFilter.checkerId = value;
  }

  public notify() {
    const limit = new Int64(10);
    const offset = new Int64(0);

    this.dbService.getClient().getCheckerCounts(this.shared.runIds,
    this.shared.reportFilter, this.shared.cmpData, limit, offset).then(
      (checkerCounts: CheckerCount[]) => {
        this.items = checkerCounts.map((checkerCount) => {
          const name = checkerCount.name;
        const item = {
          label: name,
          count: checkerCount.count.toNumber()
        };

        if (this.selectedItems[name] === null) {
          this.selectedItems[name] = item;
        }

        return item;
        });
      });
  }
}
