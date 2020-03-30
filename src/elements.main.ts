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

import {WarpViewEditorModule} from './app/elements/warp-view-editor.module';
import {environment} from './environments/environment';
import * as wcSplit from '@giwisoft/wc-split/loader';
import * as wcTabs from '@giwisoft/wc-tabs/loader';

if (environment.production) {
  enableProdMode();
}
[wcSplit, wcTabs].forEach(wc => wc.defineCustomElements(window).then(() => {
  // empty
}).catch(err => console.log('elements.main.ts', err)));
platformBrowserDynamic().bootstrapModule(WarpViewEditorModule).then(ref => {
  // Ensure Angular destroys itself on hot reloads.
  if (window['ngRef']) {
    window['ngRef'].destroy();
  }
  window['ngRef'] = ref;

  // Otherise, log the boot error
}).catch(err => console.error(err));
