<?php
/**
 * OBSERVATÓRIO DE PROPRIEDADE INTELECTUAL E HARDWARE ABERTO
 * API Geradora de Minutas Contratuais, Licenças Customizadas e Dossiês do INPI
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true);

    if (!is_array($input) || empty($input['conteudo_minuta'])) {
        http_response_code(400);
        echo json_encode(['sucesso' => false, 'erro' => 'Parâmetros da minuta ausentes.']);
        exit;
    }

    $db = Database::getConnection();
    $diagnosticoId = (int)($input['diagnostico_id'] ?? 1);
    $tipoDoc = $input['tipo_documento'] ?? 'CESSAO_DIREITOS';
    $partes = $input['partes_qualificacao'] ?? 'Projetista e Cessionária';
    $conteudo = $input['conteudo_minuta'];
    $hash = hash('sha256', $conteudo . microtime(true));

    $stmt = $db->prepare("
        INSERT INTO minutas_geradas (diagnostico_id, tipo_documento, partes_qualificacao, conteudo_minuta, hash_verificacao)
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->execute([$diagnosticoId, $tipoDoc, $partes, $conteudo, $hash]);

    echo json_encode([
        'sucesso' => true,
        'minuta_id' => (int)$db->lastInsertId(),
        'hash_verificacao' => $hash,
        'gerado_em' => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
