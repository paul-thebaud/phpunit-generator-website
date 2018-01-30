import {Config} from './modules/app.config.js';
import {HtmlManager} from './modules/app.html.manager.js';

/**
 * An object to contain dependencies.
 */
let PhpUnitGen = (function() {
  let self = {};

  self.initialize = function() {
    Config.initialize();
    HtmlManager.initialize(Config);
  };

  return self;
})();

/**
 * On page ready.
 */
$(document).ready(function() {
  PhpUnitGen.initialize();
});
