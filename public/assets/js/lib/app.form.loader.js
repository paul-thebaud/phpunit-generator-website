/**
 * Represents the form initializer.
 */
PhpUnitGen.FormLoader = (function() {
  var self = {};

  /**
   * Set a value on a select.
   *
   * @param {string} identifier The field identifier.
   * @param {string} value The new value.
   */
  self.setSelectValue = function(identifier, value) {
    var select = $(document).find(identifier);
    select.val(value);
    select.material_select();
  };

  /**
   * Set a value on a switch.
   *
   * @param {string} identifier The field identifier.
   * @param {boolean} value The new value.
   */
  self.setSwitchValue = function(identifier, value) {
    $(document).find(identifier).prop('checked', value);
  };

  /**
   * Reset the annotations list.
   */
  self.resetAnnotationsList = function() {
    $(document).find('#annotations-list').text('');
  };

  /**
   * Reset the annotation input fields.
   */
  self.resetAnnotationInput = function() {
    var configForm = $(document).find('#modal-configuration');
    configForm.find('input[name="annotation"]').val('');
    configForm.find('input[name="content"]').val('');
  };

  /**
   * Add an annotation.
   *
   * @param {string} annotation The annotation tag.
   * @param {string} content The annotation content.
   */
  self.addPhpdocDiv = function(annotation, content) {
    var uuid = PhpUnitGen.Util.uuid();
    var html = $('<div>', {
      id: 'annotation-' + uuid,
      class: 'row valign-wrapper annotation',
      'data-annotation': annotation
    }).append(
        $('<div>', {
          class: 'col s4'
        }).append($('<span>', {text: '@' + annotation})),
        $('<div>', {
          class: 'col s6'
        }).append($('<span>', {text: content})),
        $('<div>', {class: 'col s2'}).append($('<button>', {
          type: 'button',
          class: 'btn btn-annotation-delete waves-effect waves-light red right',
          'data-target': uuid
        }).append($('<i>', {class: 'material-icons', text: 'delete'})))
    );
    $(document).find('#annotations-list').append(html);
    self.resetAnnotationInput();
  };

  /**
   * Remove an annotation.
   *
   * @param {string} uuid The annotation uuid.
   */
  self.removePhpdocDiv = function(uuid) {
    var div = $(document).find('#annotation-' + uuid);
    try {
      PhpUnitGen.Config.removePhpdoc(div.data('annotation'));
    } catch (exception) {
      PhpUnitGen.Toast.error(exception);
      return;
    }
    div.slideUp('normal', function() {
      $(this).remove();
    });
  };

  return self;
})();