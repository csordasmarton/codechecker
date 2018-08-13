import { Component, Input, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SharedService } from '../..';
import { Filter } from '../Filter';

@Component({
  selector: 'report-hash-filter',
  templateUrl: './report-hash-filter.component.html',
  styleUrls: ['./report-hash-filter.component.scss']
})
export class ReportHashFilterComponent implements Filter {
  @Input() private id: string;

  private reportHash: string = null;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected shared: SharedService
  ) {
    shared.register(this);
  }

  notify() {}

  getUrlState() {
    return {[this.id] : this.reportHash};
  }

  initByUrl(queryParam: any) {
    this.reportHash = queryParam[this.id];
    this.updateReportFilter();
  }

  updateReportFilter() {
    this.shared.reportFilter.reportHash = this.reportHash
      ? [this.reportHash + '*']
      : null;
  }

  clear() {
    this.reportHash = null;
    this.updateReportFilter();
  }

  onKeyUp() {
    setTimeout(() => {
      this.updateReportFilter();
      this.updateUrl();
      this.shared.notifyAll([this]);
    }, 500);
  }

  updateUrl() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [this.id]: this.reportHash },
      queryParamsHandling: 'merge'
    });
  }
}
