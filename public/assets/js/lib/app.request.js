/**
 * Represents the request manager.
 */
PhpUnitGen.Request = (function() {
  var self = {};

  var documentation = false;

  /**
   * Handle an Ajax error.
   * @param error The error to show.
   */
  function handleAjaxError(error) {
    console.error(error);
    alert(error.message);
  }

  /**
   * Get the documentation and add it if not already retrieved.
   */
  self.invokePhpUnitGen = function(source) {
    PhpUnitGen.Spinner.toggle();
    $.ajax({
      url: '/generate',
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
        handleAjaxError(error);
      }
    });
  };

  /**
   * Get the documentation and add it if not already retrieved.
   */
  self.getDocumentation = function() {
    if (documentation) {
      return;
    }
    $.ajax({
      url: '/documentation',
      type: 'GET',
      dataType: 'html',
      success: function(html) {
        $(document).find('#modal-documentation .content').html(html);
        Prism.highlightAll();
      },
      error: function(error) {
        handleAjaxError(error);
      }
    });
  };

  return self;
})();