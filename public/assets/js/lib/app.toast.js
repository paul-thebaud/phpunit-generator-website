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
    Materialize.toast('<i class="material-icons left">warning</i>' + message,
        4000);
  };

  self.unicorn = function() {
    var message = '<i class="material-icons left">lock_open</i> You use PhpUnitGen for the first time!&nbsp;';
    message += '<b>Unicorn theme unlocked!</b>';
    Materialize.toast(message, 8000);
  };

  self.rainbow = function() {
    var message = '<i class="material-icons left">lock_open</i> Five uses! Well done!!&nbsp;';
    message += '<b>Rainbow theme unlocked!</b>';
    Materialize.toast(message, 8000);
  };

  return self;
})();