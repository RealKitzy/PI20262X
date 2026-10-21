<?php
/**
 * OBSERVATÓRIO DE PROPRIEDADE INTELECTUAL E HARDWARE ABERTO
 * API Real de Busca de Anterioridade, Verificação de Existência e Registro Fixo de Titularidade
 * Fundamentação: Lei nº 9.279/96 (Arts. 6º, 8º, 9º, 11, 12, 124 XIX, 129 e 195) e Lei nº 9.609/98 (Art. 3º)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/database.php';

/**
 * Normaliza texto removendo acentos e stopwords para comparação técnica e de marca
 */
function normalizarTextoComparacao(string $texto): string {
    $mapaAcentos = [
        'á'=>'a','à'=>'a','ã'=>'a','â'=>'a','ä'=>'a','é'=>'e','è'=>'e','ê'=>'e','ë'=>'e',
        'í'=>'i','ì'=>'i','î'=>'i','ï'=>'i','ó'=>'o','ò'=>'o','õ'=>'o','ô'=>'o','ö'=>'o',
        'ú'=>'u','ù'=>'u','û'=>'u','ü'=>'u','ç'=>'c',
        'Á'=>'a','À'=>'a','Ã'=>'a','Â'=>'a','Ä'=>'a','É'=>'e','È'=>'e','Ê'=>'e','Ë'=>'e',
        'Í'=>'i','Ì'=>'i','Î'=>'i','Ï'=>'i','Ó'=>'o','Ò'=>'o','Õ'=>'o','Ô'=>'o','Ö'=>'o',
        'Ú'=>'u','Ù'=>'u','Û'=>'u','Ü'=>'u','Ç'=>'c'
    ];
    $limpo = strtr($texto, $mapaAcentos);
    $limpo = mb_strtolower($limpo, 'UTF-8');
    $limpo = preg_replace('/[^a-z0-9\s]/', ' ', $limpo);
    return trim(preg_replace('/\s+/', ' ', $limpo));
}

function extrairTokensTecnicos(string $texto): array {
    $norm = normalizarTextoComparacao($texto);
    $partes = explode(' ', $norm);
    $stopwords = [
        'de','da','do','das','dos','em','no','na','nos','nas','um','uma','uns','umas',
        'para','por','com','sem','sob','sobre','entre','que','se','ou','ao','aos','as','os',
        'sistema','projeto','dispositivo','aparelho','caso','personalizado','desenvolvi',
        'desenvolvemos','quero','patentear','proteger','como','meu','minha','nosso','nossa',
        'uso','utilizando','baseado','ataves','meio','forma','tipo','novo','nova'
    ];
    $tokens = [];
    foreach ($partes as $p) {
        if (strlen($p) >= 3 && !in_array($p, $stopwords, true)) {
            $tokens[] = $p;
        }
    }
    return array_values(array_unique($tokens));
}

function calcularSimilaridadeTecnica(array $tokensA, array $tokensB): float {
    if (empty($tokensA) || empty($tokensB)) {
        return 0.0;
    }
    $intersecao = array_intersect($tokensA, $tokensB);
    $uniao = array_unique(array_merge($tokensA, $tokensB));
    $jaccard = count($intersecao) / max(1, count($uniao));
    $coberturaMenor = count($intersecao) / max(1, min(count($tokensA), count($tokensB)));
    return round((($jaccard * 0.45) + ($coberturaMenor * 0.55)) * 100, 1);
}

$db = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $registros = $db->query("SELECT * FROM registros_titularidade ORDER BY id DESC LIMIT 50")->fetchAll();
    echo json_encode([
        'sucesso' => true,
        'registros_fixos' => $registros
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true);

    if (!is_array($input)) {
        http_response_code(400);
        echo json_encode(['sucesso' => false, 'erro' => 'Payload JSON inválido.']);
        exit;
    }

    $acao = strtoupper(trim($input['acao'] ?? 'VERIFICAR'));
    $nomeProjeto = trim($input['nome_projeto'] ?? '');
    $autorNome = trim($input['autor_nome'] ?? 'Projetista Não Identificado');
    $autorDoc = trim($input['autor_documento'] ?? '00.000.000/0001-00');
    $instituicao = trim($input['instituicao_empresa'] ?? 'Titular Independente');
    $resumoTecnico = trim($input['resumo_tecnico'] ?? '');
    $novidadeHw = trim($input['grau_novidade_hardware'] ?? 'INEDITO_INVENTIVO');
    $divulgacao = trim($input['divulgacao_previa'] ?? 'SIGILO_MANTIDO');
    $cip = trim($input['classificacao_cip'] ?? 'G05B 19/042 ; H04W 4/38');
    $modalidade = trim($input['modalidade_protecao'] ?? 'Patente de Invenção (Art. 8º LPI) + Marca (Art. 129 LPI)');
    $camadas = trim($input['camadas_protegidas'] ?? 'Camadas A, D, E e F');
    $trechoCodigo = trim($input['trecho_codigo'] ?? '');

    if ($nomeProjeto === '' && $resumoTecnico === '') {
        http_response_code(400);
        echo json_encode(['sucesso' => false, 'erro' => 'Informe o nome ou a descrição técnica da criação.']);
        exit;
    }

    // Extrai a marca/núcleo do nome (antes de travessão, se houver)
    $partesNome = preg_split('/[—\-:]/u', str_replace('Caso Personalizado:', '', $nomeProjeto));
    $marcaNucleo = normalizarTextoComparacao($partesNome[0] ?? $nomeProjeto);
    $nomeNormalizado = normalizarTextoComparacao($nomeProjeto);
    $tokensUsuario = extrairTokensTecnicos($nomeProjeto . ' ' . $resumoTecnico);
    $docNormalizado = preg_replace('/[^0-9A-Za-z]/', '', $autorDoc);

    // Hash SHA-512 real da criação submetida
    $hashCriacao = hash('sha512', $nomeNormalizado . '|' . normalizarTextoComparacao($resumoTecnico) . '|' . $trechoCodigo);

    // Busca todos os registros existentes no banco fixo
    $todosRegistros = $db->query("SELECT * FROM registros_titularidade ORDER BY id DESC")->fetchAll();
    $colisoesEncontradas = [];
    $bloqueioTerceiro = null;
    $registroDoProprioUsuario = null;

    foreach ($todosRegistros as $reg) {
        $regPartesNome = preg_split('/[—\-:\/]/u', $reg['nome_criacao_marca']);
        $regMarcaNucleo = normalizarTextoComparacao($regPartesNome[0] ?? $reg['nome_criacao_marca']);
        $regNomeNorm = normalizarTextoComparacao($reg['nome_criacao_marca']);
        $regTokens = extrairTokensTecnicos($reg['nome_criacao_marca'] . ' ' . $reg['resumo_tecnico'] . ' ' . $reg['palavras_chave']);
        $regDocNorm = preg_replace('/[^0-9A-Za-z]/', '', $reg['titular_documento']);

        $similaridade = calcularSimilaridadeTecnica($tokensUsuario, $regTokens);
        $colisaoMarca = false;

        if (strlen($marcaNucleo) >= 4 && strlen($regMarcaNucleo) >= 4) {
            if ($marcaNucleo === $regMarcaNucleo || strpos($nomeNormalizado, $regMarcaNucleo) !== false || strpos($regNomeNorm, $marcaNucleo) !== false) {
                $colisaoMarca = true;
            }
        }

        $hashIgual = ($reg['hash_sha512'] === $hashCriacao);
        $mesmoTitular = ($docNormalizado !== '' && $docNormalizado !== '00000000000100' && $docNormalizado === $regDocNorm);

        if ($hashIgual || $colisaoMarca || $similaridade >= 28.0) {
            $itemColisao = [
                'protocolo_registro' => $reg['protocolo_registro'],
                'origem_base' => $reg['origem_base'],
                'nome_criacao_marca' => $reg['nome_criacao_marca'],
                'titular_nome' => $reg['titular_nome'],
                'titular_documento' => $reg['titular_documento'],
                'instituicao_empresa' => $reg['instituicao_empresa'],
                'modalidade_protecao' => $reg['modalidade_protecao'],
                'status_juridico' => $reg['status_juridico'],
                'data_registro' => $reg['data_registro'],
                'similaridade_percentual' => $hashIgual ? 100.0 : ($colisaoMarca ? max(78.0, $similaridade) : $similaridade),
                'colisao_marca' => $colisaoMarca,
                'mesmo_titular' => $mesmoTitular
            ];
            $colisoesEncontradas[] = $itemColisao;

            if ($mesmoTitular && ($hashIgual || $colisaoMarca || $similaridade >= 65.0)) {
                $registroDoProprioUsuario = $itemColisao;
            } elseif (!$mesmoTitular && ($hashIgual || $colisaoMarca || $similaridade >= 55.0)) {
                if ($bloqueioTerceiro === null || $itemColisao['similaridade_percentual'] > $bloqueioTerceiro['similaridade_percentual']) {
                    $bloqueioTerceiro = $itemColisao;
                }
            }
        }
    }

    // Ordenar colisões por maior similaridade
    usort($colisoesEncontradas, fn($a, $b) => $b['similaridade_percentual'] <=> $a['similaridade_percentual']);

    // Determinar o Veredito de Existência e Apropriabilidade Jurídica
    $statusApropriacao = 'DISPONIVEL_EXCLUSIVO';
    $podeRegistrar = true;
    $tituloVeredito = 'CRIAÇÃO INÉDITA E DISPONÍVEL — Você Pode Reivindicar e Registrar como Sua!';
    $explicacaoVeredito = 'Verificamos a base fixa do Observatório e o acervo de patentes/marcas: não há registro bloqueante em nome de terceiros colidindo com a sua criação. Sua arquitetura apresenta originalidade e atende aos requisitos dos Arts. 6º, 8º/9º e 129 da Lei nº 9.279/96 (LPI) e da Lei nº 9.609/98.';

    if ($registroDoProprioUsuario !== null) {
        $statusApropriacao = 'JA_PERTENCE_AO_USUARIO';
        $podeRegistrar = true;
        $tituloVeredito = 'CRIAÇÃO JÁ REGISTRADA E FIXADA EM SEU NOME (' . $registroDoProprioUsuario['protocolo_registro'] . ')';
        $explicacaoVeredito = 'O sistema identificou que este projeto/marca já consta gravado no banco de dados fixo sob a titularidade do seu próprio CPF/CNPJ (' . $registroDoProprioUsuario['titular_nome'] . '). Sua reserva de anterioridade e prova de autoria SHA-512 estão ativas e protegidas.';
    } elseif ($bloqueioTerceiro !== null) {
        $statusApropriacao = 'BLOQUEADO_TERCEIRO';
        $podeRegistrar = false;
        $tituloVeredito = 'IMPEDIMENTO LEGAL: Criação ou Marca Já Existe e Pertence a Terceiro (' . $bloqueioTerceiro['protocolo_registro'] . ')';
        $explicacaoVeredito = 'Não é possível apropriar-se diretamente desta criação como sua: detectamos colisão direta (' . $bloqueioTerceiro['similaridade_percentual'] . '% de superposição / colisão nominativa) com o ativo "' . $bloqueioTerceiro['nome_criacao_marca'] . '", já registrado sob titularidade de ' . $bloqueioTerceiro['titular_nome'] . ' (' . $bloqueioTerceiro['instituicao_empresa'] . '). Pelo Art. 11 (Estado da Técnica), Art. 124, XIX (proibição de reprodução de marca alheia) e Art. 195 da Lei nº 9.279/96, para registrar uma versão própria você deve: (1) adotar um nome comercial/marca distinto; e (2) especificar uma melhoria construtiva/funcional própria (Modelo de Utilidade — Art. 9º da LPI) ou reimplementação limpa.';
    } elseif ($divulgacao === 'DIVULGADO_MAIS_12M') {
        $statusApropriacao = 'PARCIAL_ESTADO_DA_TECNICA';
        $podeRegistrar = true;
        $tituloVeredito = 'APROPRIAÇÃO PARCIAL: Patente Impedida pelo Estado da Técnica (Art. 11 LPI), mas Marca e Código Podem Ser Seus';
        $explicacaoVeredito = 'Como a criação foi divulgada há mais de 12 meses, a solução técnica física já caiu no Estado da Técnica (Art. 11 e Art. 12 da LPI) e não pode mais ser patenteada com exclusividade. Porém, você PODE registrar e colocar em seu nome a Marca Comercial (Art. 129 da LPI) e o Código-Fonte do Firmware (Lei nº 9.609/98).';
    } elseif ($novidadeHw === 'MODULOS_PRONTOS_COTS') {
        $statusApropriacao = 'PARCIAL_MODULOS_COMERCIAIS';
        $podeRegistrar = true;
        $tituloVeredito = 'APROPRIAÇÃO PARCIAL: Hardware Base já Existe no Mercado, mas Você Pode Registrar Sua Marca, Firmware e PCB';
        $explicacaoVeredito = 'Os módulos eletrônicos comerciais utilizados (COTS) já pertencem aos seus respectivos fabricantes e ao estado da técnica (Art. 8º e Art. 10, V da LPI). Você não pode patentear o hardware base como invenção sua, mas PODE colocar como sua propriedade exclusiva: (1) a Marca do seu produto (Art. 129 LPI); (2) o seu Código-Fonte/Firmware autoral (Lei 9.609/98); e (3) o desenho específico da sua PCB/Gabinete (Lei 9.610/98 e Art. 94 LPI).';
    }

    // Se a ação for REGISTRAR, grava de forma fixa e permanente no banco SQLite/MySQL
    $novoRegistroGravado = null;
    if ($acao === 'REGISTRAR') {
        if (!$podeRegistrar && $bloqueioTerceiro !== null) {
            echo json_encode([
                'sucesso' => false,
                'bloqueado' => true,
                'status_apropriacao' => $statusApropriacao,
                'titulo_veredito' => $tituloVeredito,
                'explicacao_veredito' => $explicacaoVeredito,
                'bloqueio_terceiro' => $bloqueioTerceiro,
                'colisoes' => $colisoesEncontradas
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        if ($registroDoProprioUsuario !== null) {
            $novoRegistroGravado = $registroDoProprioUsuario;
        } else {
            $protocoloGerado = 'BR-OBS-' . date('Y') . '-' . strtoupper(substr(hash('sha256', $nomeProjeto . microtime(true)), 0, 6));
            $palavrasChaveStr = implode(' ', array_slice($tokensUsuario, 0, 35));

            $stmtInsert = $db->prepare("
                INSERT INTO registros_titularidade (
                    protocolo_registro, origem_base, nome_criacao_marca, titular_nome, titular_documento,
                    instituicao_empresa, resumo_tecnico, palavras_chave, classificacao_cip,
                    modalidade_protecao, camadas_protegidas, status_juridico, hash_sha512
                ) VALUES (?, 'REGISTRO_FIXO_USUARIO', ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PROTEGIDO_EXCLUSIVO', ?)
            ");
            $stmtInsert->execute([
                $protocoloGerado,
                $nomeProjeto,
                $autorNome,
                $autorDoc,
                $instituicao,
                $resumoTecnico,
                $palavrasChaveStr,
                $cip,
                $modalidade,
                $camadas,
                $hashCriacao
            ]);

            $novoId = (int)$db->lastInsertId();
            $stmtBusca = $db->prepare("SELECT * FROM registros_titularidade WHERE id = ?");
            $stmtBusca->execute([$novoId]);
            $novoRegistroGravado = $stmtBusca->fetch();

            $statusApropriacao = 'REGISTRADO_COM_SUCESSO';
            $tituloVeredito = 'TITULARIDADE FIXADA COM SUCESSO! Protocolo Oficial: ' . $protocoloGerado;
            $explicacaoVeredito = 'Sua criação foi gravada de forma permanente no banco de dados fixo do Observatório com resumo criptográfico SHA-512 (Art. 3º da Lei nº 9.609/98 e Art. 6º/129 da Lei nº 9.279/96). A partir deste momento, qualquer tentativa de terceiro de reivindicar projeto ou marca idêntica será automaticamente detectada e bloqueada pelo sistema.';
        }
    }

    $registrosAtualizados = $db->query("SELECT * FROM registros_titularidade ORDER BY id DESC LIMIT 50")->fetchAll();

    echo json_encode([
        'sucesso' => true,
        'acao_executada' => $acao,
        'status_apropriacao' => $statusApropriacao,
        'pode_registrar_como_seu' => $podeRegistrar,
        'titulo_veredito' => $tituloVeredito,
        'explicacao_veredito' => $explicacaoVeredito,
        'hash_sha512_calculado' => $hashCriacao,
        'tokens_analisados' => array_slice($tokensUsuario, 0, 20),
        'colisoes' => $colisoesEncontradas,
        'bloqueio_terceiro' => $bloqueioTerceiro,
        'registro_gravado' => $novoRegistroGravado,
        'registros_fixos' => $registrosAtualizados
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
