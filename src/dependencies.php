<?php
// DIC configuration

use PhpUnitGen\Website\Controller\GenerateController;
use Psr\Container\ContainerInterface;
use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Views\PhpRenderer;

$container = $app->getContainer();

// View renderer
$container[PhpRenderer::class] = function (ContainerInterface $container): PhpRenderer {
    $settings = $container->get('settings')['renderer'];
    return new PhpRenderer($settings['template_path']);
};

// Controller
$container[GenerateController::class] = function (): GenerateController {
    return new GenerateController();
};

// 404 Not Found page
$container['notFoundHandler'] = function (ContainerInterface $container): callable {
    return function (Request $request, Response $response) use ($container) {
        return $container->get(PhpRenderer::class)->render($response->withStatus(404), 'error/404.phtml');
    };
};
$container['notAllowedHandler'] = function (ContainerInterface $container): callable {
    return function (Request $request, Response $response) use ($container) {
        return $container->get(PhpRenderer::class)->render($response->withStatus(405), 'error/405.phtml');
    };
};
