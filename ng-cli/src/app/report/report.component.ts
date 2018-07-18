import { Component, OnInit, OnDestroy } from '@angular/core';

const reportServerTypes = require('api/report_server_types');

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
  private reports: any[] = [];
  private pageLimits: number[] = [25, 50, 100, 250];
  private limit: number = null;
  private offset = 0;

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
    const sortMode = new reportServerTypes.SortMode();

    sortMode.type
      = column === 'file'
      ? reportServerTypes.SortType.FILENAME
      : column === 'checkerId'
      ? reportServerTypes.SortType.CHECKER_NAME
      : column === 'detectionStatus'
      ? reportServerTypes.SortType.DETECTION_STATUS
      : column === 'reviewStatus'
      ? reportServerTypes.SortType.REVIEW_STATUS
      : column === 'bugPathLength'
      ? reportServerTypes.SortType.BUG_PATH_LENGTH
      : reportServerTypes.SortType.SEVERITY;

    sortMode.ord = sortAsc
      ? reportServerTypes.Order.DESC
      : reportServerTypes.Order.ASC;

    return sortMode;
  }

  public reloadItems(param: any) {
    this.limit = param.limit ? param.limit : this.pageLimits[0];
    this.offset = param.offset ? param.offset : 0;
    const sortMode = this.getSortMode(param.column, param.sortAsc);

    this.dbService.getRunResults(this.shared.runIds, this.limit, this.offset,
    [ sortMode ], this.shared.reportFilter, null,
    (err: string, reports: any[]) => {
      this.reports = reports;
      console.log(reports);
    });
  }

  public notify() {
    this.reloadItems({});
  }
}
