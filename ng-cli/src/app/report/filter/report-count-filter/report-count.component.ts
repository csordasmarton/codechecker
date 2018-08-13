
import { Component } from '@angular/core';

import Int64 = require('node-int64');

import { SharedService } from '../..';
import { DbService } from '../../../shared';
import { Filter } from '../Filter';


@Component({
  selector: 'report-count',
  templateUrl: './report-count.component.html',
  styleUrls: ['./report-count.component.scss']
})
export class ReportCountComponent implements Filter {
  constructor(protected dbService: DbService, private shared: SharedService) {
    this.shared.register(this);
  }

  initByUrl(queryParam: any) {}
  getUrlState() { return {}; }
  clear() {}

  notify() {
    this.dbService.getClient().getRunResultCount(
      this.shared.runIds,
      this.shared.reportFilter,
      this.shared.cmpData
    ).then((reportCount: Int64) => {
      this.shared.reportCount = reportCount;
    });
  }
}
