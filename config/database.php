<?php
/**
 * OBSERVATÓRIO DE PROPRIEDADE INTELECTUAL E HARDWARE ABERTO
 * Configuração de Conexão com Banco de Dados (PDO: PostgreSQL Railway / MySQL Railway / SQLite Zero-Config)
 */

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance !== null) {
            return self::$instance;
        }

        // Detecta automaticamente variáveis do Railway Postgres (PGHOST / DATABASE_URL), MySQL (MYSQLHOST) ou SQLite
        $pgHost = getenv('PGHOST');
        $databaseUrl = getenv('DATABASE_URL');
        $railwayMysqlHost = getenv('MYSQLHOST');

        $driver = getenv('DB_DRIVER');
        if (!$driver) {
            if ($pgHost || ($databaseUrl && strpos($databaseUrl, 'postgres') === 0)) {
                $driver = 'pgsql';
            } elseif ($railwayMysqlHost) {
                $driver = 'mysql';
            } else {
                $driver = 'sqlite';
            }
        }

        try {
            if ($driver === 'pgsql') {
                if ($databaseUrl && !$pgHost) {
                    $parts = parse_url($databaseUrl);
                    $host = $parts['host'] ?? '127.0.0.1';
                    $port = $parts['port'] ?? '5432';
                    $db   = ltrim($parts['path'] ?? '/railway', '/');
                    $user = $parts['user'] ?? 'postgres';
                    $pass = $parts['pass'] ?? '';
                } else {
                    $host = $pgHost ?: '127.0.0.1';
                    $port = getenv('PGPORT') ?: '5432';
                    $db   = getenv('PGDATABASE') ?: 'railway';
                    $user = getenv('PGUSER') ?: 'postgres';
                    $pass = getenv('PGPASSWORD') ?: '';
                }
                $dsn = "pgsql:host={$host};port={$port};dbname={$db}";
                self::$instance = new PDO($dsn, $user, $pass, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]);
                self::inicializarSchemaCompativel(self::$instance, 'pgsql');
            } elseif ($driver === 'mysql') {
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
                self::inicializarSchemaCompativel(self::$instance, 'mysql');
            } else {
                // SQLITE_PATH permite guardar o banco num volume persistente (ex.: /data/observatorio_pi.sqlite no Railway).
                // Sem a variável, o banco fica dentro do container e é apagado a cada novo deploy.
                $dbPath = getenv('SQLITE_PATH') ?: (__DIR__ . '/../database/observatorio_pi.sqlite');
                $dirBanco = dirname($dbPath);
                if (!is_dir($dirBanco)) {
                    @mkdir($dirBanco, 0775, true);
                }

                self::$instance = new PDO("sqlite:" . $dbPath, null, null, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]);
                self::inicializarSchemaCompativel(self::$instance, 'sqlite');
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

    private static function inicializarSchemaCompativel(PDO $pdo, string $driver): void {
        $schemaFile = __DIR__ . '/../database/schema.sql';
        if (!file_exists($schemaFile)) {
            return;
        }
        $sql = file_get_contents($schemaFile);
        if ($driver === 'pgsql') {
            // Adapta automaticamente a sintaxe SQLite para PostgreSQL (SERIAL PRIMARY KEY, TIMESTAMP, ON CONFLICT DO NOTHING)
            $sql = str_replace('INTEGER PRIMARY KEY AUTOINCREMENT', 'SERIAL PRIMARY KEY', $sql);
            $sql = str_replace('DATETIME DEFAULT CURRENT_TIMESTAMP', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP', $sql);
            $sql = str_replace('BOOLEAN DEFAULT 0', 'SMALLINT DEFAULT 0', $sql);
            $sql = str_replace('BOOLEAN DEFAULT 1', 'SMALLINT DEFAULT 1', $sql);
            $sql = preg_replace('/INSERT\s+OR\s+IGNORE\s+INTO\s+([a-zA-Z0-9_]+)\s*\((.*?)\)\s*VALUES\s*(.*?);/is', 'INSERT INTO $1 ($2) VALUES $3 ON CONFLICT DO NOTHING;', $sql);
        } elseif ($driver === 'mysql') {
            $sql = str_replace('INTEGER PRIMARY KEY AUTOINCREMENT', 'INT AUTO_INCREMENT PRIMARY KEY', $sql);
            $sql = str_replace('INSERT OR IGNORE INTO', 'INSERT IGNORE INTO', $sql);
        }
        $pdo->exec($sql);
    }
}
