<?php

namespace App\Controllers;

use App\Models\AddressModel;
use PDO;

class AddressController
{
    private $address_model;

    public function __construct(PDO $pdo)
    {
        $this->address_model = new AddressModel($pdo);
    }

    public function index()
    {
        echo json_encode($this->address_model->all());
    }

    public function show($id)
    {
        $address = $this->address_model->find($id);

        if (!$address) {
            http_response_code(404);
            echo json_encode(['error' => 'Address not found.']);
            
            return;
        }

        echo json_encode($address);
    }

    public function store()
    {
        $address = json_decode(file_get_contents('php://input'), true);

        $id = $this->address_model->create($address);

        echo json_encode(['id' => $id]);
    }

    public function update($id)
    {
        $address = json_decode(file_get_contents('php://input'), true);
        $this->address_model->update($id, $address);

        echo json_encode(['id' => $id]);
    }

    public function destroy($id)
    {
        $this->address_model->destroy($id);

        echo json_encode(['id' => $id]);
    }
}
