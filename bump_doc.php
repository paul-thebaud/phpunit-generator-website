#!/usr/bin/env php
<?php

require __DIR__ . '/vendor/autoload.php';

use League\HTMLToMarkdown\HtmlConverter;

function logWithDate(string $message)
{
    echo sprintf("%s %s\n", date('Y-m-d H:i:s'), $message);
}

$removes = [
    '#<div class="card [a-z]+ lighten-2">\s*<div class="card-content">#',
    '#<i class="material-icons left">info</i>#',
    '#<h4>Next step<\\/h4>[\s\S]+$#',
    '#<h4>Etape suivante<\\/h4>[\s\S]+$#',
    '#<sup><i class="material-icons tiny">open_in_new<\\/i><\\/sup>#'
];

$languages = ['en', 'fr'];

$files = [
    'installation',
    'website',
    'terminal',
    'php',
    'annotations',
];

logWithDate('Begin MarkDown documentation conversion');

$converter = new HtmlConverter();

foreach ($languages as $language) {
    logWithDate('Begin language "' . $language . '"');
    foreach ($files as $file) {
        $sourcePath = sprintf('%s/templates/doc/%s/%s.phtml', __DIR__, $language, $file);
        $targetPath = sprintf('%s/build/doc/%s/%s.md', __DIR__, $language, $file);

        $sourceContent = file_get_contents($sourcePath);
        foreach ($removes as $remove) {
            $sourceContent = preg_replace($remove, '', $sourceContent);
        }

        file_put_contents($targetPath, $converter->convert($sourceContent));
    }
    logWithDate('Finish language "' . $language . '"');
}

logWithDate('Begin ZIP file creation');

$zip = new ZipArchive();
$file = __DIR__ . '/public/assets/doc/doc.zip';

if ($zip->open($file, ZipArchive::CREATE) !== true) {
    logWithDate('Error during creating zip file with path "' . $file . '"');
}


foreach ($languages as $language) {
    logWithDate('Begin adding files of language "' . $language . '" to ZIP file');
    foreach ($files as $file) {
        $sourcePath = sprintf('%s/build/doc/%s/%s.md', __DIR__, $language, $file);
        $targetPath = sprintf('/%s/%s.md', $language, $file);
        $zip->addFile($sourcePath, $targetPath);
    }
    logWithDate('Finish adding files of language "' . $language . '" to ZIP file');
}

$zip->close();

logWithDate('Finish ZIP file creation');

return 0;
