import {Component, Element, Prop, Watch, State} from "@stencil/core";
import monaco from "@timkendrick/monaco-editor";
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;
import {GTSLib} from "../../gts.lib";

import "@code-dimension/stencil-components";

import merge from 'deepmerge'
@Component({
  tag: "warp-view-result",
  styleUrls: [
    "../../../node_modules/monaco-editor/min/vs/editor/editor.main.css",
    "warp-view-result.scss"
  ],
  shadow: false
})
export class WarpViewResult {
  @Element() el: HTMLStencilElement;

  @Prop() result: {
    json: any[],
    error: string,
    message: string
  } = {json: [], error: '', message: ''};
  @Prop() theme: string = "light";
  @Prop() config: object = {};
  @Prop() displayMessages = true;
  @State() loading = false;

  private _result: { json: any[], error: string, message: string } = {json: [], error: '', message: ''};
  private _config = {
    messageClass: '',
    errorClass: ''
  };
  private resEd: IStandaloneCodeEditor;
  private monacoTheme = 'vs';
  private resUid: string;

  @Watch("theme")
  themeHandler(newValue: string, _oldValue: string) {
    console.log(
      "[WarpViewResult] - The new value of theme is: ",
      newValue,
      _oldValue
    );
    if ("dark" === newValue) {
      this.monacoTheme = "vs-dark";
    } else {
      this.monacoTheme = "vs";
    }
    console.log(
      "[WarpViewResult] - The new value of theme is: ",
      this.monacoTheme
    );
    monaco.editor.setTheme(this.monacoTheme);
  }

  @Watch("result")
  resultHandler(newValue: any, _oldValue: any) {
    console.log(
      "[WarpViewResult] - The new value of result is: ",
      newValue,
      _oldValue
    );
    this._result = newValue;
    this.buildEditor(JSON.stringify(this._result.json));
  }

  /**
   *
   */
  componentWillLoad() {
    this._config = merge(this._config, this.config);
    this.resUid = GTSLib.guid();
    if ("dark" === this.theme) {
      this.monacoTheme = "vs-dark";
    }
    console.debug("[WarpViewResult] - componentWillLoad", this._result.json);
  }

  buildEditor(json: string) {
    this.loading = true;
    console.debug("[WarpViewResult] - buildEditor", json, this._result.json);
    if (!this.resEd) {
      this.resEd = monaco.editor.create(
        this.el.querySelector("#result-" + this.resUid),
        {
          value: json,
          language: "json",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          theme: this.monacoTheme,
          readOnly: false
        }
      );
    } else {
      this.resEd.setValue(json);
    }
    this.loading = false;
    console.log("[WarpViewResult] - buildEditor end");
  }

  componentDidLoad() {
    console.debug("[WarpViewResult] - componentDidLoad", this._result.json);
    this._result = this.result;
    this.buildEditor(JSON.stringify(this._result.json));
  }

  render() {
    const message =
      this._result.message && this.displayMessages ? (
        <div class={this._config.messageClass}>{this._result.message}</div>
      ) : (
        ""
      );

    const loading = this.loading ? (
      <div class="loader">
        <div class="spinner"/>
      </div>
    ) : (
      ""
    );

    const error =
      this._result.error && this.displayMessages ? (
        <div class={this._config.errorClass}>{this._result.error}</div>
      ) : (
        ""
      );

    const stack =
      this._result.json && GTSLib.isArray(this._result.json) ? (
        <div class={this.theme + " raw"}>
          {this._result.json.map((line, index) => (
            <span class="line">
              <span class="line-num">{index === 0 ? "[TOP]" : index + 1}</span>
              <span class="line-content">{JSON.stringify(line).replace(/,/gi, ', ')}</span>
            </span>
          ))}
        </div>
      ) : (
        "Parsing JSON"
      );

    return (
      <div>
        {message}
        {error}
        <div class={"wrapper " + this.theme}>
          {this._result.json ? (
            <stc-tabs>
              <stc-tab-header slot="header" name="tab1">
                Stack
              </stc-tab-header>
              <stc-tab-header slot="header" name="tab2">
                Raw JSON
              </stc-tab-header>

              <stc-tab-content slot="content" name="tab1">{loading}
                {stack}
              </stc-tab-content>

              <stc-tab-content slot="content" name="tab2">
                <div id={"result-" + this.resUid} class="editor-res"/>
              </stc-tab-content>
            </stc-tabs>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}
