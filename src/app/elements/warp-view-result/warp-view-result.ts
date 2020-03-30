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

import {GTSLib} from '../../lib/gts.lib';
import {Component, Input, ViewEncapsulation} from '@angular/core';
import {stringify} from '@angular/compiler/src/util';

@Component({
  selector: 'warpview-result',
  templateUrl: './warp-view-result.html',
  styleUrls: ['./warp-view-result.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class WarpViewResult {

  @Input()
  get result(): any[] {
    return this._result;
  };

  set result(res: any[]) {
    this._result = res;
    this._resultStr = (res || []).map(l=>JSON.stringify(l));
  }

  @Input() theme = 'light';
  @Input() config: object = {};
  @Input() loading = false;
  _result: any[];
  _resultStr: string[];

  constructor(private gtsLib: GTSLib) {

  }

  isArray(arr: any) {
    return this.gtsLib.isArray(arr);
  }

  stingify(str) {
    return JSON.stringify(str);
  }
}
