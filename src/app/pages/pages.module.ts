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

import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {DemoComponent} from './demo/demo.component';
import {MainComponent} from './main/main.component';
import {DemoImageComponent} from './demo-image/demo-image.component';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {ElementsModule} from '../elements/elements.module';
import {AppRoutingModule} from '../app-routing.module';
import { DocComponent } from './doc/doc.component';
import { Sample3Component } from './sample3/sample3.component';
import { Sample4Component } from './sample4/sample4.component';
import { Sample5Component } from './sample5/sample5.component';
import { Sample6Component } from './sample6/sample6.component';


@NgModule({
  declarations: [
    DemoComponent,
    DemoImageComponent,
    MainComponent,
    DocComponent,
    Sample3Component,
    Sample4Component,
    Sample5Component,
    Sample6Component
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ElementsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [],
  entryComponents: [
    DemoComponent,
    DemoImageComponent,
    MainComponent,
    DocComponent,
    Sample3Component,
    Sample4Component,
    Sample5Component,
    Sample6Component
  ]
})
export class PagesModule {
}

