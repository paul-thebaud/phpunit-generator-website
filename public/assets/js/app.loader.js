/**
 * Represents the application.
 */
var PhpUnitGen = {};

/**
 * Represents the App Loader, a module to load app scripts.
 */
PhpUnitGen.AppLoader = (function() {
  var self = {};

  /**
   * @type {string[]} scripts A scripts to load array.
   */
  var scripts = [
    'assets/js/lib/app.cookie.js',
    'assets/js/lib/app.toast.js',
    'assets/js/lib/app.theme.js',
    'assets/js/lib/app.spinner.js',
    'assets/js/lib/app.util.js',
    'assets/js/lib/app.page.loader.js',
    'assets/js/lib/app.form.loader.js',
    'assets/js/lib/app.config.js',
    'assets/js/lib/app.mobile.js',
    'assets/js/lib/app.form.listener.js',
    'assets/js/lib/app.request.js',
    'assets/js/lib/app.tab.js',
    'assets/js/lib/app.editor.listener.js'
  ];

  var currentIndex = 0;
  var currentScript = scripts[0];
  var finalCallback;

  /**
   * Initialize the module.
   * @param finalCallbackFunction The callback function when init is finish.
   */
  self.initialize = function(finalCallbackFunction) {
    finalCallback = finalCallbackFunction;
    load();
  };

  /**
   * Load a script.
   */
  function load() {
    // Add script on page
    var head = document.getElementsByTagName('body')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = currentScript;

    var callback = function() {
      // On script loaded
      currentIndex = currentIndex + 1;
      if (currentIndex in scripts) {
        currentScript = scripts[currentIndex];
        load();
      } else {
        finalCallback();
      }
    };

    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
  }

  return self;
})();

// On page is ready
$(document).ready(function() {
  // Load PhpUnitGen app
  PhpUnitGen.AppLoader.initialize(function() {
    // And initialize each modules
    PhpUnitGen.CookieLaw.initialize();
    PhpUnitGen.Mobile.initialize();
    PhpUnitGen.FormListener.initialize();
    PhpUnitGen.PageLoader.initialize();
    PhpUnitGen.Config.initialize();
    PhpUnitGen.Tab.initialize();
    PhpUnitGen.EditorListener.initialize();
  });
});