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
import {Component, Input, ViewEncapsulation} from '@angular/core';
import {Logger} from '../../lib/logger';

@Component({
  selector: 'warpview-image-result',
  templateUrl: './warp-view-image-result.html',
  styleUrls: ['./warp-view-image-result.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewImageResult {

  @Input() set debug(debug: boolean | string) {
    if (typeof debug === 'string') {
      debug = 'true' === debug;
    }
    this._debug = debug;
    this.LOG.setDebug(debug);
  }

  get debug() {
    return this._debug;
  }

  @Input() set result(newValue: any[]) {
    this._result = newValue;
    this.loading = true;
    this.LOG.debug(['isArray'], 'The new value of result is: ', newValue);
    if (newValue && this.gtsLib.isArray(newValue)) {
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
  _theme = 'light';
  // tslint:disable-next-line:variable-name
  _debug = false;
  loading = false;
  imageList: string[] = [];
  private LOG: Logger;

  constructor(private gtsLib: GTSLib) {
    this.LOG = new Logger(WarpViewImageResult, this._debug);
  }

  isArray(arr: any) {
    this.LOG.debug(['isArray'], this.gtsLib.isArray(arr));
    return this.gtsLib.isArray(arr);
  }
}
