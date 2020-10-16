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

import {CancellationToken, editor, IMarkdownString, languages, Position, Range} from 'monaco-editor';
import HoverProvider = languages.HoverProvider;
import Hover = languages.Hover;
import ProviderResult = languages.ProviderResult;

export abstract class W10HoverProvider implements HoverProvider {
  languageId: string;

  constructor(languageId: string) {
    this.languageId = languageId;
  }

  abstract provideHover(model: editor.ITextModel, position: Position, token: CancellationToken): languages.ProviderResult<languages.Hover>;

  // noinspection JSUnusedLocalSymbols
  _provideHover(model: editor.ITextModel, position: Position, token: CancellationToken, provider: any): ProviderResult<Hover> {
    const word = model.getWordAtPosition(position);
    if (!!word) {
      const range = new Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn);
      const name = word.word;
      const entry = provider[name];
      if (entry && entry.description) {
        const signature = (entry.signature || '').split('\n').map(s => '+ ' + s).join('\n');
        const contents: IMarkdownString[] = [
          {value: '### ' + name},
          {value: signature},
          {value: entry.description.replace(/(\/doc\/\w+)/g, x => `https://www.warp10.io${x}`)}
        ];
        return {range, contents: W10HoverProvider.toMarkedStringArray(contents)} as Hover;
      }
    }
    return undefined;
  }

  protected static toMarkedStringArray(contents: IMarkdownString[]): IMarkdownString[] {
    if (!contents) {
      return void 0;
    }
    if (Array.isArray(contents)) {
      return contents.map(W10HoverProvider.toMarkdownString);
    }
    return [W10HoverProvider.toMarkdownString(contents)];
  }

  private static toMarkdownString(entry: IMarkdownString): IMarkdownString {
    if (typeof entry === 'string') {
      return {value: entry};
    }
    return {value: entry.value};
  }
}
