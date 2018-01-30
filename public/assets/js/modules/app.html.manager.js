import {Config} from './app.config.js';
import {RequestManager} from './app.request.manager.js';
import {Util} from './app.util.js';

/**
 * Represents the html document manager.
 */
export let HtmlManager = (function() {
  let divs = {
    main: $('main'),
    modals: $('.modal'),
    documentation: $('#modal-documentation').find('.content'),
    configuration: $('#modal-configuration'),
  };

  let documentationLoaded = false;

  let self = {};

  /**
   * Initialize all components of HtmlManager.
   */
  self.initialize = function() {
    self.initializeConfig();
    self.initializeListener();

    divs.modals.modal();
    $('.tooltipped').tooltip({delay: 50});

    if (Config.isNew()) {
      $('#tap-target-documentation').tapTarget('open');
    }
  };

  /**
   * Set the documentation content.
   *
   * @param {string} html The documentation.
   */
  self.setDocumentation = function(html) {
    divs.documentation.html(html);
  };

  /**
   * Initialize all form listener.
   */
  self.initializeListener = function() {
    divs.configuration.find('input[name="dark-theme"]').
        on('change', function() {
          self.switchDarkTheme($(this).prop('checked'));
        });
    divs.configuration.find('input[name="auto"]').on('change', function() {
      Config.setAuto($(this).prop('checked'));
    });
    divs.configuration.find('input[name="interface"]').on('change', function() {
      Config.setInterface($(this).prop('checked'));
    });

    divs.configuration.find('#btn-annotation-add').on('click', function() {
      self.addPhpdocDiv(
          divs.configuration.find('input[name="annotation"]').val(),
          divs.configuration.find('input[name="content"]').val());
    });
    divs.configuration.find('input[name="annotation"]').on('keypress', function(e) {
      if (e.which === 13) {
        divs.configuration.find('#btn-annotation-add').click();
      }
    });
    divs.configuration.find('input[name="content"]').on('keypress', function(e) {
      if (e.which === 13) {
        divs.configuration.find('#btn-annotation-add').click();
      }
    });
    divs.configuration.on('click', '.annotation-delete-btn', function() {
      self.removePhpdocDiv($(this).data('target'));
    });
    $('#btn-documentation').on('click', function() {
      if (! documentationLoaded) {
        RequestManager.getDocumentation();
        documentationLoaded = true;
      }
    });
  };

  /**
   * Show an error toast.
   *
   * @param {string} message The error message.
   */
  self.error = function(message) {
    Materialize.toast('<i class="material-icons left">error</i>' + message,
        10000);
  };

  /*
   *************************************************************
   *
   * Configuration administration
   *
   *************************************************************
   */

  self.initializeConfig = function() {
    self.switchDarkTheme(Config.getDarkTheme());
    divs.configuration.find('input[name="dark-theme"]').
        prop('checked', Config.getDarkTheme());
    divs.configuration.find('input[name="auto"]').
        prop('checked', Config.getAuto());
    divs.configuration.find('input[name="interface"]').
        prop('checked', Config.getInterface());

    divs.configuration.find('#annotations-list').text('');
    let phpdoc = Config.getPhpdoc();
    for (let annotation in phpdoc) {
      self.addPhpdocDiv(annotation, phpdoc[annotation]);
    }
  };

  $('#modal-confirm-reset').find('#btn-confirm-reset').on('click', function() {
    self.resetConfig();
  });

  self.resetConfig = function() {
    Config.reset();
    self.initializeConfig();
  };

  /**
   * Activate or deactivate the dark theme.
   *
   * @param {boolean} activated True if the dark theme should be active.
   */
  self.switchDarkTheme = function(activated) {
    Config.setDarkTheme(activated);
    if (activated) {
      divs.main.removeClass('white blue-grey-text text-darken-3').
          addClass('blue-grey darken-3 white-text');
      divs.modals.removeClass('white blue-grey-text text-darken-3').
          addClass('blue-grey darken-3 white-text');
      divs.modals.find('.modal-footer').
          removeClass('white blue-grey-text text-darken-3').
          addClass('blue-grey darken-3 white-text');
    } else {
      divs.main.removeClass('blue-grey darken-3 white-text').
          addClass('white blue-grey-text text-darken-3');
      divs.modals.removeClass('blue-grey darken-3 white-text').
          addClass('white blue-grey-text text-darken-3');
      divs.modals.find('.modal-footer').
          removeClass('blue-grey darken-3 white-text').
          addClass('white blue-grey-text text-darken-3');
    }
  };

  self.addPhpdocDiv = function(annotation, content) {
    annotation = annotation.replace('@', '');

    try {
      Config.setPhpdoc(annotation, content);
    } catch (exception) {
      self.error(exception);
      return;
    }

    divs.configuration.find('input[name="annotation"]').val('');
      divs.configuration.find('input[name="content"]').val('');

    let uuid = Util.uuid();
    let html = $('<div>', {
      id: 'annotation' + uuid,
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
          class: 'btn annotation-delete-btn waves-effect waves-light red right',
          'data-target': uuid
        }).append($('<i>', {class: 'material-icons', text: 'delete'})))
    );
    divs.configuration.find('#annotations-list').append(html);
  };

  self.removePhpdocDiv = function(uuid) {
    let div = divs.configuration.find('#annotation-' + uuid);
    try {
      Config.removePhpdoc(div.data('annotation'));
    } catch (exception) {
      self.error(exception);
      return;
    }
    div.slideUp('normal', function() {
      $(this).remove();
    });
  };

  return self;
})();
