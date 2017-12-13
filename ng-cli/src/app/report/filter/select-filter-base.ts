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

  getUrlValues() {
    let selected = Object.keys(this.selectedItems);
    return {[this.id] : selected.length ? selected : null};
  }

  initByUrl(queryParam: any) {
    let params = queryParam[this.id] || [];
    if (!(params instanceof Array))
      params = [params];

    for (let key in this.selectedItems) {
      if (params.indexOf(key) === -1)
        delete this.selectedItems[key];
    }

    params.forEach((param: string) => {
      if (!this.selectedItems[param])
        this.selectedItems[param] = null;
    });

    return new Promise((resolve, reject) => {
      this.getSelectedItemValues().then(value => {
        this.updateReportFilter(value.length ? value : null);
        resolve(value);
      });
    });    
  }

  notify() {}

  getSelectedItemValues() {
    return Promise.all(Object.keys(this.selectedItems).map((key: any) => {
      return this.stateDecoder(key);
    }));
  }

  updateReportFilter(value: any) {}

  select(item: any) {
    this.selectedItems[item.label] = item;
    this.updateUrl();
  }

  deselect(key: any) {
    delete this.selectedItems[key];
    this.updateUrl();
  }

  clear() {
    for (let key in this.selectedItems)
      delete this.selectedItems[key];
  }

  stateEncoder(val: any) {
    return val;
  }

  stateDecoder(val: any): any {
    return val;
  }

  onTooltipItemClick(item: any) {
    if (!this.selectedItems[item.label])
      this.select(item);
    else
      this.deselect(item.label);
  }

  onSelectedItemClick(key: any) {
    this.deselect(key);
  }

  updateUrl() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [this.id]: Object.keys(this.selectedItems) },
      queryParamsHandling: 'merge'
    });
  }
}