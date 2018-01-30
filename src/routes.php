<?php

use Slim\Http\Request;
use Slim\Http\Response;

// Routes

/**
 * Get the index page content.
 */
$app->get('/', function (Request $request, Response $response, $args) {
    return $this->renderer->render($response, 'index.phtml');
});

/**
 * Get the documentation html content.
 */
$app->get('/documentation', function (Request $request, Response $response, $args) {
    return $this->renderer->render($response, 'section/documentation.phtml');
});

/**
 * Give a code to parse and a configuration.
 */
$app->post('/render', function (Request $request, Response $response, $args) {
    return $response->withJson([
        'code' => 422,
        'content' => 'No PhpUnitGen service set for the moment'
    ]);
    /*
    if (! is_string($code = $request->getParsedBodyParam('code'))) {
        return $response->withJson([
            'code' => 422,
            'content' => 'Invalid code sent, code params must be a string'
        ]);
    }
    try {
        $config = new BaseConfig($request->getParsedBodyParam('config'));
        $container = (new ContainerFactory())->invoke($config);
        $testCode = $container->get(ExecutorInterface::class)->invoke($code);

        return $response->withJson([
            'code' => 200,
            'content' => $testCode
        ]);
    } catch (Exception $exception) {
        return $response->withJson([
            'code' => 422,
            'content' => $exception->getMessage()
        ]);
    }
    */
});
