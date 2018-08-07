import { Component, OnInit } from '@angular/core';

import { RunData, RunFilter } from '@cc/db-access';

import { DbService } from '../shared';

@Component({
  selector: 'run-list',
  templateUrl: './run-list.component.html',
  providers: [ DbService ],
  styleUrls: ['./run-list.component.scss']
})
export class RunListComponent implements OnInit {
  runs: RunData[] = [];
  runCount = 0;

  constructor(
    private dbService: DbService
  ) {}

  ngOnInit() {
    this.loadRuns();
  }

  search(runNameQuery: string) {
    setTimeout(() => {
      this.loadRuns(runNameQuery + '*');
    }, 200);
  }

  loadRuns(runNameQuery: string = null) {
    const runFilter = new RunFilter();
    if (runNameQuery) {
      runFilter.names = [ runNameQuery ];
    }

    this.dbService.getClient().getRunData(runFilter).then(
    (runs: RunData[]) => {
      this.runs = runs;
      this.runCount = runs.length;
    });
  }

  public reloadItems(param: any) {
    this.runs.sort((a: any, b: any) => {
      const sortByA = a[param['sortBy']];
      const sortByB = b[param['sortBy']];

      console.log(sortByA, sortByB);
      if (sortByA > sortByB) {
        return param.sortAsc ? -1 : 1;
      } else if (sortByA < sortByB) {
        return param.sortAsc ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
}
