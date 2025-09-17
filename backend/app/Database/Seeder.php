<?php

require __DIR__ . "/../../vendor/autoload.php";

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . "/../../");
$dotenv->load();

require __DIR__ . "/../config/Database.php";

$pdo->exec("INSERT INTO users (name, email, password) VALUES ('Usuário Admin', 'usuario@admin.com','" . password_hash("usu@ri0Adm1n", PASSWORD_DEFAULT) . "');");

$first_names = [
    "Lucas",
    "Gabriel",
    "Mariana",
    "Beatriz",
    "Felipe",
    "Larissa",
    "Rafael",
    "Camila",
    "Thiago",
    "Juliana",
    "Bruno",
    "Aline",
    "Gustavo",
    "Patricia",
    "Fernando",
    "Carla",
    "André",
    "Renata",
    "Diego",
    "Fernanda"
];

$last_names = [
    "Silva",
    "Santos",
    "Oliveira",
    "Souza",
    "Pereira",
    "Costa",
    "Rodrigues",
    "Almeida",
    "Lima",
    "Gomes",
    "Martins",
    "Barbosa",
    "Mendes",
    "Ribeiro",
    "Carvalho",
    "Fernandes",
    "Araújo",
    "Moura",
    "Nogueira",
    "Dias"
];

$clients = [];

for ($i = 1; $i <= 100; $i++) {
    $name  = $first_names[array_rand($first_names)] . " " . $last_names[array_rand($last_names)];
    $dob   = date('Y-m-d', strtotime("-" . rand(18, 60) . " years"));
    $cpf   = str_pad(rand(10000000000, 99999999999), 11, '0', STR_PAD_LEFT);
    $rg    = str_pad(rand(1000000, 99999999), 8, '0', STR_PAD_LEFT);
    $phone = "55" . rand(1000000000, 9999999999);

    $pdo->exec("INSERT INTO customers (name, date_of_birth, cpf, rg, phone) VALUES ('$name', '$dob', '$cpf', '$rg', '$phone')");

    $clients[] = $pdo->lastInsertId();
}

$locations = [
    "São Paulo" => [
        "state" => "São Paulo",
        "districts" => [
            "Centro",
            "Jardins",
            "Vila Mariana",
            "Moema",
            "Pinheiros"
        ]
    ],
    "Rio de Janeiro" => [
        "state" => "Rio de Janeiro",
        "districts" => [
            "Copacabana",
            "Ipanema",
            "Barra",
            "Botafogo",
            "Santa Teresa"
        ]
    ],
    "Belo Horizonte" => [
        "state" => "Minas Gerais",
        "districts" => [
            "Savassi",
            "Funcionários",
            "Santa Efigênia",
            "Centro",
            "Lourdes"
        ]
    ],
    "Curitiba" => [
        "state" => "Paraná",
        "districts" => [
            "Centro",
            "Batel",
            "Ahú",
            "Juventude",
            "Cachoeira"
        ]
    ],
    "Porto Alegre" => [
        "state" => "Rio Grande do Sul",
        "districts" => [
            "Centro",
            "Cidade Baixa",
            "Moinhos de Vento",
            "Petrópolis",
            "Menino Deus"
        ]
    ]
];

$streets = [
    "Rua das Flores",
    "Avenida Brasil",
    "Rua do Sol",
    "Praça da Liberdade",
    "Rua Augusta",
    "Avenida Paulista",
    "Rua Sete de Setembro",
    "Rua Marechal Deodoro",
    "Travessa dos Cravos",
    "Rua Pernambuco",
    "Rua Amazonas",
    "Avenida Rio Branco",
    "Rua Paraíba",
    "Rua Ceará",
    "Rua Espírito Santo",
    "Avenida Goiás",
    "Rua Maranhão",
    "Rua Mato Grosso",
    "Rua Minas Gerais",
    "Avenida Amazonas",
    "Rua Bahia",
    "Rua Pará",
    "Rua Santa Catarina",
    "Rua Rio Grande do Sul",
    "Rua Rio Grande do Norte",
    "Rua Sergipe",
    "Rua Tocantins",
    "Rua Acre",
    "Rua Alagoas",
    "Rua Amapá",
    "Rua Rondônia",
    "Rua Roraima",
    "Rua Distrito Federal",
    "Rua Piauí",
    "Rua Pernambuco",
    "Rua Paraíba",
    "Rua Paraná",
    "Rua São Paulo",
    "Rua Rio de Janeiro",
    "Rua Minas Gerais",
    "Avenida Independência",
    "Rua das Palmeiras",
    "Rua das Orquídeas",
    "Rua das Acácias",
    "Rua das Violetas",
    "Rua das Laranjeiras",
    "Rua das Rosas",
    "Rua das Margaridas",
    "Rua dos Girassóis",
    "Rua das Hortênsias",
    "Rua das Magnólias"
];

for ($i = 1; $i <= 200; $i++) {
    $customer_id = $clients[array_rand($clients)];
    $city_names  = array_keys($locations);
    $city        = $city_names[array_rand($city_names)];
    $state       = $locations[$city]['state'];
    $district    = $locations[$city]['districts'][array_rand($locations[$city]['districts'])];
    $street      = $streets[array_rand($streets)];
    $number      = rand(1, 200);
    $zip_code    = str_pad(rand(10000000, 99999999), 8, '0', STR_PAD_LEFT);

    $pdo->exec("INSERT INTO addresses (customer_id, street, number, district, city, state, zip_code) VALUES ('$customer_id', '$street', '$number', '$district', '$city', '$state', '$zip_code')");
}

echo "Seeder executed.\n";
