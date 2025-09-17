<?php

use App\Controllers\AddressController;
use App\Controllers\CustomerController;
use App\Controllers\LoginController;
use App\Controllers\UserController;
use App\Middleware\AuthMiddleware;

$routes = [];

function add_route($method, $path, $controller, $action, $middleware = null)
{
    global $routes;

    if (!in_array($method, ['GET', 'POST', 'PUT', 'DELETE'])) {
        return;
    }

    $routes[strtoupper($method)][$path] = [
        'controller' => $controller,
        'action'     => $action,
        'middleware' => $middleware
    ];
}

add_route('POST', 'login', LoginController::class, 'store');
add_route('DELETE', 'logout', LoginController::class, 'destroy', AuthMiddleware::class);

add_route('GET', 'users', UserController::class, 'index', AuthMiddleware::class);
add_route('GET', 'users/{id}', UserController::class, 'show', AuthMiddleware::class);
add_route('POST', 'users', UserController::class, 'store', AuthMiddleware::class);
add_route('PUT', 'users/{id}', UserController::class, 'update', AuthMiddleware::class);
add_route('DELETE', 'users/{id}', UserController::class, 'destroy', AuthMiddleware::class);

add_route('GET', 'customers', CustomerController::class, 'index', AuthMiddleware::class);
add_route('GET', 'customers/{id}', CustomerController::class, 'show', AuthMiddleware::class);
add_route('POST', 'customers', CustomerController::class, 'store', AuthMiddleware::class);
add_route('PUT', 'customers/{id}', CustomerController::class, 'update', AuthMiddleware::class);
add_route('DELETE', 'customers/{id}', CustomerController::class, 'destroy', AuthMiddleware::class);

add_route('GET', 'addresses', AddressController::class, 'index', AuthMiddleware::class);
add_route('GET', 'addresses/{id}', AddressController::class, 'show', AuthMiddleware::class);
add_route('POST', 'addresses', AddressController::class, 'store', AuthMiddleware::class);
add_route('PUT', 'addresses/{id}', AddressController::class, 'update', AuthMiddleware::class);
add_route('DELETE', 'addresses/{id}', AddressController::class, 'destroy', AuthMiddleware::class);
