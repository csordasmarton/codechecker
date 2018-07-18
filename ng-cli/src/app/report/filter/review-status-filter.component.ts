import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverModule } from 'ngx-popover';

import { DbService, UtilService, RequestFailed } from '../../shared';
import { SelectFilterBase } from './select-filter-base';
import { SharedService } from '..';

const reportServerTypes = require('api/report_server_types');

@Component({
  selector: 'review-status-filter',
  templateUrl: './select-filter-base.html',
  styleUrls: ['./select-filter-base.scss']
})
export class ReviewStatusFilterComponent extends SelectFilterBase {
  constructor(
    protected dbService: DbService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected shared: SharedService,
    protected util: UtilService
  ) {
    super('review-status', 'Review status', route, router, shared, util);
  }

  updateReportFilter(value: any) {
    this.shared.reportFilter.detectionStatus = value;
  }

  public notify() {
    const limit = 10; // TODO
    const offset = 0; // TODO
    this.dbService.getReviewStatusCounts(this.shared.runIds,
    this.shared.reportFilter, this.shared.cmpData,
    (err: RequestFailed, reviewStatusCounts: any[]) => {
      this.items = Object.keys(reportServerTypes.ReviewStatus).map((key) => {
        const value: number = reportServerTypes.ReviewStatus[key];
        const label = this.stateEncoder(value);
        const item = {
          label: label,
          count: reviewStatusCounts[value] !== undefined
               ? reviewStatusCounts[value].toNumber()
               : 0,
          icon: 'review-status-' + label.toLowerCase().split(' ').join('-')
        };

        if (this.selectedItems[label] === null) {
          this.selectedItems[label] = item;
        }

        return item;
      });
    });
  }

  public stateEncoder(status: number) {
    return this.util.reviewStatusFromCodeToString(status);
  }

  public stateDecoder(status: string) {
    return this.util.reviewStatusFromStringToCode(status);
  }
}
