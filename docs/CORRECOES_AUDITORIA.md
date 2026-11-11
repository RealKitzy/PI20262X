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
