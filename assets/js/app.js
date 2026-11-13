/**
 * OBSERVATÓRIO DE PROPRIEDADE INTELECTUAL E HARDWARE ABERTO (BRASIL)
 * Projeto Integrador: Informática e Legislação
 * Equipe: Antonio Kayky Gonçalves Vieira, Giullian Bernard Alencar Maia,
 *         Ítalo Brito da Costa, Luís Aquiles Lucena Sá
 */

let ultimoProjetoAvaliado = null;
let ultimoDiagnostico = null;
let ultimaVerificacaoExistencia = null;
let ultimoResultadoMundial = null; // última busca mundial (usada no certificado)
let cacheRegistrosFixos = [];

// Estado do Fluxo Guiado em Etapas (Modo Usuário Padrão)
let perfilAcessoAtual = 'USUARIO';
let blocoAtualUsuario = 1; // 1 = Bloco 1, 2 = Bloco 2, 3 = Bloco 3
let etapaAbaLiberadaUsuario = 1; // 1 = Etapa 1 liberada, 2 = Etapa 2 liberada

// Acervo de REFERÊNCIA ILUSTRATIVO (exemplos didáticos de produtos conhecidos — NÃO são registros oficiais do INPI; sincronizado com database/schema.sql)
const ACERVO_BASE_INPI_PADRAO = [
    {
        protocolo_registro: 'REF-ILUSTR-01',
        origem_base: 'ACERVO_REFERENCIA_ILUSTRATIVO',
        nome_criacao_marca: 'Arduino Uno / Plataforma Arduino Oficial',
        titular_nome: 'Arduino AG / Arduino LLC',
        titular_documento: 'N/D (referência ilustrativa)',
        instituicao_empresa: 'Arduino SA (Suíça / Itália / EUA)',
        resumo_tecnico: 'Placa microcontroladora baseada em ATmega328P com esquemáticos abertos sob CC BY-SA 4.0, bootloader LGPL e marca nominativa e figurativa registrada exclusivamente.',
        palavras_chave: 'arduino uno atmega328p placa prototipagem genuino cc by-sa 4.0 bootloader ide',
        classificacao_cip: 'G06F 15/78 ; H05K 1/02',
        modalidade_protecao: 'Marca Registrada Exclusiva (Art. 129 LPI) + Hardware Aberto CC BY-SA',
        camadas_protegidas: 'Camada D (Marca Exclusiva) • Camadas A e E Abertas',
        status_juridico: 'OPEN_HARDWARE_MARCA_PROTEGIDA',
        hash_sha512: '1a5b74b2dc903d9d04c1c951ef46c4ae96492829ab9296d5d6972162fe26ce13a18445a90254b275db4fcd9ff56fe3dbb8d053dff9d3a341dbe709c4efa8791f',
        data_registro: ''
    },
    {
        protocolo_registro: 'REF-ILUSTR-02',
        origem_base: 'ACERVO_REFERENCIA_ILUSTRATIVO',
        nome_criacao_marca: 'Waymo LiDAR Sensor de Varredura Óptica Autônoma (GBR3)',
        titular_nome: 'Waymo LLC / Alphabet Inc.',
        titular_documento: 'N/D (referência ilustrativa)',
        instituicao_empresa: 'Waymo LLC (Mountain View, CA)',
        resumo_tecnico: 'Sistema transdutor LiDAR de varredura a laser com placa PCB única de disparo de feixes ópticos e processamento de tempo de voo (ToF) para veículos autônomos.',
        palavras_chave: 'waymo lidar sensor laser varredura optica veiculo autonomo pcb disparo feixe tof',
        classificacao_cip: 'G01S 17/08 ; G01S 7/481',
        modalidade_protecao: 'Patente de Invenção Vigente (Art. 8º LPI) + Segredo Industrial',
        camadas_protegidas: 'Camada F (Patente PI) + Camada A/E (Segredo Industrial Art. 195 XI)',
        status_juridico: 'PROTEGIDO_EXCLUSIVO',
        hash_sha512: 'bba3926d04b25bbed1efc507e7bf0aedb087a694e58887b9bb5b60d89946efa374b79329b0feedd789c9a065d3a7787cc01621bc1ba5e7274e33692af8d32b50',
        data_registro: ''
    },
    {
        protocolo_registro: 'REF-ILUSTR-03',
        origem_base: 'ACERVO_REFERENCIA_ILUSTRATIVO',
        nome_criacao_marca: 'Microarquitetura x86 Core & Topografia de Silício Multi-Cache',
        titular_nome: 'Intel Corporation',
        titular_documento: 'N/D (referência ilustrativa)',
        instituicao_empresa: 'Intel Corporation (Santa Clara, CA)',
        resumo_tecnico: 'Configuração tridimensional de 19 camadas de máscara litográfica CMOS em silício (arquivos GDSII) e microcódigo de controle de barramento.',
        palavras_chave: 'intel amd processador x86 topografia circuito integrado silicio mascara gdsii cache cmos',
        classificacao_cip: 'H01L 27/02 ; G06F 15/78',
        modalidade_protecao: 'Topografia de Circuito Integrado (Lei 11.484/07) + Direito Autoral de Microcódigo',
        camadas_protegidas: 'Camada C (Topografia Lei 11.484/07) + Camada E (Microcódigo)',
        status_juridico: 'PROTEGIDO_EXCLUSIVO',
        hash_sha512: '8476b89345796d3ec42e7c62491e2d9ecff96cfd3fe3e91ce51e0f5fce43a757de029b07217b8e6a075c0a37c5e1e4850046c82a6c66bb40b97ca45a3d2849b9',
        data_registro: ''
    },
    {
        protocolo_registro: 'REF-ILUSTR-04',
        origem_base: 'ACERVO_REFERENCIA_ILUSTRATIVO',
        nome_criacao_marca: 'Marca G Gradiente iphone / Apple iPhone (Classe NCL 9)',
        titular_nome: 'IGB Eletrônica S.A. (Gradiente) / Apple Inc.',
        titular_documento: 'N/D (referência ilustrativa)',
        instituicao_empresa: 'IGB Eletrônica S.A. / Apple Inc.',
        resumo_tecnico: 'Signo distintivo nominativo e misto para aparelhos telefônicos e dispositivos móveis inteligentes na Classe NCL 9 perante o INPI (caso de coexistência discutido judicialmente no Brasil).',
        palavras_chave: 'iphone gradiente apple smartphone telefone celular marca ncl 9 coexistencia inpi',
        classificacao_cip: 'H04M 1/02',
        modalidade_protecao: 'Registro de Marca Nominativa/Mista (Art. 124, XIX e Art. 129 da LPI)',
        camadas_protegidas: 'Camada D (Signo Distintivo Registrado no INPI)',
        status_juridico: 'PROTEGIDO_EXCLUSIVO',
        hash_sha512: 'c6124dddbb674f7270786f145978e214039005850b78f3ad494bb0131a8cc671393e8e213b681552344ae4e70bd7727bc3c96a88760b5b91ad3a616eb088f777',
        data_registro: ''
    },
    {
        protocolo_registro: 'REF-ILUSTR-05',
        origem_base: 'ACERVO_REFERENCIA_ILUSTRATIVO',
        nome_criacao_marca: 'Módulo SoC ESP32-WROOM Wi-Fi & Bluetooth Low Energy Dual-Core',
        titular_nome: 'Espressif Systems (Shanghai) Co., Ltd.',
        titular_documento: 'N/D (referência ilustrativa)',
        instituicao_empresa: 'Espressif Systems',
        resumo_tecnico: 'Módulo transceptor integrado com microprocessador Xtensa Dual-Core 32-bit LX6, pilha RF Wi-Fi 802.11 b/g/n e Bluetooth BLE 4.2/5.0 pré-homologado na ANATEL.',
        palavras_chave: 'esp32 esp8266 wroom espressif modulo wifi bluetooth ble xtensa microcontrolador padrao',
        classificacao_cip: 'H04W 4/80 ; H01L 23/66',
        modalidade_protecao: 'Componente Comercial Protegido (Vedada apropriação do módulo em si por terceiros — Art. 8º LPI)',
        camadas_protegidas: 'Camadas C, D e F pertencentes ao fabricante do SoC',
        status_juridico: 'PROTEGIDO_EXCLUSIVO',
        hash_sha512: '23cfc4fae1796ce0b1029a9b413fed62abed22a0b2e8d92408ce8986f56737bdcf6a427989c1567e4edaa1db46c1adc9f16afcdb09f4f384fb199c1239f8441f',
        data_registro: ''
    },
    {
        protocolo_registro: 'REF-ILUSTR-06',
        origem_base: 'ACERVO_REFERENCIA_ILUSTRATIVO',
        nome_criacao_marca: 'Raspberry Pi / Computador de Placa Única ARM (SBC)',
        titular_nome: 'Raspberry Pi Ltd / Raspberry Pi Foundation',
        titular_documento: 'N/D (referência ilustrativa)',
        instituicao_empresa: 'Raspberry Pi Ltd (Cambridge, Reino Unido)',
        resumo_tecnico: 'Computador de placa única (Single Board Computer) com processador Broadcom ARM, barramento GPIO de 40 pinos, HDMI e conectividade sem fio sob marca registrada exclusiva.',
        palavras_chave: 'raspberry pi rp2040 pico sbc broadcom arm placa unica minicomputador gpio',
        classificacao_cip: 'G06F 1/16 ;G06F 15/78',
        modalidade_protecao: 'Marca Registrada Exclusiva (Art. 129 LPI) + Hardware Proprietário/Misto',
        camadas_protegidas: 'Camadas A, C, D e E protegidas pela Raspberry Pi Foundation',
        status_juridico: 'PROTEGIDO_EXCLUSIVO',
        hash_sha512: 'e403bee985d5eb198b366a9934a0e5dc9bb2c13324f28f36789c7de45a425b9ab4f94f0e94399ba9ac0c7ee0927f5355a25c79b17ad26e633b6902c272f58d1b',
        data_registro: ''
    },
    {
        protocolo_registro: 'REF-ILUSTR-07',
        origem_base: 'ACERVO_REFERENCIA_ILUSTRATIVO',
        nome_criacao_marca: 'Flipper Zero — Dispositivo Portátil Multitool Sub-GHz, RFID, NFC e Infravermelho',
        titular_nome: 'Flipper Devices Inc.',
        titular_documento: 'N/D (referência ilustrativa)',
        instituicao_empresa: 'Flipper Devices Inc. (Delaware, EUA)',
        resumo_tecnico: 'Aparelho eletrônico portátil baseado em STM32WB55 para inspeção de protocolos de rádio Sub-1GHz (CC1101), RFID 125kHz, NFC, Infravermelho e GPIO.',
        palavras_chave: 'flipper zero subghz rfid nfc infravermelho cc1101 stm32wb55 multitool radiofrequencia',
        classificacao_cip: 'H04B 1/38 ; G06K 7/10',
        modalidade_protecao: 'Marca Registrada Exclusiva (Art. 129 LPI) + Desenho Industrial (Art. 94 LPI)',
        camadas_protegidas: 'Camada B (Gabinete) e Camada D (Marca Exclusiva)',
        status_juridico: 'PROTEGIDO_EXCLUSIVO',
        hash_sha512: 'c5d1805cd009af602c3d4c54289f2ab4880f18bc7fc69879515d0850d6b9ccfcf8296abfca357f04c9403d187bc30cab1357631fa0017a847d2253a882811f62',
        data_registro: ''
    },
    {
        protocolo_registro: 'REF-ILUSTR-08',
        origem_base: 'ACERVO_REFERENCIA_ILUSTRATIVO',
        nome_criacao_marca: 'Amazon Echo / Alexa — Assistente de Voz Inteligente com Matriz de Microfones',
        titular_nome: 'Amazon Technologies, Inc.',
        titular_documento: 'N/D (referência ilustrativa)',
        instituicao_empresa: 'Amazon.com, Inc. (Seattle, WA)',
        resumo_tecnico: 'Caixa de som e hub de automação residencial controlado por voz com matriz circular de microfones (beamforming), detecção de palavra de ativação (wake word) e integração em nuvem.',
        palavras_chave: 'alexa amazon echo assistente voz caixa som inteligente smart speaker automacao residencial microfone',
        classificacao_cip: 'G10L 15/22 ; H04R 1/40',
        modalidade_protecao: 'Patente de Invenção + Marca de Alto Renome (Art. 125 e Art. 129 LPI)',
        camadas_protegidas: 'Camadas B, D, E e F pertencentes à Amazon Technologies',
        status_juridico: 'PROTEGIDO_EXCLUSIVO',
        hash_sha512: '416d28f8a7eb20e489f874949ce7bf75309ae1039c0a21c7fd5c690ea012a4a92f1942a5274b6fcc06643e5f5f65a9722126903da7a95aabdbeaefd9260e5771',
        data_registro: ''
    },
    {
        protocolo_registro: 'REF-ILUSTR-09',
        origem_base: 'ACERVO_REFERENCIA_ILUSTRATIVO',
        nome_criacao_marca: 'Apple AirTag / Samsung SmartTag — Rastreador Bluetooth e Ultra-Wideband (UWB)',
        titular_nome: 'Apple Inc. / Samsung Electronics Co., Ltd.',
        titular_documento: 'N/D (referência ilustrativa)',
        instituicao_empresa: 'Apple Inc. (Cupertino, CA)',
        resumo_tecnico: 'Dispositivo localizador e chaveiro rastreador de objetos via rede mesh Bluetooth Low Energy (BLE) e chip Ultra-Wideband (UWB) para localização espacial de precisão.',
        palavras_chave: 'airtag smarttag apple samsung rastreador rastreadora rastreamento tag tags radiofrequencia uwb bluetooth chaveiro localizador tracker objetos perdidos',
        classificacao_cip: 'G01S 5/02 ; H04W 4/029',
        modalidade_protecao: 'Patente de Invenção + Desenho Industrial + Marca (exemplo ilustrativo)',
        camadas_protegidas: 'Camadas B, C, D, E e F protegidas mundialmente',
        status_juridico: 'PROTEGIDO_EXCLUSIVO',
        hash_sha512: '6c8fdddb1d1a7f99415c23cf3ee4ce3a1d8b4a0660836b60bfdd2f60d530346c99c2b529f58be6440f89d083bf621b319fe567d45f221710db07b8740598e7d9',
        data_registro: ''
    },
    {
        protocolo_registro: 'REF-ILUSTR-10',
        origem_base: 'ACERVO_REFERENCIA_ILUSTRATIVO',
        nome_criacao_marca: 'Smart Collar Pet Tracker / Whistle GPS / Fi Collar — Coleira Inteligente de Monitoramento Pet',
        titular_nome: 'Whistle Labs Inc. / Fi Smart Dog Collar / Mars Petcare',
        titular_documento: 'N/D (referência ilustrativa)',
        instituicao_empresa: 'Whistle Labs / Fi Collar (San Francisco, CA)',
        resumo_tecnico: 'Dispositivo eletrônico acoplado a coleira para animais domésticos (cães e gatos) com receptor GPS/GNSS, conectividade celular LTE-M e Bluetooth BLE para rastreamento de localização e sinais vitais em tempo real.',
        palavras_chave: 'smart collar pet tracker coleira inteligente pet pets cachorro gato animal animais gps rastreador rastreadora rastreamento coleira localizador bluetooth coleiras geofencing',
        classificacao_cip: 'A01K 11/00 ; G01S 19/14 ; H04W 4/029',
        modalidade_protecao: 'Patente de Invenção / Modelo de Utilidade (exemplo ilustrativo)',
        camadas_protegidas: 'Camadas A, D, E e F pertencentes aos titulares de patentes de coleiras inteligentes',
        status_juridico: 'PROTEGIDO_EXCLUSIVO',
        hash_sha512: 'a5773cc8b4e3af686f28fae2b6b69f17ee5c90e1a7753867105e64c2861bbce2454c48af9b5eb54bad5e837f701d47d6be596b755f26211d71c1a75e040450bd',
        data_registro: ''
    },
    {
        protocolo_registro: 'REF-ILUSTR-11',
        origem_base: 'ACERVO_REFERENCIA_ILUSTRATIVO',
        nome_criacao_marca: 'Fechadura Eletrônica Inteligente com Biometria e Wi-Fi (Yale / Samsung Smart Lock)',
        titular_nome: 'Assa Abloy Inc. / Samsung SDS Co., Ltd.',
        titular_documento: 'N/D (referência ilustrativa)',
        instituicao_empresa: 'Assa Abloy / Yale / Samsung SDS',
        resumo_tecnico: 'Fechadura eletromecânica embutida com sensor leitor biométrico capacitivo de impressão digital, teclado touch, transceptor Wi-Fi/Bluetooth e atuador solenoide motorizado.',
        palavras_chave: 'fechadura inteligente fechadura digital biometria biometrica biometrico leitor digital trava eletrica wifi bluetooth app smart lock yale samsung',
        classificacao_cip: 'E05B 47/00 ; G07C 9/00',
        modalidade_protecao: 'Patente de Invenção (exemplo ilustrativo)',
        camadas_protegidas: 'Camadas A, B, D e F protegidas',
        status_juridico: 'PROTEGIDO_EXCLUSIVO',
        hash_sha512: 'e5a21b89e8d286b4d63f6621df9d122e6da18bf67685440aec551f8fbd5846ae84e29f59c1c1bf568529957ca03d4c5dd563c1246deca7b030e71fa84f8dd8fe',
        data_registro: ''
    },
    {
        protocolo_registro: 'REF-ILUSTR-12',
        origem_base: 'ACERVO_REFERENCIA_ILUSTRATIVO',
        nome_criacao_marca: 'Oxímetro de Pulso Portátil IoT com Fotopletismografia (SpO2 / Masimo / Nellcor)',
        titular_nome: 'Masimo Corporation / Medtronic Nellcor',
        titular_documento: 'N/D (referência ilustrativa)',
        instituicao_empresa: 'Masimo Corporation (Irvine, CA)',
        resumo_tecnico: 'Dispositivo e sensor óptico de fotopletismografia (PPG) com LEDs vermelho (660nm) e infravermelho (940nm) para cálculo de saturação periférica de oxigênio (SpO2) e frequência cardíaca.',
        palavras_chave: 'oximetro oximetria pulso spo2 fotopletismografia oxigenio sangue frequencia cardiaca sensor max30100 max30102 iot saude pulse oximeter masimo',
        classificacao_cip: 'A61B 5/1455 ; A61B 5/024',
        modalidade_protecao: 'Patente de Invenção (expirada) e Regulação Sanitária ANVISA',
        camadas_protegidas: 'Camadas A, C, E e F de domínio do estado da técnica hospitalar',
        status_juridico: 'DOMINIO_PUBLICO_ESTADO_DA_TECNICA',
        hash_sha512: '071818be1d8a97090af09e1d8cb0c38c1eef195b3a2b5dddf785e2f8520037364e7ec51b734cd9f93d744e7cbb0017ff61c0e6f017df98601b27b9e0961e9b6b',
        data_registro: ''
    },
    {
        protocolo_registro: 'REF-ILUSTR-13',
        origem_base: 'ACERVO_REFERENCIA_ILUSTRATIVO',
        nome_criacao_marca: 'Drone Quadricóptero com Estabilização Giroscópica e Câmera Gimbal (DJI Phantom / Mavic)',
        titular_nome: 'SZ DJI Technology Co., Ltd.',
        titular_documento: 'N/D (referência ilustrativa)',
        instituicao_empresa: 'DJI Technology (Shenzhen, China)',
        resumo_tecnico: 'Aeronave não tripulada (VANT/Drone) de quatro rotores acionados por motores brushless, sensores inerciais IMU, giroscópio de 6 eixos e gimbal estabilizador motorizado de câmera.',
        palavras_chave: 'drone quadricoptero vant uav giroscopio gimbal estabilizacao camera voo autonomo controle remoto dji telemetria imu phantom',
        classificacao_cip: 'B64C 39/02 ; B64D 47/08 ; G05D 1/00',
        modalidade_protecao: 'Patente de Invenção + Desenho Industrial (exemplo ilustrativo)',
        camadas_protegidas: 'Camadas A, B, D, E e F protegidas mundialmente pela DJI',
        status_juridico: 'PROTEGIDO_EXCLUSIVO',
        hash_sha512: '70c22af2e3679f65af7dd6e07565ae44c147dbc1b4b52c2d0fddbea7ae8c5379e50a12133232cc6bf4fcb331111c68cbc8933a2d402adbe795920776d35b6dc0',
        data_registro: ''
    },
    {
        protocolo_registro: 'REF-ILUSTR-14',
        origem_base: 'ACERVO_REFERENCIA_ILUSTRATIVO',
        nome_criacao_marca: 'Smartwatch com Eletrocardiograma (ECG) e PPG (Apple Watch / Galaxy Watch)',
        titular_nome: 'Apple Inc. / Samsung Electronics',
        titular_documento: 'N/D (referência ilustrativa)',
        instituicao_empresa: 'Apple Inc. / Samsung Electronics',
        resumo_tecnico: 'Dispositivo vestível inteligente em formato de relógio de pulso com eletrodos de contato dérmico para geração de derivação I de eletrocardiograma (ECG) e fotopletismografia contínua.',
        palavras_chave: 'smartwatch relogio inteligente ecg eletrocardiograma batimentos cardiacos monitor cardiaco ppg sensor vestivel wearable apple watch',
        classificacao_cip: 'A61B 5/0402 ; G04G 21/00',
        modalidade_protecao: 'Patente de Invenção + Desenho Industrial (exemplo ilustrativo)',
        camadas_protegidas: 'Camadas A, B, C, D, E e F pertencentes aos fabricantes líderes de wearables',
        status_juridico: 'PROTEGIDO_EXCLUSIVO',
        hash_sha512: '1041b633714e632e178fbfeeb9756d458a12f3567fb9a4890343addaa5d8a6ca09913548371e77fe301fb6d7b62b05c1dc9c2748bf99614511b5f1e3dba88e2d',
        data_registro: ''
    },
    {
        protocolo_registro: 'REF-ILUSTR-15',
        origem_base: 'ACERVO_REFERENCIA_ILUSTRATIVO',
        nome_criacao_marca: 'Starlink — Antena Phased Array de Satélite LEO (SpaceX)',
        titular_nome: 'Space Exploration Technologies Corp. (SpaceX)',
        titular_documento: 'N/D (referência ilustrativa)',
        instituicao_empresa: 'SpaceX (Hawthorne, CA)',
        resumo_tecnico: 'Terminal transceptor de internet via satélite de baixa órbita (LEO) com antena plana de arranjo faseado (phased array) eletrônico e orientação motorizada automática.',
        palavras_chave: 'starlink spacex antena satelite internet phased array orbita baixa',
        classificacao_cip: 'H01Q 21/06 ; H04B 7/185',
        modalidade_protecao: 'Patente de Invenção + Topografia de Chip + Marca (LPI / Lei 11.484/07)',
        camadas_protegidas: 'Camadas A, B, C, D, E e F protegidas',
        status_juridico: 'PROTEGIDO_EXCLUSIVO',
        hash_sha512: 'dbbd5b8405707a4336d00fced2671422005ddf016932f0ffc9bcf8e1d1815e50914f015e70aa8aa10a47289704b7b14efe35f62fd3fe21cf8465e5a82d021900',
        data_registro: ''
    }
];

// Atualiza o quadro de Orientação Técnica no topo da página
function atualizarBalaoMascote(tag, titulo, falaHtml) {
    const elTag = document.getElementById('mascote-tag');
    const elTitulo = document.getElementById('mascote-titulo');
    const elFala = document.getElementById('mascote-fala');
    if (elTag) elTag.textContent = tag;
    if (elTitulo) elTitulo.textContent = titulo;
    if (elFala) elFala.innerHTML = falaHtml;
}

// Normaliza texto e extrai tokens técnicos para comparação de anterioridade
function normalizarTextoComparacaoJS(texto) {
    if (!texto) return '';
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// Canonização morfológica e mapeamento de equivalências conceituais técnicas
function canonizarTermoTecnicoJS(termo) {
    if (!termo) return '';
    let p = termo.toLowerCase();
    
    // Normalização de plurais e gêneros comuns
    if (p.endsWith('ores') || p.endsWith('oras')) p = p.slice(0, -2);
    else if (p.endsWith('as') || p.endsWith('os') || p.endsWith('es')) p = p.slice(0, -1);
    else if (p.endsWith('ora')) p = p.slice(0, -1);
    else if (p.endsWith('ada') || p.endsWith('ado')) p = p.slice(0, -1);
    
    const mapaConceitos = {
        'tracker': 'rastreador',
        'tracking': 'rastreador',
        'rastreadora': 'rastreador',
        'rastreamento': 'rastreador',
        'rastrear': 'rastreador',
        'localizador': 'rastreador',
        'collar': 'coleira',
        'coleiras': 'coleira',
        'pets': 'pet',
        'animal': 'pet',
        'animais': 'pet',
        'cachorro': 'pet',
        'gato': 'pet',
        'smart': 'inteligente',
        'tags': 'tag',
        'radiofrequencia': 'rf',
        'uwb': 'uwb',
        'biometrica': 'biometria',
        'biometrico': 'biometria',
        'biometricos': 'biometria',
        'lock': 'fechadura',
        'smartlock': 'fechadura',
        'oximeter': 'oximetro',
        'oximetria': 'oximetro',
        'pulso': 'oximetro',
        'watch': 'relogio',
        'smartwatch': 'relogio',
        'quadricopter': 'drone',
        'quadricoptero': 'drone',
        'drones': 'drone',
        'airtags': 'airtag',
        'smarttags': 'smarttag'
    };
    return mapaConceitos[p] || p;
}

function extrairTokensTecnicosJS(texto) {
    const norm = normalizarTextoComparacaoJS(texto);
    if (!norm) return [];
    const stopwords = new Set([
        'de','da','do','das','dos','em','no','na','nos','nas','um','uma','uns','umas',
        'para','por','com','sem','sob','sobre','entre','que','se','ou','ao','aos','as','os',
        'sistema','projeto','dispositivo','aparelho','caso','personalizado','desenvolvi',
        'desenvolvemos','quero','patentear','proteger','como','meu','minha','nosso','nossa',
        'uso','utilizando','baseado','atraves','meio','forma','tipo','novo','nova','placa'
    ]);
    const unicos = new Set();
    norm.split(' ').forEach(p => {
        if (p.length >= 3 && !stopwords.has(p)) {
            unicos.add(p);
            const canon = canonizarTermoTecnicoJS(p);
            if (canon && canon.length >= 2) {
                unicos.add(canon);
            }
        }
    });

    // Mapeamento conceitual composto para patentes conhecidas
    const textoCru = norm;
    if ((textoCru.includes('tag') || textoCru.includes('rastrea') || textoCru.includes('tracker')) && (textoCru.includes('uwb') || textoCru.includes('radiofrequencia') || textoCru.includes('ble'))) {
        unicos.add('uwb');
        unicos.add('rastreador');
        unicos.add('airtag');
        unicos.add('tag');
    }
    if ((textoCru.includes('collar') || textoCru.includes('coleira')) && (textoCru.includes('pet') || textoCru.includes('animal') || textoCru.includes('gps') || textoCru.includes('tracker'))) {
        unicos.add('coleira');
        unicos.add('pet');
        unicos.add('collar');
        unicos.add('smart collar');
        unicos.add('gps');
    }
    if (textoCru.includes('fechadura') && (textoCru.includes('biometr') || textoCru.includes('digital') || textoCru.includes('wifi'))) {
        unicos.add('fechadura');
        unicos.add('biometria');
        unicos.add('smart lock');
    }
    if (textoCru.includes('oximetr') || textoCru.includes('oximetro') || textoCru.includes('spo2')) {
        unicos.add('oximetro');
        unicos.add('spo2');
        unicos.add('fotopletismografia');
    }

    return Array.from(unicos);
}

function calcularSimilaridadeTokensJS(tokensA, tokensB) {
    if (!tokensA.length || !tokensB.length) return 0;
    const setB = new Set(tokensB);
    const intersecao = tokensA.filter(t => setB.has(t));
    const uniaoSize = new Set([...tokensA, ...tokensB]).size;
    const jaccard = intersecao.length / Math.max(1, uniaoSize);
    const coberturaMenor = intersecao.length / Math.max(1, Math.min(tokensA.length, tokensB.length));

    // Se houver múltiplos termos conceituais críticos coincidentes (ex: coleira + pet + gps ou tag + uwb)
    let bonusConceitual = 0;
    const conceitosCriticos = ['uwb', 'airtag', 'coleira', 'collar', 'pet', 'smart collar', 'fechadura', 'biometria', 'oximetro', 'spo2', 'drone', 'smartwatch', 'flipper zero', 'waymo', 'lidar', 'esp32', 'starlink'];
    const intersecaoCritica = intersecao.filter(t => conceitosCriticos.includes(t));
    if (intersecaoCritica.length >= 2) {
        bonusConceitual = 0.35;
    } else if (intersecaoCritica.length === 1) {
        bonusConceitual = 0.15;
    }

    const scoreFinal = Math.min(100, (((jaccard * 0.40) + (coberturaMenor * 0.60) + bonusConceitual) * 100));
    return Number(scoreFinal.toFixed(1));
}

// Gera Hash SHA-512 determinístico (usa WebCrypto SHA-512 quando disponível e fallback hex de 128 chars)
async function gerarHashSHA512Real(entrada) {
    try {
        if (window.crypto && window.crypto.subtle) {
            const encoder = new TextEncoder();
            const data = encoder.encode(entrada);
            const hashBuffer = await window.crypto.subtle.digest('SHA-512', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }
    } catch (e) {}
    // Fallback: implementação SHA-512 real (FIPS 180-4) em JavaScript puro, para navegadores sem WebCrypto
    return sha512PuroJS(entrada);
}

function sha512PuroJS(texto) {
    const K = [
        '428a2f98d728ae22','7137449123ef65cd','b5c0fbcfec4d3b2f','e9b5dba58189dbbc','3956c25bf348b538','59f111f1b605d019','923f82a4af194f9b','ab1c5ed5da6d8118',
        'd807aa98a3030242','12835b0145706fbe','243185be4ee4b28c','550c7dc3d5ffb4e2','72be5d74f27b896f','80deb1fe3b1696b1','9bdc06a725c71235','c19bf174cf692694',
        'e49b69c19ef14ad2','efbe4786384f25e3','0fc19dc68b8cd5b5','240ca1cc77ac9c65','2de92c6f592b0275','4a7484aa6ea6e483','5cb0a9dcbd41fbd4','76f988da831153b5',
        '983e5152ee66dfab','a831c66d2db43210','b00327c898fb213f','bf597fc7beef0ee4','c6e00bf33da88fc2','d5a79147930aa725','06ca6351e003826f','142929670a0e6e70',
        '27b70a8546d22ffc','2e1b21385c26c926','4d2c6dfc5ac42aed','53380d139d95b3df','650a73548baf63de','766a0abb3c77b2a8','81c2c92e47edaee6','92722c851482353b',
        'a2bfe8a14cf10364','a81a664bbc423001','c24b8b70d0f89791','c76c51a30654be30','d192e819d6ef5218','d69906245565a910','f40e35855771202a','106aa07032bbd1b8',
        '19a4c116b8d2d0c8','1e376c085141ab53','2748774cdf8eeb99','34b0bcb5e19b48a8','391c0cb3c5c95a63','4ed8aa4ae3418acb','5b9cca4f7763e373','682e6ff3d6b2b8a3',
        '748f82ee5defb2fc','78a5636f43172f60','84c87814a1f0ab72','8cc702081a6439ec','90befffa23631e28','a4506cebde82bde9','bef9a3f7b2c67915','c67178f2e372532b',
        'ca273eceea26619c','d186b8c721c0c207','eada7dd6cde0eb1e','f57d4f7fee6ed178','06f067aa72176fba','0a637dc5a2c898a6','113f9804bef90dae','1b710b35131c471b',
        '28db77f523047d84','32caab7b40c72493','3c9ebe0a15c9bebc','431d67c49c100d4c','4cc5d4becb3e42b6','597f299cfc657e2a','5fcb6fab3ad6faec','6c44198c4a475817'
    ].map(h => BigInt('0x' + h));
    let H = ['6a09e667f3bcc908','bb67ae8584caa73b','3c6ef372fe94f82b','a54ff53a5f1d36f1','510e527fade682d1','9b05688c2b3e6c1f','1f83d9abfb41bd6b','5be0cd19137e2179']
        .map(h => BigInt('0x' + h));
    const M = (1n << 64n) - 1n;
    const rotr = (x, n) => ((x >> n) | (x << (64n - n))) & M;
    const bytes = Array.from(new TextEncoder().encode(texto));
    const bitLen = BigInt(bytes.length) * 8n;
    bytes.push(0x80);
    while (bytes.length % 128 !== 112) bytes.push(0);
    for (let i = 15; i >= 0; i--) bytes.push(Number((bitLen >> BigInt(i * 8)) & 0xffn));
    for (let off = 0; off < bytes.length; off += 128) {
        const W = new Array(80);
        for (let t = 0; t < 16; t++) {
            let w = 0n;
            for (let j = 0; j < 8; j++) w = (w << 8n) | BigInt(bytes[off + t * 8 + j]);
            W[t] = w;
        }
        for (let t = 16; t < 80; t++) {
            const s0 = rotr(W[t - 15], 1n) ^ rotr(W[t - 15], 8n) ^ (W[t - 15] >> 7n);
            const s1 = rotr(W[t - 2], 19n) ^ rotr(W[t - 2], 61n) ^ (W[t - 2] >> 6n);
            W[t] = (W[t - 16] + s0 + W[t - 7] + s1) & M;
        }
        let [a, b, c, d, e, f, g, h] = H;
        for (let t = 0; t < 80; t++) {
            const S1 = rotr(e, 14n) ^ rotr(e, 18n) ^ rotr(e, 41n);
            const ch = (e & f) ^ (~e & M & g);
            const T1 = (h + S1 + ch + K[t] + W[t]) & M;
            const S0 = rotr(a, 28n) ^ rotr(a, 34n) ^ rotr(a, 39n);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const T2 = (S0 + maj) & M;
            h = g; g = f; f = e; e = (d + T1) & M; d = c; c = b; b = a; a = (T1 + T2) & M;
        }
        H = H.map((v, i) => (v + [a, b, c, d, e, f, g, h][i]) & M);
    }
    return H.map(v => v.toString(16).padStart(16, '0')).join('');
}

// Obtém todos os registros fixos combinando o banco SQL (via API) e o armazenamento persistente local
// Leitura segura do armazenamento do navegador (pode estar bloqueado em modo privado)
function lerListaLocal(chave) {
    try {
        const v = JSON.parse(localStorage.getItem(chave) || '[]');
        return Array.isArray(v) ? v : [];
    } catch (e) {
        return [];
    }
}

function obterRegistrosFixosLocais() {
    const salvosUsuario = lerListaLocal('registros_fixos_observatorio_pi');
    const mapa = new Map();
    [...salvosUsuario, ...cacheRegistrosFixos, ...ACERVO_BASE_INPI_PADRAO].forEach(r => {
        if (r && r.protocolo_registro && !mapa.has(r.protocolo_registro)) {
            mapa.set(r.protocolo_registro, r);
        }
    });
    return Array.from(mapa.values());
}

function salvarRegistroFixoNoLocalStorage(novoReg) {
    const salvos = lerListaLocal('registros_fixos_observatorio_pi');
    const filtrados = salvos.filter(r => r.protocolo_registro !== novoReg.protocolo_registro);
    filtrados.unshift(novoReg);
    try { localStorage.setItem('registros_fixos_observatorio_pi', JSON.stringify(filtrados.slice(0, 50))); } catch (e) {}
}

// Caso base inicial (IoT + Hardware + Software Embarcado real) para demonstração imediata
const CASO_BASE_INICIAL = {
    relato_livre: 'Desenvolvemos um sistema IoT de telemetria e controle autônomo de irrigação agrícola (AgroNode LoRaWAN) com placa PCB de 4 camadas desenhada no KiCad, sonda capacitiva multifrequência acoplada ao solo, microcontrolador ESP32/STM32 operando com módulo LoRa 915MHz e gabinete externo impermeável impresso em 3D. O firmware embarcado em C/C++ (FreeRTOS) processa a impedância dielétrica do solo em tempo real e aciona válvulas solenoides físicas economizando 38% de água. Queremos verificar se essa criação já existe, se podemos colocá-la em nosso nome no INPI sem esbarrar na vedação de software puro (Art. 10, V da LPI) e como cumprir as exigências da ANATEL e da LGPD.',
    nome_projeto: 'AgroNode LoRaWAN — Sistema Embarcado de Telemetria e Irrigação Autônoma',
    autor_nome: 'Antonio Kayky, Giullian Bernard, Ítalo Brito e Luís Aquiles',
    autor_documento: '12.345.678/0001-90',
    autor_email: 'engenharia.iot@observatoriopi.com.br',
    instituicao_empresa: 'Laboratório de Sistemas Embarcados & IoT (Startup / ICT)',
    resumo_tecnico: 'Dispositivo embarcado IoT compreendendo sonda capacitiva multifrequência em PCB multicamada, unidade microcontroladora (ESP32/STM32) com transceptor LoRaWAN 915MHz e malha fechada de acionamento de válvulas hidráulicas assistida por firmware em C/C++, gerando efeito técnico físico mensurável de redução de consumo hídrico.',
    grau_novidade_hardware: 'INEDITO_INVENTIVO',
    divulgacao_previa: 'SIGILO_MANTIDO',
    conectividade_iot_rf: 'MODULO_RF_HOMOLOGADO',
    telemetria_dados_iot: 'DADOS_AMBIENTAIS_MAQUINA',
    possui_pcb_customizada: true,
    possui_topografia_chip: false,
    possui_design_externo_novo: true,
    usa_hardware_aberto_terceiros: 'NENHUM',
    possui_firmware_proprio: true,
    linguagem_firmware: 'C/C++ (ESP-IDF / FreeRTOS / LoRaWAN / MQTT)',
    licenca_bibliotecas_terceiros: 'MIT_BSD_APACHE',
    vinculacao_firmware: 'ESTATICA_MONOLITICA',
    modelo_negocio: 'HIBRIDO_HW_ABERTO_SW_FECHADO',
    titularidade_tipo: 'PARCERIA_COAUTORIA',
    trecho_codigo: '/* SPDX-License-Identifier: MIT */\n// Firmware de controle físico em malha fechada (Enquadramento: Resolução INPI/PR nº 158/2016).'
};

function limparFormularioCompleto() {
    const campoRelato = document.getElementById('relato_livre_usuario');
    if (campoRelato) campoRelato.value = '';
    const feedback = document.getElementById('feedback-relato-livre');
    if (feedback) feedback.style.display = 'none';

    const campoNome = document.getElementById('nome_projeto');
    if (campoNome) {
        campoNome.value = '';
    }
    document.getElementById('autor_nome').value = '';
    document.getElementById('autor_documento').value = '';
    document.getElementById('autor_email').value = '';
    document.getElementById('instituicao_empresa').value = '';
    document.getElementById('resumo_tecnico').value = '';
    if (document.getElementById('palavras_chave_extra')) document.getElementById('palavras_chave_extra').value = '';
    document.getElementById('grau_novidade_hardware').value = 'INEDITO_INVENTIVO';
    if (document.getElementById('divulgacao_previa')) {
        document.getElementById('divulgacao_previa').value = 'SIGILO_MANTIDO';
    }
    if (document.getElementById('conectividade_iot_rf')) {
        document.getElementById('conectividade_iot_rf').value = 'MODULO_RF_HOMOLOGADO';
    }
    if (document.getElementById('telemetria_dados_iot')) {
        document.getElementById('telemetria_dados_iot').value = 'DADOS_AMBIENTAIS_MAQUINA';
    }
    document.getElementById('possui_pcb_customizada').checked = true;
    document.getElementById('possui_topografia_chip').checked = false;
    document.getElementById('possui_design_externo_novo').checked = false;
    document.getElementById('usa_hardware_aberto_terceiros').value = 'NENHUM';
    document.getElementById('possui_firmware_proprio').checked = true;
    document.getElementById('linguagem_firmware').value = 'C/C++ (FreeRTOS / Embarcado)';
    document.getElementById('licenca_bibliotecas_terceiros').value = 'MIT_BSD_APACHE';
    document.getElementById('vinculacao_firmware').value = 'ESTATICA_MONOLITICA';
    document.getElementById('modelo_negocio').value = 'COMERCIAL_FECHADO';
    document.getElementById('titularidade_tipo').value = 'AUTONOMO_EMPRESA';

    atualizarBadgesAutoMarcacao();
    atualizarPainelQuesitosBloco2(null);

    atualizarBalaoMascote(
        'Etapa 1 de 2 — Identificação',
        'Preencha seus dados para começar.',
        'Depois você descreve o projeto e o sistema faz a busca.'
    );
}

// Renderiza as pílulas visuais (badges) do que o sistema auto-identificou e auto-marcou para o usuário
function atualizarBadgesAutoMarcacao() {
    const container = document.getElementById('badges-automarcacao');
    if (!container) return;

    const dados = coletarDadosFormularioAtual();
    const mapaNovidade = {
        INEDITO_INVENTIVO: 'Patente de Invenção IoT/HW (Art. 8º LPI + Res. 158/2016)',
        MELHORIA_FUNCIONAL: 'Modelo de Utilidade (Art. 9º LPI)',
        MODULOS_PRONTOS_COTS: 'Módulos Prontos COTS (Foco em Marca + Software)'
    };
    const mapaDivulgacao = {
        SIGILO_MANTIDO: 'Sigilo Preservado (Art. 11 LPI)',
        DIVULGADO_MENOS_12M: 'Período de Graça 12m (Art. 12 LPI)',
        DIVULGADO_MAIS_12M: 'Domínio Público >12m (Art. 11 LPI)'
    };
    const mapaRf = {
        MODULO_RF_HOMOLOGADO: 'Rádio IoT Pré-Homologado (ANATEL Res. 715)',
        TRANSCEPTOR_RF_CUSTOM: 'Transceptor RF Customizado (Ensaio ANATEL Art. 162)',
        SEM_RF_CABEADO: 'Cabeado / Sem Rádio RF'
    };
    const mapaLgpd = {
        DADOS_AMBIENTAIS_MAQUINA: 'Telemetria Ambiental/Industrial (Segredo Art. 195 XI)',
        DADOS_PESSOAIS_IOT: 'Dados Pessoais IoT (LGPD Privacy by Design)',
        DADOS_BIOMETRICOS_SAUDE: 'Biometria / Saúde (LGPD Art. 11 + ANVISA SaMD)'
    };
    const mapaTitularidade = {
        AUTONOMO_EMPRESA: 'Titularidade Própria / Startup',
        PARCERIA_COAUTORIA: 'Coautoria / Sócios (Cessão + Marca Unificada)',
        VINCULO_EMPREGATICIO_ICT: 'Vínculo ICT / Universidade (Submissão ao NIT)'
    };
    const mapaModelo = {
        COMERCIAL_FECHADO: 'Exploração Industrial / Comercial',
        HIBRIDO_HW_ABERTO_SW_FECHADO: 'Híbrido (Placa Aberta + Marca/SW Protegidos)',
        OPEN_SOURCE_TOTAL: 'Open Source Hardware & Software (OSHWA)',
        PUBLICACAO_DEFENSIVA: 'Publicação Defensiva (Art. 11 LPI)'
    };

    const camadas = [
        dados.possui_pcb_customizada ? 'Camada A (PCB)' : null,
        dados.possui_design_externo_novo ? 'Camada B (Design 3D)' : null,
        dados.possui_topografia_chip ? 'Camada C (Chip/Silício)' : null,
        'Camada D (Marca NCL 9)',
        dados.possui_firmware_proprio ? `Camada E (${dados.linguagem_firmware || 'Firmware'})` : null,
        dados.grau_novidade_hardware !== 'MODULOS_PRONTOS_COTS' ? 'Camada F (Patente)' : null
    ].filter(Boolean);

    const itens = [
        { rotulo: 'Enquadramento INPI', valor: mapaNovidade[dados.grau_novidade_hardware] || dados.grau_novidade_hardware, cor: 'rgba(249,115,22,0.18)', borda: 'rgba(249,115,22,0.5)' },
        { rotulo: 'Camadas Ativadas', valor: camadas.join(' + '), cor: 'rgba(16,185,129,0.14)', borda: 'rgba(16,185,129,0.45)' },
        { rotulo: 'Status de Sigilo', valor: mapaDivulgacao[dados.divulgacao_previa] || 'Sigilo Mantido', cor: 'rgba(56,189,248,0.14)', borda: 'rgba(56,189,248,0.45)' },
        { rotulo: 'Regulação ANATEL', valor: mapaRf[dados.conectividade_iot_rf] || 'Módulo RF', cor: 'rgba(249,115,22,0.12)', borda: 'rgba(249,115,22,0.35)' },
        { rotulo: 'Regulação LGPD/Dados', valor: mapaLgpd[dados.telemetria_dados_iot] || 'Telemetria', cor: 'rgba(168,85,247,0.14)', borda: 'rgba(168,85,247,0.4)' },
        { rotulo: 'Titularidade & Negócio', valor: `${mapaTitularidade[dados.titularidade_tipo] || ''} • ${mapaModelo[dados.modelo_negocio] || ''}`, cor: 'rgba(255,255,255,0.05)', borda: 'rgba(255,255,255,0.18)' }
    ];

    container.innerHTML = itens.map(item => `
        <span style="display:inline-flex;align-items:center;gap:0.35rem;padding:0.32rem 0.7rem;border-radius:999px;background:${item.cor};border:1px solid ${item.borda};font-size:0.77rem;color:#f8fafc;">
            <strong style="color:var(--orange-light);">${item.rotulo}:</strong> ${item.valor}
        </span>
    `).join('');
}

// =========================================================================
// MÉTRICA REAL DE SUFICIÊNCIA DESCRITIVA E CONSISTÊNCIA TÉCNICA (ART. 24 LPI)
// Exige 4 Quesitos Cumulativos:
//   (1) Autenticidade / Integridade Textual (sem palavrões, zoeira, spam ou gibberish, mín. 8 palavras e 40 caracteres)
//   (2) Eixo 1: Arquitetura / Componente Técnico (Hardware, Sensor, Chip, Circuito ou Software)
//   (3) Eixo 2: Ação / Verbo Operacional (monitorar, controlar, medir, acionar, automatizar...)
//   (4) Eixo 3: Contexto Físico / Domínio de Aplicação ou Protocolo (solo, temperatura, Wi-Fi, LoRa, 3D, saúde...)
// =========================================================================
function validarSuficienciaDescritivaProjeto(textoRelato, nomeProjeto = '', trechoCodigo = '') {
    const relatoLimpo = (textoRelato || '').trim();
    const textoCompleto = `${nomeProjeto} ${relatoLimpo}`.trim();
    const relatoNorm = normalizarTextoComparacaoJS(relatoLimpo);
    const textoNorm = normalizarTextoComparacaoJS(textoCompleto);

    // Divide em palavras alfabéticas/alfanuméricas reais (somente do relato principal para obrigar descrição real no Bloco 2)
    const palavras = relatoLimpo
        .toLowerCase()
        .replace(/[^a-záàãâäéèêëíìîïóòõôöúùûüç0-9\s\-]/gi, ' ')
        .split(/\s+/)
        .filter(p => p.length >= 2);

    const palavrasUnicas = new Set(palavras);
    const ratioDiversidade = palavras.length > 0 ? (palavrasUnicas.size / palavras.length) : 0;

    // 1. Filtro Anti-Palavrão, Gírias de Zoeira e Textos de Teste ("qualquer merda", "blablabla", "asdf", etc.)
    const regexImproprioOuTeste = /\b(merda|porra|caralho|cacete|foda|foder|fodase|puta|viado|bosta|cu|buceta|piroca|rola|pau|arrombado|corno|idiota|imbecil|babaca|otario|teste|testando|qualquer coisa|sei la|blablabla|bla|hahaha|huehue|kkkk|kk|asdf|qwerty|zxcv|lorem|ipsum|nada|nenhumprojeto|besteira|zuera|zoeira)\b/i;
    const matchImproprio = textoNorm.match(regexImproprioOuTeste);

    // 2. Detector de "teclado batido" / Gibberish (vogais/consoantes e palavras inválidas)
    const apenasLetras = relatoLimpo.toLowerCase().replace(/[^a-záàãâäéèêëíìîïóòõôöúùûüç]/gi, '');
    const vogais = (apenasLetras.match(/[aeiouáàãâäéèêëíìîïóòõôöúùûü]/gi) || []).length;
    const proporcaoVogais = apenasLetras.length > 0 ? (vogais / apenasLetras.length) : 0;
    // Sequências verificadas palavra por palavra (juntar as palavras criava falsos positivos, ex.: "receptor GPS LTE")
    const letrasPorPalavra = relatoLimpo.toLowerCase().replace(/[^a-záàãâäéèêëíìîïóòõôöúùûüç]+/gi, ' ');
    const temSequenciaCaotica = /[bcdfghjklmnpqrstvwxz]{6,}/i.test(letrasPorPalavra) || /(.)\1{3,}/i.test(letrasPorPalavra);
    const palavrasValidasPt = palavras.filter(p => /[aeiouáàãâéêíóôõú0-9]/i.test(p) && !/[bcdfghjklmnpqrstvwxz]{5,}/i.test(p) && p.length <= 24);
    const ratioPalavrasValidas = palavras.length > 0 ? (palavrasValidasPt.length / palavras.length) : 0;

    const quesito1TextoAutentico = (
        relatoLimpo.length >= 40 &&
        palavras.length >= 8 &&
        palavrasUnicas.size >= 6 &&
        ratioDiversidade >= 0.45 &&
        !matchImproprio &&
        !temSequenciaCaotica &&
        proporcaoVogais >= 0.28 &&
        proporcaoVogais <= 0.72 &&
        ratioPalavrasValidas >= 0.75
    );

    // EIXO 1 (Quesito 2): Arquitetura / Componentes Físicos, Eletrônicos, Mecânicos ou de Software
    const regexMeioTecnico = /\b(sensor|sensores|acelerometro|giroscopio|ultrassonico|infravermelho|termometro|barometro|higrometro|placa|placas|pcb|circuito|circuitos|arduino|esp32|esp8266|stm32|raspberry|rp2040|pic|avr|arm|microcontrolador|microprocessador|processador|cpu|gpu|npu|chip|chips|semicondutor|asic|fpga|microchip|transistor|resistor|capacitor|indutor|diodo|amplificador|oscilador|firmware|software|sistema|algoritmo|aplicativo|app|api|interface|plataforma|programa|codigo|script|banco de dados|servidor|backend|frontend|dashboard|painel|portal|site|web|modulo|modulos|gabinete|carcaca|chassi|estrutura|suporte|engrenagem|robo|robotico|motor|servo|atuador|valvula|solenoide|bomba|compressor|rele|chave|interruptor|bateria|fonte|conversor|inversor|transformador|carregador|sonda|camera|lente|laser|lidar|radar|sonar|led|oled|lcd|display|tela|visor|drone|vant|rastreador|medidor|oximetro|eletrodo|transceptor|transdutor|receptor|transmissor|gateway|roteador|switch|modem|antena|coleira|pulseira|relogio|oculos|capacete|luva|vestivel|wearable|totem|terminal|quiosque|fechadura|trava|catraca|alarme|sirene|buzzer|alto-falante|microfone|irrigador|controlador|clp|plc|estacao|balanca|impressora|scanner|leitor|tag|cartao|beacon|dispositivo|equipamento|aparelho|prototipo|ferramenta|instrumento|maquina)\b/gi;

    // EIXO 2 (Quesito 3): Ação / Verbo Operacional / Finalidade Funcional
    const regexFinalidadeFuncional = /\b(medir|medicao|mede|medindo|mensurar|monitorar|monitoramento|monitora|monitorando|supervisionar|acompanhar|controlar|controle|controla|controlando|gerenciar|gerenciamento|gerencia|administrar|automatizar|automacao|automatiza|automatico|automatica|detectar|deteccao|detecta|detectando|identificar|identificacao|identifica|reconhecer|reconhecimento|reconhece|diagnosticar|diagnostico|transmitir|transmissao|transmite|transmitindo|comunicar|comunicacao|enviar|envia|enviando|envio|receber|recebe|recepcao|acionar|acionamento|aciona|acionando|ativar|ativacao|ativa|desativar|irrigar|irrigacao|economizar|economia|reduzir|reducao|otimizar|otimizacao|proteger|protecao|rastrear|rastreamento|rastreia|localizar|localizacao|localiza|mapear|mapeamento|processar|processamento|processa|calcular|calculo|analisar|analise|analisa|avaliar|alertar|alerta|alertas|avisar|avisa|notificar|notificacao|alarme|ler|leitura|capturar|captura|coletar|coleta|coletando|armazenar|armazenamento|gravar|registrar|registro|regular|regulagem|estabilizar|bloquear|bloqueio|liberar|liberacao|destravar|abrir|abertura|fechar|fechamento|ligar|desligar|aquecer|aquecimento|resfriar|resfriamento|refrigerar|filtrar|filtragem|purificar|bombear|irrigar|dosar|dispensar|alimentar|carregar|converter|amplificar|modular|codificar|criptografar|autenticar|validar|verificar|prevenir|evitar|auxiliar|monitorando)\b/gi;

    // EIXO 3 (Quesito 4): Contexto de Aplicação / Grandeza Física / Domínio ou Protocolo Técnico
    const regexContextoTecnico = /\b(iot|internet das coisas|lora|lorawan|wifi|wi-fi|wireless|sem fio|bluetooth|ble|zigbee|zwave|thread|matter|rf|radiofrequencia|rfid|nfc|mqtt|http|https|websocket|rest|coap|tcp|udp|ip|ethernet|usb|serial|i2c|spi|uart|rs232|rs485|canbus|modbus|profibus|gps|gnss|glonass|satelite|gsm|gprs|3g|4g|5g|lte|nb-iot|sigfox|3d|cad|cam|cnc|sla|fdm|kicad|altium|eagle|gerber|c\+\+|cpp|python|micropython|java|javascript|typescript|node|php|sql|rust|go|golang|csharp|verilog|vhdl|fpga|freertos|zephyr|linux|android|ios|esp-idf|solo|terra|umidade|temperatura|termico|termica|calor|frio|pressao|vazao|fluxo|nivel|volume|peso|massa|forca|torque|velocidade|aceleracao|vibracao|frequencia|amplitude| inclinacao| giro|distancia|proximidade|presenca|movimento| deslocamento|posicao|altura|profundidade| som|acustico|acustica|ruido|sonoro|sonora|ultrassom|luz|luminosidade|iluminacao|optico|optica|infravermelho|uv|ultravioleta|cor|imagem|video|visual|energia|eletrica|eletrico|eletronico|eletronica|tensao|voltagem|corrente|amperagem|potencia|consumo|bateria|solar|fotovoltaico|eolica|rede eletrica|agua|hidrico|hidrica|hidraulico|liquido|chuva|irrigacao|agricola|agricultura|agro|fazenda|campo|estufa|lavoura|plantacao|horta|pecuaria|gado|bovino|animal|animais|pet|pets|veterinario|medico|medica|saude|hospital|hospitalar|clinica|enfermagem|batimento|cardiaco|frequencia cardiaca|pulso|vital|vitais|oxigenio|saturacao|glicose|diabetes|pressao arterial|postura|queda|idoso|paciente|usuario|pessoa|pessoas|humano|biometrico|biometria|facial|digital|voz|residencial|residencia|casa|domestico|domotica|predial|edificio|condominio|sala|quarto|porta|janela|portao|garagem|industrial|industria|fabrica|usina|maquina|equipamento|linha de producao|manutencao|logistica|estoque|armazem|transporte|carga|frota|veiculo|automotivo|carro|moto|caminhao|onibus|bicicleta|embarcacao|aeronave|autonomo|autonoma|navegacao|transito|estacionamento|seguranca|vigilancia|monitoramento|alarme|intrusao|invasao|acesso|perimetro|incendio|fumaca|gas|co2|metano|vazamento|poluicao|ar|qualidade do ar|ambiental|ambiente|clima|meteorologico|florestal|estrutural|estrutura|ponte|barragem|concreto|civil|obra|construcao|educacao|escolar|ensino|laboratorio|pesquisa|academico|comercial|loja|varejo|financeiro|pagamento|criptografia|nuvem|cloud|servidor|borda|edge|tempo real|remoto|remota|distancia|malha fechada|inteligencia artificial|machine learning|visao computacional|rede neural|dados|telemetria)\b/gi;

    const meiosEncontrados = [...new Set((textoNorm.match(regexMeioTecnico) || []).map(x => x.toLowerCase()))];
    const finalidadesEncontradas = [...new Set((textoNorm.match(regexFinalidadeFuncional) || []).map(x => x.toLowerCase()))];
    const contextosEncontrados = [...new Set((textoNorm.match(regexContextoTecnico) || []).map(x => x.toLowerCase()))];

    // Análise Morfológica e Estrutural da Língua Portuguesa (reconhece qualquer verbo, componente ou finalidade sem depender de palavras fixas):
    // 1. Verbos de ação/processo em português (infinitivo -ar/-er/-ir ou conectivo de finalidade "para/capaz de/que + verbo" ou substantivos operacionais -ção/-mento/-agem)
    const temEstruturaVerbalPt = /\b(para\s+[a-z]{4,}|capaz\s+de\s+[a-z]{4,}|com\s+fun[cç][aã]o\s+de\s+[a-z]{4,}|que\s+[a-z]{4,}(a|e|em|am)\b|[a-z]{3,}(ar|er|ir|ando|endo|indo|cao|mento|agem))\b/i.test(relatoNorm);
    // 2. Complemento de finalidade, meio, local ou grandeza (ex: "para ...", "em ...", "via ...", "por meio de ...", "através de ...", "com ...", unidades ou sufixos técnicos -ico/-ica/-al/-or/-dade/-ura)
    const temEstruturaContextualPt = /\b((para|em|no|na|nos|nas|via|por|atraves|mediante|durante|contra|sobre|entre)\s+[a-z0-9]{3,}|[a-z]{4,}(ico|ica|icos|icas|al|ais|ar|ares|dade|ura|ismo|ista|logia|metria|scopia|grafia)|\d+\s*(v|mv|kv|a|ma|w|kw|hz|khz|mhz|ghz|cm|mm|m|km|g|kg|s|ms|min|h|c|l|ml|bar|psi|db|%))\b/i.test(relatoNorm);
    // 3. Sufixos morfológicos de instrumentos/dispositivos/elementos técnicos (-dor, -tor, -sor, -metro, -scopio, -grama, -tron, -oide, -ivo, -or)
    const temMorfologiaComponentePt = /\b([a-z]{3,}(dor|dora|dores|tor|tora|tores|sor|sora|sores|metro|metros|scopio|scopios|oide|oides|uto|utos|ito|itos))\b/i.test(textoNorm);

    const termosUnicos = [...new Set([...meiosEncontrados, ...finalidadesEncontradas, ...contextosEncontrados])];

    const quesito2Meio = meiosEncontrados.length >= 1 || (temMorfologiaComponentePt && (finalidadesEncontradas.length >= 1 || contextosEncontrados.length >= 1));
    const quesito3Acao = finalidadesEncontradas.length >= 1 || (temEstruturaVerbalPt && (meiosEncontrados.length >= 1 || contextosEncontrados.length >= 1));
    const quesito4Contexto = contextosEncontrados.length >= 1 || (temEstruturaContextualPt && (meiosEncontrados.length >= 1 || finalidadesEncontradas.length >= 1) && palavras.length >= 8);

    const quesitosAprovados = [quesito1TextoAutentico, quesito2Meio, quesito3Acao, quesito4Contexto].filter(Boolean).length;
    const todosQuesitosOk = (quesitosAprovados === 4);

    const estadoQuesitos = {
        q1_texto_autentico: quesito1TextoAutentico,
        q2_meio_tecnico: quesito2Meio,
        q3_acao_funcional: quesito3Acao,
        q4_contexto_aplicacao: quesito4Contexto,
        total_aprovados: quesitosAprovados,
        aprovados: quesitosAprovados
    };

    if (matchImproprio) {
        return {
            valido: false,
            score_suficiencia: 0,
            quesitos: estadoQuesitos,
            motivo: `O texto tem linguagem imprópria ou palavra de teste ("${matchImproprio[0]}").`,
            orientacao: 'Descreva de forma séria as peças e o funcionamento do projeto.'
        };
    }

    if (temSequenciaCaotica || (apenasLetras.length >= 10 && (proporcaoVogais < 0.28 || proporcaoVogais > 0.72 || ratioPalavrasValidas < 0.75))) {
        return {
            valido: false,
            score_suficiencia: 5,
            quesitos: estadoQuesitos,
            motivo: 'O texto parece ter letras digitadas ao acaso ou palavras que não existem.',
            orientacao: 'Escreva frases reais: a LPI exige uma descrição técnica clara do invento (Art. 24).'
        };
    }

    if (ratioDiversidade < 0.45 && palavras.length >= 5) {
        return {
            valido: false,
            score_suficiencia: 10,
            quesitos: estadoQuesitos,
            motivo: 'O texto repete as mesmas palavras muitas vezes.',
            orientacao: 'Escreva uma frase real explicando o que o projeto faz, com quais peças e para quê.'
        };
    }

    if (!quesito1TextoAutentico) {
        return {
            valido: false,
            score_suficiencia: 15,
            quesitos: estadoQuesitos,
            motivo: `Descrição muito curta (${palavras.length} de 8 palavras).`,
            orientacao: 'Escreva pelo menos uma frase completa explicando o que o projeto faz, com quais peças e para quê.'
        };
    }

    if (!todosQuesitosOk) {
        const pendencias = [];
        if (!quesito2Meio) pendencias.push('as peças (ex.: placa, sensor, ESP32, Arduino, aplicativo)');
        if (!quesito3Acao) pendencias.push('o que ele faz (ex.: mede, controla, detecta, aciona, envia)');
        if (!quesito4Contexto) pendencias.push('onde atua ou qual tecnologia usa (ex.: solo, temperatura, saúde, Wi-Fi, LoRa, Bluetooth)');

        return {
            valido: false,
            score_suficiencia: quesitosAprovados * 22,
            quesitos: estadoQuesitos,
            motivo: `A descrição tem ${quesitosAprovados} dos 4 itens.`,
            orientacao: `Inclua no texto: ${pendencias.join('; ')}.`
        };
    }

    const score = Math.min(100, 60 + (meiosEncontrados.length * 8) + (finalidadesEncontradas.length * 8) + (contextosEncontrados.length * 8) + Math.min(16, Math.floor(palavras.length * 0.8)));

    return {
        valido: true,
        score_suficiencia: score,
        quesitos: estadoQuesitos,
        termos_tecnicos_detectados: termosUnicos,
        meios_detectados: meiosEncontrados,
        finalidades_detectadas: finalidadesEncontradas,
        contextos_detectados: contextosEncontrados,
        quantidade_palavras: palavras.length,
        motivo: `Descrição completa: ${meiosEncontrados.length} peça(s), ${finalidadesEncontradas.length} ação(ões) e ${contextosEncontrados.length} aplicação(ões) identificadas.`,
        orientacao: ''
    };
}

function atualizarPainelQuesitosBloco2(validacao) {
    const badge = document.getElementById('badge-status-qualificacao');
    const msg = document.getElementById('msg-detalhe-qualificacao');
    const q = validacao && validacao.quesitos ? validacao.quesitos : {
        q1_texto_autentico: false,
        q2_meio_tecnico: false,
        q3_acao_funcional: false,
        q4_contexto_aplicacao: false,
        total_aprovados: 0
    };

    const pintarItem = (id, ok, rotulo) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.toggle('ok', Boolean(ok));
        el.innerHTML = rotulo;
    };

    pintarItem('chk-quesito-1', q.q1_texto_autentico, '<strong>Texto real</strong> — pelo menos 8 palavras');
    pintarItem('chk-quesito-2', q.q2_meio_tecnico, '<strong>Peças</strong> — placa, sensor, chip ou software');
    pintarItem('chk-quesito-3', q.q3_acao_funcional, '<strong>Ação</strong> — o que faz (mede, controla, aciona…)');
    pintarItem('chk-quesito-4', q.q4_contexto_aplicacao, '<strong>Aplicação</strong> — onde atua (solo, saúde, Wi-Fi…)');

    if (badge) {
        const ok = Boolean(validacao && validacao.valido);
        badge.className = 'status-pill ' + (ok ? 'ok' : 'pendente');
        badge.textContent = ok ? '4 de 4 — pronto' : `${q.total_aprovados} de 4`;
    }

    if (msg) {
        msg.className = 'quesitos-msg';
        if (!validacao) {
            msg.textContent = 'Os itens são marcados enquanto você escreve.';
        } else if (validacao.valido) {
            msg.classList.add('ok');
            msg.textContent = 'Descrição completa. Você já pode verificar se o projeto existe.';
        } else {
            msg.classList.add('erro');
            msg.textContent = `${validacao.motivo} ${validacao.orientacao}`;
        }
    }
}

// Auto-marca todos os 14 parâmetros técnicos e jurídicos em tempo real enquanto o usuário digita (sem exigir clique extra)
function autoMarcarEnquantoDigita() {
    const campo = document.getElementById('relato_livre_usuario');
    const campoNome = document.getElementById('nome_projeto');
    const textoRelato = campo ? campo.value.trim() : '';
    const textoNome = campoNome ? campoNome.value.trim() : '';
    if (!textoRelato && !textoNome) {
        atualizarBadgesAutoMarcacao();
    atualizarPainelQuesitosBloco2(null);
        return;
    }
    interpretarRelatoLivre(false, true);
}

// Interpretador de Linguagem Natural: lê o caso descrito pelo usuário e auto-marca IoT, Hardware, Patente e Leis
function interpretarRelatoLivre(gerarDireto, modoSilencioso = false) {
    const campo = document.getElementById('relato_livre_usuario');
    const campoNome = document.getElementById('nome_projeto');
    const feedback = document.getElementById('feedback-relato-livre');
    if (!campo) return;

    const textoRelato = campo.value.trim();
    const nomeManual = (campoNome && campoNome.dataset.autoGerado !== 'true') ? campoNome.value.trim() : '';
    const textoOriginal = textoRelato || nomeManual;
    if (!textoOriginal) {
        atualizarPainelQuesitosBloco2(null);
        if (!modoSilencioso) {
            alert('Por favor, descreva seu projeto de hardware/IoT e o que você deseja patentear ou proteger no campo de texto.');
            campo.focus();
        }
        return;
    }

    // Validação de Suficiência Descritiva (Art. 24 da LPI) para evitar auto-marcação falsa em texto sem sentido
    const validacaoSuficiencia = validarSuficienciaDescritivaProjeto(textoRelato, nomeManual);
    atualizarPainelQuesitosBloco2(validacaoSuficiencia);
    if (!validacaoSuficiencia.valido) {
        if (feedback) {
            feedback.style.display = 'block';
            feedback.innerHTML = `
                <div style="padding: 0.75rem 1rem; border-radius: 10px; background: rgba(239, 68, 68, 0.14); border: 1px solid #ef4444; color: #fca5a5;">
                    <strong style="color: #f87171; display: block; margin-bottom: 0.3rem;">
                        ${validacaoSuficiencia.motivo} (Qualificação: ${validacaoSuficiencia.quesitos ? validacaoSuficiencia.quesitos.aprovados : 0}/4 Quesitos)
                    </strong>
                    <span style="font-size: 0.85rem; color: #fee2e2;">${validacaoSuficiencia.orientacao}</span>
                </div>
            `;
        }
        if (!modoSilencioso) {
            alert(`A descrição ainda não está completa.\n\n${validacaoSuficiencia.motivo}\n\n${validacaoSuficiencia.orientacao}`);
            campo.focus();
        }
        return;
    }

    const t = `${nomeManual} ${textoRelato}`.toLowerCase();
    const achados = [];

    // 1. Identificar Titularidade / Vínculo (Art. 6º, 88-93 LPI, Art. 4º Lei 9.609/98 e Lei 10.973/04)
    let titularidade = 'AUTONOMO_EMPRESA';
    let instituicao = 'Desenvolvimento independente';
    if (/(faculdade|universidade|tcc|laborat[oó]rio|ict|inicia[cç][aã]o cient[ií]fica|orientador|professor|mestrado|instituto federal|academic)/i.test(t)) {
        titularidade = 'VINCULO_EMPREGATICIO_ICT';
        instituicao = 'Universidade / ICT';
        achados.push('<strong>Titularidade Acadêmica / ICT (Lei nº 10.973/2004, Art. 16 e Art. 88 da LPI):</strong> projetos desenvolvidos utilizando infraestrutura universitária exigem comunicação formal ao NIT para definição de cotitularidade e depósito no INPI.');
    } else if (/(s[oó]cio|cofundador|amigo|parceria|dupla|equipe|dividir|grupo|nossa equipe|desenvolvemos|criamos)/i.test(t)) {
        titularidade = 'PARCERIA_COAUTORIA';
        instituicao = 'Equipe de cofundadores';
        achados.push('<strong>Cotitularidade Societária (Art. 6º, § 3º e Art. 129 da LPI):</strong> recomendada formalização imediata de Cessão/Condomínio Patrimonial e unificação do registro de Marca para evitar cisão societária (precedente Arduino LLC vs. Arduino SRL).');
    }

    // 2. Identificar Divulgação Pública Prévia (Art. 11 Estado da Técnica vs. Art. 12 Período de Graça da LPI)
    let divulgacao = 'SIGILO_MANTIDO';
    if (/(mais de 1 ano|mais de um ano|h[aá] 2 anos|h[aá] dois anos|h[aá] 18 meses|dom[ií]nio p[uú]blico)/i.test(t)) {
        divulgacao = 'DIVULGADO_MAIS_12M';
        achados.push('<strong>Perda de Novidade Absoluta (Art. 11 da Lei nº 9.279/96):</strong> divulgação anterior a 12 meses impede concessão de Patente (PI/MU), convertendo a arquitetura em Estado da Técnica (proteção deve focar em Marca, Desenho Industrial residual e Software).');
    } else if (/(youtube|github|feira|congresso|mostra|postei|publiquei|divulguei|apresentei|artigo|banca|v[ií]deo|h[aá] \d+ m[eê]s|h[aá] \d+ meses)/i.test(t)) {
        divulgacao = 'DIVULGADO_MENOS_12M';
        achados.push('<strong>Incidência do Período de Graça de 12 Meses (Art. 12 da Lei nº 9.279/96):</strong> a divulgação feita pelo próprio inventor há menos de 365 dias não prejudica a novidade, desde que o pedido de patente seja depositado no INPI antes de completar 1 ano.');
    } else {
        achados.push('<strong>Sigilo Técnico Preservado (Art. 11 da LPI e Art. 195, XI da LPI):</strong> requisito de novidade absoluta intacto para depósito imediato no INPI.');
    }

    // 3. Identificar Conectividade IoT / Radiofrequência e Regulação ANATEL (Lei 9.472/97 Art. 162 e Res. 715/2019)
    let conectividadeRf = 'MODULO_RF_HOMOLOGADO';
    if (/(sem r[aá]dio|cabeado|ethernet|rs-485|rs485|modbus|canbus|usb|isolado|offline)/i.test(t) && !/(wifi|wi-fi|lora|lorawan|bluetooth|ble|zigbee|rf|4g|5g|nb-iot)/i.test(t)) {
        conectividadeRf = 'SEM_RF_CABEADO';
        achados.push('<strong>Comunicação Cabeada / Sem Radiofrequência:</strong> dispensa homologação de espectro de rádio na ANATEL, mantendo exigências de compatibilidade eletromagnética.');
    } else if (/(antena pr[oó]pria|transceptor pr[oó]prio|r[aá]dio customizado|rf discreto|amplificador rf|sdr|circuito de r[aá]dio na pcb)/i.test(t)) {
        conectividadeRf = 'TRANSCEPTOR_RF_CUSTOM';
        achados.push('<strong>Transceptor de Rádio Customizado (Lei nº 9.472/97, Art. 162 e Res. ANATEL nº 715/2019):</strong> exige ensaios laboratoriais completos em OCD credenciado (Atos ANATEL nº 14448/2017) antes da comercialização no Brasil.');
    } else if (/(esp32|esp8266|lora|lorawan|915\s*mhz|wifi|wi-fi|bluetooth|ble|zigbee|nrf52|mqtt|iot|4g|nb-iot|sem fio|wireless)/i.test(t)) {
        conectividadeRf = 'MODULO_RF_HOMOLOGADO';
        achados.push('<strong>Conectividade IoT em Radiofrequência Detectada (Lei nº 9.472/97, Art. 162 e Res. ANATEL nº 715/2019):</strong> o uso de módulos pré-homologados (ex: ESP32/LoRa) simplifica a certificação, exigindo identificação do código ANATEL no produto final.');
    }

    // 4. Identificar Natureza dos Dados IoT / Sensores e Conformidade LGPD (Lei 13.709/18) + ANVISA
    let telemetriaIot = 'DADOS_AMBIENTAIS_MAQUINA';
    if (/(batimento|card[ií]ac|ox[ií]metro|ecg|sinais vitais|m[eé]dic|hospital|sa[uú]de|paciente|biom[eé]tric|vest[ií]vel|wearable|press[aã]o arterial|glicose)/i.test(t)) {
        telemetriaIot = 'DADOS_BIOMETRICOS_SAUDE';
        achados.push('<strong>Dispositivo IoT Biomédico / Dados Sensíveis (LGPD Lei nº 13.709/18, Art. 11 e Art. 46 + ANVISA RDC 751/2022 e RDC 657/2022):</strong> exige criptografia fim-a-fim da telemetria de saúde, consentimento específico ou tutela da saúde e enquadramento sanitário como Dispositivo Médico / SaMD.');
    } else if (/(c[aâ]mera|voz|microfone|gps|localiza[cç][aã]o|residencial|casa inteligente|smart home|usu[aá]rio|consumidor|rosto|facial|presen[cç]a humana|cpf|pessoal)/i.test(t)) {
        telemetriaIot = 'DADOS_PESSOAIS_IOT';
        achados.push('<strong>Coleta de Dados Pessoais em Borda IoT (LGPD Lei nº 13.709/18, Arts. 6º, 7º e 46):</strong> impõe arquitetura <em>Privacy by Design</em> no firmware (autenticação mútua, TLS/AES e minimização da coleta na borda).');
    } else {
        telemetriaIot = 'DADOS_AMBIENTAIS_MAQUINA';
        achados.push('<strong>Telemetria Física / Ambiental / Industrial (Art. 195, XI da LPI):</strong> dados não pessoais de sensores de campo (umidade, temperatura, vibração, tensão) são tutelados como Segredo de Negócio e Know-How operacional.');
    }

    // 5. Identificar Camadas Físicas (A, B, C) e Linguagem Embarcada (Camada E)
    const temPcb = !/(sem placa|sem pcb|apenas software)/i.test(t);
    const temChip = /(chip|semicondutor|sil[ií]cio|asic|topografia|m[aá]scara|padis|vlsi|gdsii|cmos)/i.test(t);
    // Só marca a Camada B quando a descrição fala do visual/gabinete do aparelho.
    // Palavras soltas como "pulseira", "caixa" ou "3D" (ex.: "mapear em 3D") não bastam.
    const temDesign = /(carca[cç]a|gabinete|inv[oó]lucro|\bcase\b|design (pr[oó]prio|exclusivo|ergon[oô]mico|diferenciado)|est[eé]tic|ornamental|anat[oô]mic|ergon[oô]mic|formato (pr[oó]prio|exclusivo|[uú]nico|diferenciado)|(impress[oa]s?|imprim\w*|modelad[oa]s?) em 3d|imperme[aá]vel)/i.test(t);
    const temFirmware = !/(sem software|sem firmware|apenas mec[aâ]nico)/i.test(t);

    if (temChip) achados.push('<strong>Camada C — Semicondutores / Topografia de Chip (Lei nº 11.484/2007, Arts. 26 e seguintes):</strong> proteção específica de 10 anos para o leiaute tridimensional de máscaras de silício e elegibilidade fiscal ao PADIS.');
    if (temDesign) achados.push('<strong>Camada B — Design Externo / Gabinete (Lei nº 9.279/96, Arts. 94 a 121):</strong> forma plástica ornamental externa protegível por Registro de Desenho Industrial no INPI (até 25 anos).');

    const linguagensDetectadas = [];
    if (/(c\+\+|cpp|\bc\b|ino|arduino|esp-idf|stm32|freertos|zephyr)/i.test(t)) linguagensDetectadas.push('C/C++ Embarcado');
    if (/(python|micropython|circuitpython)/i.test(t)) linguagensDetectadas.push('Python / MicroPython');
    if (/(rust)/i.test(t)) linguagensDetectadas.push('Rust Embarcado');
    if (/(verilog|vhdl|systemverilog|fpga|hdl)/i.test(t)) linguagensDetectadas.push('HDL (Verilog/VHDL)');
    if (/(mqtt|lorawan|coap|ble|http)/i.test(t)) linguagensDetectadas.push('Pilha IoT (MQTT/LoRaWAN)');
    const linguagemFinal = linguagensDetectadas.length > 0 ? linguagensDetectadas.join(' + ') : 'C/C++ (Firmware de Controle e Telemetria IoT)';

    // 6. Correlacionar o Objeto da Patente (Camada F — Arts. 8º, 9º, 10 V da LPI e Resolução INPI nº 158/2016)
    let novidade = 'INEDITO_INVENTIVO';
    if (/(m[oó]dulos prontos|apenas juntei|protoboard|jumpers|sem altera[cç][aã]o f[ií]sica|apenas aplicativo|s[oó] software)/i.test(t) && !/(in[eé]dit|novo circuito|efeito f[ií]sico|economiza|sonda|atuador|v[aá]lvula|malha fechada)/i.test(t)) {
        novidade = 'MODULOS_PRONTOS_COTS';
        achados.push('<strong>Impedimento Patentário (Art. 8º e Art. 10, V da LPI):</strong> a mera agregação de módulos comerciais (COTS) ou software puro sem novo efeito técnico físico não atende ao requisito de atividade inventiva. Proteção redirecionada para Registro de Marca (Art. 129 LPI) e Direito Autoral de Software (Lei 9.609/98).');
    } else if (/(disposi[cç][aã]o construtiva|melhoria funcional|adapta[cç][aã]o mec[aâ]nica|ergonomia|modelo de utilidade|arranjo f[ií]sico)/i.test(t) && !/(in[eé]dit|processo|algoritmo embarcado|efeito f[ií]sico|lidar|[oó]ptic)/i.test(t)) {
        novidade = 'MELHORIA_FUNCIONAL';
        achados.push('<strong>Enquadramento em Modelo de Utilidade (Art. 9º da Lei nº 9.279/96):</strong> objeto de uso prático com nova forma ou disposição construtiva na PCB/equipamento que resulta em melhoria funcional no uso ou fabricação (vigência de 15 anos).');
    } else {
        novidade = 'INEDITO_INVENTIVO';
        achados.push('<strong>Enquadramento em Patente de Invenção IoT/Hardware (Art. 8º da LPI c/c Resolução INPI nº 158/2016):</strong> embora o código-fonte em si não seja patenteável (Art. 10, V da LPI), a integração hardware + sensores + firmware que produz efeito técnico físico mensurável é patenteável como Sistema e Processo de Controle Embarcado (20 anos).');
    }

    // 7. Licenças de Software e Hardware mencionadas
    let licSw = 'MIT_BSD_APACHE';
    if (/(\bgpl|gplv3|gplv2|copyleft forte)/i.test(t)) {
        licSw = 'GPL_V2_V3';
        achados.push('<strong>Conflito Potencial com GNU GPLv2/v3 (Art. 9º da Lei 9.609/98 e Lei 9.610/98):</strong> bibliotecas GPL exigem abertura do código derivado e vedam bloqueio de gravação em hardware (cláusula Anti-Tivoização).');
    } else if (/(lgpl|copyleft fraco)/i.test(t)) {
        licSw = 'LGPL_ESTATICA';
        achados.push('<strong>Cuidado Técnico com GNU LGPL em Microcontroladores:</strong> linkedição estática em imagem monolítica Flash exige fornecer arquivos-objeto (<code>.o</code>) para relinkagem pelo usuário.');
    }

    let licHw = 'NENHUM';
    if (/(cc by-sa|cc-by-sa|creative commons|cern-ohl-s|copyleft)/i.test(t)) {
        licHw = 'CERN_OHL_S';
        achados.push('<strong>Licença Recíproca de Hardware (CERN-OHL-S / CC BY-SA) e Assimetria da Lei 9.610/98:</strong> obriga abrir esquemáticos derivados, mas não impede que concorrentes façam engenharia reversa funcional limpa caso não haja Patente depositada no INPI.');
    } else if (/(cern-ohl-w|modular|abrir a placa|abrir os esquem[aá]ticos)/i.test(t)) {
        licHw = 'CERN_OHL_W';
    } else if (/(cern-ohl-p|tapr|solderpad|hardware aberto|open hardware)/i.test(t)) {
        licHw = 'CERN_OHL_P';
    }

    // 8. Estratégia de Negócio / Publicação Defensiva
    let modelo = 'COMERCIAL_FECHADO';
    if (/(publica[cç][aã]o defensiva|impedir que.*patente|n[aã]o cobrar royalties|estado da t[eé]cnica|barrar patente)/i.test(t)) {
        modelo = 'PUBLICACAO_DEFENSIVA';
        achados.push('<strong>Escudo de Publicação Defensiva (Art. 11 da LPI):</strong> publicação técnica estruturada para destruir a novidade perante terceiros e impedir que concorrentes patenteiem sua arquitetura.');
    } else if (/(abrir.*placa.*manter.*fechado|h[ií]brido|esquem[aá]tico aberto.*firmware fechado|liberar.*esquem[aá]tico.*proteger.*marca)/i.test(t)) {
        modelo = 'HIBRIDO_HW_ABERTO_SW_FECHADO';
    } else if (/(100% aberto|totalmente aberto|comunidade ajudar|open source total)/i.test(t) && !/(fechado|vender fechado|patentear)/i.test(t)) {
        modelo = 'OPEN_SOURCE_TOTAL';
    }

    // Mantém exclusivamente o nome do projeto definido pelo usuário no Bloco 1 (não sobrescreve no Bloco 2)
    document.getElementById('instituicao_empresa').value = instituicao;
    document.getElementById('resumo_tecnico').value = textoOriginal;
    document.getElementById('titularidade_tipo').value = titularidade;
    document.getElementById('grau_novidade_hardware').value = novidade;
    if (document.getElementById('divulgacao_previa')) {
        document.getElementById('divulgacao_previa').value = divulgacao;
    }
    if (document.getElementById('conectividade_iot_rf')) {
        document.getElementById('conectividade_iot_rf').value = conectividadeRf;
    }
    if (document.getElementById('telemetria_dados_iot')) {
        document.getElementById('telemetria_dados_iot').value = telemetriaIot;
    }
    document.getElementById('possui_pcb_customizada').checked = temPcb;
    document.getElementById('possui_topografia_chip').checked = temChip;
    document.getElementById('possui_design_externo_novo').checked = temDesign;
    document.getElementById('usa_hardware_aberto_terceiros').value = licHw;
    document.getElementById('possui_firmware_proprio').checked = temFirmware;
    document.getElementById('linguagem_firmware').value = linguagemFinal;
    document.getElementById('licenca_bibliotecas_terceiros').value = licSw;
    document.getElementById('modelo_negocio').value = modelo;

    atualizarBadgesAutoMarcacao();

    if (feedback) {
        feedback.style.display = 'block';
        feedback.innerHTML = `
            <strong style="color: var(--accent-secondary); display: block; margin-bottom: 0.45rem;">
                Auto-Identificação Jurídica Concluída em Tempo Real (${achados.length} vínculos normativos marcados automaticamente):
            </strong>
            <ul style="margin: 0; padding-left: 1.25rem;">
                ${achados.map(item => `<li style="margin-bottom: 0.3rem;">${item}</li>`).join('')}
            </ul>
        `;
    }

    if (!modoSilencioso) {
        atualizarBalaoMascote(
            'CORRELAÇÃO TÉCNICO-JURÍDICA E BUSCA DE EXISTÊNCIA REALIZADAS',
            'Seu dispositivo foi decomposto nas 6 camadas e confrontado com o banco de anterioridade.',
            'Identificamos se a sua criação já existe na base fixa ou nas bases globais e se você pode reivindicá-la em seu nome. Confira na <strong>Etapa 2</strong> o painel de verificação de existência e o botão para <strong>fixar a titularidade no banco de dados</strong>.'
        );
    }

}

// Motor Local + API de Verificação Real de Existência (Anterioridade) e Apropriabilidade
async function verificarExistenciaLocalEApi(dados, diag, acao = 'VERIFICAR') {
    const corr = diag.correlacao_patentaria || gerarCorrelacaoPatentariaReal(dados, diag);
    const trechoCodigo = document.getElementById('trecho_codigo_inspecao') ? document.getElementById('trecho_codigo_inspecao').value.trim() : '';
    const camadasAtivas = [
        dados.possui_pcb_customizada ? 'Camada A (PCB/LDA)' : null,
        dados.possui_design_externo_novo ? 'Camada B (DI)' : null,
        dados.possui_topografia_chip ? 'Camada C (TCI)' : null,
        'Camada D (Marca NCL 9)',
        dados.possui_firmware_proprio ? 'Camada E (Firmware SHA-512)' : null,
        dados.grau_novidade_hardware !== 'MODULOS_PRONTOS_COTS' ? 'Camada F (Patente PI/MU)' : null
    ].filter(Boolean).join(' + ');

    const payload = {
        acao,
        nome_projeto: dados.nome_projeto,
        autor_nome: dados.autor_nome,
        autor_documento: dados.autor_documento,
        instituicao_empresa: dados.instituicao_empresa,
        resumo_tecnico: dados.resumo_tecnico,
        grau_novidade_hardware: dados.grau_novidade_hardware,
        divulgacao_previa: dados.divulgacao_previa || 'SIGILO_MANTIDO',
        classificacao_cip: corr.codigos_cip.map(c => c.split(' (')[0]).join(' ; '),
        modalidade_protecao: diag.protecao_inpi_primaria,
        camadas_protegidas: camadasAtivas,
        trecho_codigo: trechoCodigo,
        projeto_id: diag.projeto_id || null // liga a prova de autoria ao projeto salvo no banco
    };

    // 1. Tenta consultar / gravar na API PHP + Banco SQLite/MySQL
    try {
        const resp = await fetch('api/anterioridade.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (resp.ok) {
            const json = await resp.json();
            if (json && (json.sucesso || json.bloqueado)) {
                if (Array.isArray(json.registros_fixos)) {
                    cacheRegistrosFixos = json.registros_fixos;
                }
                if (json.registro_gravado) {
                    salvarRegistroFixoNoLocalStorage(json.registro_gravado);
                }
                // Também cruza com eventuais registros salvos no localStorage ainda não enviados
                return json;
            }
        }
    } catch (e) {
        // Continua para o motor local síncrono caso esteja rodando sem backend PHP
    }

    // 2. Fallback / Motor Local Completo com Persistência Fixa em localStorage
    const nomeLimpo = dados.nome_projeto.replace(/^Caso Personalizado:\s*/i, '').trim();
    const marcaNucleo = normalizarTextoComparacaoJS(nomeLimpo.split(/[—\-:\/]/)[0] || nomeLimpo);
    const nomeNorm = normalizarTextoComparacaoJS(nomeLimpo);
    const tokensUsuario = extrairTokensTecnicosJS(`${dados.nome_projeto} ${dados.resumo_tecnico}`);
    const docNorm = (dados.autor_documento || '').replace(/[^0-9A-Za-z]/g, '');
    const hashCriacao = await gerarHashSHA512Real(`${nomeNorm}|${normalizarTextoComparacaoJS(dados.resumo_tecnico)}|${trechoCodigo}`);

    const todosRegistros = obterRegistrosFixosLocais();
    const colisoesEncontradas = [];
    let bloqueioTerceiro = null;
    let referenciaConhecida = null;
    let registroDoProprioUsuario = null;

    todosRegistros.forEach(reg => {
        const regMarcaNucleo = normalizarTextoComparacaoJS((reg.nome_criacao_marca || '').split(/[—\-:\/]/)[0] || reg.nome_criacao_marca);
        const regNomeNorm = normalizarTextoComparacaoJS(reg.nome_criacao_marca);
        const regTokens = extrairTokensTecnicosJS(`${reg.nome_criacao_marca} ${reg.resumo_tecnico} ${reg.palavras_chave || ''}`);
        const regDocNorm = (reg.titular_documento || '').replace(/[^0-9A-Za-z]/g, '');

        const similaridade = calcularSimilaridadeTokensJS(tokensUsuario, regTokens);
        let colisaoMarca = false;
        if (marcaNucleo.length >= 4 && regMarcaNucleo.length >= 4) {
            if (marcaNucleo === regMarcaNucleo || nomeNorm.includes(regMarcaNucleo) || regNomeNorm.includes(marcaNucleo)) {
                colisaoMarca = true;
            }
        }
        // Também detecta se o usuário está tentando reivindicar diretamente uma marca/produto famoso no meio da descrição
        const textoTotalNorm = `${nomeNorm} ${normalizarTextoComparacaoJS(dados.resumo_tecnico)}`;
        if (regMarcaNucleo.length >= 5 && textoTotalNorm.includes(regMarcaNucleo)) {
            if (/(arduino uno|waymo|flipper zero|raspberry pi|airtag|smarttag|alexa|amazon echo|starlink|gradiente|iphone)/i.test(textoTotalNorm) &&
                /(arduino uno|waymo|flipper zero|raspberry pi|airtag|smarttag|alexa|amazon echo|starlink|gradiente|iphone)/i.test(regNomeNorm)) {
                const matchMarcaFamosa = textoTotalNorm.match(/(arduino uno|waymo|flipper zero|raspberry pi|airtag|smarttag|alexa|amazon echo|starlink|iphone)/i);
                if (matchMarcaFamosa && regNomeNorm.includes(matchMarcaFamosa[0].toLowerCase())) {
                    colisaoMarca = true;
                }
            }
        }

        const hashIgual = (reg.hash_sha512 === hashCriacao);
        const mesmoTitular = (docNorm !== '' && docNorm !== '00000000000100' && docNorm === regDocNorm);

        if (hashIgual || colisaoMarca || similaridade >= 25.0) {
            const simFinal = hashIgual ? 100.0 : (colisaoMarca ? Math.max(82.0, similaridade) : similaridade);
            const itemColisao = {
                protocolo_registro: reg.protocolo_registro,
                origem_base: reg.origem_base,
                nome_criacao_marca: reg.nome_criacao_marca,
                titular_nome: reg.titular_nome,
                titular_documento: reg.titular_documento,
                instituicao_empresa: reg.instituicao_empresa,
                modalidade_protecao: reg.modalidade_protecao,
                camadas_protegidas: reg.camadas_protegidas,
                status_juridico: reg.status_juridico,
                data_registro: reg.data_registro,
                similaridade_percentual: simFinal,
                colisao_marca: colisaoMarca,
                mesmo_titular: mesmoTitular
            };
            colisoesEncontradas.push(itemColisao);

            if (mesmoTitular && (hashIgual || colisaoMarca || similaridade >= 60.0)) {
                registroDoProprioUsuario = itemColisao;
            } else if (!mesmoTitular && (hashIgual || colisaoMarca || similaridade >= 42.0)) {
                // Acervo ilustrativo = produtos conhecidos do mercado: semelhança só técnica avisa, mas não bloqueia
                if (reg.origem_base === 'ACERVO_REFERENCIA_ILUSTRATIVO' && !colisaoMarca && !hashIgual) {
                    if (!referenciaConhecida || itemColisao.similaridade_percentual > referenciaConhecida.similaridade_percentual) {
                        referenciaConhecida = itemColisao;
                    }
                } else if (!bloqueioTerceiro || itemColisao.similaridade_percentual > bloqueioTerceiro.similaridade_percentual) {
                    bloqueioTerceiro = itemColisao;
                }
            }
        }
    });

    colisoesEncontradas.sort((a, b) => b.similaridade_percentual - a.similaridade_percentual);

    const checkSuficiencia = validarSuficienciaDescritivaProjeto(dados.resumo_tecnico, dados.nome_projeto, trechoCodigo);

    let statusApropriacao = 'DISPONIVEL_EXCLUSIVO';
    let podeRegistrar = true;
    let tituloVeredito = 'Nenhuma colisão na base do Observatório';
    let explicacaoVeredito = 'Comparamos o projeto com a base do Observatório (registros feitos por usuários + acervo de referência ilustrativo com 15 produtos conhecidos) e não houve colisão. Atenção: isso NÃO é uma busca oficial no INPI — a novidade (Art. 11 da LPI) só é confirmada pelo exame do INPI. Confira também a busca mundial ao lado e consulte o pePI antes de depositar.';

    if (!checkSuficiencia.valido) {
        statusApropriacao = 'BLOQUEADO_TERCEIRO';
        podeRegistrar = false;
        tituloVeredito = 'Descrição insuficiente (Art. 24 da Lei nº 9.279/96)';
        explicacaoVeredito = `${checkSuficiencia.motivo} ${checkSuficiencia.orientacao} Sem uma descrição técnica clara e suficiente, o pedido não atende ao Art. 24 da LPI, e uma patente concedida assim pode ser anulada (Art. 50, II da LPI).`;
    } else if (registroDoProprioUsuario) {
        statusApropriacao = 'JA_PERTENCE_AO_USUARIO';
        podeRegistrar = true;
        tituloVeredito = `Você já gravou este projeto no Observatório (${escaparHtml(registroDoProprioUsuario.protocolo_registro)})`;
        explicacaoVeredito = `Este projeto já está gravado no banco do Observatório com o seu próprio CPF/CNPJ (${escaparHtml(registroDoProprioUsuario.titular_nome)}). A sua prova de autoria (hash SHA-512 com data) continua registrada aqui — lembre-se de que é um registro acadêmico interno, não um registro no INPI.`;
    } else if (bloqueioTerceiro) {
        statusApropriacao = 'BLOQUEADO_TERCEIRO';
        podeRegistrar = false;
        tituloVeredito = `Colisão com item de outro titular (${escaparHtml(bloqueioTerceiro.protocolo_registro)})`;
        const artigosBloqueio = bloqueioTerceiro.colisao_marca
            ? 'Pelo Art. 11 (estado da técnica), Art. 124, XIX (proibição de reproduzir marca alheia) e Art. 195 da Lei nº 9.279/96, para registrar uma versão própria você deve: (1) adotar um nome comercial distinto; e (2) especificar uma melhoria construtiva ou funcional própria (Modelo de Utilidade — Art. 9º da LPI).'
            : 'Pelo Art. 11 da Lei nº 9.279/96 (estado da técnica), para registrar uma versão própria você deve especificar uma melhoria construtiva ou funcional própria (Modelo de Utilidade — Art. 9º da LPI) ou uma reimplementação limpa.';
        explicacaoVeredito = `Não é possível apropriar-se diretamente desta criação como sua: detectamos colisão direta (${bloqueioTerceiro.similaridade_percentual}% de semelhança${bloqueioTerceiro.colisao_marca ? ' / nome igual ou parecido' : ''}) com "${escaparHtml(bloqueioTerceiro.nome_criacao_marca)}", já gravado por ${escaparHtml(bloqueioTerceiro.titular_nome)} (${escaparHtml(bloqueioTerceiro.instituicao_empresa)}). ${artigosBloqueio}`;
    } else if (dados.divulgacao_previa === 'DIVULGADO_MAIS_12M') {
        statusApropriacao = 'PARCIAL_ESTADO_DA_TECNICA';
        podeRegistrar = true;
        tituloVeredito = 'Patente impedida pela divulgação anterior (Art. 11 LPI); marca e código ainda podem ser protegidos';
        explicacaoVeredito = 'Como a criação foi divulgada há mais de 12 meses, a solução técnica física já caiu no Estado da Técnica (Art. 11 e Art. 12 da LPI) e não pode mais ser patenteada com exclusividade. Porém, você PODE registrar e colocar em seu nome a Marca Comercial (Art. 129 da LPI) e o Código-Fonte do Firmware (Lei nº 9.609/98).';
    } else if (dados.grau_novidade_hardware === 'MODULOS_PRONTOS_COTS') {
        statusApropriacao = 'PARCIAL_MODULOS_COMERCIAIS';
        podeRegistrar = true;
        tituloVeredito = 'Hardware base já existe no mercado; marca, firmware e desenho da placa podem ser protegidos';
        explicacaoVeredito = 'Os módulos eletrônicos comerciais utilizados (COTS) já pertencem aos seus respectivos fabricantes e ao estado da técnica (Art. 8º e Art. 10, V da LPI). Você não pode patentear o hardware base como invenção sua, mas PODE colocar como sua propriedade exclusiva: (1) a Marca do seu produto (Art. 129 LPI); (2) o seu Código-Fonte/Firmware autoral (Lei 9.609/98); e (3) o desenho específico da sua PCB/Gabinete (Lei 9.610/98 e Art. 94 LPI).';
    }

    if (statusApropriacao === 'DISPONIVEL_EXCLUSIVO' && referenciaConhecida) {
        tituloVeredito = 'Parecido com um produto conhecido do acervo de referência';
        explicacaoVeredito = `O projeto tem ${referenciaConhecida.similaridade_percentual}% de semelhança técnica com "${escaparHtml(referenciaConhecida.nome_criacao_marca)}", um produto conhecido do mercado que está no acervo ilustrativo do Observatório. Isso indica que a ideia geral já existe (estado da técnica, Art. 11 da LPI), mas não impede gravar a sua prova de autoria: o nome é diferente e o acervo não representa um registro de outro usuário. Para uma patente, foque no que o seu projeto faz de diferente.`;
    }

    let novoRegistroGravado = null;
    if (acao === 'REGISTRAR') {
        if (!podeRegistrar && bloqueioTerceiro) {
            return {
                sucesso: false,
                bloqueado: true,
                status_apropriacao: statusApropriacao,
                pode_registrar_como_seu: false,
                titulo_veredito: tituloVeredito,
                explicacao_veredito: explicacaoVeredito,
                hash_sha512_calculado: hashCriacao,
                colisoes: colisoesEncontradas,
                bloqueio_terceiro: bloqueioTerceiro,
                registros_fixos: obterRegistrosFixosLocais()
            };
        }

        if (registroDoProprioUsuario) {
            novoRegistroGravado = registroDoProprioUsuario;
        } else {
            const sufixoProtocolo = hashCriacao.substring(0, 6).toUpperCase();
            const protocoloGerado = `BR-OBS-${new Date().getFullYear()}-${sufixoProtocolo}`;
            novoRegistroGravado = {
                protocolo_registro: protocoloGerado,
                origem_base: 'REGISTRO_FIXO_USUARIO',
                nome_criacao_marca: payload.nome_projeto,
                titular_nome: payload.autor_nome,
                titular_documento: payload.autor_documento,
                instituicao_empresa: payload.instituicao_empresa,
                resumo_tecnico: payload.resumo_tecnico,
                palavras_chave: tokensUsuario.slice(0, 35).join(' '),
                classificacao_cip: payload.classificacao_cip,
                modalidade_protecao: payload.modalidade_protecao,
                camadas_protegidas: payload.camadas_protegidas,
                status_juridico: 'PROTEGIDO_EXCLUSIVO',
                hash_sha512: hashCriacao,
                data_registro: new Date().toLocaleString('pt-BR')
            };
            salvarRegistroFixoNoLocalStorage(novoRegistroGravado);
            statusApropriacao = 'REGISTRADO_COM_SUCESSO';
            tituloVeredito = `Prova de autoria gravada — protocolo interno ${protocoloGerado}`;
            explicacaoVeredito = 'Sua criação foi gravada no banco de dados do Observatório com resumo criptográfico SHA-512 (Art. 3º da Lei nº 9.609/98 e Art. 6º/129 da Lei nº 9.279/96). A partir deste momento, cadastros idênticos feitos por outro CPF/CNPJ neste Observatório serão sinalizados. Este protocolo é interno e acadêmico: ele não substitui o depósito no INPI.';
        }
    }

    return {
        sucesso: true,
        acao_executada: acao,
        status_apropriacao: statusApropriacao,
        pode_registrar_como_seu: podeRegistrar,
        titulo_veredito: tituloVeredito,
        explicacao_veredito: explicacaoVeredito,
        hash_sha512_calculado: hashCriacao,
        tokens_analisados: tokensUsuario.slice(0, 18),
        colisoes: colisoesEncontradas,
        bloqueio_terceiro: bloqueioTerceiro,
        referencia_conhecida: referenciaConhecida,
        registro_gravado: novoRegistroGravado,
        registros_fixos: obterRegistrosFixosLocais()
    };
}

// ============================================================================
// BUSCA REAL NO ESTADO DA TÉCNICA MUNDIAL (OpenAlex + GitHub + Patentes EPO) — SEM DADOS DE RESERVA
// ----------------------------------------------------------------------------
// • OpenAlex (api.openalex.org) e GitHub (api.github.com) são consultados de verdade pelo navegador.
// • Patentes: consultadas no EPO Open Patent Services (base do Espacenet, inclui documentos BR)
//   através de api/patentes.php — a chave fica no servidor (variáveis EPO_OPS_KEY / EPO_OPS_SECRET).
//   Sem chave configurada, as patentes ficam como "apenas link" (pePI, Google Patents, Espacenet).
// • Se uma API falhar, o painel mostra "indisponível" — nunca resultados inventados.
// • O "rigor" escolhido aumenta de verdade a quantidade de resultados e de consultas.
// ============================================================================

const NIVEIS_RIGOR_VARREDURA = {
    rapida:   { rotulo: 'Rápida',   porBase: 10, variantes: 1 },
    padrao:   { rotulo: 'Padrão',   porBase: 25, variantes: 3 },
    profunda: { rotulo: 'Profunda', porBase: 50, variantes: 6 },
    // Completa: mais combinações de termos, 100 resultados por base, as 2 áreas CIP mais fortes e patentes brasileiras
    completa: { rotulo: 'Completa', porBase: 100, variantes: 12, extrasEpo: true }
};

// Só conta como anterioridade o resultado que contém pelo menos esta fração dos termos buscados
const LIMIAR_RELEVANCIA_ANTERIORIDADE = 60;
// API de busca do GitHub sem autenticação aceita 10 consultas por minuto
// (os testes automáticos podem encurtar a pausa definindo window.__TESTE_INTERVALO_GITHUB_MS, porque lá o GitHub é simulado)
const INTERVALO_ENTRE_CONSULTAS_GITHUB_MS = (typeof window !== "undefined" && Number(window.__TESTE_INTERVALO_GITHUB_MS) >= 0 && window.__TESTE_INTERVALO_GITHUB_MS !== undefined) ? Number(window.__TESTE_INTERVALO_GITHUB_MS) : 6500;

function obterNivelRigorSelecionado() {
    const el = document.getElementById('seletor-tempo-auditoria');
    const chave = el ? el.value : 'completa';
    return Object.assign({ chave }, NIVEIS_RIGOR_VARREDURA[chave] || NIVEIS_RIGOR_VARREDURA.padrao);
}

// Escapa texto vindo de APIs externas antes de inserir no HTML
function escaparHtml(texto) {
    return String(texto == null ? '' : texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function urlSegura(url) {
    return /^https?:\/\//i.test(url || '') ? escaparHtml(url) : '#';
}

// Vocabulário (dicionário PT→EN, prioridades, sinônimos e regras CIP) fica em assets/js/vocabulario.js.
// Termos fora do dicionário NÃO são descartados: seguem na consulta em português (OpenAlex e GitHub indexam português).

// Palavras que não ajudam a encontrar anterioridade (verbos e termos vagos)
const PALAVRAS_GENERICAS_BUSCA = new Set(['aciona', 'acionar', 'controlar', 'controla', 'modulo', 'modulos', 'enviando', 'envia',
    'enviar', 'automaticamente', 'microcontrolador', 'utiliza', 'utilizar', 'permite', 'possui', 'atraves', 'mede', 'medir',
    'detecta', 'detectar', 'funciona', 'realiza', 'transmite', 'dados', 'usuario', 'usuarios', 'tempo', 'real', 'sistema',
    'projeto', 'dispositivo', 'aparelho', 'placa', 'quando', 'sempre', 'pessoa', 'pessoas', 'ambiente', 'conectado',
    'conectada', 'ligado', 'ligada', 'utilizando', 'baseado', 'baseada', 'composto', 'composta', 'contendo', 'possuindo',
    'capaz', 'atraves', 'durante', 'outro', 'outra', 'cada', 'todos', 'todas', 'mesmo', 'mesma', 'muito', 'pouco', 'varios',
    'varias', 'algum', 'alguma', 'onde', 'tambem', 'ainda', 'entao', 'apenas', 'proprio', 'propria', 'deposita', 'avisa',
    'informa', 'identifica', 'monitora', 'verifica', 'registra', 'mostra', 'exibe', 'gera', 'faz', 'usa', 'tem', 'sao', 'esta',
    'estao', 'pode', 'podem', 'deve', 'serve', 'ajuda', 'feito', 'feita', 'criado', 'criada', 'desenvolvido', 'desenvolvida',
    'quais', 'qual', 'livre', 'livres', 'certo', 'certa', 'libera', 'liberar', 'mostra', 'mostrar', 'grande', 'pequeno',
    'pequena', 'melhor', 'facil', 'rapido', 'rapida', 'simples', 'barato', 'barata', 'baixo', 'baixa', 'custo', 'alto', 'alta',
    'antes', 'depois', 'agora', 'enquanto', 'assim', 'porque', 'parte', 'lugar', 'local', 'coisa', 'coisas', 'vezes', 'cada']);

const STOPWORDS_BUSCA = new Set(['de', 'da', 'do', 'das', 'dos', 'em', 'no', 'na', 'nos', 'nas', 'um', 'uma', 'uns', 'umas',
    'para', 'por', 'com', 'sem', 'sob', 'sobre', 'entre', 'que', 'se', 'ou', 'ao', 'aos', 'as', 'os', 'o', 'a', 'e', 'é',
    'pelo', 'pela', 'pelos', 'pelas', 'seu', 'sua', 'seus', 'suas', 'meu', 'minha', 'nosso', 'nossa', 'como', 'mais', 'menos',
    'quero', 'patentear', 'proteger', 'novo', 'nova', 'tipo', 'forma', 'meio', 'uso', 'caso', 'personalizado', 'the', 'and',
    'for', 'with', 'of', 'to', 'in', 'on', 'by']);

// Tenta encontrar a palavra no dicionário no singular (cameras → camera, sensores → sensor, animais → animal, botoes → botao)
function traduzirPalavraPt(palavra) {
    if (!palavra) return null;
    const candidatas = [palavra];
    if (palavra.endsWith('oes') || palavra.endsWith('aes')) candidatas.push(palavra.slice(0, -3) + 'ao');
    if (palavra.endsWith('ais')) candidatas.push(palavra.slice(0, -3) + 'al');
    if (palavra.endsWith('eis')) candidatas.push(palavra.slice(0, -3) + 'el');
    if (palavra.endsWith('res') || palavra.endsWith('zes') || palavra.endsWith('ses')) candidatas.push(palavra.slice(0, -2));
    if (palavra.endsWith('s')) candidatas.push(palavra.slice(0, -1));
    for (const c of candidatas) {
        if (Object.prototype.hasOwnProperty.call(DICIONARIO_PT_EN, c)) return DICIONARIO_PT_EN[c];
    }
    return null;
}

function nivelTermoEn(termo) {
    return Object.prototype.hasOwnProperty.call(NIVEL_TERMO_EN, termo) ? NIVEL_TERMO_EN[termo] : 2;
}

// Monta os termos de busca: lista em inglês (dicionário + siglas + palavras-chave do usuário) e lista em português.
// A lista em inglês é ordenada do assunto central para o termo genérico, porque o EPO e o GitHub usam só os 3 primeiros.
function montarTermosDeBusca(dados) {
    const candidatosEn = []; // { termo, nivel, ordem }
    const portugues = [];
    let ordem = 0;
    const origemPt = {}; // termo em inglês -> palavra que o usuário escreveu (para mostrar em português)
    const addEn = (termo, nivelExtra = 0, origem = '') => {
        if (!termo) return;
        candidatosEn.push({ termo, nivel: nivelTermoEn(termo) + nivelExtra, ordem: ordem++ });
        if (origem && origem !== termo && !origemPt[termo]) origemPt[termo] = origem;
    };

    // 1. Palavras-chave informadas pelo usuário (prioridade máxima). Aceita inglês ou português.
    const extras = normalizarTextoComparacaoJS(dados.palavras_chave_extra || '').split(' ').filter(p => p.length >= 2 && !STOPWORDS_BUSCA.has(p)).slice(0, 6);
    extras.forEach(p => addEn(traduzirPalavraPt(p) || p, 10, p));

    // 2. Descrição: primeiro as expressões de várias palavras, depois as palavras soltas.
    //    O nome do projeto só contribui com termos conhecidos (nomes inventados como "Senpu" atrapalham a busca).
    const processar = (textoBruto, ehNome) => {
        let texto = ` ${normalizarTextoComparacaoJS(textoBruto)} `;
        // Guarda a grafia original (com acento) de cada palavra, para exibir "acelerômetro" e não "acelerometro"
        const grafia = {};
        (String(textoBruto).toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).forEach(w => {
            const n = normalizarTextoComparacaoJS(w);
            if (n && !grafia[n]) grafia[n] = w;
        });
        Object.keys(EXPRESSOES_PT_EN).sort((a, b) => b.length - a.length).forEach(expr => {
            if (texto.includes(` ${expr} `)) {
                // Rótulo em português de cada termo: "detector de fumaça" → smoke = fumaça, detector = detector
                // (em português o adjetivo vem depois; em inglês, antes — por isso a ordem é invertida)
                const palavrasPt = expr.split(' ').filter(w => !STOPWORDS_BUSCA.has(w)).map(w => grafia[w] || w);
                const termosEn = EXPRESSOES_PT_EN[expr];
                const alinhado = termosEn.length > 1 && termosEn.length === palavrasPt.length;
                termosEn.forEach((t, i) => addEn(t, ehNome ? -5 : 0,
                    alinhado ? palavrasPt[palavrasPt.length - 1 - i] : expr.split(' ').map(w => grafia[w] || w).join(' ')));
                texto = texto.split(` ${expr} `).join(' ');
            }
        });
        texto.trim().split(' ').forEach(p => {
            if (!p || STOPWORDS_BUSCA.has(p) || /^\d+$/.test(p)) return;
            const traducao = traduzirPalavraPt(p);
            if (traducao) { addEn(traducao, ehNome ? -5 : 0, grafia[p] || p); return; } // nome do projeto: só como último recurso
            if (SIGLAS_TECNICAS.includes(p)) { addEn(p, ehNome ? -5 : 0); if (!ehNome) portugues.push(p); return; }
            if (Object.prototype.hasOwnProperty.call(NIVEL_TERMO_EN, p)) { addEn(p, ehNome ? -5 : 0); return; } // já escrito em inglês
            if (ehNome || PALAVRAS_GENERICAS_BUSCA.has(p) || p.length < 5) return;
            if (/(am|em|ando|endo|indo|ou|ava|ia)$/.test(p) && !/(agem|gem)$/.test(p)) return; // verbos conjugados (mostram, enviando, ligou)
            portugues.push(p);
        });
    };
    processar(dados.resumo_tecnico || '', false);
    processar(dados.nome_projeto || '', true);

    // Ordena por prioridade (estável pela ordem em que apareceu) e remove repetidos
    const vistos = new Set();
    let ingles = candidatosEn
        .sort((a, b) => b.nivel - a.nivel || a.ordem - b.ordem)
        .map(c => c.termo)
        .filter(t => !vistos.has(t) && vistos.add(t));

    // Remove sinônimos: se a descrição cita os dois, fica só o termo mais comum em patentes/artigos
    // (ex.: "bluetooth" e "ble" juntos fazem a busca exigir as duas palavras e quase nada é encontrado)
    const SINONIMOS = { ble: 'bluetooth', lorawan: 'lora', gnss: 'gps', nbiot: 'lte', esp8266: 'esp32', printing: 'printer',
        tracking: 'tracker', locator: 'tracker', uav: 'drone', quadcopter: 'drone', smartwatch: 'watch', moisture: 'humidity' };
    const semSinonimos = arr => {
        const conj = new Set(arr);
        return arr.filter(t => !(SINONIMOS[t] && conj.has(SINONIMOS[t])));
    };
    ingles = semSinonimos(ingles);
    const vistosPt = new Set();
    const pt = semSinonimos(portugues.filter(t => !vistosPt.has(t) && vistosPt.add(t)));
    return { ingles: ingles.slice(0, 8), portugues: pt.slice(0, 8), origemPt };
}

// Gera as variantes de consulta (quanto maior o rigor, mais combinações de termos são consultadas)
function gerarVariantesDeConsulta(termos, quantidade) {
    const variantes = [];
    const adicionar = lista => {
        const q = lista.filter(Boolean).slice(0, 4);
        if (q.length >= 2 && !variantes.some(v => v.join(' ') === q.join(' '))) variantes.push(q);
    };
    const en = termos.ingles;
    const pt = termos.portugues;
    adicionar(en.length >= 2 ? en.slice(0, 4) : [...en, ...pt].slice(0, 4));
    // Combinações: núcleo (2 primeiros termos) + cada termo restante, depois a consulta em português
    for (let i = 2; i < en.length && variantes.length < quantidade; i++) adicionar([en[0], en[1], en[i]]);
    if (variantes.length < quantidade) adicionar(pt.slice(0, 4));
    for (let i = 1; i < en.length && variantes.length < quantidade; i++) adicionar([en[0], en[i]]);
    for (let i = 2; i < pt.length && variantes.length < quantidade; i++) adicionar([pt[0], pt[1], pt[i]]);
    return variantes.slice(0, quantidade);
}

// Relevância = % dos termos da consulta que aparecem no título/resumo/descrição do resultado
function calcularRelevanciaResultado(termosConsulta, textoResultado) {
    const texto = ` ${normalizarTextoComparacaoJS(textoResultado)} `;
    if (!termosConsulta.length || !texto.trim()) return { percentual: 0, encontrados: [] };
    // Cada termo vale se ele OU um sinônimo aparecer (ex.: "elderly" também aceita "senior" e "older")
    const encontrados = termosConsulta.filter(t => {
        const termo = normalizarTextoComparacaoJS(t);
        const formas = [termo, ...((typeof EQUIVALENTES_EN !== 'undefined' && EQUIVALENTES_EN[termo]) || []).map(normalizarTextoComparacaoJS)];
        return formas.some(f => {
            if (!f) return false;
            if (f.length <= 3) return texto.includes(` ${f} `) || texto.includes(` ${f}s `); // termos curtos: palavra inteira
            const raiz = f.length > 5 ? f.slice(0, f.length - 1) : f; // tolera plural simples
            return texto.includes(` ${f}`) || texto.includes(` ${raiz}`);
        });
    });
    return {
        percentual: Math.round((encontrados.length / termosConsulta.length) * 100),
        encontrados
    };
}

function reconstruirResumoOpenAlex(indiceInvertido) {
    if (!indiceInvertido || typeof indiceInvertido !== 'object') return '';
    const posicoes = [];
    Object.keys(indiceInvertido).forEach(palavra => {
        (indiceInvertido[palavra] || []).forEach(pos => { posicoes[pos] = palavra; });
    });
    return posicoes.filter(Boolean).join(' ');
}

async function fetchComTempoLimite(url, ms = 12000, opcoes = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    try {
        return await fetch(url, Object.assign({}, opcoes, { signal: controller.signal }));
    } finally {
        clearTimeout(timer);
    }
}

async function consultarOpenAlex(termosConsulta, porPagina) {
    const campos = 'id,doi,display_name,publication_year,authorships,abstract_inverted_index,primary_location';
    const url = `https://api.openalex.org/works?search=${encodeURIComponent(termosConsulta.join(' '))}&per-page=${porPagina}&select=${campos}`;
    const resp = await fetchComTempoLimite(url);
    if (!resp.ok) throw new Error(`OpenAlex HTTP ${resp.status}`);
    const json = await resp.json();
    return (json.results || []).map(obra => {
        const resumo = reconstruirResumoOpenAlex(obra.abstract_inverted_index);
        const fonte = obra.primary_location && obra.primary_location.source ? obra.primary_location.source.display_name : '';
        const autor = obra.authorships && obra.authorships[0] && obra.authorships[0].author ? obra.authorships[0].author.display_name : '';
        return {
            base: 'OpenAlex',
            id: obra.id,
            titulo: obra.display_name || '(sem título)',
            ano: obra.publication_year || 's/d',
            link: obra.doi || obra.id,
            detalhe: [autor, fonte].filter(Boolean).join(' • '),
            textoComparacao: `${obra.display_name || ''} ${resumo}`
        };
    });
}

// Patentes reais no EPO (via backend PHP). Retorna { estado, resultados, mensagem }
async function consultarPatentesEpo(termosConsulta, porPagina, subclasseCip = '', pais = '') {
    const filtroCip = (subclasseCip ? `&cip=${encodeURIComponent(subclasseCip)}` : '') + (pais ? `&pais=${encodeURIComponent(pais)}` : '');
    const url = `api/patentes.php?q=${encodeURIComponent(termosConsulta.join(' '))}&n=${porPagina}${filtroCip}`;
    let json;
    try {
        const resp = await fetchComTempoLimite(url, 20000);
        json = await resp.json();
    } catch (e) {
        // Sem backend PHP (ex.: index.html aberto direto pelo arquivo) não há como consultar patentes
        return { estado: 'sem_backend', resultados: [], mensagem: 'Backend PHP indisponível — busca de patentes só funciona com o site publicado ou rodando em php -S.' };
    }
    if (!json || !json.sucesso) {
        return { estado: (json && json.estado) || 'erro', resultados: [], mensagem: (json && json.mensagem) || 'Erro desconhecido' };
    }
    return {
        estado: 'ok',
        total: json.total || 0,
        resultados: (json.resultados || []).map(p => ({
            base: 'Patente',
            id: p.id,
            titulo: `${p.numero} — ${p.titulo}`,
            ano: p.ano,
            link: p.link,
            titular: p.titular || '',
            dataPublicacao: p.data_publicacao || '',
            detalhe: p.resumo || '',
            textoComparacao: p.texto_comparacao || `${p.titulo || ''} ${p.resumo || ''}`
        }))
    };
}

async function consultarGitHub(termosConsulta, porPagina) {
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(termosConsulta.join(' '))}&per_page=${porPagina}`;
    const resp = await fetchComTempoLimite(url, 12000, { headers: { 'Accept': 'application/vnd.github+json' } });
    if (resp.status === 403 || resp.status === 429) {
        const erro = new Error('Limite de consultas do GitHub atingido');
        erro.limite = true;
        throw erro;
    }
    if (!resp.ok) throw new Error(`GitHub HTTP ${resp.status}`);
    const json = await resp.json();
    return (json.items || []).map(repo => ({
        base: 'GitHub',
        id: repo.full_name,
        titulo: repo.full_name,
        ano: repo.created_at ? repo.created_at.substring(0, 4) : 's/d',
        link: repo.html_url,
        estrelas: repo.stargazers_count,
        licenca: repo.license && repo.license.spdx_id && repo.license.spdx_id !== 'NOASSERTION' ? repo.license.spdx_id : 'Sem licença declarada',
        detalhe: repo.description || '',
        textoComparacao: `${repo.name || ''} ${(repo.name || '').replace(/[-_]/g, ' ')} ${repo.description || ''} ${(repo.topics || []).join(' ')}`
    }));
}

/**
 * Executa a busca real. Retorna os resultados com relevância calculada e o status verdadeiro de cada base.
 * @param {object} dados        dados do formulário
 * @param {object} diag         diagnóstico (para obter a CIP usada no link do Google Patents)
 * @param {object} [opcoes]     { rigor, aoProgredir(evento), deveInterromper() }
 */
async function buscarEstadoDaTecnicaMundialAoVivo(dados, diag, opcoes = {}) {
    const painelMundial = document.getElementById('painel-anterioridade-mundial');
    const rigor = opcoes.rigor || obterNivelRigorSelecionado();
    const aoProgredir = typeof opcoes.aoProgredir === 'function' ? opcoes.aoProgredir : () => {};
    const deveInterromper = typeof opcoes.deveInterromper === 'function' ? opcoes.deveInterromper : () => false;
    const esperar = ms => new Promise(res => setTimeout(res, ms));

    const corr = diag.correlacao_patentaria || gerarCorrelacaoPatentariaReal(dados, diag);
    const cipPrincipal = ((corr.codigos_cip && corr.codigos_cip[0]) || 'G05B 19/042').split(' (')[0].trim();
    const termos = montarTermosDeBusca(dados);
    const variantes = gerarVariantesDeConsulta(termos, rigor.variantes);
    const consultaPrincipal = variantes[0] ? variantes[0].join(' ') : dados.nome_projeto;

    const links = {
        inpi: 'https://busca.inpi.gov.br/pePI/',
        googlePatents: `https://patents.google.com/?q=${encodeURIComponent(consultaPrincipal)}`,
        googlePatentsCip: `https://patents.google.com/?q=${encodeURIComponent(consultaPrincipal)}&cpc=${encodeURIComponent(cipPrincipal.replace(/\s+/g, ''))}`,
        espacenet: `https://worldwide.espacenet.com/patent/search?q=${encodeURIComponent(consultaPrincipal)}`
    };

    if (painelMundial) {
        painelMundial.innerHTML = `<p class="small muted">Consultando as bases (rigor ${escaparHtml(rigor.rotulo)}: até ${rigor.porBase} resultados por base em ${variantes.length || 1} consulta(s))…</p>`;
    }

    const status = {
        openalex: { estado: 'pendente', consultas: 0, recebidos: 0, erro: '' },
        github: { estado: 'pendente', consultas: 0, recebidos: 0, erro: '' },
        patentes: { estado: 'pendente', consultas: 0, recebidos: 0, erro: '' }
    };
    const mapaResultados = new Map();
    const consultasExecutadas = [];
    let ultimaConsultaGithub = 0;

    // Relevância medida contra os termos PRINCIPAIS do projeto (até 4 em inglês ou 4 em português),
    // e não contra a variante curta da consulta — assim um resultado que só tem 2 termos genéricos não passa de 60%.
    const termosPrincipaisEn = termos.ingles.slice(0, 4);
    const termosPrincipaisPt = termos.portugues.slice(0, 4);
    const registrar = (lista, termosConsulta) => {
        lista.forEach(item => {
            const relEn = calcularRelevanciaResultado(termosPrincipaisEn.length >= 2 ? termosPrincipaisEn : termosConsulta, item.textoComparacao);
            const relPt = termosPrincipaisPt.length >= 2 ? calcularRelevanciaResultado(termosPrincipaisPt, item.textoComparacao) : { percentual: 0, encontrados: [] };
            const usouPt = relPt.percentual > relEn.percentual;
            const rel = usouPt ? relPt : relEn;
            const termosBase = usouPt ? termosPrincipaisPt : (termosPrincipaisEn.length >= 2 ? termosPrincipaisEn : termosConsulta);
            const chave = `${item.base}:${item.id}`;
            const anterior = mapaResultados.get(chave);
            if (!anterior || rel.percentual > anterior.relevancia) {
                mapaResultados.set(chave, Object.assign({}, item, {
                    relevancia: rel.percentual,
                    termosEncontrados: rel.encontrados,
                    termosBase,
                    consulta: termosConsulta.join(' ')
                }));
            }
        });
    };

    if (variantes.length === 0) {
        status.openalex = { estado: 'sem_termos', consultas: 0, recebidos: 0, erro: 'Descrição sem termos técnicos suficientes para a busca.' };
        status.github = { estado: 'sem_termos', consultas: 0, recebidos: 0, erro: 'Descrição sem termos técnicos suficientes para a busca.' };
        status.patentes = { estado: 'sem_termos', consultas: 0, recebidos: 0, erro: 'Descrição sem termos técnicos suficientes para a busca.' };
    }

    for (let i = 0; i < variantes.length; i++) {
        if (deveInterromper()) break;
        const termosConsulta = variantes[i];
        const rotuloConsulta = termosConsulta.join(' ');
        consultasExecutadas.push(rotuloConsulta);

        // OpenAlex
        if (status.openalex.estado !== 'erro') {
            aoProgredir({ base: 'openalex', fase: 'consultando', consulta: rotuloConsulta, indice: i, total: variantes.length });
            try {
                const res = await consultarOpenAlex(termosConsulta, rigor.porBase);
                status.openalex.consultas++;
                status.openalex.recebidos += res.length;
                status.openalex.estado = 'ok';
                registrar(res, termosConsulta);
                aoProgredir({ base: 'openalex', fase: 'ok', consulta: rotuloConsulta, recebidos: res.length, indice: i, total: variantes.length });
            } catch (e) {
                if (status.openalex.consultas === 0) {
                    status.openalex.estado = 'erro';
                    status.openalex.erro = e.name === 'AbortError' ? 'Tempo de resposta esgotado' : e.message;
                } else {
                    status.openalex.estado = 'parcial';
                    status.openalex.erro = e.message;
                }
                aoProgredir({ base: 'openalex', fase: 'erro', consulta: rotuloConsulta, erro: status.openalex.erro, indice: i, total: variantes.length });
            }
        }

        // Patentes (EPO OPS via backend). Para de tentar se não houver chave/backend ou se o limite for atingido.
        if (['pendente', 'ok', 'parcial'].includes(status.patentes.estado)) {
            aoProgredir({ base: 'patentes', fase: 'consultando', consulta: termosConsulta.slice(0, 3).join(' '), indice: i, total: variantes.length });
            let res = await consultarPatentesEpo(termosConsulta.slice(0, 3), rigor.porBase);
            // Nenhuma patente com os 3 termos juntos: tenta de novo só com os 2 termos mais importantes
            if (res.estado === 'ok' && res.resultados.length === 0 && termosConsulta.length >= 3) {
                const doisTermos = termosConsulta.slice(0, 2);
                aoProgredir({ base: 'patentes', fase: 'info', mensagem: `Nenhuma patente com os 3 termos. Tentando só "${doisTermos.join(' ')}"...` });
                const res2 = await consultarPatentesEpo(doisTermos, rigor.porBase);
                if (res2.estado === 'ok') { status.patentes.consultas++; res = res2; }
            }
            if (res.estado === 'ok') {
                status.patentes.consultas++;
                status.patentes.recebidos += res.resultados.length;
                status.patentes.estado = 'ok';
                if (res.total) status.patentes.totalEncontrado = Math.max(status.patentes.totalEncontrado || 0, res.total);
                registrar(res.resultados, termosConsulta);
                aoProgredir({ base: 'patentes', fase: 'ok', consulta: rotuloConsulta, recebidos: res.resultados.length, totalNaBase: res.total, indice: i, total: variantes.length });

                // Na primeira consulta, faz também uma busca restrita à área técnica (subclasse CIP) do projeto.
                // Traz patentes do mesmo campo mesmo quando usam outras palavras. Se falhar, não afeta o resto.
                const subclasse = (cipPrincipal.match(/^[A-H]\d{2}[A-Z]/) || [''])[0];
                if (i === 0 && subclasse && termosConsulta.length >= 2 && !deveInterromper()) {
                    const doisTermos = termosConsulta.slice(0, 2);
                    aoProgredir({ base: 'patentes', fase: 'info', mensagem: `Consultando só a área ${subclasse}: "${doisTermos.join(' ')}"` });
                    const resCip = await consultarPatentesEpo(doisTermos, rigor.porBase, subclasse);
                    if (resCip.estado === 'ok') {
                        status.patentes.consultas++;
                        status.patentes.recebidos += resCip.resultados.length;
                        registrar(resCip.resultados, termosConsulta);
                        aoProgredir({ base: 'patentes', fase: 'info', recebidos: resCip.resultados.length, mensagem: `${resCip.resultados.length} patentes da área ${subclasse} recebidas.` });
                    } else {
                        aoProgredir({ base: 'patentes', fase: 'info', mensagem: `Busca por área ${subclasse} indisponível (${resCip.mensagem || resCip.estado}). Seguindo sem ela.` });
                    }
                }
            } else if (res.estado === 'sem_chave' || res.estado === 'sem_backend') {
                status.patentes = { estado: 'apenas_link', consultas: 0, recebidos: 0, erro: res.mensagem };
                aoProgredir({ base: 'patentes', fase: 'apenas_link', erro: res.mensagem, indice: i, total: variantes.length });
            } else {
                const jaConsultou = status.patentes.consultas > 0;
                status.patentes.estado = res.estado === 'limite' ? 'limite' : (jaConsultou ? 'parcial' : 'erro');
                status.patentes.erro = res.mensagem;
                aoProgredir({ base: 'patentes', fase: status.patentes.estado, consulta: rotuloConsulta, erro: res.mensagem, indice: i, total: variantes.length });
            }
        }

        // GitHub (respeita o limite de 10 consultas/minuto da API sem autenticação)
        if (status.github.estado !== 'erro' && status.github.estado !== 'limite') {
            const espera = INTERVALO_ENTRE_CONSULTAS_GITHUB_MS - (Date.now() - ultimaConsultaGithub);
            if (ultimaConsultaGithub && espera > 0) {
                aoProgredir({ base: 'github', fase: 'aguardando', esperaMs: espera, indice: i, total: variantes.length });
                const fim = Date.now() + espera;
                while (Date.now() < fim && !deveInterromper()) await esperar(250);
                if (deveInterromper()) break;
            }
            aoProgredir({ base: 'github', fase: 'consultando', consulta: termosConsulta.slice(0, 3).join(' '), indice: i, total: variantes.length });
            ultimaConsultaGithub = Date.now();
            try {
                const res = await consultarGitHub(termosConsulta.slice(0, 3), rigor.porBase);
                status.github.consultas++;
                status.github.recebidos += res.length;
                status.github.estado = 'ok';
                registrar(res, termosConsulta);
                aoProgredir({ base: 'github', fase: 'ok', consulta: rotuloConsulta, recebidos: res.length, indice: i, total: variantes.length });
            } catch (e) {
                if (e.limite) {
                    status.github.estado = 'limite';
                    status.github.erro = 'Limite de 10 consultas/minuto da API do GitHub atingido — resultado incompleto. Aguarde 1 minuto e refaça.';
                } else if (status.github.consultas === 0) {
                    status.github.estado = 'erro';
                    status.github.erro = e.name === 'AbortError' ? 'Tempo de resposta esgotado' : e.message;
                } else {
                    status.github.estado = 'parcial';
                    status.github.erro = e.message;
                }
                aoProgredir({ base: 'github', fase: status.github.estado, consulta: rotuloConsulta, erro: status.github.erro, indice: i, total: variantes.length });
            }
        }
    }

    // Rigor "Completa": consultas extras de patentes (não interrompem a busca se falharem)
    if (rigor.extrasEpo && !deveInterromper() && ['ok', 'parcial'].includes(status.patentes.estado) && variantes[0] && variantes[0].length >= 2) {
        const doisTermos = variantes[0].slice(0, 2);
        const subclasses = [...new Set((corr.codigos_cip || []).map(c => (c.match(/^[A-H]\d{2}[A-Z]/) || [''])[0]).filter(Boolean))];
        const extras = [];
        if (subclasses[1]) extras.push({ cip: subclasses[1], pais: '', rotulo: `área ${subclasses[1]}` });
        // Patentes brasileiras costumam ter título e resumo só em português: busca em inglês e também com as palavras do usuário
        const origem = termos.origemPt || {};
        const emPortugues = lista => [...new Set(lista.map(t => origem[t] || t).join(' ').split(/\s+/)
            .filter(w => w.length >= 2 && !STOPWORDS_BUSCA.has(normalizarTextoComparacaoJS(w))))];
        const ptDois = emPortugues(doisTermos);
        const ptUm = emPortugues(variantes[0].slice(0, 1));
        extras.push({ cip: '', pais: 'BR', rotulo: 'patentes brasileiras (BR) em inglês' });
        if (ptDois.length >= 1) extras.push({ cip: '', pais: 'BR', rotulo: 'patentes brasileiras (BR) em português', termos: ptDois });
        if (ptUm.length >= 1 && ptUm.join(' ') !== ptDois.join(' ')) extras.push({ cip: '', pais: 'BR', rotulo: 'patentes brasileiras (BR), termo principal em português', termos: ptUm });
        for (const ex of extras) {
            if (deveInterromper()) break;
            const termosEx = ex.termos || doisTermos;
            aoProgredir({ base: 'patentes', fase: 'info', mensagem: `Consultando ${ex.rotulo}: "${termosEx.join(' ')}"` });
            const resEx = await consultarPatentesEpo(termosEx, rigor.porBase, ex.cip, ex.pais);
            if (resEx.estado === 'ok') {
                status.patentes.consultas++;
                status.patentes.recebidos += resEx.resultados.length;
                registrar(resEx.resultados, variantes[0]);
                aoProgredir({ base: 'patentes', fase: 'info', recebidos: resEx.resultados.length, mensagem: `${resEx.resultados.length} resultados (${ex.rotulo}).` });
            } else {
                aoProgredir({ base: 'patentes', fase: 'info', mensagem: `Consulta de ${ex.rotulo} indisponível (${resEx.mensagem || resEx.estado}). Seguindo sem ela.` });
            }
        }
    }

    const interrompida = deveInterromper();
    const todos = Array.from(mapaResultados.values()).sort((a, b) => b.relevancia - a.relevancia || (b.estrelas || 0) - (a.estrelas || 0));
    const relevantes = todos.filter(r => r.relevancia >= LIMIAR_RELEVANCIA_ANTERIORIDADE && r.termosEncontrados.length >= 2);
    // "Mesma solução" = tem TODOS os termos principais do projeto; os demais relevantes são "do mesmo tema"
    const mesmaSolucao = relevantes.filter(r => (r.termosBase || []).length >= 2 && r.termosEncontrados.length >= r.termosBase.length);
    const mesmoTema = relevantes.filter(r => !mesmaSolucao.includes(r));
    const basesComFalha = ['openalex', 'github', 'patentes'].filter(b => ['erro', 'limite', 'parcial'].includes(status[b].estado));

    const resultado = {
        rigor,
        consultas: consultasExecutadas,
        termos,
        cipPrincipal,
        links,
        status,
        interrompida,
        basesComFalha,
        todos,
        relevantes,
        obrasRelevantes: relevantes.filter(r => r.base === 'OpenAlex'),
        patentesRelevantes: relevantes.filter(r => r.base === 'Patente'),
        patentesConsultadas: status.patentes.consultas > 0,
        reposRelevantes: relevantes.filter(r => r.base === 'GitHub'),
        totalAnalisados: todos.length,
        totalAchadosMundo: relevantes.length,
        mesmaSolucao,
        mesmoTema,
        patentesMesmaSolucao: mesmaSolucao.filter(r => r.base === 'Patente')
    };

    if (painelMundial) painelMundial.innerHTML = renderizarResultadoBuscaMundial(resultado);
    return resultado;
}

function descreverStatusBase(nome, st) {
    const linha = (classe, texto) => `<li><span class="base-dot ${classe}"></span><span><strong>${nome}:</strong> ${texto}</span></li>`;
    switch (st.estado) {
        case 'ok': return linha('ok', `consultado — ${st.recebidos} resultado(s) em ${st.consultas} consulta(s)`);
        case 'parcial': return linha('aviso', `consulta parcial (${st.consultas} concluída(s)) — ${escaparHtml(st.erro)}`);
        case 'limite': return linha('aviso', escaparHtml(st.erro));
        case 'erro': return linha('erro', `indisponível no momento (${escaparHtml(st.erro)}); nenhum resultado desta base foi considerado`);
        case 'sem_termos': return linha('', `não consultado — ${escaparHtml(st.erro)}`);
        case 'apenas_link': return linha('link', `sem consulta automática (${escaparHtml(st.erro || 'não configurada')}) — use os links abaixo`);
        default: return linha('', 'não consultado');
    }
}

function renderizarItemResultadoMundial(item) {
    const relevante = item.relevancia >= LIMIAR_RELEVANCIA_ANTERIORIDADE && item.termosEncontrados.length >= 2;
    const meta = [];
    if (item.base === 'GitHub') {
        meta.push(`★ ${item.estrelas}`, `Licença: ${escaparHtml(item.licenca)}`);
    } else if (item.base === 'Patente') {
        if (item.titular) meta.push(`Titular: ${escaparHtml(item.titular)}`);
        if (item.dataPublicacao) meta.push(`Publicada em ${escaparHtml(item.dataPublicacao)}`);
    } else if (item.detalhe) {
        meta.push(escaparHtml(String(item.detalhe).substring(0, 120)));
    }
    meta.push(`Termos encontrados: ${escaparHtml(item.termosEncontrados.join(', ') || 'nenhum')}`);
    const descricao = item.base !== 'OpenAlex' && item.detalhe ? `<div class="result-desc">${escaparHtml(String(item.detalhe).substring(0, 180))}</div>` : '';
    return `
        <div class="result-item${relevante ? ' relevante' : ''}">
            <div><span class="result-base">${item.base}</span><a class="result-titulo" href="${urlSegura(item.link)}" target="_blank" rel="noopener">${escaparHtml(item.titulo)}</a> <span class="muted small">(${escaparHtml(item.ano)})</span></div>
            <span class="result-score" title="Porcentagem dos termos principais do seu projeto que aparecem neste resultado">${item.relevancia}%</span>
            ${descricao}
            <div class="result-meta">${meta.join(' • ')}</div>
        </div>`;
}

// Os 3 resultados mais próximos do projeto, com os termos que batem e os que faltam.
// Os termos que faltam são pistas do diferencial do projeto.
function renderizarDestaqueMaisParecidos(r) {
    const pesoBase = { Patente: 3, OpenAlex: 2, GitHub: 1 };
    const top = r.todos
        .filter(x => x.termosEncontrados && x.termosEncontrados.length >= 1)
        .slice()
        .sort((a, b) => b.relevancia - a.relevancia || b.termosEncontrados.length - a.termosEncontrados.length || (pesoBase[b.base] || 0) - (pesoBase[a.base] || 0))
        .slice(0, 3);
    if (top.length === 0) return '';
    const origem = (r.termos && r.termos.origemPt) || {};
    const rotuloTermo = t => origem[t] ? `${escaparHtml(origem[t])} <span class="termo-en">(${escaparHtml(t)})</span>` : escaparHtml(t);
    const nomeBase = { Patente: 'Patente', OpenAlex: 'Artigo', GitHub: 'Repositório' };
    const cards = top.map((item, i) => {
        const achados = new Set(item.termosEncontrados);
        const faltam = (item.termosBase || []).filter(t => !achados.has(t));
        const chips = [
            ...item.termosEncontrados.map(t => `<span class="termo-chip ok" title="Aparece neste resultado">✓ ${rotuloTermo(t)}</span>`),
            ...faltam.map(t => `<span class="termo-chip falta" title="Não aparece neste resultado">✗ ${rotuloTermo(t)}</span>`)
        ].join('');
        const leitura = faltam.length === 0
            ? 'Tem todos os termos principais do seu projeto. Leia com atenção: pode descrever a mesma solução.'
            : `Não fala de ${faltam.map(t => escaparHtml(origem[t] || t)).join(', ')}. Se isso for parte central do seu projeto, pode ser o seu diferencial.`;
        return `
            <div class="destaque-card">
                <div class="destaque-topo">
                    <span class="destaque-pos">${i + 1}º</span>
                    <span class="result-base">${nomeBase[item.base] || escaparHtml(item.base)}</span>
                    <span class="result-score">${item.relevancia}%</span>
                </div>
                <a class="result-titulo" href="${urlSegura(item.link)}" target="_blank" rel="noopener">${escaparHtml(item.titulo)}</a>
                <span class="muted small">${escaparHtml(item.ano)}${item.titular ? ' • ' + escaparHtml(item.titular) : ''}</span>
                <div class="termos-chips">${chips}</div>
                <p class="destaque-leitura">${leitura}</p>
            </div>`;
    }).join('');
    return `
        <section class="destaque-parecidos">
            <h4>Os mais parecidos com o seu projeto</h4>
            <p class="muted small">Compare termo a termo. O que falta em cada um mostra onde o seu projeto pode ser diferente.</p>
            <div class="destaque-grid">${cards}</div>
        </section>`;
}

function renderizarResultadoBuscaMundial(r) {
    let html = `
        <ul class="bases-status">
            ${descreverStatusBase('Patentes (EPO)', r.status.patentes)}
            ${descreverStatusBase('Artigos (OpenAlex)', r.status.openalex)}
            ${descreverStatusBase('Repositórios (GitHub)', r.status.github)}
            <li><span class="base-dot link"></span><span><strong>INPI (pePI):</strong> sem API pública — use o link abaixo</span></li>
        </ul>
        <p class="consultas-feitas">Rigor ${escaparHtml(r.rigor.rotulo)} • termos pesquisados: ${r.consultas.map(c => `<code>${escaparHtml(c)}</code>`).join(' ') || '—'}${r.interrompida ? ' • busca encerrada antes do fim' : ''}</p>
        <div class="link-row">
            <a href="${r.links.inpi}" target="_blank" rel="noopener" class="btn-secondary btn-sm">Buscar no pePI (INPI) ↗</a>
            <a href="${urlSegura(r.links.googlePatentsCip)}" target="_blank" rel="noopener" class="btn-secondary btn-sm">Google Patents — classe ${escaparHtml(r.cipPrincipal)} ↗</a>
            <a href="${urlSegura(r.links.googlePatents)}" target="_blank" rel="noopener" class="btn-secondary btn-sm">Google Patents ↗</a>
            <a href="${urlSegura(r.links.espacenet)}" target="_blank" rel="noopener" class="btn-secondary btn-sm">Espacenet ↗</a>
        </div>`;

    html += renderizarDestaqueMaisParecidos(r);

    if (r.relevantes.length > 0) {
        const nMesma = (r.mesmaSolucao || []).length;
        html += `<h4 style="margin-bottom:0.2rem;">${r.relevantes.length} resultado(s) parecido(s) com o seu projeto</h4>
            <p class="muted small" style="margin:0 0 0.6rem;">${nMesma} com todos os termos principais (podem ser a mesma solução) • ${r.relevantes.length - nMesma} do mesmo tema, sem todos os termos</p>
            <div class="result-list">${r.relevantes.slice(0, 15).map(renderizarItemResultadoMundial).join('')}</div>`;
    } else if (r.totalAnalisados > 0) {
        html += `<div class="alert-card alert-SUCESSO"><h4>Nenhum resultado com relevância de ${LIMIAR_RELEVANCIA_ANTERIORIDADE}% ou mais</h4><p>Foram analisados ${r.totalAnalisados} resultados. Isso não prova que o projeto é novo — confira também nos links acima.</p></div>`;
    }

    if (r.basesComFalha.length > 0 && r.relevantes.length === 0) {
        html += `<div class="alert-card alert-ATENCAO"><h4>Busca incompleta</h4><p>Uma ou mais bases não responderam por completo. A falta de resultados <strong>não</strong> significa que não exista algo parecido. Refaça a busca em alguns instantes.</p></div>`;
    }

    const outros = r.todos.filter(x => !r.relevantes.includes(x));
    if (outros.length > 0) {
        html += `
            <details class="mais">
                <summary>Ver outros ${outros.length} resultados com baixa relevância</summary>
                <div class="result-list">${outros.slice(0, 40).map(renderizarItemResultadoMundial).join('')}</div>
            </details>`;
    }
    return html;
}

// Renderiza o painel da base do Observatório (veredito local, colisões e tabela)
function renderizarPainelVerificacaoExistencia(verif) {
    ultimaVerificacaoExistencia = verif;
    const painelVeredito = document.getElementById('painel-veredito-apropriacao');
    const painelColisoes = document.getElementById('painel-colisoes-internas');
    const btnRegistrar = document.getElementById('btn-registrar-titularidade-fixa');
    const tbodyFixos = document.getElementById('tabela-registros-fixos-body');
    const e = escaparHtml;

    if (painelVeredito && verif) {
        let classeAlerta = 'alert-SUCESSO';
        if (verif.status_apropriacao === 'BLOQUEADO_TERCEIRO') classeAlerta = 'alert-CRITICO';
        else if (verif.status_apropriacao === 'PARCIAL_ESTADO_DA_TECNICA' || verif.status_apropriacao === 'PARCIAL_MODULOS_COMERCIAIS') classeAlerta = 'alert-ATENCAO';

        // Os textos do veredito vêm do motor (local ou PHP) e contêm marcação controlada pelo sistema;
        // nomes digitados por usuários dentro deles são escapados na origem abaixo (colisões/tabela).
        painelVeredito.innerHTML = `
            <div class="alert-card ${classeAlerta}">
                <h3>${verif.titulo_veredito || ''}</h3>
                <p>${verif.explicacao_veredito || ''}</p>
                ${verif.hash_sha512_calculado ? `<div class="hash-box"><strong>Hash SHA-512 do projeto (prova de autoria com data)</strong>${e(verif.hash_sha512_calculado)}</div>` : ''}
            </div>
        `;
    }

    if (btnRegistrar && verif) {
        btnRegistrar.disabled = false;
        if (!verif.pode_registrar_como_seu) {
            btnRegistrar.textContent = 'Gravação bloqueada (colisão)';
            btnRegistrar.disabled = true;
        } else if (verif.status_apropriacao === 'JA_PERTENCE_AO_USUARIO' || verif.status_apropriacao === 'REGISTRADO_COM_SUCESSO') {
            btnRegistrar.textContent = 'Prova de autoria já gravada';
        } else {
            btnRegistrar.textContent = 'Gravar prova de autoria';
        }
    }

    if (painelColisoes && verif) {
        if (!verif.colisoes || verif.colisoes.length === 0) {
            painelColisoes.innerHTML = `<p class="small muted">Nenhum dos ${verif.registros_fixos ? verif.registros_fixos.length : 0} itens da base do Observatório é parecido com o seu projeto.</p>`;
        } else {
            painelColisoes.innerHTML = `<h4 style="margin-bottom:0.6rem;">Itens parecidos na base</h4>` + verif.colisoes.slice(0, 4).map(col => {
                const forte = col.similaridade_percentual >= 55 || col.colisao_marca;
                const cor = col.mesmo_titular ? 'alert-SUCESSO' : (forte ? 'alert-CRITICO' : 'alert-ATENCAO');
                const tag = col.mesmo_titular ? 'Seu próprio registro' : (forte ? 'Colisão com terceiro' : 'Semelhança parcial');
                const ilustrativo = col.origem_base === 'ACERVO_REFERENCIA_ILUSTRATIVO' ? ' • acervo ilustrativo' : '';
                return `
                    <div class="alert-card ${cor}">
                        <span class="inpi-badge">${e(col.protocolo_registro)} • ${col.similaridade_percentual}% • ${tag}${ilustrativo}</span>
                        <h4>${e(col.nome_criacao_marca)}</h4>
                        <p class="small">Titular: ${e(col.titular_nome)} — ${e(col.instituicao_empresa || '')}</p>
                        <p class="small muted">${e(col.modalidade_protecao || '')}</p>
                    </div>
                `;
            }).join('');
        }
    }

    if (tbodyFixos && verif && Array.isArray(verif.registros_fixos)) {
        tbodyFixos.innerHTML = verif.registros_fixos.map((reg) => {
            const hashCurto = (reg.hash_sha512 || '').substring(0, 16) + '…';
            const ilustrativo = reg.origem_base === 'ACERVO_REFERENCIA_ILUSTRATIVO';
            const badgeOrigem = reg.origem_base === 'REGISTRO_FIXO_USUARIO'
                ? '<span class="inpi-badge" style="color:var(--ok);border-color:var(--ok-border);background:var(--ok-soft);">Gravado no Observatório</span>'
                : '<span class="inpi-badge" title="Exemplo didático de produto conhecido — não é registro oficial do INPI">Acervo ilustrativo</span>';
            const resumo = (reg.resumo_tecnico || '').length > 95 ? reg.resumo_tecnico.substring(0, 95) + '…' : (reg.resumo_tecnico || '');
            return `
                <tr>
                    <td>${badgeOrigem}<br><strong>${e(reg.protocolo_registro)}</strong></td>
                    <td><strong>${e(reg.nome_criacao_marca)}</strong><span class="muted">${e(resumo)}</span></td>
                    <td>${e(reg.titular_nome)}<span class="muted">${ilustrativo ? '' : 'Doc.: ' + e(reg.titular_documento)}</span></td>
                    <td>${e(reg.modalidade_protecao)}</td>
                    <td><span class="mono small">${e(hashCurto)}</span><span class="muted">${e(reg.data_registro || (ilustrativo ? 'Sem data oficial' : ''))}</span></td>
                </tr>
            `;
        }).join('');
    }
}

// Ação do Botão Principal: Reivindicar e Fixar Titularidade da Criação no Banco de Dados
async function registrarTitularidadeFixaUsuario() {
    // Grava exatamente o que foi verificado (e não o que estiver no formulário depois)
    const dados = ultimoProjetoAvaliado || coletarDadosFormularioAtual();
    ultimoProjetoAvaliado = dados;
    // Mantém os ids salvos no banco (projeto/diagnóstico) para ligar a prova de autoria ao projeto
    const idsSalvos = ultimoDiagnostico ? { projeto_id: ultimoDiagnostico.projeto_id, diagnostico_id: ultimoDiagnostico.diagnostico_id } : {};
    ultimoDiagnostico = Object.assign(motorDecisaoLocal(dados), idsSalvos);

    const resultado = await verificarExistenciaLocalEApi(dados, ultimoDiagnostico, 'REGISTRAR');
    renderizarPainelVerificacaoExistencia(resultado);

    if (resultado.bloqueado || !resultado.pode_registrar_como_seu) {
        atualizarBalaoMascote(
            'Gravação bloqueada',
            'Este projeto ou nome já está gravado por outro titular',
            `Colisão com <strong>${resultado.bloqueio_terceiro ? escaparHtml(resultado.bloqueio_terceiro.nome_criacao_marca) : 'um item da base'}</strong>. Para gravar, use um nome próprio e descreva o que o seu projeto tem de diferente.`
        );
        const cardVerif = document.getElementById('card-verificacao-anterioridade-titularidade');
        if (cardVerif) cardVerif.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
    }

    if (perfilAcessoAtual === 'USUARIO') {
        etapaAbaLiberadaUsuario = 3;
        aplicarRegrasDePerfilNaInterface();
    }
    // Mantém o resultado da busca mundial já feita (sem ele o veredito voltaria a "nenhum parecido")
    renderizarRelatorioDiagnostico(dados, ultimoDiagnostico, resultado, ultimoResultadoMundial);
    gerarMinutaAutomatizada('CERTIFICADO_TITULARIDADE');
    atualizarBalaoMascote(
        'Prova de autoria gravada',
        `Protocolo interno: ${resultado.registro_gravado ? escaparHtml(resultado.registro_gravado.protocolo_registro) : '—'}`,
        'O projeto foi gravado no Observatório com o seu CPF/CNPJ e o hash SHA-512. Baixe o certificado pelo botão do relatório. Lembre-se: o registro oficial só acontece no INPI.'
    );
}

// Gera a Classificação Internacional de Patentes (CIP/IPC), a Reivindicação Independente nº 1 (Art. 24 e 25 LPI)
// e a Matriz de Correlação Componente de Engenharia IoT/Hardware <-> Artigo Exato de Lei
function gerarCorrelacaoPatentariaReal(dados, diag) {
    // 1. Classe CIP / IPC (padrão OMPI/INPI) — regras por área técnica em assets/js/vocabulario.js.
    //    Cada área soma pontos pelos padrões encontrados; as áreas mais fortes definem a classe principal.
    const textoContexto = ` ${normalizarTextoComparacaoJS(`${dados.nome_projeto} ${dados.resumo_tecnico} ${dados.palavras_chave_extra || ''}`)} `;
    const areasCip = REGRAS_CIP
        .map(regra => ({ regra, pontos: regra.peso * regra.padroes.filter(re => re.test(textoContexto)).length }))
        .filter(a => a.pontos > 0)
        .sort((a, b) => b.pontos - a.pontos);
    const codigosCip = [];
    areasCip.slice(0, 3).forEach((a, i) => {
        // Área principal: até 2 códigos; demais áreas: o código principal de cada uma
        a.regra.codigos.slice(0, i === 0 ? 2 : 1).forEach(c => { if (!codigosCip.includes(c)) codigosCip.push(c); });
    });
    if (dados.possui_topografia_chip && !codigosCip.some(c => c.startsWith('H01L'))) {
        codigosCip.push('H01L 27/02 (Circuitos integrados em silício)');
    }
    if (codigosCip.length === 0) {
        codigosCip.push('G05B 19/042 (Controle por microcontrolador com sensores e atuadores)');
        codigosCip.push('H05K 1/02 (Detalhes construtivos de placas de circuito impresso — PCB)');
    }

    // 2. Construir a Minuta de Reivindicação Independente nº 1 (Art. 24 e 25 da LPI + IN INPI nº 30/2013)
    const divulgacao = dados.divulgacao_previa || 'SIGILO_MANTIDO';
    let tituloQuadroPatentario = '';
    let explicacaoArt10V = '';
    let textoReivindicacao1 = '';

    if (divulgacao === 'DIVULGADO_MAIS_12M') {
        tituloQuadroPatentario = 'Impedimento de Patente por Expiração do Período de Graça (Art. 11 e Art. 12 da Lei nº 9.279/96)';
        explicacaoArt10V = 'Como a arquitetura técnica foi divulgada há mais de 12 meses, ela ingressou definitivamente no <strong>Estado da Técnica (Art. 11, § 1º da LPI)</strong>, extinguindo o requisito de novidade absoluta exigido pelo Art. 8º da LPI. Embora não seja mais possível reivindicar monopólio patentário próprio, essa divulgação atua como <strong>Publicação Defensiva</strong> (impedindo que concorrentes patenteiem seu hardware). Sua proteção jurídica real recai sobre o <strong>Registro de Marca (Art. 129 da LPI)</strong> e o <strong>Direito Autoral do Firmware (Art. 2º da Lei 9.609/98)</strong>.';
        textoReivindicacao1 = `NOTA TÉCNICA DO MOTOR: Pedido de Patente (PI/MU) bloqueado pelo Art. 11 da Lei nº 9.279/96 (divulgação anterior > 12 meses). O ativo "${dados.nome_projeto}" encontra-se protegido contra apropriação patentária por terceiros (efeito de Estado da Técnica), devendo ser depositado no INPI exclusivamente via e-Marcas (Art. 129 LPI) e e-Software (Hash SHA-512 — Lei 9.609/98).`;
    } else if (dados.grau_novidade_hardware === 'INEDITO_INVENTIVO') {
        tituloQuadroPatentario = 'Como Patentear Seu Sistema IoT/Hardware sem Esbarrar na Vedação de Software (Art. 8º e Art. 10, V da LPI + Resolução INPI nº 158/2016)';
        explicacaoArt10V = `Muitos engenheiros de computação perdem patentes no INPI porque redigem o pedido focando no "código-fonte ou aplicativo", o que sofre indeferimento imediato pelo <strong>Art. 10, inciso V da Lei nº 9.279/96</strong> (que proíbe patentes para <em>"programas de computador em si"</em>). Contudo, segundo a <strong>Resolução INPI/PR nº 158/2016</strong> e a <strong>Instrução Normativa INPI nº 30/2013</strong>, quando o seu firmware embarcado (${dados.linguagem_firmware}) processa grandezas físicas reais de sensores na PCB e comanda transdutores/atuadores ou otimiza o transceptor de rádio, ele produz um <strong>efeito técnico físico concreto</strong>. Nesse caso, protege-se o código-fonte pelo Direito Autoral (Lei 9.609/98) e reivindica-se a <strong>Patente de Invenção (Art. 8º da LPI)</strong> como <em>"Sistema Físico Embarcado e Processo de Controle..."</em> redigido com a cláusula obrigatória <strong>"CARACTERIZADO POR" (Art. 25 da LPI)</strong>:`;
        textoReivindicacao1 = `REIVINDICAÇÃO INDEPENDENTE Nº 1 (Minuta conforme Art. 24 e Art. 25 da Lei nº 9.279/96 e IN INPI nº 30/2013):
"1. SISTEMA ELETRÔNICO EMBARCADO E PROCESSO DE MONITORAMENTO E CONTROLE FÍSICO (${dados.nome_projeto.toUpperCase()}), compreendendo uma placa de circuito impresso (PCB) dotada de unidade de processamento microcontrolada, interface de condicionamento de sinais conectada a elementos sensores/transdutores físicos e estágio de comunicação de dados (${dados.conectividade_iot_rf === 'SEM_RF_CABEADO' ? 'barramento físico cabeado' : 'transceptor de radiofrequência IoT'}), CARACTERIZADO POR a referida unidade de processamento operar em malha fechada físico-lógica segundo a arquitetura descrita (${dados.resumo_tecnico.replace(/\s+/g, ' ').trim()}), na qual os sinais elétricos brutos capturados pelos sensores são convertidos, filtrados em memória não volátil e transformados em sinais físicos de atuação/modulação técnica, produzindo efeito técnico mensurável de otimização energética e operacional no dispositivo físico."`;
    } else if (dados.grau_novidade_hardware === 'MELHORIA_FUNCIONAL') {
        tituloQuadroPatentario = 'Enquadramento como Patente de Modelo de Utilidade — Nova Forma ou Disposição Construtiva (Art. 9º e Art. 25 da LPI)';
        explicacaoArt10V = `Como o seu projeto introduz um novo arranjo espacial/construtivo na placa de circuito impresso, sonda ou gabinete eletromecânico que resulta em <strong>melhoria funcional no seu uso ou na sua fabricação</strong>, o caminho jurídico exato no INPI é o <strong>Modelo de Utilidade (Art. 9º da Lei nº 9.279/96 — vigência de 15 anos)</strong>. Importante: pelo Art. 9º da LPI, o Modelo de Utilidade protege apenas a disposição tridimensional/construtiva do objeto físico (não abrangendo processos de software, os quais ficam protegidos separadamente pela Lei nº 9.609/98).`;
        textoReivindicacao1 = `REIVINDICAÇÃO ÚNICA DE MODELO DE UTILIDADE (Minuta conforme Art. 9º, Art. 24 e Art. 25 da Lei nº 9.279/96):
"1. DISPOSIÇÃO CONSTRUTIVA INTRODUZIDA EM DISPOSITIVO ELETRÔNICO EMBARCADO (${dados.nome_projeto.toUpperCase()}), constituída por um conjunto eletromecânico integrando placa de circuito impresso (PCB), conectores de sensoriamento e invólucro estrutural, CARACTERIZADA POR apresentar arranjo geométrico e topológico integrado (${dados.resumo_tecnico.replace(/\s+/g, ' ').trim()}), configurando melhoria funcional prática na montagem, dissipação térmica, acoplamento físico dos sensores e manutenção em campo."`;
    } else {
        tituloQuadroPatentario = 'Diagnóstico de Barreira Patentária: Integração de Módulos Comerciais COTS (Art. 8º, Art. 10, V e VIII da LPI)';
        explicacaoArt10V = `Na engenharia de computação, conectar módulos comerciais prontos de prateleira (como um kit Arduino/ESP32 ligado por jumpers a sensores comerciais sem circuito inédito ou sem novo efeito físico resultante) configura <strong>justaposição de meios conhecidos sem atividade inventiva (Art. 8º e Art. 13 da LPI)</strong>, enquanto a lógica puramente abstrata do programa esbarra no <strong>Art. 10, inciso V da LPI</strong>. Tentar depositar patente neste cenário geraria gasto financeiro e indeferimento no exame técnico do INPI. A blindagem jurídica real e eficaz para o seu produto concentra-se no <strong>Registro do Código-Fonte no e-Software (Lei 9.609/98)</strong>, no <strong>Registro da Marca no e-Marcas (Art. 129 da LPI)</strong> e, se houver gabinete próprio, no <strong>Desenho Industrial (Art. 94 da LPI)</strong>.`;
        textoReivindicacao1 = `RECOMENDAÇÃO TÉCNICO-JURÍDICA: Não protocolar pedido de patente (PI/MU) para evitar indeferimento por ausência de atividade inventiva (Art. 8º e 13 da LPI) e vedação a software em si (Art. 10, V da LPI). Proteger imediatamente: (1) Código-fonte em ${dados.linguagem_firmware} via Hash SHA-512 (Lei 9.609/98); (2) Marca nominativa/mista (Art. 129 da LPI); e (3) Segredo Industrial sobre parâmetros de calibração (Art. 195, XI da LPI).`;
    }

    // 3. Construir as linhas da Tabela de Correlação Direta (Engenharia IoT/Hardware <-> Artigos Exatos de Lei)
    const linhasCorrelacao = [];

    linhasCorrelacao.push({
        elemento: `<strong>1. Arquitetura Eletromecânica e Processo Físico Embarcado (Camada F)</strong><br><span style="font-size:0.82rem;color:var(--text-secondary);">Sensores, condicionamento de sinal, atuadores e efeito técnico físico</span>`,
        protecao: divulgacao === 'DIVULGADO_MAIS_12M'
            ? 'Domínio Público / Estado da Técnica (Protegido contra patentes de terceiros)'
            : (dados.grau_novidade_hardware === 'INEDITO_INVENTIVO'
                ? '<strong>Patenteável como Invenção (PI — 20 anos)</strong>: sistema físico + processo embarcado com efeito técnico'
                : (dados.grau_novidade_hardware === 'MELHORIA_FUNCIONAL'
                    ? '<strong>Patenteável como Modelo de Utilidade (MU — 15 anos)</strong>: nova disposição construtiva funcional'
                    : '<strong>Não patenteável (Módulos COTS)</strong>: ausência de atividade inventiva física')),
        base_legal: `<strong>Lei nº 9.279/96 (LPI):</strong> Arts. 8º, 9º, 11, 12, 13, 24, 25 e 40<br><strong>Resolução INPI/PR nº 158/2016</strong> (Exame de Invenções Implementadas por Software em Hardware)<br><strong>IN INPI nº 30/2013</strong>`,
        providencia: divulgacao === 'DIVULGADO_MENOS_12M'
            ? 'Protocolar no <strong>e-Patentes</strong> imediatamente invocando o <strong>Período de Graça (Art. 12 da LPI)</strong> com provas da 1ª divulgação.'
            : (dados.grau_novidade_hardware === 'MODULOS_PRONTOS_COTS' || divulgacao === 'DIVULGADO_MAIS_12M'
                ? 'Economizar taxas de patente e formalizar <strong>Publicação Defensiva (Art. 11 LPI)</strong> para impedir bloqueio por concorrentes.'
                : 'Redigir Relatório Descritivo com suficiência descritiva (<strong>Art. 24 LPI</strong>) e Reivindicações com <em>"Caracterizado por..."</em> (<strong>Art. 25 LPI</strong>).')
    });

    linhasCorrelacao.push({
        elemento: `<strong>2. Código-Fonte do Firmware, Drivers e Lógica IoT (Camada E)</strong><br><span style="font-size:0.82rem;color:var(--text-secondary);">Desenvolvido em ${dados.linguagem_firmware} (${dados.vinculacao_firmware === 'ESTATICA_MONOLITICA' ? 'Binário Monolítico Flash' : 'Linkedição Dinâmica SO'})</span>`,
        protecao: `<strong>Vedada patente para o código "em si"</strong> (Art. 10, V da LPI), mas <strong>100% protegido por Direito Autoral de Software por 50 anos</strong> contra cópia literal ou descompilação ilícita.`,
        base_legal: `<strong>Lei nº 9.279/96:</strong> Art. 10, inciso V<br><strong>Lei nº 9.609/98 (Lei do Software):</strong> Art. 2º, § 2º (50 anos), Art. 3º (Hash INPI), Art. 4º (Titularidade), Art. 6º, III e Art. 9º<br><strong>Lei nº 9.610/98 (LDA):</strong> Art. 7º, XII`,
        providencia: `Gerar resumo criptográfico <strong>Hash SHA-512</strong> dos arquivos-fonte (<code>.c/.cpp/.h/.py</code>) e depositar no sistema <strong>e-Software do INPI</strong> (valor da retribuição: conferir a tabela vigente do INPI em gov.br/inpi — o registro serve como prova de autoria). Regime recomendado: <strong>${diag.licenca_sw_recomendada}</strong>.`
    });

    linhasCorrelacao.push({
        elemento: `<strong>3. Desenho de Esquemático Elétrico, Layout de PCB e Gerbers (Camada A)</strong><br><span style="font-size:0.82rem;color:var(--text-secondary);">Arquivos CAD de roteamento de trilhas, máscara de solda e documentação técnica</span>`,
        protecao: `<strong>Proteção Autoral sobre a expressão gráfica do desenho</strong> (impede fotocópia/clonagem literal do arquivo Gerber), mas <strong>não impede engenharia reversa limpa</strong> da função elétrica se não houver patente na Camada F.`,
        base_legal: `<strong>Lei nº 9.610/98 (LDA):</strong> Art. 7º, inciso X (projetos, esboços e obras plásticas concernentes à engenharia e topografia)<br><strong>Licenciamento Contratual:</strong> ${diag.licenca_hw_recomendada}`,
        providencia: dados.modelo_negocio === 'COMERCIAL_FECHADO'
            ? 'Manter arquivos editáveis e Gerbers sob <strong>Segredo Industrial (Art. 195, XI da LPI)</strong> com cláusula de confidencialidade (NDA) junto à fábrica montadora de PCB.'
            : 'Publicar esquemáticos sob licença <strong>CERN-OHL v2 / OSHWA</strong> exigindo remoção da sua Marca Oficial em placas fabricadas por terceiros.'
    });

    const mapaAnatel = {
        MODULO_RF_HOMOLOGADO: {
            prot: '<strong>Comercialização condicionada à Homologação de RF</strong>: uso de módulo pré-certificado (ex: ESP32/LoRa com selo ANATEL) permite aproveitamento de ensaios de RF.',
            lei: '<strong>Lei nº 9.472/1997 (Lei Geral de Telecomunicações):</strong> Art. 162 (vedação de uso/comercialização de emissor RF sem certificação)<br><strong>Resolução ANATEL nº 715/2019</strong> e <strong>Ato nº 14448/2017</strong> (Radiação Restrita: Wi-Fi, BLE, LoRa 915MHz)',
            acao: 'Incluir na serigrafia da PCB ou etiqueta externa do gabinete a expressão <em>"Contém módulo homologado pela ANATEL sob nº HHHHH-AA-FFFFF"</em> e verificar ensaios de EMC/Segurança do produto final.'
        },
        TRANSCEPTOR_RF_CUSTOM: {
            prot: '<strong>Obrigatoriedade Crítica de Certificação Completa de RF</strong>: circuito de rádio/antena discretos na PCB exige homologação própria antes de qualquer venda ou operação comercial em campo.',
            lei: '<strong>Lei nº 9.472/1997 (LGT):</strong> Art. 162 e Art. 173<br><strong>Resolução ANATEL nº 715/2019</strong> (Avaliação da Conformidade e Homologação)<br><strong>Ato ANATEL nº 14448/2017</strong> (Limites de potência EIRP e faixa ISM 915MHz / 2.4GHz)',
            acao: 'Contratar Organismo de Certificação Designado (OCD) e laboratório acreditado pelo INMETRO para ensaios de espectro, emissões espúrias, SAR e compatibilidade eletromagnética (CISPR).'
        },
        SEM_RF_CABEADO: {
            prot: '<strong>Dispensado de Homologação de Radiofrequência</strong> (ausência de transceptor radiante intencional).',
            lei: '<strong>Lei nº 9.472/1997:</strong> Art. 162 (Inaplicável por ausência de emissão RF)<br><strong>Código de Defesa do Consumidor (Lei nº 8.078/90):</strong> Arts. 8º, 12 e 39, VIII (normas técnicas ABNT/IEC)',
            acao: 'Manter documentação de isolamento elétrico e compatibilidade eletromagnética para operação segura em barramento cabeado.'
        }
    };
    const infoAnatel = mapaAnatel[dados.conectividade_iot_rf || 'MODULO_RF_HOMOLOGADO'];
    linhasCorrelacao.push({
        elemento: `<strong>4. Transceptor de Radiofrequência e Conectividade IoT</strong><br><span style="font-size:0.82rem;color:var(--text-secondary);">Módulo sem fio, antena na PCB e protocolo de comunicação</span>`,
        protecao: infoAnatel.prot,
        base_legal: infoAnatel.lei,
        providencia: infoAnatel.acao
    });

    const mapaLgpd = {
        DADOS_AMBIENTAIS_MAQUINA: {
            prot: '<strong>Tutelado como Segredo Industrial e Know-How Técnico</strong>: grandezas puramente físicas/ambientais não constituem dado pessoal, mas compõem ativo estratégico do negócio.',
            lei: '<strong>Lei nº 9.279/96 (LPI):</strong> Art. 195, inciso XI (crime de concorrência desleal por divulgação/exploração de dados confidenciais ou testes)<br><strong>Marco Civil da Internet (Lei nº 12.965/14)</strong>',
            acao: 'Implementar autenticação de dispositivo (chaves simétricas LoRaWAN AppKey / TLS no MQTT) e incluir cláusula de titularidade sobre o banco de telemetria nos contratos do projeto.'
        },
        DADOS_PESSOAIS_IOT: {
            prot: '<strong>Regime Obrigatório de Proteção de Dados Pessoais em IoT</strong>: coleta de localização, hábitos residenciais, voz, imagem ou identificadores vinculáveis a pessoa natural.',
            lei: '<strong>Lei nº 13.709/2018 (LGPD):</strong> Art. 5º, I (dado pessoal), Art. 6º (princípios da finalidade e necessidade), Art. 7º (bases legais) e <strong>Art. 46, § 2º (Privacy by Design desde a concepção do produto)</strong>',
            acao: 'Embarcar criptografia TLS 1.3 / AES-128 no microcontrolador, impedir senhas padrão de fábrica, anonimizar telemetria na borda e disponibilizar Termo de Privacidade ao usuário.'
        },
        DADOS_BIOMETRICOS_SAUDE: {
            prot: '<strong>Regime Estrito de Dado Pessoal Sensível + Regulação Sanitária de Dispositivo Médico (IoMT)</strong>: sinais vitais, biometria e apoio diagnóstico.',
            lei: '<strong>Lei nº 13.709/2018 (LGPD):</strong> Art. 5º, II e <strong>Art. 11</strong> (tratamento de dados sensíveis de saúde/biometria) e Art. 46<br><strong>ANVISA RDC nº 751/2022</strong> (Dispositivos Médicos) e <strong>RDC nº 657/2022</strong> (Software como Dispositivo Médico — SaMD)',
            acao: 'Implementar criptografia em repouso na Flash e em trânsito, exigir consentimento destacado (Art. 11, I LGPD) ou tutela da saúde (Art. 11, II, f) e classificar o risco sanitário (Classes I a IV) na ANVISA.'
        }
    };
    const infoLgpd = mapaLgpd[dados.telemetria_dados_iot || 'DADOS_AMBIENTAIS_MAQUINA'];
    linhasCorrelacao.push({
        elemento: `<strong>5. Coleta de Telemetria pelos Sensores Físicos e Segurança Embarcada</strong><br><span style="font-size:0.82rem;color:var(--text-secondary);">Fluxo de dados do sensor físico até o broker/nuvem</span>`,
        protecao: infoLgpd.prot,
        base_legal: infoLgpd.lei,
        providencia: infoLgpd.acao
    });

    linhasCorrelacao.push({
        elemento: `<strong>6. Invólucro Físico Externo (Camada B) e Silício / Semicondutores (Camada C)</strong><br><span style="font-size:0.82rem;color:var(--text-secondary);">Gabinete 3D/injetado e topografia de circuitos integrados</span>`,
        protecao: `${dados.possui_design_externo_novo ? '<strong>Desenho Industrial Registrável (10 a 25 anos)</strong> sobre a configuração plástica ornamental externa.' : 'Sem pedido de Desenho Industrial (gabinete padrão).'} ${dados.possui_topografia_chip ? '<br><strong>Topografia de Circuito Integrado Registrável (10 anos)</strong> sobre máscaras 3D de silício.' : ''}`,
        base_legal: `<strong>Lei nº 9.279/96 (LPI):</strong> Arts. 94 a 121 (Desenho Industrial) e Art. 195, III (repressão à violação de <em>trade dress</em>)<br><strong>Lei nº 11.484/2007:</strong> Arts. 26 e seguintes (Topografia de CI e incentivos fiscais do PADIS)`,
        providencia: dados.possui_design_externo_novo || dados.possui_topografia_chip
            ? 'Depositar vistas ortogonais/perspectivas do gabinete no <strong>e-Desenho Industrial</strong> e/ou arquivos GDSII no <strong>e-Chip (INPI)</strong>.'
            : 'Caso desenvolva carenagem personalizada no futuro, depositar Desenho Industrial antes da comercialização para bloquear clones visuais.'
    });

    linhasCorrelacao.push({
        elemento: `<strong>7. Identidade Comercial (Camada D) e Titularidade Jurídica do Projeto</strong><br><span style="font-size:0.82rem;color:var(--text-secondary);">Marca "${dados.nome_projeto.split('—')[0].trim()}" e relação entre criadores/instituição</span>`,
        protecao: `<strong>Exclusividade Nacional sobre o Nome e Logotipo (10 anos renováveis indefinidamente)</strong>. Em projetos de hardware aberto, é o único ativo que impede clones de usarem o nome oficial.`,
        base_legal: `<strong>Lei nº 9.279/96 (LPI):</strong> Art. 129 (sistema atributivo de marca), Art. 189 (crime contra registro de marca), Arts. 6º e 88 a 93 (titularidade)<br><strong>Lei nº 10.973/2004:</strong> Arts. 6º, 11 e 16 (NIT/ICT)<br><strong>Lei nº 9.609/98:</strong> Art. 4º`,
        providencia: `Protocolar pedido no <strong>e-Marcas (Classe NCL 9 — Aparelhos científicos, sensores e controladores eletrônicos)</strong> e clicar em <strong>"Gravar prova de autoria"</strong> no relatório.`
    });

    return {
        codigos_cip: codigosCip,
        titulo_quadro_patentario: tituloQuadroPatentario,
        explicacao_art10v: explicacaoArt10V,
        texto_reivindicacao_1: textoReivindicacao1,
        linhas_correlacao: linhasCorrelacao
    };
}

// =========================================================================
// CONTROLE DO FLUXO GUIADO EM ETAPAS (BLOCO 1 -> BLOCO 2 -> BLOCO 3)
// =========================================================================

function entrarComoUsuario() {
    perfilAcessoAtual = 'USUARIO';
    blocoAtualUsuario = 1;
    etapaAbaLiberadaUsuario = 1;

    const conteudoSistema = document.getElementById('conteudo-sistema-principal');
    if (conteudoSistema) conteudoSistema.style.display = 'block';

    limparFormularioCompleto();
    aplicarRegrasDePerfilNaInterface();
    alternarAba('aba-diagnostico');

    atualizarBalaoMascote(
        'Etapa 1 de 2 — Identificação',
        'Preencha seus dados para começar.',
        'Depois você descreve o projeto e o sistema faz a busca.'
    );
}

function validarEmailRigido(email) {
    if (!email || typeof email !== 'string') return false;
    const limpo = email.trim();
    if (!limpo.includes('@')) return false;
    // Exige no mínimo 2 caracteres antes do @, domínio com pelo menos 2 caracteres e extensão (ex: .com, .br)
    const regexEmail = /^[a-zA-Z0-9._%+-]{2,}@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/;
    if (!regexEmail.test(limpo)) return false;
    const regexInadequadoEmail = /(teste|asdf|qwerty|merda|porra|caralho|bosta|qualquer|blablabla)/i;
    if (regexInadequadoEmail.test(limpo.split('@')[0])) return false;
    return true;
}

// 52998224725 → 529.982.247-25 ; 11222333000181 → 11.222.333/0001-81
function formatarDocumento(doc) {
    const d = String(doc || '').replace(/\D/g, '');
    if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    return String(doc || '');
}

function validarDocumentoCpfCnpjRigido(doc) {
    if (!doc || typeof doc !== 'string') return false;
    const apenasDigitos = doc.replace(/\D/g, '');
    // Aceita exatamente 11 dígitos (CPF) ou 14 dígitos (CNPJ) e bloqueia sequências repetidas (ex: 111.111.111-11)
    if (apenasDigitos.length !== 11 && apenasDigitos.length !== 14) return false;
    if (/^(\d)\1+$/.test(apenasDigitos)) return false;
    return true;
}

function avancarBlocoUsuario(numeroBlocoDestino) {
    // Validação rigorosa antes de liberar o Bloco 2
    if (numeroBlocoDestino === 2) {
        const autorNome = document.getElementById('autor_nome').value.trim();
        const autorDoc = document.getElementById('autor_documento').value.trim();
        const autorEmail = document.getElementById('autor_email').value.trim();
        const nomeProj = document.getElementById('nome_projeto').value.trim();

        if (!nomeProj || !autorNome || !autorDoc || !autorEmail) {
            alert('Preencha todos os campos para continuar:\n\n• Nome do projeto ou marca\n• Seu nome completo ou da equipe\n• CPF ou CNPJ\n• E-mail');
            if (!nomeProj) document.getElementById('nome_projeto').focus();
            else if (!autorNome) document.getElementById('autor_nome').focus();
            else if (!autorDoc) document.getElementById('autor_documento').focus();
            else document.getElementById('autor_email').focus();
            return;
        }

        const regexInadequadoB1 = /\b(merda|porra|caralho|cacete|foda|foder|puta|viado|bosta|cuzao|babaca|idiota|imbecil|otario|arrombado|desgraca|inferno|pinto|piroca|buceta|besteira|zoeira|zuera|qualquer coisa|blablabla|huehue|asdf|qwerty|teste|testando)\b/i;
        const projNormB1 = normalizarTextoComparacaoJS(nomeProj);
        const autorNormB1 = normalizarTextoComparacaoJS(autorNome);

        if (nomeProj.length < 5 || !/[aeiou]/i.test(projNormB1) || /(.)\1{3,}/i.test(projNormB1) || /[bcdfghjklmnpqrstvwxz]{6,}/i.test(projNormB1) || regexInadequadoB1.test(projNormB1)) {
            alert('Nome do projeto inválido.\n\nUse um nome real com pelo menos 5 caracteres, sem letras repetidas, palavras de teste ou termos inadequados.');
            document.getElementById('nome_projeto').focus();
            return;
        }

        if (autorNome.length < 5 || !/[aeiou]/i.test(autorNormB1) || /(.)\1{3,}/i.test(autorNormB1) || /[bcdfghjklmnpqrstvwxz]{6,}/i.test(autorNormB1) || regexInadequadoB1.test(autorNormB1)) {
            alert('Nome do titular inválido.\n\nInforme o nome completo (ou da equipe) com pelo menos 5 caracteres, sem palavras de teste, termos inadequados ou letras aleatórias.');
            document.getElementById('autor_nome').focus();
            return;
        }

        if (!validarDocumentoCpfCnpjRigido(autorDoc)) {
            alert('CPF ou CNPJ inválido.\n\nInforme 11 dígitos (CPF) ou 14 dígitos (CNPJ). Números repetidos, como 111.111.111-11, não são aceitos.');
            document.getElementById('autor_documento').focus();
            return;
        }

        if (!validarEmailRigido(autorEmail)) {
            alert('E-mail inválido.\n\nInforme um e-mail completo, por exemplo: seu.nome@dominio.com.br');
            document.getElementById('autor_email').focus();
            return;
        }
    }

    // Validação rigorosa antes de liberar o Bloco 3
    if (numeroBlocoDestino === 3) {
        const relato = document.getElementById('relato_livre_usuario').value.trim();
        const nomeProj = document.getElementById('nome_projeto').value.trim();
        if (!relato) {
            alert('Descreva o projeto antes de continuar.');
            document.getElementById('relato_livre_usuario').focus();
            return;
        }
        const validacao = validarSuficienciaDescritivaProjeto(relato, nomeProj);
        if (!validacao.valido) {
            alert(`A descrição ainda não está completa.\n\n${validacao.motivo}\n\n${validacao.orientacao}`);
            document.getElementById('relato_livre_usuario').focus();
            interpretarRelatoLivre(false, true);
            return;
        }
        autoMarcarEnquantoDigita();
    }

    blocoAtualUsuario = numeroBlocoDestino;
    atualizarVisibilidadeBlocosUsuario();

    if (numeroBlocoDestino === 1) {
        atualizarBalaoMascote(
            'Etapa 1 de 2 — Identificação',
            'Confira seus dados.',
            'Nome do projeto, titular, CPF/CNPJ e e-mail aparecem no certificado de autoria.'
        );
    } else if (numeroBlocoDestino === 2) {
        atualizarBalaoMascote(
            'Etapa 1 de 2 — Descrição',
            'Agora descreva o seu projeto.',
            'Conte o que ele faz e com quais peças. Quando os 4 itens estiverem marcados, clique em <strong>Verificar se já existe</strong>.'
        );
    }

    const cardPrincipal = document.getElementById('aba-diagnostico');
    if (cardPrincipal) cardPrincipal.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Permite encerrar a varredura antes do fim, usando apenas os resultados já recebidos
let varreduraInterrompida = false;
function acelerarAuditoriaParaFim() {
    varreduraInterrompida = true;
    const btn = document.getElementById('btn-acelerar-auditoria');
    if (btn) {
        btn.textContent = 'Encerrando…';
        btn.style.opacity = '0.5';
        btn.disabled = true;
    }
}

// ============================================================================
// VERIFICAÇÃO DO BLOCO 2 — A BARRA DE PROGRESSO ACOMPANHA AS CONSULTAS REAIS
// (a duração depende do rigor escolhido e do tempo de resposta das APIs)
// ============================================================================
async function iniciarVerificacaoPorcentagemBloco2() {
    varreduraInterrompida = false;
    const btnEncerrar = document.getElementById('btn-acelerar-auditoria');
    if (btnEncerrar) {
        btnEncerrar.textContent = 'Encerrar e ver resultados';
        btnEncerrar.style.opacity = '1';
        btnEncerrar.disabled = false;
    }

    // 1. Validação dos dados do Bloco 1 (sem preenchimento automático com dados fictícios)
    const nomeEl = document.getElementById('nome_projeto');
    const autorNomeEl = document.getElementById('autor_nome');
    const autorDocEl = document.getElementById('autor_documento');
    const autorEmailEl = document.getElementById('autor_email');

    const nomeProj = (nomeEl ? nomeEl.value : '').trim();
    const autorNome = (autorNomeEl ? autorNomeEl.value : '').trim();
    const autorDoc = (autorDocEl ? autorDocEl.value : '').trim();
    const autorEmail = (autorEmailEl ? autorEmailEl.value : '').trim();

    const pendencias = [];
    if (nomeProj.length < 5) pendencias.push({ el: nomeEl, msg: 'Nome do projeto (mínimo de 5 caracteres)' });
    if (autorNome.length < 5) pendencias.push({ el: autorNomeEl, msg: 'Nome do titular (mínimo de 5 caracteres)' });
    if (!validarDocumentoCpfCnpjRigido(autorDoc)) pendencias.push({ el: autorDocEl, msg: 'CPF ou CNPJ válido' });
    if (!validarEmailRigido(autorEmail)) pendencias.push({ el: autorEmailEl, msg: 'E-mail válido' });
    if (pendencias.length > 0) {
        alert('Corrija os dados do titular antes de verificar:\n\n• ' + pendencias.map(p => p.msg).join('\n• ') +
            '\n\nO sistema não preenche esses campos automaticamente, porque eles identificam o titular no certificado.');
        avancarBlocoUsuario(1);
        if (pendencias[0].el) pendencias[0].el.focus();
        return;
    }

    // 2. Validação da descrição obrigatória do Bloco 2
    const relatoEl = document.getElementById('relato_livre_usuario');
    const relato = relatoEl ? relatoEl.value.trim() : '';
    if (!relato || relato.length < 10) {
        alert('Descreva a sua invenção para que a busca tenha termos técnicos.\n\nExemplo: Pulseira com acelerômetro que detecta queda de idoso e envia alerta sem fio para o celular do cuidador.');
        if (relatoEl) relatoEl.focus();
        return;
    }
    // A descrição precisa cumprir os 4 itens do Art. 24 da LPI (texto real, peças, ação e aplicação)
    const validacaoDescricao = validarSuficienciaDescritivaProjeto(relato, nomeProj);
    if (!validacaoDescricao.valido) {
        alert(`A descrição ainda não está completa.\n\n${validacaoDescricao.motivo}\n\n${validacaoDescricao.orientacao}`);
        interpretarRelatoLivre(false, true);
        if (relatoEl) relatoEl.focus();
        return;
    }

    // 3. Sincronização dos parâmetros com o relato técnico
    autoMarcarEnquantoDigita();
    const dados = coletarDadosFormularioAtual();
    ultimoProjetoAvaliado = dados;
    const rigor = obterNivelRigorSelecionado();

    // 4. Modal de progresso
    const modal = document.getElementById('modal-verificacao-progresso');
    const elNum = document.getElementById('progresso-numero');
    const elFill = document.getElementById('progresso-barra-fill');
    const elMsg = document.getElementById('progresso-etapa-texto');
    const elNomeProj = document.getElementById('progresso-nome-projeto');
    const cronometroEl = document.getElementById('cronometro-decorrido');
    const cronometroEstEl = document.getElementById('cronometro-estimado');
    const terminalEl = document.getElementById('terminal-linhas-log');

    const inicio = Date.now();
    const formatarTempo = ms => {
        const s = Math.max(0, Math.round(ms / 1000));
        return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    };
    // Estimativa: ~2 s por consulta OpenAlex + intervalo obrigatório entre consultas do GitHub
    const estimativaMs = rigor.variantes * (rigor.porBase >= 100 ? 2000 : 2500) + Math.max(0, rigor.variantes - 1) * INTERVALO_ENTRE_CONSULTAS_GITHUB_MS + (rigor.extrasEpo ? 12000 : 3000);

    if (elNomeProj) elNomeProj.textContent = dados.nome_projeto || 'Seu Projeto';
    if (elNum) elNum.textContent = '0';
    if (elFill) elFill.style.width = '0%';
    if (cronometroEl) cronometroEl.textContent = '00:00';
    if (cronometroEstEl) cronometroEstEl.textContent = `~${formatarTempo(estimativaMs)}`;
    if (terminalEl) terminalEl.innerHTML = '';
    if (modal) {
        modal.classList.add('ativo');
        modal.setAttribute('aria-hidden', 'false');
    }

    const log = (msg, tipo = '') => {
        if (!terminalEl) return;
        const div = document.createElement('div');
        div.className = 'terminal-linha ' + tipo;
        div.textContent = `[${formatarTempo(Date.now() - inicio)}] ${msg}`;
        terminalEl.appendChild(div);
        terminalEl.scrollTop = terminalEl.scrollHeight;
    };
    const progresso = (pct, texto) => {
        const v = Math.max(0, Math.min(100, Math.round(pct)));
        if (elNum) elNum.textContent = v;
        if (elFill) elFill.style.width = v + '%';
        if (texto && elMsg) elMsg.textContent = texto;
    };
    const chip = (id, classe, texto) => {
        const badge = document.getElementById(id);
        if (!badge) return;
        badge.className = 'api-badge ' + classe;
        badge.textContent = texto;
        const card = badge.closest('.progresso-api-item');
        if (card) {
            card.classList.toggle('ativa', classe === 'badge-consultando');
            card.classList.toggle('concluida', classe === 'badge-concluido');
        }
    };
    const intervalCronometro = setInterval(() => {
        if (cronometroEl) cronometroEl.textContent = formatarTempo(Date.now() - inicio);
    }, 500);

    chip('chip-status-nlp', 'badge-consultando', 'Processando...');
    chip('chip-status-inpi', 'badge-pendente', 'Aguardando');
    chip('chip-status-openalex', 'badge-pendente', 'Aguardando');
    chip('chip-status-github', 'badge-pendente', 'Aguardando');
    chip('chip-status-googlepatents', 'badge-pendente', 'Aguardando');
    log(`Iniciando verificação — rigor ${rigor.rotulo}: até ${rigor.porBase} resultados por base, ${rigor.variantes} consulta(s) por base.`, 'highlight');

    try {
        // ETAPA 1 (0–10%): extração local de termos e classificação CIP
        progresso(3, 'Extraindo termos técnicos da descrição...');
        const corrPrevia = gerarCorrelacaoPatentariaReal(dados, motorDecisaoLocal(dados));
        const cipCodigo = (corrPrevia.codigos_cip && corrPrevia.codigos_cip[0]) ? corrPrevia.codigos_cip[0].split(' (')[0].trim() : '—';
        const termos = montarTermosDeBusca(dados);
        log(`[LOCAL] Termos em inglês: ${termos.ingles.join(', ') || '—'} | em português: ${termos.portugues.join(', ') || '—'}`);
        log(`[LOCAL] Classe CIP sugerida (regra local, para usar nos links de patentes): ${cipCodigo}`);
        chip('chip-status-nlp', 'badge-concluido', `CIP: ${cipCodigo}`);
        progresso(10, 'Termos extraídos.');

        // ETAPA 2 (10–25%): diagnóstico + comparação com a base local do Observatório
        progresso(12, 'Comparando com a base do Observatório (local)...');
        chip('chip-status-inpi', 'badge-consultando', 'Comparando...');
        let diagnosticoBackend = null;
        try {
            const respDiag = await fetchComTempoLimite('api/diagnostico.php', 8000, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (respDiag.ok) {
                const jsonDiag = await respDiag.json();
                if (jsonDiag && jsonDiag.sucesso) diagnosticoBackend = jsonDiag.diagnostico;
            }
        } catch (e) {}
        ultimoDiagnostico = diagnosticoBackend
            ? Object.assign(motorDecisaoLocal(dados), { projeto_id: diagnosticoBackend.projeto_id, diagnostico_id: diagnosticoBackend.diagnostico_id })
            : motorDecisaoLocal(dados);
        log(diagnosticoBackend ? '[BACKEND] Diagnóstico salvo no banco (PHP).' : '[LOCAL] Backend PHP indisponível — usando o motor local do navegador.');

        let verif = null;
        try {
            verif = await verificarExistenciaLocalEApi(dados, ultimoDiagnostico, 'VERIFICAR');
        } catch (e) {
            verif = null;
        }
        const totalBaseLocal = verif && Array.isArray(verif.registros_fixos) ? verif.registros_fixos.length : 0;
        if (verif && verif.bloqueio_terceiro) {
            chip('chip-status-inpi', 'badge-erro', 'Colisão');
            log(`[OBSERVATÓRIO] Colisão com "${escaparHtml(verif.bloqueio_terceiro.nome_criacao_marca)}" (${verif.bloqueio_terceiro.similaridade_percentual}%).`, 'warn');
        } else if (verif && verif.referencia_conhecida) {
            chip('chip-status-inpi', 'badge-consultando', 'Parecido com produto conhecido');
            log(`[OBSERVATÓRIO] Parecido com o produto de referência "${escaparHtml(verif.referencia_conhecida.nome_criacao_marca)}" (${verif.referencia_conhecida.similaridade_percentual}%). Aviso apenas: não bloqueia a gravação.`, 'warn');
        } else {
            chip('chip-status-inpi', 'badge-concluido', `${totalBaseLocal} itens • sem colisão`);
            log(`[OBSERVATÓRIO] ${totalBaseLocal} itens comparados (registros de usuários + acervo ilustrativo): sem colisão.`, 'success');
        }
        progresso(25, 'Base local verificada. Consultando bases mundiais...');

        // ETAPA 3 (25–95%): consultas reais (OpenAlex + GitHub)
        const totalPassos = Math.max(1, rigor.variantes * 3);
        let passosConcluidos = 0;
        const recebidos = { openalex: 0, github: 0, patentes: 0 };
        const nomesBase = { openalex: 'OPENALEX', github: 'GITHUB', patentes: 'PATENTES-EPO' };
        const chipsBase = { openalex: 'chip-status-openalex', github: 'chip-status-github', patentes: 'chip-status-googlepatents' };
        const resultadoMundial = await buscarEstadoDaTecnicaMundialAoVivo(dados, ultimoDiagnostico, {
            rigor,
            deveInterromper: () => varreduraInterrompida,
            aoProgredir: ev => {
                const nome = nomesBase[ev.base];
                const chipId = chipsBase[ev.base];
                if (ev.fase === 'apenas_link') {
                    passosConcluidos += rigor.variantes; // não haverá consultas de patentes nesta verificação
                    chip(chipId, 'badge-link', 'Apenas link');
                    log(`[${nome}] Não consultado: ${ev.erro}`);
                } else if (ev.fase === 'consultando') {
                    chip(chipId, 'badge-consultando', `Consulta ${ev.indice + 1}/${ev.total}`);
                    log(`[${nome}] Consultando: "${ev.consulta}"`);
                } else if (ev.fase === 'info') {
                    if (ev.recebidos) {
                        recebidos[ev.base] += ev.recebidos;
                        chip(chipId, 'badge-consultando', `${recebidos[ev.base]} recebidos`);
                    }
                    log(`[${nome}] ${ev.mensagem}`, ev.recebidos ? 'success' : undefined);
                    return;
                } else if (ev.fase === 'aguardando') {
                    log(`[GITHUB] Aguardando ${Math.ceil(ev.esperaMs / 1000)} s (limite de 10 consultas/min da API).`);
                } else if (ev.fase === 'ok') {
                    passosConcluidos++;
                    recebidos[ev.base] += ev.recebidos;
                    chip(chipId, 'badge-consultando', `${recebidos[ev.base]} recebidos`);
                    const totalBase = ev.totalNaBase && ev.totalNaBase > ev.recebidos ? ` (de ${ev.totalNaBase.toLocaleString('pt-BR')} encontrados no total)` : '';
                    log(`[${nome}] ${ev.recebidos} resultados recebidos${totalBase}.`, 'success');
                } else {
                    passosConcluidos++;
                    chip(chipId, 'badge-erro', ev.fase === 'limite' ? 'Limite atingido' : 'Indisponível');
                    log(`[${nome}] Falha: ${ev.erro}`, 'warn');
                }
                progresso(25 + 70 * Math.min(1, passosConcluidos / totalPassos), `Consultando bases mundiais (${passosConcluidos}/${totalPassos})...`);
            }
        });

        const st = resultadoMundial.status;
        const textoChip = s => s.estado === 'ok' ? `${s.recebidos} analisados` : (s.estado === 'limite' ? 'Limite atingido' : (s.estado === 'parcial' ? 'Parcial' : 'Indisponível'));
        const classeChip = s => s.estado === 'ok' ? 'badge-concluido' : 'badge-erro';
        chip('chip-status-openalex', classeChip(st.openalex), textoChip(st.openalex));
        chip('chip-status-github', classeChip(st.github), textoChip(st.github));
        if (st.patentes.estado === 'apenas_link') chip('chip-status-googlepatents', 'badge-link', 'Apenas link');
        else chip('chip-status-googlepatents', classeChip(st.patentes), textoChip(st.patentes));
        log(`[RELEVÂNCIA] ${resultadoMundial.totalAnalisados} resultados analisados; ${resultadoMundial.mesmaSolucao.length} com todos os termos principais e ${resultadoMundial.mesmoTema.length} do mesmo tema.`,
            resultadoMundial.totalAchadosMundo > 0 ? 'warn' : 'success');
        if (resultadoMundial.interrompida) log('[USUÁRIO] Busca encerrada antes do fim — o relatório usa apenas o que já foi consultado.', 'warn');

        // ETAPA 4 (95–100%): relatório
        progresso(97, 'Montando o relatório...');
        renderizarRelatorioDiagnostico(dados, ultimoDiagnostico, verif, resultadoMundial);
        renderizarPainelVerificacaoExistencia(verif);
        gerarMinutaAutomatizada('CERTIFICADO_TITULARIDADE');

        etapaAbaLiberadaUsuario = Math.max(etapaAbaLiberadaUsuario, 2);
        if (perfilAcessoAtual === 'USUARIO') aplicarRegrasDePerfilNaInterface();

        progresso(100, '✔ Verificação concluída.');
        log(`[FIM] Verificação concluída em ${formatarTempo(Date.now() - inicio)}.`, 'success');
        clearInterval(intervalCronometro);
        await new Promise(res => setTimeout(res, 900));

        if (modal) {
            modal.classList.remove('ativo');
            modal.setAttribute('aria-hidden', 'true');
        }
        alternarAba('aba-relatorio');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (verif && !verif.pode_registrar_como_seu) {
            atualizarBalaoMascote(
                'Etapa 2 de 2 — Resultado',
                'Há um projeto muito parecido na base do Observatório',
                `O seu projeto é muito semelhante a <strong>${verif.bloqueio_terceiro ? escaparHtml(verif.bloqueio_terceiro.nome_criacao_marca) : 'um item da base'}</strong>. Veja os detalhes no relatório.`
            );
        } else if (resultadoMundial.mesmaSolucao.length > 0) {
            atualizarBalaoMascote(
                'Etapa 2 de 2 — Resultado',
                `${resultadoMundial.mesmaSolucao.length} resultado(s) fazem o mesmo que o seu projeto`,
                'Veja "Os mais parecidos com o seu projeto" e compare com o seu diferencial. Marca e código-fonte continuam protegíveis.'
            );
        } else if (resultadoMundial.totalAchadosMundo > 0) {
            atualizarBalaoMascote(
                'Etapa 2 de 2 — Resultado',
                `${resultadoMundial.totalAchadosMundo} resultado(s) do mesmo tema, nenhum com todos os termos do seu projeto`,
                'Leia a lista em "O que encontramos no mundo" e compare com o seu diferencial. Marca e código-fonte continuam protegíveis.'
            );
        } else {
            atualizarBalaoMascote(
                'Etapa 2 de 2 — Resultado',
                'Nenhum projeto parecido nas bases consultadas',
                `Isso é um bom sinal, mas não garante novidade${resultadoMundial.basesComFalha.length ? ' (alguma base não respondeu por completo)' : ''}. Confira também no pePI/INPI pelos links do relatório.`
            );
        }
    } catch (erro) {
        console.error('Falha na verificação:', erro);
        clearInterval(intervalCronometro);
        log(`[ERRO] ${erro && erro.message ? erro.message : erro}`, 'warn');
        progresso(100, 'A verificação falhou. Feche e tente novamente.');
        if (modal) {
            setTimeout(() => {
                modal.classList.remove('ativo');
                modal.setAttribute('aria-hidden', 'true');
            }, 2500);
        }
        alert('Ocorreu um erro durante a verificação. Tente novamente em alguns instantes.');
    }
}

function atualizarVisibilidadeBlocosUsuario() {
    const b1 = document.getElementById('bloco-form-1');
    const b2 = document.getElementById('bloco-form-2');
    const b3 = document.getElementById('bloco-form-3');
    const ind1 = document.getElementById('indicador-bloco-1');
    const ind2 = document.getElementById('indicador-bloco-2');

    if (b1) b1.style.display = blocoAtualUsuario === 1 ? 'block' : 'none';
    if (b2) b2.style.display = blocoAtualUsuario === 2 ? 'block' : 'none';
    if (b3) b3.style.display = 'none';

    const estilizarIndicador = (el, numero, titulo) => {
        if (!el) return;
        const estado = blocoAtualUsuario === numero ? 'ativo' : (blocoAtualUsuario > numero ? 'concluido' : '');
        el.className = 'step' + (estado ? ' ' + estado : '');
        el.innerHTML = `<span class="step-num">${estado === 'concluido' ? '✓' : numero}</span> ${titulo}`;
    };

    estilizarIndicador(ind1, 1, 'Titular e nome');
    estilizarIndicador(ind2, 2, 'Descrição do projeto');
}

function aplicarRegrasDePerfilNaInterface() {
    const barraEtapas = document.getElementById('barra-etapas-usuario');
    const rodapeB1 = document.getElementById('rodape-bloco-1-usuario');
    const rodapeB2 = document.getElementById('rodape-bloco-2-usuario');
    const btnVoltarB2 = document.getElementById('btn-voltar-bloco-2');
    const gavetaAvancada = document.getElementById('gaveta-parametros-avancados');

    const tab1 = document.querySelector('.tab-btn[data-target="aba-diagnostico"]');
    const tab2 = document.querySelector('.tab-btn[data-target="aba-relatorio"]');

    if (btnVoltarB2) btnVoltarB2.style.display = 'inline-flex';
    if (gavetaAvancada) gavetaAvancada.style.display = 'none';

    if (tab2) {
        tab2.classList.toggle('bloqueada', etapaAbaLiberadaUsuario < 2);
        tab2.title = etapaAbaLiberadaUsuario < 2 ? 'Conclua a verificação na etapa 1' : '';
    }

    atualizarVisibilidadeBlocosUsuario();
}

// Navegação entre abas (com liberação progressiva por etapas)
function alternarAba(abaId) {
    if (abaId === 'aba-relatorio' && etapaAbaLiberadaUsuario < 2) {
        alert('O resultado aparece depois da verificação.\n\nDescreva o projeto e clique em "Verificar se já existe".');
        return;
    }

    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    const painel = document.getElementById(abaId);
    if (painel) painel.classList.add('active');
    document.body.classList.toggle('no-relatorio', abaId === 'aba-relatorio');

    const btn = document.querySelector(`.tab-btn[data-target="${abaId}"]`);
    if (btn) btn.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => window.dispatchEvent(new Event('resize')), 60);
}

// Motor de Decisão fundamentado nas 6 Camadas (A a F), Resolução INPI 158/2016, ANATEL (Lei 9.472/97) e LGPD (Lei 13.709/18)
function motorDecisaoLocal(dados) {
    const recomendacoesInpi = [];
    const alertasLicenca = [];
    const camadasAnalise = [];
    let score = 45;
    let risco = 'NULO';
    const divulgacao = dados.divulgacao_previa || 'SIGILO_MANTIDO';
    const conectividadeRf = dados.conectividade_iot_rf || 'MODULO_RF_HOMOLOGADO';
    const telemetriaIot = dados.telemetria_dados_iot || 'DADOS_AMBIENTAIS_MAQUINA';

    // CAMADA D: SIGNOS DISTINTIVOS (MARCA E LOGOTIPO — Art. 129 e 189 da LPI)
    score += 10;
    recomendacoesInpi.push({
        codigo: 'MARCA',
        titulo: 'Camada D — Registro de Marca e Signo Distintivo (INPI • Classe NCL 9)',
        base_legal: 'Lei nº 9.279/1996 (LPI — Arts. 122, 129, 133 e 189)',
        prioridade: 'Vetor Patrimonial Essencial',
        prazo: '10 anos, prorrogável por períodos iguais e sucessivos (Art. 133 LPI)',
        justificativa: 'Pelo sistema atributivo brasileiro (Art. 129 da LPI), a propriedade e o uso exclusivo do nome comercial decorrem do registro no INPI. Como demonstrado no caso Arduino LLC vs. Arduino SRL (Genuino), mesmo quando o hardware e o software são abertos, a retenção da marca na Classe NCL 9 (aparelhos científicos, sensores e controladores) é o principal instrumento jurídico para impedir contrafação (Art. 189 da LPI).'
    });

    // ANÁLISE DE DIVULGAÇÃO PRÉVIA: PERÍODO DE GRAÇA (ART. 12 LPI) VS. ESTADO DA TÉCNICA (ART. 11 LPI)
    if (divulgacao === 'DIVULGADO_MENOS_12M') {
        alertasLicenca.unshift({
            nivel: 'ATENCAO',
            titulo: 'Alerta Urgente — Período de Graça em Curso (Art. 12 da Lei nº 9.279/1996)',
            descricao: 'Como o projeto já foi divulgado publicamente (YouTube, GitHub, TCC ou feira) há menos de 12 meses, você ainda pode depositar Patente (PI/MU) invocando o Período de Graça (Art. 12 da LPI). Protocolize o pedido no INPI antes de completar 12 meses da primeira divulgação e guarde as provas de que ela foi feita pelo próprio autor. Para Desenho Industrial o prazo é menor: 180 dias (Art. 96, § 3º da LPI).'
        });
    } else if (divulgacao === 'DIVULGADO_MAIS_12M' && dados.grau_novidade_hardware !== 'MODULOS_PRONTOS_COTS') {
        score -= 10;
        alertasLicenca.unshift({
            nivel: 'ATENCAO',
            titulo: 'Perda de Novidade Patentária por Divulgação há Mais de 12 Meses (Art. 11 da LPI)',
            descricao: 'Como o projeto foi divulgado ao público há mais de 12 meses, o prazo do Período de Graça (Art. 12 da LPI) expirou e a solução técnica ingressou definitivamente no Estado da Técnica (Art. 11 da LPI). Isso impede o depósito de Patente própria, mas funciona como Publicação Defensiva (impedindo patentes de concorrentes). Sua proteção deve concentrar-se no Registro de Marca (Camada D) e no Direito Autoral do Firmware (Camada E).'
        });
    }

    // CAMADA F: SOLUÇÃO TÉCNICA (PATENTE PI / MU, Art. 10, V da LPI e Resolução INPI nº 158/2016)
    if (dados.modelo_negocio === 'PUBLICACAO_DEFENSIVA') {
        score += 15;
        alertasLicenca.push({
            nivel: 'INFO',
            titulo: 'Estratégia de Publicação Defensiva e Estado da Técnica (Art. 11 e 12 da LPI)',
            descricao: 'Ao optar pela Publicação Defensiva, a divulgação ampla da documentação técnica converte o projeto em "Estado da Técnica" (Art. 11 da LPI), destruindo o requisito de novidade perante terceiros e criando um escudo jurídico: nenhuma empresa concorrente poderá patentear a solução e cobrar royalties de você no futuro.'
        });
    } else if (divulgacao !== 'DIVULGADO_MAIS_12M' && dados.grau_novidade_hardware === 'INEDITO_INVENTIVO') {
        score += 25;
        recomendacoesInpi.unshift({
            codigo: 'PI',
            titulo: 'Camada F — Patente de Invenção (PI) / Sistema Embarcado com Efeito Técnico Físico',
            base_legal: 'Lei nº 9.279/1996 (Arts. 8º, 24, 25, 40 e Art. 10, V) + Resolução INPI/PR nº 158/2016',
            prioridade: 'Prioridade Primária (Exclusividade Técnica)',
            prazo: '20 anos de vigência',
            justificativa: 'Embora o Art. 10, inciso V, da LPI vede patente para programa de computador "em si", a Resolução INPI nº 158/2016 reconhece a patenteabilidade de sistemas embarcados e processos de controle implementados por software que interajam com o hardware (sensores/atuadores/transceptores) gerando efeito técnico físico concreto.'
        });
    } else if (divulgacao !== 'DIVULGADO_MAIS_12M' && dados.grau_novidade_hardware === 'MELHORIA_FUNCIONAL' && dados.possui_pcb_customizada) {
        score += 15;
        recomendacoesInpi.unshift({
            codigo: 'MU',
            titulo: 'Camada F — Patente de Modelo de Utilidade (MU — Disposição Construtiva)',
            base_legal: 'Lei nº 9.279/1996 (Arts. 9º, 24, 25 e 40) + IN INPI nº 30/2013',
            prioridade: 'Prioridade Primária (Forma Funcional)',
            prazo: '15 anos de vigência',
            justificativa: 'A nova disposição construtiva tridimensional na placa, sonda ou equipamento confere melhoria funcional no uso ou fabricação, atendendo ao requisito de ato inventivo do Art. 9º da LPI.'
        });
    } else {
        camadasAnalise.push({
            camada: 'Camada F • Solução Técnica (Barreira dos Arts. 8º, 10 V e 11 da LPI)',
            status: 'Redirecionamento Estratégico para Marca (Camada D) e Software (Camada E)',
            detalhe: 'Como o circuito baseia-se na agregação de módulos comerciais (COTS) sem novo efeito técnico físico ou já ingressou no estado da técnica (Art. 11 da LPI), não cabe depósito de Patente (PI/MU). A blindagem jurídica deve apoiar-se no Registro de Marca (Art. 129 da LPI) e no registro do código-fonte (Lei 9.609/98).'
        });
    }

    // CAMADA C: SEMICONDUTORES E TOPOGRAFIA DE CIRCUITO INTEGRADO (Lei 11.484/2007)
    if (dados.possui_topografia_chip) {
        score += 15;
        recomendacoesInpi.push({
            codigo: 'TCI',
            titulo: 'Camada C — Topografia de Circuito Integrado (Microchips / Silício)',
            base_legal: 'Lei nº 11.484/2007 (Arts. 26 e seguintes — Institui também o PADIS)',
            prioridade: 'Especialização Máxima em Semicondutores',
            prazo: '10 anos (a contar do depósito ou 1ª exploração econômica)',
            justificativa: 'Tutela o leiaute tridimensional das camadas que compõem o microchip (arquivos GDSII/OASIS), ressalvadas as exceções legais para ensino, pesquisa acadêmica e engenharia reversa lícita (Art. 37 da Lei 11.484/07). O projeto também pode pleitear incentivos fiscais do PADIS.'
        });
    }

    // CAMADA B: DESIGN DO PRODUTO (DESENHO INDUSTRIAL — Art. 94 da LPI)
    if (dados.possui_design_externo_novo) {
        score += 10;
        recomendacoesInpi.push({
            codigo: 'DI',
            titulo: 'Camada B — Registro de Desenho Industrial (Design Externo)',
            base_legal: 'Lei nº 9.279/1996 (Arts. 94 a 121)',
            prioridade: 'Proteção Estética ("A Cara do Aparelho")',
            prazo: '10 anos (renováveis até 25 anos)',
            justificativa: 'Protege a forma plástica ornamental e a configuração visual externa do gabinete contra imitação estética e violação de conjunto-imagem (trade dress — Art. 195, III da LPI).'
        });
    }

    // CAMADA E: SOFTWARE EMBARCADO (Lei 9.609/1998 e Lei 9.610/1998)
    if (dados.possui_firmware_proprio) {
        score += 10;
        recomendacoesInpi.push({
            codigo: 'RPC',
            titulo: 'Camada E — Regime Especial de Software Embarcado (e-Software INPI)',
            base_legal: 'Lei nº 9.609/1998 (Arts. 2º, 3º e 4º) e Lei nº 9.610/1998 (Art. 7º, XII)',
            prioridade: 'Tutela Autoral de 50 Anos (Prova de Autoria SHA-512)',
            prazo: '50 anos a partir de 1º de janeiro do ano subsequente à publicação',
            justificativa: 'O código-fonte do firmware é protegido como obra literária (independentemente de patente). O depósito do resumo Hash SHA-512 no INPI garante presunção juris tantum de autoria anterior e resguarda a titularidade prevista no Art. 4º da Lei nº 9.609/1998.'
        });
    }

    // REGULAÇÃO SETORIAL DE IOT: ANATEL (Lei 9.472/97) E LGPD (Lei 13.709/18)
    if (conectividadeRf === 'TRANSCEPTOR_RF_CUSTOM') {
        alertasLicenca.push({
            nivel: 'ATENCAO',
            titulo: 'Obrigação Regulatória de Telecomunicações — Homologação de Rádio Customizado na ANATEL (Lei nº 9.472/1997, Art. 162)',
            descricao: 'Como o seu hardware implementa transceptor de radiofrequência ou antena própria na PCB, o Art. 162 da Lei Geral de Telecomunicações proíbe sua comercialização ou utilização sem prévia homologação da ANATEL (Resolução nº 715/2019 e Ato nº 14448/2017 para radiação restrita em 915MHz/2.4GHz). Programe ensaios em laboratório acreditado junto a um OCD antes de lançar o produto.'
        });
    } else if (conectividadeRf === 'MODULO_RF_HOMOLOGADO') {
        alertasLicenca.push({
            nivel: 'INFO',
            titulo: 'Conformidade ANATEL para Dispositivos IoT com Módulo RF Pré-Homologado (Resolução ANATEL nº 715/2019)',
            descricao: 'Ao utilizar um módulo de rádio já certificado pela ANATEL na sua PCB (ex: ESP32-WROOM ou módulo LoRa homologado), você reduz drasticamente os custos laboratoriais de RF, devendo exibir o código de homologação do módulo no gabinete/manual e observar os ensaios de compatibilidade eletromagnética (EMC) do produto final.'
        });
    }

    if (telemetriaIot === 'DADOS_BIOMETRICOS_SAUDE') {
        alertasLicenca.push({
            nivel: 'ATENCAO',
            titulo: 'Incidência Cumulativa: Dados Sensíveis na LGPD (Lei nº 13.709/18, Art. 11) e Regulação Sanitária ANVISA (RDC 751/22 e 657/22)',
            descricao: 'Dispositivos vestíveis ou sensores que coletam sinais vitais/biometria tratam Dados Pessoais Sensíveis (Art. 5º, II e Art. 11 da LGPD), exigindo criptografia em trânsito e em repouso (Art. 46 da LGPD) e enquadramento perante a ANVISA como Dispositivo Médico (RDC nº 751/2022) e Software como Dispositivo Médico — SaMD (RDC nº 657/2022).'
        });
    } else if (telemetriaIot === 'DADOS_PESSOAIS_IOT') {
        alertasLicenca.push({
            nivel: 'INFO',
            titulo: 'Segurança e Privacy by Design em IoT (LGPD — Lei nº 13.709/2018, Art. 6º e Art. 46, § 2º)',
            descricao: 'Como o dispositivo coleta dados vinculados a pessoas naturais (localização GPS, áudio, imagem ou telemetria residencial), o Art. 46, § 2º da LGPD exige que medidas técnicas de segurança (autenticação forte, comunicação criptografada TLS/MQTTs e minimização de dados na borda) sejam adotadas desde a fase de concepção do hardware e do firmware.'
        });
    }

    // CAMADA A: DOCUMENTAÇÃO TÉCNICA E FRAGILIDADE DO COPYLEFT NO HARDWARE (Lei 9.610/98)
    alertasLicenca.push({
        nivel: 'INFO',
        titulo: 'Camada A — Fragilidade Jurídica do Copyleft no Hardware (Lei nº 9.610/1998, Art. 7º, X)',
        descricao: 'Diferente do software — onde o Direito Autoral impede a cópia do código funcional —, na Camada A (esquemáticos, leiaute de PCB e manuais) a Lei nº 9.610/1998 protege apenas a expressão gráfica do desenho, e não a função elétrica. Se não houver patente depositada na Camada F, um terceiro pode recriar do zero o mesmo circuito funcional sem copiar o desenho gráfico do esquemático, afastando a incidência de licenças copyleft.'
    });

    // ANÁLISE DE CONFLITOS DE LICENÇAS DE SOFTWARE E HARDWARE ABERTO
    let licencaSw = 'Proprietária (Direito Autoral Reservado — Lei 9.609/98)';
    if (['OPEN_SOURCE_TOTAL', 'PUBLICACAO_DEFENSIVA'].includes(dados.modelo_negocio)) {
        licencaSw = (dados.licenca_bibliotecas_terceiros === 'GPL_V2_V3')
            ? 'GNU GPLv3'
            : (dados.licenca_bibliotecas_terceiros === 'LGPL_ESTATICA' ? 'GNU LGPLv3' : 'MIT License / Apache 2.0');
    }

    const querFecharSw = ['COMERCIAL_FECHADO', 'HIBRIDO_HW_ABERTO_SW_FECHADO'].includes(dados.modelo_negocio);

    if (dados.licenca_bibliotecas_terceiros === 'GPL_V2_V3' && querFecharSw) {
        risco = 'ALTO_CRITICO';
        score -= 25;
        alertasLicenca.unshift({
            nivel: 'CRITICO',
            titulo: 'Impedimento Contratual: Biblioteca GNU GPLv3 em Firmware Fechado (Art. 9º da Lei 9.609/98 e Lei 9.610/98)',
            descricao: 'As licenças apoiam-se no monopólio autoral: como a alternativa ao cumprimento da licença é a proibição de uso, você não pode distribuir código derivado de biblioteca GPLv3 em binário fechado. A GPLv3 exige disponibilizar todo o código-fonte do firmware e proíbe travas de gravação física na Flash (cláusula Anti-Tivoização).'
        });
        licencaSw = 'GNU GPLv3 (Obrigatória por derivação) ou Substituição da Biblioteca';
    } else if (dados.licenca_bibliotecas_terceiros === 'LGPL_ESTATICA' && dados.vinculacao_firmware === 'ESTATICA_MONOLITICA' && querFecharSw) {
        risco = 'MEDIO';
        alertasLicenca.unshift({
            nivel: 'ATENCAO',
            titulo: 'Condição de Relinkagem Estática (GNU LGPL Seção 4 em Microcontrolador)',
            descricao: 'Ao compilar estaticamente uma biblioteca LGPL dentro de uma imagem monolítica de firmware fechado na memória Flash, você deve disponibilizar os arquivos-objeto (.o) para que o usuário possa relinkar versões modificadas da biblioteca LGPL.'
        });
    } else {
        alertasLicenca.push({
            nivel: 'SUCESSO',
            titulo: 'Conformidade Contratual nas Dependências de Software (Camada E)',
            descricao: 'O licenciamento das bibliotecas de firmware é plenamente compatível com o modelo de exploração selecionado.'
        });
    }

    // Licenças de Hardware Aberto (CERN-OHL v2 / TAPR / Solderpad / CC BY-SA)
    let licencaHw = 'Proprietária (Tutela Gráfica LDA + Patente LPI)';
    const querFecharHw = dados.modelo_negocio === 'COMERCIAL_FECHADO';

    if (dados.usa_hardware_aberto_terceiros === 'CERN_OHL_S' && querFecharHw) {
        risco = 'ALTO_CRITICO';
        score -= 20;
        alertasLicenca.unshift({
            nivel: 'CRITICO',
            titulo: 'Violação de Reciprocidade Forte na Documentação de Hardware (CERN-OHL-S / CC BY-SA)',
            descricao: 'O projeto deriva de esquemáticos licenciados sob CERN-OHL-S v2 ou Creative Commons CC BY-SA 4.0. A distribuição comercial de placas derivadas exige abrir integralmente os arquivos editáveis de esquemático, leiaute de PCB, Gerbers e BOM sob a mesma licença recíproca.'
        });
        licencaHw = 'CERN-OHL-S v2 / CC BY-SA 4.0 (Obrigatória por derivação)';
    } else if (dados.usa_hardware_aberto_terceiros === 'CERN_OHL_W' && querFecharHw) {
        if (risco === 'NULO') risco = 'BAIXO';
        licencaHw = 'Híbrida: CERN-OHL-W v2 (Bloco Base) + Proprietária (Módulos Independentes)';
    } else if (['OPEN_SOURCE_TOTAL', 'HIBRIDO_HW_ABERTO_SW_FECHADO', 'PUBLICACAO_DEFENSIVA'].includes(dados.modelo_negocio)) {
        licencaHw = (dados.usa_hardware_aberto_terceiros === 'CERN_OHL_P')
            ? 'CERN-OHL-P v2 / Solderpad / TAPR OHL (Permissiva)'
            : 'CERN-OHL-W v2 ou CC BY-SA 4.0 (Padrão OSHWA)';
    }

    // TITULARIDADE UNIVERSITÁRIA (Lei 10.973/04 — NIT) E CONFLITO SOCIETÁRIO (Caso Arduino)
    if (dados.titularidade_tipo === 'VINCULO_EMPREGATICIO_ICT') {
        alertasLicenca.push({
            nivel: 'ATENCAO',
            titulo: 'Marco Legal de CT&I (Lei nº 10.973/2004, Art. 16), Art. 88 da LPI e Art. 4º da Lei de Software',
            descricao: 'Projetos desenvolvidos em Instituições Científicas, Tecnológicas e de Inovação (ICTs) ou sob contrato de trabalho possuem titularidade originária vinculada à instituição/empregador e devem ser submetidos ao Núcleo de Inovação Tecnológica (NIT), que conduzirá o depósito patentário ou autorizará a publicação em hardware aberto.'
        });
    } else if (dados.titularidade_tipo === 'PARCERIA_COAUTORIA') {
        alertasLicenca.push({
            nivel: 'ATENCAO',
            titulo: 'Prevenção de Litígio Societário sobre a Marca (Lição Arduino LLC vs. Arduino SRL — Art. 6º, § 3º e Art. 129 da LPI)',
            descricao: 'Quando há múltiplos cofundadores, é indispensável firmar imediatamente a Cessão de Direitos e o Acordo de Cotitularidade unificando o depósito da Marca no INPI sob uma única entidade jurídica.'
        });
    }

    score = Math.max(15, Math.min(100, score));
    const resultadoParcial = {
        score_protegibilidade: score,
        risco_contaminacao_licenca: risco,
        protecao_inpi_primaria: recomendacoesInpi[0] ? recomendacoesInpi[0].titulo : 'Registro de Marca (Art. 129 LPI) + Direito Autoral',
        protecao_inpi_secundaria: recomendacoesInpi[1] ? recomendacoesInpi[1].titulo : 'Tutela Autoral de Software e Documentação',
        licenca_hw_recomendada: licencaHw,
        licenca_sw_recomendada: licencaSw,
        recomendacoes_inpi: recomendacoesInpi,
        alertas_licenca: alertasLicenca,
        camadas_analise: camadasAnalise,
        timestamp_avaliacao: new Date().toLocaleString('pt-BR')
    };

    resultadoParcial.correlacao_patentaria = gerarCorrelacaoPatentariaReal(dados, resultadoParcial);
    return resultadoParcial;
}

function coletarDadosFormularioAtual() {
    return {
        nome_projeto: document.getElementById('nome_projeto').value.trim(),
        autor_nome: document.getElementById('autor_nome').value.trim(),
        autor_documento: document.getElementById('autor_documento').value.trim(),
        autor_email: document.getElementById('autor_email').value.trim(),
        instituicao_empresa: document.getElementById('instituicao_empresa').value.trim(),
        resumo_tecnico: document.getElementById('resumo_tecnico').value.trim(),
        palavras_chave_extra: document.getElementById('palavras_chave_extra') ? document.getElementById('palavras_chave_extra').value.trim().slice(0, 120) : '',
        grau_novidade_hardware: document.getElementById('grau_novidade_hardware').value,
        divulgacao_previa: document.getElementById('divulgacao_previa') ? document.getElementById('divulgacao_previa').value : 'SIGILO_MANTIDO',
        conectividade_iot_rf: document.getElementById('conectividade_iot_rf') ? document.getElementById('conectividade_iot_rf').value : 'MODULO_RF_HOMOLOGADO',
        telemetria_dados_iot: document.getElementById('telemetria_dados_iot') ? document.getElementById('telemetria_dados_iot').value : 'DADOS_AMBIENTAIS_MAQUINA',
        possui_pcb_customizada: document.getElementById('possui_pcb_customizada').checked,
        possui_topografia_chip: document.getElementById('possui_topografia_chip').checked,
        possui_design_externo_novo: document.getElementById('possui_design_externo_novo').checked,
        usa_hardware_aberto_terceiros: document.getElementById('usa_hardware_aberto_terceiros').value,
        possui_firmware_proprio: document.getElementById('possui_firmware_proprio').checked,
        linguagem_firmware: document.getElementById('linguagem_firmware').value.trim(),
        licenca_bibliotecas_terceiros: document.getElementById('licenca_bibliotecas_terceiros').value,
        vinculacao_firmware: document.getElementById('vinculacao_firmware').value,
        modelo_negocio: document.getElementById('modelo_negocio').value,
        titularidade_tipo: document.getElementById('titularidade_tipo').value
    };
}

// Enter dentro do formulário: no Bloco 1 avança para o Bloco 2; no Bloco 2 inicia a verificação
function enviarFormularioPorEnter(event) {
    if (event) event.preventDefault();
    if (blocoAtualUsuario <= 1) avancarBlocoUsuario(2);
    else iniciarVerificacaoPorcentagemBloco2();
}

// Renderiza as 6 Camadas (A a F), a Matriz de Correlação Engenharia-Lei e as tabelas do diagnóstico na Aba 2
function renderizarRelatorioDiagnostico(dados, diag, verif = null, anterioridadeMundial = null) {
    ultimoResultadoMundial = anterioridadeMundial;
    document.getElementById('rel-nome-projeto').textContent = dados.nome_projeto;
    document.getElementById('rel-autor-projeto').textContent = `${dados.autor_nome} • ${dados.instituicao_empresa} (${formatarDocumento(dados.autor_documento)})`;
    document.getElementById('kpi-score').textContent = `${diag.score_protegibilidade}/100`;
    document.getElementById('kpi-risco').textContent = diag.risco_contaminacao_licenca;
    document.getElementById('kpi-inpi').textContent = diag.protecao_inpi_primaria.split(' — ')[1] || diag.protecao_inpi_primaria;
    document.getElementById('kpi-licenca-hw').textContent = diag.licenca_hw_recomendada;
    document.getElementById('kpi-licenca-sw').textContent = diag.licenca_sw_recomendada;

    const kpiRiscoEl = document.getElementById('kpi-risco');
    const rotulosRisco = { ALTO_CRITICO: 'Alto', MEDIO: 'Médio', BAIXO: 'Baixo', NULO: 'Nenhum' };
    kpiRiscoEl.textContent = rotulosRisco[diag.risco_contaminacao_licenca] || diag.risco_contaminacao_licenca;
    kpiRiscoEl.style.color = diag.risco_contaminacao_licenca === 'ALTO_CRITICO' ? 'var(--danger)'
        : (diag.risco_contaminacao_licenca === 'MEDIO' ? 'var(--warn)' : 'var(--ok)');
    // Coerência com a busca: se há anterioridade relevante, a patente deixa de ser a proteção principal "garantida"
    if (anterioridadeMundial && anterioridadeMundial.totalAchadosMundo > 0 && /patente|modelo de utilidade/i.test(document.getElementById('kpi-inpi').textContent)) {
        document.getElementById('kpi-inpi').textContent = 'Marca + software (patente só do diferencial)';
    }

    // Painel Explicativo Simples e Direto (Para Leigos: O que passou, o que não passou e o porquê)
    const painelLeigo = document.getElementById('painel-resumo-leigo-direto');
    if (painelLeigo) {
        const temAnterioridadeMundial = anterioridadeMundial && anterioridadeMundial.totalAchadosMundo > 0;
        const jaExisteTerceiro = Boolean(verif && verif.bloqueio_terceiro && !verif.pode_registrar_como_seu);
        const jaEhDoUsuario = Boolean(verif && ['JA_PERTENCE_AO_USUARIO', 'REGISTRADO_COM_SUCESSO'].includes(verif.status_apropriacao));
        const colisaoMarca = Boolean(jaExisteTerceiro && verif.bloqueio_terceiro.colisao_marca);

        // Veredito principal: 3 estados visuais (ok / atencao / critico), título curto e explicação em linguagem simples
        let estadoVeredito = 'ok';
        let iconeVeredito = '✓';
        let tituloVeredito = '';
        let textoVeredito = '';
        const mundo = anterioridadeMundial;
        const qtdPatentesRelevantes = mundo && mundo.patentesRelevantes ? mundo.patentesRelevantes.length : 0;

        if (jaExisteTerceiro) {
            estadoVeredito = 'critico';
            iconeVeredito = '!';
            tituloVeredito = 'Já existe um projeto muito parecido na base do Observatório';
            textoVeredito = `<p>O seu projeto colide com <strong>${escaparHtml(verif.bloqueio_terceiro.nome_criacao_marca)}</strong> (titular: ${escaparHtml(verif.bloqueio_terceiro.titular_nome)}, ${verif.bloqueio_terceiro.similaridade_percentual}% de semelhança).</p>
                <p>${colisaoMarca
                    ? 'Pelo Art. 11 da LPI, o conceito geral não pode ser patenteado, e pelo Art. 124, XIX, não dá para registrar uma marca igual ou parecida. Você ainda pode proteger o seu código-fonte (Lei 9.609/98), usar um nome próprio e pedir patente só do que for realmente novo no seu projeto.'
                    : 'Pelo Art. 11 da LPI, o conceito geral não pode ser patenteado. O nome do seu projeto é diferente, então a marca continua protegível. Você ainda pode proteger o seu código-fonte (Lei 9.609/98) e pedir patente só do que for realmente novo no seu projeto.'}</p>`;
        } else if (temAnterioridadeMundial && mundo.mesmaSolucao.length > 0) {
            const qtdPatMesma = mundo.patentesMesmaSolucao.length;
            estadoVeredito = 'atencao';
            iconeVeredito = '!';
            tituloVeredito = 'Encontramos projetos que fazem o mesmo que o seu';
            textoVeredito = `<p><strong>${mundo.mesmaSolucao.length}</strong> resultado(s)${qtdPatMesma ? ` — ${qtdPatMesma} deles patente(s) —` : ''} têm <strong>todos</strong> os termos principais do seu projeto, e outros ${mundo.mesmoTema.length} são do mesmo tema. Leia "Os mais parecidos com o seu projeto": se algum descrever a mesma solução, o conceito geral não é novo (Art. 11 da LPI).</p>
                <p>Isso não impede o seu projeto. Você pode proteger a marca e o código-fonte, e uma patente ainda é possível se ficar restrita ao seu diferencial.</p>`;
        } else if (temAnterioridadeMundial) {
            estadoVeredito = 'atencao';
            iconeVeredito = 'i';
            tituloVeredito = 'Há projetos do mesmo tema, mas nenhum igual ao seu';
            textoVeredito = `<p>${mundo.totalAchadosMundo} resultado(s)${qtdPatentesRelevantes ? ` — ${qtdPatentesRelevantes} deles patente(s) —` : ''} são do mesmo tema, mas <strong>nenhum</strong> tem todos os termos principais do seu projeto. A combinação que você descreveu pode ser o seu diferencial.</p>
                <p>Ainda assim, leia "Os mais parecidos com o seu projeto": uma patente exige atividade inventiva (Art. 13 da LPI), e uma combinação óbvia de soluções conhecidas pode não bastar.</p>`;
        } else if (mundo && mundo.totalAnalisados === 0 && mundo.basesComFalha.length > 0) {
            estadoVeredito = 'atencao';
            iconeVeredito = '?';
            tituloVeredito = 'Não foi possível concluir a busca';
            textoVeredito = `<p>As bases mundiais não responderam, então nenhum resultado foi analisado. Não houve colisão na base do Observatório, mas não dá para concluir nada sobre a novidade. Refaça a busca em alguns minutos.</p>`;
        } else if (jaEhDoUsuario) {
            tituloVeredito = 'Este projeto já está gravado em seu nome';
            textoVeredito = `<p>A prova de autoria deste projeto já está no Observatório, vinculada ao seu CPF/CNPJ.</p>`;
        } else {
            tituloVeredito = 'Nenhum projeto parecido nas bases consultadas';
            const incompleta = mundo && mundo.basesComFalha && mundo.basesComFalha.length ? ' Uma das bases não respondeu por completo, então a busca ficou incompleta.' : '';
            const semPatentes = mundo && mundo.patentesConsultadas ? '' : ' As patentes não foram consultadas automaticamente nesta instalação.';
            textoVeredito = `<p>Nas bases mundiais, não encontramos nada com relevância de ${LIMIAR_RELEVANCIA_ANTERIORIDADE}% ou mais.${incompleta}${semPatentes} Isso é um bom sinal, mas não garante que o projeto seja novo: confira também no pePI/INPI antes de depositar.</p>`;
        }

        // Produto conhecido do acervo de referência: aviso extra (não bloqueia a gravação)
        if (!jaExisteTerceiro && verif && verif.referencia_conhecida) {
            const ref = verif.referencia_conhecida;
            textoVeredito += `<p>Na base do Observatório, o projeto também é parecido com <strong>${escaparHtml(ref.nome_criacao_marca)}</strong> (${ref.similaridade_percentual}%), um produto conhecido do mercado no acervo de referência. É mais um sinal de que a ideia geral já existe, mas não impede gravar a sua prova de autoria.</p>`;
            if (estadoVeredito === 'ok') { estadoVeredito = 'atencao'; iconeVeredito = 'i'; tituloVeredito = 'Parecido com um produto conhecido do mercado'; }
        }

        const referenciaParecida = Boolean(!jaExisteTerceiro && verif && verif.referencia_conhecida);
        const podePatenteFisica = dados.divulgacao_previa !== 'DIVULGADO_MAIS_12M' && dados.grau_novidade_hardware !== 'MODULOS_PRONTOS_COTS' && dados.modelo_negocio !== 'PUBLICACAO_DEFENSIVA';

        const itensChecklist = [
            {
                passou: !colisaoMarca,
                titulo: '1. Nome do Projeto / Marca Comercial (Camada D)',
                explicacaoSimples: colisaoMarca
                    ? `Conflito de marca: o nome colide com '${escaparHtml(verif.bloqueio_terceiro.nome_criacao_marca)}'. Pelo Art. 124, XIX da LPI, você deve alterar o nome comercial.`
                    : 'O nome não colidiu com a base do Observatório. Antes de depositar, confira na busca de marcas do pePI/INPI (classe NCL 9) se não existe marca igual ou parecida.',
                lei: colisaoMarca
                    ? 'Art. 124, inciso XIX da Lei 9.279/96 (Vedação de registro de marca colidente).'
                    : 'Art. 129 da Lei 9.279/96 (aquisição da marca pelo registro) e Art. 133 (vigência de 10 anos, prorrogável por períodos iguais e sucessivos).'
            },
            {
                passou: Boolean(dados.possui_firmware_proprio),
                titulo: '2. Código-Fonte / Software do Projeto (Camada E)',
                explicacaoSimples: dados.possui_firmware_proprio
                    ? `Seu código (${dados.linguagem_firmware}) é protegido por direito autoral desde a criação; o registro no INPI (e-Software) serve como prova de autoria.`
                    : 'Você indicou que o projeto não possui código/software próprio.',
                lei: 'Art. 2º, § 2º e Art. 3º da Lei 9.609/98 (Lei de Software — proteção de 50 anos; no e-Software o código é identificado por um resumo hash).'
            },
            {
                passou: Boolean(dados.possui_pcb_customizada),
                titulo: '3. Desenho da Placa / Esquemático Elétrico (Camada A)',
                explicacaoSimples: dados.possui_pcb_customizada
                    ? 'O desenho da sua placa e o esquemático são protegidos por direito autoral contra cópia do desenho (não protege a função elétrica do circuito).'
                    : 'Usa módulos ligados sem desenho de placa PCB própria.',
                lei: 'Art. 7º, inciso X da Lei 9.610/98 (Direito Autoral sobre projetos e esboços de engenharia).'
            },
            {
                passou: podePatenteFisica && !jaExisteTerceiro && !temAnterioridadeMundial && !referenciaParecida,
                atencao: jaExisteTerceiro || temAnterioridadeMundial || referenciaParecida,
                titulo: '4. Patente do Funcionamento Físico (Camada F)',
                explicacaoSimples: jaExisteTerceiro
                    ? `Encontramos um projeto equivalente na base (${escaparHtml(verif.bloqueio_terceiro.nome_criacao_marca)} — ${escaparHtml(verif.bloqueio_terceiro.titular_nome)}). O conceito geral não é patenteável (Art. 11 da LPI); só um diferencial seu poderia ser.`
                    : (temAnterioridadeMundial
                        ? (anterioridadeMundial.mesmaSolucao.length > 0
                            ? `${anterioridadeMundial.mesmaSolucao.length} resultado(s) têm todos os termos principais do seu projeto. Leia-os: se descreverem a mesma solução, o conceito geral não é patenteável e o pedido deve se limitar ao seu diferencial (Arts. 11 e 13 da LPI).`
                            : `Nenhum resultado tem todos os termos do seu projeto, mas ${anterioridadeMundial.totalAchadosMundo} são do mesmo tema. A patente é possível se a combinação não for óbvia para um técnico da área (atividade inventiva, Art. 13 da LPI).`)
                        : (referenciaParecida
                            ? `O projeto é parecido com ${escaparHtml(verif.referencia_conhecida.nome_criacao_marca)}, um produto conhecido do mercado. O conceito geral não é novo (Art. 11 da LPI); só um diferencial seu poderia ser patenteado.`
                            : (podePatenteFisica
                            ? 'Pela descrição (hardware com efeito técnico físico), o projeto pode, em tese, ser patenteado — desde que a busca no pePI/Google Patents não revele solução igual.'
                            : (dados.divulgacao_previa === 'DIVULGADO_MAIS_12M'
                                ? 'Não cabe patente física porque foi divulgado há mais de 12 meses (caiu em domínio público técnico).'
                                : 'Como usa apenas peças comerciais prontas sem circuito novo, você protege a Marca e o Código, mas não o hardware pronto.')))),
                lei: 'Art. 8º, Art. 9º, Art. 11 e Art. 13 da Lei 9.279/96 (LPI).'
            },
            {
                passou: Boolean(dados.possui_design_externo_novo),
                titulo: '5. Carcaça Externa / Visual 3D do Aparelho (Camada B)',
                explicacaoSimples: dados.possui_design_externo_novo
                    ? 'A descrição cita gabinete, carcaça ou formato próprio, então também dá para proteger o visual externo do aparelho.'
                    : 'A descrição não cita carcaça ou formato externo próprio (é opcional e não impede o registro).',
                lei: 'Art. 94 da Lei 9.279/96 (Registro de Desenho Industrial no INPI).'
            },
            {
                passou: Boolean(dados.possui_topografia_chip),
                titulo: '6. Fabricação de Microchip de Silício do Zero (Camada C)',
                explicacaoSimples: dados.possui_topografia_chip
                    ? 'Proteção especial ativada para desenho de microchip próprio em silício.'
                    : 'Não se aplica: o projeto usa chips comerciais, como ESP32 ou Arduino (o normal na maioria dos projetos).',
                lei: 'Art. 26 da Lei 11.484/2007 (Topografia de Circuito Integrado).'
            }
        ];

        // Conta todos os itens parecidos listados na base (inclusive um registro do próprio usuário, que aparece na lista)
        const colisoesLocais = verif && Array.isArray(verif.colisoes) ? verif.colisoes.length : 0;
        const marcaItem = item => item.passou ? 'Pode proteger' : (item.atencao ? 'Atenção' : 'Não se aplica');
        const classeItem = item => item.passou ? 'ok' : (item.atencao ? 'atencao' : 'na');

        painelLeigo.innerHTML = `
            <div class="verdict ${estadoVeredito}">
                <div class="verdict-topo">
                    <span class="verdict-icone">${iconeVeredito}</span>
                    <div>
                        <span class="eyebrow">Resultado</span>
                        <h3>${tituloVeredito}</h3>
                        <div class="verdict-texto">${textoVeredito}</div>
                    </div>
                </div>
                <div class="verdict-numeros">
                    <div><strong>${mundo ? mundo.mesmaSolucao.length : '—'}</strong><span>${mundo && mundo.mesmaSolucao.length === 1 ? 'faz o mesmo' : 'fazem o mesmo'} (todos os termos)</span></div>
                    <div><strong>${mundo ? mundo.mesmoTema.length : '—'}</strong><span>do mesmo tema</span></div>
                    <div><strong>${mundo ? mundo.totalAnalisados : '—'}</strong><span>${mundo && mundo.totalAnalisados === 1 ? 'resultado analisado' : 'resultados analisados'}</span></div>
                    <div><strong>${colisoesLocais}</strong><span>${colisoesLocais === 1 ? 'item parecido' : 'itens parecidos'} na base do Observatório</span></div>
                </div>
                <div class="verdict-corpo">
                    <h4>O que você pode proteger</h4>
                    <div class="checklist">
                        ${itensChecklist.map(item => `
                            <div class="check-item ${classeItem(item)}">
                                <div class="check-titulo"><span class="check-marca">${marcaItem(item)}</span> ${item.titulo.replace(/^\d+\.\s*/, '')}</div>
                                <p>${item.explicacaoSimples}</p>
                                <div class="check-lei">${item.lei}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="cta-bar no-print">
                        <p>${jaExisteTerceiro
                            ? '<strong>Próximo passo:</strong> para gravar a prova de autoria, use um nome próprio e descreva o que o seu projeto tem de diferente.'
                            : (jaEhDoUsuario
                                ? '<strong>Prova de autoria já gravada.</strong> Baixe o certificado. Para ter exclusividade no Brasil, o pedido precisa ser feito no INPI.'
                                : '<strong>Próximo passo:</strong> grave a prova de autoria (hash SHA-512 com data) no Observatório. É um registro acadêmico interno; para ter exclusividade no Brasil, o pedido precisa ser feito no INPI.')}</p>
                        <div class="card-acoes">
                            ${jaEhDoUsuario ? '' : '<button type="button" class="btn-primary" onclick="registrarTitularidadeFixaUsuario()">Gravar prova de autoria</button>'}
                            <button type="button" class="${jaEhDoUsuario ? 'btn-primary' : 'btn-secondary'}" onclick="baixarCertificadoDireto()">Baixar certificado</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Mapa das 6 Camadas Tecnológicas (A a F)
    const camadasGrid = document.getElementById('mapa-camadas-grid');
    if (camadasGrid) {
        const statusCamadaA = dados.possui_pcb_customizada
            ? `Direito Autoral sobre Desenho/Esquemático (Lei 9.610/98, Art. 7º, X)`
            : `Documentação Padrão de Terceiros`;

        const statusCamadaB = dados.possui_design_externo_novo
            ? `Desenho Industrial no INPI (10 a 25 anos — Lei 9.279/96, Art. 94)`
            : `Sem forma plástica ornamental nova`;

        const statusCamadaC = dados.possui_topografia_chip
            ? `Topografia de Circuito Integrado (10 anos — Lei 11.484/2007, Art. 26)`
            : `Não aplicável (Usa microcontrolador/chip comercial)`;

        const statusCamadaD = `Registro de Marca no INPI (Art. 129 da LPI; vigência de 10 anos renováveis — Art. 133)`;

        const statusCamadaE = dados.possui_firmware_proprio
            ? `Direito Autoral de Software (50 anos — Lei 9.609/98, Art. 2º • ${dados.linguagem_firmware})`
            : `Sem firmware próprio declarado`;

        const temAnterioridadeRelevante = Boolean(anterioridadeMundial && anterioridadeMundial.totalAchadosMundo > 0);
        const statusCamadaF = temAnterioridadeRelevante && dados.modelo_negocio !== 'PUBLICACAO_DEFENSIVA'
            ? (anterioridadeMundial.mesmaSolucao && anterioridadeMundial.mesmaSolucao.length > 0
                ? `Patente em dúvida: ${anterioridadeMundial.mesmaSolucao.length} resultado(s) fazem o mesmo — só o diferencial pode ser patenteável (Arts. 11 e 13 da LPI)`
                : `Patente possível só do diferencial: ${anterioridadeMundial.totalAchadosMundo} resultado(s) do mesmo tema (atividade inventiva — Art. 13 da LPI)`)
            : dados.modelo_negocio === 'PUBLICACAO_DEFENSIVA'
            ? `Publicação Defensiva / Estado da Técnica (Art. 11 e 12 da LPI)`
            : (dados.grau_novidade_hardware === 'INEDITO_INVENTIVO'
                ? `Patente de Invenção (20 anos — Art. 8º LPI e Res. INPI 158/2016)`
                : (dados.grau_novidade_hardware === 'MELHORIA_FUNCIONAL' && dados.possui_pcb_customizada
                    ? `Modelo de Utilidade (15 anos — Lei 9.279/96, Art. 9º)`
                    : `Sem monopólio patentário (Livre reprodução funcional)`));

        camadasGrid.innerHTML = `
            <div class="layer-card">
                <span class="layer-tag">Camada A • Documentação Técnica</span>
                <h4>${statusCamadaA}</h4>
                <p>Esquemáticos, leiaute de PCB e manuais. Licença sugerida: <strong>${diag.licenca_hw_recomendada}</strong></p>
            </div>
            <div class="layer-card">
                <span class="layer-tag">Camada B • Design do Produto</span>
                <h4>${statusCamadaB}</h4>
                <p>Protege a forma ornamental e aspectos plásticos externos ("a cara do aparelho").</p>
            </div>
            <div class="layer-card">
                <span class="layer-tag">Camada C • Semicondutores e Chips</span>
                <h4>${statusCamadaC}</h4>
                <p>Configuração tridimensional das camadas do microchip em silício (lição do caso Intel vs. AMD).</p>
            </div>
            <div class="layer-card">
                <span class="layer-tag">Camada D • Signos Distintivos (Marca)</span>
                <h4>${statusCamadaD}</h4>
                <p>Protege nome comercial e logotipo. Único vetor exclusivo em projetos abertos (caso Arduino LLC vs. SRL).</p>
            </div>
            <div class="layer-card">
                <span class="layer-tag">Camada E • Software Embarcado</span>
                <h4>${statusCamadaE}</h4>
                <p>Firmware e código funcional ("o cérebro"). Licença sugerida: <strong>${diag.licenca_sw_recomendada}</strong></p>
            </div>
            <div class="layer-card">
                <span class="layer-tag">Camada F • Solução Técnica</span>
                <h4>${statusCamadaF}</h4>
                <p>Funcionalidade eletromecânica ou processo assistido por software com efeito físico no mundo real.</p>
            </div>
        `;
    }
    // (Removidos: painéis de reivindicação, correlação, recomendações, alertas e custos — os elementos não existem mais no index.html)
}

// Converte um trecho com HTML em texto puro (para o certificado .txt). DOMParser não executa scripts nem carrega imagens.
function textoPuro(html) {
    const doc = new DOMParser().parseFromString(String(html == null ? '' : html), 'text/html');
    return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
}

// Resumo da busca mundial para o certificado
function resumoBuscaMundialTexto(r) {
    if (!r) return '• A busca mundial ainda não foi executada.';
    const statusTexto = st => ({
        ok: `consultada (${st.recebidos} resultado(s) em ${st.consultas} consulta(s))`,
        parcial: `consulta parcial (${st.consultas} concluída(s))`,
        limite: 'limite de consultas atingido — resultado incompleto',
        erro: 'indisponível no momento — nenhum resultado considerado',
        sem_termos: 'não consultada (descrição sem termos técnicos suficientes)',
        apenas_link: 'sem consulta automática nesta instalação'
    }[st.estado] || 'não consultada');
    const linhas = [
        `• Bases: Patentes (EPO) — ${statusTexto(r.status.patentes)}; Artigos (OpenAlex) — ${statusTexto(r.status.openalex)}; Repositórios (GitHub) — ${statusTexto(r.status.github)}.`,
        `• Termos pesquisados: ${(r.termos && r.termos.ingles.length ? r.termos.ingles : (r.termos ? r.termos.portugues : [])).join(', ') || '—'}`,
        `• Classe CIP usada nos links de patentes: ${r.cipPrincipal}`,
        `• Resultados analisados: ${r.totalAnalisados} | Fazem o mesmo (todos os termos principais): ${(r.mesmaSolucao || []).length} | Do mesmo tema: ${(r.mesmoTema || []).length}`
    ];
    if (r.interrompida) linhas.push('• A busca foi encerrada pelo usuário antes do fim.');
    const top = (r.todos || []).filter(x => x.termosEncontrados && x.termosEncontrados.length).slice(0, 5);
    if (top.length) {
        linhas.push('• Os mais parecidos encontrados:');
        top.forEach((x, i) => linhas.push(`  ${i + 1}. [${x.base}] ${textoPuro(x.titulo)} (${x.ano}) — ${x.relevancia}% — ${x.link}`));
    }
    return linhas.join('\n');
}

// Gera o texto do Certificado de Autoria SHA-512 (único documento usado pela interface atual)
function gerarMinutaAutomatizada(tipoDocumento) {
    const p = ultimoProjetoAvaliado || CASO_BASE_INICIAL;
    const d = ultimoDiagnostico || motorDecisaoLocal(p);
    const corr = d.correlacao_patentaria || gerarCorrelacaoPatentariaReal(p, d);
    const verif = ultimaVerificacaoExistencia || {};
    const dataHoje = new Date().toLocaleDateString('pt-BR');
    // Só usa o hash SHA-512 real calculado na verificação; nunca gera um valor de aparência falsa
    const hashReal = verif.hash_sha512_calculado || 'NÃO GERADO — execute a verificação do projeto para calcular o hash SHA-512';
    const protocoloAtivo = (verif.registro_gravado && verif.registro_gravado.protocolo_registro)
        ? verif.registro_gravado.protocolo_registro
        : 'NÃO GRAVADO — clique em "Gravar Prova de Autoria" para gerar o protocolo interno';

    let texto = '';

    if (tipoDocumento === 'CERTIFICADO_TITULARIDADE') {
        texto = `================================================================================
CERTIFICADO DE AUTORIA E VERIFICAÇÃO DE ANTERIORIDADE (SHA-512)
Observatório Acadêmico — NÃO é documento emitido pelo INPI
================================================================================

PROTOCOLO INTERNO DO OBSERVATÓRIO: ${protocoloAtivo}
STATUS NA BASE DO OBSERVATÓRIO: ${textoPuro(verif.titulo_veredito) || 'VERIFICAÇÃO AINDA NÃO EXECUTADA'}
DATA E HORA DE EMISSÃO: ${new Date().toLocaleString('pt-BR')}

1. QUALIFICAÇÃO DO(S) TITULAR(ES) E INVENTOR(ES)
• Nome Completo / Equipe: ${p.autor_nome}
• Documento (CPF / CNPJ): ${formatarDocumento(p.autor_documento)}
• Organização / Startup / ICT: ${p.instituicao_empresa}
• E-mail informado: ${p.autor_email}

2. ESPECIFICAÇÃO DO ATIVO DE HARDWARE, IOT E SOFTWARE REIVINDICADO
• Denominação Técnica e Marca Pretendida (Camada D): "${p.nome_projeto}"
• Classificação Internacional de Patentes (CIP / IPC): ${corr.codigos_cip.join(' | ')}
• Memorial Descritivo Sintético (Art. 24 da Lei nº 9.279/96):
  "${p.resumo_tecnico}"

3. VERIFICAÇÃO NA BASE DO OBSERVATÓRIO (ART. 11 E ART. 124 DA LPI)
• Parecer: ${textoPuro(verif.explicacao_veredito) || 'Verificação ainda não executada.'}
• Enquadramento Primário no INPI: ${textoPuro(d.protecao_inpi_primaria)}
• Enquadramento Complementar: ${textoPuro(d.protecao_inpi_secundaria)}
• Licenciamento Definido (Camada A — Esquemático/PCB): ${d.licenca_hw_recomendada}
• Licenciamento Definido (Camada E — Firmware ${p.linguagem_firmware}): ${d.licenca_sw_recomendada}

4. BUSCA MUNDIAL DE ANTERIORIDADE (PATENTES, ARTIGOS E REPOSITÓRIOS — ART. 11 DA LPI)
${resumoBuscaMundialTexto(ultimoResultadoMundial)}

5. MINUTA DA REIVINDICAÇÃO PATENTÁRIA (ART. 25 DA LPI E RES. INPI 158/2016) — RASCUNHO PARA ESTUDO
${corr.texto_reivindicacao_1}

6. IMPRESSÃO DIGITAL CRIPTOGRÁFICA (PROVA DE AUTORIA — ART. 3º DA LEI 9.609/98)
Hash SHA-512 do Projeto e Código-Fonte:
${hashReal}

7. RESSALVA LEGAL E NECESSIDADE DE VALIDAÇÃO OFICIAL NO INPI
• Natureza deste certificado: triagem acadêmica de anterioridade e prova técnica de autoria e integridade (resumo SHA-512 com data).
• Validação Estatal Obrigatória: Nos termos dos Arts. 6º, 19, 30 e 129 da Lei nº 9.279/1996 (LPI), a exclusividade comercial de Patente (PI/MU), Desenho Industrial (DI) ou Marca em todo o território nacional depende obrigatoriamente de busca complementar e protocolo formal do pedido diretamente no portal oficial do Instituto Nacional da Propriedade Industrial — INPI (https://www.gov.br/inpi/pt-br e https://busca.inpi.gov.br/pePI/), mediante recolhimento da Guia de Recolhimento da União (GRU) e exame técnico pelos examinadores federais.

Declara-se, para fins de prova de anterioridade técnica e autoral nos termos do Art. 5º, XXVII a XXIX da CF/88, da Lei nº 9.279/1996 (LPI), da Lei nº 9.609/1998 e da Lei nº 9.610/1998, que a especificação técnica acima foi verificada pelo Observatório e vinculada ao titular identificado sob o protocolo ${protocoloAtivo}.

__________________________________________________
TITULAR: ${p.autor_nome} (${formatarDocumento(p.autor_documento)})
Observatório de Propriedade Intelectual e Hardware Aberto — Brasil`;
    }

    const viewer = document.getElementById('contract-viewer-box');
    if (viewer) viewer.textContent = texto;

}

// Exporta diretamente o Certificado de Autoria SHA-512 (Observatório)
function baixarCertificadoDireto() {
    gerarMinutaAutomatizada('CERTIFICADO_TITULARIDADE');
    const viewer = document.getElementById('contract-viewer-box');
    const conteudo = viewer ? viewer.textContent : '';
    if (!conteudo) {
        alert('Faça primeiro a verificação do projeto para gerar o certificado.');
        return;
    }
    // Arquivo de texto UTF-8 (o conteúdo é texto puro; antes era salvo com extensão .doc indevidamente)
    const blob = new Blob(['\ufeff' + conteudo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const nomeLimpo = (ultimoProjetoAvaliado && ultimoProjetoAvaliado.nome_projeto)
        ? ultimoProjetoAvaliado.nome_projeto.replace(/[^a-zA-Z0-9_-]/g, '_')
        : 'Invenção';
    a.download = `Certificado_Autoria_SHA512_${nomeLimpo}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}



// ============================================================================
// TEMA CLARO / ESCURO
// Sem escolha salva, segue o tema do sistema operacional. A escolha fica salva neste navegador.
// ============================================================================
function obterTemaAtual() {
    const definido = document.documentElement.getAttribute('data-theme');
    if (definido === 'dark' || definido === 'light') return definido;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function atualizarBotaoTema() {
    const botao = document.getElementById('botao-tema');
    if (!botao) return;
    const escuro = obterTemaAtual() === 'dark';
    // O botão mostra o tema para o qual ele leva
    botao.querySelector('.theme-toggle-icone').textContent = escuro ? '☀' : '☾';
    botao.querySelector('.theme-toggle-texto').textContent = escuro ? 'Claro' : 'Escuro';
    botao.title = escuro ? 'Mudar para o tema claro' : 'Mudar para o tema escuro';
}

function alternarTema() {
    const novo = obterTemaAtual() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', novo);
    try { localStorage.setItem('observatorio_tema', novo === 'dark' ? 'escuro' : 'claro'); } catch (e) {}
    atualizarBotaoTema();
}

if (window.matchMedia) {
    try {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', atualizarBotaoTema);
    } catch (e) {}
}

// Inicialização automática no fluxo guiado em etapas (Bloco 1 -> Bloco 2 -> Bloco 3)
document.addEventListener('DOMContentLoaded', async () => {
    const campoNome = document.getElementById('nome_projeto');
    if (campoNome) {
        campoNome.dataset.autoGerado = 'true';
        campoNome.addEventListener('input', () => {
            campoNome.dataset.autoGerado = campoNome.value.trim() === '' ? 'true' : 'false';
            autoMarcarEnquantoDigita();
        });
    }

    entrarComoUsuario();
    atualizarBotaoTema();
});
