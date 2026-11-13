// Configuração dos testes automáticos.
// - Sem BASE_URL: sobe o site localmente (php -S) com um EPO simulado e testa o código do repositório.
// - Com BASE_URL (ex.: https://seu-site.up.railway.app): testa o site publicado, com as bases reais.
const { defineConfig } = require('@playwright/test');
const path = require('path');

const BASE_URL = (process.env.BASE_URL || '').trim().replace(/\/+$/, '');
const PUBLICADO = BASE_URL !== '';
const RAIZ = path.resolve(__dirname, '..');
const PORTA_SITE = 8765;
const PORTA_EPO = 8766;

module.exports = defineConfig({
    testDir: './e2e',
    // Um teste por vez: os testes gravam e consultam o mesmo banco
    workers: 1,
    fullyParallel: false,
    retries: PUBLICADO ? 1 : 0,
    timeout: PUBLICADO ? 6 * 60 * 1000 : 90 * 1000,
    expect: { timeout: 10 * 1000 },
    reporter: [
        ['list'],
        ['html', { open: 'never', outputFolder: 'relatorio-html' }],
        ['./resumo-reporter.js'],
    ],
    outputDir: 'resultados',
    use: {
        baseURL: PUBLICADO ? BASE_URL : `http://127.0.0.1:${PORTA_SITE}`,
        viewport: { width: 1280, height: 900 },
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
        acceptDownloads: true,
        locale: 'pt-BR',
    },
    webServer: PUBLICADO ? undefined : [
        {
            // EPO simulado
            command: `php -S 127.0.0.1:${PORTA_EPO} "${path.join(__dirname, 'mock-epo', 'router.php')}"`,
            url: `http://127.0.0.1:${PORTA_EPO}/3.2/auth/accesstoken`,
            reuseExistingServer: false,
            timeout: 30 * 1000,
            stdout: 'ignore',
            stderr: 'pipe',
        },
        {
            // Site, com banco SQLite novo a cada execução
            command: `rm -rf "${path.join(__dirname, '.dados')}" && mkdir -p "${path.join(__dirname, '.dados', 'tmp')}" && php -S 127.0.0.1:${PORTA_SITE} -t "${RAIZ}" "${path.join(RAIZ, 'router.php')}"`,
            url: `http://127.0.0.1:${PORTA_SITE}/`,
            reuseExistingServer: false,
            timeout: 30 * 1000,
            stdout: 'ignore',
            stderr: 'pipe',
            env: {
                EPO_OPS_KEY: 'chave-de-teste',
                EPO_OPS_SECRET: 'segredo-de-teste',
                EPO_OPS_BASE_URL: `http://127.0.0.1:${PORTA_EPO}/3.2`,
                SQLITE_PATH: path.join(__dirname, '.dados', 'teste.sqlite'),
                TMPDIR: path.join(__dirname, '.dados', 'tmp'),
            },
        },
    ],
});
