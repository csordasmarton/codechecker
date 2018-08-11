import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SharedService } from '..';
import { Filter } from './Filter';

@Component({
  selector: 'unique-reports-filter',
  templateUrl: './unique-reports-filter.html',
  styleUrls: ['./unique-reports-filter.scss']
})
export class UniqueReportsFilterComponent implements Filter, OnInit {
  @Input() private id = 'is-unique';
  @Input() private defaultValue = false; // Disable uniqueing by default.
  private isUnique: boolean = null;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected shared: SharedService
  ) {
    shared.register(this);
  }

  ngOnInit() {
    this.isUnique = this.defaultValue;
  }

  notify() {}

  getUrlState() {
    return {[this.id] : this.getUrlValue()};
  }

  getUrlValue(): string | any[] {
    if (this.defaultValue && !this.isUnique) {
      return 'off';
    } else if (!this.defaultValue && this.isUnique) {
      return 'on';
    }
    return [];
  }

  initByUrl(queryParam: any) {
    this.isUnique = queryParam[this.id] === 'on' ? true : false;
    this.updateReportFilter();
  }

  updateReportFilter() {
    this.shared.reportFilter.isUnique = this.isUnique;
  }

  clear() {
    this.isUnique = this.defaultValue;
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
      queryParams: { [this.id]: this.getUrlValue() },
      queryParamsHandling: 'merge'
    });
  }
}
