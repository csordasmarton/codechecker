import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'checker-statistics',
    templateUrl: './checker-statistics.component.html',
    styleUrls: ['./checker-statistics.component.scss']
})
export class CheckerStatisticsComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}
}