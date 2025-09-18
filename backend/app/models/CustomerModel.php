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
        $stmt = $this->pdo->prepare("
            SELECT 
                c.id AS customer_id,
                c.name,
                c.date_of_birth,
                c.cpf,
                c.rg,
                c.phone,
                a.id AS address_id,
                a.zip_code,
                a.street,
                a.number,
                a.district,
                a.city,
                a.state
            FROM customers c
            LEFT JOIN addresses a ON c.id = a.customer_id
            WHERE c.id = :id
        ");
        $stmt->execute([':id' => $id]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!$rows) {
            return null;
        }

        $customer = [
            'id'            => $rows[0]['customer_id'],
            'name'          => $rows[0]['name'],
            'date_of_birth' => $rows[0]['date_of_birth'],
            'cpf'           => $rows[0]['cpf'],
            'rg'            => $rows[0]['rg'],
            'phone'         => $rows[0]['phone'],
            'addresses'     => []
        ];

        foreach ($rows as $row) {
            if ($row['address_id']) {
                $customer['addresses'][] = [
                    'id'       => $row['address_id'],
                    'zip_code' => $row['zip_code'],
                    'street'   => $row['street'],
                    'number'   => $row['number'],
                    'district' => $row['district'],
                    'city'     => $row['city'],
                    'state'    => $row['state']
                ];
            }
        }

        return $customer;
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
