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

/* tslint:disable:no-string-literal */
import {editor, MarkerSeverity, Range} from 'monaco-editor';
import {Utils} from '../../model/utils';
import {Config} from '../../model/config';
import {Logger} from '../../model/logger';
import {BubblingEvents} from '../../model/bubblingEvent';
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
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable, of, Subscription} from 'rxjs';
import {ProviderRegistrar} from './providers/ProviderRegistrar';
import {EditorUtils} from './providers/editorUtils';
import {createReviewManager, ReviewCommentEvent, ReviewManager, ReviewManagerConfig} from './providers/CodeReview';
import dayjs from 'dayjs';
import {WarpScriptParser} from '../../model/warpScriptParser';
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import create = editor.create;
import IEditorOptions = editor.IEditorOptions;
import IMarkerData = editor.IMarkerData;

@Component({
  selector: 'warpview-editor',
  templateUrl: './warp-view-editor.component.html',
  styleUrls: ['./warp-view-editor.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class WarpViewEditorComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() url = '';
  @Input() existingComments: ReviewCommentEvent[];

  @Input() set lang(lang: string) {
    this._lang = lang;
    if (!!editor && !!this.ed) {
      editor.setModelLanguage(this.ed.getModel(), this._lang);
    }
  }

  get lang(): string {
    return this._lang;
  }

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

  @Input()
  set theme(newValue: string) {
    this.LOG.debug(['themeHandler'], 'The new value of theme is: ', newValue);
    if ('dark' === newValue) {
      this.monacoTheme = 'vs-dark';
    } else {
      this.monacoTheme = 'vs';
    }
    this.LOG.debug(['themeHandler'], 'The new value of theme is: ', this.monacoTheme);
    this._theme = newValue;
    if (editor) {
      editor.setTheme(this.monacoTheme);
    }
  }

  get theme(): string {
    return this._theme;
  }

  @Input('warpscript')
  set warpscript(newValue: string) {
    this.LOG.debug(['warpscriptHandler'], 'The new value of warpscript is: ', newValue);
    if (this.ed) {
      this.ed.setValue(newValue);
    }
    this._warpscript = newValue;
    this.loading = false;
  }

  get warpscript(): string {
    return this._warpscript;
  }

  @Input('showDataviz')
  get showDataviz(): boolean {
    return this._showDataviz;
  }

  set showDataviz(value: boolean) {
    this._showDataviz = '' + value !== 'false';
  }

  private _showExecute = true;
  @Input('showExecute')
  get showExecute(): boolean {
    return this._showExecute;
  }

  set showExecute(value: boolean) {
    this._showExecute = '' + value !== 'false';
  }

  @Input('showResult')
  get showResult(): boolean {
    return this._showResult;
  }

  set showResult(value: boolean) {
    this._showResult = '' + value !== 'false';
  }

  @Input('config') set config(config: Config | string) {
    let conf = (typeof config === 'string') ? JSON.parse(config || '{}') : config || {};
    this.innerConfig = Utils.mergeDeep(this.innerConfig, conf);
    this.LOG.debug(['config'], this.innerConfig, conf);
    if (this.ed) {
      this.LOG.debug(['config'], this.innerConfig);
      this.ed.updateOptions(this.setOptions());
      if (this.innerConfig.codeReview && !!this.innerConfig.codeReview.enabled) {
        this.reviewManagerConfig.addButton = this.innerConfig.codeReview.addButton as any;
        this.reviewManagerConfig.cancelButton = this.innerConfig.codeReview.cancelButton as any;
        this.reviewManagerConfig.replyButton = this.innerConfig.codeReview.replyButton as any;
        this.reviewManagerConfig.removeButton = this.innerConfig.codeReview.removeButton as any;
        this.reviewManager.currentUser = this.innerConfig.codeReview.currentUser;
        this.reviewManager.setReadOnlyMode(this.innerConfig.codeReview.readonly);
        this.reviewManagerConfig.editButton = this.innerConfig.codeReview.editButton as any;
        this.reviewManager.updateConfig(this.reviewManagerConfig);
      }
    }
  }

  get config(): Config | string {
    return this.innerConfig;
  }

  @Input('displayMessages')
  get displayMessages(): boolean {
    return this._displayMessages;
  }

  set displayMessages(value: boolean) {
    this._displayMessages = '' + value !== 'false';
  }

  @Input('widthPx')
  get widthPx(): number {
    return this._widthPx;
  }

  set widthPx(value: number) {
    this._widthPx = parseInt('' + value, 10);
  }

  @Input('heightLine')
  get heightLine(): number {
    return this._heightLine;
  }

  set heightLine(value: number) {
    this._heightLine = parseInt('' + value, 10);
  }

  @Input('heightPx')
  get heightPx(): number {
    return this._heightPx;
  }

  set heightPx(value: number) {
    this._heightPx = parseInt('' + value, 10);
  }

  @Input('imageTab')
  get imageTab(): boolean {
    return this._imageTab;
  }

  set imageTab(value: boolean) {
    this._imageTab = '' + value !== 'false';
  }

  @Input('initialSize')
  get initialSize(): { w?: number, h?: number, name?: string, p?: number } | string {
    return this._initialSize;
  }

  set initialSize(value: { w?: number, h?: number, name?: string, p?: number } | string) {
    this._initialSize = typeof value === 'string' ? JSON.parse(value) : value;
  }

  @Output('warpViewEditorStatusEvent') warpViewEditorStatusEvent = new EventEmitter<any>();
  @Output('warpViewEditorErrorEvent') warpViewEditorErrorEvent = new EventEmitter<any>();
  @Output('warpViewEditorWarpscriptChanged') warpViewEditorWarpscriptChanged = new EventEmitter<any>();
  @Output('warpViewEditorWarpscriptResult') warpViewEditorWarpscriptResult = new EventEmitter<any>();
  @Output('warpViewEditorLoaded') warpViewEditorLoaded = new EventEmitter<any>();
  @Output('warpViewEditorSize') warpViewEditorSize = new EventEmitter<any>();
  @Output('warpViewEditorBreakPoint') warpViewEditorBreakPoint = new EventEmitter<any>();
  @Output('warpViewEditorCtrlClick') warpViewEditorCtrlClick = new EventEmitter<any>();
  @Output('warpViewEditorDatavizRequested') warpViewEditorDatavizRequested = new EventEmitter<any>();
  @Output('warpViewEditorCodeReview') warpViewEditorCodeReview = new EventEmitter<any>();

  @ViewChild('wrapper', {static: true}) wrapper: ElementRef<HTMLDivElement>;
  @ViewChild('editor', {static: true}) editor: ElementRef<HTMLDivElement>;
  @ViewChild('buttons', {static: true}) buttons: ElementRef<HTMLDivElement>;
  @ViewChild('content', {static: true}) contentWrapper: ElementRef<HTMLDivElement>;

  result: string;
  status: { message: string, ops: number, elapsed: number, fetched: number };
  error: string;
  loading = false;
  selectedResultTab = -1;
  lastKnownWS: string;
  headers = this.getItems();
  innerConfig = new Config();
  // tslint:disable-next-line:variable-name
  _theme = 'light';
  // tslint:disable-next-line:variable-name
  _warpscript: string;
  // tslint:disable-next-line:variable-name
  _debug = false;
  _displayMessages = true;
  _showDataviz = false;
  _lang = 'warpscript';
  reviewManagerConfig: ReviewManagerConfig = {
    formatDate: (createdAt) => dayjs(createdAt).format('YYYY-MM-DD HH:mm'),
  };
  private _heightPx: number;
  private _heightLine: number;
  private _showResult = true;
  private _imageTab = false;
  private _widthPx: number;
  private _initialSize: { w?: number, h?: number, name?: string, p?: number };
  private static MIN_HEIGHT = 250;
  private LOG: Logger;
  private ed: IStandaloneCodeEditor;
  private monacoTheme = 'vs';
  private innerCode: string;
  private breakpoints = {};
  private decoration = [];
  private previousParentHeight = -1;
  private previousParentWidth = -1;
  private request: Subscription;
  private resizeWatcherInt: any;
  private reviewManager: ReviewManager;

  constructor(private el: ElementRef, private http: HttpClient) {
    this.LOG = new Logger(WarpViewEditorComponent, this._debug);
    (el.nativeElement as any).execute = this.execute.bind(this);
    (el.nativeElement as any).abort = this.abort.bind(this);
    (el.nativeElement as any).highlight = this.highlight.bind(this);
    (el.nativeElement as any).resize = this.resize.bind(this);
  }

  // noinspection JSUnusedGlobalSymbols
  ngOnInit() {
    this.LOG.debug(['ngOnInit'], 'innerConfig: ', this.innerConfig);
    if ('dark' === this._theme) {
      this.monacoTheme = 'vs-dark';
    }
    this.LOG.debug(['ngOnInit'], 'ngOnInit theme is: ', this._theme);
    (self as any).MonacoEnvironment = {
      getWorkerUrl: () => URL.createObjectURL(new Blob([`
	self.MonacoEnvironment = {
		baseUrl: 'https://unpkg.com/monaco-editor@0.18.1/min/'
	};
	importScripts('https://unpkg.com/monaco-editor@0.18.1/min/vs/base/worker/workerMain.js');
`], {type: 'text/javascript'}))
    };
    ProviderRegistrar.register(this.innerConfig);
  }

  resizeWatcher() {
    const editorParentWidth = this.editor.nativeElement.parentElement.clientWidth;
    const editorParentHeight = this.editor.nativeElement.parentElement.clientHeight
      - parseInt(window.getComputedStyle(this.editor.nativeElement.parentElement).getPropertyValue('padding-top'), 10)
      - parseInt(window.getComputedStyle(this.editor.nativeElement.parentElement).getPropertyValue('padding-bottom'), 10);

    let warpviewParentHeight = this.el.nativeElement.parentElement.clientHeight
      - parseInt(window.getComputedStyle(this.el.nativeElement.parentElement).getPropertyValue('padding-top'), 10)
      - parseInt(window.getComputedStyle(this.el.nativeElement.parentElement).getPropertyValue('padding-bottom'), 10);
    warpviewParentHeight = Math.max(warpviewParentHeight, WarpViewEditorComponent.MIN_HEIGHT);
    // fix the 5px editor height in chrome by setting the wrapper height at element level
    if (Math.abs(this.wrapper.nativeElement.clientHeight - warpviewParentHeight) > 30) {
      this.wrapper.nativeElement.style.height = warpviewParentHeight + 'px';
    }
    // watch for editor parent' size change
    if (editorParentHeight !== this.previousParentHeight || editorParentWidth !== this.previousParentWidth) {
      this.previousParentHeight = editorParentHeight;
      this.previousParentWidth = editorParentWidth;
      const editorH = Math.floor(editorParentHeight) - (this.buttons ? this.buttons.nativeElement.clientHeight : 0);
      const editorW = Math.floor(this.editor.nativeElement.parentElement.clientWidth);
      this.ed.layout({height: editorH, width: editorW});
      this.editor.nativeElement.style.overflow = 'hidden';
    }
  }

  setOptions(): IEditorOptions {
    return {
      quickSuggestionsDelay: this.innerConfig.editor.quickSuggestionsDelay,
      quickSuggestions: this.innerConfig.editor.quickSuggestions,
      suggestOnTriggerCharacters: this.innerConfig.editor.quickSuggestions,
      // monaco auto layout is ok if parent has a fixed size, not 100% or a calc ( % px ) formula.
      automaticLayout: !!this._heightPx,
      hover: {enabled: this.innerConfig.hover},
      readOnly: this.innerConfig.readOnly,
      contextmenu: true,
      //  fixedOverflowWidgets: true,
      folding: true,
      glyphMargin: this.innerConfig.editor.enableDebug || this.innerConfig.codeReview.enabled
    };
  }

  ngAfterViewInit(): void {
    this.LOG.debug(['ngAfterViewInit'], 'height', this._heightPx);
    if (!!this._heightPx) {
      // if height-px is set, size is fixed.
      this.el.nativeElement.style.height = this._heightPx + 'px';
      this.wrapper.nativeElement.style.height = this._heightPx + 'px';
      this.resize(true);
    } else {
      // compute the layout manually in a 200ms timer
      this.resizeWatcherInt = setInterval(this.resizeWatcher.bind(this), 200);
    }
    try {
      this.innerCode = this.contentWrapper.nativeElement.textContent;
      // add blank lines when needed
      for (let i = this.innerCode.split('\n').length; i < this.innerConfig.editor.minLineNumber; i++) {
        this.innerCode += '\n';
      }
      // trim spaces and line breaks at the beginning (side effect of angular)
      let firstIndex = 0;
      while (this.innerCode[firstIndex] === ' ' || this.innerCode[firstIndex] === '\n') {
        firstIndex++;
      }
      this.innerCode = this.innerCode.substring(firstIndex);
      this.LOG.debug(['ngAfterViewInit'], 'warpscript', this._warpscript);
      this.LOG.debug(['ngAfterViewInit'], 'inner: ', this.innerCode.split('\n'));
      this.LOG.debug(['ngAfterViewInit'], 'innerConfig: ', this.innerConfig);
      const edOpts: IEditorOptions = this.setOptions();
      this.lastKnownWS = this._warpscript || this.innerCode;
      editor.setTheme(this.monacoTheme);
      this.LOG.debug(['ngAfterViewInit'], 'edOpts: ', edOpts);
      this.ed = create(this.editor.nativeElement, edOpts);
      this.ed.setValue(this.lastKnownWS);
      editor.setModelLanguage(this.ed.getModel(), this._lang);

      if (this.innerConfig.editor.enableDebug) {
        this.ed.onMouseDown(e => {
          if (e.event.leftButton) {
            if (e.target.type === 2 || e.target.type === 3 || e.target.type === 4) {
              this.toggleBreakPoint(e.target.position.lineNumber);
            }
          }
        });
      }
      this.ed.getModel().updateOptions({tabSize: this.innerConfig.editor.tabSize});
      if (this.ed) {
        this.warpViewEditorLoaded.emit('loaded');
        // angular events does not bubble up outside angular component.
        BubblingEvents.emitBubblingEvent(this.el, 'warpViewEditorLoaded', 'loaded');
        this.LOG.debug(['ngAfterViewInit'], 'loaded');
        this.ed.getModel().onDidChangeContent((event) => {

          if (this.lastKnownWS !== this.ed.getValue()) {
            this.debounce(() => {
              this.LOG.debug(['ngAfterViewInit'], 'ws changed', event);
              this.warpViewEditorWarpscriptChanged.emit(this.ed.getValue());
              BubblingEvents.emitBubblingEvent(this.el, 'warpViewEditorWarpscriptChanged', this.ed.getValue());
              //   this.wsAudit(this.ed.getValue());
            }, 200)();
          }
        });
        // manage the ctrl click, create an event with the statement, the endpoint, the warpfleet repos.
        this.ed.onMouseDown(e => {
          if (e.target.range && ((!this.isMac() && !!e.event.ctrlKey) || (this.isMac() && !!e.event.metaKey))) {
            // ctrl click on which word ?
            const name: string = (this.ed.getModel().getWordAtPosition(e.target.range?.getStartPosition()) || {word: undefined}).word;
            // parse the warpscript
            const ws: string = this.ed.getValue();
            const specialHeaders = WarpScriptParser.extractSpecialComments(ws);
            const repos: string[] = [];
            const statements: string[] = WarpScriptParser.parseWarpScriptStatements(ws);
            statements.forEach((st, i) => {
              if (st === 'WF.ADDREPO' && i > 0) {
                const previousStatement = statements[i - 1];
                if (
                  (previousStatement.startsWith('"') && previousStatement.endsWith('"'))
                  || (previousStatement.startsWith('\'') && previousStatement.endsWith('\''))
                ) {
                  // this is a valid string.
                  repos.push(previousStatement.substring(1, previousStatement.length - 1));
                }
              }
            });
            const docParams = {
              endpoint: specialHeaders.endpoint || this.url,
              macroName: name,
              wfRepos: repos
            };
            this.warpViewEditorCtrlClick.emit(docParams);
            BubblingEvents.emitBubblingEvent(this.el, 'warpViewEditorCtrlClick', docParams);
          }
          //     this.wsAudit(this.ed.getValue());
        });
        if (this.innerConfig.codeReview && !!this.innerConfig.codeReview.enabled) {
          this.reviewManagerConfig.addButton = this.innerConfig.codeReview.addButton as any;
          this.reviewManagerConfig.cancelButton = this.innerConfig.codeReview.cancelButton as any;
          this.reviewManagerConfig.replyButton = this.innerConfig.codeReview.replyButton as any;
          this.reviewManagerConfig.removeButton = this.innerConfig.codeReview.removeButton as any;
          this.reviewManagerConfig.editButton = this.innerConfig.codeReview.editButton as any;
          this.reviewManager = createReviewManager(this.ed, this.innerConfig.codeReview.currentUser,
            this.existingComments,
            (updatedComments) => this.warpViewEditorCodeReview.emit(updatedComments),
            this.reviewManagerConfig);
          this.reviewManager.setReadOnlyMode(this.innerConfig.codeReview.readonly);
        }
      }
    } catch (e) {
      this.LOG.error(['ngAfterViewInit'], 'componentDidLoad', e);
    }
  }

  ngOnDestroy() {
    this.LOG.debug(['ngOnDestroy'], 'Component removed from the DOM');
    if (this.resizeWatcherInt) {
      clearInterval(this.resizeWatcherInt);
    }
    if (this.ed) {
      this.ed.dispose();
    }
    if (this.request) {
      this.request.unsubscribe();
    }
  }

  @Input()
  public abort(session?: string) {
    if (this.request) {
      const specialHeaders = WarpScriptParser.extractSpecialComments(this.ed.getValue());
      const executionUrl = specialHeaders.endpoint || this.url;
      // BubblingEvents.emitBubblingEvent(this.el, 'warpViewEditorErrorEvent', this.error);
      if (!!session) {
        this.http.post<HttpResponse<string>>(executionUrl,
          `<% '${session}' 'WSKILLSESSION' EVAL %> <% -1 %> <% %> TRY`,
          {
            // @ts-ignore
            observe: 'response',
            // @ts-ignore
            responseType: 'text',
            headers: {
              ...this.innerConfig.httpHeaders || {},
              'Accept': 'application/json',
            }
          })
          .pipe(catchError(this.handleError<HttpResponse<string>>(undefined)))
          .subscribe((res: HttpResponse<string>) => {
            if (!!res) {
              this.LOG.debug(['abort'], 'response', res.body);
              const r = JSON.parse(res.body);
              if (!!r[0]) {
                if (r[0] === 0) {
                  this.sendError('It appears that your Warp 10 is running on multiple backend', executionUrl);
                } else if (r[0] === -1) {
                  this.sendError(`Unable to WSABORT on ${executionUrl}. Did you activate StackPSWarpScriptExtension?`, executionUrl);
                }
                this.sendStatus({
                  endpoint: executionUrl,
                  message: `${WarpViewEditorComponent.getLabel(this._lang)} aborted.`,
                  ops: parseInt(res.headers.get('x-warp10-ops'), 10),
                  elapsed: parseInt(res.headers.get('x-warp10-elapsed'), 10),
                  fetched: parseInt(res.headers.get('x-warp10-fetched'), 10),
                });
              } else {
                this.sendError(`An error occurs for session: ${session}`, executionUrl);
              }
            }
            this.request.unsubscribe();
            delete this.request;
            this.loading = false;
          });
      } else {
        this.sendStatus({
          endpoint: executionUrl,
          message: `${WarpViewEditorComponent.getLabel(this._lang)} aborted.`,
          ops: 0,
          elapsed: 0,
          fetched: 0,
        });
        this.request.unsubscribe();
        delete this.request;
        this.loading = false;
      }
    }
  }

  @Input()
  public highlight(line: number) {
    const currentKey = 'hl-' + line;
    Object.keys(this.breakpoints).forEach(k => {
      if (k.startsWith('hl')) {
        delete this.breakpoints[k];
      }
    });
    this.breakpoints[currentKey] = {
      range: new Range(line, 1, line, 1),
      options: {
        isWholeLine: true,
        className: 'warpviewContentClass'
      }
    };
    this.decoration = this.ed.deltaDecorations(this.decoration, Utils.toArray(this.breakpoints));
  }

  private debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  private toggleBreakPoint(line: number) {
    const currentKey = 'bp-' + line;
    if (this.breakpoints[currentKey]) {
      delete this.breakpoints[currentKey];
    } else {
      this.breakpoints[currentKey] = {
        range: new Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          glyphMarginClassName: 'warpviewGlyphMarginClass'
        }
      };
    }
    this.warpViewEditorBreakPoint.emit(this.breakpoints);
    BubblingEvents.emitBubblingEvent(this.el, 'warpViewEditorBreakPoint', this.breakpoints);
    this.decoration = this.ed.deltaDecorations(this.decoration, Utils.toArray(this.breakpoints));
  }

  private handleError<T>(result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      this.LOG.error(['handleError'], {e: error});
      if (error.status === 0) {
        this.error = `Unable to reach ${error.url}`;
      } else {
        if (error.headers.get('X-Warp10-Error-Message') && error.headers.get('X-Warp10-Error-Line')) {
          this.error = 'line #' + error.headers.get('X-Warp10-Error-Line') + ': ' + error.headers.get('X-Warp10-Error-Message');
        } else {
          this.error = error.statusText;
        }
      }
      this.sendError(this.error, error.url);
      this.loading = false;
      return of(error.error);
    };
  }

  @Input()
  public execute(session?, bootstrap?) {
    if (this.ed) {
      this.result = undefined;
      this.status = undefined;
      this.error = undefined;
      let code = this.ed.getValue().replace(/ /gi, ' ');
      if (EditorUtils.FLOWS_LANGUAGE === this.lang) {
        code = `<'
${code}
'>
FLOWS
`;
      }
      this.LOG.debug(['execute'], 'this.ed.getValue()', session, code);
      this.loading = true;
      // parse comments to look for inline url or preview modifiers
      const specialHeaders = WarpScriptParser.extractSpecialComments(code);
      const previewType = specialHeaders.displayPreviewOpt || 'none';
      if (previewType === 'I') {
        this.selectedResultTab = 2; // select image tab.
      } else if (this.selectedResultTab === 2) {
        this.selectedResultTab = 0; // on next execution, select results tab.
      }
      const executionUrl = specialHeaders.endpoint || this.url;
      this.LOG.debug(['execute'], 'specialHeaders', this.innerConfig.addLocalHeader);
      // Get Warp10 version
      // @ts-ignore
      let headers = {
        ...this.innerConfig.httpHeaders || {},
        'Content-Type': 'text/plain;charset=UTF-8'
      };
      if (this.innerConfig.addLocalHeader) {
        headers['Access-Control-Request-Private-Network'] = 'true';
      }
      if (!!session) {
        headers['X-Warp10-WarpScriptSession'] = session;
      }
      this.request = this.http.post<HttpResponse<string>>(executionUrl, (bootstrap ? bootstrap + ' ' : '') + code, {
        observe: 'response',
        // @ts-ignore
        responseType: 'text',
        headers
      })
        .pipe(catchError(this.handleError<HttpResponse<string>>(undefined)))
        .subscribe((res: HttpResponse<string>) => {
          if (!!res) {
            this.LOG.debug(['execute'], 'response', res.body);
            this.warpViewEditorWarpscriptResult.emit(res.body || (res as any));
            BubblingEvents.emitBubblingEvent(this.el, 'warpViewEditorWarpscriptResult', res.body || (res as any));
            if (!!res.headers) {
              this.sendStatus({
                endpoint: executionUrl,
                message: `Your script execution took
 ${EditorUtils.formatElapsedTime(parseInt(res.headers.get('x-warp10-elapsed'), 10))}
 serverside, fetched
 ${res.headers.get('x-warp10-fetched')} datapoints and performed
 ${res.headers.get('x-warp10-ops')}  ${WarpViewEditorComponent.getLabel(this.lang)} operations.`,
                ops: parseInt(res.headers.get('x-warp10-ops'), 10),
                elapsed: parseInt(res.headers.get('x-warp10-elapsed'), 10),
                fetched: parseInt(res.headers.get('x-warp10-fetched'), 10),
              });
            }
            try {
              this.LOG.debug(['execute'], 'res', res);
              this.result = res.body || (res as any);
            } catch (e) {
              if (e.name && e.message && e.at && e.text) {
                this.error = `${e.name}: ${e.message} at char ${e.at} => ${e.text}`;
              } else {
                this.error = e.toString();
              }
              this.result = res.body;
              this.LOG.error(['execute 1'], this.error);
              this.sendError(this.error, executionUrl);
            }
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
    BubblingEvents.emitBubblingEvent(this.el, 'warpViewEditorDatavizRequested', this.result);
  }

  @HostListener('document:resize', ['$event'])
  @HostListener('resized', ['$event'])
  onResized($event) {
    this.LOG.debug(['onResized'], $event.detail.editor);
    this.warpViewEditorSize.emit($event.detail.editor);
  }

  isMac() {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  }

  onKeyDown($event) {
    this.LOG.debug(['onKeyDown'], $event);
    if ((!this.isMac() && !!$event.ctrlKey) || (this.isMac() && !!$event.metaKey)) {
      Array.from(this.editor.nativeElement.getElementsByClassName('mtk8'))
        .concat(Array.from(this.editor.nativeElement.getElementsByClassName('mtk22')))
        .concat(Array.from(this.editor.nativeElement.getElementsByClassName('mtk23')))
        .forEach(e => {
          if (!e.textContent.startsWith('$')) {
            (e as HTMLElement).classList.add('mouseOver');
          }
        });
    }
  }

  onKeyUp($event) {
    this.LOG.debug(['onKeyUp'], $event);
    Array.from(this.editor.nativeElement.getElementsByClassName('mtk8'))
      .concat(Array.from(this.editor.nativeElement.getElementsByClassName('mtk22')))
      .concat(Array.from(this.editor.nativeElement.getElementsByClassName('mtk23')))
      .forEach(e => (e as HTMLElement).classList.remove('mouseOver'));
  }

  @Input()
  public resize(initial: boolean) {
    window.setTimeout(() => {
      if (initial && (!!this._heightPx)) {
        this.editor.nativeElement.style.height = `calc(100% - ${this.buttons ?
          this.buttons.nativeElement.clientHeight
          : 100}px )`;
      }
      if (initial) {
        this.warpViewEditorLoaded.emit();
        BubblingEvents.emitBubblingEvent(this.el, 'warpViewEditorLoaded', 'loaded');
        this.LOG.debug(['resize'], 'loaded');
      }
    }, initial ? 500 : 100);
  }

  getItems() {
    const headers = [];
    if (this._showResult) {
      headers.push({name: 'editor', size: this._initialSize ? this._initialSize.p || 50 : 50});
      headers.push({name: 'result', size: this._initialSize ? 100 - this._initialSize.p || 50 : 50});
    } else {
      headers.push({name: 'editor', size: 100});
    }
    return headers;
  }

  responsiveStyle() {
    return {height: '100%', width: '100%', overflow: 'hidden'};
  }

  private sendError(error: string, executionUrl: string) {
    this.error = error;
    BubblingEvents.emitBubblingEvent(this.el, 'warpViewEditorErrorEvent',
      {error: this.error, endpoint: executionUrl});
    this.warpViewEditorErrorEvent.emit({error: this.error, endpoint: executionUrl});
  }

  private sendStatus(status: { elapsed: number; ops: number; message: string; fetched: number, endpoint: string }) {
    this.status = {...status};
    BubblingEvents.emitBubblingEvent(this.el, 'warpViewEditorStatusEvent', this.status);
    this.warpViewEditorStatusEvent.emit(this.status);
  }

  private static getLabel(lang: string) {
    switch (lang) {
      case 'flows':
        return 'FLoWS';
      case 'warpscript':
        return 'WarpScript';
      default:
        return 'warpscript';
    }
  }

  private wsAudit(ws: string) {
    const specialHeaders = WarpScriptParser.extractSpecialComments(ws);
    const executionUrl = specialHeaders.endpoint || this.url;
    let headers = {
      ...this.innerConfig.httpHeaders || {},
      'Content-Type': 'text/plain;charset=UTF-8'
    };
    if (this.innerConfig.addLocalHeader) {
      headers['Access-Control-Request-Private-Network'] = 'true';
    }
    this.request = this.http.post<any>(executionUrl,
      `<% 'WSAUDITMODE' EVAL %> <% %> <% %> TRY
<% ${ws} %>
<% 'WSAUDIT' EVAL SWAP DROP %> <% DROP [] %> <% %> TRY`,
      {headers})
      .subscribe(res => {
        if (!!res) {
          const tokenizedWS = ws.split('\n').map(l => l.split(' '));
          const parsed = WarpScriptParser.parseWarpScriptStatements(ws, true);
          let markers = (res[0] || []).map(err => {
            const l = err.line;

            let j = 0;
            let firstChar = tokenizedWS[l - 1][j];
            let c = firstChar === '' ? 0 : 1;
            while (firstChar === '') {
              c += 1;
              firstChar = tokenizedWS[l - 1][j++];
            }
            for (let i = 0; i < err.position; i++) {
              c += tokenizedWS[l - 1][i].length + 1;
            }
            return {
              startLineNumber: l,
              endLineNumber: l,
              startColumn: c,
              endColumn: c + err.statement.length,
              message: this.getMessage(err.type),
              severity: MarkerSeverity.Error
            } as IMarkerData;
          });
          editor.setModelMarkers(this.ed.getModel(), 'owner', markers);
        }
      });
  }

  private getMessage(type: string) {
    switch (type) {
      case 'UNKNOWN':
        return 'Unknown function';
      case 'WS_EXCEPTION':
        return 'WarpScript Exception';
    }
    return '';
  }
}
