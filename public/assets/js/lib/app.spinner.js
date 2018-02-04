/**
 * Represents the spinner manager.
 */
PhpUnitGen.Spinner = (function() {
  var self = {};

  var spinnerContainer = $(document).find('#spinner-container');

  /**
   * Toggle the display of the spinner.
   */
  self.toggle = function() {
    if (spinnerContainer.is(':visible')) {
      spinnerContainer.fadeOut(250);
    } else {
      spinnerContainer.fadeIn(250);
    }
  };

  return self;
})();