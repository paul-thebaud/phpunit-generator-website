<?php

namespace PhpUnitGen\Website\Middleware;

use Slim\Collection;
use Slim\Http\Request;
use Slim\Http\Response;

class ResourceMiddleware
{
    const RESOURCE_APP = 'app';
    const RESOURCE_API = 'api';
    const RESOURCE_DOC = 'doc';

    protected $settings;

    public function __construct(Collection $settings)
    {
        $this->settings = $settings;
    }

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
