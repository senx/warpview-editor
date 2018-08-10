
var QuantumEditorComponent = /** @class **/ (function() {
  function QuantumEditor() {
  }
  QuantumEditor.is = 'quantum-editor';
  QuantumEditor.getModule = function(opts) {
    
    return import('./mh3futlq.js').then(function(m) {
        return m.QuantumEditor;
      });

  }
});

var QuantumResultComponent = /** @class **/ (function() {
  function QuantumResult() {
  }
  QuantumResult.is = 'quantum-result';
  QuantumResult.getModule = function(opts) {
    
    return import('./mh3futlq.js').then(function(m) {
        return m.QuantumResult;
      });

  }
});

var StcTabContentComponent = /** @class **/ (function() {
  function StcTabContent() {
  }
  StcTabContent.is = 'stc-tab-content';
  StcTabContent.getModule = function(opts) {
    
    return import('./mh3futlq.js').then(function(m) {
        return m.StcTabContent;
      });

  }
});

var StcTabHeaderComponent = /** @class **/ (function() {
  function StcTabHeader() {
  }
  StcTabHeader.is = 'stc-tab-header';
  StcTabHeader.getModule = function(opts) {
    
    return import('./mh3futlq.js').then(function(m) {
        return m.StcTabHeader;
      });

  }
});

var StcTabsComponent = /** @class **/ (function() {
  function StcTabs() {
  }
  StcTabs.is = 'stc-tabs';
  StcTabs.getModule = function(opts) {
    
    return import('./mh3futlq.js').then(function(m) {
        return m.StcTabs;
      });

  }
});

export {
  
  QuantumEditor,
  QuantumResult,
  StcTabContent,
  StcTabHeader,
  StcTabs,
};
  