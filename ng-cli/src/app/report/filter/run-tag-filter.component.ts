import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Int64 = require('node-int64');

import {
  CompareData,
  ReportFilter,
  RunTagCount,
  RunTagCounts
} from '@cc/db-access';

import { SharedService } from '..';
import { DbService, UtilService } from '../../shared';
import { SelectFilterBase } from './select-filter-base';

@Component({
  selector: 'run-tag-filter',
  templateUrl: './select-filter-base.html',
  styleUrls: ['./select-filter-base.scss']
})
export class RunTagFilterComponent extends SelectFilterBase {
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
    const values: any[] = [];
    const unknownRunTag: any[] = [];
    for (const key of Object.keys(this.selectedItems)) {
      const item = this.selectedItems[key];
      if (item) {
        values.push(item.value);
      } else {
        unknownRunTag.push(key);
      }
    }

    return Promise.all(unknownRunTag.map(runTag => {
      return this.getRunTagCountByName(runTag);
    })).then((runTagCounts: any[]) => {
      for (let i = 0; i < unknownRunTag.length; ++i) {
        const runTag = unknownRunTag[i];
        const tagCount = runTagCounts[i];
        if (!this.selectedItems[runTag]) {
          this.selectedItems[runTag] = {
            label: runTag,
            value: tagCount.value,
            count: 'N/A'
          };
        }
        values.push(tagCount.value);
      }
      return values;
    });
  }

  getRunTagCountByName(tagName: string) {
    return new Promise((resolve, reject) => {
      const reportFilter = new ReportFilter();
      Object.assign(reportFilter, this.shared.reportFilter);

      const cmpData = new CompareData();

      this.dbService.getClient().getRunHistoryTagCounts(
      this.shared.runIds, reportFilter, cmpData).then(
      (runTagCounts: RunTagCounts) => {
        const tagCount = runTagCounts.filter((runTagCount: any) => {
          return runTagCount.name === tagName;
        });

        resolve({
          value: tagCount.length ? tagCount[0].time : null,
          count: tagCount.length ? tagCount[0].count.toNumber() : 'N/A'
        });
      });
    });
  }

  updateReportFilter(runTagIds: Int64[]) {
    // this.shared.reportFilter.runHistoryTag = runTagIds;
  }

  public notify() {
    this.dbService.getClient().getRunHistoryTagCounts(this.shared.runIds,
    this.shared.reportFilter, this.shared.cmpData).then(
    (runTagCounts: RunTagCounts) => {
      this.items = runTagCounts.map((runTagCount) => {
        const label = runTagCount.name;
        const item = {
          label: label,
          value: runTagCount.time,
          count: runTagCount.count,
          icon: 'tag'
        };

        if (this.selectedItems[label] !== undefined) {
          this.selectedItems[label] = item;
        }

        return item;
      });
    });
  }
}
