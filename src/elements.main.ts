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

import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {environment} from './environments/environment';
import {WarpViewEditorElementsModule} from '../projects/warpview-editor-ng/src/lib/warp-view-editor-elements.module';
import * as wcSplit from '@giwisoft/wc-split/loader';
import * as wcTabs from '@giwisoft/wc-tabs/loader';
import 'zone.js/dist/zone';
import {WarpViewEditorComponent} from '../projects/warpview-editor-ng/src/lib/elements/warp-view-editor/warp-view-editor.component';
import {WarpViewImageResult} from '../projects/warpview-editor-ng/src/lib/elements/warp-view-image-result/warp-view-image-result';
import {WarpViewRawResultComponent} from '../projects/warpview-editor-ng/src/lib/elements/warp-view-raw-result/warp-view-raw-result.component';
import {WarpViewResult} from '../projects/warpview-editor-ng/src/lib/elements/warp-view-result/warp-view-result';
import {createCustomElement} from '@angular/elements';

if (environment.production) {
  enableProdMode();
}
[wcSplit, wcTabs].forEach(wc => wc.defineCustomElements(window).then(() => {
  // empty
}).catch(err => console.log('main.ts', err)));

platformBrowserDynamic().bootstrapModule(WarpViewEditorElementsModule)
  .then(({injector}) => {
    [
      {name: 'warp-view-editor', component: WarpViewEditorComponent},
      {name: 'warp-view-image-result', component: WarpViewImageResult},
      {name: 'warp-view-raw-result', component: WarpViewRawResultComponent},
      {name: 'warp-view-result', component: WarpViewResult},
    ].forEach(wc => {
      if (!customElements.get(wc.name)) {
        customElements.define(wc.name, createCustomElement(wc.component, {injector}));
      }
    });
  });
