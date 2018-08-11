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
    super('Detection status', route, router, shared, util);
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
      this.items = Object.keys(DetectionStatus).filter(k => {
        return typeof DetectionStatus[k] === 'number';
      }).sort((a: string , b: string) => {
        if (DetectionStatus[a] > DetectionStatus[b]) {
          return -1;
        }
        if (DetectionStatus[a] < DetectionStatus[b]) {
          return 1;
        }
        return 0;
      }).map((key: string) => {
        const value: DetectionStatus = DetectionStatus[key];
        const label = this.stateEncoder(value);
        const item = {
          label: label,
          count: detectionStatusCounts.get(value) !== undefined
               ? detectionStatusCounts.get(value).toNumber()
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

  public stateEncoder(status: DetectionStatus) {
    return this.util.detectionStatusFromCodeToString(status);
  }

  public stateDecoder(status: string) {
    return this.util.detectionStatusFromStringToCode(status);
  }
}
