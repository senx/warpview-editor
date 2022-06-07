/*
 *  Copyright 2020 SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import {Component, OnInit, ViewChild} from '@angular/core';
import {Config} from '../../../../projects/warpview-editor-ng/src/lib/model/config';
import {WarpViewEditorComponent} from '../../../../projects/warpview-editor-ng/src/lib/elements/warp-view-editor/warp-view-editor.component';

@Component({
  selector: 'warpview-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {
  @ViewChild('editor') editor: WarpViewEditorComponent;
  visible = false;
  config = {
    messageClass: 'alert alert-info message',
    errorClass: 'alert alert-danger error',
    execButton: {class: 'btn btn-success'},
    datavizButton: {class: 'btn btn-success'},
    readOnly: false,
    hover: true,
    editor: {
      enableDebug: false, quickSuggestionsDelay: 1,
      suggestOnTriggerCharacters: true,
      rawResultsReadOnly: false
    }
  } as Config;
  warpscript = `NEWGTS 'v' STORE
      NEWGTS 'a' STORE
0 100 <%
  'ts' STORE
  $v NOW $ts STU * - NaN NaN NaN RAND ADDVALUE DROP
  $a NOW $ts STU * - NaN NaN NaN    T ADDVALUE DROP
%> FOR
[ $v $a $a $a ]`;
  ctrlClick: any;
  breakpoint: any;
  size: any;
  warpscriptAttr: string;
  editorLoaded: any;

  constructor() {
  }

  ngOnInit() {
    this.visible = true;
  }

  abort() {
    this.editor.abort();
  }

  exec() {
    this.editor.execute();
  }

  warpViewEditorCtrlClick(event) {
    this.ctrlClick = event.detail;
  }

  warpViewEditorBreakPoint(event) {
    this.breakpoint = event.detail;
  }

  warpViewEditorSize(event) {
    this.size = event.detail;
  }

  inject() {
    this.warpscriptAttr = Math.random().toString(36);
  }

  warpViewEditorLoaded($event: any) {
    setTimeout(() => this.editorLoaded = {'editorLoaded': $event});
  }
}
