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

    new Clipboard('#btn-copy-clipboard', {
      text: function() {
        PhpUnitGen.Toast.success('Tests skeleton code copied to clipboard');
        return PhpUnitGen.PageLoader.getTests();
      }
    });

    $(document).find('#btn-download-file').on('click', function() {
      download();
    });
  };

  /**
   * Download tests skeleton code as a file.
   */
  function download() {
    var name = 'GeneratedTest.php';
    var nameDiv = $(document).find('input[name="name"]');
    if (nameDiv.val().length > 0) {
      name = nameDiv.val() + '.php';
    }

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(PhpUnitGen.PageLoader.getTests()));
    element.setAttribute('download', name);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  return self;
})();