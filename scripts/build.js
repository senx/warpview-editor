/*
 *  Copyright 2020  SenX S.A.S.
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
 *
 */
const sass = require('sass');
const fs = require('fs');
const concat = require('concat');
(async function build() {
  const files = [
    './scripts/loader.js',
    './node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
    './dist/warpview-editor/elements/main.js'
  ].concat(
    fs.readdirSync('./dist/warpview-editor/elements/')
      .filter(f => f.startsWith('projects') || f.startsWith('vendors'))
      .map(f => './dist/warpview-editor/elements/' +f)
  );
  const css = [
    './dist/warpview-editor/elements/warpview-editor-elements.css',
    './projects/warpview-editor-ng/node_modules/monaco-editor/dev/vs/editor/editor.main.css'
  ];

  await concat(files, './dist/warpview-editor/elements/warpview-editor-elements.js');
  sass.render({
    file: './projects/warpview-editor-ng/src/styles.scss',
    outFile: './dist/warpview-editor/elements/warpview-editor-elements.css',
    outputStyle: 'compressed'
  },  (err, result) => {
    if (!err) {
      let compiledScssCode = result.css.toString();
      // remove comments from the css output
      compiledScssCode = compiledScssCode.replace(/\/\*[^*]*\*+([^\/][^*]*\*+)*\//gi, '');
      fs.writeFileSync('./dist/warpview-editor/elements/warpview-editor-elements.css', compiledScssCode);
      concat(css, './dist/warpview-editor/elements/warpview-editor-elements.css');
    }
  });
})();
