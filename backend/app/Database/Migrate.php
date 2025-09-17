<?php

require __DIR__ . "/../../vendor/autoload.php";

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . "/../../");
$dotenv->load();

require __DIR__ . "/../config/Database.php";

$migrations = glob(__DIR__ . '/Migrations/*.php');

sort($migrations);

foreach ($migrations as $migration) {
    require $migration;
}

echo "Migrations executed.\n";
