/**
 * Represents the request manager.
 */
PhpUnitGen.Request = (function() {
  var self = {};

  /**
   * Handle an Ajax error.
   * @param error The error to show.
   */
  function handleAjaxError(error) {
    console.error(error);
    alert('Server responds with an error. Please report the issue on the github page.');
  }

  /**
   * Invoke the PhpUnitGen service.
   */
  self.invokePhpUnitGen = function(source) {
    PhpUnitGen.Spinner.toggle();
    $.ajax({
      url: URL_API + '/invoke-generator',
      type: 'POST',
      data: {
        config: PhpUnitGen.Config.toJson(),
        name: $(document).find('input[name="name"]').val(),
        code: PhpUnitGen.PageLoader.getCode()
      },
      dataType: 'json',
      success: function(json) {
        if (json.code === 200) {
          PhpUnitGen.PageLoader.setTests(json.content);
          PhpUnitGen.Tab.slideTestsEditor(source);

          // Update theme if necessary
          var count = PhpUnitGen.Config.getCount() + 1;
          if (count === 1) {
            PhpUnitGen.Toast.unicorn();
          } else if (count === 5) {
            PhpUnitGen.Toast.rainbow();
          }
          PhpUnitGen.Config.setCount(count);
        } else {
          PhpUnitGen.Toast.error(json.content);
          // If the source is a file
          if (source === 'main') {
            // Clean forms
            $(document).find('input[name="name"]').val('');
            PhpUnitGen.PageLoader.resetEditors();
          }
        }
        PhpUnitGen.Spinner.toggle();
      },
      error: function(error) {
        PhpUnitGen.Spinner.toggle();
        handleAjaxError(error);
      }
    });
  };

  return self;
})();
