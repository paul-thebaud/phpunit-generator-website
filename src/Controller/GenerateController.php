<?php

namespace PhpUnitGen\Website\Controller;

use Exception;
use PhpUnitGen\Configuration\BaseConfig;
use PhpUnitGen\Container\ContainerFactory;
use PhpUnitGen\Executor\ExecutorInterface\ExecutorInterface;
use Psr\Http\Message\ResponseInterface;
use Slim\Http\Request;
use Slim\Http\Response;

/**
 * Class GenerateController.
 */
class GenerateController
{
    /**
     * Generate unit tests skeletons based on a request.
     *
     * @param Request  $request  The input request.
     * @param Response $response The output response.
     *
     * @return ResponseInterface The updated output response.
     */
    public function generateAction(Request $request, Response $response): ResponseInterface
    {
        // Retrieve code
        if (! is_string($code = $request->getParsedBodyParam('code'))) {
            return $response->withJson([
                'code'    => 422,
                'content' => 'Invalid code sent, code parameter must be a string'
            ]);
        }
        // Retrieve class name
        $name = $request->getParsedBodyParam('name', '');
        if (! is_string($name)) {
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
            if (! isset($configArray['phpdoc'])) {
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
}