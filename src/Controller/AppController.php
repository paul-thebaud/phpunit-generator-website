<?php

/**
 * This file is part of PhpUnitGen web application.
 *
 * (c) 2017-2018 Paul Thébaud <paul.thebaud29@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace PhpUnitGen\Website\Controller;

use PhpUnitGen\Configuration\BaseConfig;
use PhpUnitGen\Container\ContainerFactory;
use PhpUnitGen\Exception\Exception;
use PhpUnitGen\Executor\ExecutorInterface\ExecutorInterface;
use PhpUnitGen\Website\Language\Language;
use PhpUnitGen\Website\Middleware\ResourceMiddleware;
use Slim\Exception\MethodNotAllowedException;
use Slim\Exception\NotFoundException;
use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Views\PhpRenderer;

/**
 * Class AppController.
 *
 * @author     Paul Thébaud <paul.thebaud29@gmail.com>.
 * @copyright  2017-2018 Paul Thébaud <paul.thebaud29@gmail.com>.
 * @license    https://opensource.org/licenses/MIT The MIT license.
 * @link       https://github.com/paul-thebaud/phpunit-generator-website
 * @since      Class available since Release 2.0.0.
 */
class AppController
{
    /**
     * Available routes for the application, by requested resource and method.
     */
    const ROUTES = [
        ResourceMiddleware::RESOURCE_APP => [
            'GET' => [
                'index' => 'indexAction'
            ]
        ],
        ResourceMiddleware::RESOURCE_API => [
            'GET'  => [
                'app-view' => 'appViewAction'
            ],
            'POST' => [
                'invoke-generator' => 'invokeGeneratorAction'
            ],
        ],
        ResourceMiddleware::RESOURCE_DOC => [
            'GET' => [
                '*' => 'documentationAction'
            ]
        ],
    ];

    /**
     * @var PhpRenderer $renderer The PhpRenderer to render HTML view.
     */
    private $renderer;

    /**
     * @var Language $language The Language to use multi languages documentation.
     */
    private $language;

    /**
     * AppController constructor.
     *
     * @param PhpRenderer $renderer The PhpRenderer to render HTML view.
     * @param Language    $language The Language to use multi languages documentation.
     */
    public function __construct(PhpRenderer $renderer, Language $language)
    {
        $this->renderer = $renderer;
        $this->language = $language;
    }

    /**
     * Filter requests on requested resource, method and action, and execute the found action.
     *
     * @param Request  $request  The input request.
     * @param Response $response The output response.
     *
     * @return Response The response returned by the found action.
     *
     * @throws MethodNotAllowedException If the method is not allowed for this resource or action.
     * @throws NotFoundException If the action is not available.
     */
    public function __invoke(Request $request, Response $response): Response
    {
        $resource = $request->getAttribute('resource');
        $method   = $request->getMethod();

        // Check if resource has routes for the requested method.
        if (!isset(AppController::ROUTES[$resource][$method])) {
            throw new MethodNotAllowedException($request, $response, array_keys(AppController::ROUTES[$resource]));
        }

        // Retrieve the requested action.
        $actionMethod = AppController::ROUTES[$resource][$method][$request->getAttribute('action', 'index')] ?? null;
        if ($actionMethod === null) {
            // If any action is mapped with the same method.
            if (isset(AppController::ROUTES[$resource][$method]['*'])) {
                $actionMethod = AppController::ROUTES[$resource][$method]['*'];
            } else {
                throw new NotFoundException($request, $response);
            }
        }

        return $this->$actionMethod($request, $response);
    }

    /*
     ******************************************************************************
     *
     * APP resource actions.
     *
     ******************************************************************************
     */

    /**
     * Render the app view (HTML code of the page).
     *
     * @param Request  $request  The input request.
     * @param Response $response The output response.
     *
     * @return Response The updated output response.
     */
    public function indexAction(Request $request, Response $response): Response
    {
        return $this->renderer->render($response, 'layout.phtml', ['view' => 'app/index.phtml', 'isApp' => true]);
    }

    /*
     ******************************************************************************
     *
     * API resource actions.
     *
     ******************************************************************************
     */

    /**
     * Render the app view (HTML content of body).
     *
     * @param Request  $request  The input request.
     * @param Response $response The output response.
     *
     * @return Response The updated output response.
     */
    public function appViewAction(Request $request, Response $response): Response
    {
        return $this->renderer->render($response, 'api/index.phtml');
    }

    /**
     * Generate unit tests skeletons based on a request.
     *
     * @param Request  $request  The input request.
     * @param Response $response The output response.
     *
     * @return Response The updated output response.
     */
    public function invokeGeneratorAction(Request $request, Response $response): Response
    {
        // Retrieve code
        if (!is_string($code = $request->getParsedBodyParam('code'))) {
            return $response->withJson([
                'code'    => 422,
                'content' => 'Invalid code sent, code parameter must be a string'
            ]);
        }
        // Retrieve class name
        $name = $request->getParsedBodyParam('name', '');
        if (!is_string($name)) {
            return $response->withJson([
                'code'    => 422,
                'content' => 'Invalid file name sent, name parameter must be a string'
            ]);
        }

        // Get configuration
        $configArray = $request->getParsedBodyParam('config');

        // Clean configuration
        if (is_array($configArray)) {
            $configArray = $this->cleanBoolean($configArray, 'private');
            $configArray = $this->cleanBoolean($configArray, 'interface');
            $configArray = $this->cleanBoolean($configArray, 'auto');
            if (!isset($configArray['phpdoc'])) {
                $configArray['phpdoc'] = [];
            }
        }

        // Call PhpUnitGen
        try {
            $config    = new BaseConfig($configArray);
            $container = (new ContainerFactory())->invoke($config);
            if (strlen($name) > 0) {
                $testCode = $container->get(ExecutorInterface::class)->invoke($code, $name);
            } else {
                $testCode = $container->get(ExecutorInterface::class)->invoke($code);
            }
            return $response->withJson([
                'code'    => 200,
                'content' => $testCode
            ]);
        } catch (Exception $exception) {
            return $response->withJson([
                'code'    => 422,
                'content' => $exception->getMessage()
            ]);
        }
    }

    /**
     * Clean a boolean value on the configuration array.
     *
     * @param array  $configArray The configuration array.
     * @param string $key         The key to clean in the array.
     *
     * @return array The updated configuration array.
     */
    private function cleanBoolean(array $configArray, string $key): array
    {
        if (isset($configArray[$key])) {
            if ($configArray[$key] === 'true') {
                $configArray[$key] = true;
            }
            if ($configArray[$key] === 'false') {
                $configArray[$key] = false;
            }
        }
        return $configArray;
    }

    /*
     ******************************************************************************
     *
     * DOC resource actions.
     *
     ******************************************************************************
     */

    /**
     * Display every available page of the documentation.
     *
     * @param Request  $request  The input request.
     * @param Response $response The output response.
     *
     * @return Response The updated output response.
     *
     * @throws NotFoundException If the requested language or page is not available.
     */
    public function documentationAction(Request $request, Response $response): Response
    {
        $language = $request->getAttribute('action', 'en');
        $page     = $request->getAttribute('page');

        if (!isset(Language::LANGUAGES[$language])
            || ($page !== null && !isset(Language::LANGUAGES[$language][$page]))
        ) {
            throw new NotFoundException($request, $response);
        }

        $page = $page ?? 'index';

        return $this->renderer->render($response, 'doc/layout.phtml', [
            'view'     => sprintf('%s/%s.phtml', $language, $page),
            'language' => $language,
            'page'     => $page
        ]);
    }
}
