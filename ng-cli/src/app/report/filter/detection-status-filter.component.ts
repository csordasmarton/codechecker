import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverModule } from 'ngx-popover';

import { DbService, UtilService } from '../../shared';
import { SelectFilterBase } from './select-filter-base';
import { SharedService } from '..';

const reportServerTypes = require('api/report_server_types');

@Component({
  selector: 'detection-status-filter',
  templateUrl: './select-filter-base.html',
  styleUrls: ['./select-filter-base.scss']
})
export class DetectionStatusFilterComponent extends SelectFilterBase {
  constructor(
    protected dbService: DbService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected shared: SharedService,
    protected util: UtilService
  ) {
    super('detection-status', 'Detection status', route, router, shared, util);
  }

  updateReportFilter(value: any) {
    this.shared.reportFilter.detectionStatus = value;
  }

  public notify() {
    const limit = 10; // TODO
    const offset = 0; // TODO
    this.dbService.getDetectionStatusCounts(this.shared.runIds,
    this.shared.reportFilter, this.shared.cmpData,
    (err: any, detectionStatusCounts: any[]) => {
      this.items = Object.keys(reportServerTypes.DetectionStatus).map((key) => {
        const value: number = reportServerTypes.DetectionStatus[key];
        const label = this.stateEncoder(value);
        const item = {
          label: this.util.detectionStatusFromCodeToString(value),
          count: detectionStatusCounts[value] !== undefined
               ? detectionStatusCounts[value].toNumber()
               : 0,
          icon: 'detection-status-' + label.toLowerCase()
        };

        if (this.selectedItems[label] === null) {
          this.selectedItems[label] = item;
        }

        return item;
      });
    });
  }

  public stateEncoder(status: number) {
    return this.util.detectionStatusFromCodeToString(status);
  }

  public stateDecoder(status: string) {
    return this.util.detectionStatusFromStringToCode(status);
  }
}
