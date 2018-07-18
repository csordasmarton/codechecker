import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverModule } from 'ngx-popover';

import { DbService, UtilService } from '../../shared';
import { SharedService } from '..';
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
    super('file', 'File', route, router, shared, util);
  }

  updateReportFilter(value: any) {
    this.shared.reportFilter.filepath = value;
  }

  public notify() {
    this.dbService.getFileCounts(this.shared.runIds,
    this.shared.reportFilter, this.shared.cmpData, null, null,
    (err: any, fileCounts: any[]) => {
      this.items = Object.keys(fileCounts).map((key) => {
        const item = {
          label: key,
          count: fileCounts[key].toNumber()
        };

        if (this.selectedItems[key] === null) {
          this.selectedItems[key] = item;
        }

        return item;
      });
    });
  }
}
