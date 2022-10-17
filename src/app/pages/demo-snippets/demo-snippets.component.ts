/*
 *  Copyright 2022 SenX S.A.S.
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
import {Config} from '../../../../projects/warpview-editor-ng/src/lib/model/config';

@Component({
  selector: 'warpview-editor-demo-snippets',
  templateUrl: './demo-snippets.component.html',
  styleUrls: ['./demo-snippets.component.scss']
})
export class DemoSnippetsComponent implements OnInit {

  visible = false;
  config: Config = {
    ... new Config(),
    messageClass: 'alert alert-info',
    errorClass: 'alert alert-danger',
    execButton: {'class': 'btn btn-success mt-1'},
    readOnly: false,
    hover: true,
    snippets: {
      toto: {
        prefix: "Toto",
        body: [
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          'Aenean laoreet ac tortor non pulvinar.',
          'Praesent ante mauris, facilisis vel varius non, varius vel eros.'
        ]
      }
    }
  };

  constructor() {
  }

  ngOnInit() {
    this.visible = true;
  }
}
