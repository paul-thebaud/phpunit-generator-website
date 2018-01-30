import {HtmlManager} from './app.html.manager.js';

/**
 * Represents the request manager.
 */
export let RequestManager = (function() {
  let self = {};

  /**
   * Handle an ajax error.
   * @private
   *
   * @param error The error to handle.
   */
  function _handleError(error) {
    console.error(error);
    alert(error.message);
  }

  /**
   * Request the documentation html.
   */
  self.getDocumentation = function() {
    $.ajax({
      url: '/documentation',
      type: 'GET',
      dataType: 'html',
      success: function(html) {
        HtmlManager.setDocumentation(html);
      },
      error: function(error) {
        _handleError(error);
      },
    });
  }

  return self;
})();
