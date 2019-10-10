/*
 *  Copyright 2019  SenX S.A.S.
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




/**
 * Parsing result of // @command parameter  in the beginning of the WarpScript
 */
export interface specialCommentCommands {
  endpoint?: string;
  timeunit?: string;
  localmacrosubstitution?: boolean,
  displayPreviewOpt?: string
}


/**
 * This is a simplified warpScriptParser, from the one used is VSCode WarpScript extension.
 *  
 */
export default class WarpScriptParser {

  

  /**
   * Unlike parseWarpScriptMacros, this function return a very simple list of statements (as strings), ignoring comments. 
   * [ '"HELLO"' '"WORLD"' '+' '2' '2' '*' ]
   */
  public static parseWarpScriptStatements(ws: String): string[] {

    let i: number = 0;
    let result: string[] = [];

    while (i < ws.length - 1 ) { //often test 2 characters
      if (ws.charAt(i) == '<' && ws.charAt(i + 1) == "'") { //start of a multiline, look for end
        // console.log(i, 'start of multiline');
        let lines: string[] = ws.substring(i, ws.length).split('\n');
        let lc = 0;
        while (lc < lines.length && lines[lc].trim() != "'>") { i += lines[lc].length + 1; lc++; }
        i += lines[lc].length + 1;
        // console.log(i, 'end of multiline');
      }
      if (ws.charAt(i) == '/' && ws.charAt(i + 1) == '*') { //start one multiline comment, seek for end of comment
        // console.log(i, 'start of multiline comment');
        i++;
        while (i < ws.length - 1 && !(ws.charAt(i) == '*' && ws.charAt(i + 1) == '/')) { i++; }
        i += 2;
        // console.log(i, 'end of multiline comment');
      }
      if (ws.charAt(i) == '/' && ws.charAt(i + 1) == '/') { //start single line comment, seek for end of line
        // console.log(i, 'start of a comment');
        i++;
        while (i < ws.length - 1 && (ws.charAt(i) != '\n')) { i++; }
        // console.log(i, 'end of a comment');
      }

      if (ws.charAt(i) == "'") { //start of string, seek for end
        // console.log(i, 'start of string');
        let start = i;
        i++;
        while (i < ws.length && ws.charAt(i) != "'" && ws.charAt(i) != '\n') { i++; }
        i++;
        result.push(ws.substring(start, i));
        // console.log(i, 'end of string');
      }
      if (ws.charAt(i) == '"') { //start of string, seek for end
        // console.log(i, 'start of string');
        let start = i;
        i++;
        while (i < ws.length && ws.charAt(i) != '"' && ws.charAt(i) != '\n') { i++; }
        // console.log(i, 'end of string');
        i++;
        result.push(ws.substring(start, i));
      }

      if (ws.charAt(i) == '<' && ws.charAt(i + 1) == '%') { //start of a macro.
        // console.log(i, 'start of macro');
        result.push("<%");
        i += 2;
      }

      if (ws.charAt(i) == '%' && ws.charAt(i + 1) == '>') { //end of a macro.
        // console.log(i, 'end of macro');
        result.push("%>");
        i += 2;
      }

      if (ws.charAt(i) != ' ' && ws.charAt(i) != '\n') {
        let start = i;
        while (i < ws.length && ws.charAt(i) != ' ' && ws.charAt(i) != '\n') { i++; }
        result.push(ws.substring(start, i));
      }
      i++;
    }

    return result;
  }


  public static extractSpecialComments(executedWarpScript: string): specialCommentCommands {
    let result: specialCommentCommands = {};
    let warpscriptlines = executedWarpScript.split('\n');
    for (let l = 0; l < warpscriptlines.length; l++) {
      let currentline = warpscriptlines[l];
      if (currentline.startsWith("//")) {
        //find and extract // @paramname parameters
        let extraparamsPattern = /\/\/\s*@(\w*)\s*(.*)$/g;
        let lineonMatch: RegExpMatchArray | null;
        let re = RegExp(extraparamsPattern);
        while (lineonMatch = re.exec(currentline.replace('\r', ''))) {  //think about windows... \r\n in mc2 files !
          let parametername = lineonMatch[1];
          let parametervalue = lineonMatch[2];
          switch (parametername) {
            case "endpoint":        //        // @endpoint http://mywarp10server/api/v0/exec
              result.endpoint = parametervalue;   // overrides the Warp10URL configuration
              break;
            case "localmacrosubstitution":
              result.localmacrosubstitution = ("true" === parametervalue.toLowerCase());   // overrides the substitutionWithLocalMacros
              break;
            case "timeunit":
              if (['us', 'ms', 'ns'].indexOf(parametervalue.trim()) > -1) {
                result.timeunit = parametervalue.trim();
              }
              break;
            case "preview":
              switch (parametervalue.toLowerCase().substr(0, 4)) {
                case "none": result.displayPreviewOpt = 'X'; break;
                case "gts": result.displayPreviewOpt = 'G'; break;
                case "imag": result.displayPreviewOpt = 'I'; break;
                default: result.displayPreviewOpt = ''; break;
              }
              break;
            default:
              break;
          }
        }
      }
      else {
        if (l > 0) { break; } //no more comments at the beginning of the file. two first lines could be empty
      }
    }
    return result;
  }
}