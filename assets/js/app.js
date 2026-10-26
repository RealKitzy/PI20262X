/**
 * OBSERVATÓRIO DE PROPRIEDADE INTELECTUAL E HARDWARE ABERTO (BRASIL)
 * Projeto Integrador: Informática e Legislação
 * Equipe: Antonio Kayky Gonçalves Vieira, Giullian Bernard Alencar Maia,
 *         Ítalo Brito da Costa, Luís Aquiles Lucena Sá
 */

let ultimoProjetoAvaliado = null;
let ultimoDiagnostico = null;
let ultimaVerificacaoExistencia = null;
let cacheRegistrosFixos = [];

// Estado de Perfil de Acesso (Portal Inicial: 'USUARIO' em etapas guiadas vs. 'ADMIN' com liberdade total)
let perfilAcessoAtual = null; // 'USUARIO' | 'ADMIN'
let blocoAtualUsuario = 1; // 1 = Bloco 1, 2 = Bloco 2, 3 = Bloco 3
let etapaAbaLiberadaUsuario = 1; // 1 = Aba 01, 2 = Aba 02, 3 = Aba 03

// Acervo base inicial do INPI / OMPI / Open Hardware (sincronizado com database/schema.sql e api/anterioridade.php)
const ACERVO_BASE_INPI_PADRAO = [
    {
        protocolo_registro: 'INPI-MARCA-829451020',
        origem_base: 'ACERVO_INPI_MUNDIAL',
        nome_criacao_marca: 'Arduino Uno / Plataforma Arduino Oficial',
        titular_nome: 'Arduino AG / Arduino LLC',
        titular_documento: 'CHE-114.920.318',
        instituicao_empresa: 'Arduino SA (Suíça / Itália / EUA)',
        resumo_tecnico: 'Placa microcontroladora baseada em ATmega328P com esquemáticos abertos sob CC BY-SA 4.0, bootloader LGPL e marca nominativa e figurativa registrada exclusivamente.',
        palavras_chave: 'arduino uno atmega328p placa prototipagem genuino cc by-sa 4.0 bootloader ide',
        classificacao_cip: 'G06F 15/78 ; H05K 1/02',
        modalidade_protecao: 'Marca Registrada Exclusiva (Art. 129 LPI) + Hardware Aberto CC BY-SA',
        camadas_protegidas: 'Camada D (Marca Exclusiva) • Camadas A e E Abertas',
        status_juridico: 'OPEN_HARDWARE_MARCA_PROTEGIDA',
        hash_sha512: 'a94f82e10b73c91844d2e1109f83a71655c09e1288b4319a77e1209c84b51029a841029384756102938475610293847561029384756102938475610293847561',
        data_registro: '2008-04-15 10:00:00'
    },
    {
        protocolo_registro: 'INPI-PI-US8836922B2',
        origem_base: 'ACERVO_INPI_MUNDIAL',
        nome_criacao_marca: 'Waymo LiDAR Sensor de Varredura Óptica Autônoma (GBR3)',
        titular_nome: 'Waymo LLC / Alphabet Inc.',
        titular_documento: 'US-68-0623199',
        instituicao_empresa: 'Waymo LLC (Mountain View, CA)',
        resumo_tecnico: 'Sistema transdutor LiDAR de varredura a laser com placa PCB única de disparo de feixes ópticos e processamento de tempo de voo (ToF) para veículos autônomos.',
        palavras_chave: 'waymo lidar sensor laser varredura optica veiculo autonomo pcb disparo feixe tof',
        classificacao_cip: 'G01S 17/08 ; G01S 7/481',
        modalidade_protecao: 'Patente de Invenção Vigente (Art. 8º LPI) + Segredo Industrial',
        camadas_protegidas: 'Camada F (Patente PI) + Camada A/E (Segredo Industrial Art. 195 XI)',
        status_juridico: 'PROTEGIDO_EXCLUSIVO',
        hash_sha512: 'b72c91048573a1928374650192837465a9182736450192837465b82736451928374650192837465a9182736450192837465b8273645192837465019283746501',
        data_registro: '2014-09-16 14:20:00'
    },
    {
        protocolo_registro: 'INPI-TCI-BR302019000124',
        origem_base: 'ACERVO_INPI_MUNDIAL',
        nome_criacao_marca: 'Microarquitetura x86 Core & Topografia de Silício Multi-Cache',
        titular_nome: 'Intel Corporation',
        titular_documento: 'US-94-1672743',
        instituicao_empresa: 'Intel Corporation (Santa Clara, CA)',
        resumo_tecnico: 'Configuração tridimensional de 19 camadas de máscara litográfica CMOS em silício (arquivos GDSII) e microcódigo de controle de barramento.',
        palavras_chave: 'intel amd processador x86 topografia circuito integrado silicio mascara gdsii cache cmos',
        classificacao_cip: 'H01L 27/02 ; G06F 15/78',
        modalidade_protecao: 'Topografia de Circuito Integrado (Lei 11.484/07) + Direito Autoral de Microcódigo',
        camadas_protegidas: 'Camada C (Topografia Lei 11.484/07) + Camada E (Microcódigo)',
        status_juridico: 'PROTEGIDO_EXCLUSIVO',
        hash_sha512: 'c61d82930485761928374650192837465c8192039485761928374650192837465d91827364501928374650192837465e1928374650192837465019283746502',
        data_registro: '2019-06-10 09:15:00'
    },
    {
        protocolo_registro: 'INPI-MARCA-STF-RE1055951',
        origem_base: 'ACERVO_INPI_MUNDIAL',
        nome_criacao_marca: 'Marca G Gradiente iphone / Apple iPhone (Classe NCL 9)',
        titular_nome: 'IGB Eletrônica S.A. (Gradiente) / Apple Inc.',
        titular_documento: '43.185.362/0001-07',
        instituicao_empresa: 'IGB Eletrônica S.A. / Apple Inc.',
        resumo_tecnico: 'Signo distintivo nominativo e misto para aparelhos telefônicos e dispositivos móveis inteligentes na Classe NCL 9 perante o INPI e STF (Tema 1091).',
        palavras_chave: 'iphone gradiente apple smartphone telefone celular marca ncl 9 coexistencia inpi',
        classificacao_cip: 'H04M 1/02',
        modalidade_protecao: 'Registro de Marca Nominativa/Mista (Art. 124, XIX e Art. 129 da LPI)',
        camadas_protegidas: 'Camada D (Signo Distintivo Registrado no INPI)',
        status_juridico: 'PROTEGIDO_EXCLUSIVO',
        hash_sha512: 'd44e19283746501928374650192837465f91827364501928374650192837465a19283746501928374650192837465b1928374650192837465019283746500003',
        data_registro: '2000-03-20 11:30:00'
    },
    {
        protocolo_registro: 'INPI-PAT-ESPRESSIF-ESP32',
        origem_base: 'ACERVO_INPI_MUNDIAL',
        nome_criacao_marca: 'Módulo SoC ESP32-WROOM Wi-Fi & Bluetooth Low Energy Dual-Core',
        titular_nome: 'Espressif Systems (Shanghai) Co., Ltd.',
        titular_documento: 'CN-913101156746062445',
        instituicao_empresa: 'Espressif Systems',
        resumo_tecnico: 'Módulo transceptor integrado com microprocessador Xtensa Dual-Core 32-bit LX6, pilha RF Wi-Fi 802.11 b/g/n e Bluetooth BLE 4.2/5.0 pré-homologado na ANATEL.',
        palavras_chave: 'esp32 esp8266 wroom espressif modulo wifi bluetooth ble xtensa microcontrolador padrao',
        classificacao_cip: 'H04W 4/80 ; H01L 23/66',
        modalidade_protecao: 'Componente Comercial Protegido (Vedada apropriação do módulo em si por terceiros — Art. 8º LPI)',
        camadas_protegidas: 'Camadas C, D e F pertencentes ao fabricante do SoC',
        status_juridico: 'PROTEGIDO_EXCLUSIVO',
        hash_sha512: 'e88a91827364501928374650192837465c91827364501928374650192837465d91827364501928374650192837465f9182736450192837465019283746500004',
        data_registro: '2016-09-01 08:00:00'
    },
    {
        protocolo_registro: 'INPI-MARCA-RPI-85109234',
        origem_base: 'ACERVO_INPI_MUNDIAL',
        nome_criacao_marca: 'Raspberry Pi / Computador de Placa Única ARM (SBC)',
        titular_nome: 'Raspberry Pi Ltd / Raspberry Pi Foundation',
        titular_documento: 'UK-08207441',
        instituicao_empresa: 'Raspberry Pi Ltd (Cambridge, Reino Unido)',
        resumo_tecnico: 'Computador de placa única (Single Board Computer) com processador Broadcom ARM, barramento GPIO de 40 pinos, HDMI e conectividade sem fio sob marca registrada exclusiva.',
        palavras_chave: 'raspberry pi rp2040 pico sbc broadcom arm placa unica minicomputador gpio',
        classificacao_cip: 'G06F 1/16 ;G06F 15/78',
        modalidade_protecao: 'Marca Registrada Exclusiva (Art. 129 LPI) + Hardware Proprietário/Misto',
        camadas_protegidas: 'Camadas A, C, D e E protegidas pela Raspberry Pi Foundation',
        status_juridico: 'PROTEGIDO_EXCLUSIVO',
        hash_sha512: 'f12a91827364501928374650192837465c91827364501928374650192837465d91827364501928374650192837465f9182736450192837465019283746500005',
        data_registro: '2012-02-29 09:00:00'
    },
    {
        protocolo_registro: 'INPI-MARCA-FLIPPER-9182734',
        origem_base: 'ACERVO_INPI_MUNDIAL',
        nome_criacao_marca: 'Flipper Zero — Dispositivo Portátil Multitool Sub-GHz, RFID, NFC e Infravermelho',
        titular_nome: 'Flipper Devices Inc.',
        titular_documento: 'US-85-1928374',
        instituicao_empresa: 'Flipper Devices Inc. (Delaware, EUA)',
        resumo_tecnico: 'Aparelho eletrônico portátil baseado em STM32WB55 para inspeção de protocolos de rádio Sub-1GHz (CC1101), RFID 125kHz, NFC, Infravermelho e GPIO.',
        palavras_chave: 'flipper zero subghz rfid nfc infravermelho cc1101 stm32wb55 multitool radiofrequencia',
        classificacao_cip: 'H04B 1/38 ; G06K 7/10',
        modalidade_protecao: 'Marca Registrada Exclusiva (Art. 129 LPI) + Desenho Industrial (Art. 94 LPI)',
        camadas_protegidas: 'Camada B (Gabinete) e Camada D (Marca Exclusiva)',
        status_juridico: 'PROTEGIDO_EXCLUSIVO',
        hash_sha512: 'f23b91827364501928374650192837465c91827364501928374650192837465d91827364501928374650192837465f9182736450192837465019283746500006',
        data_registro: '2020-08-10 12:00:00'
    },
    {
        protocolo_registro: 'INPI-PAT-ALEXA-ECHO-881920',
        origem_base: 'ACERVO_INPI_MUNDIAL',
        nome_criacao_marca: 'Amazon Echo / Alexa — Assistente de Voz Inteligente com Matriz de Microfones',
        titular_nome: 'Amazon Technologies, Inc.',
        titular_documento: 'US-91-1646860',
        instituicao_empresa: 'Amazon.com, Inc. (Seattle, WA)',
        resumo_tecnico: 'Caixa de som e hub de automação residencial controlado por voz com matriz circular de microfones (beamforming), detecção de palavra de ativação (wake word) e integração em nuvem.',
        palavras_chave: 'alexa amazon echo assistente voz caixa som inteligente smart speaker automacao residencial microfone',
        classificacao_cip: 'G10L 15/22 ; H04R 1/40',
        modalidade_protecao: 'Patente de Invenção + Marca de Alto Renome (Art. 125 e Art. 129 LPI)',
        camadas_protegidas: 'Camadas B, D, E e F pertencentes à Amazon Technologies',
        status_juridico: 'PROTEGIDO_EXCLUSIVO',
        hash_sha512: 'f34c91827364501928374650192837465c91827364501928374650192837465d91827364501928374650192837465f9182736450192837465019283746500007',
        data_registro: '2014-11-06 15:00:00'
    },
    {
        protocolo_registro: 'INPI-PAT-AIRTAG-APPLE-99201',
        origem_base: 'ACERVO_INPI_MUNDIAL',
        nome_criacao_marca: 'Apple AirTag / Samsung SmartTag — Rastreador Bluetooth e Ultra-Wideband (UWB)',
        titular_nome: 'Apple Inc. / Samsung Electronics Co., Ltd.',
        titular_documento: 'US-94-2404110',
        instituicao_empresa: 'Apple Inc. (Cupertino, CA)',
        resumo_tecnico: 'Dispositivo localizador e chaveiro rastreador de objetos via rede mesh Bluetooth Low Energy (BLE) e chip Ultra-Wideband (UWB) para localização espacial de precisão.',
        palavras_chave: 'airtag smarttag apple samsung rastreador bluetooth chaveiro localizador uwb objetos perdidos',
        classificacao_cip: 'G01S 5/02 ; H04W 4/029',
        modalidade_protecao: 'Patente de Invenção + Desenho Industrial + Marca Registrada (LPI)',
        camadas_protegidas: 'Camadas B, C, D, E e F protegidas',
        status_juridico: 'PROTEGIDO_EXCLUSIVO',
        hash_sha512: 'f45d91827364501928374650192837465c91827364501928374650192837465d91827364501928374650192837465f9182736450192837465019283746500008',
        data_registro: '2021-04-20 10:00:00'
    },
    {
        protocolo_registro: 'INPI-PAT-STARLINK-TERMINAL',
        origem_base: 'ACERVO_INPI_MUNDIAL',
        nome_criacao_marca: 'Starlink — Antena Phased Array de Satélite LEO (SpaceX)',
        titular_nome: 'Space Exploration Technologies Corp. (SpaceX)',
        titular_documento: 'US-02-0593318',
        instituicao_empresa: 'SpaceX (Hawthorne, CA)',
        resumo_tecnico: 'Terminal transceptor de internet via satélite de baixa órbita (LEO) com antena plana de arranjo faseado (phased array) eletrônico e orientação motorizada automática.',
        palavras_chave: 'starlink spacex antena satelite internet phased array orbita baixa',
        classificacao_cip: 'H01Q 21/06 ; H04B 7/185',
        modalidade_protecao: 'Patente de Invenção + Topografia de Chip + Marca (LPI / Lei 11.484/07)',
        camadas_protegidas: 'Camadas A, B, C, D, E e F protegidas',
        status_juridico: 'PROTEGIDO_EXCLUSIVO',
        hash_sha512: 'f56e91827364501928374650192837465c91827364501928374650192837465d91827364501928374650192837465f9182736450192837465019283746500009',
        data_registro: '2020-10-01 11:00:00'
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
        }
    });
    return Array.from(unicos);
}

function calcularSimilaridadeTokensJS(tokensA, tokensB) {
    if (!tokensA.length || !tokensB.length) return 0;
    const setB = new Set(tokensB);
    const intersecao = tokensA.filter(t => setB.has(t));
    const uniaoSize = new Set([...tokensA, ...tokensB]).size;
    const jaccard = intersecao.length / Math.max(1, uniaoSize);
    const coberturaMenor = intersecao.length / Math.max(1, Math.min(tokensA.length, tokensB.length));
    return Number((((jaccard * 0.45) + (coberturaMenor * 0.55)) * 100).toFixed(1));
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
    // Fallback síncrono de 128 caracteres hexadecimais
    let h1 = 0xdeadbeef ^ entrada.length;
    let h2 = 0x41c6ce57 ^ entrada.length;
    for (let i = 0; i < entrada.length; i++) {
        const ch = entrada.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    let hex = '';
    for (let i = 0; i < 16; i++) {
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        hex += (h1 >>> 0).toString(16).padStart(8, '0');
    }
    return hex.substring(0, 128);
}

// Obtém todos os registros fixos combinando o banco SQL (via API) e o armazenamento persistente local
function obterRegistrosFixosLocais() {
    const salvosUsuario = JSON.parse(localStorage.getItem('registros_fixos_observatorio_pi') || '[]');
    const mapa = new Map();
    [...salvosUsuario, ...cacheRegistrosFixos, ...ACERVO_BASE_INPI_PADRAO].forEach(r => {
        if (r && r.protocolo_registro && !mapa.has(r.protocolo_registro)) {
            mapa.set(r.protocolo_registro, r);
        }
    });
    return Array.from(mapa.values());
}

function salvarRegistroFixoNoLocalStorage(novoReg) {
    const salvos = JSON.parse(localStorage.getItem('registros_fixos_observatorio_pi') || '[]');
    const filtrados = salvos.filter(r => r.protocolo_registro !== novoReg.protocolo_registro);
    filtrados.unshift(novoReg);
    localStorage.setItem('registros_fixos_observatorio_pi', JSON.stringify(filtrados));
}

// Inspetor Automático de Código-Fonte / Cabeçalho SPDX / Lista BOM
function inspecionarTrechoCodigo() {
    const campo = document.getElementById('trecho_codigo_inspecao');
    const aviso = document.getElementById('resultado-inspecao-codigo');
    if (!campo || !aviso) return;

    const textoBruto = campo.value.trim();
    const texto = textoBruto.toUpperCase();
    if (!texto) {
        aviso.textContent = 'O motor analisa automaticamente menções a SPDX, GPL, LGPL, MIT, CERN-OHL, CC BY-SA, TAPR e Solderpad no texto colado.';
        aviso.style.color = '';
        return;
    }

    // Verifica se o texto colado realmente parece um trecho de código-fonte, cabeçalho SPDX ou lista de bibliotecas (e não apenas "a" ou letras soltas)
    const temEstruturaCodigoOuLib = /(#include|#define|import\s|from\s|void\s|int\s|float\s|bool\s|char\s|const\s|let\s|var\s|function\s|def\s|class\s|struct\s|setup\s*\(|loop\s*\(|main\s*\(|serial\.|gpio|pinmode|digitalwrite|spdx|license|copyright|gpl|lgpl|mit|apache|bsd|cern|cc\s*by|tapr|solderpad|esp32|arduino|stm32|freertos|wire\.h|spi\.h|wifi\.h|mqtt|lora|[{}();=#\/\*])/i.test(textoBruto);

    if (textoBruto.length < 10 || !temEstruturaCodigoOuLib) {
        aviso.innerHTML = '⚠️ <strong>Conteúdo insuficiente para inspeção de código/licença:</strong> cole um trecho real de código-fonte (C/C++, Python, Verilog), cabeçalho <code>SPDX-License-Identifier</code> ou nome de biblioteca (ou deixe este campo opcional em branco).';
        aviso.style.color = '#f59e0b';
        return;
    }

    const detectados = [];

    if (texto.includes('GPL-3') || texto.includes('GPLV3') || texto.includes('GPL-2') || texto.includes('GNU GENERAL PUBLIC')) {
        document.getElementById('licenca_bibliotecas_terceiros').value = 'GPL_V2_V3';
        detectados.push('GNU GPL (Copyleft Forte no Firmware — Art. 9º Lei 9.609/98)');
    } else if (texto.includes('LGPL') || texto.includes('LESSER GENERAL PUBLIC')) {
        document.getElementById('licenca_bibliotecas_terceiros').value = 'LGPL_ESTATICA';
        detectados.push('GNU LGPL (Copyleft Fraco — Exige arquivos .o em linkedição estática)');
    } else if (texto.includes('MIT') || texto.includes('APACHE') || texto.includes('BSD')) {
        document.getElementById('licenca_bibliotecas_terceiros').value = 'MIT_BSD_APACHE';
        detectados.push('Licença Permissiva de Software (MIT/BSD/Apache)');
    }

    if (texto.includes('CERN-OHL-S') || texto.includes('CC BY-SA') || texto.includes('CC-BY-SA')) {
        document.getElementById('usa_hardware_aberto_terceiros').value = 'CERN_OHL_S';
        detectados.push('Hardware sob Reciprocidade Forte (CERN-OHL-S / CC BY-SA)');
    } else if (texto.includes('CERN-OHL-W')) {
        document.getElementById('usa_hardware_aberto_terceiros').value = 'CERN_OHL_W';
        detectados.push('Hardware sob Reciprocidade Fraca (CERN-OHL-W)');
    } else if (texto.includes('CERN-OHL-P') || texto.includes('TAPR') || texto.includes('SOLDERPAD')) {
        document.getElementById('usa_hardware_aberto_terceiros').value = 'CERN_OHL_P';
        detectados.push('Hardware sob Licença Permissiva (CERN-OHL-P / TAPR / Solderpad)');
    }

    if (detectados.length > 0) {
        aviso.innerHTML = `<strong>Inspeção Concluída:</strong> Identificamos no código/cabeçalho: ${detectados.join(' + ')}. Os seletores da arquitetura foram ajustados automaticamente.`;
        aviso.style.color = '#fb923c';
    } else {
        aviso.textContent = 'Estrutura de código/biblioteca válida analisada: nenhum identificador restritivo (GPL/CERN-OHL-S) detectado.';
        aviso.style.color = '#10b981';
    }
    atualizarBadgesAutoMarcacao();
}

// Tabela de Referência de Custos Oficiais (GRU INPI) e Vigências das 6 Camadas
const TABELA_CUSTOS_INPI = {
    PI: {
        sistema: 'e-Patentes (INPI) — Camada F',
        taxa_desconto: 'R$ 70,00 (Depósito) + R$ 236,00 (Exame Técnico)',
        taxa_cheia: 'R$ 175,00 (Depósito) + R$ 590,00 (Exame Técnico)',
        prazo_medio: 'Vigência de 20 anos (Art. 8º e Art. 40 da Lei 9.279/96)'
    },
    MU: {
        sistema: 'e-Patentes (INPI) — Camada F',
        taxa_desconto: 'R$ 70,00 (Depósito) + R$ 152,00 (Exame Técnico)',
        taxa_cheia: 'R$ 175,00 (Depósito) + R$ 380,00 (Exame Técnico)',
        prazo_medio: 'Vigência de 15 anos (Art. 9º e Art. 40 da Lei 9.279/96)'
    },
    TCI: {
        sistema: 'e-Chip / Topografia (INPI) — Camada C',
        taxa_desconto: 'R$ 166,00 (Pedido de Registro Único)',
        taxa_cheia: 'R$ 415,00 (Pedido de Registro Único)',
        prazo_medio: 'Vigência de 10 anos a contar do depósito ou 1ª exploração (Lei 11.484/07, Art. 35)'
    },
    MARCA: {
        sistema: 'e-Marcas (INPI) — Camada D',
        taxa_cheia: 'R$ 355,00 (Pedido com especificação pré-aprovada)',
        taxa_desconto: 'R$ 142,00 (Pedido com especificação pré-aprovada)',
        prazo_medio: 'Vigência de 10 anos, renovável indefinidamente (Art. 129 e 133 da LPI)'
    },
    RPC: {
        sistema: 'e-Software (INPI — Hash SHA-512) — Camada E',
        taxa_desconto: 'R$ 185,00 (Taxa Única — Registro Probatório)',
        taxa_cheia: 'R$ 185,00 (Taxa Única — Registro Probatório)',
        prazo_medio: 'Vigência de 50 anos a partir de 1º/jan do ano seguinte (Lei 9.609/98, Art. 2º, § 2º)'
    },
    DI: {
        sistema: 'e-Desenho Industrial (INPI) — Camada B',
        taxa_desconto: 'R$ 94,00 (Depósito Inicial)',
        taxa_cheia: 'R$ 235,00 (Depósito Inicial)',
        prazo_medio: 'Vigência de 10 anos, renovável até 25 anos (Art. 94 e Art. 108 da LPI)'
    }
};

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
        campoNome.dataset.autoGerado = 'true';
    }
    document.getElementById('autor_nome').value = '';
    document.getElementById('autor_documento').value = '';
    document.getElementById('autor_email').value = '';
    document.getElementById('instituicao_empresa').value = '';
    document.getElementById('resumo_tecnico').value = '';
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

    const campoCodigo = document.getElementById('trecho_codigo_inspecao');
    if (campoCodigo) {
        campoCodigo.value = '';
        inspecionarTrechoCodigo();
    }

    atualizarBadgesAutoMarcacao();

    atualizarBalaoMascote(
        'AUTO-MARCAÇÃO INTELIGENTE PRONTA • APENAS DESCREVA SEU PROJETO',
        'Digite o nome e a descrição da sua criação. O sistema marca todos os parâmetros jurídicos sozinho!',
        'Você não precisa escolher leis nem preencher dezenas de seletores. Basta escrever o que o seu projeto faz no campo principal e o motor auto-identificará as 6 camadas, as normas do INPI/ANATEL/LGPD e verificará se a criação já existe.'
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
// Exige Estrutura Bipartida: (1) Meio Técnico / Componente + (2) Ação / Finalidade
// =========================================================================
function validarSuficienciaDescritivaProjeto(textoRelato, nomeProjeto = '', trechoCodigo = '') {
    const relatoLimpo = (textoRelato || '').trim();
    const textoCompleto = `${nomeProjeto} ${relatoLimpo}`.trim();

    if (relatoLimpo.length < 25) {
        return {
            valido: false,
            score_suficiencia: 10,
            motivo: 'Descrição muito curta (Art. 24 da Lei nº 9.279/96 — Insuficiência Descritiva).',
            orientacao: 'Descreva com pelo menos uma frase completa o que é o seu projeto, quais componentes ou tecnologias ele usa e qual problema técnico ele resolve.'
        };
    }

    // Divide em palavras alfabéticas/alfanuméricas reais
    const palavras = relatoLimpo
        .toLowerCase()
        .replace(/[^a-záàãâäéèêëíìîïóòõôöúùûüç0-9\s\-]/gi, ' ')
        .split(/\s+/)
        .filter(p => p.length >= 2);

    if (palavras.length < 5) {
        return {
            valido: false,
            score_suficiencia: 15,
            motivo: 'Texto sem estrutura de frase descritiva (Art. 24 da LPI — Exigência de Suficiência Descritiva).',
            orientacao: `Você digitou apenas ${palavras.length} palavra(s) isolada(s). Para que o motor jurídico possa verificar a existência e enquadrar nas leis, escreva uma frase descritiva real (mínimo de 5 palavras explicando componentes e finalidade).`
        };
    }

    // Verifica proporção de vogais e sequências de consoantes (detector de "teclado batido" / gibberish)
    const apenasLetras = relatoLimpo.toLowerCase().replace(/[^a-záàãâäéèêëíìîïóòõôöúùûüç]/gi, '');
    const vogais = (apenasLetras.match(/[aeiouáàãâäéèêëíìîïóòõôöúùûü]/gi) || []).length;
    const proporcaoVogais = apenasLetras.length > 0 ? (vogais / apenasLetras.length) : 0;

    const temSequenciaCaotica = /[bcdfghjklmnpqrstvwxz]{6,}/i.test(apenasLetras) || /(.)\1{4,}/i.test(apenasLetras);
    const palavrasValidasPt = palavras.filter(p => /[aeiouáàãâéêíóôõú0-9]/i.test(p) && !/[bcdfghjklmnpqrstvwxz]{5,}/i.test(p));

    if (temSequenciaCaotica || proporcaoVogais < 0.22 || proporcaoVogais > 0.78 || (palavrasValidasPt.length / palavras.length) < 0.6) {
        return {
            valido: false,
            score_suficiencia: 5,
            motivo: 'Sequência de caracteres aleatórios / sem sentido semântico detectada ("Gibberish").',
            orientacao: 'O texto inserido parece conter letras aleatórias sem formar palavras reais. Pelo Art. 24 da Lei nº 9.279/96 (LPI), um pedido de proteção exige descrição clara e suficiente do objeto técnico.'
        };
    }

    // EIXO 1: Meios Técnicos / Componentes Físicos, Eletrônicos ou de Software
    const regexMeioTecnico = /\b(sensor|sensores|placa|pcb|circuito|arduino|esp32|esp8266|stm32|raspberry|rp2040|microcontrolador|microprocessador|processador|chip|semicondutor|asic|fpga|iot|lora|lorawan|wifi|wi-fi|bluetooth|ble|zigbee|rf|rfid|nfc|antena|mqtt|firmware|software|algoritmo|aplicativo|app|modulo|gabinete|carcaca|3d|robo|motor|atuador|valvula|rele|bateria|painel|solar|sonda|camera|laser|lidar|optico|optica|led|display|tela|usb|serial|i2c|spi|uart|canbus|modbus|drone|rastreador|gps|medidor|oximetro|eletrodo|transceptor|transdutor|gateway|servidor)\b/gi;

    // EIXO 2: Finalidade Funcional / Ação Técnica / Problema Resolvido
    const regexFinalidadeFuncional = /\b(medir|medicao|mede|monitorar|monitoramento|monitora|controlar|controle|controla|automatizar|automacao|automatico|automatica|detectar|deteccao|detecta|transmitir|transmissao|transmite|acionar|acionamento|aciona|irrigacao|irrigar|agricola|agricultura|solo|umidade|temperatura|pressao|vazao|energia|consumo|economizar|economia|medico|medica|saude|hospitalar|batimento|cardiaco|vital|vitais|paciente|seguranca|alarme|trava|fechadura|acesso|industrial|residencial|telemetria|rastreamento|localizacao|autonomo|autonoma|navegacao|processamento|analise|alerta|leitura|captura|coleta)\b/gi;

    const textoNorm = normalizarTextoComparacaoJS(textoCompleto);
    const meiosEncontrados = [...new Set((textoNorm.match(regexMeioTecnico) || []).map(x => x.toLowerCase()))];
    const finalidadesEncontradas = [...new Set((textoNorm.match(regexFinalidadeFuncional) || []).map(x => x.toLowerCase()))];
    const termosUnicos = [...new Set([...meiosEncontrados, ...finalidadesEncontradas])];

    if (meiosEncontrados.length === 0 && finalidadesEncontradas.length === 0) {
        return {
            valido: false,
            score_suficiencia: 20,
            motivo: 'Frase fora de contexto tecnológico — Ausência de Componentes e de Finalidade Técnica (Art. 10 e Art. 24 da LPI).',
            orientacao: 'O texto digitado é uma frase comum sem relação com um projeto de Engenharia, Hardware, IoT ou Software. Para validar um projeto real, descreva: (1) QUAIS componentes/tecnologias você usou (ex: ESP32, sensor, placa PCB, software, gabinete) e (2) PARA QUE ele serve (ex: monitorar temperatura, controlar irrigação, medir batimentos).'
        };
    }

    if (meiosEncontrados.length === 0 || finalidadesEncontradas.length === 0) {
        const faltaOQue = meiosEncontrados.length === 0
            ? 'faltou informar QUAL componente técnico, hardware, sensor ou software compõe o projeto (ex: placa PCB, ESP32, sensor, microcontrolador, firmware, aplicativo)'
            : 'faltou explicar QUAL é a função prática ou problema que o projeto resolve (ex: monitorar, controlar, medir temperatura, automatizar irrigação, transmitir dados)';
        return {
            valido: false,
            score_suficiencia: 40,
            motivo: 'Descrição Técnica Incompleta — Falta nexo entre Componente e Função (Art. 24 da LPI e IN INPI nº 30/2013).',
            orientacao: `Para não aceitar frases soltas sem contexto, o sistema exige a estrutura real do INPI (Meio Técnico + Função). No seu texto, ${faltaOQue}.`
        };
    }

    // Cálculo de Score de Suficiência Descritiva (0 a 100%)
    const score = Math.min(100, 50 + (meiosEncontrados.length * 12) + (finalidadesEncontradas.length * 12) + Math.min(20, Math.floor(palavras.length * 1.1)));

    return {
        valido: true,
        score_suficiencia: score,
        termos_tecnicos_detectados: termosUnicos,
        meios_detectados: meiosEncontrados,
        finalidades_detectadas: finalidadesEncontradas,
        quantidade_palavras: palavras.length,
        motivo: `Suficiência Descritiva Aprovada (${score}% — Art. 24 da LPI): ${meiosEncontrados.length} componente(s) técnico(s) + ${finalidadesEncontradas.length} função(ões) prática(s) verificada(s).`,
        orientacao: ''
    };
}

// Auto-marca todos os 14 parâmetros técnicos e jurídicos em tempo real enquanto o usuário digita (sem exigir clique extra)
function autoMarcarEnquantoDigita() {
    const campo = document.getElementById('relato_livre_usuario');
    const campoNome = document.getElementById('nome_projeto');
    const textoRelato = campo ? campo.value.trim() : '';
    const textoNome = campoNome ? campoNome.value.trim() : '';
    if (!textoRelato && !textoNome) {
        atualizarBadgesAutoMarcacao();
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
        if (!modoSilencioso) {
            alert('Por favor, descreva seu projeto de hardware/IoT e o que você deseja patentear ou proteger no campo de texto.');
            campo.focus();
        }
        return;
    }

    // Validação de Suficiência Descritiva (Art. 24 da LPI) para evitar auto-marcação falsa em texto sem sentido
    const validacaoSuficiencia = validarSuficienciaDescritivaProjeto(textoOriginal, nomeManual);
    if (!validacaoSuficiencia.valido) {
        if (feedback) {
            feedback.style.display = 'block';
            feedback.innerHTML = `
                <div style="padding: 0.75rem 1rem; border-radius: 10px; background: rgba(239, 68, 68, 0.14); border: 1px solid #ef4444; color: #fca5a5;">
                    <strong style="color: #f87171; display: block; margin-bottom: 0.3rem;">
                        🚫 ${validacaoSuficiencia.motivo} (Índice de Suficiência: ${validacaoSuficiencia.score_suficiencia}%)
                    </strong>
                    <span style="font-size: 0.85rem; color: #fee2e2;">${validacaoSuficiencia.orientacao}</span>
                </div>
            `;
        }
        if (!modoSilencioso) {
            alert(`Descrição Inválida / Insuficiente (Art. 24 da LPI):\n\n${validacaoSuficiencia.motivo}\n\n${validacaoSuficiencia.orientacao}`);
            campo.focus();
        }
        return;
    }

    const t = `${nomeManual} ${textoRelato}`.toLowerCase();
    const achados = [];

    // 1. Identificar Titularidade / Vínculo (Art. 6º, 88-93 LPI, Art. 4º Lei 9.609/98 e Lei 10.973/04)
    let titularidade = 'AUTONOMO_EMPRESA';
    let instituicao = 'Desenvolvimento Independente / Startup de Hardware & IoT';
    if (/(faculdade|universidade|tcc|laborat[oó]rio|ict|inicia[cç][aã]o cient[ií]fica|orientador|professor|mestrado|instituto federal|academic)/i.test(t)) {
        titularidade = 'VINCULO_EMPREGATICIO_ICT';
        instituicao = 'Universidade / ICT (Gestão via Núcleo de Inovação Tecnológica — NIT)';
        achados.push('<strong>Titularidade Acadêmica / ICT (Lei nº 10.973/2004, Art. 16 e Art. 88 da LPI):</strong> projetos desenvolvidos utilizando infraestrutura universitária exigem comunicação formal ao NIT para definição de cotitularidade e depósito no INPI.');
    } else if (/(s[oó]cio|cofundador|amigo|parceria|dupla|equipe|dividir|grupo|nossa equipe|desenvolvemos|criamos)/i.test(t)) {
        titularidade = 'PARCERIA_COAUTORIA';
        instituicao = 'Sociedade de Cofundadores / Cotitularidade Técnica';
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
    const temDesign = /(carca[cç]a|gabinete|3d|design|est[eé]tic|pl[aá]stic|formato|anat[oô]mic|pulseira|caixa|ornamental|inv[oó]lucro|imperme[aá]vel)/i.test(t);
    const temFirmware = !/(sem software|sem firmware|apenas mec[aâ]nico)/i.test(t);

    if (temChip) achados.push('<strong>Camada C — Semicondutores / Topografia de Chip (Lei nº 11.484/2007, Arts. 26 a 55):</strong> proteção específica de 10 anos para o leiaute tridimensional de máscaras de silício e elegibilidade fiscal ao PADIS.');
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

    // Preservar o nome do projeto digitado manualmente pelo usuário, ou atualizar dinamicamente caso esteja vazio/autoGerado
    if (campoNome && (!nomeManual || campoNome.dataset.autoGerado === 'true')) {
        const primeiraFrase = textoOriginal.split(/[.!?]/)[0].trim();
        const tituloGerado = primeiraFrase.length > 78
            ? `${primeiraFrase.substring(0, 78)}...`
            : primeiraFrase;
        campoNome.value = tituloGerado;
        campoNome.dataset.autoGerado = 'true';
    }
    if (!modoSilencioso) {
        if (!document.getElementById('autor_nome').value.trim()) {
            document.getElementById('autor_nome').value = 'Projetista(s) / Inventor(es) do Dispositivo';
        }
        if (!document.getElementById('autor_documento').value.trim()) {
            document.getElementById('autor_documento').value = '12.345.678/0001-90';
        }
        if (!document.getElementById('autor_email').value.trim()) {
            document.getElementById('autor_email').value = 'engenharia@projetoavaliado.com.br';
        }
    }
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

    // Reaplicar inspeção de cabeçalho de código caso o usuário também tenha colado código
    const campoCodigo = document.getElementById('trecho_codigo_inspecao');
    if (campoCodigo && campoCodigo.value.trim()) {
        inspecionarTrechoCodigo();
    } else {
        atualizarBadgesAutoMarcacao();
    }

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
            'Identificamos se a sua criação já existe na base fixa ou nas bases globais e se você pode reivindicá-la em seu nome. Confira na <strong>Aba 02</strong> o painel de verificação de existência e o botão para <strong>fixar a titularidade no banco de dados</strong>.'
        );
    }

    if (gerarDireto) {
        processarDiagnostico(null);
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
        trecho_codigo: trechoCodigo
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
                if (!bloqueioTerceiro || itemColisao.similaridade_percentual > bloqueioTerceiro.similaridade_percentual) {
                    bloqueioTerceiro = itemColisao;
                }
            }
        }
    });

    colisoesEncontradas.sort((a, b) => b.similaridade_percentual - a.similaridade_percentual);

    const checkSuficiencia = validarSuficienciaDescritivaProjeto(dados.resumo_tecnico, dados.nome_projeto, trechoCodigo);

    let statusApropriacao = 'DISPONIVEL_EXCLUSIVO';
    let podeRegistrar = true;
    let tituloVeredito = 'CRIAÇÃO INÉDITA E DISPONÍVEL — Você Pode Reivindicar e Fixar como Sua!';
    let explicacaoVeredito = 'Verificamos a base fixa do Observatório e o acervo de patentes/marcas: não há registro bloqueante em nome de terceiros colidindo com a sua criação. Sua arquitetura apresenta originalidade e atende aos requisitos dos Arts. 6º, 8º/9º, 24 e 129 da Lei nº 9.279/96 (LPI) e da Lei nº 9.609/98.';

    if (!checkSuficiencia.valido) {
        statusApropriacao = 'BLOQUEADO_TERCEIRO';
        podeRegistrar = false;
        tituloVeredito = 'IMPEDIMENTO POR INSUFICIÊNCIA DESCRITIVA (Art. 24 da Lei nº 9.279/96 — LPI)';
        explicacaoVeredito = `${checkSuficiencia.motivo} ${checkSuficiencia.orientacao} Sem uma descrição técnica real e inteligível do dispositivo ou sistema, o pedido é nulo de pleno direito perante o INPI (Art. 24 e Art. 50 da LPI).`;
    } else if (registroDoProprioUsuario) {
        statusApropriacao = 'JA_PERTENCE_AO_USUARIO';
        podeRegistrar = true;
        tituloVeredito = `CRIAÇÃO JÁ REGISTRADA E FIXADA EM SEU NOME (${registroDoProprioUsuario.protocolo_registro})`;
        explicacaoVeredito = `O sistema identificou que este projeto/marca já consta gravado no banco de dados fixo sob a titularidade do seu próprio CPF/CNPJ (${registroDoProprioUsuario.titular_nome}). Sua reserva de anterioridade e prova de autoria SHA-512 estão ativas e protegidas.`;
    } else if (bloqueioTerceiro) {
        statusApropriacao = 'BLOQUEADO_TERCEIRO';
        podeRegistrar = false;
        tituloVeredito = `IMPEDIMENTO LEGAL: Criação ou Marca Já Existe e Pertence a Terceiro (${bloqueioTerceiro.protocolo_registro})`;
        explicacaoVeredito = `Não é possível apropriar-se diretamente desta criação como sua: detectamos colisão direta (${bloqueioTerceiro.similaridade_percentual}% de superposição / colisão nominativa) com o ativo "${bloqueioTerceiro.nome_criacao_marca}", já registrado sob titularidade de ${bloqueioTerceiro.titular_nome} (${bloqueioTerceiro.instituicao_empresa}). Pelo Art. 11 (Estado da Técnica), Art. 124, XIX (proibição de reprodução de marca alheia) e Art. 195 da Lei nº 9.279/96, para registrar uma versão própria você deve: (1) adotar um nome comercial/marca distinto; e (2) especificar uma melhoria construtiva/funcional própria (Modelo de Utilidade — Art. 9º da LPI) ou reimplementação limpa.`;
    } else if (dados.divulgacao_previa === 'DIVULGADO_MAIS_12M') {
        statusApropriacao = 'PARCIAL_ESTADO_DA_TECNICA';
        podeRegistrar = true;
        tituloVeredito = 'APROPRIAÇÃO PARCIAL: Patente Impedida pelo Estado da Técnica (Art. 11 LPI), mas Marca e Código Podem Ser Seus';
        explicacaoVeredito = 'Como a criação foi divulgada há mais de 12 meses, a solução técnica física já caiu no Estado da Técnica (Art. 11 e Art. 12 da LPI) e não pode mais ser patenteada com exclusividade. Porém, você PODE registrar e colocar em seu nome a Marca Comercial (Art. 129 da LPI) e o Código-Fonte do Firmware (Lei nº 9.609/98).';
    } else if (dados.grau_novidade_hardware === 'MODULOS_PRONTOS_COTS') {
        statusApropriacao = 'PARCIAL_MODULOS_COMERCIAIS';
        podeRegistrar = true;
        tituloVeredito = 'APROPRIAÇÃO PARCIAL: Hardware Base já Existe no Mercado, mas Você Pode Registrar Sua Marca, Firmware e PCB';
        explicacaoVeredito = 'Os módulos eletrônicos comerciais utilizados (COTS) já pertencem aos seus respectivos fabricantes e ao estado da técnica (Art. 8º e Art. 10, V da LPI). Você não pode patentear o hardware base como invenção sua, mas PODE colocar como sua propriedade exclusiva: (1) a Marca do seu produto (Art. 129 LPI); (2) o seu Código-Fonte/Firmware autoral (Lei 9.609/98); e (3) o desenho específico da sua PCB/Gabinete (Lei 9.610/98 e Art. 94 LPI).';
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
            tituloVeredito = `TITULARIDADE FIXADA COM SUCESSO! Protocolo Oficial: ${protocoloGerado}`;
            explicacaoVeredito = 'Sua criação foi gravada de forma permanente no banco de dados fixo do Observatório com resumo criptográfico SHA-512 (Art. 3º da Lei nº 9.609/98 e Art. 6º/129 da Lei nº 9.279/96). A partir deste momento, qualquer tentativa de terceiro de reivindicar projeto ou marca idêntica será automaticamente detectada e bloqueada pelo sistema.';
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
        registro_gravado: novoRegistroGravado,
        registros_fixos: obterRegistrosFixosLocais()
    };
}

// Busca em Tempo Real no Estado da Técnica Mundial (OpenAlex API + GitHub API + Links Diretos INPI/Google Patents)
async function buscarEstadoDaTecnicaMundialAoVivo(dados, diag) {
    const painelMundial = document.getElementById('painel-anterioridade-mundial');
    if (!painelMundial) return;

    const corr = diag.correlacao_patentaria || gerarCorrelacaoPatentariaReal(dados, diag);
    const tokens = extrairTokensTecnicosJS(`${dados.nome_projeto} ${dados.resumo_tecnico}`);
    const queryTermos = tokens.slice(0, 5).join(' ') || 'embedded iot hardware sensor';
    const cipPrincipal = (corr.codigos_cip[0] || 'G05B 19/042').split(' (')[0].trim();

    const urlGooglePatents = `https://patents.google.com/?q=${encodeURIComponent(queryTermos)}&oq=${encodeURIComponent(cipPrincipal)}`;
    const urlEspacenet = `https://worldwide.espacenet.com/patent/search?q=${encodeURIComponent(queryTermos)}`;
    const urlInpiBusca = `https://busca.inpi.gov.br/pePI/`;

    painelMundial.innerHTML = `
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.8rem;">
            Consultando em tempo real bases abertas globais de artigos/patentes (<strong>OpenAlex API</strong>) e repositórios de hardware/firmware (<strong>GitHub API</strong>) para os termos: <code>${queryTermos}</code>...
        </p>
    `;

    let obrasOpenAlex = [];
    let reposGithub = [];

    try {
        const respOa = await fetch(`https://api.openalex.org/works?search=${encodeURIComponent(queryTermos)}&per-page=3`);
        if (respOa.ok) {
            const jsonOa = await respOa.json();
            if (jsonOa && Array.isArray(jsonOa.results)) {
                obrasOpenAlex = jsonOa.results;
            }
        }
    } catch (e) {}

    try {
        const respGh = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(tokens.slice(0, 3).join(' ') + ' hardware OR iot OR esp32 OR pcb')}&sort=stars&per_page=3`);
        if (respGh.ok) {
            const jsonGh = await respGh.json();
            if (jsonGh && Array.isArray(jsonGh.items)) {
                reposGithub = jsonGh.items;
            }
        }
    } catch (e) {}

    let html = `
        <div style="display: flex; flex-wrap: wrap; gap: 0.55rem; margin-bottom: 1rem;">
            <a href="${urlInpiBusca}" target="_blank" rel="noopener" class="btn-secondary" style="text-decoration:none;padding:0.45rem 0.85rem;font-size:0.78rem;">
                🔗 Abrir Busca Oficial do INPI (pePI) ↗
            </a>
            <a href="${urlGooglePatents}" target="_blank" rel="noopener" class="btn-secondary" style="text-decoration:none;padding:0.45rem 0.85rem;font-size:0.78rem;">
                🔗 Buscar no Google Patents (${cipPrincipal}) ↗
            </a>
            <a href="${urlEspacenet}" target="_blank" rel="noopener" class="btn-secondary" style="text-decoration:none;padding:0.45rem 0.85rem;font-size:0.78rem;">
                🔗 Buscar na Espacenet (OMPI/EPO) ↗
            </a>
        </div>
    `;

    if (obrasOpenAlex.length > 0 || reposGithub.length > 0) {
        const totalAchadosMundo = obrasOpenAlex.length + reposGithub.length;
        html += `
            <div class="alert-card alert-ATENCAO" style="margin-bottom: 0.9rem; padding: 0.85rem 1rem;">
                <span class="inpi-badge">⚠️ ESTADO DA TÉCNICA MUNDIAL EXISTENTE (${totalAchadosMundo} SIMILARES ENCONTRADOS)</span>
                <h4 style="font-size: 0.95rem; margin-top: 0.25rem;">Atenção (Art. 11 da Lei nº 9.279/96): Já existem projetos ou artigos similares no mundo!</h4>
                <p style="font-size: 0.82rem; margin: 0.25rem 0 0;">
                    Você <strong>NÃO pode patentear o conceito geral</strong> já publicado abaixo (pois já integra o Estado da Técnica mundial). Para que o seu pedido seja deferido no site oficial do <strong>INPI (e-Patentes / pePI)</strong>, você deverá restringir sua reivindicação apenas ao seu <strong>diferencial construtivo inédito</strong> (parte <em>"Caracterizado por..."</em>) e validar formalmente na base oficial do INPI.
                </p>
            </div>
        `;
    }

    if (obrasOpenAlex.length > 0) {
        html += `<div style="margin-bottom: 0.85rem;"><strong style="font-size:0.84rem;color:var(--orange-light);display:block;margin-bottom:0.4rem;">Publicações e Anterioridades Científico-Tecnológicas Encontradas (Art. 11 LPI):</strong>`;
        obrasOpenAlex.forEach(obra => {
            const titulo = obra.title || 'Publicação Técnica Internacional';
            const ano = obra.publication_year || 's/d';
            const link = obra.doi || obra.id || urlGooglePatents;
            const autor = (obra.authorships && obra.authorships[0] && obra.authorships[0].author)
                ? obra.authorships[0].author.display_name
                : 'Base Internacional OpenAlex';
            html += `
                <div style="padding:0.55rem 0.75rem;margin-bottom:0.45rem;background:rgba(255,255,255,0.03);border-left:3px solid var(--accent-primary);border-radius:6px;font-size:0.82rem;">
                    <a href="${link}" target="_blank" rel="noopener" style="color:#fed7aa;font-weight:600;text-decoration:none;">${titulo} (${ano}) ↗</a>
                    <div style="color:var(--text-secondary);font-size:0.77rem;margin-top:0.15rem;">Autor/Fonte: ${autor} • Pertence ao Estado da Técnica (Art. 11 LPI — diferencie sua Reivindicação nº 1 na parte <em>"Caracterizado por..."</em>)</div>
                </div>
            `;
        });
        html += `</div>`;
    }

    if (reposGithub.length > 0) {
        html += `<div><strong style="font-size:0.84rem;color:var(--orange-light);display:block;margin-bottom:0.4rem;">Repositórios Globais de Hardware/Firmware Similares (GitHub Live):</strong>`;
        reposGithub.forEach(repo => {
            const lic = (repo.license && repo.license.spdx_id) ? repo.license.spdx_id : 'Sem Licença Explícita (Direito Autoral Retido)';
            html += `
                <div style="padding:0.55rem 0.75rem;margin-bottom:0.45rem;background:rgba(255,255,255,0.03);border-left:3px solid #38bdf8;border-radius:6px;font-size:0.82rem;">
                    <a href="${repo.html_url}" target="_blank" rel="noopener" style="color:#bae6fd;font-weight:600;text-decoration:none;">${repo.full_name} (★ ${repo.stargazers_count}) ↗</a>
                    <div style="color:var(--text-secondary);font-size:0.77rem;margin-top:0.15rem;">Licença: <code>${lic}</code> • ${repo.description ? repo.description.substring(0, 110) : 'Projeto público embarcado'}</div>
                </div>
            `;
        });
        html += `</div>`;
    }

    if (obrasOpenAlex.length === 0 && reposGithub.length === 0) {
        html += `
            <div class="alert-card alert-SUCESSO" style="margin:0;">
                <h4>Nenhuma Anterioridade Idêntica Detectada na Consulta Automática</h4>
                <p style="font-size:0.84rem;">Utilize os botões diretos acima para confirmar a busca formal na base pePI do INPI e no Google Patents com a classe <strong>${cipPrincipal}</strong>.</p>
            </div>
        `;
    }

    painelMundial.innerHTML = html;
}

// Renderiza todo o Painel de Verificação de Existência, Colisões e Tabela Fixa de Titularidades
function renderizarPainelVerificacaoExistencia(verif) {
    ultimaVerificacaoExistencia = verif;
    const painelVeredito = document.getElementById('painel-veredito-apropriacao');
    const painelColisoes = document.getElementById('painel-colisoes-internas');
    const btnRegistrar = document.getElementById('btn-registrar-titularidade-fixa');
    const tbodyFixos = document.getElementById('tabela-registros-fixos-body');

    if (painelVeredito && verif) {
        let classeAlerta = 'alert-SUCESSO';
        let badgeTexto = 'DISPONÍVEL PARA REGISTRO E APROPRIAÇÃO LEGÍTIMA';

        if (verif.status_apropriacao === 'BLOQUEADO_TERCEIRO') {
            classeAlerta = 'alert-CRITICO';
            badgeTexto = 'BLOQUEADO • CRIAÇÃO OU MARCA JÁ EXISTE EM NOME DE TERCEIRO';
        } else if (verif.status_apropriacao === 'PARCIAL_ESTADO_DA_TECNICA' || verif.status_apropriacao === 'PARCIAL_MODULOS_COMERCIAIS') {
            classeAlerta = 'alert-ATENCAO';
            badgeTexto = 'APROPRIAÇÃO PARCIAL • PROTEÇÃO DE MARCA, FIRMWARE E LAYOUT';
        } else if (verif.status_apropriacao === 'JA_PERTENCE_AO_USUARIO' || verif.status_apropriacao === 'REGISTRADO_COM_SUCESSO') {
            classeAlerta = 'alert-SUCESSO';
            badgeTexto = 'TITULARIDADE FIXADA E PROTEGIDA NO BANCO DE DADOS';
        }

        painelVeredito.innerHTML = `
            <div class="alert-card ${classeAlerta}" style="margin-bottom: 0;">
                <span class="inpi-badge">${badgeTexto}</span>
                <h3 style="font-size: 1.18rem; margin: 0.35rem 0 0.5rem;">${verif.titulo_veredito}</h3>
                <p style="margin-bottom: 0.75rem; line-height: 1.65;">${verif.explicacao_veredito}</p>
                <div style="background: rgba(10, 8, 18, 0.75); border: 1px solid rgba(249, 115, 22, 0.35); border-radius: 8px; padding: 0.65rem 0.95rem; font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; color: #fed7aa; word-break: break-all; margin-bottom: 0.85rem;">
                    <strong>Impressão Digital Criptográfica (Hash SHA-512 — Art. 3º Lei 9.609/98):</strong> ${verif.hash_sha512_calculado}
                </div>
                <div style="background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.45); border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.82rem; color: #fef3c7; line-height: 1.55;">
                    ⚖️ <strong>AVISO LEGAL OBRIGATÓRIO — VALIDAÇÃO OFICIAL NO INPI (AUTARQUIA FEDERAL):</strong> Este diagnóstico constitui <strong>triagem técnico-jurídica preliminar e prova de anterioridade/autoria (SHA-512)</strong> no Observatório Acadêmico. Conforme os <strong>Arts. 6º, 19, 30 e 129 da Lei nº 9.279/96 (LPI)</strong>, a concessão estatal definitiva de Carta-Patente ou Certificado de Marca exige <strong>validação e protocolo oficial diretamente no portal do INPI (<a href="https://busca.inpi.gov.br/pePI/" target="_blank" rel="noopener" style="color: #fbbf24; text-decoration: underline; font-weight: 700;">busca.inpi.gov.br/pePI ↗</a> / <a href="https://www.gov.br/inpi/pt-br" target="_blank" rel="noopener" style="color: #fbbf24; text-decoration: underline; font-weight: 700;">gov.br/inpi ↗</a>)</strong> mediante recolhimento de GRU e exame técnico pelos examinadores federais.
                </div>
            </div>
        `;
    }

    if (btnRegistrar && verif) {
        if (!verif.pode_registrar_como_seu) {
            btnRegistrar.textContent = '🚫 Registro Bloqueado (Já Pertence a Terceiro)';
            btnRegistrar.style.opacity = '0.65';
        } else if (verif.status_apropriacao === 'JA_PERTENCE_AO_USUARIO' || verif.status_apropriacao === 'REGISTRADO_COM_SUCESSO') {
            btnRegistrar.textContent = '✅ Criação Já Fixada em Seu Nome (Ver Certificado)';
            btnRegistrar.style.opacity = '1';
        } else {
            btnRegistrar.textContent = '🔒 Reivindicar e Fixar Criação em Meu Nome (Gravar no Banco)';
            btnRegistrar.style.opacity = '1';
        }
    }

    if (painelColisoes && verif) {
        if (!verif.colisoes || verif.colisoes.length === 0) {
            painelColisoes.innerHTML = `
                <div class="alert-card alert-SUCESSO" style="margin: 0;">
                    <h4>Nenhuma Colisão Encontrada no Banco Fixo</h4>
                    <p style="font-size: 0.85rem;">Sua marca e sua arquitetura técnica não colidem com nenhum dos ${verif.registros_fixos ? verif.registros_fixos.length : 5} registros ativos na base do Observatório/INPI.</p>
                </div>
            `;
        } else {
            painelColisoes.innerHTML = verif.colisoes.slice(0, 4).map(col => {
                const cor = col.mesmo_titular ? 'alert-SUCESSO' : (col.similaridade_percentual >= 55 || col.colisao_marca ? 'alert-CRITICO' : 'alert-ATENCAO');
                const tagTitular = col.mesmo_titular
                    ? 'SEU PRÓPRIO REGISTRO'
                    : (col.similaridade_percentual >= 55 || col.colisao_marca ? 'COLISÃO IMPEDITIVA DE TERCEIRO' : 'SIMILARIDADE PARCIAL');
                return `
                    <div class="alert-card ${cor}" style="margin-bottom: 0.65rem; padding: 0.85rem 1rem;">
                        <span class="inpi-badge">${col.protocolo_registro} • ${col.similaridade_percentual}% Similaridade • ${tagTitular}</span>
                        <h4 style="font-size: 0.95rem; margin-top: 0.25rem;">${col.nome_criacao_marca}</h4>
                        <p style="font-size: 0.82rem; margin: 0.2rem 0;"><strong>Titular Registrado:</strong> ${col.titular_nome} (${col.titular_documento}) — ${col.instituicao_empresa}</p>
                        <p style="font-size: 0.8rem; margin: 0;"><strong>Proteção Ativa:</strong> ${col.modalidade_protecao}</p>
                    </div>
                `;
            }).join('');
        }
    }

    if (tbodyFixos && verif && Array.isArray(verif.registros_fixos)) {
        tbodyFixos.innerHTML = verif.registros_fixos.map((reg) => {
            const hashCurto = (reg.hash_sha512 || '').substring(0, 18) + '...';
            const badgeOrigem = reg.origem_base === 'REGISTRO_FIXO_USUARIO'
                ? '<span class="inpi-badge" style="background:rgba(16,185,129,0.2);color:#6ee7b7;border-color:#10b981;">FIXADO NO OBSERVATÓRIO</span>'
                : '<span class="inpi-badge">ACERVO INPI / OMPI</span>';
            const protoEscapado = (reg.protocolo_registro || '').replace(/'/g, "\\'");
            const acaoSimular = perfilAcessoAtual === 'ADMIN'
                ? `<button type="button" class="btn-secondary" style="padding:0.45rem 0.75rem;font-size:0.76rem;" onclick="simularTentativaCopiaTerceiro('${protoEscapado}')">
                       Simular Terceiro Tentando Copiar
                   </button>`
                : `<span style="font-size:0.76rem;color:#10b981;font-weight:600;">🔒 Protegido no Banco</span>`;
            return `
                <tr>
                    <td>${badgeOrigem}<br><strong>${reg.protocolo_registro}</strong></td>
                    <td><strong>${reg.nome_criacao_marca}</strong><br><span style="font-size:0.78rem;color:var(--text-secondary);">${(reg.resumo_tecnico || '').substring(0, 95)}...</span></td>
                    <td><strong>${reg.titular_nome}</strong><br><span style="font-size:0.8rem;color:var(--text-secondary);">Doc: ${reg.titular_documento}<br>${reg.instituicao_empresa || ''}</span></td>
                    <td><strong>${reg.modalidade_protecao}</strong><br><span style="font-size:0.78rem;color:var(--text-secondary);">${reg.camadas_protegidas || ''}</span></td>
                    <td><code style="font-size:0.76rem;">SHA-512: ${hashCurto}</code><br><span style="font-size:0.76rem;color:var(--text-secondary);">${reg.data_registro || ''}</span></td>
                    <td class="no-print">
                        ${acaoSimular}
                    </td>
                </tr>
            `;
        }).join('');
    }
}

// Executa a verificação completa (Banco Fixo + Estado da Técnica Mundial)
async function executarVerificacaoExistenciaCompleta(irParaRelatorio = false) {
    const dados = ultimoProjetoAvaliado || coletarDadosFormularioAtual();
    const diag = ultimoDiagnostico || motorDecisaoLocal(dados);
    const verif = await verificarExistenciaLocalEApi(dados, diag, 'VERIFICAR');
    renderizarPainelVerificacaoExistencia(verif);
    buscarEstadoDaTecnicaMundialAoVivo(dados, diag);
    if (irParaRelatorio) {
        alternarAba('aba-relatorio');
    }
}

// Ação do Botão Principal: Reivindicar e Fixar Titularidade da Criação no Banco de Dados
async function registrarTitularidadeFixaUsuario() {
    const dados = coletarDadosFormularioAtual();
    ultimoProjetoAvaliado = dados;
    ultimoDiagnostico = motorDecisaoLocal(dados);

    const resultado = await verificarExistenciaLocalEApi(dados, ultimoDiagnostico, 'REGISTRAR');
    renderizarPainelVerificacaoExistencia(resultado);

    if (resultado.bloqueado || !resultado.pode_registrar_como_seu) {
        atualizarBalaoMascote(
            'TENTATIVA DE APROPRIAÇÃO BLOQUEADA PELO SISTEMA (ARTS. 11, 124 E 129 DA LPI)',
            'Esta criação ou marca já está registrada em nome de outro titular na base fixa!',
            `O sistema detectou colisão direta com o registro <strong>${resultado.bloqueio_terceiro ? resultado.bloqueio_terceiro.protocolo_registro : ''}</strong> pertencente a <strong>${resultado.bloqueio_terceiro ? resultado.bloqueio_terceiro.titular_nome : 'terceiro'}</strong>. Para que você possa registrar uma criação própria, altere o nome comercial (Art. 124, XIX LPI) e introduza uma melhoria funcional construtiva própria (Art. 9º LPI).`
        );
        const cardVerif = document.getElementById('card-verificacao-anterioridade-titularidade');
        if (cardVerif) cardVerif.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
    }

    if (perfilAcessoAtual === 'USUARIO') {
        etapaAbaLiberadaUsuario = 3;
        aplicarRegrasDePerfilNaInterface();
    }
    gerarMinutaAutomatizada('CERTIFICADO_TITULARIDADE');
    atualizarBalaoMascote(
        'CRIAÇÃO FIXADA E REGISTRADA EM SEU NOME COM SUCESSO!',
        `Protocolo Oficial Emitido: ${resultado.registro_gravado ? resultado.registro_gravado.protocolo_registro : 'Ativo'}`,
        `O seu projeto <strong>"${dados.nome_projeto}"</strong> agora está gravado de forma fixa no banco de dados sob o CPF/CNPJ <strong>${dados.autor_documento}</strong> com assinatura digital SHA-512. Se qualquer outra pessoa tentar cadastrar esse projeto com outro CPF/CNPJ, o sistema bloqueará automaticamente! Você também pode baixar seu <strong>Certificado Oficial de Titularidade</strong> na Aba 03.`
    );
}

// Simula ao vivo uma terceira pessoa (concorrente com outro CNPJ) tentando copiar um projeto já fixado no banco
async function simularTentativaCopiaTerceiro(protocoloAlvo) {
    const todos = obterRegistrosFixosLocais();
    const alvo = todos.find(r => r.protocolo_registro === protocoloAlvo);
    if (!alvo) return;

    document.getElementById('nome_projeto').value = alvo.nome_criacao_marca;
    document.getElementById('autor_nome').value = 'Concorrente Não Autorizado (Tentativa de Apropriação)';
    document.getElementById('autor_documento').value = '99.888.777/0001-66';
    document.getElementById('autor_email').value = 'copia@concorrente.com.br';
    document.getElementById('instituicao_empresa').value = 'Empresa Terceira Sem Autorização Ltda.';
    document.getElementById('resumo_tecnico').value = alvo.resumo_tecnico;

    const campoRelato = document.getElementById('relato_livre_usuario');
    if (campoRelato) {
        campoRelato.value = `[SIMULAÇÃO DE TENTATIVA DE CÓPIA POR TERCEIRO] Tentando registrar como minha a criação "${alvo.nome_criacao_marca}": ${alvo.resumo_tecnico}`;
    }

    const dados = coletarDadosFormularioAtual();
    ultimoProjetoAvaliado = dados;
    ultimoDiagnostico = motorDecisaoLocal(dados);
    renderizarRelatorioDiagnostico(dados, ultimoDiagnostico);

    const verif = await verificarExistenciaLocalEApi(dados, ultimoDiagnostico, 'VERIFICAR');
    renderizarPainelVerificacaoExistencia(verif);

    atualizarBalaoMascote(
        'SIMULAÇÃO DE COLISÃO ATIVADA — BLOQUEIO DE TERCEIRO EM TEMPO REAL',
        `O sistema detectou que "${alvo.nome_criacao_marca}" já pertence a ${alvo.titular_nome}!`,
        `Veja no painel abaixo como o banco fixo protege quem registrou primeiro: como o CPF/CNPJ inserido (<code>99.888.777/0001-66</code>) diverge do titular legítimo (<code>${alvo.titular_documento}</code>), o sistema <strong>bloqueia o registro da criação</strong> com base nos <strong>Arts. 11, 124 XIX, 129, 189 e 195 da Lei nº 9.279/96</strong>.`
    );

    const cardVerif = document.getElementById('card-verificacao-anterioridade-titularidade');
    if (cardVerif) cardVerif.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Gera a Classificação Internacional de Patentes (CIP/IPC), a Reivindicação Independente nº 1 (Art. 24 e 25 LPI)
// e a Matriz de Correlação Componente de Engenharia IoT/Hardware <-> Artigo Exato de Lei
function gerarCorrelacaoPatentariaReal(dados, diag) {
    const textoContexto = `${dados.nome_projeto} ${dados.resumo_tecnico} ${dados.linguagem_firmware}`.toLowerCase();

    // 1. Determinar a Classificação Internacional de Patentes (CIP / IPC — Padrão OMPI/INPI)
    const codigosCip = [];
    if (/(irrig|solo|agr[ií]col|agro|umidade|planta|estufa)/i.test(textoContexto)) {
        codigosCip.push('A01G 25/16 (Sistemas de controle automático de irrigação agrícola)');
    }
    if (/(iot|lora|lorawan|mqtt|sem fio|wireless|esp32|ble|zigbee|telemetria|rede de sensores)/i.test(textoContexto)) {
        codigosCip.push('H04W 4/38 (Redes de comunicação sem fio para coleta de dados de sensores / IoT)');
        codigosCip.push('H04L 67/12 (Protocolos dedicados a dispositivos embarcados M2M / telemetria)');
    }
    if (/(m[eé]dic|sa[uú]de|batimento|ox[ií]metro|ecg|vital|wearable|pulseira|paciente)/i.test(textoContexto)) {
        codigosCip.push('A61B 5/00 (Dispositivos de medição para diagnóstico biomédico e monitoramento de sinais vitais)');
        codigosCip.push('G16H 40/67 (Sistemas de TIC para operação remota de dispositivos médicos / IoMT)');
    }
    if (/(rob[oô]|aut[oô]nom|lidar|[oó]ptic|laser|navega[cç][aã]o|motor|atuador|v[aá]lvula|controle)/i.test(textoContexto)) {
        codigosCip.push('G05B 19/042 (Sistemas de controle funcional em malha fechada utilizando unidades microcontroladoras)');
    }
    if (dados.possui_topografia_chip || /(chip|sil[ií]cio|asic|fpga|semicondutor|verilog|vhdl)/i.test(textoContexto)) {
        codigosCip.push('H01L 27/02 (Dispositivos semicondutores integrados e topografia de circuitos em silício)');
    }
    if (codigosCip.length === 0) {
        codigosCip.push('G05B 19/042 (Sistemas eletrônicos de controle digital programável com sensores e atuadores)');
        codigosCip.push('H05K 1/02 (Detalhes construtivos de Placas de Circuito Impresso — PCB)');
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
        providencia: `Gerar resumo criptográfico <strong>Hash SHA-512</strong> dos arquivos-fonte (<code>.c/.cpp/.h/.py</code>) e depositar no sistema <strong>e-Software do INPI</strong> (R$ 185,00 — prova plena de autoria anterior). Regime recomendado: <strong>${diag.licenca_sw_recomendada}</strong>.`
    });

    linhasCorrelacao.push({
        elemento: `<strong>3. Desenho de Esquemático Elétrico, Layout de PCB e Gerbers (Camada A)</strong><br><span style="font-size:0.82rem;color:var(--text-secondary);">Arquivos CAD de roteamento de trilhas, máscara de solda e documentação técnica</span>`,
        protecao: `<strong>Proteção Autoral sobre a expressão gráfica do desenho</strong> (impede fotocópia/clonagem literal do arquivo Gerber), mas <strong>não impede engenharia reversa limpa</strong> da função elétrica se não houver patente na Camada F.`,
        base_legal: `<strong>Lei nº 9.610/98 (LDA):</strong> Art. 7º, inciso XI (projetos, esboços e obras plásticas concernentes à engenharia e topografia)<br><strong>Licenciamento Contratual:</strong> ${diag.licenca_hw_recomendada}`,
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
            acao: 'Implementar autenticação de dispositivo (chaves simétricas LoRaWAN AppKey / TLS no MQTT) e incluir cláusula de titularidade sobre o banco de telemetria nos contratos (Aba 03).'
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
        base_legal: `<strong>Lei nº 9.279/96 (LPI):</strong> Arts. 94 a 121 (Desenho Industrial) e Art. 195, III (repressão à violação de <em>trade dress</em>)<br><strong>Lei nº 11.484/2007:</strong> Arts. 26 a 55 (Topografia de CI e incentivos fiscais do PADIS)`,
        providencia: dados.possui_design_externo_novo || dados.possui_topografia_chip
            ? 'Depositar vistas ortogonais/perspectivas do gabinete no <strong>e-Desenho Industrial</strong> e/ou arquivos GDSII no <strong>e-Chip (INPI)</strong>.'
            : 'Caso desenvolva carenagem personalizada no futuro, depositar Desenho Industrial antes da comercialização para bloquear clones visuais.'
    });

    linhasCorrelacao.push({
        elemento: `<strong>7. Identidade Comercial (Camada D) e Titularidade Jurídica do Projeto</strong><br><span style="font-size:0.82rem;color:var(--text-secondary);">Marca "${dados.nome_projeto.split('—')[0].trim()}" e relação entre criadores/instituição</span>`,
        protecao: `<strong>Exclusividade Nacional sobre o Nome e Logotipo (10 anos renováveis indefinidamente)</strong>. Em projetos de hardware aberto, é o único ativo que impede clones de usarem o nome oficial.`,
        base_legal: `<strong>Lei nº 9.279/96 (LPI):</strong> Art. 129 (sistema atributivo de marca), Art. 189 (crime contra registro de marca), Arts. 6º e 88 a 93 (titularidade)<br><strong>Lei nº 10.973/2004:</strong> Arts. 6º, 11 e 16 (NIT/ICT)<br><strong>Lei nº 9.609/98:</strong> Art. 4º`,
        providencia: `Protocolar pedido no <strong>e-Marcas (Classe NCL 9 — Aparelhos científicos, sensores e controladores eletrônicos)</strong> e clicar em <strong>"Reivindicar e Fixar Criação em Meu Nome"</strong> acima.`
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
// PORTAL INICIAL E CONTROLE DE ACESSO POR PERFIL (USUÁRIO vs ADMINISTRADOR)
// =========================================================================

function entrarComoUsuario() {
    perfilAcessoAtual = 'USUARIO';
    blocoAtualUsuario = 1;
    etapaAbaLiberadaUsuario = 1;

    const telaInicial = document.getElementById('tela-inicial-acesso');
    const conteudoSistema = document.getElementById('conteudo-sistema-principal');
    if (telaInicial) telaInicial.style.display = 'none';
    if (conteudoSistema) conteudoSistema.style.display = 'block';

    limparFormularioCompleto();
    aplicarRegrasDePerfilNaInterface();
    alternarAba('aba-diagnostico');

    atualizarBalaoMascote(
        'MODO USUÁRIO — PASSO 1 DE 3 (IDENTIFICAÇÃO DO TITULAR)',
        'Preencha seus dados no Bloco 1 para destravar o Bloco 2.',
        'No <strong>Modo Usuário</strong>, você avança uma etapa por vez: primeiro identifique quem é o dono do projeto no <strong>Bloco 1</strong> e clique em <strong>"Concluir Bloco 1 e Avançar para o Bloco 2 →"</strong>.'
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function autenticarAdministrador(event) {
    if (event) event.preventDefault();
    const userInput = document.getElementById('admin_user_input');
    const passInput = document.getElementById('admin_pass_input');
    const erroBox = document.getElementById('admin-login-erro');

    const usuario = userInput ? userInput.value.trim() : '';
    const senha = passInput ? passInput.value : '';

    if (usuario !== 'owner' || senha !== '2k26enjoyer') {
        if (erroBox) {
            erroBox.style.display = 'block';
            erroBox.innerHTML = '🚫 <strong>Credenciais inválidas!</strong> Verifique o usuário e a senha de Administrador.';
        }
        return;
    }

    if (erroBox) erroBox.style.display = 'none';
    perfilAcessoAtual = 'ADMIN';
    blocoAtualUsuario = 3;
    etapaAbaLiberadaUsuario = 5;

    const telaInicial = document.getElementById('tela-inicial-acesso');
    const conteudoSistema = document.getElementById('conteudo-sistema-principal');
    if (telaInicial) telaInicial.style.display = 'none';
    if (conteudoSistema) conteudoSistema.style.display = 'block';

    carregarCasoBaseParaAdmin();
    aplicarRegrasDePerfilNaInterface();
    alternarAba('aba-diagnostico');

    atualizarBalaoMascote(
        'MODO ADMINISTRADOR AUTENTICADO (OWNER) — LIBERDADE TOTAL',
        'Todos os blocos, abas, gaveta de 14 parâmetros e simulador de colisão estão liberados!',
        'Você acessou como <strong>Administrador (owner)</strong>. Todos os 3 blocos do formulário e todas as 5 abas superiores estão abertas simultaneamente sem restrição de etapas.'
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function voltarParaTelaInicial() {
    perfilAcessoAtual = null;
    const telaInicial = document.getElementById('tela-inicial-acesso');
    const conteudoSistema = document.getElementById('conteudo-sistema-principal');
    const badgePerfil = document.getElementById('badge-perfil-sessao');
    const btnTrocar = document.getElementById('btn-trocar-perfil');
    const erroBox = document.getElementById('admin-login-erro');
    const passInput = document.getElementById('admin_pass_input');

    if (telaInicial) telaInicial.style.display = 'block';
    if (conteudoSistema) conteudoSistema.style.display = 'none';
    if (badgePerfil) badgePerfil.style.display = 'none';
    if (btnTrocar) btnTrocar.style.display = 'none';
    if (erroBox) erroBox.style.display = 'none';
    if (passInput) passInput.value = '';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function carregarCasoBaseParaAdmin() {
    const c = CASO_BASE_INICIAL;
    const campoRelato = document.getElementById('relato_livre_usuario');
    if (campoRelato) campoRelato.value = c.relato_livre;

    document.getElementById('nome_projeto').value = c.nome_projeto;
    document.getElementById('autor_nome').value = c.autor_nome;
    document.getElementById('autor_documento').value = c.autor_documento;
    document.getElementById('autor_email').value = c.autor_email;
    document.getElementById('instituicao_empresa').value = c.instituicao_empresa;
    document.getElementById('resumo_tecnico').value = c.resumo_tecnico;
    document.getElementById('grau_novidade_hardware').value = c.grau_novidade_hardware;
    if (document.getElementById('divulgacao_previa')) document.getElementById('divulgacao_previa').value = c.divulgacao_previa;
    if (document.getElementById('conectividade_iot_rf')) document.getElementById('conectividade_iot_rf').value = c.conectividade_iot_rf;
    if (document.getElementById('telemetria_dados_iot')) document.getElementById('telemetria_dados_iot').value = c.telemetria_dados_iot;
    document.getElementById('possui_pcb_customizada').checked = c.possui_pcb_customizada;
    document.getElementById('possui_topografia_chip').checked = c.possui_topografia_chip;
    document.getElementById('possui_design_externo_novo').checked = c.possui_design_externo_novo;
    document.getElementById('usa_hardware_aberto_terceiros').value = c.usa_hardware_aberto_terceiros;
    document.getElementById('possui_firmware_proprio').checked = c.possui_firmware_proprio;
    document.getElementById('linguagem_firmware').value = c.linguagem_firmware;
    document.getElementById('licenca_bibliotecas_terceiros').value = c.licenca_bibliotecas_terceiros;
    document.getElementById('vinculacao_firmware').value = c.vinculacao_firmware;
    document.getElementById('modelo_negocio').value = c.modelo_negocio;
    document.getElementById('titularidade_tipo').value = c.titularidade_tipo;

    const campoCodigo = document.getElementById('trecho_codigo_inspecao');
    if (campoCodigo) {
        campoCodigo.value = c.trecho_codigo || '';
        inspecionarTrechoCodigo();
    }

    autoMarcarEnquantoDigita();
    document.getElementById('nome_projeto').value = c.nome_projeto;
    document.getElementById('resumo_tecnico').value = c.resumo_tecnico;
    document.getElementById('modelo_negocio').value = c.modelo_negocio;
    document.getElementById('titularidade_tipo').value = c.titularidade_tipo;
    atualizarBadgesAutoMarcacao();

    ultimoProjetoAvaliado = c;
    ultimoDiagnostico = motorDecisaoLocal(ultimoProjetoAvaliado);
    renderizarRelatorioDiagnostico(ultimoProjetoAvaliado, ultimoDiagnostico);
    verificarExistenciaLocalEApi(ultimoProjetoAvaliado, ultimoDiagnostico, 'VERIFICAR').then(verif => {
        renderizarPainelVerificacaoExistencia(verif);
    });
}

function avancarBlocoUsuario(numeroBlocoDestino) {
    if (perfilAcessoAtual !== 'USUARIO') return;

    // Validação rigorosa antes de liberar o Bloco 2
    if (numeroBlocoDestino === 2) {
        const autorNome = document.getElementById('autor_nome').value.trim();
        const autorDoc = document.getElementById('autor_documento').value.trim();
        const autorEmail = document.getElementById('autor_email').value.trim();

        if (!autorNome || !autorDoc) {
            alert('Para avançar para o Bloco 2, preencha seu Nome Completo (ou Equipe) e seu CPF/CNPJ no Bloco 1.');
            if (!autorNome) document.getElementById('autor_nome').focus();
            else document.getElementById('autor_documento').focus();
            return;
        }
        if (!autorEmail) {
            document.getElementById('autor_email').value = 'titular@projeto.com.br';
        }
    }

    // Validação rigorosa antes de liberar o Bloco 3
    if (numeroBlocoDestino === 3) {
        const relato = document.getElementById('relato_livre_usuario').value.trim();
        const nomeProj = document.getElementById('nome_projeto').value.trim();
        const validacao = validarSuficienciaDescritivaProjeto(relato, nomeProj);
        if (!validacao.valido) {
            alert(`🚫 Não foi possível avançar para o Bloco 3:\n\n${validacao.motivo}\n\n${validacao.orientacao}`);
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
            'MODO USUÁRIO — PASSO 1 DE 3 (IDENTIFICAÇÃO DO TITULAR)',
            'Revise seus dados de titularidade no Bloco 1.',
            'Confira seu nome, CPF/CNPJ e o título provisório do projeto e clique em avançar para ir ao Bloco 2.'
        );
    } else if (numeroBlocoDestino === 2) {
        atualizarBalaoMascote(
            'MODO USUÁRIO — PASSO 2 DE 3 (DESCRIÇÃO DA SUA CRIAÇÃO)',
            'Bloco 1 concluído! Agora descreva sua criação técnica no Bloco 2.',
            'Conte com suas próprias palavras como funciona o seu projeto (placa, sensores, microcontrolador, conectividade, gabinete). O sistema vai identificar as leis automaticamente para o Bloco 3.'
        );
    } else if (numeroBlocoDestino === 3) {
        atualizarBalaoMascote(
            'MODO USUÁRIO — PASSO 3 DE 3 (CONFERÊNCIA AUTOMÁTICA E VERIFICAÇÃO)',
            'Bloco 2 concluído! Confira o enquadramento automático e gere seu diagnóstico.',
            'Abaixo está o resumo técnico-jurídico auto-marcado pelo sistema com base no seu relato. Agora clique em <strong>"Verificar se Já Existe, Enquadrar nas Leis e Proteger Meu Projeto →"</strong> para liberar a Etapa 02!'
        );
    }

    const cardPrincipal = document.getElementById('aba-diagnostico');
    if (cardPrincipal) cardPrincipal.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function atualizarVisibilidadeBlocosUsuario() {
    const b1 = document.getElementById('bloco-form-1');
    const b2 = document.getElementById('bloco-form-2');
    const b3 = document.getElementById('bloco-form-3');
    const ind1 = document.getElementById('indicador-bloco-1');
    const ind2 = document.getElementById('indicador-bloco-2');
    const ind3 = document.getElementById('indicador-bloco-3');

    if (perfilAcessoAtual === 'ADMIN') {
        if (b1) b1.style.display = 'block';
        if (b2) b2.style.display = 'block';
        if (b3) b3.style.display = 'block';
        return;
    }

    // Modo Usuário: exibe SOMENTE o bloco da etapa atual (sem permitir ver o bloco 2 em diante antes da hora)
    if (b1) b1.style.display = blocoAtualUsuario === 1 ? 'block' : 'none';
    if (b2) b2.style.display = blocoAtualUsuario === 2 ? 'block' : 'none';
    if (b3) b3.style.display = blocoAtualUsuario === 3 ? 'block' : 'none';

    const estilizarIndicador = (el, numero, titulo) => {
        if (!el) return;
        if (blocoAtualUsuario === numero) {
            el.style.background = 'rgba(249, 115, 22, 0.18)';
            el.style.border = '1px solid rgba(249, 115, 22, 0.55)';
            el.style.color = '#fed7aa';
            el.style.opacity = '1';
            el.textContent = `● Bloco ${numero}: ${titulo} (Em Preenchimento)`;
        } else if (blocoAtualUsuario > numero) {
            el.style.background = 'rgba(16, 185, 129, 0.16)';
            el.style.border = '1px solid rgba(16, 185, 129, 0.45)';
            el.style.color = '#6ee7b7';
            el.style.opacity = '1';
            el.textContent = `✅ Bloco ${numero}: ${titulo} (Concluído)`;
        } else {
            el.style.background = 'rgba(255, 255, 255, 0.04)';
            el.style.border = '1px solid rgba(255, 255, 255, 0.12)';
            el.style.color = 'var(--text-secondary)';
            el.style.opacity = '0.55';
            el.textContent = `🔒 Bloco ${numero}: ${titulo}`;
        }
    };

    estilizarIndicador(ind1, 1, 'Dados do Titular');
    estilizarIndicador(ind2, 2, 'Descrição e Código');
    estilizarIndicador(ind3, 3, 'Enquadramento e Verificação');
}

function aplicarRegrasDePerfilNaInterface() {
    const badgePerfil = document.getElementById('badge-perfil-sessao');
    const btnTrocar = document.getElementById('btn-trocar-perfil');
    const barraEtapas = document.getElementById('barra-etapas-usuario');
    const rodapeB1 = document.getElementById('rodape-bloco-1-usuario');
    const rodapeB2 = document.getElementById('rodape-bloco-2-usuario');
    const btnVoltarB2 = document.getElementById('btn-voltar-bloco-2');
    const gavetaAvancada = document.getElementById('gaveta-parametros-avancados');

    const tab1 = document.querySelector('.tab-btn[data-target="aba-diagnostico"]');
    const tab2 = document.querySelector('.tab-btn[data-target="aba-relatorio"]');
    const tab3 = document.querySelector('.tab-btn[data-target="aba-minutas"]');
    const tab4 = document.querySelector('.tab-btn[data-target="aba-catalogo"]');
    const tab5 = document.querySelector('.tab-btn[data-target="aba-arquitetura"]');

    if (btnTrocar) btnTrocar.style.display = 'inline-flex';

    if (perfilAcessoAtual === 'ADMIN') {
        if (badgePerfil) {
            badgePerfil.style.display = 'inline-flex';
            badgePerfil.style.borderColor = '#38bdf8';
            badgePerfil.style.color = '#bae6fd';
            badgePerfil.textContent = '🛡️ MODO ADMINISTRADOR (OWNER • LIBERDADE TOTAL)';
        }
        if (barraEtapas) barraEtapas.style.display = 'none';
        if (rodapeB1) rodapeB1.style.display = 'none';
        if (rodapeB2) rodapeB2.style.display = 'none';
        if (btnVoltarB2) btnVoltarB2.style.display = 'none';
        if (gavetaAvancada) gavetaAvancada.style.display = 'block';

        if (tab1) { tab1.style.display = ''; tab1.style.opacity = '1'; tab1.innerHTML = '<span class="tab-step">01</span> Meu Projeto & Auto-Enquadramento'; }
        if (tab2) { tab2.style.display = ''; tab2.style.opacity = '1'; tab2.innerHTML = '<span class="tab-step">02</span> Verificação de Existência & Parecer Legal'; }
        if (tab3) { tab3.style.display = ''; tab3.style.opacity = '1'; tab3.innerHTML = '<span class="tab-step">03</span> Certificado de Titularidade & Contratos'; }
        if (tab4) { tab4.style.display = ''; tab4.style.opacity = '1'; }
        if (tab5) { tab5.style.display = ''; tab5.style.opacity = '1'; }

        atualizarVisibilidadeBlocosUsuario();
    } else if (perfilAcessoAtual === 'USUARIO') {
        if (badgePerfil) {
            badgePerfil.style.display = 'inline-flex';
            badgePerfil.style.borderColor = 'var(--accent-primary)';
            badgePerfil.style.color = '#fed7aa';
            badgePerfil.textContent = '👤 MODO USUÁRIO (JORNADA GUIADA EM ETAPAS)';
        }
        if (barraEtapas) barraEtapas.style.display = 'block';
        if (rodapeB1) rodapeB1.style.display = 'flex';
        if (rodapeB2) rodapeB2.style.display = 'flex';
        if (btnVoltarB2) btnVoltarB2.style.display = 'inline-flex';
        if (gavetaAvancada) gavetaAvancada.style.display = 'none';

        if (tab1) {
            tab1.style.display = '';
            tab1.style.opacity = '1';
            tab1.innerHTML = '<span class="tab-step">01</span> Etapa 1: Cadastro em Blocos';
        }
        if (tab2) {
            tab2.style.display = '';
            tab2.style.opacity = etapaAbaLiberadaUsuario >= 2 ? '1' : '0.45';
            tab2.innerHTML = etapaAbaLiberadaUsuario >= 2
                ? '<span class="tab-step">02</span> Etapa 2: Verificação & Parecer'
                : '<span class="tab-step">🔒</span> Etapa 2: Verificação (Conclua a Etapa 1)';
        }
        if (tab3) {
            tab3.style.display = '';
            tab3.style.opacity = etapaAbaLiberadaUsuario >= 3 ? '1' : '0.45';
            tab3.innerHTML = etapaAbaLiberadaUsuario >= 3
                ? '<span class="tab-step">03</span> Etapa 3: Certificado & Contratos'
                : '<span class="tab-step">🔒</span> Etapa 3: Certificado (Conclua a Etapa 2)';
        }
        // No Modo Usuário, as abas de consulta global e arquitetura de banco ficam ocultas para manter foco estrito nas etapas
        if (tab4) tab4.style.display = 'none';
        if (tab5) tab5.style.display = 'none';

        atualizarVisibilidadeBlocosUsuario();
    }
}

// Navegação entre abas (com bloqueio de etapas no Modo Usuário)
function alternarAba(abaId) {
    if (perfilAcessoAtual === 'USUARIO') {
        if (abaId === 'aba-catalogo' || abaId === 'aba-arquitetura') {
            alert('Esta seção técnica é exclusiva do Modo Administrador.');
            return;
        }
        if (abaId === 'aba-relatorio' && etapaAbaLiberadaUsuario < 2) {
            alert('Etapa Bloqueada: No Modo Usuário, você precisa primeiro concluir os 3 blocos da Etapa 01 e enviar seu projeto para visualizar a Verificação de Existência e o Parecer Legal.');
            return;
        }
        if (abaId === 'aba-minutas' && etapaAbaLiberadaUsuario < 2) {
            alert('Etapa Bloqueada: No Modo Usuário, conclua primeiro a Etapa 01 e a Etapa 02 antes de emitir seu Certificado e Contratos.');
            return;
        }
        if (abaId === 'aba-minutas' && etapaAbaLiberadaUsuario === 2) {
            etapaAbaLiberadaUsuario = 3;
            aplicarRegrasDePerfilNaInterface();
        }
    }

    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    const painel = document.getElementById(abaId);
    if (painel) painel.classList.add('active');

    const btn = document.querySelector(`.tab-btn[data-target="${abaId}"]`);
    if (btn) btn.classList.add('active');

    if (abaId === 'aba-minutas') {
        atualizarBalaoMascote(
            'CERTIFICADO DE TITULARIDADE, AUTONOMIA PRIVADA E CONTRATOS',
            'Emita seu Certificado Oficial de Titularidade SHA-512 e as minutas contratuais do projeto.',
            'Abaixo você pode emitir o <strong>Certificado de Reserva de Anterioridade e Titularidade</strong> gravado no banco fixo, além dos contratos de Cessão de Direitos, Licenciamento Open Hardware (com reserva de Marca) e o Dossiê do INPI.'
        );
    } else if (abaId === 'aba-catalogo') {
        atualizarBalaoMascote(
            'MATRIZ MULTICAMADA (A–F) E CASOS PARADIGMÁTICOS',
            'Síntese da fragmentação normativa e dos litígios reais estudados na disciplina.',
            'Esta seção consolida a tabela das 6 camadas do hardware (Documentação, Design, Semicondutores, Signos Distintivos, Software Embarcado e Solução Técnica) e os quatro casos analisados pelo nosso grupo: <strong>Arduino LLC vs. SRL</strong>, <strong>Gradiente vs. Apple (STF)</strong>, <strong>Waymo vs. Uber</strong> e <strong>Intel vs. AMD</strong>.'
        );
    } else if (abaId === 'aba-arquitetura') {
        atualizarBalaoMascote(
            'ARQUITETURA DO SISTEMA E MODELO DE DADOS (DER)',
            'Rastreabilidade técnica entre o formulário de engenharia, o banco SQL fixo e as minutas.',
            'Aqui apresentamos as tabelas relacionais implementadas em <code>database/schema.sql</code> (incluindo a tabela fixa de anterioridade e titularidade) desenvolvidas por Antonio Kayky, Giullian Bernard, Ítalo Brito e Luís Aquiles.'
        );
    }

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
        prazo: '10 anos (renovável indefinidamente)',
        justificativa: 'Pelo sistema atributivo brasileiro (Art. 129 da LPI), a propriedade e o uso exclusivo do nome comercial decorrem do registro no INPI. Como demonstrado no caso Arduino LLC vs. Arduino SRL (Genuino), mesmo quando o hardware e o software são abertos, a retenção da marca na Classe NCL 9 (aparelhos científicos, sensores e controladores) é o principal instrumento jurídico para impedir contrafação (Art. 189 da LPI).'
    });

    // ANÁLISE DE DIVULGAÇÃO PRÉVIA: PERÍODO DE GRAÇA (ART. 12 LPI) VS. ESTADO DA TÉCNICA (ART. 11 LPI)
    if (divulgacao === 'DIVULGADO_MENOS_12M') {
        alertasLicenca.unshift({
            nivel: 'ATENCAO',
            titulo: 'Alerta Urgente — Período de Graça em Curso (Art. 12 da Lei nº 9.279/1996)',
            descricao: 'Como o projeto já foi divulgado publicamente (YouTube, GitHub, TCC ou feira) há menos de 12 meses, você ainda pode depositar Patente (PI/MU) ou Desenho Industrial invocando o Período de Graça (Art. 12 da LPI). Protocolize o pedido no INPI antes de completar 365 dias da primeira exposição pública e anexe as provas da divulgação pelo próprio autor.'
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
            base_legal: 'Lei nº 11.484/2007 (Arts. 26 a 55 — Institui também o PADIS)',
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
        titulo: 'Camada A — Fragilidade Jurídica do Copyleft no Hardware (Lei nº 9.610/1998, Art. 7º, XI)',
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
            descricao: 'Quando há múltiplos cofundadores, é indispensável firmar imediatamente a Cessão de Direitos e o Acordo de Cotitularidade (Aba 03) unificando o depósito da Marca no INPI sob uma única entidade jurídica.'
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

// Submissão do Formulário de Arquitetura + Verificação Real de Existência/Anterioridade
async function processarDiagnostico(event) {
    if (event) event.preventDefault();

    if (perfilAcessoAtual === 'USUARIO' && blocoAtualUsuario < 3) {
        avancarBlocoUsuario(blocoAtualUsuario + 1);
        return;
    }

    const gaveta = document.getElementById('gaveta-parametros-avancados');
    const relatoEl = document.getElementById('relato_livre_usuario');
    const nomeEl = document.getElementById('nome_projeto');
    const resumoEl = document.getElementById('resumo_tecnico');

    const textoRelato = relatoEl ? relatoEl.value.trim() : '';
    const textoNome = nomeEl ? nomeEl.value.trim() : '';

    if (!textoRelato && !textoNome) {
        alert('Por favor, informe o nome do seu projeto ou descreva sua criação na caixa de texto principal para realizarmos a verificação e o diagnóstico.');
        if (relatoEl) relatoEl.focus();
        return;
    }

    // Valida se o texto realmente descreve um projeto técnico real (Art. 24 da LPI — Suficiência Descritiva)
    const textoParaValidar = textoRelato || (resumoEl ? resumoEl.value.trim() : '') || textoNome;
    const validacaoReal = validarSuficienciaDescritivaProjeto(textoParaValidar, textoNome);
    if (!validacaoReal.valido) {
        alert(`🚫 Projeto Recusado por Insuficiência Descritiva (Art. 24 da Lei nº 9.279/96):\n\n${validacaoReal.motivo}\n\n${validacaoReal.orientacao}`);
        if (relatoEl) relatoEl.focus();
        interpretarRelatoLivre(false, true);
        return;
    }

    // Garante que o relato livre sempre sincronize e auto-marque os parâmetros caso a gaveta avançada esteja fechada
    if (!gaveta || !gaveta.open) {
        autoMarcarEnquantoDigita();
    } else if (resumoEl && !resumoEl.value.trim()) {
        resumoEl.value = textoRelato || textoNome;
    }

    if (!document.getElementById('autor_nome').value.trim()) {
        document.getElementById('autor_nome').value = 'Projetista(s) / Inventor(es) do Dispositivo';
    }
    if (!document.getElementById('autor_documento').value.trim()) {
        document.getElementById('autor_documento').value = '12.345.678/0001-90';
    }
    if (!document.getElementById('autor_email').value.trim()) {
        document.getElementById('autor_email').value = 'engenharia@projetoavaliado.com.br';
    }
    if (!document.getElementById('instituicao_empresa').value.trim()) {
        document.getElementById('instituicao_empresa').value = 'Desenvolvimento Independente / Startup de Hardware & IoT';
    }
    if (resumoEl && !resumoEl.value.trim()) {
        resumoEl.value = textoRelato || textoNome;
    }

    const dados = coletarDadosFormularioAtual();
    ultimoProjetoAvaliado = dados;

    try {
        const resp = await fetch('api/diagnostico.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        if (resp.ok) {
            const json = await resp.json();
            if (json && json.sucesso) {
                ultimoDiagnostico = Object.assign(motorDecisaoLocal(dados), {
                    projeto_id: json.diagnostico.projeto_id,
                    diagnostico_id: json.diagnostico.diagnostico_id
                });
                document.getElementById('engine-status-text').textContent = 'Motor PHP + SQL Fixo Ativo';
            } else {
                ultimoDiagnostico = motorDecisaoLocal(dados);
            }
        } else {
            ultimoDiagnostico = motorDecisaoLocal(dados);
        }
    } catch (e) {
        ultimoDiagnostico = motorDecisaoLocal(dados);
    }

    salvarHistoricoLocal(dados, ultimoDiagnostico);
    renderizarRelatorioDiagnostico(dados, ultimoDiagnostico);

    // Executa imediatamente a verificação se o projeto já existe e se pode ser reivindicado
    const verif = await verificarExistenciaLocalEApi(dados, ultimoDiagnostico, 'VERIFICAR');
    renderizarPainelVerificacaoExistencia(verif);
    buscarEstadoDaTecnicaMundialAoVivo(dados, ultimoDiagnostico);

    if (perfilAcessoAtual === 'USUARIO') {
        etapaAbaLiberadaUsuario = Math.max(etapaAbaLiberadaUsuario, 2);
        aplicarRegrasDePerfilNaInterface();
    }

    gerarMinutaAutomatizada('CERTIFICADO_TITULARIDADE');
    alternarAba('aba-relatorio');

    if (verif && !verif.pode_registrar_como_seu) {
        atualizarBalaoMascote(
            'ALERTA DE ANTERIORIDADE — CRIAÇÃO OU MARCA JÁ REGISTRADA POR TERCEIRO!',
            `Colisão detectada com ${verif.bloqueio_terceiro ? verif.bloqueio_terceiro.protocolo_registro : 'registro anterior'}`,
            `O projeto que você descreveu colide diretamente com uma criação ou marca já existente na base fixa (<strong>${verif.bloqueio_terceiro ? verif.bloqueio_terceiro.nome_criacao_marca : ''}</strong>). Confira no painel abaixo os artigos da LPI aplicáveis e o que você precisa diferenciar para poder registrar como seu.`
        );
    } else if (ultimoDiagnostico.risco_contaminacao_licenca === 'ALTO_CRITICO') {
        atualizarBalaoMascote(
            'RESULTADO DO DIAGNÓSTICO — CONFLITO CONTRATUAL DE LICENÇAS DETECTADO',
            `Índice de Protegibilidade: ${ultimoDiagnostico.score_protegibilidade}/100 — Risco Crítico de Reciprocidade`,
            `O projeto apresenta colisão entre a pretensão de fechamento comercial e o uso de ativos sob <strong>GPLv3 ou CERN-OHL-S / CC BY-SA</strong>. Lembre-se da premissa teórica do nosso estudo: a licença é uma autorização condicional; descumpri-la retira a permissão de uso e configura violação de Direito Autoral (Lei nº 9.610/98).`
        );
    } else {
        atualizarBalaoMascote(
            'VERIFICAÇÃO DE EXISTÊNCIA CONCLUÍDA — DISPONÍVEL PARA REGISTRO EM SEU NOME!',
            `Sua criação está apta para apropriação legítima (${ultimoDiagnostico.score_protegibilidade}/100)`,
            `Verificamos o banco fixo e o estado da técnica: não há bloqueio de terceiros sobre o seu projeto. Clique no botão laranja <strong>"Reivindicar e Fixar Criação em Meu Nome"</strong> no painel abaixo para travar sua titularidade no banco de dados e emitir seu certificado SHA-512.`
        );
    }
}

// Renderiza as 6 Camadas (A a F), a Matriz de Correlação Engenharia-Lei e as tabelas do diagnóstico na Aba 2
function renderizarRelatorioDiagnostico(dados, diag) {
    document.getElementById('rel-nome-projeto').textContent = dados.nome_projeto;
    document.getElementById('rel-autor-projeto').textContent = `${dados.autor_nome} • ${dados.instituicao_empresa} (${dados.autor_documento})`;
    document.getElementById('kpi-score').textContent = `${diag.score_protegibilidade}/100`;
    document.getElementById('kpi-risco').textContent = diag.risco_contaminacao_licenca;
    document.getElementById('kpi-inpi').textContent = diag.protecao_inpi_primaria.split(' — ')[1] || diag.protecao_inpi_primaria;
    document.getElementById('kpi-licenca-hw').textContent = diag.licenca_hw_recomendada;
    document.getElementById('kpi-licenca-sw').textContent = diag.licenca_sw_recomendada;

    const kpiRiscoEl = document.getElementById('kpi-risco');
    kpiRiscoEl.style.color = diag.risco_contaminacao_licenca === 'ALTO_CRITICO' ? '#ef4444'
        : (diag.risco_contaminacao_licenca === 'MEDIO' ? '#f59e0b' : '#10b981');

    // Mapa das 6 Camadas Tecnológicas (A a F)
    const camadasGrid = document.getElementById('mapa-camadas-grid');
    if (camadasGrid) {
        const statusCamadaA = dados.possui_pcb_customizada
            ? `Direito Autoral sobre Desenho/Esquemático (Lei 9.610/98, Art. 7º, XI)`
            : `Documentação Padrão de Terceiros`;

        const statusCamadaB = dados.possui_design_externo_novo
            ? `Desenho Industrial no INPI (10 a 25 anos — Lei 9.279/96, Art. 94)`
            : `Sem forma plástica ornamental nova`;

        const statusCamadaC = dados.possui_topografia_chip
            ? `Topografia de Circuito Integrado (10 anos — Lei 11.484/2007, Art. 26)`
            : `Não aplicável (Usa microcontrolador/chip comercial)`;

        const statusCamadaD = `Registro de Marca no INPI (10 anos renováveis — Art. 129 da LPI)`;

        const statusCamadaE = dados.possui_firmware_proprio
            ? `Direito Autoral de Software (50 anos — Lei 9.609/98, Art. 2º • ${dados.linguagem_firmware})`
            : `Sem firmware próprio declarado`;

        const statusCamadaF = dados.modelo_negocio === 'PUBLICACAO_DEFENSIVA'
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

    // Renderizar o Painel de Correlação Patentária Real (CIP + Art. 10 V vs. Res. INPI 158/2016 + Reivindicação nº 1) e a Tabela Componente <-> Lei
    const correlacao = diag.correlacao_patentaria || gerarCorrelacaoPatentariaReal(dados, diag);
    const painelReivindicacao = document.getElementById('painel-reivindicacao-inpi');
    if (painelReivindicacao && correlacao) {
        painelReivindicacao.innerHTML = `
            <div class="alert-card alert-INFO" style="margin-bottom: 1.1rem;">
                <span class="inpi-badge">CLASSIFICAÇÃO INTERNACIONAL DE PATENTES (CIP / IPC — OMPI & INPI)</span>
                <h4>Classes Tecnológicas Identificadas para Busca de Anterioridade e Depósito no INPI:</h4>
                <p style="margin-top: 0.35rem;">${correlacao.codigos_cip.map(c => `<code style="display:inline-block;margin:0.2rem 0.35rem 0.2rem 0;padding:0.25rem 0.6rem;background:rgba(249,115,22,0.14);border:1px solid rgba(249,115,22,0.4);border-radius:6px;color:#fed7aa;">${c}</code>`).join('')}</p>
            </div>
            <div class="alert-card alert-SUCESSO" style="margin-bottom: 0.5rem;">
                <span class="inpi-badge">ENGENHARIA PATENTÁRIA NO INPI • ART. 8º, 9º, 10 V, 24 E 25 DA LPI</span>
                <h4>${correlacao.titulo_quadro_patentario}</h4>
                <p style="margin-bottom: 0.85rem;">${correlacao.explicacao_art10v}</p>
                <div style="background: rgba(15, 12, 24, 0.85); border: 1px solid rgba(249, 115, 22, 0.45); border-radius: 10px; padding: 1rem 1.2rem; font-family: 'JetBrains Mono', monospace; font-size: 0.84rem; color: #ffedd5; line-height: 1.65; white-space: pre-wrap;">${correlacao.texto_reivindicacao_1}</div>
            </div>
        `;
    }

    const tbodyCorrelacao = document.getElementById('tabela-correlacao-engenharia-lei');
    if (tbodyCorrelacao && correlacao && correlacao.linhas_correlacao) {
        tbodyCorrelacao.innerHTML = correlacao.linhas_correlacao.map(linha => `
            <tr>
                <td>${linha.elemento}</td>
                <td>${linha.protecao}</td>
                <td>${linha.base_legal}</td>
                <td>${linha.providencia}</td>
            </tr>
        `).join('');
    }

    // Renderizar recomendações INPI
    const inpiContainer = document.getElementById('lista-recomendacoes-inpi');
    inpiContainer.innerHTML = '';
    diag.recomendacoes_inpi.forEach(rec => {
        const div = document.createElement('div');
        div.className = 'alert-card alert-INFO';
        div.innerHTML = `
            <span class="inpi-badge">${rec.codigo} • ${rec.prioridade} • ${rec.prazo}</span>
            <h4>${rec.titulo}</h4>
            <p style="margin-bottom:0.4rem;"><strong>Diploma Legal:</strong> ${rec.base_legal}</p>
            <p>${rec.justificativa}</p>
        `;
        inpiContainer.appendChild(div);
    });

    if (diag.camadas_analise && diag.camadas_analise.length > 0) {
        diag.camadas_analise.forEach(c => {
            const div = document.createElement('div');
            div.className = 'alert-card alert-ATENCAO';
            div.innerHTML = `
                <span class="inpi-badge">${c.camada}</span>
                <h4>${c.status}</h4>
                <p>${c.detalhe}</p>
            `;
            inpiContainer.appendChild(div);
        });
    }

    // Renderizar alertas dogmáticos e de licenças
    const licContainer = document.getElementById('lista-alertas-licenca');
    licContainer.innerHTML = '';
    diag.alertas_licenca.forEach(alerta => {
        const div = document.createElement('div');
        div.className = `alert-card alert-${alerta.nivel}`;
        div.innerHTML = `
            <h4>[${alerta.nivel}] ${alerta.titulo}</h4>
            <p>${alerta.descricao}</p>
        `;
        licContainer.appendChild(div);
    });

    // Renderizar Tabela de Custos e Vigências do INPI
    const tbodyCustos = document.getElementById('tabela-custos-inpi');
    if (tbodyCustos) {
        tbodyCustos.innerHTML = diag.recomendacoes_inpi.map(rec => {
            const info = TABELA_CUSTOS_INPI[rec.codigo] || TABELA_CUSTOS_INPI.RPC;
            return `
                <tr>
                    <td><span class="inpi-badge">${rec.codigo}</span> <strong>${rec.titulo}</strong></td>
                    <td>${info.sistema}</td>
                    <td><strong style="color: var(--orange-light);">${info.taxa_desconto}</strong></td>
                    <td>${info.taxa_cheia}</td>
                    <td>${info.prazo_medio}</td>
                </tr>
            `;
        }).join('');
    }
}

// Gerador Automatizado de Minutas Contratuais, Certificado de Titularidade e Dossiê Multicamada (Aba 3)
function gerarMinutaAutomatizada(tipoDocumento) {
    const p = ultimoProjetoAvaliado || CASO_BASE_INICIAL;
    const d = ultimoDiagnostico || motorDecisaoLocal(p);
    const corr = d.correlacao_patentaria || gerarCorrelacaoPatentariaReal(p, d);
    const verif = ultimaVerificacaoExistencia || {};
    const dataHoje = new Date().toLocaleDateString('pt-BR');
    const hashReal = verif.hash_sha512_calculado || (Array.from(p.nome_projeto + tipoDocumento + dataHoje)
        .reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0)
        .toString(16).replace('-', 'f8a9') + 'e4b29c0177d3a8f1928374650192837465a918273645');
    const protocoloAtivo = (verif.registro_gravado && verif.registro_gravado.protocolo_registro)
        ? verif.registro_gravado.protocolo_registro
        : `BR-OBS-${new Date().getFullYear()}-${hashReal.substring(0, 6).toUpperCase()}`;

    let texto = '';

    if (tipoDocumento === 'CERTIFICADO_TITULARIDADE') {
        texto = `================================================================================
CERTIFICADO OFICIAL DE VERIFICAÇÃO DE ANTERIORIDADE, RESERVA DE TITULARIDADE
E ASSINATURA DIGITAL CRIPTOGRÁFICA (SHA-512)
================================================================================

PROTOCOLO DE REGISTRO NO OBSERVATÓRIO: ${protocoloAtivo}
STATUS DA VERIFICAÇÃO DE EXISTÊNCIA: ${verif.titulo_veredito || 'CRIAÇÃO VERIFICADA E DISPONÍVEL PARA O TITULAR'}
DATA E HORA DE EMISSÃO: ${new Date().toLocaleString('pt-BR')}

1. QUALIFICAÇÃO DO(S) TITULAR(ES) E INVENTOR(ES)
• Nome Completo / Equipe: ${p.autor_nome}
• Documento (CPF / CNPJ): ${p.autor_documento}
• Organização / Startup / ICT: ${p.instituicao_empresa}
• Contato Oficial Registrado: ${p.autor_email}

2. ESPECIFICAÇÃO DO ATIVO DE HARDWARE, IOT E SOFTWARE REIVINDICADO
• Denominação Técnica e Marca Pretendida (Camada D): "${p.nome_projeto}"
• Classificação Internacional de Patentes (CIP / IPC): ${corr.codigos_cip.join(' | ')}
• Memorial Descritivo Sintético (Art. 24 da Lei nº 9.279/96):
  "${p.resumo_tecnico}"

3. LAUDO DE VERIFICAÇÃO DE EXISTÊNCIA E ANTERIORIDADE (ART. 11 E ART. 124 DA LPI)
• Parecer do Motor de Colisão: ${verif.explicacao_veredito || 'Nenhuma anterioridade bloqueante de terceiro localizada na base fixa.'}
• Enquadramento Primário no INPI: ${d.protecao_inpi_primaria}
• Enquadramento Complementar: ${d.protecao_inpi_secundaria}
• Licenciamento Definido (Camada A — Esquemático/PCB): ${d.licenca_hw_recomendada}
• Licenciamento Definido (Camada E — Firmware ${p.linguagem_firmware}): ${d.licenca_sw_recomendada}

4. MINUTA DA REIVINDICAÇÃO PATENTÁRIA VINCULADA (ART. 25 DA LPI E RES. INPI 158/2016)
${corr.texto_reivindicacao_1}

5. IMPRESSÃO DIGITAL CRIPTOGRÁFICA (PROVA DE AUTORIA ANTERIOR — ART. 3º LEI 9.609/98)
Hash SHA-512 do Projeto e Código-Fonte:
${hashReal}

6. RESSALVA LEGAL E NECESSIDADE DE VALIDAÇÃO OFICIAL NO PORTAL DO INPI (AUTARQUIA FEDERAL)
• Natureza deste Certificado: Este documento constitui Laudo Acadêmico-Jurídico de Triagem de Anterioridade e Prova Técnica de Autoria/Integridade Criptográfica (SHA-512).
• Validação Estatal Obrigatória: Nos termos dos Arts. 6º, 19, 30 e 129 da Lei nº 9.279/1996 (LPI), a exclusividade comercial de Patente (PI/MU), Desenho Industrial (DI) ou Marca em todo o território nacional depende obrigatoriamente de busca complementar e protocolo formal do pedido diretamente no portal oficial do Instituto Nacional da Propriedade Industrial — INPI (https://www.gov.br/inpi/pt-br e https://busca.inpi.gov.br/pePI/), mediante recolhimento da Guia de Recolhimento da União (GRU) e exame técnico pelos examinadores federais.

Declara-se, para fins de prova de anterioridade técnica e autoral nos termos do Art. 5º, XXVII a XXIX da CF/88, da Lei nº 9.279/1996 (LPI), da Lei nº 9.609/1998 e da Lei nº 9.610/1998, que a especificação técnica acima foi auditada e vinculada ao titular identificado sob o protocolo ${protocoloAtivo}.

__________________________________________________
TITULAR / DEPOSITANTE: ${p.autor_nome} (${p.autor_documento})
Observatório de Propriedade Intelectual e Hardware Aberto — Brasil`;
    } else if (tipoDocumento === 'CESSAO_DIREITOS') {
        texto = `INSTRUMENTO PARTICULAR DE CESSÃO DE DIREITOS PATRIMONIAIS SOBRE PROJETO MULTICAMADA DE HARDWARE, IOT E SOFTWARE EMBARCADO

Fundamentação Constitucional e Legal: Art. 5º, incisos XXVII, XXVIII e XXIX da Constituição Federal de 1988; Lei nº 9.279/1996 (LPI — Arts. 6º, 8º, 9º, 10 V, 24, 25, 88 a 93 e 129); Resolução INPI/PR nº 158/2016; Lei nº 9.609/1998 (Lei de Software — Arts. 2º e 4º); Lei nº 9.610/1998 (LDA — Art. 7º, XI e XII); Lei nº 11.484/2007 (Topografia de Circuitos Integrados); Lei nº 9.472/1997 (ANATEL, Art. 162); Lei nº 13.709/2018 (LGPD, Arts. 6º, 11 e 46) e Lei nº 10.973/2004 (Marco Legal de CT&I).

1. QUALIFICAÇÃO DAS PARTES
CEDENTE(S) (CRIADORES / PROJETISTAS): ${p.autor_nome}, inscrito(s) sob CPF/CNPJ nº ${p.autor_documento}, e-mail ${p.autor_email}.
CESSIONÁRIA (ORGANIZAÇÃO / TITULAR / ICT): ${p.instituicao_empresa}.

2. DO OBJETO HÍBRIDO E MULTICAMADA CEDIDO
Cláusula 2.1. O presente instrumento formaliza a cessão definitiva dos direitos patrimoniais relativos ao ativo tecnológico de hardware e IoT denominado "${p.nome_projeto}" (Protocolo de Anterioridade: ${protocoloAtivo}).
Cláusula 2.2. Síntese Técnica e Problema Resolvido: ${p.resumo_tecnico}
Cláusula 2.3. Considerando a ausência de estatuto único para o hardware no ordenamento brasileiro, a presente transferência abrange expressamente as 6 (seis) camadas de proteção aplicáveis:
  • Camada A (Documentação Técnica — Lei nº 9.610/98, Art. 7º, XI): esquemáticos elétricos, leiaute de PCB, arquivos Gerber, BOM e manuais técnicos;
  • Camada B (Design do Produto — Lei nº 9.279/96, Art. 94): forma plástica ornamental e configuração estética externa do aparelho;
  • Camada C (Semicondutores — Lei nº 11.484/2007, Arts. 26 a 55): configuração tridimensional das camadas de microchips/silício, quando aplicável;
  • Camada D (Signos Distintivos — Lei nº 9.279/96, Art. 129): direitos de depósito e uso exclusivo sobre o nome comercial, marca e logotipo na Classe NCL 9 (prevenindo cisões societárias nos moldes do precedente Arduino LLC vs. Arduino SRL);
  • Camada E (Software Embarcado — Lei nº 9.609/98, Art. 2º e Art. 4º): código-fonte funcional desenvolvido em ${p.linguagem_firmware};
  • Camada F (Solução Técnica — Lei nº 9.279/96, Arts. 8º, 9º, 24 e 25 c/c Resolução INPI nº 158/2016): direitos de requerer Patente de Invenção ou Modelo de Utilidade sobre a funcionalidade eletromecânica ou processo assistido por software com efeito técnico físico.

3. DO ENQUADRAMENTO RECOMENDADO PELO OBSERVATÓRIO DE PI
  • Classificação Internacional de Patentes (CIP/IPC): ${corr.codigos_cip.join(' | ')}
  • Proteção Primária no INPI: ${d.protecao_inpi_primaria}
  • Proteção Complementar no INPI: ${d.protecao_inpi_secundaria}
  • Regime Definido para a Camada A (Hardware): ${d.licenca_hw_recomendada}
  • Regime Definido para a Camada E (Firmware): ${d.licenca_sw_recomendada}

Local e Data: Brasil, ${dataHoje}.

__________________________________________________
CEDENTE(S): ${p.autor_nome}

__________________________________________________
CESSIONÁRIA: ${p.instituicao_empresa}

[Código Hash SHA-512: ${hashReal}]`;
    } else if (tipoDocumento === 'TERMO_OPEN_HARDWARE_CERN') {
        texto = `TERMO DE LICENCIAMENTO PÚBLICO DE HARDWARE ABERTO (OSHW) COM RESERVA EXPRESSA DE MARCA REGISTRADA

PROJETO: ${p.nome_projeto} (Protocolo: ${protocoloAtivo})
TITULARES DOS DIREITOS PATRIMONIAIS: ${p.autor_nome} (${p.instituicao_empresa})
CONTATO OFICIAL: ${p.autor_email}

1. NATUREZA JURÍDICA DESTA LICENÇA (AUTONOMIA PRIVADA)
Nos termos da Lei nº 9.610/1998 (LDA) e da Lei nº 9.279/1996 (LPI), a presente licença constitui negócio jurídico contratual pelo qual os titulares exercem seu direito de disposição, autorizando o uso, estudo, modificação e fabricação do projeto sob as condições abaixo (sendo a alternativa ao cumprimento destas condições a proibição legal de uso).

2. CAMADA A — ESQUEMÁTICOS, LEIAUTE DE PCB E DOCUMENTAÇÃO (${d.licenca_hw_recomendada})
2.1. Os desenhos de esquemático, leiaute de placa de circuito impresso, arquivos Gerber e lista de materiais (BOM) são licenciados sob ${d.licenca_hw_recomendada}, em conformidade com a definição da Open Source Hardware Association (OSHWA).
2.2. Qualquer pessoa física ou jurídica está autorizada a estudar, modificar, fabricar e comercializar o aparelho físico, observadas as regras de atribuição e compartilhamento da licença indicada.

3. CAMADA E — FIRMWARE E CÓDIGO-FONTE EMBARCADO (${d.licenca_sw_recomendada})
3.1. O firmware desenvolvido em ${p.linguagem_firmware}, tutelado pela Lei nº 9.609/1998, é licenciado sob ${d.licenca_sw_recomendada}.

4. CAMADA D — RESERVA ABSOLUTA DE MARCA E SIGNOS DISTINTIVOS (CLÁUSULA ARDUINO)
4.1. Em estrita observância ao Art. 129 e Art. 189 da Lei nº 9.279/1996 (LPI), esta licença técnica NÃO concede qualquer direito de uso sobre a denominação comercial, marca ou logotipo associados a "${p.nome_projeto}" ou "${p.instituicao_empresa}".
4.2. Terceiros podem fabricar e vender livremente placas derivadas deste projeto, mas estão proibidos de comercializá-las utilizando a marca oficial dos titulares sem contrato específico de licenciamento de marca, mantendo-se o signo distintivo como vetor exclusivo de controle de qualidade e sustentabilidade financeira do projeto.

5. EFEITO DE PUBLICAÇÃO DEFENSIVA (ART. 11 DA LPI) E CONFORMIDADE REGULATÓRIA (ANATEL)
5.1. A publicação irrestrita desta documentação incorpora a arquitetura ao estado da técnica (Art. 11 da LPI), impedindo a apropriação patentária indevida por terceiros.
5.2. O fabricante de placas derivadas que contenham transceptores de radiofrequência é integralmente responsável pela observância do Art. 162 da Lei nº 9.472/1997 e da Resolução ANATEL nº 715/2019.

Brasil, ${dataHoje}.
Resumo de Auditoria SHA-512: ${hashReal}`;
    } else if (tipoDocumento === 'LICENCIAMENTO_COMERCIAL_IOT') {
        texto = `CONTRATO DE LICENCIAMENTO INDUSTRIAL DE HARDWARE/IOT, CONFIDENCIALIDADE E CONFORMIDADE REGULATÓRIA (ANATEL E LGPD)

ATIVO TECNOLÓGICO: ${p.nome_projeto} (Protocolo: ${protocoloAtivo})
LICENCIANTE: ${p.instituicao_empresa} (${p.autor_nome} — Doc: ${p.autor_documento})

1. OBJETO DO LICENCIAMENTO INDUSTRIAL
1.1. Concessão de licença de exploração comercial da tecnologia "${p.nome_projeto}", abrangendo circuitos, layouts de PCB, sensores e firmware embarcado (${p.linguagem_firmware}).
1.2. Especificação Funcional: ${p.resumo_tecnico}

2. TUTELA CONTRA ESPIONAGEM INDUSTRIAL, CLONAGEM E COPIA DE SEMICONDUTORES
2.1. O presente contrato protege ativos enquadrados em:
  • ${d.protecao_inpi_primaria}
  • ${d.protecao_inpi_secundaria}
2.2. Em prevenção a ilícitos de apropriação indevida de projetos (a exemplo dos precedentes Waymo vs. Uber sobre sensores LiDAR e Intel vs. AMD sobre layouts de processadores), é estritamente vedado à LICENCIADA:
  a) Realizar cópia não autorizada de configurações tridimensionais de máscaras de semicondutores (Lei nº 11.484/2007, Arts. 26 a 55);
  b) Extrair binários gravados em memória Flash ou reproduzir a expressão gráfica dos esquemáticos confidenciais (Art. 195, inciso XI da Lei nº 9.279/96 e Lei nº 9.609/98).

3. CONFORMIDADE REGULATÓRIA EM TELECOMUNICAÇÕES (ANATEL) E DADOS (LGPD)
3.1. A comercialização de unidades físicas dotadas de radiofrequência observará o Art. 162 da Lei nº 9.472/1997 e a Resolução ANATEL nº 715/2019.
3.2. O tratamento de telemetria coletada pelos sensores observará o Art. 6º, Art. 11 e Art. 46, § 2º (Privacy by Design) da Lei nº 13.709/2018 (LGPD).

4. REMUNERAÇÃO E FORO
4.1. A exploração comercial sujeita-se ao pagamento de royalties por unidade fabricada, permanecendo o dever de sigilo técnico vigente por 10 (dez) anos.

Brasil, ${dataHoje}.

__________________________________________________
LICENCIANTE: ${p.instituicao_empresa}

[Resumo de Verificação SHA-512: ${hashReal}]`;
    } else if (tipoDocumento === 'MEMORIAL_INPI') {
        texto = `DOSSIÊ TÉCNICO-PATENTÁRIO MULTICAMADA (A–F) E MINUTA DE REIVINDICAÇÃO PARA SUBMISSÃO AO INPI

1. IDENTIFICAÇÃO DO PROJETO E AUTORIA
• Protocolo de Anterioridade no Observatório: ${protocoloAtivo}
• Projeto: ${p.nome_projeto}
• Autores / Inventores: ${p.autor_nome} (${p.autor_documento})
• Organização / ICT Depositante: ${p.instituicao_empresa}
• Data de Emissão: ${dataHoje}
• Índice de Protegibilidade: ${d.score_protegibilidade}/100 | Risco de Conflito: ${d.risco_contaminacao_licenca}
• Classificação Internacional de Patentes (CIP / IPC): ${corr.codigos_cip.join(' ; ')}

2. SÍNTESE DESCRITIVA DO PROBLEMA TÉCNICO E DA SOLUÇÃO FÍSICA (ART. 24 DA LPI)
"${p.resumo_tecnico}"

3. MINUTA DA REIVINDICAÇÃO PATENTÁRIA INDEPENDENTE Nº 1 (ART. 25 DA LPI E IN INPI Nº 30/2013)
${corr.texto_reivindicacao_1}

4. DIAGNÓSTICO NAS 6 CAMADAS DO HARDWARE (FUNDAMENTO: CF/88 ART. 5º, XXVII–XXIX)
  • Camada A (Documentação Técnica — Lei 9.610/98, Art. 7º, XI): ${d.licenca_hw_recomendada}
  • Camada B (Design do Produto — Lei 9.279/96, Art. 94): ${p.possui_design_externo_novo ? 'Registro de Desenho Industrial (10 a 25 anos)' : 'Não requerido'}
  • Camada C (Semicondutores — Lei 11.484/2007, Arts. 26–55): ${p.possui_topografia_chip ? 'Registro de Topografia de Circuito Integrado (10 anos / PADIS)' : 'Não requerido'}
  • Camada D (Signos Distintivos — Lei 9.279/96, Art. 129): Registro de Marca no INPI — Classe NCL 9 (10 anos, renovável indefinidamente)
  • Camada E (Software Embarcado — Lei 9.609/98, Art. 2º e 3º): ${d.licenca_sw_recomendada} (Vigência de 50 anos — Depósito Hash SHA-512)
  • Camada F (Solução Técnica — Lei 9.279/96, Art. 8º/9º e Res. INPI 158/2016): ${d.protecao_inpi_primaria}

5. PARECERES E APONTAMENTICOS DOGMÁTICOS DO MOTOR DE DECISÃO (INCLUINDO ANATEL E LGPD)
${d.alertas_licenca.map(a => `  • [${a.nivel}] ${a.titulo}:\n    ${a.descricao}`).join('\n\n')}

6. ROTEIRO DE PROVIDÊNCIAS PRÁTICAS JUNTO AO SETOR JURÍDICO, INPI, ANATEL E NIT
  [ ] Protocolar pedido de Registro de Marca (Camada D) no sistema e-Marcas (Classe NCL 9) para garantir exclusividade nominativa (Art. 129 da LPI).
  [ ] Gerar hash SHA-512 do código-fonte em ${p.linguagem_firmware} para depósito probatório no e-Software (Camada E — Art. 3º da Lei 9.609/98).
  [ ] Submeter o Relatório Descritivo (Art. 24 LPI) e o Quadro Reivindicatório acima (Art. 25 LPI) no sistema e-Patentes, observando a Resolução INPI nº 158/2016.
  [ ] Verificar a conformidade do transceptor de radiofrequência perante o Art. 162 da Lei nº 9.472/97 e Resolução ANATEL nº 715/2019.
  [ ] Caso haja vínculo com ICT pública, submeter este dossiê ao Núcleo de Inovação Tecnológica (NIT) nos termos da Lei nº 10.973/2004.

Observatório de Propriedade Intelectual e Hardware Aberto.
Resumo de Verificação SHA-512: ${hashReal}`;
    }

    const viewer = document.getElementById('contract-viewer-box');
    if (viewer) viewer.textContent = texto;

    fetch('api/minuta.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            diagnostico_id: d.diagnostico_id || 1,
            tipo_documento: tipoDocumento,
            partes_qualificacao: `${p.autor_nome} / ${p.instituicao_empresa}`,
            conteudo_minuta: texto
        })
    }).catch(() => {});
}

// Exporta a minuta atual como arquivo .doc (Word)
function baixarMinutaArquivo() {
    const conteudo = document.getElementById('contract-viewer-box').textContent;
    const blob = new Blob([conteudo], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Documento_Observatorio_PI_Hardware.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Salva histórico de testes no navegador e atualiza tabela na Aba 4
function salvarHistoricoLocal(dados, diag) {
    const lista = JSON.parse(localStorage.getItem('historico_observatorio_pi') || '[]');
    lista.unshift({
        nome_projeto: dados.nome_projeto,
        modelo_negocio: dados.modelo_negocio,
        score: diag.score_protegibilidade,
        risco: diag.risco_contaminacao_licenca,
        inpi: diag.protecao_inpi_primaria,
        lic_hw: diag.licenca_hw_recomendada,
        lic_sw: diag.licenca_sw_recomendada,
        data: diag.timestamp_avaliacao
    });
    localStorage.setItem('historico_observatorio_pi', JSON.stringify(lista.slice(0, 10)));
    renderizarTabelaHistorico();
}

function renderizarTabelaHistorico() {
    const tbody = document.getElementById('tabela-historico-body');
    if (!tbody) return;
    const lista = JSON.parse(localStorage.getItem('historico_observatorio_pi') || '[]');
    if (lista.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#cbd5e1;">Nenhuma avaliação processada nesta sessão. Descreva seu caso na Aba 01 e clique em Verificar se Já Existe.</td></tr>';
        return;
    }
    tbody.innerHTML = lista.map(item => `
        <tr>
            <td><strong>${item.nome_projeto}</strong></td>
            <td>${item.inpi}</td>
            <td>${item.lic_hw}</td>
            <td>${item.lic_sw}</td>
            <td><strong>${item.score}/100</strong></td>
            <td><span class="inpi-badge">${item.risco}</span></td>
        </tr>
    `).join('');
}

// Controla a barra de rolagem laranja oculta que só aparece quando o mouse vai ao canto direito
function inicializarBarraRolagemCantoDireito() {
    const zone = document.getElementById('edge-scroll-zone');
    const track = document.getElementById('edge-scroll-track');
    const thumb = document.getElementById('edge-scroll-thumb');
    if (!zone || !track || !thumb) return;

    function atualizarPosicaoThumb() {
        const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        const winHeight = window.innerHeight;
        const maxScroll = docHeight - winHeight;

        if (maxScroll <= 4) {
            zone.style.display = 'none';
            return;
        }
        zone.style.display = '';

        const trackHeight = track.clientHeight || (winHeight - 16);
        const ratio = winHeight / docHeight;
        const thumbHeight = Math.max(48, Math.round(trackHeight * ratio));
        const maxThumbTop = trackHeight - thumbHeight;
        const scrollRatio = window.scrollY / maxScroll;
        const thumbTop = Math.min(maxThumbTop, Math.max(0, Math.round(scrollRatio * maxThumbTop)));

        thumb.style.height = `${thumbHeight}px`;
        thumb.style.transform = `translateY(${thumbTop}px)`;
    }

    window.addEventListener('scroll', atualizarPosicaoThumb, { passive: true });
    window.addEventListener('resize', atualizarPosicaoThumb);

    let arrastando = false;
    let inicioY = 0;
    let inicioScrollY = 0;

    thumb.addEventListener('mousedown', (e) => {
        arrastando = true;
        inicioY = e.clientY;
        inicioScrollY = window.scrollY;
        zone.classList.add('dragging');
        document.body.style.userSelect = 'none';
        e.preventDefault();
        e.stopPropagation();
    });

    window.addEventListener('mousemove', (e) => {
        if (!arrastando) return;
        const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        const winHeight = window.innerHeight;
        const maxScroll = docHeight - winHeight;
        const trackHeight = track.clientHeight || (winHeight - 16);
        const thumbHeight = thumb.offsetHeight || 48;
        const maxThumbTop = Math.max(1, trackHeight - thumbHeight);

        const deltaY = e.clientY - inicioY;
        const scrollDelta = (deltaY / maxThumbTop) * maxScroll;
        window.scrollTo(0, inicioScrollY + scrollDelta);
    });

    window.addEventListener('mouseup', () => {
        if (!arrastando) return;
        arrastando = false;
        zone.classList.remove('dragging');
        document.body.style.userSelect = '';
    });

    track.addEventListener('click', (e) => {
        if (e.target === thumb) return;
        const rect = track.getBoundingClientRect();
        const clickRatio = (e.clientY - rect.top) / rect.height;
        const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        const maxScroll = docHeight - window.innerHeight;
        window.scrollTo({ top: clickRatio * maxScroll, behavior: 'smooth' });
    });

    setTimeout(atualizarPosicaoThumb, 80);
}

// Inicialização automática com verificação de existência e carregamento do banco fixo
document.addEventListener('DOMContentLoaded', async () => {
    const c = CASO_BASE_INICIAL;
    const campoRelato = document.getElementById('relato_livre_usuario');
    if (campoRelato) campoRelato.value = c.relato_livre;

    document.getElementById('nome_projeto').value = c.nome_projeto;
    document.getElementById('autor_nome').value = c.autor_nome;
    document.getElementById('autor_documento').value = c.autor_documento;
    document.getElementById('autor_email').value = c.autor_email;
    document.getElementById('instituicao_empresa').value = c.instituicao_empresa;
    document.getElementById('resumo_tecnico').value = c.resumo_tecnico;
    document.getElementById('grau_novidade_hardware').value = c.grau_novidade_hardware;
    if (document.getElementById('divulgacao_previa')) {
        document.getElementById('divulgacao_previa').value = c.divulgacao_previa;
    }
    if (document.getElementById('conectividade_iot_rf')) {
        document.getElementById('conectividade_iot_rf').value = c.conectividade_iot_rf;
    }
    if (document.getElementById('telemetria_dados_iot')) {
        document.getElementById('telemetria_dados_iot').value = c.telemetria_dados_iot;
    }
    document.getElementById('possui_pcb_customizada').checked = c.possui_pcb_customizada;
    document.getElementById('possui_topografia_chip').checked = c.possui_topografia_chip;
    document.getElementById('possui_design_externo_novo').checked = c.possui_design_externo_novo;
    document.getElementById('usa_hardware_aberto_terceiros').value = c.usa_hardware_aberto_terceiros;
    document.getElementById('possui_firmware_proprio').checked = c.possui_firmware_proprio;
    document.getElementById('linguagem_firmware').value = c.linguagem_firmware;
    document.getElementById('licenca_bibliotecas_terceiros').value = c.licenca_bibliotecas_terceiros;
    document.getElementById('vinculacao_firmware').value = c.vinculacao_firmware;
    document.getElementById('modelo_negocio').value = c.modelo_negocio;
    document.getElementById('titularidade_tipo').value = c.titularidade_tipo;

    const campoCodigo = document.getElementById('trecho_codigo_inspecao');
    if (campoCodigo) {
        campoCodigo.value = c.trecho_codigo || '';
        inspecionarTrechoCodigo();
    }

    const campoNome = document.getElementById('nome_projeto');
    if (campoNome) {
        campoNome.dataset.autoGerado = 'false';
        campoNome.addEventListener('input', () => {
            campoNome.dataset.autoGerado = campoNome.value.trim() === '' ? 'true' : 'false';
            autoMarcarEnquantoDigita();
        });
    }

    // Dispara auto-identificação inicial para preencher o resumo visual de badges e correlações
    autoMarcarEnquantoDigita();
    // Mantém os valores exatos do caso base inicial após exibir os achados
    document.getElementById('nome_projeto').value = c.nome_projeto;
    document.getElementById('resumo_tecnico').value = c.resumo_tecnico;
    document.getElementById('modelo_negocio').value = c.modelo_negocio;
    document.getElementById('titularidade_tipo').value = c.titularidade_tipo;
    atualizarBadgesAutoMarcacao();

    const gaveta = document.getElementById('gaveta-parametros-avancados');
    if (gaveta) {
        gaveta.querySelectorAll('select, input').forEach(el => {
            el.addEventListener('change', () => atualizarBadgesAutoMarcacao());
            el.addEventListener('input', () => atualizarBadgesAutoMarcacao());
        });
    }

    ultimoProjetoAvaliado = c;
    ultimoDiagnostico = motorDecisaoLocal(ultimoProjetoAvaliado);
    renderizarRelatorioDiagnostico(ultimoProjetoAvaliado, ultimoDiagnostico);

    // Carrega e verifica existência real na inicialização
    const verifInicial = await verificarExistenciaLocalEApi(ultimoProjetoAvaliado, ultimoDiagnostico, 'VERIFICAR');
    renderizarPainelVerificacaoExistencia(verifInicial);
    buscarEstadoDaTecnicaMundialAoVivo(ultimoProjetoAvaliado, ultimoDiagnostico);

    gerarMinutaAutomatizada('CERTIFICADO_TITULARIDADE');
    renderizarTabelaHistorico();
    inicializarBarraRolagemCantoDireito();
});
