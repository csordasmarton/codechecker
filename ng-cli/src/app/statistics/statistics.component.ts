import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DbService } from '../shared';

@Component({
    selector: 'statistics',
    templateUrl: './statistics.component.html'
})
export class StatisticsComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dbService: DbService
  ) {}

  public ngOnInit() {
  }
}
