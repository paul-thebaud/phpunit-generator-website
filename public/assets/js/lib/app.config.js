const PHPUNITGEN_LS_CONFIG = 'PhpUnitGen.storage.configuration';

const PHPUNITGEN_ANNOTATION_REGEX = new RegExp('^[a-zA-Z]+$');

/**
 * Represents the PhpUnitGen configuration.
 */
PhpUnitGen.Config = (function() {
  var self = {};

  /**
   * @type {{count: int, theme: string, height: string, hasInterface: boolean, hasAuto: boolean, phpdoc: {}}}
   */
  var config = {
    count: 0,
    theme: null,
    height: null,
    hasInterface: null,
    hasAuto: null,
    phpdoc: {}
  };
  var isNew = true;

  /**
   * Retrieve the existing configuration, or create a new one.
   */
  self.initialize = function() {
    var local = localStorage.getItem(PHPUNITGEN_LS_CONFIG);
    if ($.isEmptyObject(local)) {
      self.reset();
      $('#tap-target-documentation').tapTarget('open');
      return;
    }
    var json;
    // Try to get and parse the configuration
    try {
      json = JSON.parse(localStorage.getItem(PHPUNITGEN_LS_CONFIG));
      // Build it
      self.setCount(json.count);
      PhpUnitGen.Theme.countChange(self.getCount());
      self.setTheme(json.theme);
      PhpUnitGen.FormLoader.setSelectValue('select[name="theme"]',
          self.getTheme());
      self.setHeight(json.height);
      PhpUnitGen.FormLoader.setSelectValue('select[name="height"]',
          self.getHeight());
      self.setInterface(json.hasInterface);
      PhpUnitGen.FormLoader.setSwitchValue('input[name="interface"]',
          self.getInterface());
      self.setAuto(json.hasAuto);
      PhpUnitGen.FormLoader.setSwitchValue('input[name="auto"]',
          self.getAuto());
      for (var annotation in json.phpdoc) {
        if (json.phpdoc.hasOwnProperty(annotation)) {
          self.setPhpdoc(annotation, json.phpdoc[annotation]);
        }
      }
      isNew = false;
    } catch (exception) {
      self.reset();
      PhpUnitGen.Toast.error(
          'A configuration exists, but is not valid. Resetting it.');
    }
  };

  /**
   * Reset the configuration and the configuration input fields.
   */
  self.reset = function() {
    config.count = 0;
    self.setTheme(PHPUNITGEN_LIGHT_THEME);
    PhpUnitGen.FormLoader.setSelectValue('select[name="theme"]',
        PHPUNITGEN_LIGHT_THEME);
    self.setHeight('300px');
    PhpUnitGen.FormLoader.setSelectValue('select[name=height]', '300px');
    config.hasInterface = false;
    PhpUnitGen.FormLoader.setSwitchValue('input[name="interface"]', false);
    config.hasAuto = false;
    PhpUnitGen.FormLoader.setSwitchValue('input[name="auto"]', false);
    config.phpdoc = {};
    changed();
    PhpUnitGen.FormLoader.resetAnnotationsList();
    PhpUnitGen.FormLoader.resetAnnotationInput();
  };

  /**
   * Get the configuration as a Json object.
   * @return {{theme: string, height: string, hasInterface: boolean, hasAuto: boolean, phpdoc: {}}}
   */
  self.toJson = function() {
    return config;
  };

  /**
   * Update the configuration in local storage.
   */
  function changed() {
    // Save it
    localStorage.setItem(PHPUNITGEN_LS_CONFIG, JSON.stringify(config));
  }

  /*
   *************************************************************
   *
   * Getters and setters
   *
   *************************************************************
   */

  /**
   * @return {boolean} Tells the configuration is new or was found in local storage.
   */
  self.isNew = function() {
    return isNew;
  };

  /**
   * Set the count property.
   *
   * @param {int} count The new value.
   */
  self.setCount = function(count) {
    if (typeof(count) !== typeof(1)) {
      throw 'Invalid count provided';
    }
    config.count = count;
    changed();
  };

  /**
   * Get the current count property.
   *
   * @return {int} The current count.
   */
  self.getCount = function() {
    return config.count;
  };

  /**
   * Set the theme property.
   *
   * @param {string} theme The new value.
   */
  self.setTheme = function(theme) {
    if (!(theme in PHPUNITGEN_THEMES)) {
      throw 'Invalid theme provided';
    }
    config.theme = theme;
    changed();
    PhpUnitGen.Theme.change(theme);
  };

  /**
   * Get the current theme property.
   *
   * @return {string} The current theme.
   */
  self.getTheme = function() {
    return config.theme;
  };

  /**
   * Set the height property.
   *
   * @param {string} height The new value.
   */
  self.setHeight = function(height) {
    try {
      PhpUnitGen.PageLoader.changeEditorHeight(height);
    } catch (exception) {
      throw 'Height must be a CSS height, like "500px" or "100%"';
    }
    config.height = height;
    changed();
  };

  /**
   * Get the current height property.
   *
   * @return {string} The current height.
   */
  self.getHeight = function() {
    return config.height;
  };

  /**
   * Set the hasInterface property.
   *
   * @param {boolean} hasInterface The new value.
   */
  self.setInterface = function(hasInterface) {
    if (typeof(hasInterface) !== typeof(true)) {
      throw 'Invalid interface value provided';
    }
    config.hasInterface = hasInterface;
    changed();
  };

  /**
   * Get the current hasInterface property.
   *
   * @return {boolean} The current hasInterface.
   */
  self.getInterface = function() {
    return config.hasInterface;
  };

  /**
   * Set the hasAuto property.
   *
   * @param {boolean} hasAuto The new value.
   */
  self.setAuto = function(hasAuto) {
    if (typeof(hasAuto) !== typeof(true)) {
      throw 'Invalid auto value provided';
    }
    config.hasAuto = hasAuto;
    changed();
  };

  /**
   * Get the current hasAuto property.
   *
   * @return {boolean} The current hasAuto.
   */
  self.getAuto = function() {
    return config.hasAuto;
  };

  /**
   * Add or update a phpdoc annotation.
   *
   * @param {string} annotation The annotation key in phpdoc.
   * @param {string} content The content key in phpdoc.
   */
  self.setPhpdoc = function(annotation, content) {
    if (typeof(annotation) !== typeof('')
        || !PHPUNITGEN_ANNOTATION_REGEX.test(annotation)
    ) {
      throw 'Invalid annotation to add (must match pattern [a-zA-Z]+)';
    }
    if (annotation in config.phpdoc) {
      throw 'The annotation "' + annotation + '" already exists';
    }
    if (typeof(content) !== typeof('')
        || content.length < 1
    ) {
      throw 'Invalid annotation content to add (must have more than 0 character)';
    }

    config.phpdoc[annotation] = content;
    changed();
    PhpUnitGen.FormLoader.addPhpdocDiv(annotation, content);
  };

  /**
   * Remove a phpdoc annotation.
   *
   * @param {string} annotation The annotation key to remove.
   */
  self.removePhpdoc = function(annotation) {
    if (typeof(annotation) === typeof('')
        && PHPUNITGEN_ANNOTATION_REGEX.test(annotation)
        && annotation in config.phpdoc
    ) {
      delete config.phpdoc[annotation];
      changed();
    } else {
      throw 'Invalid annotation to remove';
    }
  };

  /**
   * Get the current phpdoc object.
   *
   * @return {object} The current phpdoc object.
   */
  self.getPhpdoc = function() {
    return config.phpdoc;
  };

  return self;
})();