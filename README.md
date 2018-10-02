# Warp View Editor

This [web components](https://fr.wikipedia.org/wiki/Composants_web) embed a WarpScript editor dedicated to [Warp 10™](https://www.warp10.io).

- [licence Apache 2](./LICENSE.md)
- [Contribute](./CONTRIBUTING.md)

## Usage

```html
<html>
<head>
  <title>Test</title>
  <script src="warp-view-editor.js"></script>
</head>
<body>
  <warp-view-editor url="https://warp.cityzendata.net/api/v0/exec" height-line=18 width-px=600 theme="dark" id="editor" show-dataviz="true" horizontal-layout="false" config='{"quickSuggestionsDelay":3000, "suggestOnTriggerCharacters": false}'
    >
      2 2 +
    </warp-view-editor>
</body>
</html>
```

## Integrations

[See here](https://stenciljs.com/docs/framework-integration)


## CSS vars

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| url | `string` | | Warp 10 url, eg: `https://warp.cityzendata.net/api/v0/exec` |
| theme | `string` | 'light' | Editor theme (`light` or `dark`) |
| warpscript | `string` | '' | WarpScript to edit (optional, could be inside HTML tag) |
| showDataviz | `boolean` | false | Display the "Show dataviz" button  |
| horizontalLayout | `boolean` | false | Horizontal or vertical layout  |
| config | `object` | default config | Configuration |
| displayMessages | `boolean` | true | Displays messages from WarpScript execution |
| widthPx | `number` | | Fixed width |
| heightPx | `number` | | Fixed height |
| heightLine | `number` | | Fixed number of lines |

## Data format

### Default config

```json
{
  "execButton": {
    "class": "",
    "label": "Execute"
  },
  "datavizButton": {
    "class": "",
    "label": "Visualize"
  },
  "editor": {
    "quickSuggestionsDelay": 10,
    "quickSuggestions": true
  }
}
```

## Events

### statusEvent

String execution status :

```text
Your script execution took 527.749 ms serverside, fetched 138156 datapoints and performed 21 WarpScript operations.
```

### errorEvent

String execution error :

```text
ERROR line #4 in section '[TOP]': Unknown symbol 'TOKEN2'
```

### warpscriptChanged

String representation of the WarpScript typed in the editor.

### warpscriptResult

Json of the the WarpScript execution result triggered by a click on the execute button.

### datavizRequested

Json of the the WarpScript execution result triggered by a click on the dataViz button

