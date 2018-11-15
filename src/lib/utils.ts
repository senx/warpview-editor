export class Utils {
  /**
   *
   * @param sources
   * @returns {any}
   */
  static mergeDeep(...sources:any[]): any {
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
  static merge(obj:any, extended:any, deep:boolean) {
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
}
