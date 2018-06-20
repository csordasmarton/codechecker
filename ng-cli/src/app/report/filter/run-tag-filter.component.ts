import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverModule } from "ngx-popover";

import { DbService, UtilService } from '../../shared';
import { SelectFilterBase } from './select-filter-base';
import { SharedService } from '..';

let reportServerTypes = require('api/report_server_types');

@Component({
  selector: 'run-tag-filter',
  templateUrl: './select-filter-base.html',
  styleUrls: ['./select-filter-base.scss']
})
export class RunTagFilterComponent extends SelectFilterBase
{
  constructor(
    protected dbService: DbService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected shared: SharedService,
    protected util: UtilService
  ) {
    super('run-tag', 'Run tag', route, router, shared, util);
  }

  getSelectedItemValues() {
    let values: any[] = [];
    let unknownRunTag: any[] = [];
    for(let key in this.selectedItems) {
      let item = this.selectedItems[key];
      if (item)
        values.push(item.value);
      else
        unknownRunTag.push(key);
    }

    return Promise.all(unknownRunTag.map(runTag => {
      return this.getRunTagCountByName(runTag);
    })).then((runTagCounts: any[]) => {
      for (let i = 0; i < unknownRunTag.length; ++i) {
        let runTag = unknownRunTag[i];
        let tagCount = runTagCounts[i];
        if (!this.selectedItems[runTag])
          this.selectedItems[runTag] = {
            label: runTag,
            value: tagCount.value,
            count: 'N/A'
          };
        values.push(tagCount.value);
      }
      return values;
    });
  }

  getRunTagCountByName(tagName: string) {
    return new Promise((resolve, reject) => {
      let reportFilter = new reportServerTypes.ReportFilter();
      Object.assign(reportFilter, this.shared.reportFilter);

      this.dbService.getRunHistoryTagCounts(this.shared.runIds, reportFilter, null,
      (err:string, res) => {
        let tagCount = res.filter((runTagCount: any) => {
          return runTagCount.name === tagName;
        });

        resolve({
          value: tagCount.length ? tagCount[0].time : null,
          count: tagCount.length ? tagCount[0].count.toNumber() : 'N/A'
        });
    });
    });
  }

  updateReportFilter(value: any) {
    this.shared.reportFilter.runHistoryTag = value;
  }

  public notify() {
    this.dbService.getRunHistoryTagCounts(this.shared.runIds,
    this.shared.reportFilter, this.shared.cmpData,
    (err : any, runTagCounts: any[]) => {
      this.items = runTagCounts.map((runTagCount) => {
        let label = runTagCount.name;
        let item = {
          label: label,
          value: runTagCount.time,
          count: runTagCount.count,
          icon: 'tag'
        };

        if (this.selectedItems[label] !== undefined)
          this.selectedItems[label] = item;

        return item;
      });
    });
  }
}
