import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Int64 = require('node-int64');

import { CompareData, ReportFilter } from '@cc/db-access';

import { Filter } from './filter/Filter';

/**
 * Common service to pass data between filters.
 */
@Injectable()
export class SharedService {
  runIds: Int64[] = [];
  reportFilter: any = new ReportFilter();
  cmpData: any = new CompareData();
  reportCount: Int64 = new Int64(0);

  private filters: Filter[] = [];

  // Subscribes
  private subLocation: any;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  init() {
    let queryParam = this.route.snapshot.queryParams;
    this.initByUrl(queryParam);

    this.subLocation = this.location.subscribe(value => {
      setTimeout(() => {
        queryParam = this.route.snapshot.queryParams;
        this.initByUrl(queryParam);
      }, 0);
    });
  }

  initByUrl(queryParam: any) {
    Promise.all(this.filters.map(filter => {
      return filter.initByUrl(queryParam); // TODO: implement this.
    })).then(res => {
      this.notifyAll();
    });
  }

  destory() {
    // console.log(this.subLocation);
    // this.subLocation.destory();
  }

  // Register filter modules on notifications.
  register(filter: any) {
    this.filters.push(filter);
  }

  // Notify all filter module on filter change.
  notifyAll(except: any[] = null) {
    this.filters.forEach(filter => {
      if (!except || except.indexOf(filter) === -1) {
        filter.notify(); // TODO: create an interface, and all class has to be implement this.
      }
    });
  }

  clearAll() {
    this.filters.forEach(filter => {
      filter.clear();
    });
    this.updateUrl();
  }

  /**
   * Updates URL query parameters by keeping non-filter
   * parameters and updating filter parameters with
   * the actual url values.
   */
  updateUrl() {
    const urlValues = { ...this.route.snapshot.queryParams };
    this.filters.forEach(filter => {
      const values = filter.getUrlState();
      Object.assign(urlValues, values);
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: urlValues
    });
  }
}
