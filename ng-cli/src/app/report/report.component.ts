import { Component, OnInit, OnDestroy } from '@angular/core'

import { DbService } from '../shared';
import { Filter } from './filter/Filter';
import { SharedService } from './shared.service'

@Component({
    selector: 'report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss'],
    providers: [ DbService ]
})
export class ReportComponent implements OnInit, OnDestroy, Filter {
  private reports: any[] = [];
  private reportCount: number = 0;
  private limit: number = 5;

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
  public getUrlValues() { return {}; }
  public clear() {}

  public reloadItems(param: any) {
    // TODO: Server side reload.
  }

  public notify() {
    this.dbService.getRunResults(this.shared.runIds, this.limit, 0, null,
    this.shared.reportFilter, null, (err : string, reports: any[]) => {
      this.reports = reports;
      this.reportCount = reports.length;
    });
  }
}