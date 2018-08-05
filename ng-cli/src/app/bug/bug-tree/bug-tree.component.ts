import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ViewChild
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import {
  ITreeOptions,
  TreeComponent,
  TreeModel,
  TreeModule,
  TreeNode
} from 'angular-tree-component';

import Int64 = require('node-int64');

import {
  CompareData,
  MAX_QUERY_SIZE,
  ReportDataList,
  ReportDetails,
  ReportFilter
} from '@cc/db-access';

import { DbService, UtilService } from '../../shared';

@Component({
  selector: 'bug-tree',
  templateUrl: './bug-tree.component.html',
  providers: [ DbService ]
})
export class BugTreeComponent implements AfterContentInit, AfterViewInit {
  @ViewChild('bugTree') treeComponent: TreeComponent;
  nodes: any[] = [];

  options: ITreeOptions = {
    displayField: 'name',
    isExpandedField: 'expanded',
    idField: 'id',
    nodeHeight: 23,
    useVirtualScroll: true,
    animateExpand: true,
    animateSpeed: 30,
    animateAcceleration: 1.2,
    getChildren: this.getChildren.bind(this)
  };

  constructor(
    private dbService: DbService,
    private route: ActivatedRoute,
    private util: UtilService) {
  }

  public ngAfterContentInit() {
    [
      { id: 'critical',    name: 'Critical',    icon: 'severity-critical' },
      { id: 'high',        name: 'High',        icon: 'severity-high' },
      { id: 'medium',      name: 'Medium',      icon: 'severity-medium' },
      { id: 'low',         name: 'Low',         icon: 'severity-low' },
      { id: 'style',       name: 'Style',       icon: 'severity-style' },
      { id: 'unspecified', name: 'Unspecified', icon: 'severity-unspecified' },
      { id: 'resolved'   , name: 'Resolved',    icon: 'detection-status-resolved'}
    ].forEach((node: any) => {
      node.hasChildren = true;
      node.children = [];

      this.nodes.push(node);
    });

    this.loadTreeItems();
  }

  loadTreeItems() {
    const treeModel = this.treeComponent.treeModel;

    const runNames = this.route.snapshot.queryParams['run'];

    this.dbService.getRunIds(runNames).then((runIds) => {
      const limit: Int64 = MAX_QUERY_SIZE;
      const offset: Int64 = new Int64(0);
      const reportFilter = new ReportFilter();
      const cmpData = new CompareData();

      this.dbService.getClient().getRunResults(runIds || [], limit, offset, [],
      reportFilter, cmpData).then((reports: ReportDataList) => {
        // Adding reports to the tree.
        reports.forEach((report) => {
          this.addReport(report);
        });

        // Hide severity items of the tree which doesn't contain any item.
        treeModel.roots.forEach((node: TreeNode) => {
          if (!node.getFirstChild()) {
            node.setIsHidden(true);
          }
        });

        // Update the tree.
        treeModel.update();
      });
    });
  }

  ngAfterViewInit() {
  }

  getChildren(node: any) {
    if (node.data.getChildren) {
      return node.data.getChildren();
    }
  }

  private addReport(report: any) {
    const that = this;

    const treeModel = this.treeComponent.treeModel;
    const severity = this.util.severityFromCodeToString(report.severity);
    const severityNode = treeModel.getNodeById(severity.toLowerCase());
    const status =
      this.util.detectionStatusFromCodeToString(report.detectionStatus);

    severityNode.children.push({
      id: report.reportId.toNumber(),
      name: 'L' + report.line + ' &ndash; ' + report.checkerId,
      icon: 'detection-status-' + status.toLowerCase(),
      hasChildren: true,
      getChildren: function () {
        return new Promise((resolve) => {
          that.dbService.getClient().getReportDetails(report.reportId).then(
          (details: ReportDetails) => {
            const children: any[] = [];

            children.push({
              id: report.reportId + '_0',
              name: '<b><u>' + report.checkerMsg + '</u></b>'
            });

            if (details.pathEvents.length <= 1) {
              resolve(children);
              return;
            }

            details.pathEvents.forEach((step: any, index: number) => {
              children.push({
                id: report.reportId + '_' + (index + 1),
                name: step.msg,
              });
            });

            resolve(children);
          });
        });
      }
    });

    severityNode.setField('children', severityNode.children);
  }
}