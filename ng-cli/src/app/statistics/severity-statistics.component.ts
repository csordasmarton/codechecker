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
  protected items: any = [];
  protected itemCount: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dbService: DbService
  ) {}

  public reloadItems(param: any) {
    this.items.sort((a: any, b: any) => {
      let sortByA = a[param['sortBy']];
      let sortByB = b[param['sortBy']];

      if (sortByA > sortByB) {
        return param.sortAsc ? -1 : 1;
      } else if (sortByA < sortByB) {
        return param.sortAsc ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  public ngOnInit() {
    let runIds: number[] = null; // TODO: this should be controlled by a filter bar.
    let isUnique: boolean = true; // TODO: this should be controlled by a filter bar.

    let reportFilter = new reportServerTypes.ReportFilter();
    reportFilter.isUnique = isUnique;

    this.dbService.getSeverityCounts(runIds, reportFilter, null, (err, res) => {
      for (let key in res) {
        this.items.push({
          severity: key,
          reports: res[key]
        });
      }
      this.itemCount = this.items.length;
    });
  }
}