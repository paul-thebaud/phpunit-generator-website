<?php

use PhpUnitGen\Website\Middleware\ResourceMiddleware;

return [
    // Error and headers
    'displayErrorDetails'            => false,
    'addContentLengthHeader'         => false,

    // Renderer settings
    'renderer'                       => [
        'template_path' => __DIR__ . '/../templates/',
    ],

    // Cross-origin allowed website
    'crossOrigin'                    => ['https://phpunitgen.io', 'https://www.phpunitgen.io'],

    // Define the protocol to use
    'protocol'                       => 'https://',

    // App sub-domains
    ResourceMiddleware::RESOURCE_APP => 'phpunitgen.io',
    ResourceMiddleware::RESOURCE_API => 'api.phpunitgen.io',
    ResourceMiddleware::RESOURCE_DOC => 'doc.phpunitgen.io'
];
