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

import { ElementRef } from "@angular/core";


export class BubblingEvents {

  /**
   * Angular provides support for custom events via Output properties and the EventEmitter. Unlike DOM events Angular custom events do not bubble.
   * see : http://blog.davidjs.com/2018/02/angular-custom-event-bubbling/
   * This class allow to create events that can bubble up outside angular element webcomponents
   */
  static emitBubblingEvent(el:ElementRef,eventname:string,eventdetail?:any) {
    el.nativeElement.dispatchEvent(new CustomEvent(eventname, {bubbles: true, detail: eventdetail}));
  }

}
