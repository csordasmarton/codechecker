import { Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as CodeMirror from 'codemirror';

let jsPlumb = require('jsplumb').jsPlumb;

import { DbService } from '../shared';

@Component({
  selector: 'bug-page',
  templateUrl: './bug.component.html',
  providers: [ DbService ],
  styleUrls: ['./bug.component.scss']
})
export class BugComponent implements OnInit, OnDestroy {
  report: any;
  sourceFile: any;

  private lineMarks: any[] = [];
  private lineWidgets: any[] = [];

  sub: any;
  queryParams: any;

  bug : any;
  editor : CodeMirror.Editor;
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

    let elemet = this.rd.selectRootElement('#editor');
    this.editor = CodeMirror(elemet, {
      lineNumbers: true,
      readOnly: true,
      mode: 'text/x-c++src',
      gutters: ['CodeMirror-linenumbers', 'bugInfo'],
      extraKeys: {},
      viewportMargin: 500
    });

    let reportId = this.route.snapshot.queryParams['reportId']; // TODO: this should come from the bug tree.
    this.loadReport(reportId);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.resize();
  }

  resetJsPlumb() {
    var jsPlumbParentElement =
      this.elRef.nativeElement.querySelector('.CodeMirror-lines');
    jsPlumbParentElement.style.position = 'relative';

    this.jsPlumbInstance = jsPlumb.getInstance({
      Container : jsPlumbParentElement,
      Anchor : ['Perimeter', { shape : 'Ellipse' }],
      Endpoint : ['Dot', { radius: 1 }],
      PaintStyle : { stroke : '#a94442', strokeWidth: 2 },
      Connector:[ "Bezier", { curviness: 10 }],
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
    var fullHeight = this.getFullHeight();
    console.log(fullHeight);
    this.editor.setSize('100%', fullHeight + 'px');
    this.editor.refresh();
  }

  loadReport(reportId: number) {
    this.dbService.getReport(reportId, (err: any, reportData: any) => {
      this.report = reportData;

      this.dbService.getSourceFileData(reportData.fileId, true, null,
        (err: any, sourceFile : any) => {
          this.setContent(sourceFile);
          this.drawBugPath();
          this.jumpTo(reportData.line.toNumber(), 0);
        });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  drawBugPath() {
    this.clearBubbles();
    this.clearLines();

    this.dbService.getReportDetails(this.report.reportId,
    (err: string, reportDetail: any) => {
      let points = reportDetail.executionPath.filter((path: any) => {
        return path.fileId.toNumber() === this.sourceFile.fileId.toNumber();
      });
      let bubbles = reportDetail.pathEvents.filter((path: any) => {
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
        var enumType = i === bubbles.length - 1
            ? 'error' : bubble.msg.indexOf(' (fixit)') > -1
            ? 'fixit' : 'info';
        var left = this.editor.defaultCharWidth() * bubble.startCol + 'px';

        let widget = document.createElement('span');
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
        let from = { line : p.startLine - 1, ch : p.startCol - 1 };
        let to =   { line : p.endLine - 1,   ch : p.endCol       };
        let title = [from.line, from.ch, to.line, to.ch].join('_');

        this.lineMarks.push(this.editor.getDoc().markText(from, to,
          { className : 'checker-step', title: title }));
      });
    });

    var range = this.editor.getViewport();
    this.drawLines(range.from, range.to);
  }

  jumpTo(line: number, column: number) {
    setTimeout(() => {
      var selPosPixel
        = this.editor.charCoords({ line : line, ch : column }, 'local');
      //let editorDom = this.rd.selectRootElement('#editor');
      var editorSize = {
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
    let selector = `[title='${textMarker.title}']`;
    return this.elRef.nativeElement.querySelector(selector);
  }

  private drawLines(from: number, to: number) {
    if (!this.lineMarks.length)
      return;

      let prev: any = null;
      this.lineMarks.forEach((textMarker) => {
        let current = this.getDomToMarker(textMarker);

        if (!current)
          return;

        if (prev)
          this.jsPlumbInstance.connect({
            source : prev,
            target : current
          });

        prev = current;
      });
  }

  private createBugStepEnumeration(value: number, type: string): HTMLElement {
    let element = document.createElement('span');
    element.innerHTML = value.toString();
    element.setAttribute('class', 'checker-enum ' + type);
    return element;
  }

  backToReports() {
    let queryParams = {...this.queryParams};
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