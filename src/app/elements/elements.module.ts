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

import {CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {createCustomElement} from '@angular/elements';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {WarpViewEditorComponent} from './warp-view-editor/warp-view-editor.component';
import {WarpViewImageResult} from './warp-view-image-result/warp-view-image-result';
import {WarpViewRawResultComponent} from './warp-view-raw-result/warp-view-raw-result.component';
import {WarpViewResult} from './warp-view-result/warp-view-result';

@NgModule({
  declarations: [
    WarpViewEditorComponent,
    WarpViewImageResult,
    WarpViewResult,
    WarpViewRawResultComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [
    WarpViewEditorComponent,
    WarpViewImageResult,
    WarpViewResult,
    WarpViewRawResultComponent
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: []
})
export class ElementsModule {
  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    [
      {name: 'warp-view-editor', component: WarpViewEditorComponent},
      {name: 'warp-view-image-result', component: WarpViewImageResult},
      {name: 'warp-view-result', component: WarpViewResult},
      {name: 'warp-view-raw-result', component: WarpViewRawResultComponent},
    ].forEach(wc => {
      if (!customElements.get(wc.name)) {
        customElements.define(wc.name, createCustomElement(wc.component, {injector: this.injector}));
      }
    });
  }
}
