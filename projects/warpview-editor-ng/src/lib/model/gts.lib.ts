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
import {Injectable} from '@angular/core';

@Injectable()
export class GTSLib {

  color = ['#4D4D4D', '#5DA5DA', '#FAA43A', '#60BD68', '#F17CB0', '#B2912F', '#B276B2', '#DECF3F', '#F15854', '#607D8B'];

  getColor(i) {
    return this.color[i % this.color.length];
  }

  unique(arr) {
    const u = {};
    const a = [];
    for (let i = 0, l = arr.length; i < l; ++i) {
      if (!u.hasOwnProperty(arr[i])) {
        a.push(arr[i]);
        u[arr[i]] = 1;
      }
    }
    return a;
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  }

  transparentize(color, alpha: number): string {
    return 'rgba(' + this.hexToRgb(color).concat(alpha).join(',') + ')';
  }

  isArray(value) {
    return value && typeof value === 'object' && value instanceof Array && typeof value.length === 'number'
      && typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
  }

  isEmbeddedImage(item) {
    return !(typeof item !== 'string' || !/^data:image/.test(item));
  }

  isEmbeddedImageObject(item) {
    return !((item === null) || (item.image === null) ||
      (item.caption === null) || !this.isEmbeddedImage(item.image));
  }

  gtsFromJSON(json, id) {
    return {
      gts: {
        c: json.c,
        l: json.l,
        a: json.a,
        v: json.v,
        id,
      },
    };
  }

  gtsFromJSONList(jsonList, prefixId) {
    const gtsList = [];
    let id;
    jsonList.forEach((item, i) => {
      let gts = item;
      if (item.gts) {
        gts = item.gts;
      }
      if ((prefixId !== undefined) && (prefixId !== '')) {
        id = prefixId + '-' + i;
      } else {
        id = '' + i;
      }
      if (this.isArray(gts)) {
        gtsList.push(this.gtsFromJSONList(gts, id));
      }
      if (this.isGts(gts)) {
        gtsList.push(this.gtsFromJSON(gts, id));
      }
      if (this.isEmbeddedImage(gts)) {
        gtsList.push({
          image: gts,
          caption: 'Image',
          id,
        });
      }
      if (this.isEmbeddedImageObject(gts)) {
        gtsList.push({
          image: gts.image,
          caption: gts.caption,
          id,
        });
      }
    });
    return {
      content: gtsList,
    };
  }

  flatDeep(arr1) {
    // tslint:disable-next-line:only-arrow-functions
    return arr1.reduce((acc, val) => {
      if (Array.isArray(val)) {
        acc.concat(this.flatDeep(val));
      } else {
        acc.concat(val);
      }
    }, []);
  }

  isGts(item) {
    return !(!item || item.c === null || item.l === null ||
      item.a === null || item.v === null || !this.isArray(item.v));
  }

  isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

}
