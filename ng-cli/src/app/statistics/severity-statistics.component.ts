import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';

let reportServerTypes = require('api/report_server_types');

import { DbService } from '../shared';

@Component({
    selector: 'severity-statistics',
    templateUrl: './severity-statistics.component.html',
    styleUrls: ['./severity-statistics.component.scss']
})
export class SeverityStatisticsComponent implements OnInit {
  protected items: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dbService: DbService
  ) {}

  public ngOnInit() {
    let runIds: number[] = null; // TODO: this should be controlled by a filter bar.
    let isUnique: boolean = true; // TODO: this should be controlled by a filter bar.

    let reportFilter = new reportServerTypes.ReportFilter();
    reportFilter.isUnique = isUnique;

    this.dbService.getSeverityCounts(runIds, reportFilter, null, (err, res) => {
        console.log(res);
        for (let key in res) {
          this.items[key] = res[key];
        }
      });
  }
}