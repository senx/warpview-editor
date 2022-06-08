/*
 *  Copyright 2020-2022 SenX S.A.S.
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

import {CancellationToken, editor, languages, Position} from 'monaco-editor';
import {globalfunctions as flowsGlobals} from '../../../model/flowsGlobals';
import {W10HoverProvider} from './W10HoverProvider';
import {EditorUtils} from './editorUtils';
import Hover = languages.Hover;
import ProviderResult = languages.ProviderResult;

export class FLoWSHoverProvider extends W10HoverProvider {

  constructor() {
    super(EditorUtils.FLOWS_LANGUAGE);
  }

  provideHover(model: editor.ITextModel, position: Position, token: CancellationToken): ProviderResult<Hover> {
    return super._provideHover(model, position, token, flowsGlobals);
  }
}
