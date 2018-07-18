import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverModule } from 'ngx-popover';

const reportServerTypes = require('api/report_server_types');

import { DbService, UtilService } from '../../shared';
import { SelectFilterBase } from './select-filter-base';
import { SharedService } from '..';

@Component({
  selector: 'severity-filter',
  templateUrl: './select-filter-base.html',
  styleUrls: ['./select-filter-base.scss']
})
export class SeverityFilterComponent extends SelectFilterBase {
  constructor(
    protected dbService: DbService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected shared: SharedService,
    protected util: UtilService
  ) {
    super('severity', 'Severity', route, router, shared, util);
  }

  updateReportFilter(value: any) {
    this.shared.reportFilter.severity = value;
  }

  public notify() {
    this.dbService.getSeverityCounts(this.shared.runIds,
    this.shared.reportFilter, this.shared.cmpData,
    (err: any, severityCounts: any[]) => {
      this.items = Object.keys(reportServerTypes.Severity)
      .sort((a: any , b: any) => {
        if (reportServerTypes.Severity[a] > reportServerTypes.Severity[b]) {
          return -1;
        }
        if (reportServerTypes.Severity[a] < reportServerTypes.Severity[b]) {
          return 1;
        }
        return 0;
      }).map((key: any) => {
        const value: number = reportServerTypes.Severity[key];
        const label = this.stateEncoder(value);
        const item = {
          label: label,
          count: severityCounts[value] !== undefined
               ? severityCounts[value].toNumber()
               : 0,
          icon: 'severity-' + label.toLowerCase()
        };

        if (this.selectedItems[label] === null) {
          this.selectedItems[label] = item;
        }

        return item;
      });
    });
  }

  public stateEncoder(severity: number) {
    return this.util.severityFromCodeToString(severity);
  }

  public stateDecoder(severity: string) {
    return this.util.severityFromStringToCode(severity);
  }
}
