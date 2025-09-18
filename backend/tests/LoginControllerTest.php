<?php

use App\Controllers\LoginController;
use PHPUnit\Framework\TestCase;

class LoginControllerTest extends TestCase
{
    private $login;

    protected function setUp(): void
    {
        $_ENV['JWT_SECRET'] = 'usu@ri0Adm1n';

        $mock_stmt = $this->createMock(PDOStatement::class);

        $mock_stmt->method('execute')->willReturn(true);

        $mock_stmt->method('fetch')->willReturnCallback(function () {
            return [
                'id'       => 1,
                'email'    => 'usuario@admin.com',
                'password' => password_hash('usu@ri0Adm1n', PASSWORD_DEFAULT)
            ];
        });

        $mock_pdo = $this->createMock(PDO::class);
        $mock_pdo->method('prepare')->willReturn($mock_stmt);

        $this->login = new LoginController($mock_pdo);
    }

    public function testLoginReturnsSuccessWithValidCredentials()
    {
        ob_start();

        $this->login->store([
            'email'    => 'usuario@admin.com',
            'password' => 'usu@ri0Adm1n'
        ]);

        $output   = ob_get_clean();
        $response = json_decode($output, true);

        $this->assertEquals('Login successful.', $response['message'], 'Deve retornar sucesso no login.');
    }

    public function testLoginReturnsErrorWithInvalidCredentials()
    {
        ob_start();

        $this->login->store([
            'email'    => 'usuario@admin.com',
            'password' => '1234'
        ]);

        $output   = ob_get_clean();
        $response = json_decode($output, true);

        $this->assertEquals('Invalid credentials.', $response['error'], 'Deve retornar erro no login.');
    }

    public function testLogoutClearsCookieAndReturnsMessage()
    {
        ob_start();

        $this->login->destroy();

        $output   = ob_get_clean();
        $response = json_decode($output, true);

        $this->assertEquals('Logout successful.', $response['message'], 'Deve·retonar·sucesso·no·logout.');
        $this->assertTrue(headers_sent() === false);
    }
}
