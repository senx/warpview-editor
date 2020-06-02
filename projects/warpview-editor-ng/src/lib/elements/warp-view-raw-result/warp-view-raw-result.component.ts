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

import {Utils} from '../../model/utils';
import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {editor} from 'monaco-editor';
import {Logger} from '../../model/logger';
import {Config} from '../../model/config';
import {EditorConfig} from '../../model/editorConfig';
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import setTheme = editor.setTheme;
import create = editor.create;
import IEditorOptions = editor.IEditorOptions;

@Component({
  selector: 'warpview-raw-result',
  templateUrl: './warp-view-raw-result.component.html',
  styleUrls: ['./warp-view-raw-result.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class WarpViewRawResultComponent implements OnInit, AfterViewInit {
  @ViewChild('editor', {static: true}) editor: ElementRef;

  @Input() set debug(debug: boolean | string) {
    if (typeof debug === 'string') {
      debug = 'true' === debug;
    }
    this._debug = debug;
    this.LOG.setDebug(debug);
  }

  get debug() {
    return this._debug;
  }

  @Input() set theme(newValue: string) {
    this.LOG.debug(['WarpViewRawResult'], 'The new value of theme is: ', newValue);
    if ('dark' === newValue) {
      this.monacoTheme = 'vs-dark';
    } else {
      this.monacoTheme = 'vs';
    }
    this.LOG.debug(['WarpViewRawResult'], 'The new value of theme is: ', this.monacoTheme);
    this._theme = newValue;
    setTheme(this.monacoTheme);
  }

  get theme(): string {
    return this._theme;
  }

  @Input() set result(newValue: string) {
    this.loading = true;
    this._result = newValue;
    this.LOG.debug(['WarpViewRawResult'], 'The new value of result is: ', newValue);
    this.buildEditor(this._result || '');
    this.loading = false;
  }

  get result(): string {
    return this._result;
  }

  @Input('config') set config(config: Config | string) {
    let conf = (typeof config === 'string') ? JSON.parse(config || '{}') : config || {};
    this._config = Utils.mergeDeep(this._config, conf);
    this.LOG.debug(['config'], this._config, conf);
    if (this.resEd) {
      this.LOG.debug(['config'], this._config);
      this.resEd.updateOptions(this.setOptions());
    }
  }

  get config(): Config | string {
    return this._config;
  }

  @Input() heightLine: number;
  @Input() heightPx: number;

  loading = false;
  // tslint:disable-next-line:variable-name
  _theme = 'light';
  // tslint:disable-next-line:variable-name
  _result: string;
  // tslint:disable-next-line:variable-name
  _config: Config = {
    editor: new EditorConfig(),
    messageClass: '',
    errorClass: ''
  };
  // tslint:disable-next-line:variable-name
  _debug = false;

  private LOG: Logger;

  private LINE_HEIGHT = 18;
  private CONTAINER_GUTTER = 10;
  private resEd: IStandaloneCodeEditor;
  private monacoTheme = 'vs';

  constructor() {
    this.LOG = new Logger(WarpViewRawResultComponent, this._debug);
  }

  ngOnInit() {
    this._config = Utils.mergeDeep(this._config, this.config);
    if ('dark' === this.theme) {
      this.monacoTheme = 'vs-dark';
    }
    this.LOG.debug(['ngOnInit'], this.result);
  }

  buildEditor(json: string) {
    this.LOG.debug(['buildEditor'], 'buildEditor', json, this._config);
    if (!this.resEd && json) {
      this.resEd = create(this.editor.nativeElement, this.setOptions());
    }
    if(!!this.resEd) {
      this.resEd.setValue(json || '');
    }
    this.loading = false;
  }

  adjustHeight() {
    if (this.editor) {
      const el = this.editor.nativeElement;
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
          this.resEd.layout();
        }, 0);
      }
    }
  }

  ngAfterViewInit() {
    this.LOG.debug(['ngAfterViewInit'], this._result);
    this.loading = true;
    this.buildEditor(JSON.stringify(this._result));
    this.loading = false;
  }

  private setOptions(): IEditorOptions {
    return {
      value: '',
      language: 'json',
      minimap: {enabled: true},
      automaticLayout: true,
      scrollBeyondLastLine: false,
      theme: this.monacoTheme,
      readOnly: !!this._config.editor.rawResultsReadOnly,
      fixedOverflowWidgets: true,
      lineNumbers: 'on',
      wordWrap: 'on'
    } as IEditorOptions;
  }
}
