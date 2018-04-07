<?php

use PhpUnitGen\Website\Middleware\CrossOriginMiddleware;
use PhpUnitGen\Website\Middleware\ResourceMiddleware;

$app->add($app->getContainer()->get(CrossOriginMiddleware::class));
$app->add($app->getContainer()->get(ResourceMiddleware::class));
