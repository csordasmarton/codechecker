import {
  AfterViewInit,
  OnChanges,
  Component,
  EventEmitter,
  Output,
  ViewChild,
  Input
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import {
  ITreeOptions,
  TREE_ACTIONS,
  TreeComponent,
  TreeModel,
  TreeNode
} from 'angular-tree-component';

import Int64 = require('node-int64');

import {
  BugPathEvent,
  CompareData,
  MAX_QUERY_SIZE,
  ReportData,
  ReportDataList,
  ReportDetails,
  ReportFilter
} from '@cc/db-access';

import { DbService, UtilService } from '../../shared';

export interface ReportEventData {
  report: ReportData;
  bugPathEvent: BugPathEvent;
}

@Component({
  selector: 'bug-tree',
  templateUrl: './bug-tree.component.html',
  providers: [ DbService ]
})
export class BugTreeComponent implements AfterViewInit, OnChanges {
  @ViewChild('bugTree') treeComponent: TreeComponent;
  nodes: any[] = [];

  @Input() report: ReportData = null;

  @Output() loadReportEvent = new EventEmitter<ReportEventData>();

  options: ITreeOptions = {
    displayField: 'name',
    isExpandedField: 'expanded',
    idField: 'id',
    nodeHeight: 23,
    useVirtualScroll: true,
    animateExpand: true,
    animateSpeed: 30,
    animateAcceleration: 1.2,
    getChildren: this.getChildren.bind(this),
    actionMapping: {
      mouse: {
        click: (tree: TreeModel, node: TreeNode, $event: any) => {
          if (node.hasChildren) {
            TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
          }

          if (node.data.report) {
            this.loadReport(node.data.report, node.data.step);
          }
        }
      }
    },
  };

  treeModel: TreeModel;

  constructor(
    private dbService: DbService,
    private route: ActivatedRoute,
    private util: UtilService) {
  }

  ngOnChanges() {
    if (this.report) {
      this.loadTreeItems(this.report);
    }
  }

  loadTreeItems(report: ReportData) {
    this.nodes = [];

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
    this.treeModel.update();
    this.loadReportData(report);
  }

  private loadReportData(report: ReportData) {
    const limit: Int64 = MAX_QUERY_SIZE;
    const offset: Int64 = new Int64(0);

    const reportFilter = new ReportFilter();
    reportFilter.filepath = [report.checkedFile];

    const cmpData = new CompareData();

    this.dbService.getClient().getRunResults(
      [report.runId],
      limit,
      offset,
      [],
      reportFilter,
      cmpData
    ).then((reports: ReportDataList) => {
      // Adding reports to the tree.
      reports.forEach((report) => {
        this.addReport(report);
      });

      // Hide severity items of the tree which don't have any item.
      this.treeModel.roots.forEach((node: TreeNode) => {
        if (!node.getFirstChild()) {
          node.setIsHidden(true);
        } else {
          node._initChildren();
        }
      });

      // Expand tree node by the current report id.
      const reportNode = this.treeModel.getNodeById(this.report.reportId);
      if (reportNode) {
        reportNode.setActiveAndVisible();
        reportNode.expand();
      }
    });
  }

  ngAfterViewInit() {
    this.treeModel = this.treeComponent.treeModel;
  }

  getChildren(node: any) {
    if (node.data.getChildren) {
      return node.data.getChildren();
    }
  }

  private addReport(report: any) {
    const that = this;

    const severity = this.util.severityFromCodeToString(report.severity);
    const severityNode = this.treeModel.getNodeById(severity.toLowerCase());
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
              id: report.reportId + '_1',
              name: '<b><u>' + report.checkerMsg + '</u></b>',
              report: report
            });

            if (details.pathEvents.length < 1) {
              resolve(children);
              return;
            }

            details.pathEvents.forEach((step: BugPathEvent, index: number) => {
              children.push({
                id: report.reportId + '_' + (index + 1),
                name: index + '. '  + step.msg,
                report: report,
                step: step
              });
            });

            resolve(children);
          });
        });
      }
    });

    severityNode.setField('children', severityNode.children);
  }

  loadReport(report: ReportData, bugPathEvent: BugPathEvent) {
    this.loadReportEvent.emit({
      report: report,
      bugPathEvent: bugPathEvent
    });
  }
}
