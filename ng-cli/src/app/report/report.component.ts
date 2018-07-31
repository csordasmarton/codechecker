import { Component, OnInit, OnDestroy } from '@angular/core';

import { SortMode , SortType, Order, ReportData } from '@cc/db-access';

import { DbService } from '../shared';
import { Filter } from './filter/Filter';
import { SharedService } from './shared.service';

import Int64 = require('node-int64');

@Component({
    selector: 'report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss'],
    providers: [ DbService ]
})
export class ReportComponent implements OnInit, OnDestroy, Filter {
  private reports: any[] = [];
  private pageLimits: number[] = [25, 50, 100, 250];
  private limit: Int64 = null;
  private offset: Int64 = null;

  constructor(
    private dbService: DbService,
    private shared: SharedService
  ) {
    shared.register(this);
  }

  public ngOnInit() {
    this.shared.init();
  }

  public ngOnDestroy() {
    this.shared.destory();
  }

  public initByUrl() {}
  public getUrlState() { return {}; }
  public clear() {}

  private getSortMode(column: string, sortAsc: boolean) {
    const sortMode = new SortMode();

    sortMode.type
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

    sortMode.ord = sortAsc ? Order.DESC : Order.ASC;

    return sortMode;
  }

  public reloadItems(param: any) {
    this.limit = new Int64(param.limit ? param.limit : this.pageLimits[0]);
    this.offset = param.offset ? param.offset : 0;
    const sortMode = this.getSortMode(param.column, param.sortAsc);

    this.dbService.getClient().getRunResults(
      this.shared.runIds,
      this.limit,
      this.offset,
      [ sortMode ],
      this.shared.reportFilter,
      this.shared.cmpData
    ).then((reports: ReportData[]) => {
      this.reports = reports;
    });
  }

  public notify() {
    this.reloadItems({});
  }
}
