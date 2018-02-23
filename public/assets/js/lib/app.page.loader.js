/**
 * Represents the page initializer.
 */
PhpUnitGen.PageLoader = (function() {
  var self = {};

  var codeEditor;
  var testsEditor;

  var codeEditorContent;

  /**
   * Initialize the module.
   */
  self.initialize = function() {
    $('.tooltipped').tooltip({delay: 50});
    $('select').material_select();
    $('.modal').modal();

    codeEditorContent = '<?php' +
        $(document).find('#code-editor-content').text();

    codeEditor = self.createCodeMirror('code-editor-textarea');
    testsEditor = self.createCodeMirror('tests-editor-textarea');

    self.resetEditors();
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

  /**
   * Change editors height.
   *
   * @param {string} height The new height.
   */
  self.changeEditorHeight = function(height) {
    codeEditor.setSize(null, height);
    testsEditor.setSize(null, height);
  };

  /**
   * Refresh editors.
   */
  self.refreshEditors = function() {
    codeEditor.refresh();
    testsEditor.refresh();
  };

  /**
   * Clear editors content.
   */
  self.resetEditors = function() {
    codeEditor.setValue(codeEditorContent);
    testsEditor.setValue('');
  };

  /**
   * Get the editor code.
   */
  self.getCode = function() {
    return codeEditor.getValue();
  };

  /**
   * Set the code in code editor.
   *
   * @param {string} code The code to set.
   */
  self.setCode = function(code) {
    codeEditor.setValue(code);
  };

  /**
   * Get the tests editor code.
   */
  self.getTests = function() {
    return testsEditor.getValue();
  };

  /**
   * Set the tests code in editor.
   *
   * @param {string} code The code to set.
   */
  self.setTests = function(code) {
    testsEditor.setValue(code);
  };

  return self;
})();