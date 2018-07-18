import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

const reportServerTypes = require('api/report_server_types');

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
    const runIds: number[] = null; // TODO: this should be controlled by a filter bar.
    const limit: number = null;
    const offset: number = null;
    const isUnique = true; // TODO: this should be controlled by a filter bar.

    const queries = [
      { field: null, values: null },
      {field: 'reviewStatus', values: [reportServerTypes.ReviewStatus.UNREVIEWED]},
      {field: 'reviewStatus', values: [reportServerTypes.ReviewStatus.CONFIRMED]},
      {field: 'reviewStatus', values: [reportServerTypes.ReviewStatus.FALSE_POSITIVE]},
      {field: 'reviewStatus', values: [reportServerTypes.ReviewStatus.INTENTIONAL]},
      {field: 'detectionStatus', values: [reportServerTypes.DetectionStatus.RESOLVED]}
    ].map((q) => {
      const reportFilter = new reportServerTypes.ReportFilter();
      reportFilter.isUnique = isUnique;

      if (q.field) {
        reportFilter[q.field] = q.values;
      }

      return new Promise((resolve, reject) => {
        this.dbService.getCheckerCounts(runIds, reportFilter, null, limit,
        offset, (err, res) => {
          const obj = {};
          res.forEach((item: any) => { obj[item.name] = item; });
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
