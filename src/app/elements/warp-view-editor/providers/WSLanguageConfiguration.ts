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


import {languages} from 'monaco-editor';
import IndentAction = languages.IndentAction;

export class WSLanguageConfiguration {
  static getConfiguration(languageId: string): languages.LanguageConfiguration {
    return {
      wordPattern: /[^\s\t]+/,
      comments: {
        lineComment: '//',
        blockComment: ['/**', '*/'],
      },
      brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
        ['<%', '%>'],
        ['<\'', '\'>'],
        ['[[', ']]'],
      ],
      autoClosingPairs: [
        {open: '{', close: '}'},
        {open: '[', close: ']'},
        {open: '(', close: ')'},
        {open: '<%', close: '%>'},
        {open: '[[', close: ']]'},
        {open: ' \'', close: '\'', notIn: ['string', 'comment']},
        {open: '<\'', close: '\'>'},
        {open: '"', close: '"', notIn: ['string']},
        {open: '`', close: '`', notIn: ['string', 'comment']},
        {open: '/**', close: ' */', notIn: ['string']},
      ],
      surroundingPairs: [
        {open: '{', close: '}'},
        {open: '[', close: ']'},
        {open: '(', close: ')'},
        {open: '[[', close: ']]'},
        {open: '<%', close: '%>'},
        {open: '<\'', close: '\'>'},
        {open: '\'', close: '\''},
        {open: '"', close: '"'},
        {open: '`', close: '`'},
      ],
      onEnterRules: [
        {
          // e.g. /** | */
          beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
          afterText: /^\s*\*\/$/,
          action: {indentAction: IndentAction.IndentOutdent, appendText: ' * '},
        },
        {
          // e.g. /** ...|
          beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
          action: {indentAction: IndentAction.None, appendText: ' * '},
        },
        {
          // e.g.  * ...|
          beforeText: /^(\t|( {2}))* \*( ([^*]|\*(?!\/))*)?$/,
          action: {indentAction: IndentAction.None, appendText: '* '},
        },
        {
          // e.g.  */|
          beforeText: /^(\t|( {2}))* \*\/\s*$/,
          action: {indentAction: IndentAction.None, removeText: 1},
        },
      ],
    };
  }
}
