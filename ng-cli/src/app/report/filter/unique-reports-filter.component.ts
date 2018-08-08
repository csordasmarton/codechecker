import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SharedService } from '..';
import { Filter } from './Filter';

@Component({
  selector: 'unique-reports-filter',
  templateUrl: './unique-reports-filter.html',
  styleUrls: ['./unique-reports-filter.scss']
})
export class UniqueReportsFilterComponent implements Filter {
  private id = 'is-unique';
  private defaultUniqueValue = false; // Disable uniqueing by default.
  private isUnique = this.defaultUniqueValue;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected shared: SharedService
  ) {
    shared.register(this);
  }

  getUrlState() {
    return {[this.id] : this.isUnique ? ['on'] : null};
  }

  initByUrl(queryParam: any) {
    this.isUnique = queryParam[this.id] === 'on' ? true : false;
    this.updateReportFilter();
  }

  updateReportFilter() {
    this.shared.reportFilter.isUnique = this.isUnique;
  }

  notify() {}

  clear() {
    this.isUnique = this.defaultUniqueValue;
    this.updateReportFilter();
  }

  onChange() {
    this.updateReportFilter();
    this.updateUrl();
    this.shared.notifyAll([this]);
  }

  updateUrl() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [this.id]: this.isUnique ? 'on' : [] },
      queryParamsHandling: 'merge'
    });
  }
}
