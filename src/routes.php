<?php

use PHPUnitGenerator\Config\Config;
use PHPUnitGenerator\Exception\ExceptionInterface\ExceptionInterface;
use PHPUnitGenerator\Generator\TestGenerator;
use Slim\Http\Request;
use Slim\Http\Response;

// Routes

/*
 * The index route
 */
$app->get('/', function (Request $request, Response $response, $args) {
    // Render index view
    return $this->renderer->render($response, 'index.phtml', $args);
});

/*
 * The render route
 */
$app->post('/render', function (Request $request, Response $response, $args) {
    if (! is_string($code = getCodeToParse($request))) {
        return $response->withJson([
            'status'  => false,
            'content' => 'Missing the code to parse.'
        ]);
    }
    try {
        $test = (new TestGenerator(new Config(getOptions($request))))
            ->generate($code);

        // Return tests code
        return $response->withJson([
            'status'  => true,
            'content' => $test
        ]);
    } catch (ExceptionInterface $exception) {
        // Return an error
        return $response->withJson([
            'status'  => false,
            'content' => $exception->getMessage()
        ]);
    }
});

function getOptions(Request $request) {
    $options = is_array($request->getParsedBodyParam('options')) ?
        $request->getParsedBodyParam('options') : [];
    foreach ($options as $key => $option) {
        $options[$key] = $option == true ? true : $option;
    }
    return $options;
}

function getCodeToParse(Request $request)
{
    $code = $request->getParsedBodyParam('code');
    if (is_string($code)) {
        return $code;
    }
    return null;
}
