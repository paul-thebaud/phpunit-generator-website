const PHPUNITGEN_LIGHT_THEME = 'light';
const PHPUNITGEN_DARK_THEME = 'dark';
const PHPUNITGEN_RAINBOW_THEME = 'rainbow';

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
    'classes': 'grey darken-4 white-text',
    'identifiers': [
      'main',
      '.modal',
      '.modal-footer',
      '.select-wrapper span.caret'
    ]
  },
  'unicorn': {
    'classes': 'unicorn grey darken-4 white-text',
    'identifiers': [
      '#global',
      'main',
      '.modal',
      '.modal-footer',
      '.select-wrapper span.caret'
    ]
  },
  'rainbow': {
    'classes': 'rainbow grey darken-4 white-text',
    'identifiers': [
      '#global',
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

  var select = $(document).find('select[name="theme"]');

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

    // Remove each themes classes
    $.each(PHPUNITGEN_THEMES, function(index, theme) {
      theme.identifiers.forEach(function(identifier) {
        if (index !== themeId) {
          $(document).find(identifier).removeClass(theme.classes);
        }
      });
    });

    // Add theme classes
    PHPUNITGEN_THEMES[themeId].identifiers.forEach(function(identifier) {
      $(document).find(identifier).addClass(PHPUNITGEN_THEMES[themeId].classes);
    });
  };

  self.countChange = function(count) {
    // Remove all hidden theme if count is 0
    if (count === 0) {
      self.removeHiddenTheme('unicorn');
      self.removeHiddenTheme('rainbow');
      return;
    }
    if (count >= 1) {
      // Add unicorn theme
      self.addHiddenTheme('unicorn', 'Unicorn theme', 'unicorn.png');
    }
    if (count >= 5) {
      // Add rainbow theme
      self.addHiddenTheme('rainbow', 'Rainbow theme', 'rainbow.png');
    }
  };

  self.addHiddenTheme = function(id, name, image) {
    var option = $('<option>', {
      value: id,
      class: 'circle left',
      text: name,
      'data-icon': 'assets/img/' + image
    });
    select.append(option);
    select.material_select();
  };

  self.removeHiddenTheme = function(id) {
    select.find('option[value="' + id + '"]').remove();
    select.material_select();
  };

  return self;
})();