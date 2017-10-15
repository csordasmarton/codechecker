import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';

import { DbService } from '../shared';

@Component({
    selector: 'report',
    templateUrl: './report.component.html',
    providers: [ DbService ]
})
export class ReportComponent implements OnInit {
  reports: any[];

  constructor(
    private route: ActivatedRoute,
    private dbService: DbService
  ) {}

  public ngOnInit() {
    var that = this;

    this.dbService.getRunResults((err : string, reports: any[]) => {
      that.reports = reports;
    });
  }
}