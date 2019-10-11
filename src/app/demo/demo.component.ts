import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'warpview-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {
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

  constructor() {
  }

  ngOnInit() {
  }

}
