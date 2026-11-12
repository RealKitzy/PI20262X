-- ============================================================================
-- OBSERVATÓRIO DE PROPRIEDADE INTELECTUAL E HARDWARE ABERTO (BRASIL)
-- Modelo Físico de Dados (SQL Compatível com MySQL/MariaDB e SQLite)
-- Legislação Base: Lei 9.279/96 (LPI), Lei 9.609/98 (Software), Lei 11.484/07 (TCI)
-- ============================================================================

-- 1. Tabela de Projetistas / Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_completo VARCHAR(150) NOT NULL,
    documento_cpf_cnpj VARCHAR(25) NOT NULL UNIQUE, -- só dígitos (11 = CPF, 14 = CNPJ); um cadastro por titular
    email VARCHAR(120) NOT NULL,
    instituicao_empresa VARCHAR(150),
    perfil VARCHAR(50) DEFAULT 'Projetista IoT / Embarcados', -- Startup, ICT/Universidade, Maker, Indústria
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Catálogo de Modalidades de Proteção do INPI (Brasil)
CREATE TABLE IF NOT EXISTS modalidades_inpi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo VARCHAR(20) NOT NULL UNIQUE, -- PI, MU, TCI, RPC, DI
    nome VARCHAR(120) NOT NULL,
    base_legal VARCHAR(150) NOT NULL,
    prazo_vigencia VARCHAR(80) NOT NULL,
    escopo_protecao TEXT NOT NULL,
    requisitos_legais TEXT NOT NULL,
    aplicacao_iot_hardware TEXT NOT NULL
);

-- 3. Catálogo de Licenças Livres (Software & Open Source Hardware - OSHW)
CREATE TABLE IF NOT EXISTS licencas_catalogo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo VARCHAR(30) NOT NULL UNIQUE, -- MIT, GPLv3, LGPLv3, CERN-OHL-P, CERN-OHL-W, CERN-OHL-S, TAPR-OHL, PROPRIETARIA
    nome VARCHAR(120) NOT NULL,
    camada_alvo VARCHAR(40) NOT NULL, -- HARDWARE, SOFTWARE, AMBOS
    tipo_permissividade VARCHAR(40) NOT NULL, -- PERMISSIVA, COPYLEFT_FRACO, COPYLEFT_FORTE, FECHADA
    efeito_viral BOOLEAN DEFAULT 0,
    permite_uso_comercial BOOLEAN DEFAULT 1,
    exige_abertura_derivados BOOLEAN DEFAULT 0,
    compatibilidade_patente VARCHAR(100),
    descricao_juridica TEXT NOT NULL
);


-- 4. Projetos de Hardware/IoT Submetidos à Plataforma
CREATE TABLE IF NOT EXISTS projetos_avaliados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    nome_projeto VARCHAR(180) NOT NULL,
    resumo_tecnico TEXT NOT NULL,
    -- Camada de Hardware / Eletrônica
    grau_novidade_hardware VARCHAR(40) NOT NULL, -- INEDITO_INVENTIVO, MELHORIA_FUNCIONAL, MODULOS_PRONTOS_COTS
    possui_pcb_customizada BOOLEAN DEFAULT 0,
    possui_topografia_chip BOOLEAN DEFAULT 0, -- ASIC / Layout de máscara de semicondutor
    possui_design_externo_novo BOOLEAN DEFAULT 0, -- Gabinete / Case plástico/metálico
    usa_hardware_aberto_terceiros VARCHAR(40) DEFAULT 'NENHUM', -- NENHUM, CERN_OHL_S, CERN_OHL_W, CERN_OHL_P, ARDUINO_CC_BY_SA
    -- Camada de Firmware / Software Embarcado
    possui_firmware_proprio BOOLEAN DEFAULT 1,
    linguagem_firmware VARCHAR(80) DEFAULT 'C/C++',
    licenca_bibliotecas_terceiros VARCHAR(40) DEFAULT 'MIT_BSD_APACHE', -- NENHUMA, MIT_BSD_APACHE, LGPL_DINAMICA, LGPL_ESTATICA, GPL_V2_V3
    vinculacao_firmware VARCHAR(40) DEFAULT 'ESTATICA_MONOLITICA', -- ESTATICA_MONOLITICA, DINAMICA_SO, NAO_APLICAVEL
    -- Estratégia de Negócio e Comercialização
    modelo_negocio VARCHAR(50) NOT NULL, -- COMERCIAL_FECHADO, HIBRIDO_HW_ABERTO_SW_FECHADO, HIBRIDO_HW_FECHADO_SW_ABERTO, OPEN_SOURCE_TOTAL, TRANSFERENCIA_ICT
    titularidade_tipo VARCHAR(50) DEFAULT 'AUTONOMO_EMPRESA', -- AUTONOMO_EMPRESA, PARCERIA_COAUTORIA, VINCULO_EMPREGATICIO_ICT
    data_submissao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- 5. Diagnósticos Gerados pelo Motor de Decisão
CREATE TABLE IF NOT EXISTS diagnosticos_gerados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projeto_id INTEGER NOT NULL,
    score_protegibilidade INTEGER NOT NULL, -- 0 a 100
    risco_contaminacao_licenca VARCHAR(30) NOT NULL, -- NULO, BAIXO, MEDIO, ALTO_CRITICO
    protecao_inpi_primaria VARCHAR(200) NOT NULL,   -- texto descritivo exibido no relatório
    protecao_inpi_secundaria VARCHAR(255),
    licenca_hw_recomendada VARCHAR(200) NOT NULL,
    licenca_sw_recomendada VARCHAR(200) NOT NULL,
    modalidade_primaria_codigo VARCHAR(20) NULL,    -- código da modalidade principal (catálogo modalidades_inpi)
    licenca_hw_codigo VARCHAR(30) NULL,             -- licença de hardware recomendada (catálogo licencas_catalogo)
    licenca_sw_codigo VARCHAR(30) NULL,             -- licença de software recomendada (catálogo licencas_catalogo)
    json_parecer_completo TEXT NOT NULL, -- Armazena o detalhamento das regras acionadas
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (projeto_id) REFERENCES projetos_avaliados(id),
    FOREIGN KEY (modalidade_primaria_codigo) REFERENCES modalidades_inpi(codigo),
    FOREIGN KEY (licenca_hw_codigo) REFERENCES licencas_catalogo(codigo),
    FOREIGN KEY (licenca_sw_codigo) REFERENCES licencas_catalogo(codigo)
);


-- Tabelas de versões anteriores que o sistema não usa mais
DROP TABLE IF EXISTS minutas_geradas;
DROP TABLE IF EXISTS regras_classificacao;

-- ============================================================================
-- CARGA INICIAL DE DADOS (SEED): MODALIDADES DO INPI E LICENÇAS LIVRES
-- ============================================================================

INSERT OR IGNORE INTO modalidades_inpi (codigo, nome, base_legal, prazo_vigencia, escopo_protecao, requisitos_legais, aplicacao_iot_hardware) VALUES
('LDA', 'Camada A — Direito Autoral sobre Documentação Técnica', 'Lei nº 9.610/1998 (LDA) e Convenção de Berna (Dec. 75.699/75)', '70 anos após 1º de janeiro do ano subsequente ao falecimento do autor', 'Protege a expressão gráfica de esquemáticos, leiautes de PCB, manuais e desenhos técnicos (não tutela a função elétrica em si).', 'Originalidade estética/literária da representação gráfica; independe de registro formal.', 'Esquemáticos elétricos, desenhos de máscara de PCB (KiCad/Altium) e manuais técnicos.'),
('DI', 'Camada B — Registro de Desenho Industrial', 'Lei nº 9.279/1996 (LPI) - Art. 94 a 121', '10 anos + 3 prorrogações de 5 anos (máx. 25 anos)', 'Forma plástica ornamental de um objeto ou conjunto ornamental de linhas e cores ("a cara do aparelho").', 'Novidade visual, Originalidade estética e capacidade de servir de tipo de fabricação industrial.', 'Design externo do gabinete (case), formato estético de wearables, consoles ou totens.'),
('TCI', 'Camada C — Topografia de Circuito Integrado', 'Lei nº 11.484/2007 - Art. 26 a 55 (Institui também o PADIS)', '10 anos (a partir do depósito ou 1ª exploração)', 'Configuração tridimensional das camadas que compõem um circuito integrado (microchip/silício).', 'Originalidade (resultar de esforço intelectual do criador). Prazo máximo de 2 anos após 1ª exploração comercial.', 'Projetos de microchips próprios (ASICs), SoCs e layouts físicos de máscaras de silício (GDSII/OASIS).'),
('MARCA', 'Camada D — Registro de Marca e Signo Distintivo', 'Lei nº 9.279/1996 (LPI) - Arts. 129, 133 e 189', '10 anos, renovável indefinidamente por períodos iguais e sucessivos', 'Propriedade e uso exclusivo do nome comercial, marca nominativa/mista e logotipo em todo o território nacional (Sistema Atributivo).', 'Distintividade, novidade relativa na classe (NCL) e liceidade. Principal ativo patrimonial no Hardware Aberto (Caso Arduino LLC vs. SRL).', 'Nome comercial da placa, logotipo serigrafado na PCB e identidade da plataforma.'),
('RPC', 'Camada E — Direito Autoral de Software Embarcado', 'Lei nº 9.609/1998 (Art. 2º e Art. 4º) e Lei nº 9.610/1998', '50 anos a partir de 1º de janeiro do ano subsequente à publicação/criação', 'Proteção da expressão literal do código-fonte ou código-objeto ("o cérebro" do hardware). Registro no INPI é facultativo para fins probatórios.', 'Originalidade do código-fonte (depósito de resumo digital Hash SHA-512 no sistema e-Software do INPI).', 'Firmware embarcado (C/C++, Rust, MicroPython), HDL sintetizável e bootloaders.'),
('PI', 'Camada F — Patente de Invenção', 'Lei nº 9.279/1996 (LPI) - Art. 8º, 40 e ressalva do Art. 10, V', '20 anos a partir do depósito', 'Solução técnica inédita para um problema técnico específico ou processo assistido por software com efeito técnico físico.', 'Novidade absoluta mundial (respeitado o Período de Graça de 12 meses do Art. 12), Atividade Inventiva e Aplicação Industrial.', 'Circuitos eletrônicos inéditos, sensores ópticos (ex: LiDAR) e sistemas embarcados com efeito físico novo.'),
('MU', 'Camada F — Patente de Modelo de Utilidade', 'Lei nº 9.279/1996 (LPI) - Art. 9º e 40', '15 anos a partir do depósito', 'Objeto de uso prático que apresente nova forma ou disposição envolvendo ato inventivo e melhoria funcional.', 'Novidade, Ato Inventivo, Melhoria Funcional no uso ou na fabricação e Aplicação Industrial.', 'Arranjos físicos de placas (PCBs), disposição modular de sondas/sensores e gabinetes ergonômicos funcionais.');

INSERT OR IGNORE INTO licencas_catalogo (codigo, nome, camada_alvo, tipo_permissividade, efeito_viral, permite_uso_comercial, exige_abertura_derivados, compatibilidade_patente, descricao_juridica) VALUES
('MIT', 'MIT License / BSD / Apache 2.0', 'SOFTWARE', 'PERMISSIVA', 0, 1, 0, 'Alta (Apache 2.0 inclui concessão expressa de patentes)', 'Permite uso comercial, modificação, distribuição e fechamento de código derivado, exigindo apenas a manutenção dos avisos de copyright.'),
('LGPLv3', 'GNU Lesser General Public License v2.1 / v3.0', 'SOFTWARE', 'COPYLEFT_FRACO', 1, 1, 1, 'Concessão de patente sobre a biblioteca; atenção à linkedição estática em firmware', 'Permite uso em software proprietário desde que o usuário possa relinkar/substituir a biblioteca LGPL. Em sistemas embarcados com firmware estático (monolítico), exige fornecer arquivos-objeto (.o) para relinkagem.'),
('GPLv3', 'GNU General Public License v2.0 / v3.0', 'SOFTWARE', 'COPYLEFT_FORTE', 1, 1, 1, 'Incompatível com fechamento de código; proíbe "Tivoização" (bloqueio de instalação no hardware)', 'Qualquer firmware derivado ou vinculado a código GPLv3 deve ter seu código-fonte completo disponibilizado sob GPLv3, incluindo instruções de gravação no dispositivo físico.'),
('CERN-OHL-P', 'CERN Open Hardware Licence v2 - Permissive / Solderpad / TAPR', 'HARDWARE', 'PERMISSIVA', 0, 1, 0, 'Compatível com modelos comerciais fechados e derivados proprietários', 'Equivalente ao MIT/Apache para Hardware (junto à Solderpad). Permite fabricar, modificar e vender placas/esquemáticos sem obrigação de abrir modificações.'),
('CERN-OHL-W', 'CERN Open Hardware Licence v2 - Weakly Reciprocal', 'HARDWARE', 'COPYLEFT_FRACO', 1, 1, 1, 'Exige abertura de modificações no bloco aberto, mas permite acoplar módulos proprietários', 'Equivalente à LGPL para Hardware. Se modificar o esquemático licenciado sob CERN-OHL-W, deve publicar os arquivos modificados, mas pode manter módulos independentes e firmware fechados.'),
('CERN-OHL-S', 'CERN Open Hardware Licence v2 - Strongly Reciprocal / CC BY-SA 4.0', 'HARDWARE', 'COPYLEFT_FORTE', 1, 1, 1, 'Incompatível com fechamento do desenho derivado; atenção à fragilidade do copyleft na Camada A', 'Qualquer produto derivado do desenho deve disponibilizar as fontes de hardware (CAD, esquemáticos, Gerber, BOM). Na CC BY-SA 4.0 não há cláusula específica de patentes para a função elétrica.'),
('PROPRIETARIA', 'Licença Proprietária / Segredo Industrial / EULA', 'AMBOS', 'FECHADA', 0, 1, 0, 'Totalmente compatível com depósito de Patentes (PI/MU), TCI e Registro de Marca no INPI', 'Reserva todos os direitos patrimoniais ao titular, combinando proteção industrial no INPI e cláusulas de confidencialidade.');

-- 6. Base Fixa de Titularidade do Observatório + Acervo de REFERÊNCIA ILUSTRATIVO
--    (os 15 itens REF-ILUSTR-xx são exemplos didáticos de produtos conhecidos; NÃO são registros oficiais do INPI)
CREATE TABLE IF NOT EXISTS registros_titularidade (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    protocolo_registro VARCHAR(50) NOT NULL UNIQUE,
    origem_base VARCHAR(40) NOT NULL DEFAULT 'REGISTRO_FIXO_USUARIO', -- ACERVO_REFERENCIA_ILUSTRATIVO, REGISTRO_FIXO_USUARIO
    nome_criacao_marca VARCHAR(180) NOT NULL,
    titular_nome VARCHAR(160) NOT NULL,
    titular_documento VARCHAR(40) NOT NULL,
    instituicao_empresa VARCHAR(160),
    resumo_tecnico TEXT NOT NULL,
    palavras_chave TEXT NOT NULL,
    classificacao_cip VARCHAR(140) NOT NULL,
    modalidade_protecao VARCHAR(120) NOT NULL,
    camadas_protegidas VARCHAR(160) NOT NULL,
    status_juridico VARCHAR(60) NOT NULL DEFAULT 'PROTEGIDO_EXCLUSIVO', -- PROTEGIDO_EXCLUSIVO, OPEN_HARDWARE_MARCA_PROTEGIDA, DOMINIO_PUBLICO_ESTADO_DA_TECNICA
    hash_sha512 VARCHAR(130) NOT NULL,
    data_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    usuario_id INTEGER NULL,  -- titular (vazio nos itens do acervo ilustrativo)
    projeto_id INTEGER NULL,  -- projeto avaliado que originou a prova de autoria
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (projeto_id) REFERENCES projetos_avaliados(id)
);

-- Remove as linhas antigas do acervo (versões anteriores usavam protocolos fictícios no formato INPI-...)
DELETE FROM registros_titularidade WHERE origem_base = 'ACERVO_INPI_MUNDIAL';

INSERT OR IGNORE INTO registros_titularidade (
    protocolo_registro, origem_base, nome_criacao_marca, titular_nome, titular_documento,
    instituicao_empresa, resumo_tecnico, palavras_chave, classificacao_cip,
    modalidade_protecao, camadas_protegidas, status_juridico, hash_sha512, data_registro
) VALUES
(
    'REF-ILUSTR-01',
    'ACERVO_REFERENCIA_ILUSTRATIVO',
    'Arduino Uno / Plataforma Arduino Oficial',
    'Arduino AG / Arduino LLC',
    'N/D (referência ilustrativa)',
    'Arduino SA (Suíça / Itália / EUA)',
    'Placa microcontroladora baseada em ATmega328P com esquemáticos abertos sob CC BY-SA 4.0, bootloader LGPL e marca nominativa e figurativa registrada exclusivamente.',
    'arduino uno atmega328p placa prototipagem genuino cc by-sa 4.0 bootloader ide',
    'G06F 15/78 ; H05K 1/02',
    'Marca Registrada Exclusiva (Art. 129 LPI) + Hardware Aberto CC BY-SA',
    'Camada D (Marca Exclusiva) • Camadas A e E Abertas',
    'OPEN_HARDWARE_MARCA_PROTEGIDA',
    '1a5b74b2dc903d9d04c1c951ef46c4ae96492829ab9296d5d6972162fe26ce13a18445a90254b275db4fcd9ff56fe3dbb8d053dff9d3a341dbe709c4efa8791f',
    NULL
),
(
    'REF-ILUSTR-02',
    'ACERVO_REFERENCIA_ILUSTRATIVO',
    'Waymo LiDAR Sensor de Varredura Óptica Autônoma (GBR3)',
    'Waymo LLC / Alphabet Inc.',
    'N/D (referência ilustrativa)',
    'Waymo LLC (Mountain View, CA)',
    'Sistema transdutor LiDAR de varredura a laser com placa PCB única de disparo de feixes ópticos e processamento de tempo de voo (ToF) para veículos autônomos.',
    'waymo lidar sensor laser varredura optica veiculo autonomo pcb disparo feixe tof',
    'G01S 17/08 ; G01S 7/481',
    'Patente de Invenção Vigente (Art. 8º LPI) + Segredo Industrial',
    'Camada F (Patente PI) + Camada A/E (Segredo Industrial Art. 195 XI)',
    'PROTEGIDO_EXCLUSIVO',
    'bba3926d04b25bbed1efc507e7bf0aedb087a694e58887b9bb5b60d89946efa374b79329b0feedd789c9a065d3a7787cc01621bc1ba5e7274e33692af8d32b50',
    NULL
),
(
    'REF-ILUSTR-03',
    'ACERVO_REFERENCIA_ILUSTRATIVO',
    'Microarquitetura x86 Core & Topografia de Silício Multi-Cache',
    'Intel Corporation',
    'N/D (referência ilustrativa)',
    'Intel Corporation (Santa Clara, CA)',
    'Configuração tridimensional de 19 camadas de máscara litográfica CMOS em silício (arquivos GDSII) e microcódigo de controle de barramento.',
    'intel amd processador x86 topografia circuito integrado silicio mascara gdsii cache cmos',
    'H01L 27/02 ; G06F 15/78',
    'Topografia de Circuito Integrado (Lei 11.484/07) + Direito Autoral de Microcódigo',
    'Camada C (Topografia Lei 11.484/07) + Camada E (Microcódigo)',
    'PROTEGIDO_EXCLUSIVO',
    '8476b89345796d3ec42e7c62491e2d9ecff96cfd3fe3e91ce51e0f5fce43a757de029b07217b8e6a075c0a37c5e1e4850046c82a6c66bb40b97ca45a3d2849b9',
    NULL
),
(
    'REF-ILUSTR-04',
    'ACERVO_REFERENCIA_ILUSTRATIVO',
    'Marca G Gradiente iphone / Apple iPhone (Classe NCL 9)',
    'IGB Eletrônica S.A. (Gradiente) / Apple Inc.',
    'N/D (referência ilustrativa)',
    'IGB Eletrônica S.A. / Apple Inc.',
    'Signo distintivo nominativo e misto para aparelhos telefônicos e dispositivos móveis inteligentes na Classe NCL 9 perante o INPI (caso de coexistência discutido judicialmente no Brasil).',
    'iphone gradiente apple smartphone telefone celular marca ncl 9 coexistencia inpi',
    'H04M 1/02',
    'Registro de Marca Nominativa/Mista (Art. 124, XIX e Art. 129 da LPI)',
    'Camada D (Signo Distintivo Registrado no INPI)',
    'PROTEGIDO_EXCLUSIVO',
    'c6124dddbb674f7270786f145978e214039005850b78f3ad494bb0131a8cc671393e8e213b681552344ae4e70bd7727bc3c96a88760b5b91ad3a616eb088f777',
    NULL
),
(
    'REF-ILUSTR-05',
    'ACERVO_REFERENCIA_ILUSTRATIVO',
    'Módulo SoC ESP32-WROOM Wi-Fi & Bluetooth Low Energy Dual-Core',
    'Espressif Systems (Shanghai) Co., Ltd.',
    'N/D (referência ilustrativa)',
    'Espressif Systems',
    'Módulo transceptor integrado com microprocessador Xtensa Dual-Core 32-bit LX6, pilha RF Wi-Fi 802.11 b/g/n e Bluetooth BLE 4.2/5.0 pré-homologado na ANATEL.',
    'esp32 esp8266 wroom espressif modulo wifi bluetooth ble xtensa microcontrolador padrao',
    'H04W 4/80 ; H01L 23/66',
    'Componente Comercial Protegido (Vedada apropriação do módulo em si por terceiros — Art. 8º LPI)',
    'Camadas C, D e F pertencentes ao fabricante do SoC (Terceiros podem proteger apenas novas aplicações físicas acopladas)',
    'PROTEGIDO_EXCLUSIVO',
    '23cfc4fae1796ce0b1029a9b413fed62abed22a0b2e8d92408ce8986f56737bdcf6a427989c1567e4edaa1db46c1adc9f16afcdb09f4f384fb199c1239f8441f',
    NULL
),
(
    'REF-ILUSTR-06',
    'ACERVO_REFERENCIA_ILUSTRATIVO',
    'Raspberry Pi / Computador de Placa Única ARM (SBC)',
    'Raspberry Pi Ltd / Raspberry Pi Foundation',
    'N/D (referência ilustrativa)',
    'Raspberry Pi Ltd (Cambridge, Reino Unido)',
    'Computador de placa única (Single Board Computer) com processador Broadcom ARM, barramento GPIO de 40 pinos, HDMI e conectividade sem fio sob marca registrada exclusiva.',
    'raspberry pi rp2040 pico sbc broadcom arm placa unica minicomputador gpio',
    'G06F 1/16 ; G06F 15/78',
    'Marca Registrada Exclusiva (Art. 129 LPI) + Hardware Proprietário/Misto',
    'Camadas A, C, D e E protegidas pela Raspberry Pi Foundation',
    'PROTEGIDO_EXCLUSIVO',
    'e403bee985d5eb198b366a9934a0e5dc9bb2c13324f28f36789c7de45a425b9ab4f94f0e94399ba9ac0c7ee0927f5355a25c79b17ad26e633b6902c272f58d1b',
    NULL
),
(
    'REF-ILUSTR-07',
    'ACERVO_REFERENCIA_ILUSTRATIVO',
    'Flipper Zero — Dispositivo Portátil Multitool Sub-GHz, RFID, NFC e Infravermelho',
    'Flipper Devices Inc.',
    'N/D (referência ilustrativa)',
    'Flipper Devices Inc. (Delaware, EUA)',
    'Aparelho eletrônico portátil baseado em STM32WB55 para inspeção de protocolos de rádio Sub-1GHz (CC1101), RFID 125kHz, NFC, Infravermelho e GPIO.',
    'flipper zero subghz rfid nfc infravermelho cc1101 stm32wb55 multitool radiofrequencia',
    'H04B 1/38 ; G06K 7/10',
    'Marca Registrada Exclusiva (Art. 129 LPI) + Desenho Industrial (Art. 94 LPI)',
    'Camada B (Gabinete) e Camada D (Marca Exclusiva)',
    'PROTEGIDO_EXCLUSIVO',
    'c5d1805cd009af602c3d4c54289f2ab4880f18bc7fc69879515d0850d6b9ccfcf8296abfca357f04c9403d187bc30cab1357631fa0017a847d2253a882811f62',
    NULL
),
(
    'REF-ILUSTR-08',
    'ACERVO_REFERENCIA_ILUSTRATIVO',
    'Amazon Echo / Alexa — Assistente de Voz Inteligente com Matriz de Microfones',
    'Amazon Technologies, Inc.',
    'N/D (referência ilustrativa)',
    'Amazon.com, Inc. (Seattle, WA)',
    'Caixa de som e hub de automação residencial controlado por voz com matriz circular de microfones (beamforming), detecção de palavra de ativação (wake word) e integração em nuvem.',
    'alexa amazon echo assistente voz caixa som inteligente smart speaker automacao residencial microfone',
    'G10L 15/22 ; H04R 1/40',
    'Patente de Invenção + Marca de Alto Renome (Art. 125 e Art. 129 LPI)',
    'Camadas B, D, E e F pertencentes à Amazon Technologies',
    'PROTEGIDO_EXCLUSIVO',
    '416d28f8a7eb20e489f874949ce7bf75309ae1039c0a21c7fd5c690ea012a4a92f1942a5274b6fcc06643e5f5f65a9722126903da7a95aabdbeaefd9260e5771',
    NULL
),
(
    'REF-ILUSTR-09',
    'ACERVO_REFERENCIA_ILUSTRATIVO',
    'Apple AirTag / Samsung SmartTag — Rastreador Bluetooth e Ultra-Wideband (UWB)',
    'Apple Inc. / Samsung Electronics Co., Ltd.',
    'N/D (referência ilustrativa)',
    'Apple Inc. (Cupertino, CA)',
    'Dispositivo localizador e chaveiro rastreador de objetos via rede mesh Bluetooth Low Energy (BLE) e chip Ultra-Wideband (UWB) para localização espacial de precisão.',
    'airtag smarttag apple samsung rastreador rastreadora rastreamento tag tags radiofrequencia uwb bluetooth chaveiro localizador tracker objetos perdidos',
    'G01S 5/02 ; H04W 4/029',
    'Patente de Invenção + Desenho Industrial + Marca (exemplo ilustrativo)',
    'Camadas B, C, D, E e F protegidas mundialmente',
    'PROTEGIDO_EXCLUSIVO',
    '6c8fdddb1d1a7f99415c23cf3ee4ce3a1d8b4a0660836b60bfdd2f60d530346c99c2b529f58be6440f89d083bf621b319fe567d45f221710db07b8740598e7d9',
    NULL
),
(
    'REF-ILUSTR-10',
    'ACERVO_REFERENCIA_ILUSTRATIVO',
    'Smart Collar Pet Tracker / Whistle GPS / Fi Collar — Coleira Inteligente de Monitoramento Pet',
    'Whistle Labs Inc. / Fi Smart Dog Collar / Mars Petcare',
    'N/D (referência ilustrativa)',
    'Whistle Labs / Fi Collar (San Francisco, CA)',
    'Dispositivo eletrônico acoplado a coleira para animais domésticos (cães e gatos) com receptor GPS/GNSS, conectividade celular LTE-M e Bluetooth BLE para rastreamento de localização e sinais vitais em tempo real.',
    'smart collar pet tracker coleira inteligente pet pets cachorro gato animal animais gps rastreador rastreadora rastreamento coleira localizador bluetooth coleiras geofencing',
    'A01K 11/00 ; G01S 19/14 ; H04W 4/029',
    'Patente de Invenção / Modelo de Utilidade (exemplo ilustrativo)',
    'Camadas A, D, E e F pertencentes aos titulares de patentes de coleiras inteligentes',
    'PROTEGIDO_EXCLUSIVO',
    'a5773cc8b4e3af686f28fae2b6b69f17ee5c90e1a7753867105e64c2861bbce2454c48af9b5eb54bad5e837f701d47d6be596b755f26211d71c1a75e040450bd',
    NULL
),
(
    'REF-ILUSTR-11',
    'ACERVO_REFERENCIA_ILUSTRATIVO',
    'Fechadura Eletrônica Inteligente com Biometria e Wi-Fi (Yale / Samsung Smart Lock)',
    'Assa Abloy Inc. / Samsung SDS Co., Ltd.',
    'N/D (referência ilustrativa)',
    'Assa Abloy / Yale / Samsung SDS',
    'Fechadura eletromecânica embutida com sensor leitor biométrico capacitivo de impressão digital, teclado touch, transceptor Wi-Fi/Bluetooth e atuador solenoide motorizado.',
    'fechadura inteligente fechadura digital biometria biometrica biometrico leitor digital trava eletrica wifi bluetooth app smart lock yale samsung',
    'E05B 47/00 ; G07C 9/00',
    'Patente de Invenção (exemplo ilustrativo)',
    'Camadas A, B, D e F protegidas',
    'PROTEGIDO_EXCLUSIVO',
    'e5a21b89e8d286b4d63f6621df9d122e6da18bf67685440aec551f8fbd5846ae84e29f59c1c1bf568529957ca03d4c5dd563c1246deca7b030e71fa84f8dd8fe',
    NULL
),
(
    'REF-ILUSTR-12',
    'ACERVO_REFERENCIA_ILUSTRATIVO',
    'Oxímetro de Pulso Portátil IoT com Fotopletismografia (SpO2 / Masimo / Nellcor)',
    'Masimo Corporation / Medtronic Nellcor',
    'N/D (referência ilustrativa)',
    'Masimo Corporation (Irvine, CA)',
    'Dispositivo e sensor óptico de fotopletismografia (PPG) com LEDs vermelho (660nm) e infravermelho (940nm) para cálculo de saturação periférica de oxigênio (SpO2) e frequência cardíaca.',
    'oximetro oximetria pulso spo2 fotopletismografia oxigenio sangue frequencia cardiaca sensor max30100 max30102 iot saude pulse oximeter masimo',
    'A61B 5/1455 ; A61B 5/024',
    'Patente de Invenção (expirada) e Regulação Sanitária ANVISA',
    'Camadas A, C, E e F de domínio do estado da técnica hospitalar',
    'DOMINIO_PUBLICO_ESTADO_DA_TECNICA',
    '071818be1d8a97090af09e1d8cb0c38c1eef195b3a2b5dddf785e2f8520037364e7ec51b734cd9f93d744e7cbb0017ff61c0e6f017df98601b27b9e0961e9b6b',
    NULL
),
(
    'REF-ILUSTR-13',
    'ACERVO_REFERENCIA_ILUSTRATIVO',
    'Drone Quadricóptero com Estabilização Giroscópica e Câmera Gimbal (DJI Phantom / Mavic)',
    'SZ DJI Technology Co., Ltd.',
    'N/D (referência ilustrativa)',
    'DJI Technology (Shenzhen, China)',
    'Aeronave não tripulada (VANT/Drone) de quatro rotores acionados por motores brushless, sensores inerciais IMU, giroscópio de 6 eixos e gimbal estabilizador motorizado de câmera.',
    'drone quadricoptero vant uav giroscopio gimbal estabilizacao camera voo autonomo controle remoto dji telemetria imu phantom',
    'B64C 39/02 ; B64D 47/08 ; G05D 1/00',
    'Patente de Invenção + Desenho Industrial (exemplo ilustrativo)',
    'Camadas A, B, D, E e F protegidas mundialmente pela DJI',
    'PROTEGIDO_EXCLUSIVO',
    '70c22af2e3679f65af7dd6e07565ae44c147dbc1b4b52c2d0fddbea7ae8c5379e50a12133232cc6bf4fcb331111c68cbc8933a2d402adbe795920776d35b6dc0',
    NULL
),
(
    'REF-ILUSTR-14',
    'ACERVO_REFERENCIA_ILUSTRATIVO',
    'Smartwatch com Eletrocardiograma (ECG) e PPG (Apple Watch / Galaxy Watch)',
    'Apple Inc. / Samsung Electronics',
    'N/D (referência ilustrativa)',
    'Apple Inc. / Samsung Electronics',
    'Dispositivo vestível inteligente em formato de relógio de pulso com eletrodos de contato dérmico para geração de derivação I de eletrocardiograma (ECG) e fotopletismografia contínua.',
    'smartwatch relogio inteligente ecg eletrocardiograma batimentos cardiacos monitor cardiaco ppg sensor vestivel wearable apple watch',
    'A61B 5/0402 ; G04G 21/00',
    'Patente de Invenção + Desenho Industrial (exemplo ilustrativo)',
    'Camadas A, B, C, D, E e F pertencentes aos fabricantes líderes de wearables',
    'PROTEGIDO_EXCLUSIVO',
    '1041b633714e632e178fbfeeb9756d458a12f3567fb9a4890343addaa5d8a6ca09913548371e77fe301fb6d7b62b05c1dc9c2748bf99614511b5f1e3dba88e2d',
    NULL
),
(
    'REF-ILUSTR-15',
    'ACERVO_REFERENCIA_ILUSTRATIVO',
    'Starlink — Antena Phased Array de Satélite LEO (SpaceX)',
    'Space Exploration Technologies Corp. (SpaceX)',
    'N/D (referência ilustrativa)',
    'SpaceX (Hawthorne, CA)',
    'Terminal transceptor de internet via satélite de baixa órbita (LEO) com antena plana de arranjo faseado (phased array) eletrônico e orientação motorizada automática.',
    'starlink spacex antena satelite internet phased array orbita baixa',
    'H01Q 21/06 ; H04B 7/185',
    'Patente de Invenção + Topografia de Chip + Marca (LPI / Lei 11.484/07)',
    'Camadas A, B, C, D, E e F protegidas',
    'PROTEGIDO_EXCLUSIVO',
    'dbbd5b8405707a4336d00fced2671422005ddf016932f0ffc9bcf8e1d1815e50914f015e70aa8aa10a47289704b7b14efe35f62fd3fe21cf8465e5a82d021900',
    NULL
);


