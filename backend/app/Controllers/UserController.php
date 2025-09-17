<?php

namespace App\Controllers;

use App\Models\UserModel;
use PDO;

class UserController
{
    private $user_model;

    public function __construct(PDO $pdo)
    {
        $this->user_model = new UserModel($pdo);
    }

    public function index()
    {
        echo json_encode($this->user_model->all());
    }

    public function store()
    {
        $user = json_decode(file_get_contents('php://input'), true);

        $id = $this->user_model->create($user);

        echo json_encode(['id' => $id]);
    }

    public function show($id)
    {
        $user = $this->user_model->find($id);

        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found.']);
            
            return;
        }

        echo json_encode($user);
    }

    public function update($id)
    {
        $user = json_decode(file_get_contents('php://input'), true);
        $this->user_model->update($id, $user);

        echo json_encode(['id' => $id]);
    }

    public function destroy($id)
    {
        $this->user_model->destroy($id);

        echo json_encode(['id' => $id]);
    }
}
