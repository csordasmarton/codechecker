import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DbService, UtilService } from '../../shared';
import { Filter } from './Filter';
import { SharedService } from '..';

@Component({
  selector: 'unique-reports-filter',
  templateUrl: './unique-reports-filter.html',
  styleUrls: ['./unique-reports-filter.scss']
})
export class UniqueReportsFilterComponent implements Filter
{
  id: string = 'is-unique';
  isUnique: boolean = true;

  constructor(
    protected dbService: DbService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected shared: SharedService,
    protected util: UtilService
  ) {
    shared.register(this);
  }

  getUrlValues() {
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
