import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

const reportServerTypes = require('api/report_server_types');

import { DbService } from '../shared';

@Component({
    selector: 'severity-statistics',
    templateUrl: './severity-statistics.component.html',
    styleUrls: ['./severity-statistics.component.scss']
})
export class SeverityStatisticsComponent implements OnInit {
  protected items: any = [];
  protected itemCount = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dbService: DbService
  ) {}

  public reloadItems(param: any) {
    this.items.sort((a: any, b: any) => {
      const sortByA = a[param['sortBy']];
      const sortByB = b[param['sortBy']];

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
    const runIds: number[] = null; // TODO: this should be controlled by a filter bar.
    const isUnique = true; // TODO: this should be controlled by a filter bar.

    const reportFilter = new reportServerTypes.ReportFilter();
    reportFilter.isUnique = isUnique;

    this.dbService.getSeverityCounts(runIds, reportFilter, null, (err, res) => {
      for (const key of Object.keys(res)) {
        this.items.push({
          severity: key,
          reports: res[key]
        });
      }
      this.itemCount = this.items.length;
    });
  }
}
