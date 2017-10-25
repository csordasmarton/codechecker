import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';

import { DbService } from '../shared';

import './run-list.component.scss';

@Component({
    selector: 'run-list',
    templateUrl: './run-list.component.html',
    providers: [ DbService ]
})
export class RunListComponent implements OnInit {
  runs : any[];

  constructor(
    private route: ActivatedRoute,
    private dbService: DbService
  ) {}

  public ngOnInit() {
    var that = this;

    this.dbService.getRunData(null, (err : any, runs: any[]) => {
      that.runs = runs;
    });
  }
}