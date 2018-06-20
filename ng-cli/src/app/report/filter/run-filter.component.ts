import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverModule } from "ngx-popover";

import { DbService, UtilService } from '../../shared';
import { SelectFilterBase } from './select-filter-base';
import { SharedService } from '..';

let reportServerTypes = require('api/report_server_types');

@Component({
  selector: 'run-filter',
  templateUrl: './select-filter-base.html',
  styleUrls: ['./select-filter-base.scss']
})
export class RunFilterComponent extends SelectFilterBase
{
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
    let unknownRunNames: any[] = [];
    for(let key in this.selectedItems) {
      let item = this.selectedItems[key];
      if (item)
        values.push(item.value);
      else
        unknownRunNames.push(key);
    }

    return Promise.all(unknownRunNames.map(runName => {
      return this.getRunReportCountsByRunName(runName);
    })).then((runReportCounts: any[]) => {
      for (let i = 0; i < unknownRunNames.length; ++i) {
        let runName = unknownRunNames[i];
        let reportCount = runReportCounts[i];
        if (!this.selectedItems[runName])
          this.selectedItems[runName] = {
            label: runName,
            values: reportCount.runIds,
            count: reportCount.reportCount
          };
        values = values.concat(reportCount.runIds);
      }
      return values;
    });
  }

  getRunReportCountsByRunName(runName: string) {
    return new Promise((resolve, reject) => {
      let reportFilter = new reportServerTypes.ReportFilter();
      Object.assign(reportFilter, this.shared.reportFilter);
      reportFilter.runName = [runName];

      this.dbService.getRunReportCounts(null, reportFilter, null, null,
        (err:string, res) => {
          let runIds = res.map((reportCount: any) => {
            return reportCount.runId.toNumber();
          });

          resolve({
            runIds: runIds,
            reportCount: res.length == 1 ? res[0].reportCount : 'N/A'
            // TODO: Get report count of regex search.
          });
        });
    });
  }

  updateReportFilter(value: any) {
    this.shared.reportFilter.run = value;
  }

  public notify() {
    let limit = 10; // TODO
    let offset = 0; // TODO
    this.dbService.getRunReportCounts(null,
    this.shared.reportFilter, limit, offset,
    (err : any, runReportCounts: any[]) => {
      this.items = runReportCounts.map((runReport) => {
        let label = runReport.name;
        let item = {
          label: label,
          values: runReport.runId,
          count: runReport.reportCount
        };

        if (this.selectedItems[label] === null)
          this.selectedItems[label] = item;

        return item;
      });
    });
  }
}
