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
import {WarpScript} from '../../../model/ref';
import {W10CompletionItemProvider} from './W10CompletionItemProvider';
import {EditorUtils} from './editorUtils';
import snippets from '../../../model/snippets/snippets.json';
import {Config} from '../../../model/config';
import CompletionList = languages.CompletionList;
import IReadOnlyModel = editor.IReadOnlyModel;
import CompletionContext = languages.CompletionContext;

export class WSCompletionItemProvider extends W10CompletionItemProvider {

  constructor(config: Config) {
    super(EditorUtils.WARPSCRIPT_LANGUAGE, config);
  }

  transformKeyWord(keyword: string): string {
    return keyword;
  }

  // noinspection JSUnusedLocalSymbols
  provideCompletionItems(model: IReadOnlyModel, position: Position, _context: CompletionContext, token: CancellationToken): Thenable<CompletionList> {
    return super._provideCompletionItems(model, position, _context, token, WarpScript.reference, {...snippets, ...(this.config.snippets || {})});
  }
}
