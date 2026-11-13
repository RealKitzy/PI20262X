<?php
/**
 * EPO simulado, usado só nos testes automáticos (não vai para o site).
 * Responde como o EPO Open Patent Services, com patentes fixas por assunto:
 *  - "soil"/"irrigation" → patentes de irrigação
 *  - "smoke"/"fuma"      → patentes de detector de fumaça
 *  - qualquer outra      → patentes de detecção de queda
 *  - "accelerometer"     → 404 (nenhum resultado), para testar a nova tentativa com 2 termos
 *  - "limite"            → 403 (limite de consultas)
 */
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
header('Content-Type: application/json');

if ($uri === '/3.2/auth/accesstoken') {
    echo '{"access_token":"TOKEN-TESTE","token_type":"BearerToken","expires_in":"1199"}';
    exit;
}
if ($uri !== '/3.2/rest-services/published-data/search/biblio') {
    http_response_code(404);
    echo '{}';
    exit;
}

$q = $_GET['q'] ?? '';
if (strpos($q, 'limite') !== false) { http_response_code(403); echo '{}'; exit; }
if (strpos($q, 'accelerometer') !== false) { http_response_code(404); echo '{}'; exit; }

$doc = function ($numero, $titulo, $resumo) {
    return ['exchange-document' => [
        '@country' => 'US', '@doc-number' => $numero, '@kind' => 'B2',
        'bibliographic-data' => [
            'publication-reference' => ['document-id' => ['@document-id-type' => 'docdb', 'date' => ['$' => '20120710']]],
            'invention-title' => ['@lang' => 'en', '$' => $titulo],
            'parties' => ['applicants' => ['applicant' => ['@data-format' => 'epodoc', 'applicant-name' => ['name' => ['$' => 'EXEMPLO [US]']]]]],
        ],
        'abstract' => ['@lang' => 'en', 'p' => ['$' => $resumo]],
    ]];
};

if (strpos($q, 'soil') !== false || strpos($q, 'irrigation') !== false) {
    $docs = [
        $doc('2021012345', 'Automatic irrigation system with capacitive soil moisture probe and LoRa radio', 'An irrigation controller reads a capacitive soil moisture sensor and opens a solenoid valve; data is sent by LoRa.'),
        $doc('2020099887', 'Soil moisture monitoring device for agriculture', 'A sensor node measures soil humidity and temperature in crop fields.'),
    ];
} elseif (strpos($q, 'smoke') !== false || strpos($q, 'fuma') !== false) {
    $docs = [
        $doc('9332099', 'Wireless device networks with smoke detection capabilities', 'A network of wireless smoke detectors sends an alarm notification to a mobile phone.'),
        $doc('4363031', 'Wireless alarm system', 'A smoke detector with a radio transmitter.'),
    ];
} elseif (strpos($q, 'ic=') !== false) {
    $docs = [$doc('6433690', 'Elderly fall monitoring method and device', 'A wearable device detects falls of senior people.')];
} else {
    $docs = [$doc('8217795', 'Method and system for fall detection', 'Detecting a fall of an elderly person with a wrist worn accelerometer and alerting a caregiver.')];
}

echo json_encode(['ops:world-patent-data' => ['ops:biblio-search' => [
    '@total-result-count' => '1532',
    'ops:search-result' => ['exchange-documents' => $docs],
]]]);
