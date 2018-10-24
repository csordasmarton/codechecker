import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import Int64 = require('node-int64');

import { Order, ReportData, SortMode , SortType } from '@cc/db-access';

import { DbService } from '../shared';
import { Filter } from './filter/Filter';
import { SharedService } from './shared.service';

@Component({
    selector: 'report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss'],
    providers: [ DbService ]
})
export class ReportComponent implements OnInit, OnDestroy, Filter {
  private reports: ReportData[] = [];
  private pageLimit = 10;
  private limit: number = null;
  private offset: number = null;
  private sortModes: SortMode[] = [];

  @ViewChild('reportTable') table: any;

  constructor(
    private dbService: DbService,
    private shared: SharedService
  ) {
    shared.register(this);

    // Default sort type.
    this.sortModes.push(new SortMode({
      type: SortType.SEVERITY,
      ord: Order.ASC
    }));
  }

  ngOnInit() {
    setTimeout(() => {
      this.shared.init();
    });
  }

  ngOnDestroy() {
    this.shared.destory();
  }

  initByUrl() {}
  getUrlState() { return {}; }
  clear() {}

  onSort(sortInfo: any) {
    this.sortModes = [];

    sortInfo.sorts.forEach((sort: any) => {
      const column = sort.prop;
      const type
        = column === 'file'
        ? SortType.FILENAME
        : column === 'checkerId'
        ? SortType.CHECKER_NAME
        : column === 'detectionStatus'
        ? SortType.DETECTION_STATUS
        : column === 'reviewStatus'
        ? SortType.REVIEW_STATUS
        : column === 'bugPathLength'
        ? SortType.BUG_PATH_LENGTH
        : SortType.SEVERITY;
      const ord = sort.dir === 'desc' ? Order.DESC : Order.ASC;

      this.sortModes.push(new SortMode({
        type: type,
        ord: ord
      }));
    });
    this.loadItems();
    this.offset = 2;
  }

  loadItems(param?: any) {
    if (!param) { param = {}; }

    this.limit = param.limit ? param.limit : this.pageLimit;
    this.offset = param.offset ? param.offset : this.offset;

    console.log(this.offset);
    this.dbService.getClient().getRunResults(
      this.shared.runIds,
      new Int64(this.limit),
      new Int64(this.limit * this.offset),
      this.sortModes,
      this.shared.reportFilter,
      this.shared.cmpData
    ).then((reports: ReportData[]) => {
      this.reports = reports;
    });
  }

  setPage(pageInfo: any) {

    this.loadItems({ offset: pageInfo.offset });
  }

  notify() {
    this.loadItems();
  }
}
