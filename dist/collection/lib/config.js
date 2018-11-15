export class Config {
    constructor() {
        this.execButton = {
            class: '',
            label: 'Execute'
        };
        this.datavizButton = {
            class: '',
            label: 'Visualize'
        };
        this.hover = true;
        this.readOnly = false;
        this.editor = {
            quickSuggestionsDelay: 10,
            quickSuggestions: true
        };
    }
}
