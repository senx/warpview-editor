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

import {Component, Element, Prop, State, Watch} from '@stencil/core';
import {GTSLib} from '../../gts.lib';

@Component({
  tag: 'warp-view-result',
  styleUrls: [
    '../../../node_modules/monaco-editor/min/vs/editor/editor.main.css',
    'warp-view-result.scss'
  ],
  shadow: false
})
export class WarpViewResult {
  @Element() el: HTMLStencilElement;

  @Prop() result: any[] = [];
  @Prop() theme: string = 'light';
  @Prop() config: object = {};
  @State() loading = false;

  @Watch('theme')
  themeHandler(newValue: string, _oldValue: string) {
    console.log(
      '[WarpViewResult] - The new value of theme is: ',
      newValue,
      _oldValue
    );
  }

  componentDidLoad() {
    console.debug('[WarpViewResult] - componentDidLoad', this.result);
  }

  render() {


    // noinspection JSXNamespaceValidation,ThisExpressionReferencesGlobalObjectJS
    return (
      <div class={'wrapper-result ' + this.theme}>
          {this.result && GTSLib.isArray(this.result) ?
            <div class={this.theme + ' raw'}>
              {this.result.map((line, index) => (
                <span class="line">
              <pre class="line-num">{index === 0 ? '[TOP]' : index + 1}</pre>
              <pre class="line-content">{JSON.stringify(line)}</pre>
            </span>
              ))}
            </div>
            : <div class='loader'>
              <div class='spinner'/>
            </div>
          }
      </div>
    );
  }
}
