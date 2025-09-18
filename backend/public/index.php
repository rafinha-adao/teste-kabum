<?php

header("Content-type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);

    exit;
}

require __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

require __DIR__ . '/../app/Config/Database.php';
require __DIR__ . '/../app/Config/Routes.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri    = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

$segments = explode('/', $uri);
$id       = $segments[1] ?? null;

if (!empty($id)) {
    $uri = str_replace($id, '{id}', $uri);
}

if (!isset($routes[$method][$uri])) {
    http_response_code(404);
    echo json_encode(['error' => 'Route not found.']);

    return;
}

$route = $routes[$method][$uri];

if (isset($route['middleware']) && class_exists($route['middleware'])) {
    $middleware = new $route['middleware'];

    if (method_exists($middleware, 'handle')) {
        $middleware->handle();
    }
}

$controller_class = $route['controller'];

if (!class_exists($controller_class)) {
    http_response_code(500);
    echo json_encode(['error' => "Controller class {$controller_class} not found."]);

    return;
}

$controller = new $controller_class($pdo);

$action = $route['action'];

if (!method_exists($controller, $action)) {
    http_response_code(500);
    echo json_encode(['error' => "Método {$action} não encontrado no controller"]);

    return;
}

if (!empty($id)) {
    return $controller->$action($id);
}

return $controller->$action();
