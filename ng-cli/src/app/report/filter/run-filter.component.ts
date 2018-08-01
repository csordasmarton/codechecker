import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Int64 = require('node-int64');

import { ReportFilter, RunReportCount, RunReportCounts } from '@cc/db-access';

import { SharedService } from '..';
import { DbService, UtilService } from '../../shared';
import { SelectFilterBase } from './select-filter-base';

@Component({
  selector: 'run-filter',
  templateUrl: './select-filter-base.html',
  styleUrls: ['./select-filter-base.scss']
})
export class RunFilterComponent extends SelectFilterBase {
  constructor(
    protected dbService: DbService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected shared: SharedService,
    protected util: UtilService
  ) {
    super('run', 'Run name', route, router, shared, util);
  }

  getSelectedItemValues() {
    let values: any[] = [];
    const unknownRunNames: any[] = [];
    for (const key of Object.keys(this.selectedItems)) {
      const item = this.selectedItems[key];
      if (item) {
        values.push(item.value);
      } else {
        unknownRunNames.push(key);
      }
    }

    return Promise.all(unknownRunNames.map(runName => {
      return this.getRunReportCountsByRunName(runName);
    })).then((runReportCounts: any[]) => {
      for (let i = 0; i < unknownRunNames.length; ++i) {
        const runName = unknownRunNames[i];
        const reportCount = runReportCounts[i];
        console.log(reportCount);
        if (!this.selectedItems[runName]) {
          this.selectedItems[runName] = {
            label: runName,
            values: reportCount.runIds,
            count: reportCount.reportCount
          };
        }
        values = values.concat(reportCount.runIds);
      }
      return values;
    });
  }

  getRunReportCountsByRunName(runName: string) {
    return new Promise((resolve, reject) => {
      const reportFilter = new ReportFilter();
      Object.assign(reportFilter, this.shared.reportFilter);
      reportFilter.runName = [runName];

      const limit: Int64 = new Int64(500);
      const offset: Int64 = new Int64(500);

      this.dbService.getClient().getRunReportCounts([], reportFilter, limit,
      offset).then((res: RunReportCount[]) => {
          const runIds = res.map((reportCount: any) => {
            return reportCount.runId.toNumber();
          });

          resolve({
            runIds: runIds,
            reportCount: res.length === 1 ? res[0].reportCount : 'N/A'
            // TODO: Get report count of regex search.
          });
        });
    });
  }

  updateReportFilter(value: any) {
    this.shared.reportFilter.run = value;
  }

  public notify() {
    const limit = new Int64(10);
    const offset = new Int64(0);

    this.dbService.getClient().getRunReportCounts([],
    this.shared.reportFilter, limit, offset).then(
    (runReportCounts: RunReportCounts) => {
      this.items = runReportCounts.map((runReport) => {
        const label = runReport.name;
        const item = {
          label: label,
          values: runReport.runId,
          count: runReport.reportCount
        };

        if (this.selectedItems[label] === null) {
          this.selectedItems[label] = item;
        }

        return item;
      });
    });
  }
}
