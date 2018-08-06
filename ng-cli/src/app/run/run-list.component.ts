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

  constructor(
    private dbService: DbService
  ) {}

  // TODO: implement it.
  public reloadItems(param: any) {

  }

  public ngOnInit() {
    const runFilter = new RunFilter();
    this.dbService.getClient().getRunData(runFilter).then(
    (runData: RunData[]) => {
      this.runs = runData;
      console.log(runData);
    });
  }
}
