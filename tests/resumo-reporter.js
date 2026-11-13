// Gera um resumo em português (✓ / ✗ por teste). No GitHub Actions, o resumo aparece na página da execução.
const fs = require('fs');

class ResumoReporter {
    constructor() {
        this.linhas = [];
        this.inicio = Date.now();
    }

    onTestEnd(test, result) {
        const titulo = test.titlePath().slice(3).join(' › ');
        const status = result.status === 'passed' ? '✓ passou'
            : result.status === 'skipped' ? '– não se aplica'
            : '✗ falhou';
        const erro = result.status === 'failed' || result.status === 'timedOut'
            ? String((result.error && result.error.message) || result.status).split('\n')[0].replace(/\x1b\[[0-9;]*m/g, '').slice(0, 220)
            : '';
        // Se um teste for repetido (retry), vale o último resultado
        this.linhas = this.linhas.filter(l => l.titulo !== titulo);
        this.linhas.push({ titulo, status, erro, segundos: (result.duration / 1000).toFixed(1) });
    }

    onEnd(result) {
        const passou = this.linhas.filter(l => l.status.startsWith('✓')).length;
        const falhou = this.linhas.filter(l => l.status.startsWith('✗')).length;
        const pulou = this.linhas.filter(l => l.status.startsWith('–')).length;
        const alvo = process.env.BASE_URL ? `site publicado (${process.env.BASE_URL})` : 'código do repositório (site local com EPO simulado)';
        const md = [
            `## ${falhou === 0 ? '✅' : '❌'} Testes do Observatório`,
            '',
            `**O que foi testado:** ${alvo}`,
            '',
            `**${passou}** passaram · **${falhou}** falharam · **${pulou}** não se aplicam · ${((Date.now() - this.inicio) / 1000).toFixed(0)} s`,
            '',
            '| Teste | Resultado | Tempo | Detalhe |',
            '|---|---|---|---|',
            ...this.linhas.map(l => `| ${l.titulo} | ${l.status} | ${l.segundos} s | ${l.erro.replace(/\|/g, '/')} |`),
            '',
            falhou > 0 ? 'Abra o artefato **relatorio-dos-testes** (no fim desta página) para ver prints e o passo a passo de cada falha.' : '',
        ].join('\n');

        const arquivoResumo = process.env.GITHUB_STEP_SUMMARY;
        if (arquivoResumo) fs.appendFileSync(arquivoResumo, md + '\n');
        console.log('\n' + md.replace(/\*\*/g, ''));
    }
}

module.exports = ResumoReporter;
