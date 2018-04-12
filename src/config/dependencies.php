<?php
// DIC configuration

use PhpUnitGen\Website\Controller\AppController;
use PhpUnitGen\Website\Language\Language;
use PhpUnitGen\Website\Middleware\CrossOriginMiddleware;
use PhpUnitGen\Website\Middleware\ResourceMiddleware;
use Psr\Container\ContainerInterface;
use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Views\PhpRenderer;

$container = $app->getContainer();

// View renderer
$container[PhpRenderer::class] = function (ContainerInterface $container): PhpRenderer {
    $settings = $container->get('settings');
    $renderer = new PhpRenderer($settings['renderer']['template_path']);
    $renderer->setAttributes([
        ResourceMiddleware::RESOURCE_APP => $settings['protocol'] . $settings[ResourceMiddleware::RESOURCE_APP],
        ResourceMiddleware::RESOURCE_API => $settings['protocol'] . $settings[ResourceMiddleware::RESOURCE_API],
        ResourceMiddleware::RESOURCE_DOC => $settings['protocol'] . $settings[ResourceMiddleware::RESOURCE_DOC]
    ]);
    return $renderer;
};
// Language
$container[Language::class] = function (): Language {
    return new Language();
};

// Middleware
$container[CrossOriginMiddleware::class] = function (ContainerInterface $container): CrossOriginMiddleware {
    return new CrossOriginMiddleware($container->get('settings'));
};
$container[ResourceMiddleware::class]    = function (ContainerInterface $container): ResourceMiddleware {
    return new ResourceMiddleware($container->get('settings'));
};

// Controllers
$container[AppController::class] = function (ContainerInterface $container): AppController {
    return new AppController($container->get(PhpRenderer::class), $container->get(Language::class));
};

// 404 Not Found page
$container['notFoundHandler']   = function (ContainerInterface $container): callable {
    return function (Request $request, Response $response) use ($container) {
        return $container->get(PhpRenderer::class)
            ->render($response->withStatus(404), 'layout.phtml', ['view' => 'error/404.phtml']);
    };
};
$container['notAllowedHandler'] = function (ContainerInterface $container): callable {
    return function (Request $request, Response $response) use ($container) {
        return $container->get(PhpRenderer::class)
            ->render($response->withStatus(404), 'layout.phtml', ['view' => 'error/405.phtml']);
    };
};
