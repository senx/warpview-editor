import {ButtonConfig} from "./buttonConfig";
import {EditorConfig} from "./editorConfig";

export class Config {
  execButton: ButtonConfig = {
    class: '',
    label: 'Execute'
  };
  datavizButton: ButtonConfig = {
    class: '',
    label: 'Visualize'
  };
  hover: boolean = true;
  readOnly: boolean = false;
  editor: EditorConfig = {
    quickSuggestionsDelay: 10,
    quickSuggestions: true
  };
}
