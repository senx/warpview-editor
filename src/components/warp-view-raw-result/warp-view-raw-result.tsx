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
import monaco from '@timkendrick/monaco-editor';
import {Utils} from '../../lib/utils';
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
  @Prop() heightLine: number;
  @Prop() heightPx: number;

  @State() loading = false;

  private LINE_HEIGHT = 18;
  private CONTAINER_GUTTER = 10;
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
    if ('dark' === newValue) {
      this.monacoTheme = 'vs-dark';
    } else {
      this.monacoTheme = 'vs';
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
    if ('dark' === this.theme) {
      this.monacoTheme = 'vs-dark';
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
    if (!this.resEd) {
      this.resEd = monaco.editor.create(
        this.editor, {
          value: '',
          language: 'json',
          minimap: { enabled : true },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          theme: this.monacoTheme,
          readOnly: false,
          fixedOverflowWidgets: true,
          lineNumbers: 'on',
          wordWrap: 'on'
        }
      );
    }

    this.resEd.getModel().onDidChangeContent(() => setTimeout(() => this.adjustHeight(), 0));
    this.resEd.onDidChangeModelDecorations(() => setTimeout(() => this.adjustHeight(), 0));
    this.resEd.setValue(json);
    this.adjustHeight();
    if (window) {
      window.addEventListener("resize",() => setTimeout(() => this.adjustHeight(), 0));
    }
    this.loading = false;
  }

  adjustHeight() {
    const el = this.editor;
    const codeContainer = el.getElementsByClassName('view-lines')[0] as HTMLElement;
    const containerHeight = codeContainer.offsetHeight;
    let prevLineCount = 0;
    if (!containerHeight) {
      // dom hasn't finished settling down. wait a bit more.
      setTimeout(() => this.adjustHeight(), 0);
    } else {
      setTimeout(() => {
        const height =
          codeContainer.childElementCount > prevLineCount
            ? codeContainer.offsetHeight // unfold
            : codeContainer.childElementCount * this.LINE_HEIGHT + this.CONTAINER_GUTTER; // fold
        prevLineCount = codeContainer.childElementCount;
        el.style.height = height + 'px';
        console.log(height);
        this.resEd.layout();
      }, 0);
    }
  }

  componentDidLoad() {
    console.debug('[WarpViewRawResult] - componentDidLoad', this.result);
    this.buildEditor(JSON.stringify(this.result));
  }

  render() {
    // noinspection JSXNamespaceValidation
    return (
      <div class={'wrapper ' + this.theme}>
        {this.loading ?
          <div class="loader">
            <div class="spinner"/>
          </div>
          : ''}
        <div ref={(el) => this.editor = el as HTMLDivElement}/>
      </div>
    );
  }
}
