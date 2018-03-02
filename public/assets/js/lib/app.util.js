/**
 * Represents the PhpUnitGen utils.
 */
PhpUnitGen.Util = (function() {
  var self = {};

  function uuidPart() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  /**
   * Create a uuid as a string.
   *
   * @returns {string} The created uuid.
   */
  self.uuid = function() {
    return uuidPart() + uuidPart() + '-' + uuidPart() + '-' + uuidPart() + '-' +
        uuidPart() + '-' + uuidPart() + uuidPart() + uuidPart();
  };

  return self;
})();