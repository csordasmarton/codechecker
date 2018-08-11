
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'filter-tooltip',
  templateUrl: './filter-tooltip.component.html'
})
export class FilterTooltipComponent implements OnInit {
  private myPopover: any;
  ngOnInit() {
    console.log(this.myPopover);
  }
}
