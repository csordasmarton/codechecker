import { ActivatedRoute, NavigationStart, Router } from '@angular/router';

import { Filter } from './Filter';
import { SharedService } from '..';
import { UtilService } from '../../shared';

export abstract class SelectFilterBase implements Filter {
  protected items: any[];
  protected selectedItems: any = {};

  constructor(
    protected id: string,
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
    let selectedItems = Object.keys(this.selectedItems);
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

    for (let key in this.selectedItems) {
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

  // Returns the selected filter item values.
  getSelectedItemValues() {
    return Promise.all(Object.keys(this.selectedItems).map((key: any) => {
      return this.stateDecoder(key);
    }));
  }

  // Selects a filter item.
  select(item: any) {
    this.selectedItems[item.label] = item;
    this.updateUrl();
  }

  // Deselects a filter item by it's name.
  deselect(key: any) {
    delete this.selectedItems[key];
    this.updateUrl();
  }

  // Clears out the filter state.
  clear() {
    for (let key in this.selectedItems) {
      delete this.selectedItems[key];
    }
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
    if (!this.selectedItems[item.label])
      this.select(item);
    else
      this.deselect(item.label);
  }

  onSelectedItemClick(key: any) {
    this.deselect(key);
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