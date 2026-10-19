<?php
/**
 * OBSERVATÓRIO DE PROPRIEDADE INTELECTUAL E HARDWARE ABERTO
 * Configuração de Conexão com Banco de Dados (PDO: SQLite Zero-Config / MySQL Railway & XAMPP)
 */

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance !== null) {
            return self::$instance;
        }

        // Detecta automaticamente variáveis do Railway MySQL (MYSQLHOST) ou DB_DRIVER=mysql
        $railwayMysqlHost = getenv('MYSQLHOST');
        $driver = getenv('DB_DRIVER') ?: ($railwayMysqlHost ? 'mysql' : 'sqlite');

        try {
            if ($driver === 'mysql') {
                $host = $railwayMysqlHost ?: (getenv('DB_HOST') ?: '127.0.0.1');
                $port = getenv('MYSQLPORT') ?: (getenv('DB_PORT') ?: '3306');
                $db   = getenv('MYSQLDATABASE') ?: (getenv('DB_NAME') ?: 'observatorio_pi');
                $user = getenv('MYSQLUSER') ?: (getenv('DB_USER') ?: 'root');
                $pass = getenv('MYSQLPASSWORD') ?: (getenv('DB_PASS') ?: '');
                $dsn  = "mysql:host={$host};port={$port};dbname={$db};charset=utf8mb4";
                self::$instance = new PDO($dsn, $user, $pass, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]);
            } else {
                $dbPath = __DIR__ . '/../database/observatorio_pi.sqlite';
                $needsInit = !file_exists($dbPath);

                self::$instance = new PDO("sqlite:" . $dbPath, null, null, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]);

                if ($needsInit) {
                    $schemaFile = __DIR__ . '/../database/schema.sql';
                    if (file_exists($schemaFile)) {
                        $sql = file_get_contents($schemaFile);
                        self::$instance->exec($sql);
                    }
                }
            }
        } catch (PDOException $e) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'sucesso' => false,
                'erro' => 'Falha na conexão com o banco de dados: ' . $e->getMessage()
            ]);
            exit;
        }

        return self::$instance;
    }
}
