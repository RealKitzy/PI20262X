<?php
/**
 * Roteador para o servidor embutido do PHP (php -S ... router.php).
 * O servidor embutido entrega QUALQUER arquivo da pasta; sem este roteador seria possível
 * baixar o banco SQLite (com CPFs e e-mails) e ver arquivos de configuração pela URL.
 * Aqui só ficam públicos: a página, os arquivos de assets/ e os endpoints de api/.
 */
$caminho = rawurldecode(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/');

// Bloqueia tentativas de sair da pasta e arquivos ocultos
if (strpos($caminho, '..') !== false || preg_match('#/\.#', $caminho)) {
    http_response_code(404);
    exit;
}

if ($caminho === '/' || $caminho === '/index.html') {
    return false; // o servidor entrega o index.html
}

// Arquivos estáticos permitidos
if (preg_match('#^/assets/[A-Za-z0-9_\-/]+\.(css|js|svg|png|jpg|jpeg|webp|ico|woff2?)$#', $caminho) && is_file(__DIR__ . $caminho)) {
    return false;
}

// Endpoints da API
if (preg_match('#^/api/(anterioridade|diagnostico|patentes)\.php$#', $caminho)) {
    return false;
}

// Todo o resto (database/, config/, docs/, Dockerfile, router.php...) não é público
http_response_code(404);
header('Content-Type: text/plain; charset=utf-8');
echo 'Não encontrado.';
