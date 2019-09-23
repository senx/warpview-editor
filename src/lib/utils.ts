/*
 *  Copyright 2018  SenX S.A.S.
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
  /**
   *
   * @param sources
   * @returns {any}
   */
  static mergeDeep(...sources: any[]): any {
    // Variables
    let extended = {};
    let deep = true;
    let i = 0;
    // Merge the object into the extended object
    // Loop through each object and conduct a merge
    for (; i < sources.length; i++) {
      const obj = sources[i];
      Utils.merge(obj, extended, deep);
    }

    return extended;
  }

  /**
   *
   * @param obj
   * @param extended
   * @param {boolean} deep
   */
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
  };

  /**
   *
   * @param obj
   * @return {any[]}
   */
  static toArray(obj: any): any[] {
    const arr = [];
    Object.keys(obj).forEach(k => arr.push(obj[k]));
    return arr;
  }


  static readCommentsModifiers(executedWarpScript: string): any {
    let result: any = {};
    let warpscriptlines = executedWarpScript.split('\n');
    for (let l = 0; l < warpscriptlines.length; l++) {
      let currentline = warpscriptlines[l];
      if (currentline.startsWith("//")) {
        //find and extract // @paramname parameters
        let extraparamsPattern = /\/\/\s*@(\w*)\s*(.*)$/g;
        let lineonMatch: RegExpMatchArray | null;
        let re = RegExp(extraparamsPattern);
        while (lineonMatch = re.exec(currentline.replace('\r', ''))) {  //think about windows... \r\n in mc2 files !
          let parametername = lineonMatch[1];
          let parametervalue = lineonMatch[2];
          switch (parametername) {
            case "endpoint":        //        // @endpoint http://mywarp10server/api/v0/exec
              result.warp10URL = parametervalue;   // overrides the Warp10URL configuration
              break;
            case "localmacrosubstitution":
              result.substitutionWithLocalMacros = ("true" === parametervalue.toLowerCase());   // overrides the substitutionWithLocalMacros
              break;
            case "timeunit":
              if (['us', 'ms', 'ns'].indexOf(parametervalue.trim()) > -1) {
                result.previewTimeUnit = parametervalue.trim();
              }
              break;
            case "preview":
              result.preview = parametervalue.toLowerCase().substr(0, 4)
              break;
            default:
              break;
          }
        }
      }
      else {
        break; //no more comments at the beginning of the file
      }
    }
    return result;
  }

}
