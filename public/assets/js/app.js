/*
 * PHPUnit Generator Website Javascript
 *
 * (c) Paul Thébaud <paul.thebaud29@gmail.com>
 */

var activeSection = $('#main');
var previousSection = null;

var codeEditor, testsEditor;

var codeToUse = null;

/*
 * Define PHPUnitGen app functions
 */

var PHPUnitGen = {
    requestParsing: function (code) {
        $('#loader').fadeToggle(500);

        if (typeof code !== 'undefined') {
            codeToUse = code;
        }

        $.ajax({
            url: '/render',
            type: 'POST',
            dataType: 'json',
            data: {
                code: codeToUse,
                options: this.getConfig()
            },
            success: function (json) {
                if (json['status'] === true) {
                    testsEditor.setValue(json['content']);
                    goToSection('#tests-editor');
                } else {
                    errorToast(json['content']);
                }
                $('#loader').fadeToggle(500);
            },
            error: function (error) {
                // Unknown error
                alert('An unknown error occurred: Please add an issue on the Github page.');
                console.error(error);
                $('#loader').fadeToggle(500);
            }
        });
    },
    // Config methods
    parseConfig: function () {
        var config;
        try {
            if (typeof localStorage !== 'undefined' && 'PHPUnitGenConfig' in localStorage) {
                config = this.getConfig();
            }
        } catch (e) {
        }
        if (typeof config === 'undefined') {
            config = {};
            $('#tap-target-documentation').tapTarget('open');
        }
        this.saveConfig(config);
    },
    getConfig: function () {
        return JSON.parse(localStorage.PHPUnitGenConfig);
    },
    getConfigElem: function (elem) {
        var config = this.getConfig();
        if (elem in config) {
            return config[elem];
        }
        return null;
    },
    saveConfig: function (config) {
        localStorage.PHPUnitGenConfig = JSON.stringify(config);
    },
    saveConfigElem: function (elem) {
        var name = elem.attr('name');
        var config = this.getConfig();
        if (elem.attr('type') === 'checkbox') {
            if (elem.prop('checked')) {
                config[name] = 1;
            } else if (name in config) {
                delete config[name];
            }
        } else {
            config[name] = elem.val();
        }
        this.saveConfig(config);
    }
};

/*
 * UI functions
 */

function toggleDarkTheme() {
    var main = $('main');
    var modalsDiv = $('.modal, .modal-footer');
    if (main.hasClass('blue-grey')) {
        main.removeClass('blue-grey darken-3 white-text')
            .addClass('white blue-grey-text text-darken-3');
        modalsDiv.removeClass('blue-grey darken-3 white-text')
            .addClass('white blue-grey-text text-darken-3');
    } else {
        main.removeClass('white blue-grey-text text-darken-3')
            .addClass('blue-grey darken-3 white-text');
        modalsDiv.removeClass('white blue-grey-text text-darken-3')
            .addClass('blue-grey darken-3 white-text');
    }
}

function infoToast(message) {
    Materialize.toast('<div class="right-align">' + message + '</span><br><button type="button" class="btn-flat toast-action dismiss-button orange-text">OK</button></div>', 3000);
}

function errorToast(error) {
    Materialize.toast('<div class="right-align"><b>An error occurred during parsing</b><br><span>' + error + '</span><br><button type="button" class="btn-flat toast-action dismiss-button orange-text">OK</button></div>', 10000);
}

function goToSection(id) {
    var section = $(id);
    if (section.length > 0) {
        activeSection.slideUp(500);
        console.log(activeSection.attr('id'));
        if (activeSection.attr('id') !== 'tests-editor') {
            previousSection = activeSection;
        }
        activeSection = section;
        activeSection.slideDown(500);
        setTimeout(function () {
            codeEditor.refresh();
            testsEditor.refresh();
        }, 10);
    }
}

function goToPrevious() {
    goToSection('#' + previousSection.attr('id'));
}

function createPHPEditor(id) {
    return CodeMirror.fromTextArea(document.getElementById(id), {
        lineNumbers: true,
        theme: 'monokai',
        mode: "application/x-httpd-php",
        indentUnit: 4,
        indentWithTabs: false,
        extraKeys: {
            "F11": function(cm) {
                cm.setOption("fullScreen", !cm.getOption("fullScreen"));
            },
            "Ctrl-Enter": function(cm) {
                cm.setOption("fullScreen", !cm.getOption("fullScreen"));
            },
            "Esc": function(cm) {
                if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
            }
        }
    });
}

/*
 * On window ready
 */

$(document).ready(function () {
    // Initialize config
    PHPUnitGen.parseConfig();

    if (PHPUnitGen.getConfigElem('dark-theme') === 1) {
        toggleDarkTheme();
    }

    // Initialize navbar
    $('.button-collapse').sideNav({
        closeOnClick: true,
        draggable: true
    });

    // Initialize dropdown
    $('button.actions').dropdown({constrainWidth: false});

    // Initialize modals
    $('.modal').modal();
    $('#dark-theme-switch').on('change', function () {
        toggleDarkTheme();
    });
    $('#modal-config').find('input').each(function () {
        var value = PHPUnitGen.getConfigElem($(this).attr('name'));
        if ($(this).attr('type') === 'checkbox' && value === 1) {
            $(this).prop('checked', true);
        } else if (value !== null) {
            $(this).val(value);
        }
        $(this).on('change', function () {
            PHPUnitGen.saveConfigElem($(this));
        });
    });

    // Initialize editors
    codeEditor = createPHPEditor('code-textarea');
    codeEditor.setSize(null, 500);
    testsEditor = createPHPEditor('tests-textarea');
    testsEditor.setSize(null, 500);

    // Initialize clipboard.js
    new Clipboard('button.copy', {
        text: function() {
            infoToast('Tests code copied to clipboard!');
            return testsEditor.getValue();
        }
    });

    // Initialize listeners
    $('input[name="file"]').on('change', function () {
        var files = $(this).prop('files');
        if (0 in files) {
            var file = files[0];
            var fileReader = new FileReader();
            fileReader.onload = function () {
                PHPUnitGen.requestParsing(fileReader.result);
            };
            fileReader.readAsText(file);
        }
    });
    $('button.parse').on('click', function () {
        PHPUnitGen.requestParsing(codeEditor.getValue());
    });
    $('button.rerun').on('click', function () {
        PHPUnitGen.requestParsing();
    });
    $('button.download').on('click', function () {
        download('Test.php', testsEditor.getValue());
    });
    $('button.previous').on('click', function () {
        goToPrevious();
    });
    $('body').on('click', '.toast-action.dismiss-button', function () {
        var toastElem = $(this).closest('.toast')[0];
        var toast = toastElem.M_Toast;
        toast.remove();
    });
});

/*
 * Utils
 */

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
