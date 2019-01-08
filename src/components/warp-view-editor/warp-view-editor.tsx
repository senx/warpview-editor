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

import {Component, Element, Event, EventEmitter, Method, Prop, State, Watch} from "@stencil/core/dist";
import monaco, {MarkedString} from '@timkendrick/monaco-editor/dist/standalone';
import {Monarch} from '../../monarch'
import {WarpScript} from '../../ref';
import {globalfunctions as wsGlobals} from '../../wsGlobals';
import {Utils} from "../../lib/utils";
import {Config} from "../../lib/config";
import Hover = monaco.languages.Hover;
import IReadOnlyModel = monaco.editor.IReadOnlyModel;
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;
import IEditorConstructionOptions = monaco.editor.IEditorConstructionOptions;
import '@giwisoft/wc-tabs';

@Component({
  tag: 'warp-view-editor',
  styleUrls: [
    '../../../node_modules/monaco-editor/min/vs/editor/editor.main.css',
    'warp-view-editor.scss'
  ],
  shadow: false
})
export class WarpViewEditor {

  @Element() el: HTMLStencilElement;

  @Prop() url: string = '';
  @Prop() theme: string = 'light';
  @Prop() warpscript: string;
  @Prop() showDataviz = false;
  @Prop() showExecute = true;
  @Prop() horizontalLayout = false;
  @Prop() config: Config | string;
  @Prop() displayMessages = true;
  @Prop() widthPx: number;
  @Prop() heightLine: number;
  @Prop() heightPx: number;
  @Prop() tabbed: boolean = false;

  @Event() warpViewEditorStatusEvent: EventEmitter;
  @Event() warpViewEditorErrorEvent: EventEmitter;
  @Event() warpViewEditorWarpscriptChanged: EventEmitter;
  @Event() warpViewEditorWarpscriptResult: EventEmitter;
  @Event() warpViewEditorDatavizRequested: EventEmitter;
  @Event() warpViewEditorLoaded: EventEmitter;

  @State() result: any[];
  @State() status: string;
  @State() error: string;
  @State() loading = false;


  private WARPSCRIPT_LANGUAGE = 'warpscript';
  private ed: IStandaloneCodeEditor;
  private editor: HTMLDivElement;
  private layout: HTMLDivElement;
  private monacoTheme = 'vs';
  private _innerCode: string;
  private _config: Config = {
    buttons: {
      class: ''
    },
    execButton: {
      class: '',
      label: 'Execute'
    },
    datavizButton: {
      class: '',
      label: 'Visualize'
    },
    hover: true,
    readOnly: false,
    messageClass: '',
    errorClass: '',
    editor: {
      quickSuggestionsDelay: 10,
      quickSuggestions: true,
      tabSize: 2
    }
  };

  /**
   *
   * @param {string} newValue
   * @param {string} _oldValue
   */
  @Watch('theme')
  themeHandler(newValue: string, _oldValue: string) {
    console.log('[WarpViewEditor] - The new value of theme is: ', newValue, _oldValue);
    if ('dark' === newValue) {
      this.monacoTheme = 'vs-dark';
    } else {
      this.monacoTheme = 'vs';
    }
    console.log('[WarpViewEditor] - The new value of theme is: ', this.monacoTheme);
    monaco.editor.setTheme(this.monacoTheme);
  }

  @Watch('warpscript')
  warpscriptHandler(newValue: string, _oldValue: string) {
    console.log('[WarpViewEditor] - The new value of warpscript is: ', newValue, _oldValue);
    this.result = undefined;
    this.ed.setValue(newValue);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   */
  componentWillLoad() {
    if (typeof this.config === 'string') {
      this._config = Utils.mergeDeep(this._config, JSON.parse(this.config));
    } else {
      this._config = Utils.mergeDeep(this._config, this.config);
    }
    console.log('[WarpViewEditor] - _config: ', this._config, this.config);
    this._innerCode = this.el.textContent;
    if ('dark' === this.theme) {
      this.monacoTheme = 'vs-dark';
    }
    console.log('[WarpViewEditor] - componentWillLoad theme is: ', this.theme);
    if (!monaco.languages.getLanguages().find(l => l.id === this.WARPSCRIPT_LANGUAGE)) {
      monaco.languages.register({id: this.WARPSCRIPT_LANGUAGE});
      console.log('[WarpViewEditor] - componentWillLoad register: ', this.WARPSCRIPT_LANGUAGE);
      monaco.languages.setMonarchTokensProvider(this.WARPSCRIPT_LANGUAGE, Monarch.rules);
      monaco.languages.setLanguageConfiguration(this.WARPSCRIPT_LANGUAGE, {
          wordPattern: /[^\s\t]+/,
          comments: {
            lineComment: "//",
            blockComment: ["/**", "*/"]
          },
          brackets: [
            ["{", "}"],
            ["[", "]"],
            ["(", ")"],
            ["<%", "%>"],
            ["<'", "'>"],
            ["[[", "]]"]
          ],
          autoClosingPairs: [
            {open: "{", close: "}"},
            {open: "[", close: "]"},
            {open: "(", close: ")"},
            {open: "<%", close: "%>"},
            {open: "[[", close: "]]"},
            {open: " '", close: "'", notIn: ["string", "comment"]},
            {open: "<'", close: "'>"},
            {open: "\"", close: "\"", notIn: ["string"]},
            {open: "`", close: "`", notIn: ["string", "comment"]},
            {open: "/**", close: " */", notIn: ["string"]}
          ],
          surroundingPairs: [
            {open: "{", close: "}"},
            {open: "[", close: "]"},
            {open: "(", close: ")"},
            {open: "[[", close: "]]"},
            {open: "<%", close: "%>"},
            {open: "<'", close: "'>"},
            {open: "'", close: "'"},
            {open: "\"", close: "\""},
            {open: "`", close: "`"}
          ],
          onEnterRules: [
            {
              // e.g. /** | */
              beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
              afterText: /^\s*\*\/$/,
              action: {indentAction: monaco.languages.IndentAction.IndentOutdent, appendText: ' * '}
            },
            {
              // e.g. /** ...|
              beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
              action: {indentAction: monaco.languages.IndentAction.None, appendText: ' * '}
            },
            {
              // e.g.  * ...|
              beforeText: /^(\t|( {2}))* \*( ([^*]|\*(?!\/))*)?$/,
              action: {indentAction: monaco.languages.IndentAction.None, appendText: '* '}
            },
            {
              // e.g.  */|
              beforeText: /^(\t|( {2}))* \*\/\s*$/,
              action: {indentAction: monaco.languages.IndentAction.None, removeText: 1}
            }
          ],
        }
      );
      monaco.languages.registerHoverProvider(this.WARPSCRIPT_LANGUAGE, {
        provideHover: (model: IReadOnlyModel, position: monaco.Position) => {
          let word = model.getWordAtPosition(position);
          let range = new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn);
          console.log('[wsHoverProvider] - provideHover', model, position, word);
          let name = word.word;
          let entry = wsGlobals[name];
          if (entry && entry.description) {
            let signature = entry.signature || '';
            let contents: MarkedString[] = ['### ' + name, {
              language: this.WARPSCRIPT_LANGUAGE,
              value: signature
            }, entry.description];
            return {
              range: range,
              contents: contents
            } as Hover
          }

          return undefined;
        }
      });

      monaco.languages.registerCompletionItemProvider(this.WARPSCRIPT_LANGUAGE, {
        provideCompletionItems: () => {
          let defs = [];
          WarpScript.reference.forEach(f => {
            defs.push({label: f.name, kind: WarpViewEditor.getType(f.tags, f.name)});
          });
          return defs;
        }
      });
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   */
  componentDidUnload() {
    console.log('[WarpViewEditor] - Component removed from the DOM');
    if (this.ed) {
      this.ed.dispose();
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   */
  componentDidLoad() {
    try {
      console.log('[WarpViewEditor] - componentDidLoad - warpscript', this.warpscript);
      console.log('[WarpViewEditor] - componentDidLoad - inner: ', this._innerCode);
      console.log('[WarpViewEditor] - componentDidLoad - div: ', this.editor);
      const edOpts: IEditorConstructionOptions = {
        quickSuggestionsDelay: this._config.editor.quickSuggestionsDelay,
        quickSuggestions: this._config.editor.quickSuggestions,
        value: this.warpscript || this._innerCode,
        language: this.WARPSCRIPT_LANGUAGE,
        automaticLayout: true,
        theme: this.monacoTheme,
        hover: this._config.hover,
        readOnly: this._config.readOnly,
        folding: true
      };
      edOpts.value = edOpts.value.trim();
      console.log('[WarpViewEditor] - componentDidLoad - edOpts: ', edOpts);
      this.ed = monaco.editor.create(this.editor, edOpts);
      this.ed.getModel().updateOptions({tabSize: this._config.editor.tabSize});
      if (this.ed) {
        this.ed.getModel().onDidChangeContent((event) => {
          console.debug('[WarpViewEditor] - componentDidLoad - ws changed', event);
          this.warpViewEditorWarpscriptChanged.emit(this.ed.getValue());
        });
      }
      window.setTimeout(() => {
        if (this.layout) {
          this.layout.style.width = (!!this.widthPx ? this.widthPx.toString() : this.el.parentElement.clientWidth) + 'px';
          this.layout.style.height = (!!this.heightPx ? this.heightPx.toString() : this.el.parentElement.clientHeight) + 'px';
          this.layout.style.height = Math.max(this.layout.clientHeight, ((this.heightLine || this.ed.getModel().getLineCount() + 3) * 19)) + 'px';
          this.editor.style.height = !!this.heightLine
            ? (19 * this.heightLine).toString() + 'px'
            : !!this.heightPx
              ? this.heightPx + 'px'
              : Math.max(this.editor.parentElement.clientHeight, ((this.heightLine || this.ed.getModel().getLineCount()) * 19)) + 'px';
          console.log(this.editor.parentElement.clientHeight)
        }
        this.ed.layout();
        this.warpViewEditorLoaded.emit();
      }, 500);
    } catch (e) {
      console.error('[WarpViewEditor] - componentDidLoad', e);
    }
  }

  /**
   *
   * @param {string[]} tags
   * @param {string} name
   * @returns {monaco.languages.CompletionItemKind}
   */
  private static getType(tags: string[], name: string): monaco.languages.CompletionItemKind {
    let t = tags.join(' ');
    if (t.indexOf('constant') > -1) {
      return monaco.languages.CompletionItemKind.Enum;
    } else if (t.indexOf('reducer') > -1 && name !== 'REDUCE') {
      return monaco.languages.CompletionItemKind.Interface;
    } else if (t.indexOf('mapper') > -1 && name !== 'MAP') {
      return monaco.languages.CompletionItemKind.Interface;
    } else if (t.indexOf('bucketize') > -1 && name !== 'BUCKETIZE') {
      return monaco.languages.CompletionItemKind.Interface;
    } else if (t.indexOf('filter') > -1 && name !== 'FILTER') {
      return monaco.languages.CompletionItemKind.Interface;
    } else if (t.indexOf('control') > -1) {
      return monaco.languages.CompletionItemKind.Keyword;
    } else if (t.indexOf('operators') > -1) {
      return monaco.languages.CompletionItemKind.Method;
    } else if (t.indexOf('stack') > -1) {
      return monaco.languages.CompletionItemKind.Module;
    } else {
      return monaco.languages.CompletionItemKind.Function;
    }
  }

  /**
   *
   */
  @Method()
  execute() {
    this.result = undefined;
    this.status = undefined;
    this.error = undefined;
    if (this.ed) {
      console.debug('[WarpViewEditor] - execute - this.ed.getValue()', this.ed.getValue());
      this.loading = true;
      fetch(this.url, {method: 'POST', body: this.ed.getValue()}).then(response => {
        if (response.ok) {
          console.debug('[WarpViewEditor] - execute - response', response);
          response.text().then(res => {
            this.warpViewEditorWarpscriptResult.emit(res);
            this.status = `Your script execution took ${WarpViewEditor.formatElapsedTime(parseInt(response.headers.get('x-warp10-elapsed')))} serverside,
          fetched ${response.headers.get('x-warp10-fetched')} datapoints and performed ${response.headers.get('x-warp10-ops')}  WarpScript operations.`;
            this.warpViewEditorStatusEvent.emit(this.status);
            this.loading = false;
            this.result = JSON.parse(res);
          }, err => {
            console.error(err);
            this.error = err;
            this.warpViewEditorErrorEvent.emit(this.error);
            this.loading = false;
          });
        } else {
          console.error(response.statusText);
          this.error = response.statusText;
          this.warpViewEditorErrorEvent.emit(this.error);
          this.loading = false;
        }
      }, err => {
        console.error(err);
        this.error = err;
        this.warpViewEditorErrorEvent.emit(this.error);
        this.loading = false;
      });
    } else {
      console.error('[WarpViewEditor] - no active editor');
      this.loading = false;
    }
  }

  /**
   *
   * @param {UIEvent} _event
   */
  requestDataviz(_event: UIEvent) {
    this.warpViewEditorDatavizRequested.emit(this.result);
  }

  /**
   *
   * @param {number} elapsed
   * @returns {string}
   */
  private static formatElapsedTime(elapsed: number) {
    if (elapsed < 1000) {
      return elapsed.toFixed(3) + ' ns';
    }
    if (elapsed < 1000000) {
      return (elapsed / 1000).toFixed(3) + ' μs';
    }
    if (elapsed < 1000000000) {
      return (elapsed / 1000000).toFixed(3) + ' ms';
    }
    if (elapsed < 1000000000000) {
      return (elapsed / 1000000000).toFixed(3) + ' s ';
    }
    // Max exec time for nice output: 999.999 minutes (should be OK, timeout should happen before that).
    return (elapsed / 60000000000).toFixed(3) + ' m ';
  }

  render() {
    // @ts-ignore
    // noinspection JSXNamespaceValidation
    const loading = !!this.loading ?
      <div class="loader">
        <div class="spinner"/>
      </div>
      : '';
    const datavizBtn = this.showDataviz && this.result ?
      <button type="button" class={this._config.datavizButton.class}
              onClick={(event: UIEvent) => this.requestDataviz(event)} innerHTML={this._config.datavizButton.label}>
      </button>
      : '';
    const execBtn = this.showExecute ?
      <button type="button" class={this._config.execButton.class}
              onClick={() => this.execute()} innerHTML={this._config.execButton.label}>
      </button>
      : '';

    const message =
      this.status && this.displayMessages ?
        <div class={this._config.messageClass}>{this.status}</div>
        : '';

    // noinspection JSXNamespaceValidation
    const error = this.error && this.displayMessages ?
      <div class={this._config.errorClass}>{this.error}</div> : '';

    const nonTabbedClasses = {
      'layout': true,
      'horizontal-layout': !!this.horizontalLayout,
      'vertical-layout': !this.horizontalLayout
    };

    return <div>
      <div class="warpscript">
        <slot/>
      </div>
      {this.tabbed
        ? <div ref={(el) => this.layout = el as HTMLDivElement}>
          <div class={'wrapper-tabbed ' + this.theme}>
            <wc-tabs>
              <wc-tabs-header slot="header" name="tab1">Editor</wc-tabs-header>
              <wc-tabs-header slot="header" name="tab2" disabled={!this.result}>Stack</wc-tabs-header>
              <wc-tabs-header slot="header" name="tab3" disabled={!this.result}>Raw JSON</wc-tabs-header>

              <wc-tabs-content slot="content" name="tab1">
                <div class="editor-wrapper">
                  <div ref={(el) => this.editor = el as HTMLDivElement}/>
                </div>
                <div class={'editor-buttons ' + this._config.buttons.class}>{datavizBtn} {execBtn}</div>
                {this.result ? <div class="messages">{message} {error}</div> : {loading}}
              </wc-tabs-content>
              <wc-tabs-content slot="content" name="tab2">
                <warp-view-result theme={this.theme} result={this.result} config={this._config}/>
              </wc-tabs-content>
              <wc-tabs-content slot="content" name="tab3">
                <div class="result-wrapper">
                  <warp-view-raw-result theme={this.theme} result={this.result} config={this._config}/>
                </div>
              </wc-tabs-content>
            </wc-tabs>
          </div>
        </div>
        : <div ref={(el) => this.layout = el as HTMLDivElement} class={nonTabbedClasses}>
          <div class="panel1">
            <div ref={(el) => this.editor = el as HTMLDivElement}/>
            {loading}
            <div class={this._config.buttons.class}>
              {datavizBtn}
              {execBtn}
            </div>
          </div>
          <div class="panel2">
            {this.result
              ? <div>
                {message} {error}
                <div class={'wrapper ' + this.theme}>
                  <wc-tabs>
                    <wc-tabs-header slot="header" name="tab1">Stack</wc-tabs-header>
                    <wc-tabs-header slot="header" name="tab2">Raw JSON</wc-tabs-header>

                    <wc-tabs-content slot="content" name="tab1">{loading}
                      <warp-view-result theme={this.theme} result={this.result} config={this._config}/>
                    </wc-tabs-content>

                    <wc-tabs-content slot="content" name="tab2">
                      <warp-view-raw-result theme={this.theme} result={this.result} config={this._config}/>
                    </wc-tabs-content>
                  </wc-tabs>
                </div>
              </div>
              : ''
            }
          </div>
        </div>
      }
    </div>;
  }
}
