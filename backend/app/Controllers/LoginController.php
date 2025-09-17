<?php

namespace App\Controllers;

use App\Models\UserModel;
use Firebase\JWT\JWT;
use PDO;

class LoginController
{
    private $user_model;

    public function __construct(PDO $pdo)
    {
        $this->user_model = new UserModel($pdo);
    }

    public function store()
    {
        $user = $this->user_model->findByField('email', $_POST['email']);

        if (!$user || !password_verify($_POST['password'], $user['password'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials.']);

            return;
        }

        $now     = time();
        $expires = $now + 1800;

        $payload = [
            'sub' => $user['id'],
            'iat' => $now,
            'exp' => $expires
        ];

        $jwt = JWT::encode($payload, $_ENV['JWT_SECRET'], 'HS256');

        setcookie('access_token', $jwt, [
            'expires'  => $expires,
            'path'     => '/',
            'secure'   => true,
            'httponly' => true,
            'samesite' => 'Lax'
        ]);

        echo json_encode(['message' => 'Login successful.']);
    }

    public function destroy()
    {
        setcookie('access_token', '', [
            'expires'  => 0,
            'path'     => '/',
            'secure'   => true,
            'httponly' => true,
            'samesite' => 'Lax'
        ]);

        echo json_encode(['message' => 'Logout successful.']);
    }
}
