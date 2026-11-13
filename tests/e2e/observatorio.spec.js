// Testes automáticos do Observatório de PI e Hardware Aberto.
// Rodam no GitHub Actions a cada envio do código (veja tests/LEIAME.md).
const { test, expect } = require('@playwright/test');
const fs = require('fs');

const PUBLICADO = Boolean((process.env.BASE_URL || '').trim());
const so_local = PUBLICADO ? 'Só roda no teste do código (grava dados ou depende do EPO simulado)' : '';

// CPFs válidos usados só nos testes
const CPF_A = '529.982.247-25';
const CPF_B = '111.444.777-35';

const QUEDA = 'Pulseira com acelerômetro que detecta queda de idoso e envia alerta sem fio para o celular do cuidador.';
const COLEIRA = 'Coleira para cães e gatos com receptor GPS, LTE e Bluetooth BLE para rastreamento de localização e sinais vitais do animal em tempo real.';
const IRRIGACAO = 'Sensor de umidade do solo com ESP32 e LoRa que aciona válvulas de irrigação automaticamente na lavoura, com gabinete impermeável impresso em 3D.';

// ---------------------------------------------------------------------------
// Preparação de cada teste: OpenAlex e GitHub simulados (no teste do código),
// alertas registrados e erros de JavaScript da página guardados.
// ---------------------------------------------------------------------------
test.beforeEach(async ({ page }, testInfo) => {
    page.alertas = [];
    page.errosJs = [];
    page.on('dialog', d => { page.alertas.push(d.message()); d.dismiss().catch(() => {}); });
    page.on('pageerror', e => page.errosJs.push(e.message));
    await page.route('https://fonts.googleapis.com/**', r => r.abort());
    await page.route('https://fonts.gstatic.com/**', r => r.abort());

    if (!PUBLICADO) {
        await page.addInitScript(() => { window.__TESTE_INTERVALO_GITHUB_MS = 0; });
        await page.route('https://api.openalex.org/**', r => r.fulfill({
            contentType: 'application/json',
            body: JSON.stringify({ results: [
                { id: 'https://openalex.org/W1', display_name: 'Wearable fall detection for elderly people using accelerometers and wireless alerts', publication_year: 2016, abstract_inverted_index: { wrist: [0], caregiver: [1] } },
                { id: 'https://openalex.org/W2', display_name: 'A survey of deep learning', publication_year: 2020 },
            ] }),
        }));
        await page.route('https://api.github.com/**', r => r.fulfill({
            contentType: 'application/json',
            body: JSON.stringify({ items: [
                { full_name: 'exemplo/fall-detector', name: 'fall-detector', html_url: 'https://github.com/exemplo/fall-detector', description: 'ESP32 fall detection wristband for elderly with accelerometer', stargazers_count: 12, created_at: '2021-03-01', topics: ['iot'] },
            ] }),
        }));
    }
});

test.afterEach(async ({ page }) => {
    // Nenhum teste pode terminar com erro de JavaScript na página
    expect(page.errosJs, 'erros de JavaScript na página').toEqual([]);
});

// ---------------------------------------------------------------------------
// Funções de apoio
// ---------------------------------------------------------------------------
async function preencherBloco1(page, { nome = 'Senpu', titular = 'Maria da Silva', cpf = CPF_A, email = 'maria@exemplo.com.br' } = {}) {
    await page.goto('/');
    await page.fill('#nome_projeto', nome);
    await page.fill('#autor_nome', titular);
    await page.fill('#autor_documento', cpf);
    await page.fill('#autor_email', email);
    await page.click('#rodape-bloco-1-usuario button');
    await expect(page.locator('#relato_livre_usuario')).toBeVisible();
}

async function verificar(page, descricao) {
    await page.fill('#relato_livre_usuario', descricao);
    await expect(page.locator('#badge-status-qualificacao')).toHaveText(/4 de 4/);
    await page.click('#btn-verificar-bloco2');
    await expect(page.locator('#modal-verificacao-progresso')).toHaveClass(/ativo/);
    await expect(page.locator('#aba-relatorio')).toHaveClass(/active/, { timeout: PUBLICADO ? 5 * 60 * 1000 : 60 * 1000 });
}

const veredito = page => page.locator('#painel-resumo-leigo-direto .verdict-topo h3');

// ===========================================================================
test.describe('1. Segurança do servidor', () => {
    test('arquivos privados não podem ser baixados', async ({ request }) => {
        // Antes, confere se o site está no ar (senão tudo daria 404 e o teste passaria sem querer)
        expect((await request.get('/')).status(), 'a página principal precisa abrir — confira o endereço do site').toBe(200);
        for (const caminho of ['/database/schema.sql', '/database/observatorio_pi.sqlite', '/config/database.php',
            '/router.php', '/README.md', '/Dockerfile', '/tests/package.json', '/docs/CORRECOES_AUDITORIA.md']) {
            const r = await request.get(caminho);
            expect(r.status(), caminho).toBe(404);
        }
    });

    test('a página e os arquivos públicos abrem', async ({ request }) => {
        for (const caminho of ['/', '/assets/js/app.js', '/assets/js/vocabulario.js', '/assets/css/styles.css', '/assets/img/logo.svg']) {
            const r = await request.get(caminho);
            expect(r.status(), caminho).toBe(200);
        }
    });

    test('a busca de patentes recusa parâmetros inválidos', async ({ request }) => {
        expect((await request.get('/api/patentes.php')).status()).toBe(400);
        expect((await (await request.get('/api/patentes.php?q=fall&cip=G08B%20or%201')).json()).sucesso).toBe(false);
        expect((await (await request.get('/api/patentes.php?q=fall&pais=BRA')).json()).sucesso).toBe(false);
    });

    test('a API de anterioridade recusa dados inválidos e não mostra CPF completo', async ({ request }) => {
        const invalido = await request.post('/api/anterioridade.php', { data: '{json quebrado', headers: { 'Content-Type': 'application/json' } });
        expect((await invalido.json()).sucesso).toBe(false);
        const lista = await (await request.get('/api/anterioridade.php')).json();
        const docs = (lista.registros_fixos || []).map(r => String(r.titular_documento || ''));
        for (const d of docs) expect(d, 'documento na lista pública').not.toMatch(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/);
    });
});

// ===========================================================================
test.describe('2. Cadastro (Bloco 1)', () => {
    test('campos vazios mostram aviso e não avançam', async ({ page }) => {
        await page.goto('/');
        await page.click('#rodape-bloco-1-usuario button');
        expect(page.alertas.pop(), 'deveria aparecer o aviso de campos vazios').toContain('Preencha todos os campos');
        await expect(page.locator('#relato_livre_usuario')).toBeHidden();
    });

    test('CPF repetido (111.111.111-11) é recusado', async ({ page }) => {
        await page.goto('/');
        await page.fill('#nome_projeto', 'Senpu');
        await page.fill('#autor_nome', 'Maria da Silva');
        await page.fill('#autor_documento', '111.111.111-11');
        await page.fill('#autor_email', 'maria@exemplo.com.br');
        await page.click('#rodape-bloco-1-usuario button');
        expect(page.alertas.pop(), 'deveria aparecer o aviso de CPF inválido').toContain('CPF ou CNPJ inválido');
    });

    test('Enter no formulário avança para a descrição', async ({ page }) => {
        await page.goto('/');
        await page.fill('#nome_projeto', 'Senpu');
        await page.fill('#autor_nome', 'Maria da Silva');
        await page.fill('#autor_documento', CPF_A);
        await page.fill('#autor_email', 'maria@exemplo.com.br');
        await page.press('#autor_email', 'Enter');
        await expect(page.locator('#relato_livre_usuario')).toBeVisible();
    });
});

// ===========================================================================
test.describe('3. Descrição (Bloco 2)', () => {
    test('texto aleatório é recusado e a busca não começa', async ({ page }) => {
        await preencherBloco1(page);
        await page.fill('#relato_livre_usuario', 'asdfgh qwerty teste blabla');
        await page.click('#btn-verificar-bloco2');
        expect(page.alertas.pop(), 'texto aleatório deveria ser recusado com um aviso').toContain('A descrição ainda não está completa');
        await expect(page.locator('#modal-verificacao-progresso'), 'a busca não deveria começar').not.toHaveClass(/ativo/);
    });

    test('descrição curta mostra quantas palavras faltam', async ({ page }) => {
        await preencherBloco1(page);
        await page.fill('#relato_livre_usuario', 'Uma pulseira bonita.');
        await expect(page.locator('#msg-detalhe-qualificacao')).toContainText('Descrição muito curta');
        await page.click('#btn-verificar-bloco2');
        expect(page.alertas.pop(), 'descrição curta deveria ser recusada com um aviso').toContain('Descrição muito curta');
    });

    test('descrição completa marca os 4 itens', async ({ page }) => {
        await preencherBloco1(page);
        await page.fill('#relato_livre_usuario', QUEDA);
        await expect(page.locator('#badge-status-qualificacao')).toHaveText(/4 de 4/);
        await expect(page.locator('.quesito.ok')).toHaveCount(4);
    });
});

// ===========================================================================
test.describe('4. Termos de busca e classe CIP (sem internet)', () => {
    const casos = [
        { texto: QUEDA, termos: ['fall', 'elderly'], cip: 'G08B 21/04' },
        { texto: 'Detector de fumaça sem fio conectado ao Wi-Fi que envia alerta para o celular.', termos: ['smoke', 'detector'], cip: 'G08B 17/10' },
        { texto: 'Campainha com câmera e Wi-Fi que envia vídeo do visitante para o celular.', termos: ['doorbell', 'camera'], cip: 'H04N 7/186' },
        { texto: 'Impressora 3D que deposita filamento derretido camada por camada.', termos: ['printer', 'filament'], cip: 'B29C 64/118' },
        { texto: 'Sensor lidar giratório com vários lasers para mapear o ambiente em 3D.', termos: ['lidar', 'rotating'], cip: 'G01S 17/89' },
        { texto: IRRIGACAO, termos: ['soil', 'moisture'], cip: 'A01G 25/16' },
        { texto: COLEIRA, termos: ['collar', 'dog'], cip: 'A01K 29/00' },
    ];
    for (const c of casos) {
        test(`"${c.texto.slice(0, 40)}…" → ${c.termos.join(' ')} / ${c.cip}`, async ({ page }) => {
            await page.goto('/');
            const r = await page.evaluate(texto => {
                const dados = { nome_projeto: 'Senpu', resumo_tecnico: texto, linguagem_firmware: 'C++', palavras_chave_extra: '' };
                return {
                    ingles: montarTermosDeBusca(dados).ingles,
                    cip: gerarCorrelacaoPatentariaReal(dados, {}).codigos_cip[0].split(' (')[0],
                };
            }, c.texto);
            expect(r.ingles.slice(0, 2), 'dois primeiros termos da busca').toEqual(c.termos);
            expect(r.cip, 'classe CIP principal').toBe(c.cip);
        });
    }

    test('o nome do projeto não entra na frente da descrição', async ({ page }) => {
        await page.goto('/');
        const termos = await page.evaluate(() => montarTermosDeBusca({ nome_projeto: 'sent luz', resumo_tecnico: 'Detector de fumaça sem fio conectado ao Wi-Fi que envia alerta para o celular.' }).ingles);
        expect(termos.slice(0, 4)).not.toContain('light');
    });
});

// ===========================================================================
test.describe('5. Verificação completa e relatório', () => {
    test('queda de idoso: encontra patentes e mostra os mais parecidos', async ({ page }) => {
        await preencherBloco1(page, { nome: PUBLICADO ? 'Robo Verificador' : 'Senpu' });
        await verificar(page, QUEDA);
        await expect(page.locator('#chip-status-nlp')).toContainText('G08B 21/04');
        await expect(veredito(page)).toBeVisible();
        await expect(page.locator('.verdict-numeros')).toContainText('do mesmo tema');
        if (!PUBLICADO) {
            await expect(veredito(page)).toHaveText('Encontramos projetos que fazem o mesmo que o seu');
            await expect(page.locator('.destaque-card')).toHaveCount(3);
            await expect(page.locator('#painel-anterioridade-mundial')).toContainText('US 8217795 B2');
            // Camada B não pode ser marcada sem carcaça na descrição
            await expect(page.locator('.check-item', { hasText: 'Carcaça Externa' })).toContainText('Não se aplica');
        }
    });

    test('gravar a prova de autoria mantém o resultado e gera o certificado', async ({ page }) => {
        test.skip(PUBLICADO, so_local);
        await preencherBloco1(page, { nome: 'Senpu Dois' });
        await verificar(page, QUEDA);
        const antes = await veredito(page).innerText();
        await page.click('.cta-bar button:has-text("Gravar prova de autoria")');
        await expect(page.locator('#painel-veredito-apropriacao')).toContainText('Prova de autoria gravada');
        await expect(veredito(page), 'o resultado não pode mudar depois de gravar').toHaveText(antes);
        await expect(page.locator('.cta-bar button')).toHaveText(['Baixar certificado']);

        const [download] = await Promise.all([page.waitForEvent('download'), page.click('.cta-bar button:has-text("Baixar certificado")')]);
        expect(download.suggestedFilename()).toMatch(/^Certificado_Autoria_SHA512_.*\.txt$/);
        const texto = fs.readFileSync(await download.path(), 'utf8');
        expect(texto).toContain('4. BUSCA MUNDIAL DE ANTERIORIDADE');
        expect(texto).toContain('Fazem o mesmo (todos os termos principais)');
        expect(texto).toContain(CPF_A);
        expect(texto).toMatch(/[0-9a-f]{128}/);
        expect(texto).not.toMatch(/&(quot|amp|lt|gt|#39);|<strong>/);

        // A lista pública da base mostra o CPF mascarado (LGPD)
        const lista = await (await page.request.get('/api/anterioridade.php')).json();
        const meu = (lista.registros_fixos || []).find(r => r.nome_criacao_marca === 'Senpu Dois');
        expect(meu, 'registro gravado aparece na base').toBeTruthy();
        expect(meu.titular_documento).toBe('***.982.247-**');
    });

    test('outro titular não consegue gravar o mesmo projeto', async ({ page }) => {
        test.skip(PUBLICADO, so_local);
        await preencherBloco1(page, { nome: 'Pulsometro Alfa', cpf: CPF_A });
        await verificar(page, IRRIGACAO);
        await page.click('.cta-bar button:has-text("Gravar prova de autoria")');
        await expect(page.locator('#painel-veredito-apropriacao')).toContainText('Prova de autoria gravada');

        await preencherBloco1(page, { nome: 'Pulsometro Alfa', titular: 'Joao Pereira', cpf: CPF_B, email: 'joao@exemplo.com.br' });
        await verificar(page, IRRIGACAO);
        await expect(veredito(page), 'o segundo titular deveria ver a colisão').toHaveText('Já existe um projeto muito parecido na base do Observatório');
        await expect(page.locator('#btn-registrar-titularidade-fixa'), 'a gravação deveria ficar bloqueada').toBeDisabled();
    });

    test('produto conhecido do acervo avisa, mas não bloqueia a gravação', async ({ page }) => {
        test.skip(PUBLICADO, so_local);
        await preencherBloco1(page, { nome: 'Zumbi Pet' });
        await verificar(page, COLEIRA);
        await expect(page.locator('#painel-resumo-leigo-direto')).toContainText('produto conhecido do mercado');
        await expect(page.locator('#btn-registrar-titularidade-fixa'), 'produto do acervo não pode bloquear a gravação').toBeEnabled();
    });

    test('irrigação com gabinete: Camada B pode ser protegida', async ({ page }) => {
        test.skip(PUBLICADO, so_local);
        await preencherBloco1(page, { nome: 'AgroNode' });
        await verificar(page, IRRIGACAO);
        await expect(page.locator('#chip-status-nlp')).toContainText('A01G 25/16');
        await expect(page.locator('.check-item', { hasText: 'Carcaça Externa' })).toContainText('Pode proteger');
    });
});

// ===========================================================================
test.describe('6. Visual', () => {
    test('o botão de tema alterna claro/escuro e lembra a escolha', async ({ page }) => {
        await page.goto('/');
        const temaInicial = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || 'light');
        await page.click('#botao-tema');
        const temaNovo = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
        expect(temaNovo).not.toBe(temaInicial);
        await page.reload();
        expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(temaNovo);
    });

    test('no celular a página não tem rolagem para o lado', async ({ browser }) => {
        const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
        const page = await ctx.newPage();
        await page.route('https://fonts.googleapis.com/**', r => r.abort());
        await page.goto('/');
        const sobra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(sobra).toBeLessThanOrEqual(1);
        await ctx.close();
    });

    test('na impressão o relatório não fica invisível', async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => { etapaAbaLiberadaUsuario = 2; alternarAba('aba-relatorio'); });
        await page.emulateMedia({ media: 'print' });
        // Na impressão a animação de entrada (que começa com opacidade 0) precisa estar desligada
        const estilo = await page.evaluate(() => {
            const cs = getComputedStyle(document.querySelector('#aba-relatorio'));
            return { animacao: cs.animationName, opacidade: Number(cs.opacity), exibicao: cs.display };
        });
        expect(estilo).toEqual({ animacao: 'none', opacidade: 1, exibicao: 'block' });
    });
});

// ===========================================================================
test.describe('7. Textos jurídicos corrigidos', () => {
    test('as correções das leis citadas continuam no site', async ({ request }) => {
        const js = await (await request.get('/assets/js/app.js')).text();
        expect(js, 'prazo de graça do desenho industrial (180 dias, Art. 96, § 3º)').toContain('180 dias (Art. 96, § 3º da LPI)');
        expect(js, 'Art. 50 trata de patente concedida').toContain('pode ser anulada (Art. 50, II da LPI)');
        expect(js, 'texto antigo e incorreto').not.toContain('nulo de pleno direito');
        expect(js, 'Lei 11.484/2007').not.toContain('Arts. 26 a 55');
        expect(js, 'botão antigo').not.toContain('Reivindicar e Fixar Criação em Meu Nome');
        const html = await (await request.get('/')).text();
        expect(html, 'citação do Art. 7º, X da Lei 9.610/98 na página').not.toContain('Art. 7º, inciso XI');
    });
});
