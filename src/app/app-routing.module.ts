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

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DemoComponent} from './pages/demo/demo.component';
import {MainComponent} from './pages/main/main.component';
import {DemoImageComponent} from './pages/demo-image/demo-image.component';
import {DocComponent} from './pages/doc/doc.component';
import {Sample3Component} from './pages/sample3/sample3.component';
import {Sample4Component} from './pages/sample4/sample4.component';
import { Sample5Component } from "./pages/sample5/sample5.component";
import { Sample6Component } from "./pages/sample6/sample6.component";

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'demo1', component: DemoComponent},
  {path: 'demo2', component: DemoImageComponent},
  {path: 'demo3', component: DocComponent},
  {path: 'demo4', component: Sample3Component},
  {path: 'demo5', component: Sample4Component},
  {path: 'demo6', component: Sample5Component},
  {path: 'demo7', component: Sample6Component},
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {
      scrollPositionRestoration: 'enabled',
      onSameUrlNavigation: 'reload',
      anchorScrolling: 'enabled',
      useHash: true,

    }
  ),],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
