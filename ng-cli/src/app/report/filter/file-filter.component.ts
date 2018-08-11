import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Int64 = require('node-int64');

import { SharedService } from '..';
import { DbService, UtilService } from '../../shared';
import { SelectFilterBase } from './select-filter-base';

@Component({
  selector: 'file-filter',
  templateUrl: './select-filter-base.html',
  styleUrls: ['./select-filter-base.scss']
})
export class FileFilterComponent extends SelectFilterBase {
  constructor(
    protected dbService: DbService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected shared: SharedService,
    protected util: UtilService
  ) {
    super('File', route, router, shared, util);
  }

  updateReportFilter(filePaths: string[]) {
    this.shared.reportFilter.filepath = filePaths;
  }

  getReportFilter() {
    const reportFilter = super.getReportFilter();
    reportFilter.filepath = null;
    return reportFilter;
  }

  public notify() {
    const limit = new Int64(10);
    const offset = new Int64(0);

    this.dbService.getClient().getFileCounts(
      this.getRunIds(),
      this.getReportFilter(),
      this.getCompareData(),
      limit,
      offset
    ).then((fileCounts: Map<string, Int64>) => {
      this.items = Array.from(fileCounts).map(([key, value]) => {
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
