
import { Component } from '@angular/core';

@Component({
  selector: 'baseline-filters',
  templateUrl: './baseline-filters.component.html'
})
export class BaselineFiltersComponent {
  private collapsed = false;

  toggle() {
    this.collapsed = !this.collapsed;
  }
}
