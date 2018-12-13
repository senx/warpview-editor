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

import { Component, Element, Prop, State, Watch } from "@stencil/core";
import monaco from "@timkendrick/monaco-editor";
import { Utils } from "../../lib/utils";
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;

@Component({
  tag: 'warp-view-raw-result',
  styleUrls: [
    '../../../node_modules/monaco-editor/min/vs/editor/editor.main.css',
    'warp-view-raw-result.scss'
  ],
  shadow: false
})
export class WarpViewRawResult {
  @Element() el: HTMLStencilElement;

  @Prop() result: any[] = [];
  @Prop() theme: string = 'light';
  @Prop() config: object = {};
  @State() loading = false;
  @Prop() heightLine: number;
  @Prop() heightPx: number;

  private _config = {
    messageClass: '',
    errorClass: ''
  };
  private resEd: IStandaloneCodeEditor;
  private monacoTheme = 'vs';
  private editor: HTMLDivElement;

  @Watch('theme')
  themeHandler(newValue: string, _oldValue: string) {
    console.debug('[WarpViewRawResult] - The new value of theme is: ', newValue, _oldValue);
    if('dark' === newValue) {
      this.monacoTheme = "vs-dark";
    } else {
      this.monacoTheme = "vs";
    }
    console.debug('[WarpViewRawResult] - The new value of theme is: ', this.monacoTheme);
    monaco.editor.setTheme(this.monacoTheme);
  }

  @Watch('result')
  resultHandler(newValue: any, _oldValue: any) {
    console.debug('[WarpViewRawResult] - The new value of result is: ', newValue, _oldValue);
    this.buildEditor(JSON.stringify(this.result));
  }

  /**
   *
   */
  componentWillLoad() {
    this._config = Utils.mergeDeep(this._config, this.config);
    if('dark' === this.theme) {
      this.monacoTheme = "vs-dark";
    }
    console.debug('[WarpViewRawResult] - componentWillLoad', this.result);
  }

  /**
   *
   * @param {string} json
   */
  buildEditor(json: string) {
    this.loading = true;
    console.debug('[WarpViewRawResult] - buildEditor', json);
    if(!this.resEd) {
      this.resEd = monaco.editor.create(
        this.editor, {
          value: json,
          language: 'json',
          automaticLayout: true,
          scrollBeyondLastLine: true,
          theme: this.monacoTheme,
          readOnly: true,
          fixedOverflowWidgets: true
        }
      );
    } else {
      this.resEd.setValue(json);
    }
    this.editor.style.height = this.resEd.getScrollHeight() + 'px';
    this.loading = false;
    this.resEd.layout();
    console.debug('[WarpViewRawResult] - buildEditor end');
  }

  componentDidLoad() {
    console.debug('[WarpViewRawResult] - componentDidLoad', this.result);
    this.buildEditor(JSON.stringify(this.result));
  }

  render() {
    // noinspection JSXNamespaceValidation
    return (
      <div class={'wrapper ' + this.theme}>
        <div class="editor-res">
          {this.loading ?
            <div class="loader">
              <div class="spinner"/>
            </div>
            : ''}
          <div ref={(el) => this.editor = el as HTMLDivElement}/>
        </div>
      </div>
    );
  }
}
