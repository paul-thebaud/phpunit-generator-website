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

use Slim\Http\Request;
use Slim\Http\Response;

/**
 * Class CookieDestructorMiddleware.
 *
 * @author     Paul Thébaud <paul.thebaud29@gmail.com>.
 * @copyright  2017-2018 Paul Thébaud <paul.thebaud29@gmail.com>.
 * @license    https://opensource.org/licenses/MIT The MIT license.
 * @link       https://github.com/paul-thebaud/phpunit-generator-website
 * @since      Class available since Release 2.1.6.
 */
class CookieDestructorMiddleware
{
    /**
     * Destruct all cookies of the website (for example the PHPSESSID if set).
     *
     * @param Request  $request  The input request.
     * @param Response $response The output response.
     * @param callable $next     The next middleware of application.
     *
     * @return Response The response returned by the found action.
     */
    public function __invoke(Request $request, Response $response, callable $next): Response
    {
        if (isset($_SERVER['HTTP_COOKIE'])) {
            $cookies = explode(';', $_SERVER['HTTP_COOKIE']);
            // Foreach cookies delete it
            foreach ($cookies as $cookie) {
                $parts = explode('=', $cookie);
                $name  = trim($parts[0]);
                setcookie($name, '', time() - 1000);
                setcookie($name, '', time() - 1000, '/');
            }
        }

        return $next($request, $response);
    }
}
