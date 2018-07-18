import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverModule } from 'ngx-popover';

import { DbService, UtilService, RequestFailed } from '../../shared';
import { SelectFilterBase } from './select-filter-base';
import { SharedService } from '..';

const reportServerTypes = require('api/report_server_types');

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
      const reportFilter = new reportServerTypes.ReportFilter();
      Object.assign(reportFilter, this.shared.reportFilter);
      reportFilter.runName = [runName];

      this.dbService.getRunReportCounts(null, reportFilter, null, null,
        (err: RequestFailed, res) => {
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
    const limit = 10; // TODO
    const offset = 0; // TODO
    this.dbService.getRunReportCounts(null,
    this.shared.reportFilter, limit, offset,
    (err: RequestFailed, runReportCounts: any[]) => {
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
