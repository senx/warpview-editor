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

import {WSCompletionItemProvider} from './WSCompletionItemProvider';
import {languages, Uri} from 'monaco-editor';
import {Monarch} from '../../../lib/monarch';
import {WSLanguageConfiguration} from './WSLanguageConfiguration';
import registerCompletionItemProvider = languages.registerCompletionItemProvider;
import setMonarchTokensProvider = languages.setMonarchTokensProvider;
import getLanguages = languages.getLanguages;
import register = languages.register;
import setLanguageConfiguration = languages.setLanguageConfiguration;
import registerHoverProvider = languages.registerHoverProvider;
import {WSHoverProvider} from './WSHoverProvider';

export class ProviderRegistrar {
  static WARPSCRIPT_LANGUAGE: string = 'warpscript';

  static register() {
    if (!getLanguages().find(l => l.id === ProviderRegistrar.WARPSCRIPT_LANGUAGE)) {
      register({id: ProviderRegistrar.WARPSCRIPT_LANGUAGE});
      setLanguageConfiguration(ProviderRegistrar.WARPSCRIPT_LANGUAGE, WSLanguageConfiguration.getConfiguration(ProviderRegistrar.WARPSCRIPT_LANGUAGE));
      setMonarchTokensProvider(ProviderRegistrar.WARPSCRIPT_LANGUAGE, Monarch.rules);
      registerCompletionItemProvider(ProviderRegistrar.WARPSCRIPT_LANGUAGE, new WSCompletionItemProvider(ProviderRegistrar.WARPSCRIPT_LANGUAGE));
      registerHoverProvider(ProviderRegistrar.WARPSCRIPT_LANGUAGE, new WSHoverProvider(ProviderRegistrar.WARPSCRIPT_LANGUAGE));
    }
  }
}
