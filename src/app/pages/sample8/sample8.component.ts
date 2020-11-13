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

import {Component, OnInit} from '@angular/core';
import {ReviewCommentEvent} from '../../../../projects/warpview-editor-ng/src/lib/elements/warp-view-editor/providers/events-comments-reducers';
import {Config} from '../../../../projects/warpview-editor-ng/src/lib/model/config';

@Component({
  selector: 'warpview-sample8',
  templateUrl: './sample8.component.html',
  styleUrls: ['./sample8.component.scss']
})
export class Sample8Component implements OnInit {
  visible = false;
  reviews: any[];
  reviewComments: ReviewCommentEvent[] = [{
    type: 'create',
    lineNumber: 6,
    createdBy: 'John',
    createdAt: '2019-01-01T00:00:00.000',
    text: 'Near the start',
    selection: {
      startColumn: 5,
      startLineNumber: 5,
      endColumn: 10,
      endLineNumber: 6,
    },
  }, {
    type: 'create',
    createdBy: 'John',
    createdAt: '2018-12-25T00:00:00.000',
    text: 'What did you mean?',
    lineNumber: 4
  } as ReviewCommentEvent];
  config = {
    messageClass: 'alert alert-info message',
    errorClass: 'alert alert-danger error',
    execButton: {class: 'btn btn-success'},
    datavizButton: {class: 'btn btn-success'},
    readOnly: false,
    hover: true,
    editor: {
      enableDebug: false, quickSuggestionsDelay: 3000,
      suggestOnTriggerCharacters: false,
      rawResultsReadOnly: false
    },
    codeReview: {
      enabled: true,
      currentUser: 'Bob',
      readonly: false,
      cancelButton: {
        label: 'Annuler',
        class: 'btn btn-sm btn-danger mr-2'
      },
      addButton: {
        label: 'Ajouter',
        class: 'btn btn-sm btn-primary mr-2'
      },
      replyButton: {
        class: 'btn btn-sm btn-primary mr-2'
      },
      removeButton: {
        class: 'btn btn-sm btn-danger mr-2'
      },
      editButton: {
        class: 'btn btn-sm btn-warning mr-2'
      }
    }
  } as Config;
  warpscript = `@training/dataset0
// warp.store.hbase.puts.committed is the number of datapoints committed to
// HBase since the restart of the Store daemon
[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW 9 d ] FETCH
[ SWAP mapper.rate 1 0 0 ] MAP
MINLONG MAXLONG`;

  constructor() {
  }

  ngOnInit() {
    this.reviews = [...this.reviewComments];
    this.visible = true;
  }

  warpViewEditorCodeReview($event: any) {
    this.reviews= $event;
  }
}
