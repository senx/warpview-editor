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

  static detectResize(_element) {
    let promise: any = {};
    let _listener = [];

    promise.addResizeListener = listener => {
      if (typeof (listener) != "function") {
        return;
      }
      if (_listener.includes(listener)) {
        return;
      }
      _listener.push(listener);
    };

    promise.removeResizeListener = function(listener) {
      let index = _listener.indexOf(listener);
      if (index >= 0) {
        _listener.splice(index, 1);
      }
    };

    let _size = {width: _element.clientWidth, height: _element.clientHeight};

    function checkDimensionChanged() {
      let _currentSize = {width: _element.clientWidth, height: _element.clientHeight};
      if (_currentSize.width != _size.width || _currentSize.height != _size.height) {
        let previousSize = _size;
        _size = _currentSize;

        let diff = {width: _size.width - previousSize.width, height: _size.height - previousSize.height};

        fire({
          width: _size.width,
          height: _size.height,
          previousWidth: previousSize.width,
          previousHeight: previousSize.height,
          _element: _element,
          diff: diff
        });
      }

      _size = _currentSize;
    }

    function fire(info) {
      if (!_element.parentNode) {
        return;
      }
      _listener.forEach(listener => {
        listener(info);
      });
    }


    // @ts-ignore
    let mouseDownListener = event => {

      // @ts-ignore
      let mouseUpListener = event => {
        window.removeEventListener("mouseup", mouseUpListener);
        window.removeEventListener("mousemove", mouseMoveListener);
      };

      // @ts-ignore
      let mouseMoveListener = event => {
        checkDimensionChanged();
      };

      window.addEventListener("mouseup", mouseUpListener);
      window.addEventListener("mousemove", mouseMoveListener);
    };

    _element.addEventListener("mousedown", mouseDownListener);

    // @ts-ignore
    window.addEventListener("resize", event => {
      checkDimensionChanged();
    });

    return promise;
  }
}
