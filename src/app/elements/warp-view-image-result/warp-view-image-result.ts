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

import {GTSLib} from '../../lib/gts.lib';
import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'warpview-image-result',
  templateUrl: './warp-view-image-result.html',
  styleUrls: ['./warp-view-image-result.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewImageResult {

  @Input() set result(newValue: any[]) {
    this._result = newValue;
    this.loading = true;
    console.debug('[WarpViewRawResult] - The new value of result is: ', newValue);
    if (newValue && GTSLib.isArray(newValue)) {
      this.imageList = newValue.filter((v: any) => {
        return ((typeof (v) === 'string') && (String(v).startsWith('data:image/png;base64,')));
      });
    } else {
      this.imageList = [];
    }
    this.loading = false;
  }

  get result(): any[] {
    return this._result;
  }

  @Input() set theme(newValue: string) {
    this._theme = newValue;

  }

  get theme(): string {
    return this._theme;
  }

  @Input() config: object = {};


  // tslint:disable-next-line:variable-name
  _result: any[] = [];
  // tslint:disable-next-line:variable-name
  _theme: string = 'light';

  loading = false;
  imageList: string[] = [];

  isArray(arr: any) {
    return GTSLib.isArray(arr);
  }
}
