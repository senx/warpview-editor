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

import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { DemoComponent } from './demo/demo.component';
import { MainComponent } from './main/main.component';
import { DemoImageComponent } from './demo-image/demo-image.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { DocComponent } from './doc/doc.component';
import { Sample3Component } from './sample3/sample3.component';
import { Sample4Component } from './sample4/sample4.component';
import { Sample5Component } from './sample5/sample5.component';
import { Sample6Component } from './sample6/sample6.component';
import {Sample7Component} from './sample7/sample7.component';
import {WarpViewEditorAngularModule} from '../../../projects/warpview-editor-ng/src/lib/warp-view-editor-angular.module';
import {DemoFlowsComponent} from './demo-flows/demo-flows.component';
import {Sample8Component} from './sample8/sample8.component';

@NgModule({
    declarations: [
        DemoComponent,
        DemoImageComponent,
        MainComponent,
        DocComponent,
        Sample3Component,
        Sample4Component,
        Sample5Component,
        Sample6Component,
        Sample7Component,
        Sample8Component,
        DemoFlowsComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        WarpViewEditorAngularModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule {
}

