# Modelagem de Dados (DER) e Árvore de Decisão Jurídico-Técnica (Matriz A–F)
**Projeto 3: Observatório de Propriedade Intelectual e Hardware Aberto**  
**Equipe ("Os Cara"):** Antonio Kayky Gonçalves Vieira, Giullian Bernard Alencar Maia, Ítalo Brito da Costa e Luís Aquiles Lucena Sá

Este documento consolida o **Artefato de Modelagem (DER)** e a **Árvore Lógica do Motor de Decisão** fundamentados na Matriz de 6 Camadas do Hardware (**Camadas A a F**) definida na Entrega 1 da equipe:
- **Camada A (Documentação Técnica):** Direito Autoral sobre esquemáticos, PCB e manuais (*Lei nº 9.610/1998 — LDA*);
- **Camada B (Design do Produto):** Desenho Industrial (*Lei nº 9.279/1996 — Art. 94 a 121*, 10 a 25 anos);
- **Camada C (Semicondutores):** Topografia de Circuito Integrado (*Lei nº 11.484/2007 e PADIS*, 10 anos);
- **Camada D (Signos Distintivos):** Registro de Marca no INPI (*Lei nº 9.279/1996 — Arts. 129 e 189*; vigência de 10 anos renováveis — Art. 133);
- **Camada E (Software Embarcado):** Direito Autoral de Software (*Lei nº 9.609/1998 — Art. 4º*, 50 anos);
- **Camada F (Solução Técnica):** Patente de Invenção (20 anos) ou Modelo de Utilidade (15 anos), observada a ressalva do *Art. 10, V da LPI* para processos técnicos com efeito físico, a *Publicação Defensiva (Art. 11 LPI)* e o *Período de Graça de 12 meses (Art. 12 LPI)*.

---

## 1. Diagrama Entidade-Relacionamento (DER)

Os diagramas completos estão em **`docs/der/`**:

| Arquivo | Conteúdo |
|---|---|
| `DER_Observatorio_PI.pdf` | Capa, DER conceitual, DER lógico, dicionário de dados e decisões de modelagem |
| `der-conceitual.svg` / `.png` | DER conceitual (notação de Peter Chen, no estilo do brModelo, cardinalidade (mín,máx)) |
| `der-logico.svg` / `.png` | DER lógico (notação pé de galinha, no estilo do MySQL Workbench, com PK, FK e valores únicos) |

Os diagramas foram gerados a partir do banco real (`database/schema.sql`), então correspondem exatamente às tabelas do sistema. Os arquivos SVG podem ser abertos e editados no Figma, no draw.io ou no navegador.

### 1.1 DER lógico (resumo em Mermaid)

```mermaid
erDiagram
    USUARIOS ||--o{ PROJETOS_AVALIADOS : "submete"
    PROJETOS_AVALIADOS ||--|{ DIAGNOSTICOS_GERADOS : "gera"
    MODALIDADES_INPI |o--o{ DIAGNOSTICOS_GERADOS : "fundamenta"
    LICENCAS_CATALOGO |o--o{ DIAGNOSTICOS_GERADOS : "recomenda (hw e sw)"
    USUARIOS |o--o{ REGISTROS_TITULARIDADE : "é titular de"
    PROJETOS_AVALIADOS |o--o{ REGISTROS_TITULARIDADE : "origina"

    USUARIOS {
        int id PK
        varchar nome_completo
        varchar documento_cpf_cnpj UK "só dígitos"
        varchar email
        varchar instituicao_empresa
        varchar perfil
        datetime criado_em
    }

    PROJETOS_AVALIADOS {
        int id PK
        int usuario_id FK
        varchar nome_projeto
        text resumo_tecnico
        varchar grau_novidade_hardware
        bool possui_pcb_customizada
        bool possui_topografia_chip
        bool possui_design_externo_novo
        varchar usa_hardware_aberto_terceiros
        bool possui_firmware_proprio
        varchar linguagem_firmware
        varchar licenca_bibliotecas_terceiros
        varchar vinculacao_firmware
        varchar modelo_negocio
        varchar titularidade_tipo
        datetime data_submissao
    }

    DIAGNOSTICOS_GERADOS {
        int id PK
        int projeto_id FK
        int score_protegibilidade
        varchar risco_contaminacao_licenca
        varchar protecao_inpi_primaria
        varchar protecao_inpi_secundaria
        varchar licenca_hw_recomendada
        varchar licenca_sw_recomendada
        varchar modalidade_primaria_codigo FK
        varchar licenca_hw_codigo FK
        varchar licenca_sw_codigo FK
        text json_parecer_completo
        datetime criado_em
    }

    REGISTROS_TITULARIDADE {
        int id PK
        varchar protocolo_registro UK
        varchar origem_base "usuário ou acervo ilustrativo"
        varchar nome_criacao_marca
        varchar titular_nome
        varchar titular_documento
        varchar instituicao_empresa
        text resumo_tecnico
        text palavras_chave
        varchar classificacao_cip
        varchar modalidade_protecao
        varchar camadas_protegidas
        varchar status_juridico
        varchar hash_sha512
        datetime data_registro
        int usuario_id FK "vazio no acervo ilustrativo"
        int projeto_id FK "vazio no acervo ilustrativo"
    }

    MODALIDADES_INPI {
        int id PK
        varchar codigo UK "LDA, DI, TCI, MARCA, RPC, PI, MU"
        varchar nome
        varchar base_legal
        varchar prazo_vigencia
        text escopo_protecao
        text requisitos_legais
        text aplicacao_iot_hardware
    }

    LICENCAS_CATALOGO {
        int id PK
        varchar codigo UK "MIT, LGPLv3, GPLv3, CERN-OHL-P/W/S, PROPRIETARIA"
        varchar nome
        varchar camada_alvo
        varchar tipo_permissividade
        bool efeito_viral
        bool permite_uso_comercial
        bool exige_abertura_derivados
        varchar compatibilidade_patente
        text descricao_juridica
    }
```

### 1.2 Cardinalidades (leitura)

- Um **usuário** submete (0,N) projetos; cada projeto pertence a (1,1) usuário.
- Um **projeto** gera (1,N) diagnósticos; cada diagnóstico é de (1,1) projeto.
- Um **diagnóstico** referencia (0,1) modalidade principal e (0,1) licença de hardware e (0,1) de software nos catálogos.
- Uma **prova de autoria** pertence a (0,1) usuário e vem de (0,1) projeto — é opcional porque os 15 itens do acervo ilustrativo não pertencem a ninguém.

---

## 2. Fluxograma do Motor de Decisão Multicritério (Camadas A a F)

```mermaid
flowchart TD
    A["Entrada: Relato Livre ou Arquitetura Técnica do Projeto"] --> D["Camada D: Recomendar Registro de Marca no INPI (Art. 129 LPI — Caso Arduino)"]
    A --> B{"Camada F: Avaliação de Novidade e Divulgação Prévia"}
    B -->|"Publicação Defensiva ou Divulgado > 12m"| B1["Estado da Técnica (Art. 11 LPI): Escudo contra Patentes Alheias"]
    B -->|"Divulgado < 12m no YouTube/TCC"| B2["Alerta: Acionar Período de Graça de 12 Meses (Art. 12 LPI)"]
    B -->|"Solução Inédita / Efeito Físico (Art. 10, V)"| C["Recomendar Patente de Invenção (PI - Art. 8º LPI - 20 anos)"]
    B -->|"Nova Disposição com Melhoria Funcional"| M["Recomendar Modelo de Utilidade (MU - Art. 9º LPI - 15 anos)"]

    A --> F{"Camadas A, B, C e E: Ativos Físicos e Intelectuais"}
    F -->|"Camada A: Esquemático/PCB"| FA["Tutela Gráfica Lei 9.610/98 (Alerta: Não Impede Engenharia Reversa Limpa)"]
    F -->|"Camada B: Design Externo"| FB["Recomendar Desenho Industrial (DI - 10 a 25 anos)"]
    F -->|"Camada C: Microchip/Silício"| FC["Recomendar Topografia de Chip (Lei 11.484/07 - 10 anos + PADIS)"]
    F -->|"Camada E: Firmware Autoral"| FE["Recomendar e-Software INPI (Lei 9.609/98 - 50 anos - Art. 4º)"]

    A --> I{"Auditoria de Licenças Livres e Titularidade (NIT/ICT)"}
    I -->|"Usa GPLv3 + Quer Fechar Firmware"| J["CRÍTICO: Violação de Copyleft Forte e Cláusula Anti-Tivoização"]
    I -->|"Usa CERN-OHL-S / CC BY-SA + Quer Fechar PCB"| L["CRÍTICO: Reciprocidade Forte Exige Abrir CAD/Gerber/BOM"]
    I -->|"Vínculo com ICT / Universidade"| K["ATENÇÃO: Competência do NIT (Lei 10.973/04 e Lei 13.243/16)"]

    D & B1 & B2 & C & M & FA & FB & FC & FE & J & L & K --> N["Parecer Multicamada + Busca de Anterioridade + Certificado de Autoria SHA-512"]
```
