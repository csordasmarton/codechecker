import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Int64 = require('node-int64');

import { Severity } from '@cc/db-access';

import { SharedService } from '..';
import { DbService, UtilService } from '../../shared';
import { SelectFilterBase } from './select-filter-base';


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

  updateReportFilter(severities: Severity[]) {
    this.shared.reportFilter.severity = severities;
  }

  public notify() {
    this.dbService.getClient().getSeverityCounts(this.shared.runIds,
    this.shared.reportFilter, this.shared.cmpData).then(
    (severityCounts: Map<Severity, Int64>) => {
      this.items = Object.keys(Severity).filter(k => {
        return typeof Severity[k] === 'number';
      }).sort((a: string , b: string) => {
        if (Severity[a] > Severity[b]) {
          return -1;
        }
        if (Severity[a] < Severity[b]) {
          return 1;
        }
        return 0;
      }).map((key: string) => {
        const value: Severity = Severity[key];
        const label = this.stateEncoder(value);
        const item = {
          label: label,
          count: severityCounts.get(value) !== undefined
               ? severityCounts.get(value).toNumber()
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
