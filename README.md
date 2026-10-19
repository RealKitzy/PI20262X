# Observatório de Propriedade Intelectual e Hardware Aberto (Brasil)

**Disciplina:** 20262SI235N — Projeto Integrador: Informática e Legislação  
**Tema:** Projeto 3 — Observatório de Propriedade Intelectual e Hardware Aberto  
**Equipe ("Os Cara"):**
- Antonio Kayky Gonçalves Vieira
- Giullian Bernard Alencar Maia
- Ítalo Brito da Costa
- Luís Aquiles Lucena Sá

---

## Sobre a Plataforma

Aplicação Web de Diagnóstico Automatizado fundamentada na **Matriz de 6 Camadas do Hardware (Camadas A a F)** desenvolvida pela equipe na Entrega 1:
- **Camada A — Documentação Técnica:** Esquemáticos, leiaute de PCB e manuais (*Lei nº 9.610/1998 — LDA*, protegendo a expressão gráfica do desenho, mas não a função elétrica);
- **Camada B — Design do Produto:** Forma plástica ornamental e estética externa (*Lei nº 9.279/1996 — Desenho Industrial*, 10 a 25 anos);
- **Camada C — Semicondutores:** Configuração tridimensional das camadas do microchip (*Lei nº 11.484/2007 — Topografia de Circuito Integrado*, 10 anos + incentivos fiscais do **PADIS**);
- **Camada D — Signos Distintivos:** Nome comercial e logotipo (*Lei nº 9.279/1996 — Registro de Marca no INPI*, Art. 129 e Art. 189, 10 anos renováveis indefinidamente);
- **Camada E — Software Embarcado:** Firmware e código funcional gravado no dispositivo (*Lei nº 9.609/1998*, 50 anos, titularidade laboral no Art. 4º);
- **Camada F — Solução Técnica:** Invenção mecânica/elétrica ou processo assistido por software com efeito técnico físico (*Lei nº 9.279/1996 — Patente de Invenção* de 20 anos ou *Modelo de Utilidade* de 15 anos, superando a vedação ao software "em si" do Art. 10, V da LPI).

A plataforma opera em **3 Modos Interativos**:
1. **Modo 1 — Interpretador de Relato Livre (Linguagem Natural):** O usuário escreve seu próprio caso com suas palavras e o sistema identifica automaticamente as camadas, vínculos, prazos de divulgação (Período de Graça — Art. 12 LPI) e riscos de licença;
2. **Modo 2 — Biblioteca de 8 Cenários Prontos:** Os 4 casos reais estudados na Entrega 1 (*Arduino LLC vs. SRL*, *Waymo vs. Uber*, *Intel vs. AMD* e *Conflito em ICT/NIT*) + 4 cenários práticos cotidianos (*TCC divulgado no YouTube*, *Startup AgroTech Híbrida*, *Wearable Médico com Publicação Defensiva* e *Console Retro / Engenharia Reversa Limpa*);
3. **Modo 3 — Construtor Técnico Personalizado (+1.500 Combinações) + Inspetor Automático de Código (`SPDX`)** e **Gerador Automatizado de 4 Minutas Contratuais** exportáveis em `.DOC` e `.PDF`.

---

## Estrutura do Pacote Único de Entrega

```text
observatorio-pi-hardware/
├── index.html                        # Interface Web Responsiva (Modo Relato Livre + 8 Cenários + Matriz A-F + Minutas)
├── assets/
│   ├── css/styles.css                # Tema Laranja + Balões Mangá 2001, 100% Responsivo + Barra de Rolagem Oculta
│   ├── img/                          # Assets visuais SVG e identidade do Guia de Arquitetura
│   └── js/app.js                     # Interpretador de Linguagem Natural + Motor 6 Camadas (A-F) + Gerador de Contratos
├── api/
│   ├── diagnostico.php               # API Backend em PHP (Motor de Decisão 6 Camadas + Persistência SQL)
│   └── minuta.php                    # API Backend em PHP (Registro e Hash SHA-256 de Minutas)
├── config/
│   └── database.php                  # Conexão PDO (SQLite Zero-Config automático ou MySQL/XAMPP)
├── database/
│   └── schema.sql                    # Script SQL Completo (7 Tabelas + Seed das Camadas A-F e Licenças)
└── docs/
    ├── MODELAGEM_DER_E_REGRAS.md     # Diagrama Entidade-Relacionamento (DER) e Árvore Lógica de Decisão
    └── ARTIGO_CIENTIFICO_BASE.md     # Artigo Técnico-Científico Completo (6 a 8 páginas com 15 referências)
```

---

## Como Executar a Aplicação

A plataforma possui **Arquitetura Híbrida Resiliente**, funcionando tanto em servidor PHP+SQL quanto diretamente no navegador ou em hospedagem estática em nuvem:

### Opção 1: Com Servidor PHP + Banco de Dados SQL (XAMPP / WAMP / PHP CLI)
1. Abra o terminal na pasta `observatorio-pi-hardware` e execute:
   ```bash
   php -S localhost:8000
   ```
   *(Ou copie a pasta para `C:\xampp\htdocs\` e acesse `http://localhost/observatorio-pi-hardware`).*
2. Na primeira requisição, `config/database.php` cria e popula automaticamente o banco relacional SQLite (`database/observatorio_pi.sqlite`) a partir de `database/schema.sql`.

### Opção 2: Execução Direta no Navegador ou Deploy em Nuvem (Vercel / Netlify / GitHub Pages)
1. Basta abrir o arquivo `index.html` em qualquer navegador ou publicar a pasta na nuvem.
2. O sistema aciona automaticamente o motor espelhado em JavaScript com persistência em `localStorage`.

---

## Roteiro Sugerido para o Vídeo de Demonstração (5 Minutos)

* **0:00 – 1:00 | Contextualização e Matriz das 6 Camadas (A–F):** Apresente a interface e mostre a **Aba 04 (Matriz A–F & Jurisprudência)**, destacando como o hardware se divide nas Camadas A a F e os 4 casos reais estudados pela equipe (*Arduino*, *Gradiente vs. Apple*, *Waymo vs. Uber* e *Intel vs. AMD*).
* **1:00 – 2:15 | Demonstração do Interpretador de Relato Livre:** Na **Aba 01**, clique em um exemplo de relato em linguagem natural (ex: *"TCC divulgado no YouTube/GitHub"*) ou digite um caso ao vivo e clique em **"Interpretar Meu Caso e Gerar Diagnóstico Direto"**, mostrando como o sistema detecta o **Período de Graça de 12 meses (Art. 12 da LPI)** e o papel do **NIT (Lei 10.973/04)**.
* **2:15 – 3:30 | Simulação dos Casos da Entrega 1 (Arduino, Waymo e Conflito GPLv3):** Teste o **Caso 1 (*Arduino LLC vs. SRL*)** demonstrando a Marca (Camada D) como único vetor de exclusividade no hardware aberto, e o **Caso 4 (*Conflito em ICT*)** mostrando o bloqueio jurídico ao tentar fechar código **GPLv3** e esquemático **CERN-OHL-S**.
* **3:30 – 4:15 | Inspeção Automática de Código e Custos no INPI:** Mostre o **Inspetor Automático de Código SPDX** na Etapa 3 e a tabela de taxas oficiais (GRU com 60% de desconto) na **Aba 02**.
* **4:15 – 5:00 | Emissão Automatizada de Contratos e Modelo de Dados (DER):** Na **Aba 03**, gere os 4 instrumentos jurídicos (*Cessão de Direitos*, *Termo CERN-OHL com Reserva de Marca*, *Licenciamento B2B* e *Dossiê INPI*), exporte em `.DOC`/`.PDF` e finalize mostrando as 7 tabelas SQL na **Aba 05**.
