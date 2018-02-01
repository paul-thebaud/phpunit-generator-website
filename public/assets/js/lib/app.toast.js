/**
 * Represents the Toast printer to show message to the user.
 */
PhpUnitGen.Toast = (function() {
  var self = {};

  /**
   * Show a success toast.
   *
   * @param {string} message The success message.
   */
  self.success = function(message) {
    Materialize.toast('<i class="material-icons left">check</i>' + message,
        4000);
  };

  /**
   * Show an error toast.
   *
   * @param {string} message The error message.
   */
  self.error = function(message) {
    Materialize.toast('<i class="material-icons left">error</i>' + message,
        4000);
  };

  return self;
})();