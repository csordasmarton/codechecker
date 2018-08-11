
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'newcheck-filters',
  templateUrl: './newcheck-filters.component.html'
})
export class NewcheckFiltersComponent implements OnInit {
  private collapsed = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    if (!this.route.snapshot.queryParams['newcheck']) {
      this.collapsed = true;
    }
  }

  toggle() {
    this.collapsed = !this.collapsed;
  }
}
