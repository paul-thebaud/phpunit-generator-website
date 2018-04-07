const PHPUNITGEN_LS_COOKIE_USAGE = 'PhpUnitGen.storage.cookie_usage';

/**
 * Represents the cookie law container manager.
 */
PhpUnitGenCookieLaw = (function() {
  var self = {};

  /**
   * Initialize the module.
   */
  self.initialize = function() {
    // If cookies are not accepted
    if (localStorage.getItem(PHPUNITGEN_LS_COOKIE_USAGE) !== 'accepted') {
      // Show the cookie advertisement container
      var cookieLawContainer = $(document).find('#cookie-law-container');
      cookieLawContainer.find('#btn-accept-cookie').on('click', function() {
        localStorage.setItem(PHPUNITGEN_LS_COOKIE_USAGE, 'accepted');
        cookieLawContainer.slideUp(500);
        $(document).find('footer').animate({
          marginBottom: '0'
        }, 500);
      });
      $(document).find('footer').animate({
        marginBottom: cookieLawContainer.innerHeight() + 'px'
      }, 500);
      cookieLawContainer.slideDown(500);
    }
  };

  return self;
})();
