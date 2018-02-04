/**
 * Represents editors listening.
 */
PhpUnitGen.EditorListener = (function() {
  var self = {};

  /**
   * Initialize the module.
   */
  self.initialize = function() {
    $(document).find('#btn-generate').on('click', function() {
      PhpUnitGen.Request.invokePhpUnitGen('code-editor');
    });
    $(document).find('input[name="file"]').on('change', function() {
      var files = $(this).prop('files');
      if (0 in files) {
        var file = files[0];
        var name = file.name.replace(/\.[^/.]+$/, '');
        var fileReader = new FileReader();
        fileReader.onload = function () {
          $(document).find('input[name="name"]').val(name);
          PhpUnitGen.PageLoader.setCode(fileReader.result);
          PhpUnitGen.Request.invokePhpUnitGen('main');
        };
        fileReader.readAsText(file);
      }
    });
  };

  return self;
})();