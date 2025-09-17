<?php

namespace App\Models;

use PDO;

class CustomerModel
{
    private $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function all()
    {
        $stmt = $this->pdo->query("SELECT * FROM customers");

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function find($id)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM customers WHERE id = :id");
        $stmt->execute([':id' => $id]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($customer)
    {
        $stmt = $this->pdo->prepare("INSERT INTO customers (name, date_of_birth, cpf, rg, phone) VALUES (:name, :date_of_birth, :cpf, :rg, :phone)");
        $stmt->execute([
            ':name'          => $customer['name'],
            ':date_of_birth' => $customer['date_of_birth'],
            ':cpf'           => $customer['cpf'],
            ':rg'            => $customer['rg'],
            ':phone'         => $customer['phone']
        ]);

        return $this->pdo->lastInsertId();
    }

    public function update($id, $customer)
    {
        $stmt = $this->pdo->prepare("UPDATE customers SET name = :name, date_of_birth = :date_of_birth, cpf = :cpf, rg = :rg, phone = :phone WHERE id = :id");

        return $stmt->execute([
            ':name'          => $customer['name'],
            ':date_of_birth' => $customer['date_of_birth'],
            ':cpf'           => $customer['cpf'],
            ':rg'            => $customer['rg'],
            ':phone'         => $customer['phone'],
            ':id'            => $id
        ]);
    }

    public function destroy($id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM customers WHERE id = :id");

        return $stmt->execute([':id' => $id]);
    }
}
