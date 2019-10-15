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

import {CancellationToken, editor, languages, Position, Thenable} from 'monaco-editor';
import {WarpScript} from '../../../lib/ref';
import CompletionList = languages.CompletionList;
import CompletionItemKind = languages.CompletionItemKind;
import CompletionItemProvider = languages.CompletionItemProvider;
import IReadOnlyModel = editor.IReadOnlyModel;
import CompletionContext = languages.CompletionContext;
import CompletionItem = languages.CompletionItem;

export class WSCompletionItemProvider implements CompletionItemProvider {
  languageId: string;

  constructor(languageId: string) {
    this.languageId = languageId;
  }

  provideCompletionItems(model: IReadOnlyModel, position: Position, _context: CompletionContext, token: CancellationToken): Thenable<CompletionList> {
    const defs: CompletionList = {
      suggestions: [],
    };
    WarpScript.reference.forEach(f => {
      const item: CompletionItem = {
        label: f.name,
        insertText: f.name,
        range: undefined,
        kind: this.getType(f.tags, f.name)
      };
      defs.suggestions.push(item);
    });
    return Promise.resolve(defs);
  }

  getType(tags: string[], name: string): CompletionItemKind {
    const t = tags.join(' ');
    if (t.indexOf('constant') > -1) {
      return CompletionItemKind.Enum;
    } else if (t.indexOf('reducer') > -1 && name !== 'REDUCE') {
      return CompletionItemKind.Interface;
    } else if (t.indexOf('mapper') > -1 && name !== 'MAP') {
      return CompletionItemKind.Interface;
    } else if (t.indexOf('bucketize') > -1 && name !== 'BUCKETIZE') {
      return CompletionItemKind.Interface;
    } else if (t.indexOf('filter') > -1 && name !== 'FILTER') {
      return CompletionItemKind.Interface;
    } else if (t.indexOf('control') > -1) {
      return CompletionItemKind.Keyword;
    } else if (t.indexOf('operators') > -1) {
      return CompletionItemKind.Method;
    } else if (t.indexOf('stack') > -1) {
      return CompletionItemKind.Module;
    } else {
      return CompletionItemKind.Function;
    }
  }
}
