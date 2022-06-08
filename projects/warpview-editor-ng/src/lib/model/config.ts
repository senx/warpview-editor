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

import {ButtonConfig} from './buttonConfig';
import {EditorConfig} from './editorConfig';

export class Config {
  buttons?: ButtonConfig = {
    class: ''
  };
  execButton?: ButtonConfig = {
    class: '',
    label: 'Execute'
  };
  datavizButton?: ButtonConfig = {
    class: '',
    label: 'Visualize'
  };
  hover? = true;
  readOnly? = false;
  messageClass? = '';
  errorClass? = '';
  addLocalHeader? = false;
  httpHeaders?: { [key: string]: string; };
  editor: EditorConfig = {
    quickSuggestionsDelay: 10,
    quickSuggestions: true,
    tabSize: 2,
    minLineNumber: 10,
    enableDebug: false,
    rawResultsReadOnly: false
  };
  codeReview?: {
    enabled: boolean,
    readonly? : boolean,
    currentUser?: string,
    cancelButton?: ButtonConfig,
    addButton?: ButtonConfig,
    replyButton?: ButtonConfig,
    removeButton?: ButtonConfig,
    editButton?: ButtonConfig
  } = {
    enabled: false,
    readonly: false,
    cancelButton: {
      class: '',
      label: 'Cancel'
    },
    addButton: {
      class: '',
      label: 'Add comment'
    },
    replyButton: {
      label: 'Reply'
    },
    removeButton: {
      label: 'Remove'
    },
    editButton: {
      label: 'Edit'
    }
  };
}
