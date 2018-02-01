const PHPUNITGEN_LS_COOKIE_USAGE = 'PhpUnitGen.storage.cookie_usage';

/**
 * Represents the cookie law container manager.
 */
PhpUnitGen.CookieLaw = (function() {
  var self = {};

  /**
   * Initialize the module.
   */
  self.initialize = function() {
    // If cookies are not accepted
    if (localStorage.getItem(PHPUNITGEN_LS_COOKIE_USAGE) !== 'accepted') {
      var cookieLawContainer = $(document).find('#cookie-law-container');
      cookieLawContainer.find('#btn-accept-cookie').on('click', function() {
        localStorage.setItem(PHPUNITGEN_LS_COOKIE_USAGE, 'accepted');
        cookieLawContainer.slideUp(500);
      });
      cookieLawContainer.slideDown(500);
    }
  };

  return self;
})();