/**
 * Represents the page initializer.
 */
PhpUnitGen.PageLoader = (function() {
  var self = {};

  var codeEditor;
  var testsEditor;

  /**
   * Initialize the module.
   */
  self.initialize = function() {
    $('.tooltipped').tooltip({delay: 50});
    $('select').material_select();
    $('.modal').modal();

    codeEditor = self.createCodeMirror('code-editor-textarea');
    testsEditor = self.createCodeMirror('tests-editor-textarea');
  };

  /**
   * Create a CodeMirror editor on an identifier.
   *
   * @param {string} identifier The textarea identifier.
   *
   * @return {object} The created CodeMirror editor.
   */
  self.createCodeMirror = function(identifier) {
    return CodeMirror.fromTextArea(document.getElementById(identifier), {
      lineNumbers: true,
      theme: 'monokai',
      mode: 'application/x-httpd-php',
      indentUnit: 4,
      indentWithTabs: false,
      extraKeys: {
        'F11': function(cm) {
          cm.setOption('fullScreen', !cm.getOption('fullScreen'));
        },
        'Ctrl-Enter': function(cm) {
          cm.setOption('fullScreen', !cm.getOption('fullScreen'));
        },
        'Esc': function(cm) {
          if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false);
        }
      }
    });
  };

  self.changeEditorHeight = function(height) {
    codeEditor.setSize(null, height);
    testsEditor.setSize(null, height);
  };

  self.refreshEditors = function() {
    codeEditor.refresh();
    testsEditor.refresh();
  };

  self.resetEditors = function() {
    codeEditor.setValue('');
    testsEditor.setValue('');
  };

  self.getCode = function() {
    codeEditor.getValue();
  };

  self.setTests = function(code) {
    testsEditor.setValue(code);
  };

  return self;
})();