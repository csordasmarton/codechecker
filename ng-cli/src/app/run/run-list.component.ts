import { Component, OnInit } from '@angular/core';

import { DbService } from '../shared';
import { RunData, RunFilter } from '@cc/db-access';

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

  public ngOnInit() {
    const runFilter = new RunFilter();
    this.dbService.getClient().getRunData(runFilter).then(
    (runData: RunData[]) => {
      this.runs = runData;
    });
  }
}
