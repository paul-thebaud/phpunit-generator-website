const PHPUNITGEN_LS_MOBILE = 'PhpUnitGen.storage.mobile';

/**
 * Represents the PhpUnitGen mobile navigation.
 */
PhpUnitGen.Mobile = (function() {
  var self = {};

  /**
   * Initialize the module.
   */
  self.initialize = function() {
    if (localStorage.getItem(PHPUNITGEN_LS_MOBILE) === 'hide_always') {
      $(document).find('#global-mobile').remove();
    } else {
      $(document).find('#global-mobile').fadeIn(250);
    }
  };

  /**
   * Hide and save a local variable to hide next time.
   */
  self.alwaysHide = function() {
    localStorage.setItem(PHPUNITGEN_LS_MOBILE, 'hide_always');
    $(document).find('#global-mobile').fadeOut(250);
  };

  return self;
})();