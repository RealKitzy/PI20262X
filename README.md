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
- **Busca de Anterioridade e Prova de Autoria (Etapa 02):**
  - Compara o projeto com a **base do Observatório** (registros feitos por usuários + um **acervo de referência ilustrativo** com 15 produtos conhecidos — esses itens são exemplos didáticos e **não** são registros oficiais do INPI).
  - Consulta **de verdade** a **OpenAlex** (artigos científicos) e o **GitHub** (repositórios). Cada resultado recebe uma nota de relevância (% dos termos técnicos encontrados) e só conta como anterioridade a partir de **60%**.
  - **Patentes:** consulta real no **EPO – Open Patent Services** (mesma base do Espacenet, cobre o mundo todo, inclusive documentos brasileiros BR), via `api/patentes.php`. Precisa de chave gratuita (veja "Ativar a busca de patentes" abaixo); sem chave, as patentes ficam como links diretos. O pePI/INPI continua só como link, porque o INPI não tem API pública de busca.
  - Se uma base falhar, a tela mostra "indisponível" ou "limite atingido" — o sistema **nunca** preenche resultados inventados.
  - **Rigor da varredura:** Rápida (10 resultados/base, 1 consulta), Padrão (25 resultados/base, 3 consultas) e Profunda (50 resultados/base, 6 consultas). A barra de progresso acompanha as consultas reais; o GitHub sem autenticação aceita 10 buscas por minuto, por isso há pausas entre consultas.
- **Certificado de Autoria SHA-512:** gera um arquivo `.txt` com o hash SHA-512 real do projeto e um protocolo interno do Observatório (não substitui o depósito no INPI). A página também pode ser impressa/salva em PDF.

---

## Estrutura de Pastas

```text
observatorio-pi-hardware/
├── index.html                  # Página principal do sistema
├── Dockerfile                  # Configuração para deploy no Railway (PHP 8.2)
├── nixpacks.toml               # Alternativa de build (Nixpacks)
├── railway.json                # Configuração de inicialização no Railway
├── assets/
│   ├── css/styles.css          # Estilização das páginas e tema escuro/laranja
│   ├── img/                    # Imagens e ícones usados na interface
│   └── js/app.js               # Lógica do formulário, validações e geração dos relatórios
├── api/
│   ├── anterioridade.php       # Comparação com a base do Observatório e gravação do protocolo interno
│   ├── patentes.php            # Busca real de patentes no EPO OPS (chave em variável de ambiente)
│   └── diagnostico.php         # Processamento do enquadramento legal no backend
├── config/
│   └── database.php            # Conexão com o banco SQLite (criado automaticamente) ou MySQL
├── database/
│   └── schema.sql              # 6 tabelas do banco (ver docs/der) e registros iniciais
└── docs/
    ├── MODELAGEM_DER_E_REGRAS.md
    ├── ARTIGO_CIENTIFICO_BASE.md
    ├── CORRECOES_AUDITORIA.md  # O que foi corrigido em relação à auditoria
    ├── der/                    # DER conceitual e lógico (PDF, SVG, PNG) + dicionário de dados
    └── telas/                  # Telas do sistema (PDF, SVG editável para Figma e PNG)
```

---

## Como Rodar o Projeto

### Localmente (PHP)
Na pasta raiz do projeto, rode no terminal:
```bash
php -S localhost:8000 router.php
```
Depois, abra `http://localhost:8000` no navegador. O banco SQLite (`database/observatorio_pi.sqlite`) é criado sozinho na primeira vez que a API é chamada.

### Ativar a busca de patentes (EPO – gratuito)
1. Crie uma conta em **developers.epo.org** (gratuita, sem cartão).
2. No portal, vá em **My Apps → Add a new App**, dê um nome (ex.: `observatorio-pi`) e marque o produto **OPS v3.2**.
3. Copie a **Consumer Key** e o **Consumer Secret** do app criado.
4. No Railway, abra o serviço → aba **Variables** e crie:
   - `EPO_OPS_KEY` = Consumer Key
   - `EPO_OPS_SECRET` = Consumer Secret
5. O Railway refaz o deploy sozinho. No modal da verificação, o card "Patentes (EPO / Espacenet)" passa de "Apenas link" para "consultado".

Para testar localmente: `EPO_OPS_KEY=... EPO_OPS_SECRET=... php -S localhost:8000 router.php`.
As chaves ficam só no servidor (nunca vão para o navegador), e buscas repetidas são guardadas por 24 h para economizar a cota gratuita.

### Hospedagem (Railway)
O projeto já está configurado com `Dockerfile` e `railway.json` para rodar direto no **Railway** conectado ao repositório do GitHub, subindo o container `php:8.2-cli-alpine` na porta dinâmica do servidor (`php -S 0.0.0.0:${PORT:-8080} ... router.php`). O `router.php` garante que só a página, `assets/` e `api/` fiquem acessíveis pela internet (o banco de dados e a configuração não podem ser baixados).

**Para não perder os registros a cada deploy:** por padrão o banco SQLite fica dentro do container e é apagado quando o Railway faz um novo deploy. Para manter as provas de autoria gravadas:
1. No projeto do Railway, crie um **Volume** ligado ao serviço com o caminho de montagem `/data`.
2. Na aba **Variables** do serviço, crie `SQLITE_PATH` = `/data/observatorio_pi.sqlite`.
