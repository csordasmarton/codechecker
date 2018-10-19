import { Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as CodeMirror from 'codemirror';

const jsPlumb = require('jsplumb').jsPlumb;

import Int64 = require('node-int64');

import {
  CompareData,
  Encoding,
  MAX_QUERY_SIZE,
  Order,
  ReportData,
  ReportDataList,
  ReportDetails,
  ReportFilter,
  SortMode,
  SortType,
  SourceFileData,
  BugPathEvent
} from '@cc/db-access';

import { DbService } from '../shared';
import { ReportEventData } from './bug-tree';

@Component({
  selector: 'bug-page',
  templateUrl: './bug.component.html',
  providers: [ DbService ],
  styleUrls: ['./bug.component.scss']
})
export class BugComponent implements OnInit, OnDestroy {
  report: ReportData;
  sourceFile: SourceFileData;

  private lineMarks: any[] = [];
  private lineWidgets: any[] = [];

  sub: any;
  queryParams: any;

  bug: any;
  editor: CodeMirror.Editor;
  private jsPlumbInstance: any;

  constructor(
    private elRef: ElementRef,
    private rd: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private dbService: DbService) {
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      this.queryParams = params;
    });

    const elemet = this.rd.selectRootElement('#editor .content');
    this.editor = CodeMirror(elemet, {
      lineNumbers: true,
      readOnly: true,
      mode: 'text/x-c++src',
      gutters: ['CodeMirror-linenumbers', 'bugInfo'],
      extraKeys: {},
      viewportMargin: 500
    });

    // Load the report by query parameters.
    const reportId = this.route.snapshot.queryParams['reportId'];
    const reportHash = this.route.snapshot.queryParams['reportHash'];
    this.loadReport(reportId, reportHash);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.resize();
  }

  resetJsPlumb() {
    const jsPlumbParentElement =
      this.elRef.nativeElement.querySelector('.CodeMirror-lines');
    jsPlumbParentElement.style.position = 'relative';

    this.jsPlumbInstance = jsPlumb.getInstance({
      Container : jsPlumbParentElement,
      Anchor : ['Perimeter', { shape : 'Ellipse' }],
      Endpoint : ['Dot', { radius: 1 }],
      PaintStyle : { stroke : '#a94442', strokeWidth: 2 },
      Connector: ['Bezier', { curviness: 10 }],
      ConnectionsDetachable : false,
      ConnectionOverlays : [
        ['Arrow', { location: 1, length: 10, width: 8 }]
      ]
    });
  }

  private getFullHeight(): number {
    const windowHeight = window.innerHeight;
    const elementOffsetTop = this.elRef.nativeElement.getBoundingClientRect().top;

    return windowHeight - elementOffsetTop;
  }

  resize() {
    const fullHeight = this.getFullHeight();
    this.editor.setSize('100%', fullHeight + 'px');
    this.editor.refresh();
  }

  loadReportEvent(event: ReportEventData) {
    const report = event.report;
    this.loadReport(report.reportId, report.bugHash, event.bugPathEvent);
  }

  loadReport(reportId: Int64, reportHash: string, bugPathEvent?: BugPathEvent) {
    if (reportId !== null && reportId !== undefined) {
      this.dbService.getClient().getReport(reportId).then(
      (reportData: ReportData) => {
        this.setReport(reportData, bugPathEvent);
      });
    } else {
      const runIds: Int64[] = []; // We should get this from the URL parameters.

      const limit: Int64 = MAX_QUERY_SIZE;
      const offset: Int64 = new Int64(0);

      // Get all reports by report hash
      const reportFilter = new ReportFilter();
      reportFilter.reportHash = [reportHash];
      reportFilter.isUnique = false;

      const cmpData = new CompareData();

      // We set a sort option to select a report which has the shortest
      // bug path length.
      const sortMode = new SortMode();
      sortMode.type = SortType.BUG_PATH_LENGTH;
      sortMode.ord = Order.ASC;
      this.dbService.getClient().getRunResults(runIds, limit, offset,
      [sortMode], reportFilter, cmpData).then(
        (reports: ReportDataList) => {
          this.setReport(reports[0], bugPathEvent);
        });
    }
  }

  setReport(report: ReportData, bugPathEvent?: BugPathEvent) {
    const prevReport = this.report;
    if (!prevReport ||
         prevReport.reportId.toNumber() !== report.reportId.toNumber()
    ) {
      this.report = report;
    }

    if (!prevReport ||
         report.checkedFile !== prevReport.checkedFile
    ) {
      this.dbService.getClient().getSourceFileData(
        report.fileId,
        true,
        Encoding.DEFAULT
      ).then((sourceFile: SourceFileData) => {
        this.setContent(sourceFile);
        this.drawBugPath();
        this.jumpTo(report.line.toNumber(), 0);
      });
    }

    if (!prevReport || report.reportId.toNumber() !== prevReport.reportId.toNumber()) {
      this.drawBugPath();
    }

    // Jump to the correct position.
    const line = bugPathEvent
      ? bugPathEvent.startLine.toNumber()
      : report.line.toNumber();

    this.jumpTo(line, 0);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  drawBugPath() {
    this.clearBubbles();
    this.clearLines();

    this.dbService.getClient().getReportDetails(this.report.reportId).then(
    (reportDetail: ReportDetails) => {
      const points = reportDetail.executionPath.filter((path: any) => {
        return path.fileId.toNumber() === this.sourceFile.fileId.toNumber();
      });
      const bubbles = reportDetail.pathEvents.filter((path: any) => {
        return path.fileId.toNumber() === this.sourceFile.fileId.toNumber();
      });

      this.addBubbles(bubbles);
      this.addLines(points);
    });
  }

  clearBubbles() {
    this.lineWidgets.forEach(widget => { widget.clear(); });
    this.lineWidgets = [];
  }

  clearLines() {
    this.lineMarks.forEach(mark => { mark.clear(); });
    this.lineMarks = [];
    this.resetJsPlumb();
  }

  addBubbles(bubbles: any[]) {
    this.editor.operation(() => {
      bubbles.forEach((bubble, i) => {
        const enumType = i === bubbles.length - 1
            ? 'error' : bubble.msg.indexOf(' (fixit)') > -1
            ? 'fixit' : 'info';
        const left = this.editor.defaultCharWidth() * bubble.startCol + 'px';

        const widget = document.createElement('span');
        widget.innerHTML = (bubbles.length !== 1
          ? this.createBugStepEnumeration(i + 1, enumType).outerHTML
          : '') + bubble.msg;
        widget.setAttribute('class', 'checker-msg ' + enumType);
        widget.setAttribute('style', 'margin-left: ' + left);

        this.lineWidgets.push(this.editor.addLineWidget(
          bubble.startLine.toNumber() - 1, widget));
      });
    });
  }

  addLines(points: any[]) {
    this.editor.operation(() => {
      points.forEach((p, i) => {
        const from = { line : p.startLine - 1, ch : p.startCol - 1 };
        const to =   { line : p.endLine - 1,   ch : p.endCol       };
        const title = [from.line, from.ch, to.line, to.ch].join('_');

        this.lineMarks.push(this.editor.getDoc().markText(from, to,
          { className : 'checker-step', title: title }));
      });
    });

    const range = this.editor.getViewport();
    this.drawLines(range.from, range.to);
  }

  jumpTo(line: number, column: number) {
    setTimeout(() => {
      const selPosPixel
        = this.editor.charCoords({ line : line, ch : column }, 'local');
      // let editorDom = this.rd.selectRootElement('#editor');
      const editorSize = {
        width :  0,
        height : 535, // TODO: get the correct editor height.
      };

      this.editor.scrollIntoView({
        top    : selPosPixel.top - 100,
        bottom : selPosPixel.top + editorSize.height - 150,
        left   : selPosPixel.left < editorSize.width - 100
               ? 0
               : selPosPixel.left - 50,
        right  : selPosPixel.left < editorSize.width - 100
               ? 10
               : selPosPixel.left + editorSize.width - 100
      }, null);
    }, 0);
  }

  private getDomToMarker(textMarker: any) {
    const selector = `[title='${textMarker.title}']`;
    return this.elRef.nativeElement.querySelector(selector);
  }

  private drawLines(from: number, to: number) {
    if (!this.lineMarks.length) {
      return;
    }

    let prev: any = null;
    this.lineMarks.forEach((textMarker) => {
      const current = this.getDomToMarker(textMarker);

      if (!current) {
        return;
      }

      if (prev) {
        this.jsPlumbInstance.connect({
          source : prev,
          target : current
        });
      }

      prev = current;
    });
  }

  private createBugStepEnumeration(value: number, type: string): HTMLElement {
    const element = document.createElement('span');
    element.innerHTML = value.toString();
    element.setAttribute('class', 'checker-enum ' + type);
    return element;
  }

  backToReports() {
    const queryParams = {...this.queryParams};
    // Remove `hash` parameter from the query parameters.
    delete queryParams['hash'];

    this.router.navigate(['../reports'], {
      queryParams: queryParams,
      relativeTo: this.route
    });
  }

  public setContent(sourceFile: any) {
    this.sourceFile = sourceFile;
    this.editor.setValue(sourceFile.fileContent);
    this.resize();
  }
}
