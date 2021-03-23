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

import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  DomSanitizer, SafeHtml
} from '@angular/platform-browser';

import marked, {Renderer} from 'marked';
import highlightjs from 'highlight.js';
import DOMPurify from 'dompurify';

@Component({
  selector: 'warpview-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class MainComponent implements OnInit {
  mdRenderer: any;
  md = `# Warp View Editor

[![npm version](https://badge.fury.io/js/%40senx%2Fwarpview-editor.svg)](https://badge.fury.io/js/%40senx%2Fwarpview-editor) [![Bower version](https://badge.fury.io/bo/senx-warpview-editor.svg)](https://badge.fury.io/bo/senx-warpview-editor)

This [web components](https://fr.wikipedia.org/wiki/Composants_web) embed a WarpScript editor dedicated to [Warp 10™](https://www.warp10.io).

![Warp 10](https://blog.senx.io/wp-content/uploads/2021/03/warp10_bySenx-1.png)

- [licence Apache 2](./LICENSE.md)
- [Contribute](./CONTRIBUTING.md)

## Getting started

npm i @senx/warpview-editor --save

yarn add @senx/warpview-editor

bower install senx-warpview-editor --save

## Usage

\`\`\`html
<html dir="ltr" lang="en">
  <head>
    <title>Test</title>
    <script src="https://unpkg.com/@senx/warpview-editor@x.x.x/elements/warpview-editor.js"></script>
  </head>
  <body>
    <warp-view-editor url="https://warp.senx.io/api/v0/exec" height-line=18 width-px=600 theme="dark" id="editor" show-dataviz="true" horizontal-layout="false" config='{"quickSuggestionsDelay":3000, "suggestOnTriggerCharacters": false}'>
      2 2 +
    </warp-view-editor>
  </body>
</html>
\`\`\`


## CSS vars

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| url | \`string\` | | Warp 10 url, eg: \`https://warp.senx.io/api/v0/exec\` |
| theme | \`string\` | 'light' | Editor theme (\`light\` or \`dark\`) |
| warpscript | \`string\` | '' | WarpScript to edit (optional, could be inside HTML tag) |
| showDataviz | \`boolean\` | false | Display the "Show dataviz" button  |
| showExecute | \`boolean\` | true | Display the "Execute" button  |
| horizontalLayout | \`boolean\` | false | Horizontal or vertical layout  |
| config | \`object\` | default config | Configuration |
| displayMessages | \`boolean\` | true | Displays messages from WarpScript execution |
| widthPx | \`number\` | | Fixed width |
| heightPx | \`number\` | | Fixed height |
| heightLine | \`number\` | | Fixed number of lines |
| imageTab | boolean | false | Display the tab for image results |

## Data format

### Default config

\`\`\`json
{
  "buttons" : {
    "class": ""
  },
  "execButton" : {
    "class": "",
    "label": "Execute"
  },
  "datavizButton" : {
    "class": "",
    "label": "Visualize"
  },
  "hover" : true,
  "readOnly" : false,
  "messageClass" : "",
  "errorClass" : "",
  "editor": {
    "quickSuggestionsDelay": 10,
    "quickSuggestions": true,
    "tabSize": 2,
    "minLineNumber": 10,
    "enableDebug": false
  }
}
\`\`\`

## Events

### warpViewEditorStatusEvent

String execution status :

\`\`\`text
Your script execution took 527.749 ms serverside, fetched 138156 datapoints and performed 21 WarpScript operations.
\`\`\`

### warpViewEditorErrorEvent

String execution error :

\`\`\`text
ERROR line #4 in section '[TOP]': Unknown symbol 'TOKEN2'
\`\`\`

### warpViewEditorWarpscriptChanged

String representation of the WarpScript typed in the editor.

### warpViewEditorWarpscriptResult

Json of the the WarpScript execution result triggered by a click on the execute button.

### warpViewEditorDatavizRequested

Json of the the WarpScript execution result triggered by a click on the dataViz button

`;
  data: SafeHtml;

  static highlightCode(code: string, language: string): string {
    if (!(language && highlightjs.getLanguage(language))) {
      // use 'markdown' as default language
      language = 'markdown';
    }

    let result: string = highlightjs.highlight(language, code).value;
    result = result.split('\n').map((s: string) => {
       let nb = 0;
       while (s[nb] === ' ') {nb++;}
       return '&nbsp;'.repeat(nb) + s.substring(nb);
      }).join('<br>');
    return `<code class="hljs ${language}">${result}</code>`;
  }

  constructor(private sanitizer: DomSanitizer) {
    const renderer = new Renderer();
    renderer.code = MainComponent.highlightCode;

    this.mdRenderer = marked.setOptions({renderer,breaks: true, gfm: true });
  }

  ngOnInit() {
  }

  markdownToSafeHtml(value: string): SafeHtml {
    const html = this.mdRenderer(value);
    const safeHtml = DOMPurify.sanitize(html);
    return this.sanitizer.bypassSecurityTrustHtml(safeHtml);
  }

}
