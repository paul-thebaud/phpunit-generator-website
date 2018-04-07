<?php

namespace PhpUnitGen\Website\Middleware;

use Slim\Collection;
use Slim\Http\Request;
use Slim\Http\Response;

/**
 * Class ResourceMiddleware.
 *
 * @author     Paul Thébaud <paul.thebaud29@gmail.com>.
 * @copyright  2017-2018 Paul Thébaud <paul.thebaud29@gmail.com>.
 * @license    https://opensource.org/licenses/MIT The MIT license.
 * @link       https://github.com/paul-thebaud/phpunit-generator-website
 * @since      Class available since Release 2.0.0.
 */
class ResourceMiddleware
{
    /**
     * When the requested resource is PhpUnitGen application.
     */
    const RESOURCE_APP = 'app';

    /**
     * When the requested resource is PhpUnitGen RESTFull API.
     */
    const RESOURCE_API = 'api';

    /**
     * When the requested resource is PhpUnitGen documentation.
     */
    const RESOURCE_DOC = 'doc';

    /**
     * @var Collection $settings The application configuration.
     */
    private $settings;

    /**
     * ResourceMiddleware constructor.
     *
     * @param Collection $settings The application configuration.
     */
    public function __construct(Collection $settings)
    {
        $this->settings = $settings;
    }

    /**
     * Check the request URI to detect the requested resource (APP, API or DOC), and save it as a request attribute.
     *
     * @param Request  $request  The input request.
     * @param Response $response The output response.
     * @param callable $next     The next middleware of application.
     *
     * @return Response The response returned by the found action.
     */
    public function __invoke(Request $request, Response $response, callable $next): Response
    {
        $host = $request->getUri()->getHost();

        if (strpos($host, $this->settings[ResourceMiddleware::RESOURCE_API]) !== false) {
            $request = $request->withAttribute('resource', ResourceMiddleware::RESOURCE_API);
        } else {
            if (strpos($host, $this->settings[ResourceMiddleware::RESOURCE_DOC]) !== false) {
                $request = $request->withAttribute('resource', ResourceMiddleware::RESOURCE_DOC);
            } else {
                $request = $request->withAttribute('resource', ResourceMiddleware::RESOURCE_APP);
            }
        }

        return $next($request, $response);
    }
}
