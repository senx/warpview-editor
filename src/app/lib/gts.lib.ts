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

export class GTSLib {

  static color = ['#4D4D4D', '#5DA5DA', '#FAA43A', '#60BD68', '#F17CB0', '#B2912F', '#B276B2', '#DECF3F', '#F15854', '#607D8B'];

  static getColor(i) {
    return GTSLib.color[i % GTSLib.color.length];
  }

  static unique(arr) {
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

  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  }

  static transparentize(color, alpha: number): string {
    return 'rgba(' + GTSLib.hexToRgb(color).concat(alpha).join(',') + ')';
  }

  static isArray(value) {
    return value && typeof value === 'object' && value instanceof Array && typeof value.length === 'number'
      && typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
  }

  static isValidResponse(data) {
    let response;
    try {
      response = JSON.parse(data);
    } catch (e) {
      console.error('Response non JSON compliant', data);
      return false;
    }
    if (!GTSLib.isArray(response)) {
      console.error('Response isn\'t an Array', response);
      return false;
    }
    return true;
  }

  static isEmbeddedImage(item) {
    return !(typeof item !== 'string' || !/^data:image/.test(item));
  }

  static isEmbeddedImageObject(item) {
    return !((item === null) || (item.image === null) ||
      (item.caption === null) || !GTSLib.isEmbeddedImage(item.image));
  }

  static isPositionArray(item) {
    if (!item || !item.positions) {
      return false;
    }
    if (GTSLib.isPositionsArrayWithValues(item) || GTSLib.isPositionsArrayWithTwoValues(item)) {
      return true;
    }
    item.positions.forEach(elem => {
      if (elem.length < 2 || elem.length > 3) {
        return false;
      }
      elem.forEach(subElem => {
        if (typeof subElem !== 'number') {
          return false;
        }
      });
    });
    return true;
  }

  static isPositionsArrayWithValues(item) {
    if ((item === null) || (item.positions === null)) {
      return false;
    }
    item.positions.forEach(element => {
      if (element.length !== 3) {
        return false;
      }
      element.forEach(subElement => {
        if (typeof subElement !== 'number') {
          return false;
        }
      });
    });
    return true;
  }

  static isPositionsArrayWithTwoValues(item) {
    if ((item === null) || (item.positions === null)) {
      return false;
    }
    item.positions.forEach(element => {
      if (element.length !== 4) {
        return false;
      }
      element.forEach(subElement => {
        if (typeof subElement !== 'number') {
          return false;
        }
      });
    });
    return true;
  }

  static metricFromJSON(json) {
    const metric = {
      ts: json[0],
      value: undefined,
      alt: undefined,
      lon: undefined,
      lat: undefined
    };
    switch (json.length) {
      case 2:
        metric.value = json[1];
        break;
      case 3:
        metric.alt = json[1];
        metric.value = json[2];
        break;
      case 4:
        metric.lat = json[1];
        metric.lon = json[2];
        metric.value = json[3];
        break;
      case 5:
        metric.lat = json[1];
        metric.lon = json[2];
        metric.alt = json[3];
        metric.value = json[4];
    }
    return metric;
  }

  static gtsFromJSON(json, id) {
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

  static gtsFromJSONList(jsonList, prefixId) {
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
      if (GTSLib.isArray(gts)) {
        gtsList.push(GTSLib.gtsFromJSONList(gts, id));
      }
      if (GTSLib.isGts(gts)) {
        gtsList.push(GTSLib.gtsFromJSON(gts, id));
      }
      if (GTSLib.isEmbeddedImage(gts)) {
        gtsList.push({
          image: gts,
          caption: 'Image',
          id,
        });
      }
      if (GTSLib.isEmbeddedImageObject(gts)) {
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

  static flatDeep(arr1) {
    // tslint:disable-next-line:only-arrow-functions
    return arr1.reduce(function(acc, val) {
      if (Array.isArray(val)) {
        acc.concat(GTSLib.flatDeep(val));
      } else {
        acc.concat(val);
      }
    }, []);
  }

  static flattenGtsIdArray(a, r) {
    let elem;
    let j;
    if (!r) {
      r = [];
    }
    for (j = 0; j < a.content.length; j++) {
      elem = a.content[j];
      if (elem.content) {
        GTSLib.flattenGtsIdArray(elem, r);
      } else {
        if (elem.gts) {
          r.push(elem.gts);
        }
      }
    }
    return r;
  }

  static serializeGtsMetadata(gts) {
    const serializedLabels = [];
    Object.keys(gts.l).forEach((key) => {
      serializedLabels.push(key + '=' + gts.l[key]);
    });
    return (gts.id ? (gts.id + ' ') : '') + gts.c + '{' + serializedLabels.join(',') + '}';
  }

  static gtsToPath(gts) {
    const path = [];
    // Sort values
    gts.v = gts.v.sort((a, b) => {
      return a[0] - b[0];
    });
    gts.v.forEach((g, i) => {
      if (g.length === 2) {
        // timestamp, value
      }
      if (g.length === 3) {
        // timestamp, elevation, value
      }
      if (g.length === 4) {
        // timestamp, lat, lon, value
        path.push({ts: Math.floor(g[0] / 1000), lat: g[1], lon: g[2], val: g[3]});
      }
      if (g.length === 5) {
        // timestamp, lat, lon, elevation, value
        path.push({
          ts: Math.floor(g[0] / 1000),
          lat: g[1],
          lon: g[2],
          elev: g[3],
          val: g[4],
        });
      }
    });
    return path;
  }

  static equalMetadata(a, b) {
    if (a.c === undefined || b.c === undefined || a.l === undefined || b.l === undefined ||
      !(a.l instanceof Object) || !(b.l instanceof Object)) {
      console.error('[warp10-gts-tools] equalMetadata - Error in GTS, metadata is not well formed');
      return false;
    }
    if (a.c !== b.c) {
      return false;
    }
    // tslint:disable-next-line:forin
    for (const p in a.l) {
      if (!b.l.hasOwnProperty(p)) {
        return false;
      }
      if (a.l[p] !== b.l[p]) {
        return false;
      }
    }
    for (const p in b.l) {
      if (!a.l.hasOwnProperty(p)) {
        return false;
      }
    }
    return true;
  }

  static isGts(item) {
    return !(!item || item.c === null || item.l === null ||
      item.a === null || item.v === null || !GTSLib.isArray(item.v));
  }

  static isGtsToPlot(gts) {
    if (!GTSLib.isGts(gts) || gts.v.length === 0) {
      return false;
    }
    // We look at the first non-null value, if it's a String or Boolean it's an annotation GTS,
    // if it's a number it's a GTS to plot
    for (let i = 0; i < gts.v.length; i++) {
      if (gts.v[i][gts.v[i].length - 1] !== null) {
        // console.log("[warp10-gts-tools] isGtsToPlot - First value type", gts.v[i][gts.v[i].length - 1] );
        // noinspection JSPotentiallyInvalidConstructorUsage
        if (typeof (gts.v[i][gts.v[i].length - 1]) === 'number' ||
          // gts.v[i][gts.v[i].length - 1].constructor.name === 'Big' ||
          gts.v[i][gts.v[i].length - 1].constructor.prototype.toFixed !== undefined) {
          return true;
        }
        break;
      }
    }
    return false;
  }

  static isGtsToAnnotate(gts) {
    if (!GTSLib.isGts(gts) || gts.v.length === 0) {
      return false;
    }
    // We look at the first non-null value, if it's a String or Boolean it's an annotation GTS,
    // if it's a number it's a GTS to plot
    for (let i = 0; i < gts.v.length; i++) {
      if (gts.v[i][gts.v[i].length - 1] !== null) {
        // noinspection JSPotentiallyInvalidConstructorUsage
        if (typeof (gts.v[i][gts.v[i].length - 1]) !== 'number' &&
          (!!gts.v[i][gts.v[i].length - 1].constructor &&
            gts.v[i][gts.v[i].length - 1].constructor.name !== 'Big') &&
          gts.v[i][gts.v[i].length - 1].constructor.prototype.toFixed === undefined) {
          return true;
        }
        break;
      }
    }
    return false;
  }

  static gtsSort(gts) {
    if (gts.isSorted) {
      return;
    }
    gts.v = gts.v.sort((a, b) => a[0] - b[0]);
    gts.isSorted = true;
  }

  static gtsTimeRange(gts) {
    GTSLib.gtsSort(gts);
    if (gts.v.length === 0) {
      return null;
    }
    return [gts.v[0][0], gts.v[gts.v.length - 1][0]];
  }

  static guid() {
    let uuid = '', i, random;
    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i == 8 || i == 12 || i == 16 || i == 20) {
        uuid += '-';
      }
      uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
  }

  static isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

}
