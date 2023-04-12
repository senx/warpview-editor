/*
 *  Copyright 2020-2023 SenX S.A.S.
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
import {Range} from 'monaco-editor';

/**
 * Parsing result of // @command parameter  in the beginning of the WarpScript
 */
export interface specialCommentCommands {
  endpoint?: string;
  timeunit?: string;
  localmacrosubstitution?: boolean;
  displayPreviewOpt?: string;
  listOfMacroInclusion?: string[];
  listOfMacroInclusionRange?: Range[];
  theme?: string;
}

/**
 * Little class to store statement and its offset in the text
 */
export class wsStatement {
  public statement: string;
  public offset: number;

  constructor(statement: string, offset: number) {
    this.statement = statement;
    this.offset = offset;
  }
}

export class WarpScriptParser {

  /**
   * Look for a statement position in the recursive tree of macros markers.
   *
   * @param macroPositions the table of macro positions (output of parseWarpScriptMacros)
   * @param offset the absolute position of the start of statement you are looking for
   * @param numberOfMacros the expected number of macros
   */
  public static findMacrosBeforePosition(macroPositions: any, offset: number, numberOfMacros: number): any[] {

    for (let idx = 0; idx < macroPositions.length; idx++) {
      if (macroPositions[idx] instanceof wsStatement && (macroPositions[idx] as wsStatement).offset == offset) {
        //found the statement. need to return previous macros as ranges
        let pidx = idx - 1;
        let c = 0;
        let startEndList: any[] = [];
        while (pidx >= 0 && c < numberOfMacros) {
          if (macroPositions[pidx] instanceof wsStatement) {
            break;
          } else {
            if (typeof (macroPositions[pidx]) !== 'number') {
              startEndList.push([macroPositions[pidx][0], macroPositions[pidx][macroPositions[pidx].length - 1]]);
              c++;
            }
          }
          pidx--;
        }
        return startEndList;
      } else if (typeof (macroPositions[idx]) === 'number') {
        // console.log("not in this block")
      } else {
        let r = this.findMacrosBeforePosition(macroPositions[idx], offset, numberOfMacros);
        if (null !== r) {
          return r;
        }
      }

    }
    return null;
  }

  /**
   * Unlike parseWarpScriptMacros, this function return a very simple list of statements (as strings), ignoring comments.
   * [ '"HELLO"' '"WORLD"' '+' '2' '2' '*' ]
   *
   * When called with withPosition true, it returns a list of list than include start and end position of the statement:
   * [ [ '"HELLO"' 4 11 ] [ '"WORLD"' 22 29 ]  ]
   */
  public static parseWarpScriptStatements(ws: String, withPosition = false): any[] {

    let i: number = 0;
    let result: any[] = [];

    while (i < ws.length - 1) { //often test 2 characters
      if (ws.charAt(i) == '<' && ws.charAt(i + 1) == '\'') { //start of a multiline, look for end
        // console.log(i, 'start of multiline');
        let lines: string[] = ws.substring(i, ws.length).split('\n');
        let lc = 0;
        while (lc < lines.length && lines[lc].trim() != '\'>') {
          i += lines[lc].length + 1;
          lc++;
        }
        i += lines[lc].length + 1;
        // console.log(i, 'end of multiline');
      }
      if (ws.charAt(i) == '/' && ws.charAt(i + 1) == '*') { //start one multiline comment, seek for end of comment
        // console.log(i, 'start of multiline comment');
        i++;
        while (i < ws.length - 1 && !(ws.charAt(i) == '*' && ws.charAt(i + 1) == '/')) {
          i++;
        }
        i += 2;
        // console.log(i, 'end of multiline comment');
      }
      if (ws.charAt(i) == '/' && ws.charAt(i + 1) == '/') { //start single line comment, seek for end of line
        // console.log(i, 'start of a comment');
        i++;
        while (i < ws.length - 1 && (ws.charAt(i) != '\n')) {
          i++;
        }
        // console.log(i, 'end of a comment');
      }

      if (ws.charAt(i) == '\'') { //start of string, seek for end
        // console.log(i, 'start of string');
        let start = i;
        i++;
        while (i < ws.length && ws.charAt(i) != '\'' && ws.charAt(i) != '\n') {
          i++;
        }
        i++;
        result.push(ws.substring(start, i).replace('\r', ''));
        // console.log(i, 'end of string');
      }
      if (ws.charAt(i) == '"') { //start of string, seek for end
        // console.log(i, 'start of string');
        let start = i;
        i++;
        while (i < ws.length && ws.charAt(i) != '"' && ws.charAt(i) != '\n') {
          i++;
        }
        // console.log(i, 'end of string');
        i++;
        result.push(ws.substring(start, i).replace('\r', ''));
      }

      if (ws.charAt(i) == '<' && ws.charAt(i + 1) == '%') { //start of a macro.
        // console.log(i, 'start of macro');
        result.push('<%');
        i += 2;
      }

      if (ws.charAt(i) == '%' && ws.charAt(i + 1) == '>') { //end of a macro.
        // console.log(i, 'end of macro');
        result.push('%>');
        i += 2;
      }

      if (ws.charAt(i) != ' ' && ws.charAt(i) != '\n') {
        let start = i;
        while (i < ws.length && ws.charAt(i) != ' ' && ws.charAt(i) != '\n') {
          i++;
        }
        if (withPosition) {
          result.push([ws.substring(start, i).replace('\r', ''), start, i]);
        } else {
          result.push(ws.substring(start, i).replace('\r', ''));
        }
      }
      i++;
    }

    return result;
  }

  public static extractSpecialComments(executedWarpScript: string): specialCommentCommands {
    let result: specialCommentCommands = {};
    let warpscriptlines = executedWarpScript.split('\n');
    result.listOfMacroInclusion = [];
    result.listOfMacroInclusionRange = [];
    for (let l = 0; l < warpscriptlines.length; l++) {
      let currentline = warpscriptlines[l];
      if (currentline.startsWith('//')) {
        //find and extract // @paramname parameters
        let extraparamsPattern = /\/\/\s*@(\w*)\s*(.*)$/g;
        let lineonMatch: RegExpMatchArray | null;
        let re = RegExp(extraparamsPattern);
        while (lineonMatch = re.exec(currentline.replace('\r', ''))) {  //think about windows... \r\n in mc2 files !
          let parametername = lineonMatch[1];
          let parametervalue = lineonMatch[2];
          switch (parametername) {
            case 'endpoint':        //        // @endpoint http://mywarp10server/api/v0/exec
              result.endpoint = parametervalue;   // overrides the Warp10URL configuration
              break;
            case 'localmacrosubstitution':
              result.localmacrosubstitution = ('true' === parametervalue.trim().toLowerCase());   // overrides the substitutionWithLocalMacros
              break;
            case 'timeunit':
              if (['us', 'ms', 'ns'].indexOf(parametervalue.trim()) > -1) {
                result.timeunit = parametervalue.trim();
              }
              break;
            case 'preview':
              switch (parametervalue.toLowerCase().substring(0, 4)) {
                case 'none':
                  result.displayPreviewOpt = 'X';
                  break;
                case 'gts':
                  result.displayPreviewOpt = 'G';
                  break;
                case 'imag':
                  result.displayPreviewOpt = 'I';
                  break;
                case 'json':
                  result.displayPreviewOpt = 'J';
                  break;
                case 'disc':
                  result.displayPreviewOpt = 'D';
                  break;
                default:
                  result.displayPreviewOpt = '';
                  break;
              }
              break;
            case 'include':
              let p = parametervalue.trim();
              if (p.startsWith('macro:')) {
                p = p.substring(6).trim();
                result.listOfMacroInclusion.push(p);
                let r = new Range(l, 3, l, currentline.trim().length);
                result.listOfMacroInclusionRange.push(r);
              }
              break;
            case 'theme':
              result.theme = parametervalue.trim().toLowerCase();
              break;
            default:
              break;
          }
        }
      } else {
        if (currentline.trim().length > 0) {
          break; //no more comments at the beginning of the file
        }
      }
    }
    return result;
  }

  public static IsWsLitteralString(s: String): boolean {
    // up to MemoryWarpScriptStack, a valid string is:
    return (s.length >= 2 && ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith('\'') && s.endsWith('\''))));
  }

}
