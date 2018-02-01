const PHPUNITGEN_LIGHT_THEME = 'light';
const PHPUNITGEN_DARK_THEME = 'dark';

const PHPUNITGEN_THEMES = {
  'light': {
    'classes': 'white blue-grey-text text-darken-3',
    'identifiers': [
      'main',
      '.modal',
      '.modal-footer',
      '.select-wrapper span.caret'
    ]
  },
  'dark': {
    'classes': 'blue-grey darken-3 white-text',
    'identifiers': [
      'main',
      '.modal',
      '.modal-footer',
      '.select-wrapper span.caret'
    ]
  }
};

/**
 * Represents the theme manager.
 */
PhpUnitGen.Theme = (function() {
  var self = {};

  var currentThemeId;

  /**
   * Change the theme for a new one.
   *
   * @param {string} themeId The new theme identifier.
   */
  self.change = function(themeId) {
    if (themeId === currentThemeId) {
      // Do not change if same as actual
      return;
    }

    currentThemeId = themeId;

    // For each themes
    $.each(PHPUNITGEN_THEMES, function(index, theme) {
      theme.identifiers.forEach(function(identifier) {
        // Add or remove themes classes
        if (index === themeId) {
          $(document).find(identifier).addClass(theme.classes);
        } else {
          $(document).find(identifier).removeClass(theme.classes);
        }
      });
    });
  };

  return self;
})();