# Artigo Técnico-Científico Consolidado (6 a 8 Páginas — Projeto Integrador: Informática e Legislação)

**Título:**  
**Observatório de Propriedade Intelectual e Hardware Aberto: Arquitetura de um Motor de Decisão Multicamada para Diagnóstico Jurídico e Licenciamento de Sistemas Embarcados no Brasil**

**Autores:**  
* **Antonio Kayky Gonçalves Vieira**  
* **Giullian Bernard Alencar Maia**  
* **Ítalo Brito da Costa**  
* **Luís Aquiles Lucena Sá**  
*(Curso: Sistemas de Informação — Disciplina: Projeto Integrador: Informática e Legislação — 2026.2)*

---

## Resumo
O hardware aberto (*Open Source Hardware*) não possui regramento unitário nem estatuto próprio na ordem jurídica brasileira, constituindo um objeto jurídico híbrido e pluridimensional cuja tutela fragmenta-se entre diferentes ramos da Propriedade Intelectual. Este artigo apresenta a fundamentação dogmática, a modelagem de dados e a implementação tecnológica do **Observatório de Propriedade Intelectual e Hardware Aberto**, uma plataforma web desenvolvida para automatizar o diagnóstico de proteção junto ao Instituto Nacional da Propriedade Industrial (INPI) e auditar licenças livres (CERN-OHL v2, TAPR OHL, Solderpad, Creative Commons CC BY-SA, GNU GPL/LGPL e MIT). O sistema decompõe projetos de sistemas embarcados e IoT em uma **Matriz de Proteção Multicamada de seis dimensões (Camadas A a F)**, analisa a fragilidade coercitiva do *copyleft* em placas de circuito impresso, orienta estratégias de *Publicação Defensiva* (Art. 11 e 12 da Lei nº 9.279/1996) e gera minutas contratuais customizadas. A validação experimental do motor de decisão é demonstrada sobre quatro cenários baseados nos casos paradigmáticos *Arduino LLC vs. Arduino SRL*, *Gradiente vs. Apple (STF — Tema 1205)*, *Waymo vs. Uber* e *Intel vs. AMD*.

**Palavras-chave:** Propriedade Intelectual, Hardware Aberto, Sistemas Embarcados, INPI, CERN-OHL, Publicação Defensiva.

---

## 1. Introdução e Premissa Teórica
Diferentemente de um programa de computador, de um livro ou de uma composição musical — cujos elementos reduzem-se a código-fonte, letras ou acordes regidos de maneira uniforme pelo Direito Autoral —, um dispositivo de hardware é simultaneamente composto por estrutura mecânica, circuitos elétricos, microchips semicondutores, firmware embarcado, documentação técnica e signos distintivos. Na ausência de um "Código do Hardware Aberto" no Brasil, cada elemento do aparelho atrai a incidência de um diploma legal distinto, sob amparo do Artigo 5º, incisos XXVII, XXVIII e XXIX da Constituição Federal de 1988.

A premissa central fixada neste trabalho é que a natureza "aberta" do hardware deriva do exercício do direito de disposição do titular por meio de licenças de uso (negócios jurídicos contratuais celebrados no âmbito da autonomia privada), e não da inexistência de direitos sobre a criação. Para solucionar a assimetria informacional enfrentada por projetistas, startups e Núcleos de Inovação Tecnológica (NITs), desenvolveu-se uma plataforma web dotada de um motor de decisão determinístico que traduz parâmetros de engenharia em diagnósticos jurídicos e minutas contratuais.

---

## 2. Fundamentação Jurídica e Matriz Multicamada do Hardware

### 2.1. A Matriz de Proteção em Seis Camadas (A a F)
Ao analisar um dispositivo físico no Observatório de PI, o motor de decisão decompõe o ativo nas seis camadas apresentadas na Tabela 1:

| Camada | Objeto Tutelado | Regime de Proteção | Diploma Legal Aplicável |
| :--- | :--- | :--- | :--- |
| **A. Documentação Técnica** | Esquemáticos, leiaute de PCB, manuais e gráficos | Direito Autoral (Obra literária e artística) | Lei nº 9.610/1998 (LDA) e Dec. nº 75.699/1975 |
| **B. Design do Produto** | Forma ornamental e aspectos plásticos externos | Desenho Industrial (10 anos, renováveis até 25 anos) | Lei nº 9.279/1996 (LPI — Art. 94 a 121) |
| **C. Semicondutores** | Configuração tridimensional das camadas do chip | Topografia de Circuito Integrado (10 anos) | Lei nº 11.484/2007 (Institui também o PADIS) |
| **D. Signos Distintivos** | Nome comercial, marca e logotipo | Registro de Marca (10 anos, renovável indefinidamente) | Lei nº 9.279/1996 (LPI — Art. 129 e 189) |
| **E. Software Embarcado** | Firmware e código-fonte funcional | Direito Autoral (Regime especial — 50 anos) | Lei nº 9.609/1998 (Art. 4º — Titularidade Laboral) |
| **F. Solução Técnica** | Funcionalidade e invenção mecânica ou elétrica | Patente de Invenção (20 anos) ou Modelo de Utilidade (15 anos) | Lei nº 9.279/1996 (LPI — Art. 8º, 9º e 10, V) |

### 2.2. Aspectos Críticos Incorporados ao Motor de Decisão
1. **A Vedação do Software "Em Si" como Patente e a Reconfiguração do Hardware:** Nos termos do Art. 10, inciso V, da LPI, o programa de computador isolado não é considerado invenção. Contudo, processos técnicos funcionais assistidos por software que gerem efeito técnico no mundo físico (ou lógicas implementadas em portas de silício/HDL) são suscetíveis de proteção industrial.
2. **A Fragilidade Jurídica do Copyleft no Hardware:** Diferente do software, na Camada A (esquemáticos e PCB) o Direito Autoral protege apenas a expressão gráfica do desenho, e não a função técnica. Um terceiro pode recriar do zero o mesmo circuito elétrico sem copiar a representação gráfica do esquemático, afastando a incidência coercitiva das licenças *copyleft* (CERN-OHL-S, CERN-OHL-W, TAPR OHL, CC BY-SA 4.0) caso não exista patente na Camada F.
3. **Publicação Defensiva e Estado da Técnica:** A divulgação irrestrita da documentação técnica converte a solução em *Estado da Técnica* (Art. 11 da LPI), criando um escudo que impede terceiros de patentearem a invenção e cobrarem royalties futuramente, ressalvado o *Período de Graça* de 12 meses para o próprio inventor (Art. 12 da LPI).
4. **Propriedade Intelectual no Âmbito Universitário:** Regida pelo Marco Legal de CT&I (Lei nº 10.973/2004 e Lei nº 13.243/2016), exige que projetos desenvolvidos em ICTs sejam geridos pelo respectivo Núcleo de Inovação Tecnológica (NIT).

---

## 3. Arquitetura da Plataforma Web e Modelo de Dados (DER)
A plataforma foi implementada em arquitetura web híbrida utilizando **HTML5, CSS3, JavaScript, PHP (PDO) e SQL (SQLite/MySQL)**, estruturada em três módulos ativos:
* **Módulo de Entrada e Inspeção Textual de Código:** Coleta as variáveis das 6 camadas do projeto e inclui um inspetor léxico capaz de ler cabeçalhos de código-fonte (`SPDX-License-Identifier`, menções a `GPL`, `LGPL`, `MIT`, `CERN-OHL`, `Solderpad`, `TAPR` e `CC BY-SA`), ajustando automaticamente os parâmetros de diagnóstico.
* **Motor de Decisão Multicritério (`api/diagnostico.php` e `assets/js/app.js`):** Avalia o grau de protegibilidade (0 a 100), detecta colisões entre o modelo de negócios pretendido e licenças recíprocas e decompõe o diagnóstico nas Camadas A a F.
* **Gerador Automatizado de Minutas (`api/minuta.php`):** Emite quatro instrumentos jurídicos customizados com verificação Hash SHA-256: (1) *Contrato de Cessão de Direitos Patrimoniais nas 6 Camadas*; (2) *Termo de Licenciamento OSHW com Reserva Expressa de Marca (Cláusula Arduino)*; (3) *Contrato de Licenciamento Industrial e Prevenção à Espionagem*; e (4) *Dossiê Técnico Multicamada para o INPI*.

---

## 4. Estudos de Caso e Validação Experimental
O sistema foi validado por meio de quatro cenários extraídos de casos reais da indústria de hardware e semicondutores:
1. **Caso 1 — Arduino LLC vs. Arduino SRL (Genuino) e o Papel da Marca:** Em um ecossistema 100% aberto nas dimensões de hardware (CC BY-SA) e software (GPL/LGPL), o litígio societário entre 2014 e 2016 demonstrou que o Registro de Marca (Camada D — Art. 129 da LPI, também discutido no Brasil no caso *Gradiente vs. Apple — Tema 1205 do STF*) funciona como o único vetor exclusivo de controle patrimonial. O Observatório detecta esse cenário e gera automaticamente o Termo OSHW com reserva estrita do signo distintivo.
2. **Caso 2 — Waymo (Google) vs. Uber (LiDAR e o Custo do Segredo):** Avalia um sensor óptico inédito mantido em segredo industrial sem publicação defensiva nem depósito patentário prévio, demonstrando a recomendação primária de Patente de Invenção (Camada F) combinada com cláusulas de confidencialidade.
3. **Caso 3 — Intel vs. AMD (Topografia de Circuitos Integrados):** Simula a proteção de 19 desenhos de layouts tridimensionais de microchips, acionando o enquadramento na Camada C (Lei nº 11.484/2007 e incentivos do PADIS).
4. **Caso 4 — Inovação Universitária em ICT com Conflito GPLv3 / CERN-OHL-S:** Demonstra a detecção de risco crítico (`ALTO_CRITICO`) quando um laboratório tenta fechar comercialmente um equipamento derivado de licenças fortemente recíprocas, além de acionar a intervenção obrigatória do NIT (Lei nº 10.973/2004).

---

## 5. Conclusão
A consolidação da Matriz de Proteção Multicamada (A–F) em um motor de decisão automatizado permite traduzir a complexidade fragmentada da legislação brasileira em orientações acionáveis para projetistas de sistemas embarcados, prevenindo litígios societários sobre marcas, violações de licenças *copyleft* e perdas patrimoniais por ausência de registro no INPI.

---

## Referências Bibliográficas
1. ARDUINO. **Two Arduinos become one**. Arduino Blog, 1 out. 2016. Disponível em: https://blog.arduino.cc/2016/10/01/two-arduinos-become-one-2/.
2. BRASIL. **Constituição da República Federativa do Brasil de 1988**. Brasília, DF: Presidência da República, 1988.
3. BRASIL. **Decreto nº 75.699, de 6 de maio de 1975**. Promulga a Convenção de Berna para a Proteção das Obras Literárias e Artísticas.
4. BRASIL. **Lei nº 9.279, de 14 de maio de 1996**. Regula direitos e obrigações relativos à propriedade industrial (LPI).
5. BRASIL. **Lei nº 9.609, de 19 de fevereiro de 1998**. Dispõe sobre a proteção da propriedade intelectual de programa de computador.
6. BRASIL. **Lei nº 9.610, de 19 de fevereiro de 1998**. Altera, atualiza e consolida a legislação sobre direitos autorais (LDA).
7. BRASIL. **Lei nº 10.406, de 10 de janeiro de 2002**. Institui o Código Civil.
8. BRASIL. **Lei nº 10.973, de 2 de dezembro de 2004**. Dispõe sobre incentivos à inovação e à pesquisa científica e tecnológica no ambiente produtivo (Marco Legal de CT&I).
9. BRASIL. **Lei nº 11.484, de 31 de maio de 2007**. Dispõe sobre o PADIS e sobre a proteção à propriedade intelectual das topografias de circuitos integrados.
10. CERN. **CERN Open Hardware Licence Version 2**. Genebra: CERN, 2020. Disponível em: https://ohwr.org/project/cernohl.
11. CREATIVE COMMONS. **Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0)**.
12. ESTADOS UNIDOS. Department of Justice. **Former Intel Employee Sentenced for Stealing Computer Chip Manufacturing and Design Documents**. Boston, 8 ago. 2012.
13. FREE SOFTWARE FOUNDATION. **GNU General Public License, version 3**. Boston: FSF, 2007.
14. HARVARD JOURNAL OF LAW & TECHNOLOGY. **Waymo v. Uber: Surprise Settlement Five Days into Trial**. Cambridge, 2018.
15. OPEN SOURCE HARDWARE ASSOCIATION (OSHWA). **Open Source Hardware (OSHW) Definition 1.0**. Disponível em: https://www.oshwa.org/definition/.
