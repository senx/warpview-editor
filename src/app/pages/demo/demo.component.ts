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
import {Config} from '../../lib/config';
import {$e} from 'codelyzer/angular/styles/chars';
import {UUID} from 'angular2-uuid';

@Component({
  selector: 'warpview-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {
  @ViewChild('editor', {static: false}) editor: ElementRef<Element>;
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
  warpscript = `@training/dataset0
// warp.store.hbase.puts.committed is the number of datapoints committed to
// HBase since the restart of the Store daemon
[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW 9 d ] FETCH
[ SWAP mapper.rate 1 0 0 ] MAP
MINLONG MAXLONG`;
  ctrlClick: any;
  breakpoint: any;
  size: any;
  warpscriptAttr: string;
  editorLoaded: any;
  private sessionId: string;

  constructor() {
  }

  ngOnInit() {
    this.visible = true;
  }

  abort() {
    // @ts-ignore
    this.editor.abort(this.sessionId);
  }

  exec() {
    this.sessionId = UUID.UUID();
    // @ts-ignore
    this.editor.execute(this.sessionId);
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
    this.editorLoaded = {'editorLoaded' : $event};
  }
}
