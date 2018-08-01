import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Int64 = require('node-int64');

import { DetectionStatus } from '@cc/db-access';

import { SharedService } from '..';
import { DbService, UtilService } from '../../shared';
import { SelectFilterBase } from './select-filter-base';

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
    const limit = new Int64(10);
    const offset = new Int64(0);

    this.dbService.getClient().getDetectionStatusCounts(this.shared.runIds,
    this.shared.reportFilter, this.shared.cmpData).then(
    (detectionStatusCounts: Map<DetectionStatus, Int64>) => {
      this.items = Array.from(detectionStatusCounts).map(([key, value]) => {
        const label = this.stateEncoder(key);
        const item = {
          label: label,
          count: value !== undefined ? value.toNumber() : 0,
          icon: 'detection-status-' + label.toLowerCase()
        };

        if (this.selectedItems[label] === null) {
          this.selectedItems[label] = item;
        }

        return item;
      });
    });
  }

  public stateEncoder(status: DetectionStatus) {
    return this.util.detectionStatusFromCodeToString(status);
  }

  public stateDecoder(status: string) {
    return this.util.detectionStatusFromStringToCode(status);
  }
}
