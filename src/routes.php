<?php

use PhpUnitGen\Website\Controller\AppController;

$app->any('/[{action}[/{page}.html]]', $app->getContainer()->get(AppController::class));
