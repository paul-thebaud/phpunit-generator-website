/**
 * Represents the tab manager.
 */
PhpUnitGen.Tab = (function() {
  var self = {};

  /**
   * Initialize the module.
   */
  self.initialize = function() {
    // Create a listener on each tab button
    $(document).find('.btn-tab').on('click', function() {
      self.slideSourceToTarget($(this));
    });
  };

  /**
   * Slide tabs from a button with data (source, target and direction).
   *
   * @param button The button.
   */
  self.slideSourceToTarget = function(button) {
    var direction = button.data('direction');
    var opposed = direction === 'right' ? 'left' : 'right';
    $(document).
        find('#tab-' + button.data('source')).
        hide('slide', {direction: opposed}, 250, function() {
          $(document).
              find('#tab-' + button.data('target')).
              show('slide', {direction: direction}, 250, function() {
                PhpUnitGen.PageLoader.refreshEditors();
              });
        });
  };

  return self;
})();