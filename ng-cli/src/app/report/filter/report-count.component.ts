
import { Component } from '@angular/core';
import { DbService } from '../../shared';
import { Filter } from './Filter';
import { SharedService } from '..';

@Component({
  selector: 'report-count',
  templateUrl: './report-count.component.html',
  styleUrls: ['./report-count.component.scss']
})
export class ReportCountComponent implements Filter
{
  reportCount: number|string = 'N/A';

  constructor(protected dbService: DbService, private shared: SharedService) {
    this.shared.register(this);
  }

  getUrlValues() {
    return {};
  }

  initByUrl(queryParam: any) {}

  notify() {
    this.dbService.getRunResultCount(this.shared.runIds,
    this.shared.reportFilter, this.shared.cmpData,
    (err: any, reportCount: any) => {
      this.reportCount = reportCount.toNumber();
    });
  }

  clear() {}
}
