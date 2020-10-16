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

import {WSCompletionItemProvider} from './WSCompletionItemProvider';
import {languages} from 'monaco-editor';
import {Monarch} from '../../../model/monarch';
import {WSLanguageConfiguration} from './WSLanguageConfiguration';
import {WSHoverProvider} from './WSHoverProvider';
import {FLoWSCompletionItemProvider} from './FLoWSCompletionItemProvider';
import {FLoWSHoverProvider} from './FLoWSHoverProvider';
import {FLoWSLanguageConfiguration} from './FLoWSLanguageConfiguration';
import {EditorUtils} from './editorUtils';
import registerCompletionItemProvider = languages.registerCompletionItemProvider;
import setMonarchTokensProvider = languages.setMonarchTokensProvider;
import getLanguages = languages.getLanguages;
import register = languages.register;
import setLanguageConfiguration = languages.setLanguageConfiguration;
import registerHoverProvider = languages.registerHoverProvider;
import {MonarchFlows} from '../../../model/monarchFlows';

export class ProviderRegistrar {

  static register() {
    // WarpScript
    if (!getLanguages().find(l => l.id === EditorUtils.WARPSCRIPT_LANGUAGE)) {
      register({id: EditorUtils.WARPSCRIPT_LANGUAGE});
      setLanguageConfiguration(EditorUtils.WARPSCRIPT_LANGUAGE, new WSLanguageConfiguration().getConfiguration());
      setMonarchTokensProvider(EditorUtils.WARPSCRIPT_LANGUAGE, Monarch.rules);
      registerCompletionItemProvider(EditorUtils.WARPSCRIPT_LANGUAGE, new WSCompletionItemProvider());
      registerHoverProvider(EditorUtils.WARPSCRIPT_LANGUAGE, new WSHoverProvider());
    }
    // Flows
    if (!getLanguages().find(l => l.id === EditorUtils.FLOWS_LANGUAGE)) {
      register({id: EditorUtils.FLOWS_LANGUAGE});
      setLanguageConfiguration(EditorUtils.FLOWS_LANGUAGE, new FLoWSLanguageConfiguration().getConfiguration());
      setMonarchTokensProvider(EditorUtils.FLOWS_LANGUAGE, MonarchFlows.rules);
      registerCompletionItemProvider(EditorUtils.FLOWS_LANGUAGE, new FLoWSCompletionItemProvider());
      registerHoverProvider(EditorUtils.FLOWS_LANGUAGE, new FLoWSHoverProvider());
    }
  }
}
