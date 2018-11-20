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
    static mergeDeep(...sources) {
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
    static merge(obj, extended, deep) {
        for (const prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                // If property is an object, merge properties
                if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                    extended[prop] = Utils.mergeDeep(extended[prop], obj[prop]);
                }
                else {
                    extended[prop] = obj[prop];
                }
            }
        }
    }
    ;
}