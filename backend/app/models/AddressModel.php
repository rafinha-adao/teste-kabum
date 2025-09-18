<?php

namespace App\Models;

use PDO;

class AddressModel
{
    private $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function all()
    {
        $stmt = $this->pdo->query("SELECT * FROM addresses");

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function find($id)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM addresses WHERE id = :id");
        $stmt->execute([':id' => $id]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($address)
    {
        $stmt = $this->pdo->prepare("INSERT INTO addresses (customer_id, street, number, district, city, state, zip_code) VALUES (:customer_id, :street, :number, :district, :city, :state, :zip_code)");
        $stmt->execute([
            ':customer_id' => $address['customer_id'],
            ':street'      => $address['street'],
            ':number'      => $address['number'],
            ':district'    => $address['district'],
            ':city'        => $address['city'],
            ':state'       => $address['state'],
            ':zip_code'    => $address['zip_code']
        ]);

        return $this->pdo->lastInsertId();
    }

    public function update($id, $address)
    {
        $stmt = $this->pdo->prepare("UPDATE addresses SET street = :street, number = :number, district = :district, city = :city, state = :state, zip_code = :zip_code WHERE id = :id");

        return $stmt->execute([
            ':street'   => $address['street'],
            ':number'   => $address['number'],
            ':district' => $address['district'],
            ':city'     => $address['city'],
            ':state'    => $address['state'],
            ':zip_code' => $address['zip_code'],
            ':id'       => $id
        ]);
    }

    public function destroy($id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM addresses WHERE id = :id");

        return $stmt->execute([':id' => $id]);
    }
}
