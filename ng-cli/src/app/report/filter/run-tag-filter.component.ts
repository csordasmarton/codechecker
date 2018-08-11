import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Int64 = require('node-int64');

import {
  CompareData,
  MAX_QUERY_SIZE,
  ReportFilter,
  RunHistoryDataList,
  RunHistoryFilter,
  RunTagCounts
} from '@cc/db-access';

import { SharedService } from '..';
import { DbService, UtilService } from '../../shared';
import { SelectFilterBase } from './select-filter-base';

@Component({
  selector: 'run-tag-filter',
  templateUrl: './select-filter-base.html',
  styleUrls: ['./select-filter-base.scss']
})
export class RunTagFilterComponent extends SelectFilterBase {
  constructor(
    protected dbService: DbService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected shared: SharedService,
    protected util: UtilService
  ) {
    super('Run tag', route, router, shared, util);
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

  getSelectedItemValues() {
    let values: Int64[] = [];
    const unknownRunTags: string[] = [];
    for (const tag of Object.keys(this.selectedItems)) {
      const item = this.selectedItems[tag];
      if (item) {
        values.push(item.values);
      } else {
        if (tag.indexOf(':') === -1) {
          console.warn(`Invalid version tag format: ${tag}`);
          continue;
        }
        unknownRunTags.push(tag);
      }
    }

    return Promise.all(unknownRunTags.map(tag => {
      const ind = tag.indexOf(':');

      const runName = tag.substring(0, ind);
      const tagName = tag.substring(ind + 1);

      return this.getRunReportCountsByTagName(runName, tagName);
    })).then((runTagIds: any[]) => {
      for (let i = 0; i < unknownRunTags.length; ++i) {
        const tag = unknownRunTags[i];
        const tagIds = runTagIds[i];
        if (!this.selectedItems[tag]) {
          this.selectedItems[tag] = {
            label: tag,
            values: tagIds,
            count: 'N/A'
          };
        }
        values = values.concat(tagIds);
      }
      return values;
    });
  }

  getRunReportCountsByTagName(runName: string, tagName: string) {
    return new Promise((resolve, reject) => {
      this.dbService.getRunIds([runName]).then((runIds) => {
        const tagFilter = new RunHistoryFilter();
        tagFilter.tagNames = [tagName];

        const offset = new Int64(0);
        this.dbService.getClient().getRunHistory(
          runIds,
          MAX_QUERY_SIZE,
          offset,
          tagFilter
        ).then((runHistoryData: RunHistoryDataList) => {
          resolve(runHistoryData.map(history => history.id));
        });
      });
    });
  }

  updateReportFilter(tagIds: Int64[]) {
    this.shared.reportFilter.runTag = tagIds ? tagIds : [];
  }

  public notify() {
    this.dbService.getClient().getRunHistoryTagCounts(this.getRunIds(),
    this.getReportFilter(), this.getCompareData()).then(
    (runTagCounts: RunTagCounts) => {
      this.items = runTagCounts.map((runTagCount) => {
        const label = runTagCount.runName + ':' + runTagCount.name;
        const item = {
          label: label,
          values: runTagCount.id,
          count: runTagCount.count
        };

        if (this.selectedItems[label] === null) {
          this.selectedItems[label] = item;
        }

        return item;
      });
    });
  }
}
