import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Int64 = require('node-int64');

import { ReviewStatus } from '@cc/db-access';

import { SharedService } from '..';
import { DbService, UtilService } from '../../shared';
import { SelectFilterBase } from './select-filter-base';

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
    super('Review status', route, router, shared, util);
  }

  updateReportFilter(statuses: ReviewStatus[]) {
    this.shared.reportFilter.reviewStatus = statuses;
  }

  public notify() {
    const limit = new Int64(10);
    const offset = new Int64(0);

    this.dbService.getClient().getReviewStatusCounts(this.shared.runIds,
    this.shared.reportFilter, this.shared.cmpData).then(
    (reviewStatusCounts: Map<ReviewStatus, Int64>) => {
      this.items = Object.keys(ReviewStatus).filter(k => {
        return typeof ReviewStatus[k] === 'number';
      }).sort((a: string , b: string) => {
        if (ReviewStatus[a] > ReviewStatus[b]) {
          return -1;
        }
        if (ReviewStatus[a] < ReviewStatus[b]) {
          return 1;
        }
        return 0;
      }).map((key: string) => {
        const value: ReviewStatus = ReviewStatus[key];
        const label = this.stateEncoder(value);
        const item = {
          label: label,
          count: reviewStatusCounts.get(value) !== undefined
               ? reviewStatusCounts.get(value).toNumber()
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

  public stateEncoder(status: ReviewStatus) {
    return this.util.reviewStatusFromCodeToString(status);
  }

  public stateDecoder(status: string) {
    return this.util.reviewStatusFromStringToCode(status);
  }
}
