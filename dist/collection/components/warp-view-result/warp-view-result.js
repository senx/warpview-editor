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
import monaco from "@timkendrick/monaco-editor";
import { GTSLib } from "../../gts.lib";
import { Utils } from "../../lib/utils";
export class WarpViewResult {
    constructor() {
        this.result = { json: [], error: '', message: '' };
        this.theme = "light";
        this.config = {};
        this.displayMessages = true;
        this.loading = false;
        this._result = { json: [], error: '', message: '' };
        this._config = {
            messageClass: '',
            errorClass: ''
        };
        this.monacoTheme = 'vs';
    }
    themeHandler(newValue, _oldValue) {
        console.log("[WarpViewResult] - The new value of theme is: ", newValue, _oldValue);
        if ("dark" === newValue) {
            this.monacoTheme = "vs-dark";
        }
        else {
            this.monacoTheme = "vs";
        }
        console.log("[WarpViewResult] - The new value of theme is: ", this.monacoTheme);
        monaco.editor.setTheme(this.monacoTheme);
    }
    resultHandler(newValue, _oldValue) {
        console.log("[WarpViewResult] - The new value of result is: ", newValue, _oldValue);
        this._result = newValue;
        this.buildEditor(JSON.stringify(this._result.json));
    }
    /**
     *
     */
    componentWillLoad() {
        this._config = Utils.mergeDeep(this._config, this.config);
        this.resUid = GTSLib.guid();
        if ("dark" === this.theme) {
            this.monacoTheme = "vs-dark";
        }
        console.debug("[WarpViewResult] - componentWillLoad", this._result.json);
    }
    buildEditor(json) {
        this.loading = true;
        console.debug("[WarpViewResult] - buildEditor", json, this._result.json);
        if (!this.resEd) {
            this.resEd = monaco.editor.create(this.el.querySelector("#result-" + this.resUid), {
                value: json,
                language: "json",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                theme: this.monacoTheme,
                readOnly: false
            });
        }
        else {
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
        const message = this._result.message && this.displayMessages ? (h("div", { class: this._config.messageClass }, this._result.message)) : ("");
        const loading = this.loading ? (h("div", { class: "loader" },
            h("div", { class: "spinner" }))) : ("");
        const error = this._result.error && this.displayMessages ? (h("div", { class: this._config.errorClass }, this._result.error)) : ("");
        const stack = this._result.json && GTSLib.isArray(this._result.json) ? (h("div", { class: this.theme + " raw" }, this._result.json.map((line, index) => (h("span", { class: "line" },
            h("span", { class: "line-num" }, index === 0 ? "[TOP]" : index + 1),
            h("span", { class: "line-content" }, JSON.stringify(line).replace(/,/gi, ', '))))))) : ("Parsing JSON");
        return (h("div", null,
            message,
            error,
            h("div", { class: "wrapper " + this.theme }, this._result.json ? (h("stc-tabs", null,
                h("stc-tab-header", { slot: "header", name: "tab1" }, "Stack"),
                h("stc-tab-header", { slot: "header", name: "tab2" }, "Raw JSON"),
                h("stc-tab-content", { slot: "content", name: "tab1" },
                    loading,
                    stack),
                h("stc-tab-content", { slot: "content", name: "tab2" },
                    h("div", { id: "result-" + this.resUid, class: "editor-res" })))) : (""))));
    }
    static get is() { return "warp-view-result"; }
    static get properties() { return {
        "config": {
            "type": "Any",
            "attr": "config"
        },
        "displayMessages": {
            "type": Boolean,
            "attr": "display-messages"
        },
        "el": {
            "elementRef": true
        },
        "loading": {
            "state": true
        },
        "result": {
            "type": "Any",
            "attr": "result",
            "watchCallbacks": ["resultHandler"]
        },
        "theme": {
            "type": String,
            "attr": "theme",
            "watchCallbacks": ["themeHandler"]
        }
    }; }
    static get style() { return "/**style-placeholder:warp-view-result:**/"; }
}
