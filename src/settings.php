<?php
return [
    'settings' => [
        // Error and headers
        'displayErrorDetails' => false, // set to false in production
        'addContentLengthHeader' => false, // Allow the web server to send the content-length header

        // Renderer settings
        'renderer' => [
            'template_path' => __DIR__ . '/../templates/',
        ],

        // App sub-domains
        'apiDomain' => 'api.phpunitgen.io',
        'documentationDomain' => 'doc.phpunitgen.io'
    ],
];
