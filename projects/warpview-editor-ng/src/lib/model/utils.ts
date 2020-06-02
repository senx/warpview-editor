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

export class Utils {

  static mergeDeep(...sources: any[]): any {
    // Variables
    const extended = {};
    const deep = true;
    let i = 0;
    // Merge the object into the extended object
    // Loop through each object and conduct a merge
    for (; i < sources.length; i++) {
      const obj = sources[i];
      Utils.merge(obj, extended, deep);
    }

    return extended;
  }

  static merge(obj: any, extended: any, deep: boolean) {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        // If property is an object, merge properties
        if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
          extended[prop] = Utils.mergeDeep(extended[prop], obj[prop]);
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  }

  static toArray(obj: any): any[] {
    const arr = [];
    Object.keys(obj).forEach(k => arr.push(obj[k]));
    return arr;
  }
}
