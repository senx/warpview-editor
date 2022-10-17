/*
 *  Copyright 2020-2022 SenX S.A.S.
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

import {Injector, NgModule} from '@angular/core';
import {createCustomElement} from '@angular/elements';
import {BrowserModule} from '@angular/platform-browser';
import {WarpViewEditorAngularModule} from './warp-view-editor-angular.module';
import {WarpViewEditorComponent} from './elements/warp-view-editor/warp-view-editor.component';
import {WarpViewImageResult} from './elements/warp-view-image-result/warp-view-image-result';
import {WarpViewRawResultComponent} from './elements/warp-view-raw-result/warp-view-raw-result.component';
import {WarpViewResult} from './elements/warp-view-result/warp-view-result';

@NgModule({
    declarations: [],
    imports: [
        WarpViewEditorAngularModule,
        BrowserModule,
    ],
    exports: [
        WarpViewEditorComponent,
        WarpViewImageResult,
        WarpViewResult,
        WarpViewRawResultComponent
    ],
    providers: []
})
export class WarpViewEditorElementsModule {
  constructor(private injector: Injector) {
    [
      {name: 'warp-view-editor', component: WarpViewEditorComponent},
      {name: 'warp-view-image-result', component: WarpViewImageResult},
      {name: 'warp-view-raw-result', component: WarpViewRawResultComponent},
      {name: 'warp-view-result', component: WarpViewResult},
    ].forEach(wc => {
      if (!customElements.get(wc.name)) {
        customElements.define(wc.name, createCustomElement(wc.component, {injector: this.injector}));
      }
    });
  }

  ngDoBootstrap() {
  }
}
