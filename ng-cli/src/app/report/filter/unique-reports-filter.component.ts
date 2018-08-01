import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SharedService } from '..';
import { DbService, UtilService } from '../../shared';
import { Filter } from './Filter';

@Component({
  selector: 'unique-reports-filter',
  templateUrl: './unique-reports-filter.html',
  styleUrls: ['./unique-reports-filter.scss']
})
export class UniqueReportsFilterComponent implements Filter {
  id = 'is-unique';
  isUnique = true;

  constructor(
    protected dbService: DbService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected shared: SharedService,
    protected util: UtilService
  ) {
    shared.register(this);
  }

  getUrlState() {
    return {[this.id] : this.isUnique ? null : ['off']};
  }

  initByUrl(queryParam: any) {
    this.isUnique = queryParam[this.id] === 'off' ? false : true;
    this.updateReportFilter();
  }

  updateReportFilter() {
    this.shared.reportFilter.isUnique = this.isUnique;
  }

  notify() {}

  clear() {}

  onChange() {
    this.updateReportFilter();
    this.updateUrl();
  }

  updateUrl() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [this.id]: this.isUnique ? [] : 'off' },
      queryParamsHandling: 'merge'
    });
  }
}
