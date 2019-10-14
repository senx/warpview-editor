/* tslint:disable:no-string-literal */
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
import { editor, languages, Position, Range } from 'monaco-editor';
import { Monarch } from '../../lib/monarch';
import { WarpScript } from '../../lib/ref';
import { globalfunctions as wsGlobals } from '../../lib/wsGlobals';
import { Utils } from '../../lib/utils';
import ResizeObserver from 'resize-observer-polyfill';
import { Config } from '../../lib/config';
import { Logger } from '../../lib/logger';
import { JsonLib } from '../../lib/jsonLib';
import WarpScriptParser, { docGenerationParams, specialCommentCommands } from '../../lib/warpScriptParser';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import Hover = languages.Hover;
import IReadOnlyModel = editor.IReadOnlyModel;
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import IEditorConstructionOptions = editor.IEditorConstructionOptions;
import CompletionList = languages.CompletionList;
import CompletionItem = languages.CompletionItem;
import IndentAction = languages.IndentAction;
import getLanguages = languages.getLanguages;
import CompletionItemKind = languages.CompletionItemKind;
import register = languages.register;
import registerHoverProvider = languages.registerHoverProvider;
import registerCompletionItemProvider = languages.registerCompletionItemProvider;
import create = editor.create;
import setLanguageConfiguration = languages.setLanguageConfiguration;
import setMonarchTokensProvider = languages.setMonarchTokensProvider;
import { HttpClient, HttpResponse } from "@angular/common/http";
import { catchError, takeUntil, tap } from "rxjs/operators";
import { Observable, of, Subject } from "rxjs";

@Component({
  selector: 'warpview-editor',
  templateUrl: './warp-view-editor.component.html',
  styleUrls: ['./warp-view-editor.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class WarpViewEditorComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() url = '';

  @Input() set debug(debug: boolean | string) {
    if(typeof debug === 'string') {
      debug = 'true' === debug;
    }
    this._debug = debug;
    this.LOG.setDebug(debug);
  }

  get debug() {
    return this._debug;
  }

  @Input()
  set theme(newValue: string) {
    this.LOG.debug(['themeHandler'], 'The new value of theme is: ', newValue);
    if('dark' === newValue) {
      this.monacoTheme = 'vs-dark';
    } else {
      this.monacoTheme = 'vs';
    }
    this.LOG.debug(['themeHandler'], 'The new value of theme is: ', this.monacoTheme);
    this._theme = newValue;
    if(editor) {
      editor.setTheme(this.monacoTheme);
    }
  }

  get theme(): string {
    return this._theme;
  }

  @Input()
  set warpscript(newValue: string) {
    this.LOG.debug(['warpscriptHandler'], 'The new value of warpscript is: ', newValue);
    if(this.ed) {
      this.ed.setValue(newValue);
    }
    this._warpscript = newValue;
    this.loading = false;
  }

  get warpscript(): string {
    return this._warpscript;
  }

  @Input() showDataviz = false;
  @Input() showExecute = true;
  @Input() showResult = true;
  @Input() horizontalLayout = false;
  @Input() config: Config | string;
  @Input() displayMessages = true;
  @Input() widthPx: number;
  @Input() heightLine: number;
  @Input() heightPx: number;
  @Input() tabbed = false;
  @Input() imageTab = false;
  @Input() initialSize: { w?: number, h?: number, name?: string, p?: number };

  @Output() warpViewEditorStatusEvent = new EventEmitter<any>();
  @Output() warpViewEditorErrorEvent = new EventEmitter<any>();
  @Output() warpViewEditorWarpscriptChanged = new EventEmitter<any>();
  @Output() warpViewEditorWarpscriptResult = new EventEmitter<any>();
  @Output() warpViewEditorLoaded = new EventEmitter<any>();
  @Output() warpViewEditorSize = new EventEmitter<any>();
  @Output() warpViewEditorBreakPoint = new EventEmitter<any>();
  @Output() warpViewEditorCtrlClick = new EventEmitter<any>();
  @Output() warpViewEditorDatavizRequested = new EventEmitter<any>();
  @ViewChild('wrapper', { static: true }) wrapper: ElementRef<HTMLDivElement>;
  @ViewChild('editor', { static: true }) editor: ElementRef<HTMLDivElement>;
  @ViewChild('buttons', { static: true }) buttons: ElementRef<HTMLDivElement>;

  result: any[];
  status: { message: string, ops: number, elapsed: number, fetched: number };
  error: string;
  loading = false;
  selectedResultTab = -1;
  // tslint:disable-next-line:variable-name
  _theme = 'light';
  // tslint:disable-next-line:variable-name
  _warpscript: string;
  // tslint:disable-next-line:variable-name
  _debug = false;
  private LOG: Logger;
  private WARPSCRIPT_LANGUAGE = 'warpscript';
  private ed: IStandaloneCodeEditor;
  private monacoTheme = 'vs';
  private innerCode: string;
  private breakpoints = {};
  private decoration = [];
  private previousParentHeight = -1;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  private innerConfig: Config = {
    buttons: {
      class: '',
    },
    execButton: {
      class: '',
      label: 'Execute',
    },
    datavizButton: {
      class: '',
      label: 'Visualize',
    },
    hover: true,
    readOnly: false,
    messageClass: '',
    errorClass: '',
    editor: {
      quickSuggestionsDelay: 10,
      quickSuggestions: true,
      tabSize: 2,
      minLineNumber: 10,
      enableDebug: false
    },
  };
  ro: ResizeObserver;

  constructor(private el: ElementRef, private http: HttpClient) {
    this.LOG = new Logger(WarpViewEditorComponent, this._debug);
  }

  private static getType(tags: string[], name: string): CompletionItemKind {
    const t = tags.join(' ');
    if(t.indexOf('constant') > -1) {
      return CompletionItemKind.Enum;
    } else if(t.indexOf('reducer') > -1 && name !== 'REDUCE') {
      return CompletionItemKind.Interface;
    } else if(t.indexOf('mapper') > -1 && name !== 'MAP') {
      return CompletionItemKind.Interface;
    } else if(t.indexOf('bucketize') > -1 && name !== 'BUCKETIZE') {
      return CompletionItemKind.Interface;
    } else if(t.indexOf('filter') > -1 && name !== 'FILTER') {
      return CompletionItemKind.Interface;
    } else if(t.indexOf('control') > -1) {
      return CompletionItemKind.Keyword;
    } else if(t.indexOf('operators') > -1) {
      return CompletionItemKind.Method;
    } else if(t.indexOf('stack') > -1) {
      return CompletionItemKind.Module;
    } else {
      return CompletionItemKind.Function;
    }
  }

  private static formatElapsedTime(elapsed: number) {
    if(elapsed < 1000) {
      return elapsed.toFixed(3) + ' ns';
    }
    if(elapsed < 1000000) {
      return (elapsed / 1000).toFixed(3) + ' μs';
    }
    if(elapsed < 1000000000) {
      return (elapsed / 1000000).toFixed(3) + ' ms';
    }
    if(elapsed < 1000000000000) {
      return (elapsed / 1000000000).toFixed(3) + ' s ';
    }
    // Max exec time for nice output: 999.999 minutes (should be OK, timeout should happen before that).
    return (elapsed / 60000000000).toFixed(3) + ' m ';
  }

  // noinspection JSUnusedGlobalSymbols
  ngOnInit() {
    if(typeof this.config === 'string') {
      this.innerConfig = Utils.mergeDeep(this.innerConfig, JSON.parse(this.config));
    } else {
      this.innerConfig = Utils.mergeDeep(this.innerConfig, this.config);
    }
    this.LOG.debug(['ngOnInit'], 'innerConfig: ', this.innerConfig, this.config);
    this.innerCode = this.el.nativeElement.textContent;
    // add blank lines when needed
    for(let i = this.innerCode.split('\n').length; i < this.innerConfig.editor.minLineNumber; i++) {
      this.innerCode += '\n';
    }
    if('dark' === this._theme) {
      this.monacoTheme = 'vs-dark';
    }
    this.LOG.debug(['ngOnInit'], 'ngOnInit theme is: ', this._theme);
    if(!getLanguages().find(l => l.id === this.WARPSCRIPT_LANGUAGE)) {
      register({ id: this.WARPSCRIPT_LANGUAGE });
      this.LOG.debug(['ngOnInit'], 'register: ', this.WARPSCRIPT_LANGUAGE);
      setMonarchTokensProvider(this.WARPSCRIPT_LANGUAGE, Monarch.rules);
      setLanguageConfiguration(this.WARPSCRIPT_LANGUAGE, {
          wordPattern: /[^\s\t]+/,
          comments: {
            lineComment: '//',
            blockComment: ['/**', '*/'],
          },
          brackets: [
            ['{', '}'],
            ['[', ']'],
            ['(', ')'],
            ['<%', '%>'],
            ['<\'', '\'>'],
            ['[[', ']]'],
          ],
          autoClosingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '<%', close: '%>' },
            { open: '[[', close: ']]' },
            { open: ' \'', close: '\'', notIn: ['string', 'comment'] },
            { open: '<\'', close: '\'>' },
            { open: '"', close: '"', notIn: ['string'] },
            { open: '`', close: '`', notIn: ['string', 'comment'] },
            { open: '/**', close: ' */', notIn: ['string'] },
          ],
          surroundingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '[[', close: ']]' },
            { open: '<%', close: '%>' },
            { open: '<\'', close: '\'>' },
            { open: '\'', close: '\'' },
            { open: '"', close: '"' },
            { open: '`', close: '`' },
          ],
          onEnterRules: [
            {
              // e.g. /** | */
              beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
              afterText: /^\s*\*\/$/,
              action: { indentAction: IndentAction.IndentOutdent, appendText: ' * ' },
            },
            {
              // e.g. /** ...|
              beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
              action: { indentAction: IndentAction.None, appendText: ' * ' },
            },
            {
              // e.g.  * ...|
              beforeText: /^(\t|( {2}))* \*( ([^*]|\*(?!\/))*)?$/,
              action: { indentAction: IndentAction.None, appendText: '* ' },
            },
            {
              // e.g.  */|
              beforeText: /^(\t|( {2}))* \*\/\s*$/,
              action: { indentAction: IndentAction.None, removeText: 1 },
            },
          ],
        },
      );
      registerHoverProvider(this.WARPSCRIPT_LANGUAGE, {
        provideHover: (model: IReadOnlyModel, position: Position) => {
          const word = model.getWordAtPosition(position);
          const range = new Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn);
          this.LOG.debug(['ngOnInit'], 'provideHover', model, position, word);
          const name = word.word;
          const entry = wsGlobals[ name ];
          if(entry && entry.description) {
            const signature = entry.signature || '';
            const contents: any[] = ['### ' + name, {
              language: this.WARPSCRIPT_LANGUAGE,
              value: signature,
            }, entry.description.replace(/(\/doc\/\w+)/g, x => `https://www.warp10.io${x}`)];
            return { range, contents } as Hover;
          }
          return undefined;
        },
      });

      registerCompletionItemProvider(this.WARPSCRIPT_LANGUAGE, {
        provideCompletionItems: () => {
          const defs: CompletionList = {
            suggestions: [],
          };
          WarpScript.reference.forEach(f => {
            const item: CompletionItem = {
              label: f.name,
              insertText: f.name,
              range: undefined,
              kind: WarpViewEditorComponent.getType(f.tags, f.name)
            };
            defs.suggestions.push(item);
          });
          return defs;
        },
      });
    }
  }


  resizeWatcher() {
    const editorParentHeight = this.editor.nativeElement.parentElement.getBoundingClientRect().height
      - parseInt(window.getComputedStyle(this.editor.nativeElement.parentElement).getPropertyValue('padding-top'), 10)
      - parseInt(window.getComputedStyle(this.editor.nativeElement.parentElement).getPropertyValue('padding-bottom'), 10);

    const warpviewParentHeight = this.el.nativeElement.parentElement.getBoundingClientRect().height
      - parseInt(window.getComputedStyle(this.el.nativeElement.parentElement).getPropertyValue('padding-top'), 10)
      - parseInt(window.getComputedStyle(this.el.nativeElement.parentElement).getPropertyValue('padding-bottom'), 10);

    // fix the 5px editor height in chrome by setting the wrapper height at element level
    if(Math.abs(this.wrapper.nativeElement.getBoundingClientRect().height - warpviewParentHeight) > 30) {
      this.LOG.debug(['resize'], 'resize wrapper to parent height ' + warpviewParentHeight);
      this.wrapper.nativeElement.style.height = warpviewParentHeight + 'px';
    }
    // watch for editor parent' size change
    if(editorParentHeight !== this.previousParentHeight) {
      this.previousParentHeight = editorParentHeight;
      // TODO: the 20 px offset in firefox might be a bug around flex countainers. Can't figure out.
      const editorH = Math.floor(editorParentHeight) - 20 - (this.buttons ? this.buttons.nativeElement.getBoundingClientRect().height : 0);
      const editorW = Math.floor(this.editor.nativeElement.parentElement.getBoundingClientRect().width);
      this.LOG.debug(['resize'], 'resized editor to ', editorW, editorH);
      this.ed.layout({ height: editorH, width: editorW });
      this.editor.nativeElement.style.overflow = 'hidden';
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   */
  ngAfterViewInit(): void {
    if(!!this.heightPx) {
      // if height-px is set, size is fixed.
      this.el.nativeElement.style.height = this.heightPx + 'px';
      this.wrapper.nativeElement.style.height = this.heightPx + 'px';
    } else {
      // compute the layout manually in a 200ms timer
      setInterval(this.resizeWatcher.bind(this), 200);
    }
    try {
      this.LOG.debug(['ngAfterViewInit'], 'warpscript', this.warpscript);
      this.LOG.debug(['ngAfterViewInit'], 'inner: ', this.innerCode);
      const edOpts: IEditorConstructionOptions = {
        quickSuggestionsDelay: this.innerConfig.editor.quickSuggestionsDelay,
        quickSuggestions: this.innerConfig.editor.quickSuggestions,
        value: this._warpscript || this.innerCode,
        language: this.WARPSCRIPT_LANGUAGE,
        automaticLayout: (!!this.heightPx), // monaco auto layout is ok if parent has a fixed size, not 100% or a calc ( % px ) formula.
        theme: this.monacoTheme,
        hover: { enabled: this.innerConfig.hover },
        readOnly: this.innerConfig.readOnly,
        fixedOverflowWidgets: true,
        folding: true,
        glyphMargin: this.innerConfig.editor.enableDebug,
      };
      this.LOG.debug(['ngAfterViewInit'], 'edOpts: ', edOpts);
      this.ed = create(this.editor.nativeElement, edOpts);
      if(this.innerConfig.editor.enableDebug) {
        this.ed.onMouseDown(e => {
          if(e.event.leftButton) {
            if(e.target.type === 2 || e.target.type === 3 || e.target.type === 4) {
              this.toggleBreakPoint(e.target.position.lineNumber);
            }
          }
        });
      }
      this.ed.getModel().updateOptions({ tabSize: this.innerConfig.editor.tabSize });
      if(this.ed) {
        this.ed.getModel().onDidChangeContent((event) => {
          this.LOG.debug(['ngAfterViewInit'], 'ws changed', event);
          this.warpViewEditorWarpscriptChanged.emit(this.ed.getValue());
        });
      }
      // this.resize(true);
      // manage the ctrl click, create an event with the statement, the endpoint, the warpfleet repos.
      this.ed.onMouseDown(e => {
        if(e.event.ctrlKey) {
          // ctrl click on which word ?
          const name: string = this.ed.getModel().getWordAtPosition(e.target.range.getStartPosition()).word;
          // parse the warpscript
          const ws: string = this.ed.getValue();
          const specialHeaders: specialCommentCommands = WarpScriptParser.extractSpecialComments(ws);
          const repos: string[] = [];
          const statements: string[] = WarpScriptParser.parseWarpScriptStatements(ws);
          statements.forEach((st, i) => {
            if(st === 'WF.ADDREPO' && i > 0) {
              const previousStatement = statements[ i - 1 ];
              if(
                (previousStatement.startsWith('"') && previousStatement.endsWith('"'))
                || (previousStatement.startsWith('\'') && previousStatement.endsWith('\''))
              ) {
                // this is a valid string.
                repos.push(previousStatement.substring(1, previousStatement.length - 1));
              }
            }
          });
          const docParams: docGenerationParams = {
            endpoint: specialHeaders.endpoint || this.url,
            macroName: name,
            wfRepos: repos
          };
          this.warpViewEditorCtrlClick.emit(docParams);
        }
      });
    } catch(e) {
      this.LOG.error(['ngAfterViewInit'], 'componentDidLoad', e);
    }
  }

  // noinspection JSUnusedGlobalSymbols
  ngOnDestroy() {
    this.LOG.debug(['ngOnDestroy'], 'Component removed from the DOM');
    if(this.ed) {
      this.ed.dispose();
    }
    this.ro.disconnect();
    if(this.ngUnsubscribe) {
      // This aborts all HTTP requests.
      this.ngUnsubscribe.next();
      // This completes the subject properlly.
      this.ngUnsubscribe.complete();
    }
  }

  public abort() {
    if(this.ngUnsubscribe) {
      // This aborts all HTTP requests.
      this.ngUnsubscribe.next();
      // This completes the subject properlly.
      this.ngUnsubscribe.complete();
    }
  }

  public displayResult(result: string) {
    this.result = new JsonLib().parse(result, undefined);
  }

  public highlight(line: number) {
    const currentKey = 'hl-' + line;
    Object.keys(this.breakpoints).forEach(k => {
      if(k.startsWith('hl')) {
        delete this.breakpoints[ k ];
      }
    });
    this.breakpoints[ currentKey ] = {
      range: new Range(line, 1, line, 1),
      options: {
        isWholeLine: true,
        className: 'warpviewContentClass'
      }
    };
    this.decoration = this.ed.deltaDecorations(this.decoration, Utils.toArray(this.breakpoints));
  }

  private toggleBreakPoint(line: number) {
    const currentKey = 'bp-' + line;
    if(this.breakpoints[ currentKey ]) {
      delete this.breakpoints[ currentKey ];
    } else {
      this.breakpoints[ currentKey ] = {
        range: new Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          glyphMarginClassName: 'warpviewGlyphMarginClass'
        }
      };
    }
    this.warpViewEditorBreakPoint.emit(this.breakpoints);
    this.decoration = this.ed.deltaDecorations(this.decoration, Utils.toArray(this.breakpoints));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      this.error = error;
      this.warpViewEditorErrorEvent.emit(this.error);
      this.loading = false;
      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  public execute() {
    this.result = undefined;
    this.status = undefined;
    this.error = undefined;
    if(this.ed) {
      this.LOG.debug(['execute'], 'this.ed.getValue()', this.ed.getValue());
      this.loading = true;
      // parse comments to look for inline url or preview modifiers
      const specialHeaders: specialCommentCommands = WarpScriptParser.extractSpecialComments(this.ed.getValue());
      const previewType = specialHeaders.displayPreviewOpt || 'none';
      if(previewType === 'I') {
        this.selectedResultTab = 2; // select image tab.
      } else if(this.selectedResultTab === 2) {
        this.selectedResultTab = 0; // on next execution, select results tab.
      }
      const executionUrl = specialHeaders.endpoint || this.url;
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      this.http.post<HttpResponse<string>>(executionUrl, this.ed.getValue(), {
        observe: 'response',
        responseType: 'text'
      })
        .pipe(takeUntil(this.ngUnsubscribe))
        .pipe(catchError(this.handleError<HttpResponse<any[]>>('execute', undefined)))
        .pipe(tap(res => {
          console.log(res)
        }))
        .subscribe(res => {
          this.LOG.debug(['execute'], 'response', res.body);
          this.warpViewEditorWarpscriptResult.emit(res.body);
          this.status = {
            message: `Your script execution took
 ${WarpViewEditorComponent.formatElapsedTime(parseInt(res.headers.get('x-warp10-elapsed'), 10))}
 serverside, fetched
 ${res.headers.get('x-warp10-fetched')} datapoints and performed
 ${res.headers.get('x-warp10-ops')}  WarpScript operations.`,
            ops: parseInt(res.headers.get('x-warp10-ops'), 10),
            elapsed: parseInt(res.headers.get('x-warp10-elapsed'), 10),
            fetched: parseInt(res.headers.get('x-warp10-fetched'), 10)
          };
          this.warpViewEditorStatusEvent.emit(this.status);

          try {
            this.result = new JsonLib().parse(res.body, undefined);
          } catch(e) {
            if(e.name && e.message && e.at && e.text) {
              this.error = `${e.name}: ${e.message} at char ${e.at} => ${e.text}`;
            } else {
              this.error = e.toString();
            }
            this.result = res.body as any[];
            this.LOG.error(['execute 1'], this.error);
            this.warpViewEditorErrorEvent.emit(this.error);
          }
          this.loading = false;
        });
    } else {
      this.loading = false;
      this.LOG.error(['execute'], 'no active editor');
    }
  }

  requestDataviz() {
    this.warpViewEditorDatavizRequested.emit(this.result);
  }

  @HostListener('document:resize', ['$event'])
  @HostListener('resized', ['$event'])
  onResized($event) {
    this.LOG.debug(['onResized'], $event.detail.editor);
    this.warpViewEditorSize.emit($event.detail.editor);
  }

  public resize(initial: boolean) {
    window.setTimeout(() => {
      if(initial && (!!this.heightPx)) {
        this.editor.nativeElement.style.height = `calc(100% - ${this.buttons ?
          this.buttons.nativeElement.getBoundingClientRect().height
          : 100}px )`;
      }
      if(initial) {
        this.warpViewEditorLoaded.emit();
      }
    }, initial ? 500 : 100);
  }

  private getItems() {
    const headers = [];
    if(this.showResult) {
      headers.push({ name: 'editor', size: this.initialSize ? this.initialSize.p || 50 : 50 });
      headers.push({ name: 'result', size: this.initialSize ? 100 - this.initialSize.p || 50 : 50 });
    } else {
      headers.push({ name: 'editor', size: 100 });
    }
    return headers;
  }

  responsiveStyle() {
    return { height: 'calc( 100% - 22px )', width: '100%', overflow: 'hidden' };
  }
}
