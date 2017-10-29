import { NgFor } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import * as CodeMirror from 'codemirror';

import { DbService } from '../shared';


import './bug.component.scss';

@Component({
  selector: 'bug-page',
  templateUrl: './bug.component.html',
  providers: [ DbService ]
})
export class BugComponent implements OnInit {
  bug : any;
  editor : CodeMirror.Editor;

  constructor(
    private rd: Renderer2,
    private dbService: DbService) {
  }

  public ngOnInit() {
    var that = this;

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

  public setContent(sourceFile: any) {
    this.editor.setValue(sourceFile.fileContent);
  }
}