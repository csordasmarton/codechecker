
import { Component } from '@angular/core';
import { SharedService } from '../..';

@Component({
  selector: 'clear-all-reports',
  templateUrl: './clear-all-reports.component.html',
  styleUrls: ['./clear-all-reports.component.scss']
})
export class ClearAllReportsComponent {
  constructor(protected shared: SharedService) {}

  clearAll() {
    this.shared.clearAll();
    this.shared.notifyAll();
  }
}
