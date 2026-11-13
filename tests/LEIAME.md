# Testes automáticos

Os testes abrem o site num navegador de verdade (Chromium) e fazem o que um usuário faria: preenchem o cadastro, descrevem o projeto, rodam a verificação, gravam a prova de autoria e baixam o certificado. Também conferem a segurança do servidor e os textos jurídicos.

## Onde rodam

No **GitHub Actions**, sozinhos, a cada envio de código para o GitHub. Não é preciso instalar nada.

1. Envie o código para o GitHub (inclusive a pasta `.github`).
2. Abra o repositório e clique na aba **Actions**.
3. Clique na execução mais recente de **Testes automáticos**.
4. O resumo aparece na própria página: uma tabela com ✓ (passou) ou ✗ (falhou) para cada teste.
5. Se algo falhar, baixe o artefato **relatorio-dos-testes** no fim da página. Ele traz prints e o passo a passo de cada falha (abra o `index.html` da pasta `relatorio-html`).

## Dois modos

| Modo | Quando roda | O que testa |
|---|---|---|
| **Código** (padrão) | A cada envio para o GitHub | Sobe o site dentro do GitHub com um EPO simulado e com OpenAlex e GitHub simulados. Resultados sempre iguais. Inclui os testes que gravam provas de autoria (num banco temporário, que é apagado). |
| **Site publicado** | À mão ou uma vez por dia | Testa o site do Railway com as bases reais. **Não grava** provas de autoria, para não sujar a base de verdade. |

### Testar o site publicado à mão
Aba **Actions** → **Testes automáticos** → botão **Run workflow** → cole o endereço do site (ex.: `https://seu-site.up.railway.app`) → **Run workflow**.

### Testar o site publicado todo dia (opcional)
No repositório: **Settings** → **Secrets and variables** → **Actions** → aba **Variables** → **New repository variable**:
- Nome: `SITE_URL`
- Valor: o endereço do site no Railway

## O que é testado

1. **Segurança e privacidade:** banco, configuração e documentos não podem ser baixados; as APIs recusam parâmetros inválidos; a lista pública mostra o CPF mascarado e não publica a descrição dos projetos; gravar sem consentimento (LGPD) é recusado.
2. **Cadastro:** campos vazios, CPF inválido, consentimento LGPD obrigatório e Enter no formulário.
3. **Descrição:** texto aleatório e descrição curta são recusados; descrição completa marca os 4 itens.
4. **Termos de busca e classe CIP:** 7 descrições de áreas diferentes (queda, fumaça, campainha, impressora 3D, LiDAR, irrigação, coleira) precisam gerar os termos e a classe certos.
5. **Verificação e relatório:** verificação completa, destaque dos mais parecidos, gravação da prova de autoria, certificado, colisão com outro titular, produto do acervo e Camada B.
6. **Visual:** tema claro/escuro, celular sem rolagem lateral e impressão.
7. **Textos jurídicos:** as correções das leis citadas continuam no site.

## Arquivos

- `e2e/observatorio.spec.js`: os testes.
- `mock-epo/router.php`: o EPO simulado.
- `playwright.config.js`: configuração (sobe o site e o EPO simulado no modo Código).
- `resumo-reporter.js`: gera a tabela de resumo em português.

Esta pasta não vai para o site: o `router.php` bloqueia o acesso e o `.dockerignore` a deixa fora da imagem do Railway.
