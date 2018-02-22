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
   * @param button The button (jQuery button element).
   */
  self.slideSourceToTarget = function(button) {
    // If a tests generation is required
    var target = button.data('target');
    if (target === 'tests-editor') {
      return;
    }
    slide(button.data('source'), target, button.data('direction'));
  };

  /**
   * Slide to the tests editor from a specified source.
   *
   * @param {string} source The source to slide from.
   */
  self.slideTestsEditor = function(source) {
    slide(source, 'tests-editor', 'right');
  };

  /**
   * Slide from a source to a target.
   *
   * @param {string} source The source.
   * @param {string} target The target.
   * @param {string} direction The slide animation direction.
   */
  function slide(source, target, direction) {
    var opposed = direction === 'right' ? 'left' : 'right';
    $(document).
        find('#tab-' + source).
        hide('slide', {direction: opposed}, 250, function() {
          $(document).
              find('#tab-' + target).
              show('slide', {direction: direction}, 250, function() {
                PhpUnitGen.PageLoader.refreshEditors();
              });
        });
  }

  return self;
})();