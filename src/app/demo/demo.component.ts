/*
 *  Copyright 2019 SenX S.A.S.
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

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'warpview-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {
  @ViewChild('editor', {static: true}) editor: ElementRef<HTMLElement>;
  config = {
    quickSuggestionsDelay: 3000,
    suggestOnTriggerCharacters: false,
    messageClass: 'alert alert-info message',
    errorClass: 'alert alert-danger error',
    execButton: {class: 'btn btn-success'},
    datavizButton: {class: 'btn btn-success'},
    readOnly: false,
    hover: true,
    editor: {enableDebug: true}
  };
  warpscript = `@training/dataset0
// warp.store.hbase.puts.committed is the number of datapoints committed to
// HBase since the restart of the Store daemon
[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW 10 d ] FETCH
[ SWAP mapper.rate 1 0 0 ] MAP

// Keep only 1000 datapoints per GTS
1000 LTTB
DUP
// Detect 5 anomalies per GTS using an ESD (Extreme Studentized Deviate) Test
5 false ESDTEST
// Convert the ticks identified by ESDTEST into an annotation GTS
<%
DROP // excude element index
NEWGTS // create a new GTS
SWAP // get timestamp list
<% NaN NaN NaN 'anomaly' ADDVALUE %> FOREACH // for each timestamp
%> LMAP
2 ->LIST // Put our GTS in a list
ZIP // merge into a list of GTS`;
  ctrlClick: any;
  constructor() {
  }

  ngOnInit() {
  }

  abort() {
    // @ts-ignore
    this.editor.abort();
  }

  exec() {
    // @ts-ignore
    this.editor.execute();
  }

  warpViewEditorCtrlClick(event) {
    this.ctrlClick = event;
  }
}
