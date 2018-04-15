<?php

use PhpUnitGen\Website\Middleware\CookieDestructorMiddleware;
use PhpUnitGen\Website\Middleware\CrossOriginMiddleware;
use PhpUnitGen\Website\Middleware\ResourceMiddleware;

$app->add($app->getContainer()->get(CrossOriginMiddleware::class));
$app->add($app->getContainer()->get(ResourceMiddleware::class));
$app->add($app->getContainer()->get(CookieDestructorMiddleware::class));
