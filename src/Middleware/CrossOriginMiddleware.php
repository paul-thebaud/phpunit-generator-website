<?php

/**
 * This file is part of PhpUnitGen web application.
 *
 * (c) 2017-2018 Paul Thébaud <paul.thebaud29@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace PhpUnitGen\Website\Middleware;

use Slim\Collection;
use Slim\Http\Request;
use Slim\Http\Response;

/**
 * Class CrossOriginMiddleware.
 *
 * @author     Paul Thébaud <paul.thebaud29@gmail.com>.
 * @copyright  2017-2018 Paul Thébaud <paul.thebaud29@gmail.com>.
 * @license    https://opensource.org/licenses/MIT The MIT license.
 * @link       https://github.com/paul-thebaud/phpunit-generator-website
 * @since      Class available since Release 2.0.0.
 */
class CrossOriginMiddleware
{
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
     * Manage Cross Origin questions. If the requested resource is API, and HTTP_ORIGIN is not allowed, return a
     * response with status 401. It the HTTP_ORIGIN is allowed, add the Allow-Origin header.
     *
     * @param Request  $request  The input request.
     * @param Response $response The output response.
     * @param callable $next     The next middleware of application.
     *
     * @return Response The response returned by the found action.
     */
    public function __invoke(Request $request, Response $response, callable $next): Response
    {
        // Carry about Cross Origin only if it is an API request
        if ($request->getAttribute('resource') === ResourceMiddleware::RESOURCE_API) {
            // Retrieve origin of request
            $origin = $request->getServerParam('HTTP_ORIGIN', '');
            if ($origin !== '' && in_array($origin, $this->settings['crossOrigin'])) {
                // If origin is allowed, add header
                $response = $response->withHeader('Access-Control-Allow-Origin', $origin);
            } else {
                // Else, refuse the request
                return $response->withStatus(403)->withJson([
                    'code'    => 403,
                    'content' => "Not authorized because of Cross-Origin.\n"
                        . " PhpUnitGen RESTFull API is only available for phpunitgen.io domain.\n"
                        . " Please contact server administrator to get an access."
                ]);
            }
        }

        return $next($request, $response);
    }
}
