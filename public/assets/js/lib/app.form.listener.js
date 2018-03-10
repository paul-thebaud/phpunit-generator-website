/**
 * Represents the form listener manager.
 */
PhpUnitGen.FormListener = (function() {
  var self = {};

  /**
   * Initialize the module.
   */
  self.initialize = function() {
    // Select
    configFormOnSelectChange('select[name="theme"]', function(value) {
      PhpUnitGen.Config.setTheme(value);
    });

    // Input text
    configFormOnSelectChange('select[name="height"]', function(value) {
      PhpUnitGen.Config.setHeight(value);
    });

    // Switch
    configFormOnSwitchChange('input[name="auto"]', function(value) {
      PhpUnitGen.Config.setAuto(value);
    });
    configFormOnSwitchChange('input[name="private"]', function(value) {
      PhpUnitGen.Config.setPrivate(value);
    });
    configFormOnSwitchChange('input[name="interface"]', function(value) {
      PhpUnitGen.Config.setInterface(value);
    });

    // Annotations
    configFormOnClick('#btn-annotation-add', function() {
      configFormSendPhpdoc();
    });
    configFormOnEnter('input[name="annotation"]', function() {
      configFormSendPhpdoc();
    });
    configFormOnEnter('input[name="content"]', function() {
      configFormSendPhpdoc();
    });
    configFormOnClick('.btn-annotation-delete', function(_this) {
      configFormRemovePhpdoc(_this.data('target'));
    });
    configFormOnClick('#btn-documentation', function() {
      PhpUnitGen.Request.getDocumentation();
    });

    // Configuration reset
    configFormOnClick('#btn-confirm-reset', function() {
      PhpUnitGen.Config.reset();
    });

    // Mobile navigation
    $(document).find('#btn-visit-mobile').on('click', function() {
      PhpUnitGen.Mobile.alwaysHide();
    });
  };

  /*
   *************************************************************
   *
   * Private functions
   *
   *************************************************************
   */

  /**
   * Require a php doc add to configuration.
   */
  function configFormSendPhpdoc() {
    var configForm = $(document).find('#modal-configuration');
    try {
      PhpUnitGen.Config.setPhpdoc(
          configForm.find('input[name="annotation"]').val().replace('@', ''),
          configForm.find('input[name="content"]').val()
      );
    } catch (exception) {
      PhpUnitGen.Toast.error(exception);
    }
  }

  /**
   * Require a php doc remove to configuration.
   *
   * @param {string} uuid The uuid to remove.
   */
  function configFormRemovePhpdoc(uuid) {
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
  }

  /**
   * On a select change, call callback with new value.
   *
   * @param identifier The select identifier.
   * @param callback The callback function.
   */
  function configFormOnSelectChange(identifier, callback) {
    $(document).find(identifier).on('change', function() {
      try {
        callback($(this).val());
      } catch (exception) {
        PhpUnitGen.Toast.error(exception);
      }
    });
  }

  /**
   * On a switch change, call callback with new value.
   *
   * @param {string} identifier The switch identifier.
   * @param callback The callback function.
   */
  function configFormOnSwitchChange(identifier, callback) {
    $(document).find(identifier).on('change', function() {
      try {
        callback($(this).prop('checked'));
      } catch (exception) {
        PhpUnitGen.Toast.error(exception);
      }
    });
  }

  /**
   * On click call callback with $(this).
   *
   * @param {string} identifier The div identifier.
   * @param callback The callback function.
   */
  function configFormOnClick(identifier, callback) {
    $(document).on('click', identifier, function() {
      try {
        callback($(this));
      } catch (exception) {
        PhpUnitGen.Toast.error(exception);
      }
    });
  }

  /**
   * On enter key is pressed call callback with $(this).
   *
   * @param {string} identifier The div identifier.
   * @param callback The callback function.
   */
  function configFormOnEnter(identifier, callback) {
    $(document).find(identifier).on('keypress', function(e) {
      if (e.which === 13) {
        try {
          callback($(this));
        } catch (exception) {
          PhpUnitGen.Toast.error(exception);
        }
      }
    });
  }

  return self;
})();