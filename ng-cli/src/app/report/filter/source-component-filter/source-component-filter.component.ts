import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SourceComponentDataList } from '@cc/db-access';

import { SharedService } from '../..';
import { DbService, UtilService } from '../../../shared';
import { SelectFilterBase } from '../_base';


@Component({
  selector: 'source-component',
  templateUrl: '../_base/select-filter-base.html',
  styleUrls: ['../_base/select-filter-base.scss']
})
export class SourceComponentComponent extends SelectFilterBase {
  constructor(
    protected dbService: DbService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected shared: SharedService,
    protected util: UtilService
  ) {
    super('Source component', route, router, shared, util);
  }

  updateReportFilter(componentNames: string[]) {
    this.shared.reportFilter.componentNames = componentNames;
  }

  public notify() {
    this.dbService.getClient().getSourceComponents([]).then(
    (components: SourceComponentDataList) => {
      this.items = components.map((component) => {
        const item = {
          label: component.name,
          count: 'N/A'
        };

        if (this.selectedItems[component.name] !== undefined) {
          this.selectedItems[component.name] = item;
        }

        return item;
      });
    });
  }
}
