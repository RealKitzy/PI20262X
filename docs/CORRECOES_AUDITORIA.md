# Correções aplicadas a partir da Auditoria Técnica (10/11/2026)

| # | Item do plano | O que foi feito |
|---|---|---|
| 1 | Remover patentes e artigos inventados | Removidos os dados de reserva do USPTO e da OpenAlex. Se uma API falha, a tela mostra "indisponível" e avisa que a busca ficou incompleta. |
| 2 | Trocar o USPTO desativado | A chamada ao PatentsView foi removida. Patentes ficam como links diretos (pePI/INPI, Google Patents com a classe CIP sugerida e Espacenet), com aviso de que não há consulta automática. |
| 3 | Rótulos verdadeiros | Os 15 itens do acervo agora se chamam `REF-ILUSTR-01` a `15` e aparecem como "Acervo de referência (ilustrativo)". Saíram os protocolos, CNPJs, datas e números de patente não verificados. Os hashes desses itens agora são SHA-512 reais do nome e do resumo. A coluna "Protocolo Oficial" virou "Identificador". Cada base no modal mostra o status real: consultado, indisponível, limite atingido ou apenas link. |
| 4 | CPF e e-mail fictícios | O preenchimento automático foi removido. Se o Bloco 1 estiver inválido, a verificação é bloqueada e o campo é destacado. |
| 5 | Tempo da varredura | O seletor agora define o rigor real (Rápida 10/1, Padrão 25/3, Profunda 50/6 = resultados por base / consultas). A barra acompanha as consultas reais. Há pausas entre consultas do GitHub por causa do limite de 10 por minuto. O botão "Pular espera" virou "Encerrar e usar os resultados já obtidos". |
| 6 | Similaridade | Cada resultado recebe a relevância em %, calculada pelos termos da consulta encontrados no título, resumo ou descrição. Só conta como anterioridade com ≥ 60% e pelo menos 2 termos. Os demais resultados ficam em "baixa relevância". |
| 7 | "Aprovado para registro" | O texto foi trocado por "Nenhuma anterioridade relevante encontrada nas bases consultadas", com a ressalva de que patentes não foram consultadas. Se as bases falharem, a tela mostra "Busca mundial indisponível". |
| 8 | Erros jurídicos | Art. 7º, XI → **X** da Lei 9.610/98 em todos os pontos. Vigência da marca → **Art. 133** da LPI. A taxa fixa de R$ 185,00 foi trocada por uma remissão à tabela vigente do INPI, e a tabela de custos sem uso foi removida. |
| 9 | Limpeza | Removidos os textos de "Etapa 3"/"Aba 03", o código morto (`simularTentativaCopiaTerceiro`, `inspecionarTrechoCodigo`, a barra de rolagem customizada, os modelos de contrato, `api/minuta.php` e a tabela de custos), as imagens e o CSS do tema anime. O certificado agora é baixado como `.txt`, que é o formato real do conteúdo. |

## Problemas extras encontrados durante os testes

- **Modal travado em 84%:** `renderizarRelatorioDiagnostico` escrevia em elementos que não existem mais no `index.html` (`lista-recomendacoes-inpi`, `lista-alertas-licenca`), e o erro interrompia a verificação. Esses trechos foram removidos, e a verificação agora tem tratamento de erro.
- **SHA-512 de reserva falso:** quando o WebCrypto não estava disponível, o sistema gerava um hash comum disfarçado de SHA-512. Foi substituído por uma implementação SHA-512 real, conferida com o `crypto` do Node.
- **Hash falso no certificado:** sem verificação prévia, o certificado recebia um hash inventado. Agora aparece "não gerado".
- **XSS:** títulos e descrições vindos da OpenAlex e do GitHub agora são escapados antes de entrar no HTML.
- **Barra de rolagem:** a barra nativa estava oculta e a barra customizada não existia no HTML, então a página ficava sem barra visível. A barra nativa foi restaurada.
- **Modal em telas baixas:** o modal agora rola, para o botão "Encerrar" continuar alcançável.
- **Banco já existente:** o `schema.sql` remove as linhas antigas do acervo (`origem_base = 'ACERVO_INPI_MUNDIAL'`) antes de inserir as novas.

## Acréscimo: busca real de patentes (EPO OPS)

- Novo endpoint `api/patentes.php`. Ele consulta o EPO Open Patent Services pelo servidor, com OAuth e cache do token, usando a consulta `ta all "termos"` (todos os termos no título ou resumo). Buscas repetidas ficam em cache por 24 h.
- Os termos da consulta são limpos (só letras e números) antes de montar a consulta CQL, para que ninguém consiga alterar a busca enviada ao EPO.
- Respostas tratadas: 404 = nenhum resultado; 403/429 = limite atingido ("Limite atingido" na tela); sem chave = "Apenas link".
- As patentes recebem a mesma nota de relevância das outras bases, calculada com os títulos e resumos em todos os idiomas disponíveis.
- Testado com um servidor que imita as respostas do EPO. Os testes cobriram autenticação, resultados, busca vazia, limite, tentativa de alterar a consulta e funcionamento sem chave.

## Acréscimo: novo visual

- O tema escuro com laranja neon foi trocado por um tema claro, com uma única cor de destaque, menos bordas e sem emojis.
- A Etapa 2 foi reorganizada nesta ordem: resultado principal, o que encontramos no mundo, base do Observatório e indicadores. A tabela da base e a matriz A–F agora ficam recolhidas em "Ver mais".
- Os textos digitados por usuários (nomes, titulares) agora são escapados antes de aparecer na tela, para impedir que um nome cadastrado com código seja executado no navegador de outro usuário (XSS armazenado).
- A página está ajustada para celular e para impressão em PDF.
- Novo ícone (chip com lupa, em `assets/img/logo.svg`), também usado como favicon da aba do navegador. As imagens antigas foram removidas.
- Tema claro e escuro: um botão no topo alterna entre os dois e a escolha fica salva no navegador. Sem escolha salva, o site segue o tema do sistema operacional. A impressão sempre sai no tema claro.

## Acréscimo: modelagem de dados (DER)

- O DER antigo não batia com o banco real: faltava `registros_titularidade` e mostrava duas tabelas sem uso.
- `minutas_geradas` e `regras_classificacao` foram removidas do banco (`DROP TABLE IF EXISTS` para bancos antigos).
- `usuarios.documento_cpf_cnpj` agora é único e guardado só com dígitos; uma nova verificação reaproveita o cadastro do mesmo titular.
- `registros_titularidade` ganhou `usuario_id` e `projeto_id` (chaves estrangeiras opcionais) e passou a ficar ligada ao titular e ao projeto.
- `diagnosticos_gerados` ganhou os códigos da modalidade e das licenças (chaves estrangeiras para os catálogos). Os campos de texto foram ampliados, porque alguns valores passavam do limite em MySQL/PostgreSQL.
- Bancos já existentes são atualizados automaticamente na primeira requisição (`config/database.php`).
- Novos arquivos em `docs/der/`: DER conceitual, DER lógico, dicionário de dados e decisões de modelagem, todos gerados a partir do banco real.

## Acréscimo: revisão de segurança antes da publicação

- **O banco de dados podia ser baixado pela internet.** O servidor embutido do PHP (`php -S`) entrega qualquer arquivo da pasta, então `/database/observatorio_pi.sqlite` (com CPFs e e-mails), `/config/` e `/database/schema.sql` ficavam abertos. O novo `router.php` libera só a página, `assets/` e `api/`; todo o resto responde 404. O `Dockerfile`, o `railway.json` e o `nixpacks.toml` já iniciam o servidor com o roteador.
- **CPF/CNPJ exposto na API pública.** A lista de provas de autoria (`GET /api/anterioridade.php`) devolvia o documento completo de quem gravou. Agora sai mascarado (ex.: `***.982.247-**`), em linha com a LGPD. A comparação de titularidade continua usando o valor completo, só no servidor.
- **Termos da busca de patentes:** cada termo agora tem no máximo 40 caracteres, para evitar consultas gigantes ao EPO.
- Testes feitos: entradas inválidas nas três APIs, tentativa de acessar arquivos privados (inclusive com `../`), fluxo completo com gravação e certificado, e busca de patentes com respostas simuladas do EPO.

## Acréscimo: precisão da busca em todos os assuntos

- **Vocabulário técnico novo** (`assets/js/vocabulario.js`): cerca de 560 palavras e 85 expressões em português com tradução para o inglês usado em patentes e artigos. Cobre saúde, agro, animais, casa e segurança, energia, transporte, indústria, impressão 3D, meio ambiente, educação e esporte. Antes eram cerca de 90 palavras. Plurais são reconhecidos (sensores → sensor, câmeras → câmera).
- **Expressões compostas** são lidas antes das palavras soltas: "impressora 3D", "sem fio", "umidade do solo", "cadeira de rodas", "detector de fumaça" etc.
- **Ordem dos termos por importância:** o assunto central (queda, fumaça, campainha, irrigação…) vem antes das peças (acelerômetro, câmera) e dos termos genéricos (sensor, Wi-Fi, celular). Isso importa porque o EPO e o GitHub recebem só os 3 primeiros termos. Exemplo: antes a consulta era "wristband accelerometer elderly"; agora é "fall elderly accelerometer".
- **Nome do projeto:** nomes inventados (ex.: "Senpu") não entram mais na busca. Só palavras conhecidas do nome são usadas.
- **Sinônimos na relevância:** um resultado conta o termo se usar um sinônimo (ex.: "elderly" também aceita "senior" e "older"; "drone" aceita "UAV"; "printer" aceita "additive").
- **Classe CIP por área técnica:** 55 regras (quedas, sinais vitais, fumaça, campainha, fechaduras, drones, LiDAR, impressão 3D, estacionamento, resíduos, energia solar etc.). Cada área recebe pontos pelos termos encontrados e a mais forte vira a classe principal. Comunicação sem fio (H04W 4/38) só aparece como classe secundária, porque está presente em quase todo projeto IoT.
- **EPO mais completo:**
  - Se nenhuma patente tiver os 3 termos juntos, o sistema tenta de novo com os 2 mais importantes.
  - Na primeira consulta, faz também uma busca restrita à área técnica do projeto (subclasse CIP, ex.: G08B). O parâmetro novo `cip` do `api/patentes.php` aceita apenas o formato exato da subclasse (letra, 2 números, letra).
  - O registro mostra quantas patentes existem no total para aquela consulta.
- **Campo opcional "Palavras-chave da busca"** no Bloco 2: os termos digitados ali (em inglês ou português) têm prioridade máxima na busca e entram no cálculo da classe CIP.
- Testado em 10 descrições de áreas diferentes e no fluxo completo (busca com o EPO simulado, gravação da prova de autoria e certificado).

## Acréscimo: busca "Completa" e destaque dos mais parecidos

- **Rigor padrão agora é "Profunda"** (~1 min, 50 resultados por base, 6 combinações de termos).
- **Novo rigor "Completa"** (~2 a 3 min): 100 resultados por base e 12 combinações de termos. Faz também consultas extras de patentes: a segunda área CIP mais forte do projeto e patentes brasileiras (BR). Para isso, o `api/patentes.php` aceita o parâmetro `pais`, que só aceita 2 letras (ex.: `pais=BR`). Se uma consulta extra falhar, a busca segue sem ela.
- **"Os mais parecidos com o seu projeto":** no resultado, os 3 itens mais próximos aparecem em destaque, com os termos do projeto que aparecem (✓) e os que faltam (✗), em português com o termo em inglês entre parênteses. Quando falta um termo, o texto aponta que aquilo pode ser o diferencial do projeto.
- **Patentes brasileiras em português:** patentes do Brasil costumam ter título e resumo só em português, então a busca BR (rigor Completa) é feita em inglês e também com as palavras que o usuário escreveu (ex.: "detector fumaça"). O `api/patentes.php` passou a aceitar letras com acento nos termos; aspas, espaços e sinais continuam bloqueados.

## Acréscimo: "fazem o mesmo" separado de "mesmo tema"

- O relatório separa os resultados em dois grupos:
  - **fazem o mesmo:** têm **todos** os termos principais do projeto;
  - **do mesmo tema:** têm ao menos 60% dos termos, mas não todos.
- O aviso "Encontramos projetos que fazem o mesmo que o seu" só aparece quando existe item do primeiro grupo. Se houver só itens do mesmo tema, o resultado diz "Há projetos do mesmo tema, mas nenhum igual ao seu", com a ressalva da atividade inventiva (Art. 13 da LPI).
- Palavras do nome do projeto (ex.: "luz" em "sent luz") passaram a ter a menor prioridade na busca. Antes elas podiam tirar um termo da descrição da consulta.
- Os termos em português mostrados no destaque ficaram mais precisos dentro das expressões ("detector de fumaça" → fumaça = smoke, detector = detector).

## Acréscimo: acervo de referência não bloqueia mais a gravação

- **Produtos conhecidos do acervo ilustrativo** (Fi Collar, Velodyne etc.) representam o mercado, não registros de outros usuários. Antes, uma semelhança só técnica com eles mostrava "Colisão", dava o veredito vermelho e impedia gravar a prova de autoria. Agora vira um aviso: "Parecido com um produto conhecido do mercado", a Camada F fica em "Atenção" e a gravação continua liberada. Se o **nome** do projeto copiar o nome do produto, a gravação continua bloqueada.
- Registros feitos por **outros usuários** continuam bloqueando como antes.
- O texto de colisão só cita o Art. 124, XIX (marca) quando o nome realmente colide. Antes ele aparecia sempre, mesmo com a Camada D dizendo que o nome estava livre.
- **Falso "texto aleatório" corrigido:** a verificação de teclado batido juntava todas as palavras antes de procurar consoantes seguidas. Assim, "receptor GPS, LTE" virava "receptorgpslte" e uma descrição válida era recusada. Agora a verificação é feita palavra por palavra (PHP e JS).
- **Camada B (desenho industrial) marcada sem motivo:** palavras soltas como "pulseira", "caixa", "plástico" ou "3D" (ex.: "mapear em 3D") marcavam a Camada B com o texto "você citou gabinete/carcaça própria". Agora ela só é marcada quando a descrição fala do visual do aparelho (carcaça, gabinete, invólucro, formato próprio ou anatômico, "impressa em 3D", impermeável etc.).
- **Só a verificação completa:** o seletor de rigor saiu da tela. Toda verificação usa o nível "Completa" (100 resultados por base, 12 combinações de termos, área CIP e patentes brasileiras). No lugar do seletor aparece "Verificação completa — leva de 1 a 3 min".

## Revisão geral (textos, leis citadas e funcionamento)

**Erros de funcionamento corrigidos**
- **O botão "Verificar se já existe" não exigia os 4 itens da descrição.** Um texto como "asdfgh qwerty teste" abria a busca normalmente. Agora a verificação só começa com a descrição completa; caso contrário, aparece o motivo e o que falta.
- **Depois de gravar a prova de autoria, o relatório "esquecia" a busca mundial** e o resultado podia virar "Nenhum projeto parecido". Agora o resultado da busca é mantido.
- **A gravação usava o formulário atual**, e não o que foi verificado. Se a pessoa editasse a descrição depois da busca, gravava um texto diferente do verificado. Agora grava exatamente o que foi verificado.
- **"Refazer busca"** fazia a busca mundial em segundo plano, sem barra de progresso e sem atualizar o relatório. Agora abre a verificação completa normalmente.
- **Enter no formulário** chamava um fluxo antigo (Bloco 3, que não aparece mais). Agora o Enter avança do Bloco 1 para o Bloco 2 e, no Bloco 2, inicia a verificação. O fluxo antigo (`processarDiagnostico`) e o histórico local sem tabela na página foram removidos.
- **Impressão / PDF podia sair em branco:** a animação de entrada da aba começava com opacidade 0. As animações agora ficam desligadas na impressão.
- **Armazenamento do navegador:** a leitura agora é protegida (em modo privado ou com o armazenamento bloqueado, o site não quebra mais).
- **Certificado:** ganhou a seção "Busca mundial de anterioridade", com bases consultadas, termos, classe CIP, contagens e os mais parecidos com link. Textos com marcação HTML (ex.: `&quot;`) agora saem limpos no `.txt`, e o CPF/CNPJ sai formatado.
- **Botões do resultado:** depois de gravar, o botão "Gravar prova de autoria" some e fica só "Baixar certificado". O número de itens parecidos na base passou a contar também o registro do próprio usuário, que já aparecia na lista. Os rótulos ficam no singular quando o número é 1.

**Textos e leis citadas**
- Os alertas foram reescritos em linguagem simples, sem emojis e sem jargão ("Gibberish", "Quesito 1 reprovado", "Bloco 3"). Antes, alguns traziam marcação HTML aparecendo como texto (`<strong>`, `<em>`).
- **Período de graça do Desenho Industrial:** o texto dizia que o DI também tinha 12 meses (Art. 12). O prazo do DI é de **180 dias** (Art. 96, § 3º da LPI). Corrigido.
- **"Pedido nulo de pleno direito (Arts. 24 e 50)":** o Art. 50 trata da nulidade de uma patente **concedida**. O texto agora diz que o pedido não atende ao Art. 24 e que uma patente concedida assim pode ser anulada (Art. 50, II).
- **Lei 11.484/2007:** "Arts. 26 a 55" virou "Arts. 26 e seguintes", porque a faixa citada não era exata.
- **Lei de Software:** "proteção de 50 anos via Hash SHA-512" dava a entender que o prazo vem do hash. Agora: 50 anos pelo Art. 2º, § 2º; no e-Software o código é identificado por um resumo hash.
- O texto que mandava clicar em "Reivindicar e Fixar Criação em Meu Nome" (botão que não existe mais) agora aponta para "Gravar prova de autoria".
- A instituição padrão ficou mais simples ("Desenvolvimento independente", "Universidade / ICT", "Equipe de cofundadores").
- As demais referências legais foram conferidas: LPI (Arts. 6º, 8º–13, 24, 25, 40, 88, 94, 96, 108, 124, 125, 129, 133, 189, 195), Lei 9.609/98, Lei 9.610/98 (Art. 7º, X e XII), Lei 10.973/04, LGPD (Arts. 5º, 6º, 7º, 11 e 46), LGT (Arts. 162 e 173), Res. ANATEL 715/2019, Ato ANATEL 14448/2017, RDC ANVISA 751/2022 e 657/2022, Res. INPI 158/2016 e CF/88 (Art. 5º, XXVII–XXIX).
- `README.md` e as telas em `docs/telas/` foram atualizados para o site atual.

## Acréscimo: testes automáticos (GitHub Actions)

- Nova pasta `tests/` com 27 testes de navegador (Playwright) e um EPO simulado. Rodam sozinhos no GitHub a cada envio de código (`.github/workflows/testes.yml`) e mostram uma tabela ✓/✗ em português na página da execução.
- Cobrem segurança do servidor, cadastro, descrição, termos de busca e classe CIP de 7 áreas, verificação completa, gravação da prova de autoria, certificado, colisão entre titulares, produto do acervo, tema, celular, impressão e os textos jurídicos corrigidos.
- Também podem testar o site publicado no Railway (à mão ou uma vez por dia). Nesse modo não gravam nada na base real. Instruções em `tests/LEIAME.md`.
- Para os testes ficarem rápidos, o `app.js` aceita encurtar a pausa entre consultas do GitHub (`window.__TESTE_INTERVALO_GITHUB_MS`). Isso só é usado nos testes, em que o GitHub é simulado; no site a pausa continua de 6,5 s.
- Conferido de propósito: ao desfazer três correções (descrição inválida liberada, resultado perdido após gravar), os testes falharam como esperado.

## Acréscimo: privacidade (LGPD) e proteção da novidade

- **A descrição dos projetos gravados era pública.** A tabela "Ver todos os itens da base" e a API (`GET /api/anterioridade.php`) mostravam o resumo técnico de quem gravou a prova de autoria. Para um projeto ainda não depositado no INPI, isso pode contar como divulgação e prejudicar a novidade (Art. 11 da LPI; o período de graça do Art. 12 só cobre 12 meses). Agora, nos registros de usuários, a lista pública mostra apenas nome do projeto, titular, CPF/CNPJ mascarado, modalidade e hash; a descrição aparece como "Descrição não publicada". Os itens do acervo ilustrativo continuam com o resumo.
- **O histórico de projetos avaliados era público** (`GET /api/diagnostico.php` devolvia nomes de projetos de outras pessoas). Agora essa rota devolve só os catálogos de modalidades e licenças.
- **Aviso de uso dos dados e consentimento (LGPD, Arts. 7º, I, 8º e 9º):** o Bloco 1 explica para que servem nome, CPF/CNPJ e e-mail, o que aparece publicamente, o que é enviado às bases externas (só palavras-chave) e como pedir correção ou exclusão (Art. 18). Sem marcar "Li e concordo", o cadastro não avança, e o servidor recusa salvar o diagnóstico ou gravar a prova de autoria.
- `api/diagnostico.php` tinha as mesmas duas imprecisões já corrigidas no `app.js` (prazo de graça do desenho industrial e "Arts. 26 a 55" da Lei 11.484/2007). Corrigido.
- A página ganhou uma descrição (`meta description`) para aparecer melhor em buscadores e ao ser compartilhada.
- Testes automáticos: agora são 29 (consentimento, histórico não público, gravação sem consentimento recusada e descrição não publicada).
