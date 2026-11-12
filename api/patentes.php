<?php
/**
 * OBSERVATÓRIO DE PROPRIEDADE INTELECTUAL E HARDWARE ABERTO
 * Busca real de patentes no EPO — Open Patent Services (OPS v3.2)
 *
 * A base do EPO (a mesma do Espacenet) cobre patentes do mundo todo, inclusive documentos brasileiros (BR).
 * O uso é gratuito dentro do limite de "uso justo" do EPO, mas exige cadastro em developers.epo.org.
 *
 * Configuração (variáveis de ambiente — no Railway: aba "Variables"):
 *   EPO_OPS_KEY     = Consumer Key do app registrado no EPO
 *   EPO_OPS_SECRET  = Consumer Secret do app registrado no EPO
 *
 * Sem as variáveis, responde { estado: "sem_chave" } e a interface mantém as patentes como "apenas link".
 * A chave fica só no servidor: o navegador nunca a recebe.
 *
 * Uso: GET api/patentes.php?q=irrigation+soil+sensor&n=25[&cip=A01G][&pais=BR]
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

const EPO_TEMPO_CACHE_SEGUNDOS = 86400; // buscas repetidas ficam guardadas por 24 h (economiza a cota do EPO)

function responder(array $dados, int $status = 200): void {
    http_response_code($status);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function pastaCacheEpo(): string {
    $dir = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'observatorio_epo_cache';
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    return $dir;
}

function baseUrlEpo(): string {
    // EPO_OPS_BASE_URL só existe para testes locais com servidor simulado
    return rtrim(getenv('EPO_OPS_BASE_URL') ?: 'https://ops.epo.org/3.2', '/');
}

function requisicaoHttp(string $metodo, string $url, array $cabecalhos, ?string $corpo = null): array {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => $metodo,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HEADER => true,
        CURLOPT_HTTPHEADER => $cabecalhos,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_CONNECTTIMEOUT => 8,
    ]);
    if ($corpo !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $corpo);
    }
    $resposta = curl_exec($ch);
    if ($resposta === false) {
        $erro = curl_error($ch);
        curl_close($ch);
        return ['status' => 0, 'corpo' => '', 'cabecalhos' => '', 'erro' => $erro];
    }
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $tamCabecalho = (int) curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    curl_close($ch);
    return [
        'status' => $status,
        'cabecalhos' => substr($resposta, 0, $tamCabecalho),
        'corpo' => substr($resposta, $tamCabecalho),
        'erro' => '',
    ];
}

// Token OAuth do EPO (validade de ~20 min): guardado em arquivo temporário para não pedir um novo a cada busca
function obterTokenEpo(string $chave, string $segredo, bool $forcarNovo = false): ?string {
    $arquivo = pastaCacheEpo() . DIRECTORY_SEPARATOR . 'token_' . md5($chave) . '.json';
    if (!$forcarNovo && is_file($arquivo)) {
        $salvo = json_decode((string) @file_get_contents($arquivo), true);
        if (is_array($salvo) && ($salvo['expira_em'] ?? 0) > time() + 60) {
            return $salvo['token'];
        }
    }
    $resp = requisicaoHttp('POST', baseUrlEpo() . '/auth/accesstoken', [
        'Authorization: Basic ' . base64_encode($chave . ':' . $segredo),
        'Content-Type: application/x-www-form-urlencoded',
    ], 'grant_type=client_credentials');
    if ($resp['status'] !== 200) {
        return null;
    }
    $json = json_decode($resp['corpo'], true);
    if (empty($json['access_token'])) {
        return null;
    }
    $expira = time() + (int) ($json['expires_in'] ?? 1199);
    @file_put_contents($arquivo, json_encode(['token' => $json['access_token'], 'expira_em' => $expira]), LOCK_EX);
    return $json['access_token'];
}

// O JSON do OPS usa objeto quando há 1 item e lista quando há vários: esta função sempre devolve lista
function comoLista($valor): array {
    if ($valor === null) return [];
    if (is_array($valor) && array_keys($valor) === range(0, count($valor) - 1)) return $valor;
    return [$valor];
}

function textoOps($valor): string {
    if (is_array($valor) && isset($valor['$'])) return trim((string) $valor['$']);
    if (is_string($valor)) return trim($valor);
    return '';
}

// Escolhe o texto no idioma preferido (pt, depois en, depois o primeiro disponível)
function textoPorIdioma($itens, string $campoTexto = '$'): string {
    $lista = comoLista($itens);
    $porIdioma = [];
    foreach ($lista as $item) {
        $lang = $item['@lang'] ?? 'xx';
        if ($campoTexto === 'p') {
            $paragrafos = array_map('textoOps', comoLista($item['p'] ?? null));
            $porIdioma[$lang] = trim(implode(' ', $paragrafos));
        } else {
            $porIdioma[$lang] = textoOps($item);
        }
    }
    foreach (['pt', 'en'] as $pref) {
        if (!empty($porIdioma[$pref])) return $porIdioma[$pref];
    }
    foreach ($porIdioma as $t) {
        if ($t !== '') return $t;
    }
    return '';
}

function converterDocumentoOps(array $doc): array {
    $pais = $doc['@country'] ?? '';
    $numero = $doc['@doc-number'] ?? '';
    $tipo = $doc['@kind'] ?? '';
    $biblio = $doc['bibliographic-data'] ?? [];

    $data = '';
    foreach (comoLista($biblio['publication-reference']['document-id'] ?? null) as $id) {
        $d = textoOps($id['date'] ?? null);
        if ($d !== '') { $data = $d; break; }
    }
    $ano = $data !== '' ? substr($data, 0, 4) : 's/d';
    $dataFormatada = strlen($data) === 8 ? substr($data, 6, 2) . '/' . substr($data, 4, 2) . '/' . substr($data, 0, 4) : '';

    $titulares = [];
    foreach (comoLista($biblio['parties']['applicants']['applicant'] ?? null) as $ap) {
        if (($ap['@data-format'] ?? '') === 'epodoc' || empty($titulares)) {
            $nome = textoOps($ap['applicant-name']['name'] ?? null);
            if ($nome !== '' && !in_array($nome, $titulares, true)) $titulares[] = $nome;
        }
    }

    $titulo = textoPorIdioma($biblio['invention-title'] ?? null);
    // Texto para cálculo de relevância: títulos e resumos em TODOS os idiomas (a busca usa termos em inglês e português)
    $todosTextos = array_map('textoOps', comoLista($biblio['invention-title'] ?? null));
    foreach (comoLista($doc['abstract'] ?? null) as $ab) {
        $todosTextos = array_merge($todosTextos, array_map('textoOps', comoLista($ab['p'] ?? null)));
    }
    $resumo = textoPorIdioma($doc['abstract'] ?? null, 'p');
    $numeroCompleto = $pais . $numero . $tipo;

    return [
        'base' => 'EPO',
        'id' => $numeroCompleto,
        'numero' => $pais . ' ' . $numero . ' ' . $tipo,
        'pais' => $pais,
        'titulo' => $titulo !== '' ? $titulo : '(sem título informado)',
        'ano' => $ano,
        'data_publicacao' => $dataFormatada,
        'titular' => implode('; ', array_slice($titulares, 0, 3)),
        'link' => 'https://worldwide.espacenet.com/patent/search?q=pn%3D' . rawurlencode($numeroCompleto),
        'resumo' => mb_substr($resumo, 0, 600),
        'texto_comparacao' => mb_substr(implode(' ', array_filter($todosTextos)), 0, 3000),
    ];
}

// ---------------------------------------------------------------------------
$chave = getenv('EPO_OPS_KEY') ?: '';
$segredo = getenv('EPO_OPS_SECRET') ?: '';
if ($chave === '' || $segredo === '') {
    responder([
        'sucesso' => false,
        'estado' => 'sem_chave',
        'mensagem' => 'Busca de patentes não configurada: defina EPO_OPS_KEY e EPO_OPS_SECRET no servidor.',
    ]);
}
if (!function_exists('curl_init')) {
    responder(['sucesso' => false, 'estado' => 'erro', 'mensagem' => 'Extensão cURL do PHP indisponível no servidor.'], 500);
}

// Termos: só letras/números (evita injeção na consulta CQL do EPO)
$termos = preg_split('/\s+/u', (string) ($_GET['q'] ?? '')) ?: [];
// Mantém letras com acento (patentes brasileiras são indexadas em português: "fumaça", "irrigação")
$termos = array_values(array_unique(array_filter(array_map(function ($t) {
    return (string) preg_replace('/[^\p{L}\p{N}]/u', '', mb_strtolower((string) $t, 'UTF-8'));
}, $termos), function ($t) {
    return mb_strlen($t, 'UTF-8') >= 2;
})));
$termos = array_slice(array_map(function ($t) { return mb_substr($t, 0, 40, 'UTF-8'); }, $termos), 0, 6);
if (count($termos) < 1) {
    responder(['sucesso' => false, 'estado' => 'erro', 'mensagem' => 'Informe os termos da busca (parâmetro q).'], 400);
}
$quantidade = max(1, min(100, (int) ($_GET['n'] ?? 25)));

// ta = título + resumo; "all" = todos os termos precisam aparecer
$cql = 'ta all "' . implode(' ', $termos) . '"';

// Filtro opcional pela área técnica (subclasse CIP/IPC, ex.: G08B). Só o formato exato é aceito.
$cip = strtoupper(trim((string) ($_GET['cip'] ?? '')));
if ($cip !== '') {
    if (!preg_match('/^[A-H][0-9]{2}[A-Z]$/', $cip)) {
        responder(['sucesso' => false, 'estado' => 'erro', 'mensagem' => 'Classe CIP inválida (use a subclasse, ex.: G08B).'], 400);
    }
    $cql .= ' and ic=' . $cip;
}

// Filtro opcional pelo país de publicação (ex.: BR = patentes brasileiras). Só 2 letras são aceitas.
$pais = strtoupper(trim((string) ($_GET['pais'] ?? '')));
if ($pais !== '') {
    if (!preg_match('/^[A-Z]{2}$/', $pais)) {
        responder(['sucesso' => false, 'estado' => 'erro', 'mensagem' => 'País inválido (use 2 letras, ex.: BR).'], 400);
    }
    $cql .= ' and pn=' . $pais;
}

$arquivoCache = pastaCacheEpo() . DIRECTORY_SEPARATOR . 'busca_' . md5($cql . '|' . $quantidade) . '.json';
if (is_file($arquivoCache) && (time() - filemtime($arquivoCache)) < EPO_TEMPO_CACHE_SEGUNDOS) {
    $emCache = json_decode((string) @file_get_contents($arquivoCache), true);
    if (is_array($emCache)) {
        $emCache['cache'] = true;
        responder($emCache);
    }
}

$token = obterTokenEpo($chave, $segredo);
if ($token === null) {
    responder(['sucesso' => false, 'estado' => 'erro', 'mensagem' => 'Não foi possível autenticar no EPO (confira EPO_OPS_KEY e EPO_OPS_SECRET).'], 502);
}

$url = baseUrlEpo() . '/rest-services/published-data/search/biblio?q=' . rawurlencode($cql) . '&Range=1-' . $quantidade;
$cabecalhos = ['Accept: application/json'];
$resp = requisicaoHttp('GET', $url, array_merge($cabecalhos, ['Authorization: Bearer ' . $token]));

// Token expirado antes do previsto: renova uma vez e repete
if ($resp['status'] === 400 && stripos($resp['corpo'], 'invalid_access_token') !== false) {
    $token = obterTokenEpo($chave, $segredo, true);
    if ($token !== null) {
        $resp = requisicaoHttp('GET', $url, array_merge($cabecalhos, ['Authorization: Bearer ' . $token]));
    }
}

if ($resp['status'] === 404) {
    // O OPS responde 404 quando a busca não tem nenhum resultado
    $resultado = ['sucesso' => true, 'estado' => 'ok', 'consulta' => $cql, 'total' => 0, 'resultados' => []];
    @file_put_contents($arquivoCache, json_encode($resultado, JSON_UNESCAPED_UNICODE), LOCK_EX);
    responder($resultado);
}
if ($resp['status'] === 403 || $resp['status'] === 429) {
    responder([
        'sucesso' => false,
        'estado' => 'limite',
        'mensagem' => 'Limite de consultas do EPO atingido no momento. Aguarde alguns minutos e refaça.',
    ]);
}
if ($resp['status'] !== 200) {
    responder([
        'sucesso' => false,
        'estado' => 'erro',
        'mensagem' => $resp['status'] === 0 ? ('Falha de conexão com o EPO: ' . $resp['erro']) : ('O EPO respondeu com erro HTTP ' . $resp['status'] . '.'),
    ], 502);
}

$json = json_decode($resp['corpo'], true);
$busca = $json['ops:world-patent-data']['ops:biblio-search'] ?? null;
if (!is_array($busca)) {
    responder(['sucesso' => false, 'estado' => 'erro', 'mensagem' => 'Resposta do EPO em formato inesperado.'], 502);
}

$documentos = [];
foreach (comoLista($busca['ops:search-result']['exchange-documents'] ?? null) as $item) {
    if (isset($item['exchange-document'])) {
        foreach (comoLista($item['exchange-document']) as $doc) {
            $documentos[] = converterDocumentoOps($doc);
        }
    }
}

$resultado = [
    'sucesso' => true,
    'estado' => 'ok',
    'consulta' => $cql,
    'total' => (int) ($busca['@total-result-count'] ?? count($documentos)),
    'resultados' => $documentos,
];
@file_put_contents($arquivoCache, json_encode($resultado, JSON_UNESCAPED_UNICODE), LOCK_EX);
responder($resultado);
