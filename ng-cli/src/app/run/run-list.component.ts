import { Component, OnInit } from '@angular/core';

import Int64 = require('node-int64');

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

  itemsToRemove: Int64[] = [];

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

  reloadItems(param: any) {
    this.runs.sort((a: any, b: any) => {
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

  removeSelectedItems(event: Event) {
    event.preventDefault();

    this.dbService.getClient().removeRunResults(this.itemsToRemove).then(
    (ret) => {
      this.itemsToRemove.forEach((runId) => {
        const ind = this.runs.findIndex((run) => {
          return run.runId === runId;
        });

        if (ind !== -1) {
          this.runs.splice(ind, 1);
        }
      });
      this.itemsToRemove = [];
    });
  }

  toggleDeleteItem(run: RunData) {
    const runId = run.runId;

    const ind = this.itemsToRemove.indexOf(runId);
    if (ind === -1) {
      this.itemsToRemove.push(runId);
    } else {
      this.itemsToRemove.splice(this.itemsToRemove.indexOf(runId), 1);
    }
  }
}
