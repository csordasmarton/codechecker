
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '..';

@Component({
  selector: 'clear-all-reports',
  template: `
    <button class="btn btn-info" (click)="clearAll()">Clear all</button>
  `,
  styleUrls: ['./clear-all-reports.component.scss']
})
export class ClearAllReportsComponent {
  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected shared: SharedService
  ) {
  }

  initByURL(queryParam: any) {}
  notify() {}

  clearAll() {
    this.shared.clearAll();
  }

  // updateUrl() {
  //   this.router.navigate([], {
  //     relativeTo: this.route,
  //     queryParams: { [this.id]: this.isUnique ? [] : 'off' },
  //     queryParamsHandling: 'merge'
  //   });
  // }
}
