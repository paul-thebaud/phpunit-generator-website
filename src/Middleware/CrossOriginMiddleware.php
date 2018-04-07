<?php

namespace PhpUnitGen\Website\Middleware;

use Slim\Collection;
use Slim\Http\Request;
use Slim\Http\Response;

class CrossOriginMiddleware
{

    protected $settings;

    public function __construct(Collection $settings)
    {
        $this->settings = $settings;
    }

    public function __invoke(Request $request, Response $response, callable $next): Response
    {
        $origin = $request->getServerParam('HTTP_ORIGIN');
        if ($origin !== null && !in_array($origin, $this->settings['crossOrigin'])) {
            var_dump('NOT ALLOWED');
            return $response->withStatus(200, 'Cross origin not allowed');
        } else {
            $response = $response->withHeader('Access-Control-Allow-Origin', $origin);
        }

        return $next($request, $response);
    }
}
