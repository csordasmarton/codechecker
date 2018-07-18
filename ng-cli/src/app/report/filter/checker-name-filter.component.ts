import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverModule } from 'ngx-popover';

import { DbService, UtilService } from '../../shared';
import { SelectFilterBase } from './select-filter-base';
import { SharedService } from '..';

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
    const limit = 10;
    const offset = 0;
    this.dbService.getCheckerCounts(this.shared.runIds,
    this.shared.reportFilter, this.shared.cmpData, limit, offset,
    (err: any, checkerCounts: any[]) => {
      this.items = checkerCounts.map(checkerCount => {
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
