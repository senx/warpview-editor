
var StcTabContentComponent = /** @class **/ (function() {
  function StcTabContent() {
  }
  StcTabContent.is = 'stc-tab-content';
  StcTabContent.getModule = function(opts) {
    
    return import('./thvo5sau.js').then(function(m) {
        return m.StcTabContent;
      });

  }
});

var StcTabHeaderComponent = /** @class **/ (function() {
  function StcTabHeader() {
  }
  StcTabHeader.is = 'stc-tab-header';
  StcTabHeader.getModule = function(opts) {
    
    return import('./thvo5sau.js').then(function(m) {
        return m.StcTabHeader;
      });

  }
});

var StcTabsComponent = /** @class **/ (function() {
  function StcTabs() {
  }
  StcTabs.is = 'stc-tabs';
  StcTabs.getModule = function(opts) {
    
    return import('./thvo5sau.js').then(function(m) {
        return m.StcTabs;
      });

  }
});

var WarpViewEditorComponent = /** @class **/ (function() {
  function WarpViewEditor() {
  }
  WarpViewEditor.is = 'warp-view-editor';
  WarpViewEditor.getModule = function(opts) {
    
    return import('./thvo5sau.js').then(function(m) {
        return m.WarpViewEditor;
      });

  }
});

var WarpViewResultComponent = /** @class **/ (function() {
  function WarpViewResult() {
  }
  WarpViewResult.is = 'warp-view-result';
  WarpViewResult.getModule = function(opts) {
    
    return import('./thvo5sau.js').then(function(m) {
        return m.WarpViewResult;
      });

  }
});

export {
  
  StcTabContent,
  StcTabHeader,
  StcTabs,
  WarpViewEditor,
  WarpViewResult,
};
  