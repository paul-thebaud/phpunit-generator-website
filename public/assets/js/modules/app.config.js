import {HtmlManager} from './app.html.manager.js';

const LOCAL_STORAGE_CONFIG = 'PhpUnitGen.storage.configuration';

const ANNOTATION_REGEX = new RegExp('^[a-zA-Z]+$');

/**
 * Represents a PhpUnitGen Configuration.
 */
export let Config = (function() {
  let wasCreatedRecently = true;
  let hasDarkTheme = false;
  let hasInterface = false;
  let hasAuto = false;
  let phpdoc = {};

  let self = {};

  /**
   * Retrieve the existing configuration, or create a new one.
   */
  self.initialize = function() {
    let local = localStorage.getItem(LOCAL_STORAGE_CONFIG);
    if ($.isEmptyObject(local)) {
      self.change();
      return;
    }
    let json;
    // Try to get and parse the configuration
    try {
      json = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CONFIG));
      // Build it
      self.setDarkTheme(json.hasDarkTheme);
      self.setInterface(json.hasInterface);
      self.setAuto(json.hasAuto);
      for (let annotation in json.phpdoc) {
        if (json.phpdoc.hasOwnProperty(annotation)) {
          self.setPhpdoc(annotation, json.phpdoc[annotation]);
        }
      }
      wasCreatedRecently = false;
    } catch (exception) {
      self.change();
      HtmlManager.error(
          'A configuration was found, but has an invalid format. Resetting configuration');
    }
  };

  self.reset = function() {
    hasDarkTheme = false;
    hasInterface = false;
    hasAuto = false;
    phpdoc = {};
    self.change();
    HtmlManager.initializeConfig();
  };

  /**
   * Update the configuration in local storage.
   */
  self.change = function() {
    // Save it
    localStorage.setItem(LOCAL_STORAGE_CONFIG, JSON.stringify(self.toJson()));
  };

  /**
   * Get the configuration as a Json object.
   *
   * @return {object} The configuration in Json format.
   */
  self.toJson = function() {
    return {
      hasDarkTheme: hasDarkTheme,
      hasInterface: hasInterface,
      hasAuto: hasAuto,
      phpdoc: phpdoc,
    };
  };

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
    return wasCreatedRecently;
  };

  /**
   * Set the hasDarkTheme property.
   *
   * @param {boolean} hasDarkThemeValue The new value.
   */
  self.setDarkTheme = function(hasDarkThemeValue) {
    if (typeof(hasDarkThemeValue) === typeof(true)) {
      hasDarkTheme = hasDarkThemeValue;
      self.change();
    }
  };

  /**
   * Get the current hasDarkTheme property.
   *
   * @return {boolean} The current hasDarkTheme.
   */
  self.getDarkTheme = function() {
    return hasDarkTheme;
  };

  /**
   * Set the hasInterface property.
   *
   * @param {boolean} hasInterfaceValue The new value.
   */
  self.setInterface = function(hasInterfaceValue) {
    if (typeof(hasInterfaceValue) === typeof(true)) {
      hasInterface = hasInterfaceValue;
      self.change();
    } else {
      throw 'Invalid auto value';
    }
  };

  /**
   * Get the current hasInterface property.
   *
   * @return {boolean} The current hasInterface.
   */
  self.getInterface = function() {
    return hasInterface;
  };

  /**
   * Set the hasAuto property.
   *
   * @param {boolean} hasAutoValue The new value.
   */
  self.setAuto = function(hasAutoValue) {
    if (typeof(hasAutoValue) === typeof(true)) {
      hasAuto = hasAutoValue;
      self.change();
    } else {
      throw 'Invalid auto value';
    }
  };

  /**
   * Get the current hasAuto property.
   *
   * @return {boolean} The current hasAuto.
   */
  self.getAuto = function() {
    return hasAuto;
  };

  /**
   * Add or update a phpdoc annotation.
   *
   * @param {string} annotation The annotation key in phpdoc.
   * @param {string} content The content key in phpdoc.
   */
  self.setPhpdoc = function(annotation, content) {
    if (typeof(annotation) === typeof('')
        && ANNOTATION_REGEX.test(annotation)
        && typeof(content) === typeof('')
    ) {
      phpdoc[annotation] = content;
      self.change();
    } else {
      throw 'Invalid annotation to add';
    }
  };

  /**
   * Remove a phpdoc annotation.
   *
   * @param {string} annotation The annotation key to remove.
   */
  self.removePhpdoc = function(annotation) {
    if (typeof(annotation) === typeof('')
        && ANNOTATION_REGEX.test(annotation)
        && annotation in phpdoc
    ) {
      delete phpdoc[annotation];
      self.change();
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
    return phpdoc;
  };

  return self;
})();