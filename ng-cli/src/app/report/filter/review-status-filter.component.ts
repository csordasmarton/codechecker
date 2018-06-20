import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverModule } from "ngx-popover";

import { DbService, UtilService } from '../../shared';
import { SelectFilterBase } from './select-filter-base';
import { SharedService } from '..';

let reportServerTypes = require('api/report_server_types');

@Component({
  selector: 'review-status-filter',
  templateUrl: './select-filter-base.html',
  styleUrls: ['./select-filter-base.scss']
})
export class ReviewStatusFilterComponent extends SelectFilterBase
{
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
    let limit = 10; // TODO
    let offset = 0; // TODO
    this.dbService.getReviewStatusCounts(this.shared.runIds,
    this.shared.reportFilter, this.shared.cmpData,
    (err : any, reviewStatusCounts: any[]) => {
      this.items = Object.keys(reportServerTypes.ReviewStatus).map((key) => {
        let value: number = reportServerTypes.ReviewStatus[key];
        let label = this.stateEncoder(value);
        let item = {
          label: label,
          count: reviewStatusCounts[value] !== undefined
               ? reviewStatusCounts[value].toNumber()
               : 0,
          icon: 'review-status-' + label.toLowerCase().split(' ').join('-')
        };

        if (this.selectedItems[label] === null)
          this.selectedItems[label] = item;

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
