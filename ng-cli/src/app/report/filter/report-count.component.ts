
import { Component } from '@angular/core';

import Int64 = require('node-int64');

import { DbService } from '../../shared';
import { Filter } from './Filter';
import { SharedService } from '..';

@Component({
  selector: 'report-count',
  templateUrl: './report-count.component.html',
  styleUrls: ['./report-count.component.scss']
})
export class ReportCountComponent implements Filter {
  constructor(protected dbService: DbService, private shared: SharedService) {
    this.shared.register(this);
  }

  getUrlState() {
    return {};
  }

  initByUrl(queryParam: any) {}

  notify() {
    this.dbService.getClient().getRunResultCount(this.shared.runIds,
    this.shared.reportFilter, this.shared.cmpData).then(
    (reportCount: Int64) => {
      this.shared.reportCount = reportCount.toNumber();
    });
  }

  clear() {}
}
