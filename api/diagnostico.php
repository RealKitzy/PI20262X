<?php
/**
 * OBSERVATÓRIO DE PROPRIEDADE INTELECTUAL E HARDWARE ABERTO
 * API do Motor de Decisão e Diagnóstico Jurídico-Técnico (INPI + Open Hardware/Software)
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
 * Motor de Decisão Determinístico Multicritério (Matriz de 6 Camadas A a F — Equipe "Os Cara")
 * Camada A: Documentação Técnica (Lei 9.610/98)
 * Camada B: Design do Produto (Desenho Industrial — LPI)
 * Camada C: Semicondutores (Topografia de Circuito Integrado — Lei 11.484/07 e PADIS)
 * Camada D: Signos Distintivos (Registro de Marca — Art. 129 e 189 LPI)
 * Camada E: Software Embarcado (Lei 9.609/98 — Art. 4º)
 * Camada F: Solução Técnica (Patente PI/MU e ressalva do Art. 10, V da LPI)
 */
function executarMotorDecisao(array $dados): array {
    $recomendacoesInpi = [];
    $alertasLicenca = [];
    $camadasAnalise = [];
    $scoreProtegibilidade = 45;
    $riscoContaminacao = 'NULO';

    $novidadeHw = $dados['grau_novidade_hardware'] ?? 'MELHORIA_FUNCIONAL';
    $divulgacao = $dados['divulgacao_previa'] ?? 'SIGILO_MANTIDO';
    $possuiPcb = !empty($dados['possui_pcb_customizada']);
    $possuiChip = !empty($dados['possui_topografia_chip']);
    $possuiDesign = !empty($dados['possui_design_externo_novo']);
    $hwTerceiros = $dados['usa_hardware_aberto_terceiros'] ?? 'NENHUM';

    $possuiFirmware = !empty($dados['possui_firmware_proprio']);
    $licencaBibs = $dados['licenca_bibliotecas_terceiros'] ?? 'MIT_BSD_APACHE';
    $vinculacaoFw = $dados['vinculacao_firmware'] ?? 'ESTATICA_MONOLITICA';
    $modeloNegocio = $dados['modelo_negocio'] ?? 'COMERCIAL_FECHADO';
    $titularidade = $dados['titularidade_tipo'] ?? 'AUTONOMO_EMPRESA';

    // CAMADA D: SIGNOS DISTINTIVOS (MARCA E LOGOTIPO — Art. 129 e 189 da LPI)
    $scoreProtegibilidade += 10;
    $recomendacoesInpi[] = [
        'codigo' => 'MARCA',
        'titulo' => 'Camada D — Registro de Marca e Signo Distintivo (INPI)',
        'base_legal' => 'Lei nº 9.279/1996 (LPI — Art. 129 e Art. 189)',
        'prioridade' => 'Vetor Patrimonial Essencial',
        'prazo' => '10 anos (renovável indefinidamente)',
        'justificativa' => 'Pelo sistema atributivo brasileiro (Art. 129 da LPI), a propriedade e o uso exclusivo do nome comercial decorrem do registro no INPI. Como demonstrado no caso Arduino LLC vs. Arduino SRL (Genuino), mesmo quando o hardware e o software são abertos, a retenção da marca é o principal instrumento jurídico para garantir sustentabilidade financeira e impedir contrafação (Art. 189 da LPI).'
    ];

    // DIVULGAÇÃO PRÉVIA: PERÍODO DE GRAÇA (ART. 12 LPI) VS. ESTADO DA TÉCNICA (ART. 11 LPI)
    if ($divulgacao === 'DIVULGADO_MENOS_12M') {
        $alertasLicenca[] = [
            'nivel' => 'ATENCAO',
            'titulo' => 'Alerta Urgente — Período de Graça em Curso (Art. 12 da Lei nº 9.279/1996)',
            'descricao' => 'Como o projeto já foi divulgado publicamente (YouTube, GitHub, TCC ou feira) há menos de 12 meses, você ainda pode depositar Patente (PI/MU) ou Desenho Industrial invocando o Período de Graça (Art. 12 da LPI). Protocolize o pedido no INPI antes de completar 365 dias da primeira exposição pública.'
        ];
    } elseif ($divulgacao === 'DIVULGADO_MAIS_12M' && $novidadeHw !== 'MODULOS_PRONTOS_COTS') {
        $scoreProtegibilidade -= 10;
        $alertasLicenca[] = [
            'nivel' => 'ATENCAO',
            'titulo' => 'Perda de Novidade Patentária por Divulgação há Mais de 12 Meses (Art. 11 da LPI)',
            'descricao' => 'Como o projeto foi divulgado ao público há mais de 12 meses, o prazo do Período de Graça (Art. 12 da LPI) expirou e a solução técnica ingressou definitivamente no Estado da Técnica (Art. 11 da LPI). Isso impede o depósito de Patente própria, mas funciona como Publicação Defensiva contra terceiros.'
        ];
    }

    // CAMADA F: SOLUÇÃO TÉCNICA (PATENTE PI / MU e Ressalva do Art. 10, V da LPI)
    if ($modeloNegocio === 'PUBLICACAO_DEFENSIVA') {
        $scoreProtegibilidade += 15;
        $alertasLicenca[] = [
            'nivel' => 'INFO',
            'titulo' => 'Estratégia de Publicação Defensiva e Estado da Técnica (Art. 11 e 12 da LPI)',
            'descricao' => 'Ao optar pela Publicação Defensiva, a divulgação ampla da documentação técnica converte o projeto em Estado da Técnica (Art. 11 da LPI), destruindo o requisito de novidade e criando um escudo jurídico contra patentes e cobrança de royalties por concorrentes.'
        ];
    } elseif ($divulgacao !== 'DIVULGADO_MAIS_12M' && $novidadeHw === 'INEDITO_INVENTIVO') {
        $scoreProtegibilidade += 25;
        array_unshift($recomendacoesInpi, [
            'codigo' => 'PI',
            'titulo' => 'Camada F — Patente de Invenção (PI) / Processo Técnico com Efeito Físico',
            'base_legal' => 'Lei nº 9.279/1996 (Art. 8º, Art. 40 e interpretação do Art. 10, V)',
            'prioridade' => 'Prioridade Primária (Exclusividade Técnica)',
            'prazo' => '20 anos de vigência',
            'justificativa' => 'Embora o Art. 10, inciso V, da LPI vede patente para programa de computador "em si", circuitos inéditos e processos técnicos funcionais assistidos por software que gerem efeito técnico no mundo físico são patenteáveis (lição do caso Waymo vs. Uber).'
        ]);
    } elseif ($divulgacao !== 'DIVULGADO_MAIS_12M' && $novidadeHw === 'MELHORIA_FUNCIONAL' && $possuiPcb) {
        $scoreProtegibilidade += 15;
        array_unshift($recomendacoesInpi, [
            'codigo' => 'MU',
            'titulo' => 'Camada F — Patente de Modelo de Utilidade (MU)',
            'base_legal' => 'Lei nº 9.279/1996 (Art. 9º e 40)',
            'prioridade' => 'Prioridade Primária (Forma Funcional)',
            'prazo' => '15 anos de vigência',
            'justificativa' => 'A nova disposição construtiva na placa ou equipamento confere melhoria funcional no uso ou fabricação, atendendo ao requisito de ato inventivo do Modelo de Utilidade.'
        ]);
    } else {
        $camadasAnalise[] = [
            'camada' => 'Camada F • Solução Técnica (Ausência de Ineditismo Patentário)',
            'status' => 'Foco em Marca (Camada D), Software (Camada E) e Documentação (Camada A)',
            'detalhe' => 'Como o circuito baseia-se em módulos comerciais ou já ingressou no estado da técnica (Art. 11 da LPI), não cabe depósito de Patente (PI/MU). A sustentabilidade jurídica apoia-se no Registro de Marca (Art. 129 da LPI) e no licenciamento do firmware.'
        ];
    }

    // CAMADA C: SEMICONDUTORES E TOPOGRAFIA DE CIRCUITO INTEGRADO (Lei 11.484/2007 e PADIS)
    if ($possuiChip) {
        $scoreProtegibilidade += 15;
        $recomendacoesInpi[] = [
            'codigo' => 'TCI',
            'titulo' => 'Camada C — Topografia de Circuito Integrado (Microchips / Silício)',
            'base_legal' => 'Lei nº 11.484/2007 (Art. 26 a 55 — Institui também o PADIS)',
            'prioridade' => 'Especialização Máxima em Semicondutores',
            'prazo' => '10 anos de vigência',
            'justificativa' => 'Tutela o leiaute tridimensional das camadas do microchip (arquivos GDSII/OASIS), ressalvadas as exceções legais para ensino, pesquisa acadêmica e engenharia reversa lícita, com elegibilidade aos incentivos fiscais do PADIS.'
        ];
    }

    // CAMADA B: DESIGN DO PRODUTO (Desenho Industrial - LPI Art. 94)
    if ($possuiDesign) {
        $scoreProtegibilidade += 10;
        $recomendacoesInpi[] = [
            'codigo' => 'DI',
            'titulo' => 'Camada B — Registro de Desenho Industrial (Design Externo)',
            'base_legal' => 'Lei nº 9.279/1996 (Art. 94 a 121)',
            'prioridade' => 'Proteção Estética ("A Cara do Aparelho")',
            'prazo' => '10 anos (renováveis até 25 anos)',
            'justificativa' => 'Protege a forma plástica ornamental e os aspectos visuais externos do dispositivo contra imitação estética.'
        ];
    }

    // CAMADA E: SOFTWARE EMBARCADO (Lei 9.609/1998)
    if ($possuiFirmware) {
        $scoreProtegibilidade += 10;
        $recomendacoesInpi[] = [
            'codigo' => 'RPC',
            'titulo' => 'Camada E — Regime Especial de Software Embarcado (e-Software INPI)',
            'base_legal' => 'Lei nº 9.609/1998 (Arts. 2º, 3º e 4º) e Lei nº 9.610/1998 (Art. 7º, XII)',
            'prioridade' => 'Tutela Autoral de 50 Anos (Prova de Autoria SHA-512)',
            'prazo' => '50 anos a partir de 1º de janeiro do ano subsequente à publicação',
            'justificativa' => 'O firmware equipara-se às obras literárias. O depósito do resumo Hash SHA-512 no INPI garante segurança probatória imediata e resguarda a titularidade laboral prevista no Art. 4º da Lei nº 9.609/1998.'
        ];
    }

    // REGULAÇÃO SETORIAL DE IOT: ANATEL (Lei 9.472/97) E LGPD (Lei 13.709/18)
    $conectividadeRf = $dados['conectividade_iot_rf'] ?? 'MODULO_RF_HOMOLOGADO';
    $telemetriaIot = $dados['telemetria_dados_iot'] ?? 'DADOS_AMBIENTAIS_MAQUINA';

    if ($conectividadeRf === 'TRANSCEPTOR_RF_CUSTOM') {
        $alertasLicenca[] = [
            'nivel' => 'ATENCAO',
            'titulo' => 'Obrigação Regulatória de Telecomunicações — Homologação de Rádio Customizado na ANATEL (Lei nº 9.472/1997, Art. 162)',
            'descricao' => 'Como o hardware implementa transceptor de radiofrequência ou antena própria na PCB, o Art. 162 da Lei Geral de Telecomunicações proíbe sua comercialização sem prévia homologação da ANATEL (Resolução nº 715/2019 e Ato nº 14448/2017).'
        ];
    } elseif ($conectividadeRf === 'MODULO_RF_HOMOLOGADO') {
        $alertasLicenca[] = [
            'nivel' => 'INFO',
            'titulo' => 'Conformidade ANATEL para Dispositivos IoT com Módulo RF Pré-Homologado (Resolução ANATEL nº 715/2019)',
            'descricao' => 'O uso de módulo de rádio já certificado pela ANATEL na PCB (ex: ESP32/LoRa) permite aproveitar os ensaios de RF, devendo exibir o código ANATEL no produto final.'
        ];
    }

    if ($telemetriaIot === 'DADOS_BIOMETRICOS_SAUDE') {
        $alertasLicenca[] = [
            'nivel' => 'ATENCAO',
            'titulo' => 'Dados Sensíveis na LGPD (Lei nº 13.709/18, Art. 11) e Regulação Sanitária ANVISA (RDC 751/22 e 657/22)',
            'descricao' => 'Sensores que coletam sinais vitais/biometria tratam Dados Pessoais Sensíveis (Art. 11 da LGPD), exigindo criptografia (Art. 46 da LGPD) e enquadramento perante a ANVISA (Dispositivo Médico / SaMD).'
        ];
    } elseif ($telemetriaIot === 'DADOS_PESSOAIS_IOT') {
        $alertasLicenca[] = [
            'nivel' => 'INFO',
            'titulo' => 'Segurança e Privacy by Design em IoT (LGPD — Lei nº 13.709/2018, Art. 6º e Art. 46, § 2º)',
            'descricao' => 'A coleta de dados vinculados a pessoas naturais em dispositivos IoT exige medidas técnicas de segurança (criptografia TLS/AES e minimização na borda) desde a concepção do produto (Art. 46, § 2º da LGPD).'
        ];
    }

    // CAMADA A: DOCUMENTAÇÃO TÉCNICA E FRAGILIDADE DO COPYLEFT NO HARDWARE (Lei 9.610/98)
    $alertasLicenca[] = [
        'nivel' => 'INFO',
        'titulo' => 'Camada A — Fragilidade Jurídica do Copyleft no Hardware (Lei nº 9.610/1998, Art. 7º, XI)',
        'descricao' => 'Na Camada A (esquemáticos, leiaute de PCB e manuais), a Lei nº 9.610/1998 protege apenas a expressão gráfica do desenho, e não a função elétrica. Sem patente na Camada F, terceiros podem recriar o circuito funcional por engenharia reversa limpa sem violar a licença copyleft.'
    ];

    // ANÁLISE DE CONFLITOS E CONTAMINAÇÃO DE LICENÇAS (SOFTWARE / FIRMWARE)
    $licencaSwRecomendada = 'Proprietária (Direito Autoral Reservado — Lei 9.609/98)';
    if (in_array($modeloNegocio, ['OPEN_SOURCE_TOTAL', 'PUBLICACAO_DEFENSIVA'])) {
        $licencaSwRecomendada = ($licencaBibs === 'GPL_V2_V3') ? 'GNU GPLv3' : ($licencaBibs === 'LGPL_ESTATICA' ? 'GNU LGPLv3' : 'MIT License / Apache 2.0');
    }

    $querFecharSw = in_array($modeloNegocio, ['COMERCIAL_FECHADO', 'HIBRIDO_HW_ABERTO_SW_FECHADO']);

    if ($licencaBibs === 'GPL_V2_V3' && $querFecharSw) {
        $riscoContaminacao = 'ALTO_CRITICO';
        $scoreProtegibilidade -= 25;
        array_unshift($alertasLicenca, [
            'nivel' => 'CRITICO',
            'titulo' => 'Impedimento Contratual: Biblioteca GNU GPLv3 em Firmware Fechado',
            'descricao' => 'As licenças apoiam-se no monopólio autoral (Lei 9.610/98): você não pode distribuir código derivado de biblioteca GPLv3 em binário fechado. A GPLv3 exige disponibilizar todo o código-fonte do firmware e proíbe travas de gravação física (Anti-Tivoização).'
        ]);
        $licencaSwRecomendada = 'GNU GPLv3 (Obrigatória por derivação) ou Substituição da Biblioteca';
    } elseif ($licencaBibs === 'LGPL_ESTATICA' && $vinculacaoFw === 'ESTATICA_MONOLITICA' && $querFecharSw) {
        $riscoContaminacao = 'MEDIO';
        array_unshift($alertasLicenca, [
            'nivel' => 'ATENCAO',
            'titulo' => 'Condição de Relinkagem Estática (GNU LGPL em Microcontrolador)',
            'descricao' => 'Ao compilar estaticamente uma biblioteca LGPL dentro de uma imagem monolítica de firmware fechado, você deve disponibilizar os arquivos-objeto (.o) para permitir a relinkagem de versões modificadas da biblioteca LGPL.'
        ]);
    } else {
        $alertasLicenca[] = [
            'nivel' => 'SUCESSO',
            'titulo' => 'Conformidade Contratual nas Dependências de Software (Camada E)',
            'descricao' => 'O licenciamento das bibliotecas de firmware é plenamente compatível com o modelo de exploração selecionado.'
        ];
    }

    // LICENÇAS DE HARDWARE ABERTO (CERN-OHL v2 / CC BY-SA / TAPR / Solderpad)
    $licencaHwRecomendada = 'Proprietária (Tutela Gráfica LDA + Patente LPI)';
    $querFecharHw = ($modeloNegocio === 'COMERCIAL_FECHADO');

    if ($hwTerceiros === 'CERN_OHL_S' && $querFecharHw) {
        $riscoContaminacao = 'ALTO_CRITICO';
        $scoreProtegibilidade -= 20;
        array_unshift($alertasLicenca, [
            'nivel' => 'CRITICO',
            'titulo' => 'Violação de Reciprocidade Forte na Documentação de Hardware (CERN-OHL-S / CC BY-SA)',
            'descricao' => 'O projeto deriva de esquemáticos licenciados sob CERN-OHL-S v2 ou CC BY-SA 4.0. A distribuição comercial exige abrir integralmente os arquivos editáveis de esquemático, leiaute de PCB, Gerbers e BOM sob a mesma licença recíproca.'
        ]);
        $licencaHwRecomendada = 'CERN-OHL-S v2 / CC BY-SA 4.0 (Obrigatória por derivação)';
    } elseif ($hwTerceiros === 'CERN_OHL_W' && $querFecharHw) {
        if ($riscoContaminacao === 'NULO') {
            $riscoContaminacao = 'BAIXO';
        }
        $licencaHwRecomendada = 'Híbrida: CERN-OHL-W v2 (Bloco Base) + Proprietária (Módulos Independentes)';
    } elseif (in_array($modeloNegocio, ['OPEN_SOURCE_TOTAL', 'HIBRIDO_HW_ABERTO_SW_FECHADO', 'PUBLICACAO_DEFENSIVA'])) {
        $licencaHwRecomendada = ($hwTerceiros === 'CERN_OHL_P')
            ? 'CERN-OHL-P v2 / Solderpad / TAPR OHL (Permissiva)'
            : 'CERN-OHL-W v2 ou CC BY-SA 4.0 (Padrão OSHWA)';
    }

    // TITULARIDADE E VÍNCULO (Marco Legal CT&I Lei 10.973/04 e Art. 4º da Lei 9.609/98)
    if ($titularidade === 'VINCULO_EMPREGATICIO_ICT') {
        $alertasLicenca[] = [
            'nivel' => 'ATENCAO',
            'titulo' => 'Marco Legal de CT&I (Lei nº 10.973/2004) e Art. 4º da Lei de Software',
            'descricao' => 'Projetos desenvolvidos em ICTs possuem titularidade originária vinculada à instituição e são geridos pelo Núcleo de Inovação Tecnológica (NIT). No caso de vínculo empregatício/prestação de serviços, aplica-se a titularidade do empregador (Art. 4º da Lei nº 9.609/98).'
        ];
    } elseif ($titularidade === 'PARCERIA_COAUTORIA') {
        $alertasLicenca[] = [
            'nivel' => 'ATENCAO',
            'titulo' => 'Prevenção de Litígio Societário sobre a Marca (Lição Arduino LLC vs. Arduino SRL)',
            'descricao' => 'Quando há múltiplos cofundadores, é indispensável firmar a Cessão de Direitos e o Acordo de Cotitularidade unificando o depósito da Marca no INPI sob uma única entidade jurídica.'
        ];
    }

    $scoreProtegibilidade = max(15, min(100, $scoreProtegibilidade));
    $primaria = $recomendacoesInpi[0]['titulo'] ?? 'Registro de Marca (Art. 129 LPI) + Direito Autoral';
    $secundaria = isset($recomendacoesInpi[1]) ? $recomendacoesInpi[1]['titulo'] : 'Tutela Autoral de Software e Documentação';

    return [
        'score_protegibilidade' => $scoreProtegibilidade,
        'risco_contaminacao_licenca' => $riscoContaminacao,
        'protecao_inpi_primaria' => $primaria,
        'protecao_inpi_secundaria' => $secundaria,
        'licenca_hw_recomendada' => $licencaHwRecomendada,
        'licenca_sw_recomendada' => $licencaSwRecomendada,
        'recomendacoes_inpi' => $recomendacoesInpi,
        'alertas_licenca' => $alertasLicenca,
        'camadas_analise' => $camadasAnalise,
        'timestamp_avaliacao' => date('Y-m-d H:i:s')
    ];
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $db = Database::getConnection();
    $modalidades = $db->query("SELECT * FROM modalidades_inpi ORDER BY id ASC")->fetchAll();
    $licencas = $db->query("SELECT * FROM licencas_catalogo ORDER BY id ASC")->fetchAll();
    $historico = $db->query("
        SELECT p.id, p.nome_projeto, p.modelo_negocio, p.data_submissao,
               d.score_protegibilidade, d.risco_contaminacao_licenca,
               d.protecao_inpi_primaria, d.licenca_hw_recomendada, d.licenca_sw_recomendada
        FROM projetos_avaliados p
        INNER JOIN diagnosticos_gerados d ON d.projeto_id = p.id
        ORDER BY p.id DESC LIMIT 15
    ")->fetchAll();

    echo json_encode([
        'sucesso' => true,
        'modalidades_inpi' => $modalidades,
        'licencas_catalogo' => $licencas,
        'historico_avaliacoes' => $historico
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true);

    if (!is_array($input) || empty($input['nome_projeto'])) {
        http_response_code(400);
        echo json_encode(['sucesso' => false, 'erro' => 'Dados do projeto inválidos ou incompletos.']);
        exit;
    }

    $resultado = executarMotorDecisao($input);
    $db = Database::getConnection();

    // Salva Usuário/Projetista
    $stmtUser = $db->prepare("INSERT INTO usuarios (nome_completo, documento_cpf_cnpj, email, instituicao_empresa) VALUES (?, ?, ?, ?)");
    $stmtUser->execute([
        $input['autor_nome'] ?? 'Projetista Anônimo',
        $input['autor_documento'] ?? '000.000.000-00',
        $input['autor_email'] ?? 'contato@observatoriopi.br',
        $input['instituicao_empresa'] ?? 'Independente'
    ]);
    $usuarioId = (int)$db->lastInsertId();

    // Salva Projeto Avaliado
    $stmtProj = $db->prepare("
        INSERT INTO projetos_avaliados (
            usuario_id, nome_projeto, resumo_tecnico, grau_novidade_hardware,
            possui_pcb_customizada, possui_topografia_chip, possui_design_externo_novo,
            usa_hardware_aberto_terceiros, possui_firmware_proprio, linguagem_firmware,
            licenca_bibliotecas_terceiros, vinculacao_firmware, modelo_negocio, titularidade_tipo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmtProj->execute([
        $usuarioId,
        $input['nome_projeto'],
        $input['resumo_tecnico'] ?? '',
        $input['grau_novidade_hardware'] ?? 'MELHORIA_FUNCIONAL',
        !empty($input['possui_pcb_customizada']) ? 1 : 0,
        !empty($input['possui_topografia_chip']) ? 1 : 0,
        !empty($input['possui_design_externo_novo']) ? 1 : 0,
        $input['usa_hardware_aberto_terceiros'] ?? 'NENHUM',
        !empty($input['possui_firmware_proprio']) ? 1 : 0,
        $input['linguagem_firmware'] ?? 'C/C++',
        $input['licenca_bibliotecas_terceiros'] ?? 'MIT_BSD_APACHE',
        $input['vinculacao_firmware'] ?? 'ESTATICA_MONOLITICA',
        $input['modelo_negocio'] ?? 'COMERCIAL_FECHADO',
        $input['titularidade_tipo'] ?? 'AUTONOMO_EMPRESA'
    ]);
    $projetoId = (int)$db->lastInsertId();

    // Salva Diagnóstico Gerado
    $stmtDiag = $db->prepare("
        INSERT INTO diagnosticos_gerados (
            projeto_id, score_protegibilidade, risco_contaminacao_licenca,
            protecao_inpi_primaria, protecao_inpi_secundaria,
            licenca_hw_recomendada, licenca_sw_recomendada, json_parecer_completo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmtDiag->execute([
        $projetoId,
        $resultado['score_protegibilidade'],
        $resultado['risco_contaminacao_licenca'],
        $resultado['protecao_inpi_primaria'],
        $resultado['protecao_inpi_secundaria'],
        $resultado['licenca_hw_recomendada'],
        $resultado['licenca_sw_recomendada'],
        json_encode($resultado, JSON_UNESCAPED_UNICODE)
    ]);
    $diagnosticoId = (int)$db->lastInsertId();

    $resultado['projeto_id'] = $projetoId;
    $resultado['diagnostico_id'] = $diagnosticoId;

    echo json_encode([
        'sucesso' => true,
        'diagnostico' => $resultado
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
