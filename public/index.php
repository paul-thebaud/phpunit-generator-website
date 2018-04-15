<?php

if (PHP_SAPI == 'cli-server') {
    // To help the built-in PHP dev server, check if the request was actually for
    // something which should probably be served as a static file
    $url  = parse_url($_SERVER['REQUEST_URI']);
    $file = __DIR__ . $url['path'];
    if (is_file($file)) {
        return false;
    }
}

require __DIR__ . '/../vendor/autoload.php';

// Build settings, and merge dev settings if exists
$settings = require __DIR__ . '/../src/config/settings.php';
if (file_exists(__DIR__ . '/../src/config/local.php')) {
    $localSettings = require __DIR__ . '/../src/config/local.php';
    $settings = array_merge($settings, $localSettings);
}
$settings = ['settings' => $settings];

// If debug is enabled, display all PHP errors
if ($settings['settings']['displayErrorDetails'] === true) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
}

// Instantiate app
$app = new \Slim\App($settings);

// Set up dependencies
require __DIR__ . '/../src/config/dependencies.php';

// Register middleware
require __DIR__ . '/../src/config/middleware.php';

// Register routes
require __DIR__ . '/../src/config/routes.php';

// Run app
$app->run();
