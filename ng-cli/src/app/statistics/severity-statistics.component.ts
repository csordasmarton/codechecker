import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Int64 = require('node-int64');

import { CompareData, DiffType, ReportFilter, Severity } from '@cc/db-access';

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
    const runIds: Int64[] = []; // TODO: this should be controlled by a filter bar.
    const reportFilter = new ReportFilter({isUnique: true});

    this.dbService.getClient().getSeverityCounts(
      runIds,
      reportFilter,
      new CompareData()
    ).then((res: Map<Severity, Int64>) => {
      res.forEach((value: Int64, key: Severity) => {
        this.items.push({
          severity: key,
          reports: value
        });
      });
      this.itemCount = this.items.length;
    });
  }
}
