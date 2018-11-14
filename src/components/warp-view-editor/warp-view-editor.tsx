import {Component, Element, Prop, Event, Watch, State, EventEmitter} from "@stencil/core";
import monaco, {MarkedString} from '@timkendrick/monaco-editor';
import {Monarch} from '../../monarch'
import {WarpScript} from '../../ref';
import {globalfunctions as wsGlobals} from '../../wsGlobals';
import Hover = monaco.languages.Hover;
import IReadOnlyModel = monaco.editor.IReadOnlyModel;
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;
import {GTSLib} from "../../gts.lib";
import merge from 'deepmerge'
import IEditorConstructionOptions = monaco.editor.IEditorConstructionOptions;

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
  @Prop() horizontalLayout = false;
  @Prop() config: any = {};
  @Prop() displayMessages = true;
  @Prop() widthPx: number;
  @Prop() heightLine: number;
  @Prop() heightPx: number;

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
  private edUid: string;
  private monacoTheme = 'vs';
  private _innerCode: string;
  private _config = {
    execButton: {
      class: '',
      label: 'Execute'
    },
    datavizButton: {
      class: '',
      label: 'Visualize'
    },
    editor: {
      quickSuggestionsDelay: 10,
      quickSuggestions: true
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

  /**
   *
   */
  componentWillLoad() {
    this._config = merge(this._config, this.config);
    console.log('[WarpViewEditor] - _config: ', this._config, this.config);
    this._innerCode = this.el.textContent;
    this.edUid = GTSLib.guid();
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

  /**
   *
   */
  componentDidUnload() {
    console.log('[WarpViewEditor] - Component removed from the DOM');
    if (this.ed) {
      this.ed.dispose();
    }
  }

  /**
   *
   */
  componentDidLoad() {
    try {
      console.log('[WarpViewEditor] - componentDidLoad - warpscript', this.warpscript);
      console.log('[WarpViewEditor] - componentDidLoad - inner: ', this._innerCode);
      console.log('[WarpViewEditor] - componentDidLoad - div: ', this.el.querySelector('#editor-' + this.edUid));
      const edOpts: IEditorConstructionOptions = {
        quickSuggestionsDelay: this._config.editor.quickSuggestionsDelay,
        quickSuggestions: this._config.editor.quickSuggestions,
        value: this.warpscript || this._innerCode,
        language: this.WARPSCRIPT_LANGUAGE, automaticLayout: true,
        theme: this.monacoTheme, hover: true, folding: true
      };
      edOpts.value = edOpts.value.trim();
      this.ed = monaco.editor.create(this.el.querySelector('#editor-' + this.edUid), edOpts);
      if (this.ed) {
        this.ed.getModel().onDidChangeContent((event) => {
          console.debug('[WarpViewEditor] - componentDidLoad - ws changed', event);
          this.warpViewEditorWarpscriptChanged.emit(this.ed.getValue());
        });
      }

      let layout = this.el.querySelector('#layout-' + this.edUid)  as HTMLStencilElement;
      let editor = this.el.querySelector('#editor-' + this.edUid) as HTMLStencilElement;
      layout.style.width = !!this.widthPx ? this.widthPx.toString() + "px" : "100%";
      layout.style.height = !!this.heightPx ? this.heightPx.toString() + "px" : "100%";
      layout.style.height = Math.max(layout.clientHeight, ((this.heightLine || this.ed.getModel().getLineCount()) * 19)).toString() + "px";
      editor.style.height = !!this.heightLine ? (19 * this.heightLine).toString() + "px" : !!this.heightPx ? this.heightPx.toString() + "px" : "100%";
      this.ed.layout();
      this.warpViewEditorLoaded.emit();
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
   * @param {UIEvent} _event
   * @param {string} theme
   */
  setTheme(_event: UIEvent, theme: string) {
    this.theme = theme;
  }

  /**
   *
   * @param {UIEvent} _event
   */
  execute(_event: UIEvent) {
    this.result = undefined;
    this.status = undefined;
    this.error = undefined;
    if (this.ed) {
      console.debug('[WarpViewEditor] - execute - this.ed.getValue()', this.ed.getValue(), _event);
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
    const loading = !!this.loading ? (
      <div class="loader">
        <div class="spinner"/>
      </div>
    ) : ('');
    const result = this.result || this.error ? (
      <warp-view-result
        displayMessages={this.displayMessages}
        theme={this.theme}
        result={{json: this.result, error: this.error, message: this.status}}
        config={this._config}
      />
    ) : ('');
    const datavizBtn = this.showDataviz && this.result ? (
      <button type="button" class={this._config.datavizButton.class}
              onClick={(event: UIEvent) => this.requestDataviz(event)} innerHTML={this._config.datavizButton.label}>
      </button>
    ) : ('');


    return (
      <div>
        <div class="warpscript">
          <slot/>
        </div>
        <style>
        </style>
        <div class="clearfix"/>
        <div id={'layout-' + this.edUid}
             class={'layout ' + (this.horizontalLayout ? 'horizontal-layout' : 'vertical-layout')}>
          <div class="panel1">
            <div id={'editor-' + this.edUid}/>
            <div class="clearfix"/>
            {loading}
            {datavizBtn}
            <button type="button" class={this._config.execButton.class}
                    onClick={(event: UIEvent) => this.execute(event)} innerHTML={this._config.execButton.label}>
            </button>
          </div>
          <div class="panel2">
            {result}
          </div>
        </div>
      </div>
    );
  }
}
