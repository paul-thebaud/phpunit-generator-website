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
      },
      error: function(error) {
        handleAjaxError(error);
      }
    });
  };

  return self;
})();