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

import {GTSLib} from '../../model/gts.lib';
import {Component, Input, ViewEncapsulation} from '@angular/core';
import {JsonLib} from '../../model/jsonLib';

@Component({
  selector: 'warpview-result',
  templateUrl: './warp-view-result.html',
  styleUrls: ['./warp-view-result.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class WarpViewResult {

  @Input() theme = 'light';
  @Input() config: object = {};
  @Input() loading = false;
  _res: string;
  _result: any[];
  _resultStr: any[];

  @Input()
  get result(): string {
    return this._res;
  };

  set result(res: string) {
    this._res = res;
    this._result = new JsonLib().parse(res || '[]', undefined);
    this._resultStr = (this._result || []).map(l => {
      const lstr = JSON.stringify(l);
      if (lstr.startsWith('[') || lstr.startsWith('{')) {
        return lstr;
      } else {
        return l;
      }
    });
  }

  constructor(private gtsLib: GTSLib) {
  }

  isArray(arr: any) {
    return this.gtsLib.isArray(arr);
  }
}
