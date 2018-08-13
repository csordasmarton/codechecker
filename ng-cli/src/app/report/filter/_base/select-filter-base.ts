import { Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CompareData, ReportFilter } from '@cc/db-access';

import { SharedService } from '../..';
import { UtilService } from '../../../shared';
import { Filter } from '../Filter';

export abstract class SelectFilterBase implements Filter {
  protected items: any[];
  protected selectedItems: any = {};

  @Input() protected id: string;

  constructor(
    protected title: string,
    protected route: ActivatedRoute,
    protected router: Router,
    protected shared: SharedService,
    protected util: UtilService
  ) {
    shared.register(this);
  }

  // Get available filter items.
  getItems() {}

  // Update report filter by the state parameter.
  updateReportFilter(state: any) {}

  // Subscribe on notification events.
  notify() {}

  // Returns the URL state of this filter.
  getUrlState() {
    const selectedItems = Object.keys(this.selectedItems);
    return {
      [this.id] : selectedItems.length ? selectedItems : null
    };
  }

  // Initialize filter state by query parameters.
  initByUrl(queryParam: any) {
    let params = queryParam[this.id] || [];
    if (!(params instanceof Array)) {
      params = [params];
    }

    for (const key in this.selectedItems) {
      if (params.indexOf(key) === -1) {
        delete this.selectedItems[key];
      }
    }

    params.forEach((param: string) => {
      if (!this.selectedItems[param]) {
        this.selectedItems[param] = null;
      }
    });

    return new Promise((resolve, reject) => {
      this.getSelectedItemValues().then(value => {
        this.updateReportFilter(value.length ? value : null);
        resolve(value);
      });
    });
  }

  getRunIds() {
    return this.shared.runIds ? Object.assign([], this.shared.runIds) : null;
  }

  getReportFilter() {
    const reportFilter = new ReportFilter();
    Object.assign(reportFilter, this.shared.reportFilter);
    return reportFilter;
  }

  getCompareData() {
    const cmpData = new CompareData();
    Object.assign(cmpData, this.shared.cmpData);
    return cmpData;
  }

  // Returns the selected filter item values.
  getSelectedItemValues() {
    return Promise.all(Object.keys(this.selectedItems).map((key: any) => {
      return this.stateDecoder(key);
    }));
  }

  // Selects a filter item.
  select(item: any) {
    this.selectedItems[item.label] = item;
  }

  // Deselects a filter item by it's name.
  deselect(key: any) {
    delete this.selectedItems[key];
  }

  // Clears out the filter state.
  clear() {
    for (const key of Object.keys(this.selectedItems)) {
      delete this.selectedItems[key];
    }
    this.updateReportFilter(null);
  }

  // Encodes the given value.
  stateEncoder(val: any) {
    return val;
  }

  // Decodes the given value.
  stateDecoder(val: any): any {
    return val;
  }

  // Toggleing a filter tooltip item.
  onTooltipItemClick(item: any) {
    if (!this.selectedItems[item.label]) {
      this.select(item);
    } else {
      this.deselect(item.label);
    }
    this.update();
  }

  onSelectedItemClick(key: any) {
    this.deselect(key);
    this.update();
  }

  update() {
    this.getSelectedItemValues().then(value => {
      this.updateReportFilter(value.length ? value : null);
      this.updateUrl();

      // TODO: notify others only once after tooltip is closed.
      this.shared.notifyAll([this]);
    });
  }

  // Update URL parameter values.
  updateUrl() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [this.id]: Object.keys(this.selectedItems) },
      queryParamsHandling: 'merge'
    });
  }
}
