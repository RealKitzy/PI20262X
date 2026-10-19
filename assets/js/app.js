/**
 * OBSERVATÓRIO DE PROPRIEDADE INTELECTUAL E HARDWARE ABERTO (BRASIL)
 * Projeto Integrador: Informática e Legislação
 * Equipe: Antonio Kayky Gonçalves Vieira, Giullian Bernard Alencar Maia,
 *         Ítalo Brito da Costa, Luís Aquiles Lucena Sá
 */

let ultimoProjetoAvaliado = null;
let ultimoDiagnostico = null;

// Atualiza o quadro de Orientação Técnica no topo da página
function atualizarBalaoMascote(tag, titulo, falaHtml) {
    const elTag = document.getElementById('mascote-tag');
    const elTitulo = document.getElementById('mascote-titulo');
    const elFala = document.getElementById('mascote-fala');
    if (elTag) elTag.textContent = tag;
    if (elTitulo) elTitulo.textContent = titulo;
    if (elFala) elFala.innerHTML = falaHtml;
}

// Inspetor Automático de Código-Fonte / Cabeçalho SPDX / Lista BOM
function inspecionarTrechoCodigo() {
    const campo = document.getElementById('trecho_codigo_inspecao');
    const aviso = document.getElementById('resultado-inspecao-codigo');
    if (!campo || !aviso) return;

    const texto = campo.value.toUpperCase();
    if (!texto.trim()) {
        aviso.textContent = 'O motor analisa automaticamente menções a SPDX, GPL, LGPL, MIT, CERN-OHL, CC BY-SA, TAPR e Solderpad no texto colado.';
        aviso.style.color = '';
        return;
    }

    const detectados = [];

    if (texto.includes('GPL-3') || texto.includes('GPLV3') || texto.includes('GPL-2') || texto.includes('GNU GENERAL PUBLIC')) {
        document.getElementById('licenca_bibliotecas_terceiros').value = 'GPL_V2_V3';
        detectados.push('GNU GPL (Copyleft Forte no Firmware)');
    } else if (texto.includes('LGPL') || texto.includes('LESSER GENERAL PUBLIC')) {
        document.getElementById('licenca_bibliotecas_terceiros').value = 'LGPL_ESTATICA';
        detectados.push('GNU LGPL (Copyleft Fraco)');
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
        aviso.textContent = 'Trecho analisado: nenhum identificador restritivo (GPL/CERN-OHL-S) detectado até o momento.';
        aviso.style.color = '#10b981';
    }
}

// Tabela de Referência de Custos Oficiais (GRU INPI) e Vigências das 6 Camadas
const TABELA_CUSTOS_INPI = {
    PI: {
        sistema: 'e-Patentes (INPI) — Camada F',
        taxa_desconto: 'R$ 70,00 (Depósito) + R$ 236,00 (Exame)',
        taxa_cheia: 'R$ 175,00 (Depósito) + R$ 590,00 (Exame)',
        prazo_medio: 'Vigência de 20 anos (Art. 40 da Lei 9.279/96)'
    },
    MU: {
        sistema: 'e-Patentes (INPI) — Camada F',
        taxa_desconto: 'R$ 70,00 (Depósito) + R$ 152,00 (Exame)',
        taxa_cheia: 'R$ 175,00 (Depósito) + R$ 380,00 (Exame)',
        prazo_medio: 'Vigência de 15 anos (Art. 40 da Lei 9.279/96)'
    },
    TCI: {
        sistema: 'e-Chip / Topografia (INPI) — Camada C',
        taxa_desconto: 'R$ 166,00 (Pedido de Registro Único)',
        taxa_cheia: 'R$ 415,00 (Pedido de Registro Único)',
        prazo_medio: 'Vigência de 10 anos a contar do depósito ou 1ª exploração (Lei 11.484/07)'
    },
    MARCA: {
        sistema: 'e-Marcas (INPI) — Camada D',
        taxa_desconto: 'R$ 142,00 (Pedido com especificação pré-aprovada)',
        taxa_cheia: 'R$ 355,00 (Pedido com especificação pré-aprovada)',
        prazo_medio: 'Vigência de 10 anos, renovável indefinidamente (Art. 129 e 133 da LPI)'
    },
    RPC: {
        sistema: 'e-Software (INPI — Hash SHA-512) — Camada E',
        taxa_desconto: 'R$ 185,00 (Taxa Única — Registro Facultativo)',
        taxa_cheia: 'R$ 185,00 (Taxa Única — Registro Facultativo)',
        prazo_medio: 'Vigência de 50 anos a partir de 1º/jan do ano seguinte (Lei 9.609/98)'
    },
    DI: {
        sistema: 'e-Desenho Industrial (INPI) — Camada B',
        taxa_desconto: 'R$ 94,00 (Depósito Inicial)',
        taxa_cheia: 'R$ 235,00 (Depósito Inicial)',
        prazo_medio: 'Vigência de 10 anos, renovável até 25 anos (Art. 108 da LPI)'
    }
};

// Os 8 Cenários (4 Casos Reais da Entrega 1 + 4 Cenários Práticos de Projetos Cotidianos)
const CENARIOS_TESTE = {
    cenario1_arduino: {
        nome_projeto: 'Plataforma Aberta de Prototipagem Eletrônica (Estudo de Caso Arduino LLC vs. Arduino SRL / Genuino)',
        autor_nome: 'Ítalo Brito, Luís Aquiles, Giullian Bernard e Antonio Kayky',
        autor_documento: '12.345.678/0001-90',
        autor_email: 'observatorio.pi@projetointegrador.edu.br',
        instituicao_empresa: 'Consórcio Open Hardware Brasil (Padrão OSHWA)',
        resumo_tecnico: 'Placa controladora aberta com esquemáticos e leiaute de PCB disponibilizados sob licença Creative Commons CC BY-SA 4.0 / CERN-OHL, bootloader e IDE sob GPL/LGPL, mantendo o signo distintivo (Marca e Logotipo) como ativo exclusivo de controle patrimonial.',
        grau_novidade_hardware: 'MODULOS_PRONTOS_COTS',
        divulgacao_previa: 'DIVULGADO_MAIS_12M',
        possui_pcb_customizada: true,
        possui_topografia_chip: false,
        possui_design_externo_novo: false,
        usa_hardware_aberto_terceiros: 'CERN_OHL_S',
        possui_firmware_proprio: true,
        linguagem_firmware: 'C/C++ (AVR / ARM Core e Bootloader)',
        licenca_bibliotecas_terceiros: 'LGPL_ESTATICA',
        vinculacao_firmware: 'ESTATICA_MONOLITICA',
        modelo_negocio: 'OPEN_SOURCE_TOTAL',
        titularidade_tipo: 'PARCERIA_COAUTORIA',
        trecho_codigo: '/* SPDX-License-Identifier: LGPL-2.1-or-later AND CC-BY-SA-4.0 */\n// Esquemático aberto segundo diretrizes OSHWA; Marca retida sob Art. 129 da Lei 9.279/96.'
    },
    cenario2_waymo_lidar: {
        nome_projeto: 'Sistema LiDAR de Navegação Autônoma (Estudo de Caso Waymo / Google vs. Uber)',
        autor_nome: 'Equipe de Engenharia Óptica e Sistemas Embarcados',
        autor_documento: '23.456.789/0001-11',
        autor_email: 'engenharia.lidar@autonomo.tech.br',
        instituicao_empresa: 'Divisão de Sensores Fotônicos e Veículos Autônomos',
        resumo_tecnico: 'Transdutor óptico LiDAR de varredura tridimensional com circuito eletrônico inédito de disparo de pulsos laser e processo técnico funcional assistido por firmware que gera efeito físico mensurável, exigindo decisão entre Patente (PI), Segredo Industrial ou Publicação Defensiva.',
        grau_novidade_hardware: 'INEDITO_INVENTIVO',
        divulgacao_previa: 'SIGILO_MANTIDO',
        possui_pcb_customizada: true,
        possui_topografia_chip: false,
        possui_design_externo_novo: true,
        usa_hardware_aberto_terceiros: 'NENHUM',
        possui_firmware_proprio: true,
        linguagem_firmware: 'C/C++ / FPGA HDL (Controle de Tempo Real)',
        licenca_bibliotecas_terceiros: 'MIT_BSD_APACHE',
        vinculacao_firmware: 'ESTATICA_MONOLITICA',
        modelo_negocio: 'COMERCIAL_FECHADO',
        titularidade_tipo: 'AUTONOMO_EMPRESA',
        trecho_codigo: '/* PROPRIETARY & CONFIDENTIAL - TRADE SECRET */\n// Controle de feixe LiDAR com efeito técnico físico (Ressalva Art. 10, V da LPI).'
    },
    cenario3_intel_amd_chip: {
        nome_projeto: 'Microarquitetura de Processador e Layout de Silício (Estudo de Caso Intel vs. AMD — Lei 11.484/07)',
        autor_nome: 'Grupo de Projeto de Circuitos Integrados e Semicondutores',
        autor_documento: '45.678.901/0001-23',
        autor_email: 'semicondutores@padis.org.br',
        instituicao_empresa: 'Centro Nacional de Microeletrônica (Elegível ao PADIS)',
        resumo_tecnico: 'Desenvolvimento da configuração tridimensional das camadas de máscara de um microchip processador (19 desenhos de layout GDSII e especificações de portas lógicas em silício), acompanhado de microcódigo em HDL/C e placa de validação.',
        grau_novidade_hardware: 'INEDITO_INVENTIVO',
        divulgacao_previa: 'SIGILO_MANTIDO',
        possui_pcb_customizada: true,
        possui_topografia_chip: true,
        possui_design_externo_novo: false,
        usa_hardware_aberto_terceiros: 'CERN_OHL_P',
        possui_firmware_proprio: true,
        linguagem_firmware: 'SystemVerilog / VHDL / C (Microcódigo)',
        licenca_bibliotecas_terceiros: 'MIT_BSD_APACHE',
        vinculacao_firmware: 'ESTATICA_MONOLITICA',
        modelo_negocio: 'COMERCIAL_FECHADO',
        titularidade_tipo: 'AUTONOMO_EMPRESA',
        trecho_codigo: '/* SPDX-License-Identifier: Solderpad-2.1 */\n// Topografia de Circuito Integrado protegida pela Lei nº 11.484/2007 (Art. 26 a 55).'
    },
    cenario4_conflito_ict: {
        nome_projeto: 'Dispositivo Biomédico Universitário com Conflito de Licenças (Marco Legal CT&I — Lei 10.973/04)',
        autor_nome: 'Pesquisadores do Laboratório de Sistemas Embarcados',
        autor_documento: '98.765.432/0001-55',
        autor_email: 'nit@universidade.edu.br',
        instituicao_empresa: 'Instituto Científico, Tecnológico e de Inovação (ICT / Gestão NIT)',
        resumo_tecnico: 'Equipamento de monitoramento desenvolvido em laboratório universitário a partir de esquemático aberto CERN-OHL-S v2 e biblioteca de processamento de sinais sob licença GNU GPLv3, no qual se pretende bloquear o código e explorar comercialmente sem abertura dos derivados.',
        grau_novidade_hardware: 'MELHORIA_FUNCIONAL',
        divulgacao_previa: 'SIGILO_MANTIDO',
        possui_pcb_customizada: true,
        possui_topografia_chip: false,
        possui_design_externo_novo: true,
        usa_hardware_aberto_terceiros: 'CERN_OHL_S',
        possui_firmware_proprio: true,
        linguagem_firmware: 'C/C++ (FreeRTOS)',
        licenca_bibliotecas_terceiros: 'GPL_V2_V3',
        vinculacao_firmware: 'ESTATICA_MONOLITICA',
        modelo_negocio: 'COMERCIAL_FECHADO',
        titularidade_tipo: 'VINCULO_EMPREGATICIO_ICT',
        trecho_codigo: '/* SPDX-License-Identifier: GPL-3.0-only AND CERN-OHL-S-2.0 */\n#include <gpl_dsp_filter.h>'
    },
    cenario5_tcc_youtube: {
        nome_projeto: 'Robô Autônomo de Inspeção Solar — Protótipo de TCC Divulgado no YouTube e GitHub',
        autor_nome: 'Graduandos do Último Semestre e Professor Orientador',
        autor_documento: '34.567.890/0001-44',
        autor_email: 'tcc.robotica@universidade.edu.br',
        instituicao_empresa: 'Laboratório de Robótica Universitária (ICT / NIT)',
        resumo_tecnico: 'Robô móvel com mecanismo magnético de limpeza de painéis solares e placa PCB própria desenvolvida no TCC. O grupo publicou um vídeo demonstrativo no YouTube e o repositório preliminar há 4 meses em mostra acadêmica, e agora pretende depositar patente antes de perder a novidade.',
        grau_novidade_hardware: 'INEDITO_INVENTIVO',
        divulgacao_previa: 'DIVULGADO_MENOS_12M',
        possui_pcb_customizada: true,
        possui_topografia_chip: false,
        possui_design_externo_novo: true,
        usa_hardware_aberto_terceiros: 'CERN_OHL_P',
        possui_firmware_proprio: true,
        linguagem_firmware: 'C/C++ e Python (ROS2 / ESP32)',
        licenca_bibliotecas_terceiros: 'MIT_BSD_APACHE',
        vinculacao_firmware: 'ESTATICA_MONOLITICA',
        modelo_negocio: 'COMERCIAL_FECHADO',
        titularidade_tipo: 'VINCULO_EMPREGATICIO_ICT',
        trecho_codigo: '/* SPDX-License-Identifier: Apache-2.0 */\n// Protótipo divulgado há 4 meses em banca pública — Aciona Período de Graça (Art. 12 da LPI).'
    },
    cenario6_startup_agrotech: {
        nome_projeto: 'AgroSense LoRaWAN — Estação de Telemetria de Solo em Modelo Híbrido',
        autor_nome: 'Cofundadores da Startup AgroSense IoT',
        autor_documento: '56.789.012/0001-66',
        autor_email: 'juridico@agrosense.io',
        instituicao_empresa: 'AgroSense Telemetria Agrícola Ltda.',
        resumo_tecnico: 'Estação de campo com nova disposição mecânica de sonda capacitiva (melhoria funcional), na qual os esquemáticos da placa-base são abertos sob CERN-OHL-W v2 para reduzir custos de manutenção rural, mantendo o firmware de calibração e a Marca AgroSense sob controle exclusivo.',
        grau_novidade_hardware: 'MELHORIA_FUNCIONAL',
        divulgacao_previa: 'SIGILO_MANTIDO',
        possui_pcb_customizada: true,
        possui_topografia_chip: false,
        possui_design_externo_novo: true,
        usa_hardware_aberto_terceiros: 'CERN_OHL_W',
        possui_firmware_proprio: true,
        linguagem_firmware: 'C/C++ / Rust (STM32 LoRaWAN)',
        licenca_bibliotecas_terceiros: 'MIT_BSD_APACHE',
        vinculacao_firmware: 'ESTATICA_MONOLITICA',
        modelo_negocio: 'HIBRIDO_HW_ABERTO_SW_FECHADO',
        titularidade_tipo: 'PARCERIA_COAUTORIA',
        trecho_codigo: '/* SPDX-License-Identifier: CERN-OHL-W-2.0 AND LicenseRef-Proprietary-Firmware */\n// Placa modular aberta + Firmware proprietário de calibração.'
    },
    cenario7_wearable_hospitalar: {
        nome_projeto: 'Pulseira Oxímetro Hospitalar de Baixo Custo com Publicação Defensiva',
        autor_nome: 'Consórcio de Engenharia Clínica Aberta',
        autor_documento: '67.890.123/0001-77',
        autor_email: 'contato@engenhariaclinica.org.br',
        instituicao_empresa: 'Rede Brasileira de Dispositivos Médicos Acessíveis',
        resumo_tecnico: 'Dispositivo vestível de monitoramento multiparamétrico com gabinete anatômico original (Desenho Industrial). O grupo optou por publicar integralmente o circuito óptico para convertê-lo em Estado da Técnica (Art. 11 da LPI) e impedir que grandes corporações patenteiem a solução.',
        grau_novidade_hardware: 'INEDITO_INVENTIVO',
        divulgacao_previa: 'DIVULGADO_MENOS_12M',
        possui_pcb_customizada: true,
        possui_topografia_chip: false,
        possui_design_externo_novo: true,
        usa_hardware_aberto_terceiros: 'CERN_OHL_P',
        possui_firmware_proprio: true,
        linguagem_firmware: 'C/C++ (Zephyr RTOS / ARM Cortex-M4)',
        licenca_bibliotecas_terceiros: 'MIT_BSD_APACHE',
        vinculacao_firmware: 'ESTATICA_MONOLITICA',
        modelo_negocio: 'PUBLICACAO_DEFENSIVA',
        titularidade_tipo: 'AUTONOMO_EMPRESA',
        trecho_codigo: '/* SPDX-License-Identifier: MIT AND CERN-OHL-P-2.0 */\n// Publicação Defensiva intencional para constituição de Estado da Técnica (Art. 11 da LPI).'
    },
    cenario8_console_reversa: {
        nome_projeto: 'Console Portátil FPGA & Recriação Funcional (Inspirado no Caso ReStory e Engenharia Reversa)',
        autor_nome: 'Estúdio Independente de Hardware Retro-Gamer',
        autor_documento: '78.901.234/0001-88',
        autor_email: 'hardware@retrolab.com.br',
        instituicao_empresa: 'RetroLab Sistemas Digitais Ltda.',
        resumo_tecnico: 'Placa compatível desenvolvida por engenharia reversa limpa (clean-room) a partir da função elétrica de um hardware clássico sem copiar o desenho gráfico da PCB original, com gabinete plástico autoral inédito (evitando violação de trade dress e Desenho Industrial de terceiros).',
        grau_novidade_hardware: 'MODULOS_PRONTOS_COTS',
        divulgacao_previa: 'SIGILO_MANTIDO',
        possui_pcb_customizada: true,
        possui_topografia_chip: false,
        possui_design_externo_novo: true,
        usa_hardware_aberto_terceiros: 'NENHUM',
        possui_firmware_proprio: true,
        linguagem_firmware: 'Verilog / VHDL e C ( Núcleos FPGA )',
        licenca_bibliotecas_terceiros: 'LGPL_ESTATICA',
        vinculacao_firmware: 'ESTATICA_MONOLITICA',
        modelo_negocio: 'COMERCIAL_FECHADO',
        titularidade_tipo: 'AUTONOMO_EMPRESA',
        trecho_codigo: '/* Clean-Room Functional Reimplementation */\n// A Lei 9.610/98 protege o desenho gráfico do esquemático, não a função elétrica.'
    }
};

// Exemplos de relatos em linguagem natural para o usuário testar ou editar livremente
const EXEMPLOS_RELATO_LIVRE = {
    tcc_youtube: 'Estou no último semestre da faculdade e desenvolvi no laboratório (TCC) um robô alimentador automático com uma placa PCB que eu mesmo desenhei no KiCad e uma carcaça impressa em 3D. Usei código em C++ com uma biblioteca GPL que achei na internet. Apresentei o protótipo numa feira e postei no YouTube há 3 meses, mas agora quero abrir uma empresa e vender o produto fechado sem liberar meu código.',
    clone_concorrente: 'Criei uma placa controladora para automação residencial e liberei o esquemático sob licença Creative Commons CC BY-SA para a comunidade ajudar, mas um concorrente baixou os arquivos, redesenhou a placa do zero com a mesma função elétrica e está vendendo no mercado usando um nome muito parecido com a minha marca.',
    startup_agrotech: 'Eu e dois sócios criamos uma startup de agronegócio e desenvolvemos um sensor inédito de umidade do solo assistido por firmware que economiza 40% de água na irrigação. Queremos abrir os esquemáticos da placa-mãe para facilitar reparos no campo, mas queremos proteger a invenção do sensor, o nosso logotipo e manter o firmware fechado.',
    wearable_medico: 'Nossa equipe desenvolveu uma pulseira inteligente para monitorar batimentos cardíacos com formato anatômico exclusivo e um microchip ASIC dedicado em silício. Não temos verba para patentear tudo em vários países, então queremos publicar o funcionamento elétrico para nenhum concorrente patentear e cobrar royalties da gente, mas garantindo o registro do design externo e da topografia do chip no Brasil.'
};

function preencherExemploRelato(chave) {
    const campo = document.getElementById('relato_livre_usuario');
    if (!campo || !EXEMPLOS_RELATO_LIVRE[chave]) return;
    campo.value = EXEMPLOS_RELATO_LIVRE[chave];
    interpretarRelatoLivre(false);
}

function limparFormularioCompleto() {
    const campoRelato = document.getElementById('relato_livre_usuario');
    if (campoRelato) campoRelato.value = '';
    const feedback = document.getElementById('feedback-relato-livre');
    if (feedback) feedback.style.display = 'none';

    document.getElementById('nome_projeto').value = '';
    document.getElementById('autor_nome').value = '';
    document.getElementById('autor_documento').value = '';
    document.getElementById('autor_email').value = '';
    document.getElementById('instituicao_empresa').value = '';
    document.getElementById('resumo_tecnico').value = '';
    document.getElementById('grau_novidade_hardware').value = 'INEDITO_INVENTIVO';
    if (document.getElementById('divulgacao_previa')) {
        document.getElementById('divulgacao_previa').value = 'SIGILO_MANTIDO';
    }
    document.getElementById('possui_pcb_customizada').checked = true;
    document.getElementById('possui_topografia_chip').checked = false;
    document.getElementById('possui_design_externo_novo').checked = false;
    document.getElementById('usa_hardware_aberto_terceiros').value = 'NENHUM';
    document.getElementById('possui_firmware_proprio').checked = true;
    document.getElementById('linguagem_firmware').value = 'C/C++';
    document.getElementById('licenca_bibliotecas_terceiros').value = 'MIT_BSD_APACHE';
    document.getElementById('vinculacao_firmware').value = 'ESTATICA_MONOLITICA';
    document.getElementById('modelo_negocio').value = 'COMERCIAL_FECHADO';
    document.getElementById('titularidade_tipo').value = 'AUTONOMO_EMPRESA';

    const campoCodigo = document.getElementById('trecho_codigo_inspecao');
    if (campoCodigo) {
        campoCodigo.value = '';
        inspecionarTrechoCodigo();
    }

    atualizarBalaoMascote(
        'MODO DE CRIAÇÃO LIVRE ATIVADO',
        'Formulário limpo: monte um projeto 100% personalizado ou descreva seu caso.',
        'Você tem liberdade total: escreva sua situação com suas próprias palavras na caixa de relato livre ou preencha os seletores das Etapas 1, 2 e 3 para testar qualquer combinação de hardware, firmware e estratégia no INPI.'
    );
}

// Interpretador de Linguagem Natural: lê o relato livre do usuário, identifica camadas/leis e preenche o formulário
function interpretarRelatoLivre(gerarDireto) {
    const campo = document.getElementById('relato_livre_usuario');
    const feedback = document.getElementById('feedback-relato-livre');
    if (!campo) return;

    const textoOriginal = campo.value.trim();
    if (!textoOriginal) {
        alert('Por favor, escreva um breve relato do seu caso ou clique em um dos botões de exemplo acima.');
        campo.focus();
        return;
    }

    const t = textoOriginal.toLowerCase();
    const achados = [];

    // 1. Identificar Titularidade / Vínculo (ICT, Sócios ou Autônomo)
    let titularidade = 'AUTONOMO_EMPRESA';
    let instituicao = 'Projeto Independente / Empresa Privada';
    if (/(faculdade|universidade|tcc|laborat[oó]rio|ict|inicia[cç][aã]o cient[ií]fica|orientador|professor|mestrado|instituto federal)/i.test(t)) {
        titularidade = 'VINCULO_EMPREGATICIO_ICT';
        instituicao = 'Universidade / ICT (Gestão via Núcleo de Inovação Tecnológica — NIT)';
        achados.push('<strong>Vínculo Universitário / ICT detectado:</strong> incidência da Lei de Inovação (Lei 10.973/04) e avaliação obrigatória pelo NIT');
    } else if (/(s[oó]cio|cofundador|amigo|parceria|dupla|equipe|dividir)/i.test(t)) {
        titularidade = 'PARCERIA_COAUTORIA';
        instituicao = 'Sociedade de Cofundadores / Parceria Técnica';
        achados.push('<strong>Coautoria / Sociedade detectada:</strong> alerta preventivo contra disputa societária de Marca (lição do caso Arduino LLC vs. SRL)');
    }

    // 2. Identificar Divulgação Pública Prévia (Período de Graça Art. 12 LPI vs. Estado da Técnica Art. 11 LPI)
    let divulgacao = 'SIGILO_MANTIDO';
    if (/(mais de 1 ano|mais de um ano|h[aá] 2 anos|h[aá] dois anos|antigo|dom[ií]nio p[uú]blico)/i.test(t)) {
        divulgacao = 'DIVULGADO_MAIS_12M';
        achados.push('<strong>Divulgação superior a 12 meses:</strong> perda da novidade patentária (Art. 11 da LPI — foco deve migrar para Marca e Software)');
    } else if (/(youtube|github|feira|congresso|mostra|postei|publiquei|divulguei|apresentei|artigo|banca|vídeo|video|m[eê]s|meses)/i.test(t)) {
        divulgacao = 'DIVULGADO_MENOS_12M';
        achados.push('<strong>Divulgação pública recente (YouTube/GitHub/Feira):</strong> acionamento do Período de Graça de 12 meses (Art. 12 da LPI)');
    }

    // 3. Identificar Camadas A, B, C, D, E e F no texto do usuário
    const temPcb = /(pcb|placa|esquem[aá]tico|kicad|altium|gerber|circuito|eletr[oô]nic)/i.test(t) || true;
    const temChip = /(chip|semicondutor|sil[ií]cio|asic|topografia|m[aá]scara|padis|vlsi|fpga)/i.test(t);
    const temDesign = /(carca[cç]a|gabinete|3d|design|est[eé]tic|pl[aá]stic|formato|anat[oô]mic|pulseira|caixa|ornamental)/i.test(t);
    const temFirmware = !/(sem software|sem firmware|apenas mec[aâ]nico)/i.test(t);

    if (temChip) achados.push('<strong>Camada C (Semicondutores):</strong> detectada menção a chip/silício/FPGA (Lei nº 11.484/2007 e PADIS)');
    if (temDesign) achados.push('<strong>Camada B (Design Externo):</strong> detectada menção a gabinete/carcaça 3D/forma plástica (Desenho Industrial — LPI)');

    // 4. Solução Técnica (Camada F)
    let novidade = 'MODULOS_PRONTOS_COTS';
    if (/(in[eé]dit|inven[cç][aã]o|novo sensor|efeito f[ií]sico|economiza|[oó]ptic|lidar|patente|inovador)/i.test(t)) {
        novidade = 'INEDITO_INVENTIVO';
        achados.push('<strong>Camada F (Solução Técnica Inédita):</strong> potencial para Patente de Invenção (PI) ou processo técnico com efeito físico (ressalva do Art. 10, V LPI)');
    } else if (/(melhoria|ergon[oô]mic|disposi[cç][aã]o|adapta[cç][aã]o|pr[aá]tic|autom[aá]tic|rob[oô]|esta[cç][aã]o)/i.test(t)) {
        novidade = 'MELHORIA_FUNCIONAL';
        achados.push('<strong>Camada F (Melhoria Funcional):</strong> potencial para Modelo de Utilidade (MU — Art. 9º da LPI)');
    } else {
        achados.push('<strong>Camada F (Circuito de Módulos/Reprodução Funcional):</strong> foco estratégico direcionado ao Registro de Marca (Camada D) e Direito Autoral');
    }

    // 5. Licenças de Software e Hardware mencionadas
    let licSw = 'MIT_BSD_APACHE';
    if (/(\bgpl|gplv3|gplv2|copyleft forte)/i.test(t)) {
        licSw = 'GPL_V2_V3';
        achados.push('<strong>Licença de Software GNU GPL detectada:</strong> atenção ao efeito recíproco (copyleft forte) se tentar fechar o firmware');
    } else if (/(lgpl|copyleft fraco)/i.test(t)) {
        licSw = 'LGPL_ESTATICA';
        achados.push('<strong>Licença GNU LGPL detectada:</strong> exige arquivos-objeto para relinkagem em firmware estático');
    }

    let licHw = 'NENHUM';
    if (/(cc by-sa|cc-by-sa|creative commons|cern-ohl-s|copyleft)/i.test(t)) {
        licHw = 'CERN_OHL_S';
        achados.push('<strong>Hardware Aberto Recíproco (CERN-OHL-S / CC BY-SA) detectado:</strong> lembre-se da fragilidade do copyleft na Camada A (engenharia reversa limpa é lícita sem patente)');
    } else if (/(cern-ohl-w|modular|abrir a placa|abrir os esquem[aá]ticos)/i.test(t)) {
        licHw = 'CERN_OHL_W';
    } else if (/(cern-ohl-p|tapr|solderpad|hardware aberto|open hardware)/i.test(t)) {
        licHw = 'CERN_OHL_P';
    }

    // 6. Estratégia de Negócio / Publicação Defensiva / Clonagem
    let modelo = 'COMERCIAL_FECHADO';
    if (/(publica[cç][aã]o defensiva|impedir que.*patente|n[aã]o cobrar royalties|estado da t[eé]cnica|barrar patente)/i.test(t)) {
        modelo = 'PUBLICACAO_DEFENSIVA';
        achados.push('<strong>Estratégia de Publicação Defensiva (Art. 11 LPI):</strong> publicação técnica como escudo contra patentes de concorrentes');
    } else if (/(abrir.*placa.*manter.*fechado|h[ií]brido|esquem[aá]tico aberto.*firmware fechado|liberar.*esquem[aá]tico.*proteger.*marca)/i.test(t)) {
        modelo = 'HIBRIDO_HW_ABERTO_SW_FECHADO';
        achados.push('<strong>Modelo Híbrido detectado:</strong> abertura da placa física combinada com retenção de Marca e Software proprietário');
    } else if (/(100% aberto|totalmente aberto|comunidade ajudar|open source total)/i.test(t) && !/(fechado|vender fechado)/i.test(t)) {
        modelo = 'OPEN_SOURCE_TOTAL';
    }

    if (/(clon|copi|concorrente|engenharia reversa|mesma fun[cç][aã]o|nome parecido)/i.test(t)) {
        achados.push('<strong>Disputa contra Clone / Engenharia Reversa detectada:</strong> análise da fragilidade da Lei 9.610/98 perante recriação funcional e tutela da Marca (Art. 129 e 189 LPI)');
    }

    // Extrair um título amigável a partir da primeira frase do usuário
    const primeiraFrase = textoOriginal.split(/[.!?]/)[0].trim();
    const tituloGerado = primeiraFrase.length > 72
        ? `Caso Personalizado: ${primeiraFrase.substring(0, 72)}...`
        : `Caso Personalizado: ${primeiraFrase}`;

    // Preencher o formulário
    document.getElementById('nome_projeto').value = tituloGerado;
    if (!document.getElementById('autor_nome').value.trim()) {
        document.getElementById('autor_nome').value = 'Autor / Equipe do Caso Relatado';
    }
    if (!document.getElementById('autor_documento').value.trim()) {
        document.getElementById('autor_documento').value = '00.000.000/0001-00';
    }
    if (!document.getElementById('autor_email').value.trim()) {
        document.getElementById('autor_email').value = 'contato@projetoavaliado.com.br';
    }
    document.getElementById('instituicao_empresa').value = instituicao;
    document.getElementById('resumo_tecnico').value = textoOriginal;
    document.getElementById('titularidade_tipo').value = titularidade;
    document.getElementById('grau_novidade_hardware').value = novidade;
    if (document.getElementById('divulgacao_previa')) {
        document.getElementById('divulgacao_previa').value = divulgacao;
    }
    document.getElementById('possui_pcb_customizada').checked = temPcb;
    document.getElementById('possui_topografia_chip').checked = temChip;
    document.getElementById('possui_design_externo_novo').checked = temDesign;
    document.getElementById('usa_hardware_aberto_terceiros').value = licHw;
    document.getElementById('possui_firmware_proprio').checked = temFirmware;
    document.getElementById('licenca_bibliotecas_terceiros').value = licSw;
    document.getElementById('modelo_negocio').value = modelo;

    if (feedback) {
        feedback.style.display = 'block';
        feedback.innerHTML = `
            <strong style="color: var(--accent-secondary); display: block; margin-bottom: 0.4rem;">
                Leitura Jurídico-Técnica do Seu Relato Concluída (${achados.length} pontos-chave identificados):
            </strong>
            <ul style="margin: 0; padding-left: 1.25rem;">
                ${achados.map(item => `<li style="margin-bottom: 0.25rem;">${item}</li>`).join('')}
            </ul>
        `;
    }

    atualizarBalaoMascote(
        'CENÁRIO DO USUÁRIO INTERPRETADO COM SUCESSO',
        'O motor traduziu seu relato para as 6 Camadas do Hardware (A–F).',
        'Todos os seletores do formulário foram ajustados de acordo com a sua história. Você pode revisar qualquer detalhe nas Etapas 1, 2 e 3 ou conferir diretamente o parecer jurídico e as minutas geradas para o seu caso.'
    );

    if (gerarDireto) {
        processarDiagnostico(null);
    }
}

// Navegação entre abas
function alternarAba(abaId) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    const painel = document.getElementById(abaId);
    if (painel) painel.classList.add('active');

    const btn = document.querySelector(`.tab-btn[data-target="${abaId}"]`);
    if (btn) btn.classList.add('active');

    if (abaId === 'aba-minutas') {
        atualizarBalaoMascote(
            'AUTONOMIA PRIVADA E NEGÓCIOS JURÍDICOS CONTRATUAIS',
            'Licenças não são leis: elas operam como autorizações contratuais apoiadas na Lei nº 9.610/98.',
            'Como demonstramos na fundamentação teórica do grupo, a lei cria o monopólio autoral ou industrial, enquanto a licença é o instrumento jurídico pelo qual o titular concede permissões sob condições. Abaixo você pode gerar os 4 documentos parametrizados para proteger a marca, os esquemáticos e o código.'
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
            'Rastreabilidade técnica entre o formulário de engenharia, o banco SQL e as minutas.',
            'Aqui apresentamos as 7 tabelas relacionais implementadas em <code>database/schema.sql</code> e a divisão de responsabilidades da aplicação web desenvolvidas por Antonio Kayky, Giullian Bernard, Ítalo Brito e Luís Aquiles.'
        );
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => window.dispatchEvent(new Event('resize')), 60);
}

// Preenche o formulário com um dos 8 cenários da biblioteca
function carregarCenario(chave) {
    const c = CENARIOS_TESTE[chave];
    if (!c) return;

    document.getElementById('nome_projeto').value = c.nome_projeto;
    document.getElementById('autor_nome').value = c.autor_nome;
    document.getElementById('autor_documento').value = c.autor_documento;
    document.getElementById('autor_email').value = c.autor_email;
    document.getElementById('instituicao_empresa').value = c.instituicao_empresa;
    document.getElementById('resumo_tecnico').value = c.resumo_tecnico;

    document.getElementById('grau_novidade_hardware').value = c.grau_novidade_hardware;
    if (document.getElementById('divulgacao_previa')) {
        document.getElementById('divulgacao_previa').value = c.divulgacao_previa || 'SIGILO_MANTIDO';
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

    const mensagensCenarios = {
        cenario1_arduino: [
            'CASO 1 — LIÇÃO DO CONFLITO ARDUINO LLC vs. ARDUINO SRL (GENUINO)',
            'Quando o hardware e o código são livres, a Marca (Camada D) é o único vetor de controle patrimonial.',
            'Neste cenário reproduzimos o estudo de caso do nosso documento: qualquer concorrente pode fabricar a placa física aberta sob CC BY-SA / CERN-OHL, mas ninguém pode comercializá-la com o nome oficial sem o <strong>Registro de Marca no INPI (Art. 129 da LPI)</strong> e um acordo sólido entre os cofundadores.'
        ],
        cenario2_waymo_lidar: [
            'CASO 2 — WAYMO (GOOGLE) vs. UBER E A PUBLICAÇÃO DEFENSIVA',
            'O dilema entre guardar Segredo Industrial, depositar Patente ou abrir como Estado da Técnica.',
            'No caso do sensor LiDAR da Waymo, manter tudo apenas em segredo industrial expôs a empresa ao furto de milhares de arquivos técnicos. Processando este cenário, o motor avalia a proteção patentária da solução técnica (Camada F) e contrasta com a <strong>Publicação Defensiva (Art. 11 da LPI)</strong>.'
        ],
        cenario3_intel_amd_chip: [
            'CASO 3 — INTEL vs. AMD E A TOPOGRAFIA DE CIRCUITOS INTEGRADOS (CAMADA C)',
            'Nível máximo de especialização no hardware: proteção do leiaute tridimensional de microchips.',
            'Como vimos no caso do ex-engenheiro que copiou 19 desenhos de chips da Intel, o projeto físico de semicondutores atrai a <strong>Lei nº 11.484/2007 (Topografia de Circuitos Integrados e PADIS)</strong>, além de levantar o debate sobre a fronteira entre lógica em silício (hardware) e firmware (Art. 10, V da LPI).'
        ],
        cenario4_conflito_ict: [
            'CASO 4 — INOVAÇÃO UNIVERSITÁRIA (MARCO LEGAL DE CT&I) E EFEITO VIRAL',
            'O papel do NIT nas ICTs (Lei nº 10.973/2004) e o conflito com licenças fortemente recíprocas.',
            'Este cenário aborda a nossa provocação jurídica sobre pesquisa universitária: além da titularidade pertencer originariamente à instituição de ensino (gerida pelo <strong>NIT</strong>), a tentativa de fechar comercialmente um projeto derivado de <strong>GPLv3</strong> e <strong>CERN-OHL-S</strong> gera impedimento jurídico imediato.'
        ],
        cenario5_tcc_youtube: [
            'CASO 5 — TCC / ROBÓTICA JÁ EXPOSTA NO YOUTUBE E O PERÍODO DE GRAÇA (ART. 12 LPI)',
            'Divulgou o projeto antes de pedir a patente? Você tem exatamente 12 meses para salvar o ineditismo.',
            'Muitos estudantes publicam vídeos ou artigos do TCC achando que perderam o direito à patente. Pelo <strong>Art. 12 da Lei nº 9.279/1996 (Período de Graça)</strong>, a divulgação feita pelo próprio inventor nos 12 meses anteriores ao depósito no INPI não destrói a novidade!'
        ],
        cenario6_startup_agrotech: [
            'CASO 6 — STARTUP AGROTECH EM MODELO HÍBRIDO (CERN-OHL-W + FIRMWARE FECHADO)',
            'Equilíbrio estratégico entre abertura modular da PCB e retenção de algoritmos e marca.',
            'Ao adotar a <strong>CERN-OHL-W v2 (Reciprocidade Fraca)</strong> na placa-base, a startup permite manutenção em campo pelos produtores rurais, mas protege a sonda como <strong>Modelo de Utilidade (Art. 9º LPI)</strong> e mantém o firmware de calibração proprietário.'
        ],
        cenario7_wearable_hospitalar: [
            'CASO 7 — DISPOSITIVO MÉDICO E ESCUDO DE PUBLICAÇÃO DEFENSIVA (ART. 11 LPI)',
            'Como impedir que grandes corporações patenteiem uma tecnologia acessível e cobrem royalties.',
            'Ao publicar deliberadamente os esquemáticos e o princípio técnico, o projeto entra no <strong>Estado da Técnica (Art. 11 da LPI)</strong>, impedindo patentes alheias, enquanto o grupo protege a estética externa via <strong>Desenho Industrial (Camada B)</strong> e o nome via <strong>Marca (Camada D)</strong>.'
        ],
        cenario8_console_reversa: [
            'CASO 8 — ENGENHARIA REVERSA LIMPA E TRADE DRESS (CASO RESTORY)',
            'Recriar a função elétrica sem copiar o desenho da PCB é lícito se não houver patente vigente.',
            'Este cenário demonstra na prática a <strong>fragilidade do Direito Autoral no hardware (Lei 9.610/98)</strong>: como a lei protege apenas o desenho gráfico do esquemático, a reimplementação funcional limpa é permitida, desde que crie um gabinete externo próprio para não violar o Desenho Industrial ou <em>trade dress</em> alheio.'
        ]
    };

    if (mensagensCenarios[chave]) {
        const [tag, tit, txt] = mensagensCenarios[chave];
        atualizarBalaoMascote(tag, tit, txt);
    }
}

// Motor de Decisão fundamentado nas 6 Camadas (A a F) do Documento de Diretrizes do Grupo
function motorDecisaoLocal(dados) {
    const recomendacoesInpi = [];
    const alertasLicenca = [];
    const camadasAnalise = [];
    let score = 45;
    let risco = 'NULO';
    const divulgacao = dados.divulgacao_previa || 'SIGILO_MANTIDO';

    // CAMADA D: SIGNOS DISTINTIVOS (MARCA E LOGOTIPO — Art. 129 e 189 da LPI)
    score += 10;
    recomendacoesInpi.push({
        codigo: 'MARCA',
        titulo: 'Camada D — Registro de Marca e Signo Distintivo (INPI)',
        base_legal: 'Lei nº 9.279/1996 (LPI — Art. 129 e Art. 189)',
        prioridade: 'Vetor Patrimonial Essencial',
        prazo: '10 anos (renovável indefinidamente)',
        justificativa: 'Pelo sistema atributivo brasileiro (Art. 129 da LPI), a propriedade e o uso exclusivo do nome comercial decorrem do registro no INPI. Como demonstrado no caso Arduino LLC vs. Arduino SRL (Genuino), mesmo quando o hardware e o software são abertos, a retenção da marca é o principal instrumento jurídico para garantir sustentabilidade financeira e impedir contrafação (Art. 189 da LPI).'
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

    // CAMADA F: SOLUÇÃO TÉCNICA (PATENTE PI / MU e Ressalva do Art. 10, V da LPI)
    if (dados.modelo_negocio === 'PUBLICACAO_DEFENSIVA') {
        score += 15;
        alertasLicenca.push({
            nivel: 'INFO',
            titulo: 'Estratégia de Publicação Defensiva e Estado da Técnica (Art. 11 e 12 da LPI)',
            descricao: 'Ao optar pela Publicação Defensiva, a divulgação ampla da documentação técnica converte o projeto em "Estado da Técnica" (Art. 11 da LPI), destruindo o requisito de novidade e criando um escudo jurídico: nenhuma empresa concorrente poderá patentear a solução e cobrar royalties de você no futuro. Caso deseje converter essa publicação em pedido de patente próprio no Brasil, observe o Período de Graça de 12 meses (Art. 12 da LPI).'
        });
    } else if (divulgacao !== 'DIVULGADO_MAIS_12M' && dados.grau_novidade_hardware === 'INEDITO_INVENTIVO') {
        score += 25;
        recomendacoesInpi.unshift({
            codigo: 'PI',
            titulo: 'Camada F — Patente de Invenção (PI) / Processo Técnico com Efeito Físico',
            base_legal: 'Lei nº 9.279/1996 (Art. 8º, Art. 40 e interpretação do Art. 10, V)',
            prioridade: 'Prioridade Primária (Exclusividade Técnica)',
            prazo: '20 anos de vigência',
            justificativa: 'Embora o Art. 10, inciso V, da LPI vede patente para programa de computador "em si", os circuitos inéditos e os processos técnicos funcionais assistidos por software que gerem efeito técnico no mundo físico são plenamente patenteáveis. Atenção à lição do caso Waymo vs. Uber: manter a invenção apenas em segredo industrial sem patente ou publicação defensiva eleva o risco em caso de vazamento técnico.'
        });
    } else if (divulgacao !== 'DIVULGADO_MAIS_12M' && dados.grau_novidade_hardware === 'MELHORIA_FUNCIONAL' && dados.possui_pcb_customizada) {
        score += 15;
        recomendacoesInpi.unshift({
            codigo: 'MU',
            titulo: 'Camada F — Patente de Modelo de Utilidade (MU)',
            base_legal: 'Lei nº 9.279/1996 (Art. 9º e 40)',
            prioridade: 'Prioridade Primária (Forma Funcional)',
            prazo: '15 anos de vigência',
            justificativa: 'A nova disposição construtiva na placa ou equipamento confere melhoria funcional no uso ou fabricação, atendendo ao requisito de ato inventivo do Modelo de Utilidade.'
        });
    } else {
        camadasAnalise.push({
            camada: 'Camada F • Solução Técnica (Ausência de Ineditismo Patentário)',
            status: 'Foco em Marca (Camada D), Software (Camada E) e Documentação (Camada A)',
            detalhe: 'Como o circuito baseia-se em módulos comerciais ou já ingressou no estado da técnica (Art. 11 da LPI), não cabe depósito de Patente (PI/MU). A sustentabilidade jurídica do projeto deve apoiar-se no Registro de Marca (Art. 129 da LPI) e no licenciamento do firmware e da documentação.'
        });
    }

    // CAMADA C: SEMICONDUTORES E TOPOGRAFIA DE CIRCUITO INTEGRADO (Lei 11.484/2007)
    if (dados.possui_topografia_chip) {
        score += 15;
        recomendacoesInpi.push({
            codigo: 'TCI',
            titulo: 'Camada C — Topografia de Circuito Integrado (Microchips / Silício)',
            base_legal: 'Lei nº 11.484/2007 (Art. 26 a 55 — Institui também o PADIS)',
            prioridade: 'Especialização Máxima em Semicondutores',
            prazo: '10 anos (a contar do depósito ou 1ª exploração econômica)',
            justificativa: 'Tutela o leiaute tridimensional das camadas que compõem o microchip (arquivos GDSII/OASIS), ressalvadas as exceções legais para ensino, pesquisa acadêmica e engenharia reversa lícita. O projeto também pode pleitear enquadramento nos incentivos fiscais do PADIS.'
        });
    }

    // CAMADA B: DESIGN DO PRODUTO (DESENHO INDUSTRIAL — Art. 94 da LPI)
    if (dados.possui_design_externo_novo) {
        score += 10;
        recomendacoesInpi.push({
            codigo: 'DI',
            titulo: 'Camada B — Registro de Desenho Industrial (Design Externo)',
            base_legal: 'Lei nº 9.279/1996 (Art. 94 a 121)',
            prioridade: 'Proteção Estética ("A Cara do Aparelho")',
            prazo: '10 anos (renováveis até 25 anos)',
            justificativa: 'Protege a forma plástica ornamental e os aspectos visuais externos do dispositivo contra imitação estética.'
        });
    }

    // CAMADA E: SOFTWARE EMBARCADO (Lei 9.609/1998 e Lei 9.610/1998)
    if (dados.possui_firmware_proprio) {
        score += 10;
        recomendacoesInpi.push({
            codigo: 'RPC',
            titulo: 'Camada E — Regime Especial de Software Embarcado (e-Software INPI)',
            base_legal: 'Lei nº 9.609/1998 (Art. 2º e Art. 4º) e Lei nº 9.610/1998',
            prioridade: 'Tutela Autoral de 50 Anos (Registro Facultativo)',
            prazo: '50 anos a partir de 1º de janeiro do ano subsequente à publicação',
            justificativa: 'O firmware equipara-se às obras literárias. Embora o registro junto ao INPI seja facultativo, o depósito do resumo Hash SHA-512 garante segurança probatória imediata e resguarda a titularidade laboral prevista no Art. 4º da Lei nº 9.609/1998.'
        });
    }

    // CAMADA A: DOCUMENTAÇÃO TÉCNICA E FRAGILIDADE DO COPYLEFT NO HARDWARE (Lei 9.610/98)
    alertasLicenca.push({
        nivel: 'INFO',
        titulo: 'Camada A — Fragilidade Jurídica do Copyleft no Hardware (Lei nº 9.610/1998)',
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
            titulo: 'Impedimento Contratual: Biblioteca GNU GPLv3 em Firmware Fechado',
            descricao: 'As licenças apoiam-se no monopólio autoral (Lei 9.610/98): como a alternativa ao cumprimento da licença é a proibição de uso, você não pode distribuir código derivado de biblioteca GPLv3 em binário fechado. A GPLv3 exige disponibilizar todo o código-fonte do firmware e proíbe travas de gravação física (Anti-Tivoização).'
        });
        licencaSw = 'GNU GPLv3 (Obrigatória por derivação) ou Substituição da Biblioteca';
    } else if (dados.licenca_bibliotecas_terceiros === 'LGPL_ESTATICA' && dados.vinculacao_firmware === 'ESTATICA_MONOLITICA' && querFecharSw) {
        risco = 'MEDIO';
        alertasLicenca.unshift({
            nivel: 'ATENCAO',
            titulo: 'Condição de Relinkagem Estática (GNU LGPL em Microcontrolador)',
            descricao: 'Ao compilar estaticamente uma biblioteca LGPL dentro de uma imagem monolítica de firmware fechado, você deve disponibilizar os arquivos-objeto (.o) para que o usuário possa relinkar versões modificadas da biblioteca LGPL.'
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
    const querFecharHw = ($m = dados.modelo_negocio) === 'COMERCIAL_FECHADO';

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
            titulo: 'Marco Legal de CT&I (Lei nº 10.973/2004 e Lei nº 13.243/2016) e Art. 4º da Lei de Software',
            descricao: 'Projetos desenvolvidos em Instituições Científicas, Tecnológicas e de Inovação (ICTs) possuem titularidade originária vinculada à instituição de ensino e devem ser geridos pelo Núcleo de Inovação Tecnológica (NIT), que decidirá entre a busca do privilégio patentário ou a disponibilização em hardware aberto. No caso de vínculo empregatício/prestação de serviços, aplica-se a titularidade do empregador (Art. 4º da Lei nº 9.609/98).'
        });
    } else if (dados.titularidade_tipo === 'PARCERIA_COAUTORIA') {
        alertasLicenca.push({
            nivel: 'ATENCAO',
            titulo: 'Prevenção de Litígio Societário sobre a Marca (Lição Arduino LLC vs. Arduino SRL)',
            descricao: 'Quando há múltiplos cofundadores, é indispensável firmar imediatamente a Cessão de Direitos e o Acordo de Cotitularidade (Aba 03) unificando o depósito da Marca no INPI sob uma única entidade jurídica, evitando que sócios registrem a mesma marca separadamente em diferentes jurisdições.'
        });
    }

    score = Math.max(15, Math.min(100, score));
    return {
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
}

// Submissão do Formulário de Arquitetura
async function processarDiagnostico(event) {
    if (event) event.preventDefault();

    const dados = {
        nome_projeto: document.getElementById('nome_projeto').value.trim(),
        autor_nome: document.getElementById('autor_nome').value.trim(),
        autor_documento: document.getElementById('autor_documento').value.trim(),
        autor_email: document.getElementById('autor_email').value.trim(),
        instituicao_empresa: document.getElementById('instituicao_empresa').value.trim(),
        resumo_tecnico: document.getElementById('resumo_tecnico').value.trim(),
        grau_novidade_hardware: document.getElementById('grau_novidade_hardware').value,
        divulgacao_previa: document.getElementById('divulgacao_previa') ? document.getElementById('divulgacao_previa').value : 'SIGILO_MANTIDO',
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
                document.getElementById('engine-status-text').textContent = 'Motor PHP + SQL Ativo';
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
    gerarMinutaAutomatizada('CESSAO_DIREITOS');
    alternarAba('aba-relatorio');

    if (ultimoDiagnostico.risco_contaminacao_licenca === 'ALTO_CRITICO') {
        atualizarBalaoMascote(
            'RESULTADO DO DIAGNÓSTICO — CONFLITO CONTRATUAL DE LICENÇAS DETECTADO',
            `Índice de Protegibilidade: ${ultimoDiagnostico.score_protegibilidade}/100 — Risco Crítico de Reciprocidade`,
            `O projeto apresenta colisão entre a pretensão de fechamento comercial e o uso de ativos sob <strong>GPLv3 ou CERN-OHL-S / CC BY-SA</strong>. Lembre-se da premissa teórica do nosso estudo: a licença é uma autorização condicional; descumpri-la retira a permissão de uso e configura violação de Direito Autoral (Lei nº 9.610/98).`
        );
    } else {
        atualizarBalaoMascote(
            'RESULTADO DO DIAGNÓSTICO — MATRIZ MULTICAMADA (A–F) PROCESSADA',
            `Índice de Protegibilidade: ${ultimoDiagnostico.score_protegibilidade}/100 — Foco Primário: ${ultimoDiagnostico.protecao_inpi_primaria}`,
            `As 6 camadas do dispositivo foram mapeadas com sucesso segundo a legislação brasileira. Verifique abaixo o enquadramento individual de cada camada e acesse a <strong>Aba 03</strong> para emitir os contratos e o dossiê do INPI.`
        );
    }
}

// Renderiza as 6 Camadas (A a F) e tabelas do diagnóstico na Aba 2
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

    // Mapa das 6 Camadas Tecnológicas (A a F — Exatamente como no Slide 6 e Documento de Diretrizes do Grupo)
    const camadasGrid = document.getElementById('mapa-camadas-grid');
    if (camadasGrid) {
        const statusCamadaA = dados.possui_pcb_customizada
            ? `Direito Autoral sobre Desenho/Esquemático (Lei 9.610/98 — LDA)`
            : `Documentação Padrão de Terceiros`;

        const statusCamadaB = dados.possui_design_externo_novo
            ? `Desenho Industrial no INPI (10 a 25 anos — Lei 9.279/96)`
            : `Sem forma plástica ornamental nova`;

        const statusCamadaC = dados.possui_topografia_chip
            ? `Topografia de Circuito Integrado (10 anos — Lei 11.484/2007 e PADIS)`
            : `Não aplicável (Usa chip comercial de prateleira)`;

        const statusCamadaD = `Registro de Marca no INPI (10 anos renováveis — Art. 129 da LPI)`;

        const statusCamadaE = dados.possui_firmware_proprio
            ? `Direito Autoral de Software (50 anos — Lei 9.609/98 • ${dados.linguagem_firmware})`
            : `Sem firmware próprio declarado`;

        const statusCamadaF = dados.modelo_negocio === 'PUBLICACAO_DEFENSIVA'
            ? `Publicação Defensiva / Estado da Técnica (Art. 11 e 12 da LPI)`
            : (dados.grau_novidade_hardware === 'INEDITO_INVENTIVO'
                ? `Patente de Invenção (20 anos — Lei 9.279/96 Art. 8º)`
                : (dados.grau_novidade_hardware === 'MELHORIA_FUNCIONAL' && dados.possui_pcb_customizada
                    ? `Modelo de Utilidade (15 anos — Lei 9.279/96 Art. 9º)`
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

// Gerador Automatizado de Minutas Contratuais e Dossiê Multicamada (Aba 3)
function gerarMinutaAutomatizada(tipoDocumento) {
    const p = ultimoProjetoAvaliado || CENARIOS_TESTE.cenario1_arduino;
    const d = ultimoDiagnostico || motorDecisaoLocal(p);
    const dataHoje = new Date().toLocaleDateString('pt-BR');
    const hashSimulado = Array.from(p.nome_projeto + tipoDocumento + dataHoje)
        .reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0)
        .toString(16).replace('-', 'f8a9') + 'e4b29c0177d3a8f1';

    let texto = '';

    if (tipoDocumento === 'CESSAO_DIREITOS') {
        texto = `INSTRUMENTO PARTICULAR DE CESSÃO DE DIREITOS PATRIMONIAIS SOBRE PROJETO MULTICAMADA DE HARDWARE E SOFTWARE EMBARCADO

Fundamentação Constitucional e Legal: Art. 5º, incisos XXVII, XXVIII e XXIX da Constituição Federal de 1988; Lei nº 9.279/1996 (LPI); Lei nº 9.609/1998 (Lei de Software); Lei nº 9.610/1998 (Lei de Direitos Autorais — LDA); Lei nº 11.484/2007 (Topografia de Circuitos Integrados) e Lei nº 10.973/2004 (Marco Legal de CT&I).

1. QUALIFICAÇÃO DAS PARTES
CEDENTE(S) (CRIADORES / PROJETISTAS): ${p.autor_nome}, inscrito(s) sob CPF/CNPJ nº ${p.autor_documento}, e-mail ${p.autor_email}.
CESSIONÁRIA (ORGANIZAÇÃO / TITULAR / ICT): ${p.instituicao_empresa}.

2. DO OBJETO HÍBRIDO E MULTICAMADA CEDIDO
Cláusula 2.1. O presente instrumento formaliza a cessão definitiva dos direitos patrimoniais relativos ao ativo tecnológico denominado "${p.nome_projeto}".
Cláusula 2.2. Síntese Técnica: ${p.resumo_tecnico}
Cláusula 2.3. Considerando a ausência de estatuto único para o hardware no ordenamento brasileiro, a presente transferência abrange expressamente as 6 (seis) camadas de proteção aplicáveis:
  • Camada A (Documentação Técnica — Lei nº 9.610/98): esquemáticos elétricos, leiaute de PCB, arquivos Gerber, BOM e manuais técnicos;
  • Camada B (Design do Produto — Lei nº 9.279/96, Art. 94): forma plástica ornamental e configuração estética externa do aparelho;
  • Camada C (Semicondutores — Lei nº 11.484/2007): configuração tridimensional das camadas de microchips/silício, quando aplicável;
  • Camada D (Signos Distintivos — Lei nº 9.279/96, Art. 129): direitos de depósito e uso exclusivo sobre o nome comercial, marca e logotipo (prevenindo cisões societárias nos moldes do precedente Arduino LLC vs. Arduino SRL);
  • Camada E (Software Embarcado — Lei nº 9.609/98, Art. 4º): código-fonte funcional desenvolvido em ${p.linguagem_firmware};
  • Camada F (Solução Técnica — Lei nº 9.279/96, Art. 8º e 9º): direitos de requerer Patente de Invenção ou Modelo de Utilidade sobre a funcionalidade eletromecânica ou processo assistido por software com efeito técnico físico.

3. DO ENQUADRAMENTO RECOMENDADO PELO OBSERVATÓRIO DE PI
  • Proteção Primária no INPI: ${d.protecao_inpi_primaria}
  • Proteção Complementar no INPI: ${d.protecao_inpi_secundaria}
  • Regime Definido para a Camada A (Hardware): ${d.licenca_hw_recomendada}
  • Regime Definido para a Camada E (Firmware): ${d.licenca_sw_recomendada}

Local e Data: Brasil, ${dataHoje}.

__________________________________________________
CEDENTE(S): ${p.autor_nome}

__________________________________________________
CESSIONÁRIA: ${p.instituicao_empresa}

[Código Hash de Verificação: SHA-${hashSimulado}]`;
    } else if (tipoDocumento === 'TERMO_OPEN_HARDWARE_CERN') {
        texto = `TERMO DE LICENCIAMENTO PÚBLICO DE HARDWARE ABERTO (OSHW) COM RESERVA EXPRESSA DE MARCA REGISTRADA

PROJETO: ${p.nome_projeto}
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

5. EFEITO DE PUBLICAÇÃO DEFENSIVA (ART. 11 DA LPI)
A publicação irrestrita desta documentação incorpora a arquitetura ao estado da técnica, impedindo a apropriação patentária indevida por terceiros.

Brasil, ${dataHoje}.
Resumo de Auditoria: SHA-${hashSimulado}`;
    } else if (tipoDocumento === 'LICENCIAMENTO_COMERCIAL_IOT') {
        texto = `CONTRATO DE LICENCIAMENTO INDUSTRIAL, CONFIDENCIALIDADE E PROTEÇÃO DE TOPOGRAFIA E HARDWARE

ATIVO TECNOLÓGICO: ${p.nome_projeto}
LICENCIANTE: ${p.instituicao_empresa} (${p.autor_nome} — Doc: ${p.autor_documento})

1. OBJETO DO LICENCIAMENTO INDUSTRIAL
1.1. Concessão de licença de exploração comercial da tecnologia "${p.nome_projeto}", abrangendo circuitos, layouts e firmware embarcado (${p.linguagem_firmware}).
1.2. Especificação: ${p.resumo_tecnico}

2. TUTELA CONTRA ESPIONAGEM INDUSTRIAL E COPIA DE SEMICONDUTORES
2.1. O presente contrato protege ativos enquadrados em:
  • ${d.protecao_inpi_primaria}
  • ${d.protecao_inpi_secundaria}
2.2. Em prevenção a ilícitos de apropriação indevida de projetos (a exemplo dos precedentes Waymo vs. Uber sobre sensores LiDAR e Intel vs. AMD sobre layouts de processadores), é estritamente vedado à LICENCIADA:
  a) Realizar cópia não autorizada de configurações tridimensionais de máscaras de semicondutores (Lei nº 11.484/2007);
  b) Extrair binários gravados em memória não volátil ou reproduzir a expressão gráfica dos esquemáticos confidenciais (Art. 195 da Lei nº 9.279/96 e Lei nº 9.609/98).

3. REMUNERAÇÃO E FORO
3.1. A exploração comercial sujeita-se ao pagamento de royalties por unidade fabricada, permanecendo o dever de sigilo técnico vigente por 10 (dez) anos.

Brasil, ${dataHoje}.

__________________________________________________
LICENCIANTE: ${p.instituicao_empresa}

[Resumo de Verificação: SHA-${hashSimulado}]`;
    } else if (tipoDocumento === 'MEMORIAL_INPI') {
        texto = `DOSSIÊ TÉCNICO MULTICAMADA (A–F) PARA SUBMISSÃO AO INPI OU PUBLICAÇÃO DEFENSIVA

1. IDENTIFICAÇÃO DO PROJETO E AUTORIA
• Projeto: ${p.nome_projeto}
• Autores: ${p.autor_nome} (${p.autor_documento})
• Organização / ICT: ${p.instituicao_empresa}
• Data de Emissão: ${dataHoje}
• Índice de Protegibilidade: ${d.score_protegibilidade}/100 | Risco de Conflito: ${d.risco_contaminacao_licenca}

2. SÍNTESE DESCRITIVA DO APARELHO
"${p.resumo_tecnico}"

3. DIAGNÓSTICO NAS 6 CAMADAS DO HARDWARE (FUNDAMENTO: CF/88 ART. 5º, XXVII–XXIX)
  • Camada A (Documentação Técnica — Lei 9.610/98): ${d.licenca_hw_recomendada}
  • Camada B (Design do Produto — Lei 9.279/96 Art. 94): ${p.possui_design_externo_novo ? 'Registro de Desenho Industrial (10 a 25 anos)' : 'Não requerido'}
  • Camada C (Semicondutores — Lei 11.484/2007): ${p.possui_topografia_chip ? 'Registro de Topografia de Circuito Integrado (10 anos / PADIS)' : 'Não requerido'}
  • Camada D (Signos Distintivos — Lei 9.279/96 Art. 129): Registro de Marca no INPI (10 anos, renovável indefinidamente)
  • Camada E (Software Embarcado — Lei 9.609/98): ${d.licenca_sw_recomendada} (Vigência de 50 anos)
  • Camada F (Solução Técnica — Lei 9.279/96 Art. 8º/9º): ${d.protecao_inpi_primaria}

4. PARECERES E APONTAMENTOS DOGMÁTICOS DO MOTOR DE DECISÃO
${d.alertas_licenca.map(a => `  • [${a.nivel}] ${a.titulo}:\n    ${a.descricao}`).join('\n\n')}

5. ROTEIRO DE PROVIDÊNCIAS JUNTO AO INPI E AO NIT
  [ ] Protocolar pedido de Registro de Marca (Camada D) no sistema e-Marcas para garantir exclusividade nominativa (Art. 129 da LPI).
  [ ] Gerar hash SHA-512 do código-fonte em ${p.linguagem_firmware} para depósito probatório no e-Software (Camada E).
  [ ] Avaliar depósito patentário (Camada F) dentro do Período de Graça de 12 meses (Art. 12 da LPI) ou formalizar Publicação Defensiva (Art. 11 da LPI).
  [ ] Caso haja vínculo com ICT pública, submeter este dossiê ao Núcleo de Inovação Tecnológica (NIT) nos termos da Lei nº 10.973/2004.

Observatório de Propriedade Intelectual e Hardware Aberto.
Resumo de Verificação: SHA-${hashSimulado}`;
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
    a.download = 'Minuta_Observatorio_PI_Hardware.doc';
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
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#cbd5e1;">Nenhuma avaliação processada nesta sessão. Selecione um caso na Aba 01 e clique em Processar Diagnóstico.</td></tr>';
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

// Inicialização automática com o Caso 1 (Arduino) carregado
document.addEventListener('DOMContentLoaded', () => {
    const c = CENARIOS_TESTE.cenario1_arduino;
    document.getElementById('nome_projeto').value = c.nome_projeto;
    document.getElementById('autor_nome').value = c.autor_nome;
    document.getElementById('autor_documento').value = c.autor_documento;
    document.getElementById('autor_email').value = c.autor_email;
    document.getElementById('instituicao_empresa').value = c.instituicao_empresa;
    document.getElementById('resumo_tecnico').value = c.resumo_tecnico;
    document.getElementById('grau_novidade_hardware').value = c.grau_novidade_hardware;
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

    ultimoProjetoAvaliado = c;
    ultimoDiagnostico = motorDecisaoLocal(ultimoProjetoAvaliado);
    renderizarRelatorioDiagnostico(ultimoProjetoAvaliado, ultimoDiagnostico);
    gerarMinutaAutomatizada('CESSAO_DIREITOS');
    renderizarTabelaHistorico();
    inicializarBarraRolagemCantoDireito();
});
