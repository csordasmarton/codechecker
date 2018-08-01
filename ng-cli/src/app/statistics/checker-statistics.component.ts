import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Int64 = require('node-int64');

import {
  CheckerCounts,
  CompareData,
  DetectionStatus,
  MAX_QUERY_SIZE,
  ReportFilter,
  ReviewStatus,
} from '@cc/db-access';

import { DbService } from '../shared';

@Component({
    selector: 'checker-statistics',
    templateUrl: './checker-statistics.component.html',
    styleUrls: ['./checker-statistics.component.scss']
})
export class CheckerStatisticsComponent implements OnInit {
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
    const limit: Int64 = MAX_QUERY_SIZE;
    const offset: Int64 = new Int64(0);
    const isUnique = true; // TODO: this should be controlled by a filter bar.

    const queries = [
      { field: null, values: null },
      {field: 'reviewStatus', values: [ReviewStatus.UNREVIEWED]},
      {field: 'reviewStatus', values: [ReviewStatus.CONFIRMED]},
      {field: 'reviewStatus', values: [ReviewStatus.FALSE_POSITIVE]},
      {field: 'reviewStatus', values: [ReviewStatus.INTENTIONAL]},
      {field: 'detectionStatus', values: [DetectionStatus.RESOLVED]}
    ].map((q) => {
      const reportFilter = new ReportFilter();
      reportFilter.isUnique = isUnique;

      if (q.field) {
        reportFilter[q.field] = q.values;
      }

      return new Promise((resolve, reject) => {
        this.dbService.getClient().getCheckerCounts(
          runIds,
          reportFilter,
          new CompareData(),
          limit,
          offset
        ).then((checkerCounts: CheckerCounts) => {
          const obj = {};
          checkerCounts.forEach((item: any) => { obj[item.name] = item; });
          resolve(obj);
        });
      });
    });

    Promise.all(queries).then(res => {
      const checkers = res[0];
      const checkerNames = Object.keys(checkers);

      this.itemCount = checkerNames.length;

      checkerNames.map((key) => {
        this.items.push({
          id            : key,
          checker       : key,
          severity      : checkers[key].severity,
          reports       : checkers[key].count,
          unreviewed    : res[1][key] !== undefined ? res[1][key].count : 0,
          confirmed     : res[2][key] !== undefined ? res[2][key].count : 0,
          falsePositive : res[3][key] !== undefined ? res[3][key].count : 0,
          intentional   : res[4][key] !== undefined ? res[4][key].count : 0,
          resolved      : res[5][key] !== undefined ? res[5][key].count : 0
        });
      });
    });
  }
}
