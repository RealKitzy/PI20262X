# Observatório de Propriedade Intelectual e Hardware Aberto

**Disciplina:** 20262SI235N - Projeto Integrador: Informática e Legislação  
**Tema:** Projeto 3 - Observatório de Propriedade Intelectual e Hardware Aberto  

**Integrantes da Equipe:**
- Antonio Kayky Gonçalves Vieira
- Giullian Bernard Alencar Maia
- Ítalo Brito da Costa
- Luís Aquiles Lucena Sá

---

## Sobre o Projeto

Este repositório contém o sistema desenvolvido pelo nosso grupo para o Projeto Integrador. O objetivo do site é ajudar estudantes, makers e desenvolvedores de hardware/IoT a entenderem como proteger seus projetos no Brasil (INPI, ANATEL e LGPD) e verificar se a ideia ou marca já possui registro cadastrado na base.

O sistema analisa o projeto dividindo o hardware em **6 camadas (A até F)**, conforme estudamos na disciplina:
- **Camada A (Documentação Técnica):** esquemáticos elétricos e arquivos de PCB (Lei de Direito Autoral nº 9.610/98).
- **Camada B (Design do Produto):** formato externo e carenagem/gabinete 3D (Desenho Industrial - Lei nº 9.279/96).
- **Camada C (Semicondutores):** topografia de circuito integrado / chips (Lei nº 11.484/07).
- **Camada D (Marca):** nome do projeto e logotipo no INPI (Lei da Propriedade Industrial nº 9.279/96).
- **Camada E (Software Embarcado):** código-fonte e firmware gravado no microcontrolador (Lei do Software nº 9.609/98).
- **Camada F (Solução Técnica):** patente de invenção ou modelo de utilidade (Lei nº 9.279/96).

---

## O que tem no sistema

- **Fluxo Guiado em 3 Blocos (Etapa 01):**
  - **Bloco 1 (Identificação do Titular e Marca):** validação de nome e CPF/CNPJ (11 a 14 dígitos reais).
  - **Bloco 2 (Descrição Técnica do Projeto):** possui validação em tempo real de **4 quesitos técnicos obrigatórios** (Art. 24 da LPI) para bloquear cadastros vazios, palavrões, letras aleatórias ou frases sem relação com hardware/IoT/software.
  - **Bloco 3 (Conferência Automática das Leis):** mostra as camadas jurídicas, normas da ANATEL e LGPD detectadas automaticamente a partir da descrição.
- **Busca de Anterioridade e Registro de Titularidade (Etapa 02):** verifica no banco de dados e em bases públicas (OpenAlex e GitHub) se o projeto ou marca já foi cadastrado antes, gera um protocolo com hash SHA-512 e orienta sobre o depósito oficial no INPI.
- **Gerador de Documentos (Etapa 03):** monta o Certificado de Titularidade SHA-512, contratos de cessão/licenciamento (CERN-OHL, MIT, GPL) e o dossiê técnico para o INPI, com opção de imprimir em PDF ou baixar em `.doc`.

---

## Estrutura de Pastas

```text
observatorio-pi-hardware/
├── index.html                  # Página principal do sistema
├── Dockerfile                  # Configuração para deploy no Railway (PHP 8.2)
├── railway.json                # Configuração de inicialização no Railway
├── assets/
│   ├── css/styles.css          # Estilização das páginas e tema escuro/laranja
│   ├── img/                    # Imagens e ícones usados na interface
│   └── js/app.js               # Lógica do formulário, validações e geração dos relatórios
├── api/
│   ├── anterioridade.php       # Verificação de projetos existentes e gravação de protocolo
│   ├── diagnostico.php         # Processamento do enquadramento legal no backend
│   └── minuta.php              # Salvamento das minutas geradas
├── config/
│   └── database.php            # Conexão com o banco SQLite (criado automaticamente) ou MySQL
├── database/
│   └── schema.sql              # Tabelas do banco de dados e registros iniciais
└── docs/
    ├── MODELAGEM_DER_E_REGRAS.md
    └── ARTIGO_CIENTIFICO_BASE.md
```

---

## Como Rodar o Projeto

### Localmente (PHP)
Na pasta raiz do projeto, rode no terminal:
```bash
php -S localhost:8000
```
Depois, abra `http://localhost:8000` no navegador. O banco SQLite (`database/observatorio_pi.sqlite`) é criado sozinho na primeira vez que a API é chamada.

### Hospedagem (Railway)
O projeto já está configurado com `Dockerfile` e `railway.json` para rodar direto no **Railway** conectado ao repositório do GitHub, subindo o container `php:8.2-cli-alpine` na porta dinâmica do servidor (`php -S 0.0.0.0:${PORT:-8080}`).
