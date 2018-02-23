<?php
// Application middleware

use Slim\Http\Request;
use Slim\Http\Response;

// Force HTTPS
/*
$app->add(function (Request $request, Response $response, $next) {
    if ($request->getUri()->getScheme() !== 'https') {
        $uri = $request->getUri()->withScheme("https")->withPort(null);
        return $response->withRedirect((string)$uri);
    } else {
        return $next($request, $response);
    }
});
*/
