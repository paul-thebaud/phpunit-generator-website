<?php

use PhpUnitGen\Website\Controller\GenerateController;
use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Views\PhpRenderer;

// Routes

// Index route
$app->get('/', function (Request $request, Response $response) {
    return $this->get(PhpRenderer::class)->render($response, 'index.phtml');
});

// Documentation content route
$app->get('/documentation', function (Request $request, Response $response) {
    return $this->get(PhpRenderer::class)->render($response, 'section/documentation.phtml');
});

// Tests skeletons generation
$app->post('/generate', function (Request $request, Response $response) {
    return $this->get(GenerateController::class)->generateAction($request, $response);
});

// FR version of the article about PhpUnitGen
$app->get('/article', function (Request $request, Response $response) {
    return $this->get(PhpRenderer::class)->render($response, 'fr-article.html');
});
