import { NgFor } from '@angular/common';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as CodeMirror from 'codemirror';

import { DbService } from '../shared';


import './bug.component.scss';

@Component({
  selector: 'bug-page',
  templateUrl: './bug.component.html',
  providers: [ DbService ]
})
export class BugComponent implements OnInit, OnDestroy {
  sub: any;
  queryParams: any;

  bug : any;
  editor : CodeMirror.Editor;

  constructor(
    private rd: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private dbService: DbService) {
  }

  public ngOnInit() {
    var that = this;

    this.sub = this.route.queryParams.subscribe(params => {
      this.queryParams = params;
    });

    let elemet = this.rd.selectRootElement('#editor');
    this.editor = CodeMirror(elemet, {
      lineNumbers : true,
      readOnly : true,
      mode : 'text/x-c++src',
      gutters : ['CodeMirror-linenumbers', 'bugInfo'],
      extraKeys : {},
      viewportMargin : 500
    });

    this.dbService.getSourceFileData(1, true, null,
    (err: any, sourceFile : any) => {
      that.setContent(sourceFile);
    });
  }

  public ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public backToReports() {
    let queryParams = {...this.queryParams};
    // Remove `hash` parameter from the query parameters.
    delete queryParams['hash'];

    this.router.navigate(['../reports'], {
      queryParams: queryParams,
      relativeTo: this.route
    });
  }

  public setContent(sourceFile: any) {
    this.editor.setValue(sourceFile.fileContent);
  }
}