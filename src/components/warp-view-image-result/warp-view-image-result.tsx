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

import { Component, Element, Prop, State, Watch } from '@stencil/core';
import { GTSLib } from '../../gts.lib';


@Component({
  tag: 'warp-view-image-result',
  styleUrls: [
    'warp-view-image-result.scss'
  ],
  shadow: false
})
export class WarpViewImageResult {
  @Element() el: HTMLStencilElement;

  @Prop() result: any[] = [];
  @Prop() theme: string = 'light';
  @Prop() config: object = {};
  @State() loading = false;
  @State() imageList: string[] = [];

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

  @Watch('result')
  resultHandler(newValue: any, _oldValue: any) {
    this.loading = true;
    console.debug('[WarpViewRawResult] - The new value of result is: ', newValue, _oldValue);
    if (newValue && GTSLib.isArray(newValue)) {
      this.imageList = newValue.filter((v: any) => {
        return ((typeof (v) === 'string') && (String(v).startsWith("data:image/png;base64,")));
      })
    }
    else {
      this.imageList = [];
    }
    this.loading = false;
  }

  render() {

    // noinspection JSXNamespaceValidation,ThisExpressionReferencesGlobalObjectJS
    return (
      <div class={'wrapper-result ' + this.theme}>
        {this.result && GTSLib.isArray(this.result) ?
          <div class={this.theme + ' image'}>
            {this.imageList.map((img, i) => (
              <div class="image"><h2>Image {i + 1}</h2><img src={img} /></div>
            ))}
          </div>
          : ''
        }
      </div>
    );
  }
}
