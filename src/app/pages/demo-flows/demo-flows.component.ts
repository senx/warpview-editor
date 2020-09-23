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

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Config} from '../../../../projects/warpview-editor-ng/src/lib/model/config';
import {WarpViewEditorComponent} from '../../../../projects/warpview-editor-ng/src/lib/elements/warp-view-editor/warp-view-editor.component';

@Component({
  selector: 'warpview-demo',
  templateUrl: './demo-flows.component.html',
  styleUrls: ['./demo-flows.component.scss']
})
export class DemoFlowsComponent implements OnInit {
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
      enableDebug: true, quickSuggestionsDelay: 3000,
      suggestOnTriggerCharacters: false,
      rawResultsReadOnly: false
    }
  } as Config;
  warpscript2 = '-5372520086604731500';
  warpscript = `now = NOW()
token = 'TjqCCyLzGawOSVhB_.RPpB4yrOdcgY8Chybysyug8gyj5acOY7cQGLggkMxIyjusVEdL0qs5q1s6iI0exJAGgz1IoxdPr0ZPkad81SocrDVxg_xn3pErWEulz0dG7l2R0uPzPKamiEfMyLdLijt3r4e69MseBic3w86QP28uzb5EaBMiKc1TwV';
gts = FETCH( [ token, 'sighting.ufo', { 'state': 'fl' }, now, 10 * d(365)] );
buckets = BUCKETIZE([ gts, bucketizer.sum(), now, d(7), 0] );
reduced = REDUCE([buckets, [], reducer.sum()]);
return reduced`;
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
    this.editorLoaded = {'editorLoaded': $event};
  }
}
