/**
 * Represents the PhpUnitGen utils module.
 */
export let Util = (function() {
  let self = {};

  function uuidPart() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  self.uuid = function() {
    return uuidPart() + uuidPart() + '-' + uuidPart() + '-' + uuidPart() + '-' +
        uuidPart() + '-' + uuidPart() + uuidPart() + uuidPart();
  };

  return self;
})();