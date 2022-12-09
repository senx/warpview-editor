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

import {CancellationToken, editor, languages, Position, Thenable} from 'monaco-editor';
import CompletionList = languages.CompletionList;
import CompletionItemKind = languages.CompletionItemKind;
import CompletionItemProvider = languages.CompletionItemProvider;
import IReadOnlyModel = editor.IReadOnlyModel;
import CompletionContext = languages.CompletionContext;
import CompletionItem = languages.CompletionItem;
import {Config} from '../../../model/config';

export abstract class W10CompletionItemProvider implements CompletionItemProvider {
  languageId: string;
  config: Config ;

  protected constructor(languageId: string, config: Config) {
    this.languageId = languageId;
    this.config = config;
  }

  abstract provideCompletionItems(model: IReadOnlyModel, position: Position, _context: CompletionContext, token: CancellationToken): Thenable<CompletionList>;

  abstract transformKeyWord(keyword: string): string;

  protected _provideCompletionItems(model: editor.IReadOnlyModel, position: Position, _context: languages.CompletionContext, token: CancellationToken, source: any, snippets: any): Thenable<languages.CompletionList> {
    const defs: CompletionList = {
      suggestions: [],
    };
    source.forEach(f => {
      const item: CompletionItem = {
        label: this.transformKeyWord(f.name),
        insertText: this.transformKeyWord(f.name),
        range: undefined,
        kind: W10CompletionItemProvider.getType(f.tags, f.name)
      };
      defs.suggestions.push(item);
    });
    Object.keys(snippets).forEach(s => {
      const snippet = snippets[s];
      defs.suggestions.push({
        label: snippet.prefix,
        kind: languages.CompletionItemKind.Snippet,
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: snippet.prefix,
        insertText: snippet.body.join('\n')
      } as CompletionItem);
    });

    return Promise.resolve(defs);
  }

  private static getType(tags: string[], name: string): CompletionItemKind {
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
