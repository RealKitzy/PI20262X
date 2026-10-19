-- ============================================================================
-- OBSERVATÓRIO DE PROPRIEDADE INTELECTUAL E HARDWARE ABERTO (BRASIL)
-- Modelo Físico de Dados (SQL Compatível com MySQL/MariaDB e SQLite)
-- Legislação Base: Lei 9.279/96 (LPI), Lei 9.609/98 (Software), Lei 11.484/07 (TCI)
-- ============================================================================

-- 1. Tabela de Projetistas / Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_completo VARCHAR(150) NOT NULL,
    documento_cpf_cnpj VARCHAR(25) NOT NULL,
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

-- 4. Regras do Motor de Decisão (Mapeamento Arquitetura -> Diagnóstico)
CREATE TABLE IF NOT EXISTS regras_classificacao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo_regra VARCHAR(40) NOT NULL UNIQUE,
    camada_avaliada VARCHAR(40) NOT NULL, -- CIRCUITO_PCB, CHIP_SEMICONDUTOR, FIRMWARE_SW, GABINETE_MECANICO, LICENCIAMENTO
    condicao_logica TEXT NOT NULL,
    modalidade_inpi_codigo VARCHAR(20),
    licenca_recomendada_codigo VARCHAR(30),
    nivel_alerta VARCHAR(20) DEFAULT 'INFO', -- INFO, SUCESSO, ATENCAO, CRITICO
    titulo_diagnostico VARCHAR(180) NOT NULL,
    parecer_tecnico_juridico TEXT NOT NULL,
    FOREIGN KEY (modalidade_inpi_codigo) REFERENCES modalidades_inpi(codigo),
    FOREIGN KEY (licenca_recomendada_codigo) REFERENCES licencas_catalogo(codigo)
);

-- 5. Projetos de Hardware/IoT Submetidos à Plataforma
CREATE TABLE IF NOT EXISTS projetos_avaliados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
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

-- 6. Diagnósticos Gerados pelo Motor de Decisão
CREATE TABLE IF NOT EXISTS diagnosticos_gerados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projeto_id INTEGER NOT NULL,
    score_protegibilidade INTEGER NOT NULL, -- 0 a 100
    risco_contaminacao_licenca VARCHAR(30) NOT NULL, -- NULO, BAIXO, MEDIO, ALTO_CRITICO
    protecao_inpi_primaria VARCHAR(80) NOT NULL,
    protecao_inpi_secundaria VARCHAR(120),
    licenca_hw_recomendada VARCHAR(50) NOT NULL,
    licenca_sw_recomendada VARCHAR(50) NOT NULL,
    json_parecer_completo TEXT NOT NULL, -- Armazena o detalhamento das regras acionadas
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (projeto_id) REFERENCES projetos_avaliados(id)
);

-- 7. Minutas e Contratos Customizados Gerados
CREATE TABLE IF NOT EXISTS minutas_geradas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    diagnostico_id INTEGER NOT NULL,
    tipo_documento VARCHAR(60) NOT NULL, -- CESSAO_DIREITOS, LICENCIAMENTO_COMERCIAL_IOT, TERMO_OPEN_HARDWARE_CERN, MEMORIAL_INPI
    partes_qualificacao TEXT NOT NULL,
    conteudo_minuta TEXT NOT NULL,
    hash_verificacao VARCHAR(64) NOT NULL,
    gerado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (diagnostico_id) REFERENCES diagnosticos_gerados(id)
);

-- ============================================================================
-- CARGA INICIAL DE DADOS (SEED): MODALIDADES DO INPI E LICENÇAS LIVRES
-- ============================================================================

INSERT OR IGNORE INTO modalidades_inpi (codigo, nome, base_legal, prazo_vigencia, escopo_protecao, requisitos_legais, aplicacao_iot_hardware) VALUES
('LDA', 'Camada A — Direito Autoral sobre Documentação Técnica', 'Lei nº 9.610/1998 (LDA) e Convenção de Berna (Dec. 75.699/75)', '70 anos após 1º de janeiro do ano subsequente ao falecimento do autor', 'Protege a expressão gráfica de esquemáticos, leiautes de PCB, manuais e desenhos técnicos (não tutela a função elétrica em si).', 'Originalidade estética/literária da representação gráfica; independe de registro formal.', 'Esquemáticos elétricos, desenhos de máscara de PCB (KiCad/Altium) e manuais técnicos.'),
('DI', 'Camada B — Registro de Desenho Industrial', 'Lei nº 9.279/1996 (LPI) - Art. 94 a 121', '10 anos + 3 prorrogações de 5 anos (máx. 25 anos)', 'Forma plástica ornamental de um objeto ou conjunto ornamental de linhas e cores ("a cara do aparelho").', 'Novidade visual, Originalidade estética e capacidade de servir de tipo de fabricação industrial.', 'Design externo do gabinete (case), formato estético de wearables, consoles ou totens.'),
('TCI', 'Camada C — Topografia de Circuito Integrado', 'Lei nº 11.484/2007 - Art. 26 a 55 (Institui também o PADIS)', '10 anos (a partir do depósito ou 1ª exploração)', 'Configuração tridimensional das camadas que compõem um circuito integrado (microchip/silício).', 'Originalidade (resultar de esforço intelectual do criador). Prazo máximo de 2 anos após 1ª exploração comercial.', 'Projetos de microchips próprios (ASICs), SoCs e layouts físicos de máscaras de silício (GDSII/OASIS).'),
('MARCA', 'Camada D — Registro de Marca e Signo Distintivo', 'Lei nº 9.279/1996 (LPI) - Art. 129 e Art. 189', '10 anos, renovável indefinidamente por períodos iguais e sucessivos', 'Propriedade e uso exclusivo do nome comercial, marca nominativa/mista e logotipo em todo o território nacional (Sistema Atributivo).', 'Distintividade, novidade relativa na classe (NCL) e liceidade. Principal ativo patrimonial no Hardware Aberto (Caso Arduino LLC vs. SRL).', 'Nome comercial da placa, logotipo serigrafado na PCB e identidade da plataforma.'),
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

