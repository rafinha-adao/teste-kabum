<?php

namespace App\Models;

use PDO;

class UserModel
{
    private $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function all()
    {
        $stmt = $this->pdo->query("SELECT * FROM users");

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function find($id)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->execute([':id' => $id]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findByField($field, $value)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE $field = :field");
        $stmt->execute([':field' => $value]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($user)
    {
        $stmt = $this->pdo->prepare("INSERT INTO users (name, email, password) VALUES (:name, :email, :password)");
        $stmt->execute([
            ':name'     => $user['name'],
            ':email'    => $user['email'],
            ':password' => password_hash($user['password'], PASSWORD_DEFAULT),
        ]);

        return $this->pdo->lastInsertId();
    }

    public function update($id, $user)
    {
        $stmt = $this->pdo->prepare("UPDATE users SET name = :name, email = :email, password = :password WHERE id = :id");

        return $stmt->execute([
            ':name'     => $user['name'],
            ':email'    => $user['email'],
            ':password' => password_hash($user['password'], PASSWORD_DEFAULT),
            ':id'       => $id
        ]);
    }

    public function destroy($id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM users WHERE id = :id");

        return $stmt->execute([':id' => $id]);
    }
}
