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
