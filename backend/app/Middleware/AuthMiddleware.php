<?php

namespace App\Middleware;

use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware
{
    public function handle()
    {
        $secret = $_ENV['JWT_SECRET'];

        if ($_SERVER['REQUEST_URI'] == '/me') {
            if (empty($_COOKIE['access_token'])) {
                echo json_encode(false);

                exit;
            }

            try {
                $payload = JWT::decode($_COOKIE['access_token'], new Key($secret, 'HS256'));

                echo json_encode($payload);
            } catch (ExpiredException $e) {
                echo json_encode(false);
            }

            exit;
        }

        if (empty($_COOKIE['access_token'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Token not provided.']);

            exit;
        }

        try {
            $payload = JWT::decode($_COOKIE['access_token'], new Key($secret, 'HS256'));
        } catch (ExpiredException $e) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid or expired token.']);

            exit;
        }
    }
}
