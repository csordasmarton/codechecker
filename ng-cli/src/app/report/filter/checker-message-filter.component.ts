import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverModule } from "ngx-popover";

import { DbService, UtilService } from '../../shared';
import { SelectFilterBase } from './select-filter-base';
import { SharedService } from '..';

@Component({
  selector: 'checker-message-filter',
  templateUrl: './select-filter-base.html',
  styleUrls: ['./select-filter-base.scss']
})
export class CheckerMessageFilterComponent extends SelectFilterBase
{
  constructor(
    protected dbService: DbService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected shared: SharedService,
    protected util: UtilService
  ) {
    super('checker-message', 'Checker message', route, router, shared, util);
  }

  updateReportFilter(value: any) {
    this.shared.reportFilter.checkerMsg = value;
  }

  public notify() {
    let limit = 10;
    let offset = 0;
    this.dbService.getCheckerMsgCounts(this.shared.runIds,
    this.shared.reportFilter, this.shared.cmpData, limit, offset,
    (err : any, checkerMsgCounts: any[]) => {
      this.items = Object.keys(checkerMsgCounts).map((key) => {
        let item = {
          label: key,
          count: checkerMsgCounts[key].toNumber()
        };

        if (this.selectedItems[key] === null)
          this.selectedItems[key] = item;

        return item;
      });
    });
  }
}
