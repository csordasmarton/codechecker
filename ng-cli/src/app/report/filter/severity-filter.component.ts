import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverModule } from 'ngx-popover';

import Int64 = require('node-int64');

import { Severity } from '@cc/db-access';

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
    this.dbService.getClient().getSeverityCounts(this.shared.runIds,
    this.shared.reportFilter, this.shared.cmpData).then(
    (severityCounts: Map<Severity, Int64>) => {
      this.items = Object.keys(Severity)
      .sort((a: any , b: any) => {
        if (Severity[a] > Severity[b]) {
          return -1;
        }
        if (Severity[a] < Severity[b]) {
          return 1;
        }
        return 0;
      }).map((key: any) => {
        // TODO: FIX THIS.
        const value: any = Severity[key];
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
