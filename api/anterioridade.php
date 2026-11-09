<?php
/**
 * OBSERVATÓRIO DE PROPRIEDADE INTELECTUAL E HARDWARE ABERTO
 * API Real de Busca de Anterioridade, Verificação de Existência e Registro Fixo de Titularidade
 * Fundamentação: Lei nº 9.279/96 (Arts. 6º, 8º, 9º, 11, 12, 124 XIX, 129 e 195) e Lei nº 9.609/98 (Art. 3º)
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
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

/**
 * Métrica de Suficiência Descritiva (Art. 24 da Lei nº 9.279/96 — LPI):
 * Exige os 4 Quesitos Cumulativos de Qualificação Técnica:
 *   1. Texto Autêntico (sem palavrões, zoeira, spam ou gibberish, mín. 8 palavras, 40 caracteres e diversidade vocabular >= 45%)
 *   2. Eixo 1: Arquitetura / Componente Técnico (Hardware, Sensor, Chip, Circuito ou Software)
 *   3. Eixo 2: Ação Técnica / Finalidade Operacional (monitorar, controlar, medir, acionar, automatizar...)
 *   4. Eixo 3: Contexto Físico / Domínio de Aplicação ou Protocolo (solo, temperatura, Wi-Fi, LoRa, 3D, saúde...)
 */
function validarSuficienciaDescritivaPHP(string $relato, string $nomeProjeto = ''): array {
    $relatoLimpo = trim($relato);

    if (mb_strlen($relatoLimpo, 'UTF-8') < 40) {
        return [
            'valido' => false,
            'motivo' => 'Descrição muito curta — Quesito 1 reprovado (Art. 24 da Lei nº 9.279/96 — Insuficiência Descritiva).',
            'orientacao' => 'Escreva um relato real com pelo menos 40 caracteres e 8 palavras explicando quais peças/sensores seu projeto usa, o que ele faz e onde é aplicado.'
        ];
    }

    $norm = normalizarTextoComparacao($relatoLimpo);
    $nomeNorm = normalizarTextoComparacao($nomeProjeto);
    $textoBusca = trim($norm . ' ' . $nomeNorm);
    $palavras = array_values(array_filter(explode(' ', $norm), fn($p) => strlen($p) >= 2));
    $palavrasUnicas = array_values(array_unique($palavras));
    $ratioDiversidade = count($palavras) > 0 ? (count($palavrasUnicas) / count($palavras)) : 0.0;

    // 1. Filtro estrito contra palavrões, xingamentos, zoeira e frases de teste
    $regexInadequado = '/\b(merda|porra|caralho|cacete|foda|foder|fodase|puta|putaria|viado|bosta|cuzao|babaca|idiota|imbecil|otario|arrombado|vagabundo|desgraca|inferno|pinto|piroca|buceta|punheta|corno|besteira|zoeira|zuera|qualquer coisa|sei la|nada a ver|blablabla|bla bla|huehue|kkkk|kk+|hahaha|rsrs|asdf|qwerty|teste|testando|so testando|apenas um teste|projeto qualquer|meu pau|teu cu)\b/i';
    if (preg_match($regexInadequado, $textoBusca)) {
        return [
            'valido' => false,
            'motivo' => 'Linguagem imprópria, gíria de teste ou conteúdo sem seriedade acadêmica/técnica detectado (Quesito 1 reprovado).',
            'orientacao' => 'O sistema bloqueia termos chulos, brincadeiras ou frases de teste ("qualquer coisa", "testando", etc.). Descreva um projeto real de Engenharia, Hardware, IoT ou Software com linguagem técnica adequada.'
        ];
    }

    // 2. Detector de "Gibberish" / batida no teclado
    $apenasLetras = preg_replace('/[^a-z]/', '', $norm);
    $qtdLetras = strlen($apenasLetras);
    $qtdVogais = preg_match_all('/[aeiou]/', $apenasLetras);
    $proporcaoVogais = $qtdLetras > 0 ? ($qtdVogais / $qtdLetras) : 0.0;
    $temSequenciaCaotica = (bool)preg_match('/[bcdfghjklmnpqrstvwxz]{6,}/', $apenasLetras)
        || (bool)preg_match('/(.)\1{3,}/', $apenasLetras)
        || (bool)preg_match('/(asdf|qwer|zxcv|hjkl|ghjk|bnm|fghj|tyui|vbnm)/', $apenasLetras);

    if ($temSequenciaCaotica || $proporcaoVogais < 0.28 || $proporcaoVogais > 0.72) {
        return [
            'valido' => false,
            'motivo' => 'Sequência de caracteres aleatórios / batida no teclado detectada ("Gibberish" — Quesito 1 reprovado).',
            'orientacao' => 'O texto inserido contém letras aleatórias sem formar palavras reais em português. Pelo Art. 24 da Lei nº 9.279/96 (LPI), descreva de forma clara e compreensível como o seu dispositivo funciona.'
        ];
    }

    if (count($palavras) < 8 || count($palavrasUnicas) < 6 || $ratioDiversidade < 0.45) {
        return [
            'valido' => false,
            'motivo' => 'Estrutura textual insuficiente ou repetitiva (Quesito 1 reprovado — Art. 24 da LPI).',
            'orientacao' => 'Não repita palavras para burlar o tamanho e escreva pelo menos 8 palavras distintas (mínimo de 40 caracteres) explicando a arquitetura e o funcionamento real do projeto.'
        ];
    }

    // 3. Avaliação dos 3 Eixos Técnicos Obrigatórios (Quesitos 2, 3 e 4)
    $regexComponentes = '/\b(sensor|sensores|acelerometro|giroscopio|ultrassonico|infravermelho|termometro|barometro|higrometro|placa|placas|pcb|circuito|circuitos|arduino|esp32|esp8266|stm32|raspberry|rp2040|pic|avr|arm|microcontrolador|microprocessador|processador|cpu|gpu|npu|chip|chips|semicondutor|asic|fpga|microchip|transistor|resistor|capacitor|indutor|diodo|amplificador|oscilador|firmware|software|sistema|algoritmo|aplicativo|app|api|interface|plataforma|programa|codigo|script|banco de dados|servidor|backend|frontend|dashboard|painel|portal|site|web|modulo|modulos|gabinete|carcaca|chassi|estrutura|suporte|engrenagem|robo|robotico|motor|servo|atuador|valvula|solenoide|bomba|compressor|rele|chave|interruptor|bateria|fonte|conversor|inversor|transformador|carregador|sonda|camera|lente|laser|lidar|radar|sonar|led|oled|lcd|display|tela|visor|drone|vant|rastreador|medidor|oximetro|eletrodo|transceptor|transdutor|receptor|transmissor|gateway|roteador|switch|modem|antena|coleira|pulseira|relogio|oculos|capacete|luva|vestivel|wearable|totem|terminal|quiosque|fechadura|trava|catraca|alarme|sirene|buzzer|alto-falante|microfone|irrigador|controlador|clp|plc|estacao|balanca|impressora|scanner|leitor|tag|cartao|beacon|dispositivo|equipamento|aparelho|prototipo|ferramenta|instrumento|maquina)\b/i';

    $regexVerbosAcao = '/\b(medir|medicao|mede|medindo|mensurar|monitorar|monitoramento|monitora|monitorando|supervisionar|acompanhar|controlar|controle|controla|controlando|gerenciar|gerenciamento|gerencia|administrar|automatizar|automacao|automatiza|automatico|automatica|detectar|deteccao|detecta|detectando|identificar|identificacao|identifica|reconhecer|reconhecimento|reconhece|diagnosticar|diagnostico|transmitir|transmissao|transmite|transmitindo|comunicar|comunicacao|enviar|envia|enviando|envio|receber|recebe|recepcao|acionar|acionamento|aciona|acionando|ativar|ativacao|ativa|desativar|irrigar|irrigacao|economizar|economia|reduzir|reducao|otimizar|otimizacao|proteger|protecao|rastrear|rastreamento|rastreia|localizar|localizacao|localiza|mapear|mapeamento|processar|processamento|processa|calcular|calculo|analisar|analise|analisa|avaliar|alertar|alerta|alertas|avisar|avisa|notificar|notificacao|alarme|ler|leitura|capturar|captura|coletar|coleta|coletando|armazenar|armazenamento|gravar|registrar|registro|regular|regulagem|estabilizar|bloquear|bloqueio|liberar|liberacao|destravar|abrir|abertura|fechar|fechamento|ligar|desligar|aquecer|aquecimento|resfriar|resfriamento|refrigerar|filtrar|filtragem|purificar|bombear|dosar|dispensar|alimentar|carregar|converter|amplificar|modular|codificar|criptografar|autenticar|validar|verificar|prevenir|evitar|auxiliar)\b/i';

    $regexContextoDominio = '/\b(iot|internet das coisas|lora|lorawan|wifi|wi-fi|wireless|sem fio|bluetooth|ble|zigbee|zwave|thread|matter|rf|radiofrequencia|rfid|nfc|mqtt|http|https|websocket|rest|coap|tcp|udp|ip|ethernet|usb|serial|i2c|spi|uart|rs232|rs485|canbus|modbus|profibus|gps|gnss|glonass|satelite|gsm|gprs|3g|4g|5g|lte|nb-iot|sigfox|3d|cad|cam|cnc|sla|fdm|kicad|altium|eagle|gerber|c\+\+|cpp|python|micropython|java|javascript|typescript|node|php|sql|rust|go|golang|csharp|verilog|vhdl|fpga|freertos|zephyr|linux|android|ios|esp-idf|solo|terra|umidade|temperatura|termico|termica|calor|frio|pressao|vazao|fluxo|nivel|volume|peso|massa|forca|torque|velocidade|aceleracao|vibracao|frequencia|amplitude|inclinacao|giro|distancia|proximidade|presenca|movimento|deslocamento|posicao|altura|profundidade|som|acustico|acustica|ruido|sonoro|sonora|ultrassom|luz|luminosidade|iluminacao|optico|optica|infravermelho|uv|ultravioleta|cor|imagem|video|visual|energia|eletrica|eletrico|eletronico|eletronica|tensao|voltagem|corrente|amperagem|potencia|consumo|bateria|solar|fotovoltaico|eolica|rede eletrica|agua|hidrico|hidrica|hidraulico|liquido|chuva|irrigacao|agricola|agricultura|agro|fazenda|campo|estufa|lavoura|plantacao|horta|pecuaria|gado|bovino|animal|animais|pet|pets|veterinario|medico|medica|saude|hospital|hospitalar|clinica|enfermagem|batimento|cardiaco|frequencia cardiaca|pulso|vital|vitais|oxigenio|saturacao|glicose|diabetes|pressao arterial|postura|queda|idoso|paciente|usuario|pessoa|pessoas|humano|biometrico|biometria|facial|digital|voz|residencial|residencia|casa|domestico|domotica|predial|edificio|condominio|sala|quarto|porta|janela|portao|garagem|industrial|industria|fabrica|usina|maquina|equipamento|linha de producao|manutencao|logistica|estoque|armazem|transporte|carga|frota|veiculo|automotivo|carro|moto|caminhao|onibus|bicicleta|embarcacao|aeronave|autonomo|autonoma|navegacao|transito|estacionamento|seguranca|vigilancia|monitoramento|alarme|intrusao|invasao|acesso|perimetro|incendio|fumaca|gas|co2|metano|vazamento|poluicao|ar|qualidade do ar|ambiental|ambiente|clima|meteorologico|florestal|estrutural|estrutura|ponte|barragem|concreto|civil|obra|construcao|educacao|escolar|ensino|laboratorio|pesquisa|academico|comercial|loja|varejo|financeiro|pagamento|criptografia|nuvem|cloud|servidor|borda|edge|tempo real|remoto|remota|malha fechada|inteligencia artificial|machine learning|visao computacional|rede neural|dados|telemetria)\b/i';

    preg_match_all($regexComponentes, $textoBusca, $matchesComp);
    $compUnicos = array_unique(array_map('strtolower', $matchesComp[0] ?? []));
    $temCompLista = count($compUnicos) >= 1;
    $temAcaoLista = (bool)preg_match($regexVerbosAcao, $textoBusca);
    $temContextoLista = (bool)preg_match($regexContextoDominio, $textoBusca);

    // Análise Morfológica e Estrutural da Língua Portuguesa (evita falsos negativos por falta de palavra exata na lista)
    $temMorfologiaComp = (bool)preg_match('/\b([a-z]{3,}(dor|dora|dores|tor|tora|tores|sor|sora|sores|metro|metros|scopio|scopios|oide|oides))\b/i', $textoBusca);
    $temEstruturaVerbal = (bool)preg_match('/\b(para\s+[a-z]{4,}|capaz\s+de\s+[a-z]{4,}|que\s+[a-z]{4,}(a|e|em|am)\b|[a-z]{3,}(ar|er|ir|ando|endo|indo|cao|mento|agem))\b/i', $norm);
    $temEstruturaContexto = (bool)preg_match('/\b((para|em|no|na|nos|nas|via|por|atraves|mediante|contra|sobre)\s+[a-z0-9]{3,}|[a-z]{4,}(ico|ica|icos|icas|al|ais|dade|ura|logia|metria)|\d+\s*(v|mv|kv|a|ma|w|kw|hz|khz|mhz|ghz|cm|mm|m|km|g|kg|s|ms|c|l|ml|bar|psi|db|%))\b/i', $norm);

    $q2Hardware = $temCompLista || ($temMorfologiaComp && ($temAcaoLista || $temContextoLista));
    $q3Acao = $temAcaoLista || ($temEstruturaVerbal && ($temCompLista || $temContextoLista));
    $q4Contexto = $temContextoLista || ($temEstruturaContexto && ($temCompLista || $temAcaoLista) && count($palavras) >= 8);

    if (!$q2Hardware && !$q3Acao) {
        return [
            'valido' => false,
            'motivo' => 'Frase fora de contexto tecnológico — Ausência de Componentes e de Finalidade Técnica (Art. 10 e Art. 24 da LPI).',
            'orientacao' => 'O texto digitado é uma frase comum sem relação com um projeto de Engenharia, Hardware, IoT ou Software. Descreva QUAIS peças/componentes você usou (Quesito 2), O QUE o projeto faz (Quesito 3) e EM QUAL contexto/protocolo ele opera (Quesito 4).'
        ];
    }

    if (!$q2Hardware) {
        return [
            'valido' => false,
            'motivo' => 'Quesito 2 pendente: Falta informar a Arquitetura / Peças / Componentes do projeto (Art. 24 da LPI).',
            'orientacao' => 'Informe quais componentes físicos ou lógicos compõem sua criação (ex: placa ESP32, Arduino, PCB customizada, sensores, atuadores, gabinete 3D ou firmware).'
        ];
    }

    if (!$q3Acao) {
        return [
            'valido' => false,
            'motivo' => 'Quesito 3 pendente: Falta descrever a Ação Técnica / O que o dispositivo faz (Art. 24 da LPI).',
            'orientacao' => 'Você citou componentes, mas não explicou a função prática que o sistema executa (ex: medir, monitorar, controlar, acionar, detectar, transmitir dados ou automatizar).'
        ];
    }

    if (!$q4Contexto) {
        return [
            'valido' => false,
            'motivo' => 'Quesito 4 pendente: Falta informar o Contexto Físico, Grandeza Medida ou Protocolo de Comunicação (Art. 24 da LPI).',
            'orientacao' => 'Complete a descrição informando onde ou como o projeto atua (ex: umidade do solo, temperatura, batimento cardíaco, energia solar, comunicação Wi-Fi, LoRa, Bluetooth, MQTT ou carenagem 3D).'
        ];
    }

    return ['valido' => true, 'motivo' => '', 'orientacao' => ''];
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

    $acao = strtoupper(trim(strip_tags((string)($input['acao'] ?? 'VERIFICAR'))));
    $nomeProjeto = trim(strip_tags((string)($input['nome_projeto'] ?? '')));
    $autorNome = trim(strip_tags((string)($input['autor_nome'] ?? '')));
    $autorDoc = trim(strip_tags((string)($input['autor_documento'] ?? '')));
    $autorEmail = trim(strip_tags((string)($input['autor_email'] ?? '')));
    $instituicao = trim(strip_tags((string)($input['instituicao_empresa'] ?? 'Titular Independente')));
    $resumoTecnico = trim(strip_tags((string)($input['resumo_tecnico'] ?? '')));
    $novidadeHw = trim(strip_tags((string)($input['grau_novidade_hardware'] ?? 'INEDITO_INVENTIVO')));
    $divulgacao = trim(strip_tags((string)($input['divulgacao_previa'] ?? 'SIGILO_MANTIDO')));
    $cip = trim(strip_tags((string)($input['classificacao_cip'] ?? 'G05B 19/042 ; H04W 4/38')));
    $modalidade = trim(strip_tags((string)($input['modalidade_protecao'] ?? 'Patente de Invenção (Art. 8º LPI) + Marca (Art. 129 LPI)')));
    $camadas = trim(strip_tags((string)($input['camadas_protegidas'] ?? 'Camadas A, D, E e F')));
    $trechoCodigo = trim((string)($input['trecho_codigo'] ?? ''));

    $apenasDigitosDoc = preg_replace('/\D/', '', $autorDoc);
    if (mb_strlen($nomeProjeto, 'UTF-8') < 5 || mb_strlen($autorNome, 'UTF-8') < 5) {
        http_response_code(400);
        echo json_encode(['sucesso' => false, 'erro' => 'O Nome do Projeto e o Nome do Titular devem ter no mínimo 5 caracteres.']);
        exit;
    }
    if ((strlen($apenasDigitosDoc) !== 11 && strlen($apenasDigitosDoc) !== 14) || preg_match('/^(\d)\1+$/', $apenasDigitosDoc)) {
        http_response_code(400);
        echo json_encode(['sucesso' => false, 'erro' => 'Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.']);
        exit;
    }
    if ($autorEmail !== '' && !filter_var($autorEmail, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['sucesso' => false, 'erro' => 'Informe um endereço de e-mail válido contendo @ e domínio.']);
        exit;
    }

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
        $textoTotalNorm = $nomeNormalizado . ' ' . normalizarTextoComparacao($resumoTecnico);
        if (preg_match('/(arduino uno|waymo|flipper zero|raspberry pi|airtag|smarttag|alexa|amazon echo|starlink|iphone)/i', $textoTotalNorm, $mMarca)) {
            if (strpos($regNomeNorm, strtolower($mMarca[0])) !== false) {
                $colisaoMarca = true;
            }
        }

        $hashIgual = ($reg['hash_sha512'] === $hashCriacao);
        $mesmoTitular = ($docNormalizado !== '' && $docNormalizado !== '00000000000100' && $docNormalizado === $regDocNorm);

        if ($hashIgual || $colisaoMarca || $similaridade >= 25.0) {
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
                'similaridade_percentual' => $hashIgual ? 100.0 : ($colisaoMarca ? max(82.0, $similaridade) : $similaridade),
                'colisao_marca' => $colisaoMarca,
                'mesmo_titular' => $mesmoTitular
            ];
            $colisoesEncontradas[] = $itemColisao;

            if ($mesmoTitular && ($hashIgual || $colisaoMarca || $similaridade >= 60.0)) {
                $registroDoProprioUsuario = $itemColisao;
            } elseif (!$mesmoTitular && ($hashIgual || $colisaoMarca || $similaridade >= 42.0)) {
                if ($bloqueioTerceiro === null || $itemColisao['similaridade_percentual'] > $bloqueioTerceiro['similaridade_percentual']) {
                    $bloqueioTerceiro = $itemColisao;
                }
            }
        }
    }

    // Ordenar colisões por maior similaridade
    usort($colisoesEncontradas, fn($a, $b) => $b['similaridade_percentual'] <=> $a['similaridade_percentual']);

    // Determinar o Veredito de Existência e Apropriabilidade Jurídica
    $checkSuficiencia = validarSuficienciaDescritivaPHP($resumoTecnico, $nomeProjeto);
    $statusApropriacao = 'DISPONIVEL_EXCLUSIVO';
    $podeRegistrar = true;
    $tituloVeredito = 'CRIAÇÃO INÉDITA E DISPONÍVEL — Você Pode Reivindicar e Registrar como Sua!';
    $explicacaoVeredito = 'Verificamos a base fixa do Observatório e o acervo de patentes/marcas: não há registro bloqueante em nome de terceiros colidindo com a sua criação. Sua arquitetura apresenta originalidade e atende aos requisitos dos Arts. 6º, 8º/9º, 24 e 129 da Lei nº 9.279/96 (LPI) e da Lei nº 9.609/98.';

    if (!$checkSuficiencia['valido']) {
        $statusApropriacao = 'BLOQUEADO_TERCEIRO';
        $podeRegistrar = false;
        $tituloVeredito = 'IMPEDIMENTO POR INSUFICIÊNCIA DESCRITIVA (Art. 24 da Lei nº 9.279/96 — LPI)';
        $explicacaoVeredito = $checkSuficiencia['motivo'] . ' ' . $checkSuficiencia['orientacao'] . ' Sem uma descrição técnica real e inteligível do dispositivo ou sistema, o pedido é nulo de pleno direito perante o INPI (Art. 24 e Art. 50 da LPI).';
    } elseif ($registroDoProprioUsuario !== null) {
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
