<?php

namespace App\Controllers;

use App\Models\CustomerModel;
use PDO;

class CustomerController
{
    private $customer_model;

    public function __construct(PDO $pdo)
    {
        $this->customer_model = new CustomerModel($pdo);
    }

    public function index()
    {
        echo json_encode($this->customer_model->all());
    }

    public function show($id)
    {
        $customer = $this->customer_model->find($id);

        if (!$customer) {
            http_response_code(404);
            echo json_encode(['error' => 'Customer not found.']);
            
            return;
        }

        echo json_encode($customer);
    }

    public function store()
    {
        $customer = json_decode(file_get_contents('php://input'), true);

        $id = $this->customer_model->create($customer);

        echo json_encode(['id' => $id]);
    }

    public function update($id)
    {
        $customer = json_decode(file_get_contents('php://input'), true);
        $this->customer_model->update($id, $customer);

        echo json_encode(['id' => $id]);
    }

    public function destroy($id)
    {
        $this->customer_model->destroy($id);

        echo json_encode(['id' => $id]);
    }
}
