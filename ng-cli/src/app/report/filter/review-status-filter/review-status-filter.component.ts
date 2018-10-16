import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Int64 = require('node-int64');

import { ReviewStatus } from '@cc/db-access';

import { SharedService } from '../..';
import { DbService, UtilService } from '../../../shared';
import { SelectFilterBase } from '../_base';

@Component({
  selector: 'review-status-filter',
  templateUrl: '../_base/select-filter-base.html',
  styleUrls: ['../_base/select-filter-base.scss']
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

  getReportFilter() {
    const reportFilter = super.getReportFilter();
    reportFilter.reviewStatus = null;
    return reportFilter;
  }

  public notify() {
    this.dbService.getClient().getReviewStatusCounts(
      this.getRunIds(),
      this.getReportFilter(),
      this.getCompareData()
    ).then((reviewStatusCounts: Map<ReviewStatus, Int64>) => {
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

        if (this.selectedItems[label] !== undefined) {
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