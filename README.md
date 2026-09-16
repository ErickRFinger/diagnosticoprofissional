# Plataforma de Diagnóstico & Governança da Empresa Familiar

> **Metodologia Científica Aplicada:** Dissertação de Mestrado Profissional em Administração de **Taís Trevisol Scherner (2024)**, orientada pela **Prof.ª Dra. Ieda Margarete Oro** — Universidade do Oeste de Santa Catarina (Unoesc Chapecó/SC).  
> **Tema:** *Envolvimento da Família no Processo de Profissionalização e no Desempenho Organizacional: Um estudo de caso em uma empresa familiar.*

Plataforma interativa desenvolvida para avaliação diagnóstica, consultoria e mentoria estratégica de empresas familiares, identificando pontos críticos de governança, autonomia decisória, formalização de processos, sucessão e impacto no desempenho organizacional.

---

## 🌟 Principais Funcionalidades

1. **24 Perguntas Essenciais em 5 Eixos Estratégicos (Polat, 2020):**
   - **Eixo 1 — Gestão:** Envolvimento não familiar, delegação e descentralização da autoridade, comitê estratégico e liderança dos gerentes.
   - **Eixo 2 — Estrutura, Processos e Operações:** Organogramas, controles formais (ERP/BI), práticas de RH e planejamento estratégico.
   - **Eixo 3 — Família e Negócio:** Governança societária, diferenciação de papéis e planejamento sucessório.
   - **Eixo 4 — Pessoas:** Competência ocupacional e profissionalismo comportamental da equipe.
   - **Eixo 5 — Cultura e Ambiente de Trabalho:** Valores profissionais compartilhados e preservação do legado histórico com abertura a inovações.

2. **Escala de Maturidade em 5 Níveis (Documento de Embasamento):**
   - **1 — Não acontece:** Inexistente ou não observada na empresa.
   - **2 — Acontece pouco:** Ocorre de maneira esporádica ou incipiente.
   - **3 — Acontece parcialmente:** Acontece em algumas ocasiões ou áreas, sem padrão definitivo.
   - **4 — Acontece de forma consistente:** Rotineira e bem aplicada na maior parte do tempo.
   - **5 — Está consolidado:** Totalmente incorporado à cultura, rotinas e processos.

3. **Modo Anônimo / Confidencial (Garantia de Sigilo):**
   - Permite que o participante responda à avaliação sem fornecer dados pessoais ou da empresa, ideal para coletas acadêmicas e diagnósticos prévios de alta confidencialidade.

4. **Teia de Governança (Gráfico Radar Interativo via Chart.js):**
   - Exibe visualmente o equilíbrio e eventuais assimetrias da empresa familiar nos 5 eixos simultaneamente, comparando com a referência de 100% de consolidação. Suporta modo claro e escuro.

5. **Mapeamento de Impacto no Balanced Scorecard (BSC):**
   - Conecta a maturidade das práticas de governança aos impactos diretos nas 4 perspectivas de Kaplan & Norton (1997) e Songini et al. (2023):
     - **Financeira:** Caixa, margens EBITDA, lucratividade e retorno sobre ativo/capital (ROA/ROE).
     - **Clientes:** Retenção, ticket médio e fortalecimento da marca.
     - **Processos Internos:** Padronização, agilidade, ERP/BI e redução de retrabalho.
     - **Aprendizagem & Crescimento:** Retenção de lideranças, redução de turnover e preparação para a sucessão.

6. **Matriz de Priorização de Ações (Gaps - Notas 1, 2 e 3):**
   - Filtros dinâmicos por horizontes de ação:
     - ⚡ *Vitórias Rápidas (Curto Prazo):* Ações imediatas de baixo custo (pautas de reunião, feedbacks, canais de ideias).
     - 🏛️ *Governança Estruturante (Médio Prazo):* Comitê estratégico, conselho de família, protocolo familiar e sucessão.
     - 📊 *Controle & Sistemas (Longo Prazo):* Implantação de BI/ERP e metas formais plurianuais.

7. **Persistência de Dados & Arquivamento:**
   - Salvamento automático contínuo em `localStorage` para não perder respostas.
   - Botão para **Salvar / Exportar Diagnóstico em JSON** (para arquivamento ou comparação temporal).
   - Botão para **Carregar Diagnóstico prévio em JSON** na barra de navegação.

8. **Exportação de Dossiê Executivo em PDF:**
   - Documento editorial completo de alta fidelidade contendo capa institucional da Unoesc, perfil do participante, imagem do gráfico radar, pontuações, módulo BSC, matriz de prioridades e tabela com as 24 questões auditadas.

9. **Integração com WhatsApp:**
   - Disparo de mensagem personalizada com perfil, percentual de maturidade e os principais gaps identificados para contato direto com a mentora **Taís Trevisol Scherner**.

---

## 🚀 Como Executar o Sistema

Não requer instalação de Node.js, banco de dados ou compiladores.

### Opção 1: Direto no Navegador (Mais Rápido)
Basta dar um **duplo clique no arquivo `index.html`** no computador. Ele abrirá instantaneamente em qualquer navegador moderno (Chrome, Edge, Firefox, Safari).

### Opção 2: Servidor Local (Recomendado para testar no celular ou tablet)
No terminal dentro da pasta do projeto, execute:
```bash
python -m http.server 8080
```
E acesse no navegador: `http://localhost:8080`.

---

## ✏️ Personalização & Configuração

- **Perguntas, Pilares e Textos Teóricos:** Edite o arquivo [`js/questions.js`](js/questions.js).
- **Contatos da Mentora / Consultora:** No objeto `DIAGNOSTIC_FRAMEWORK` em `js/questions.js` e em `mentorConfig` dentro de [`js/pdf-generator.js`](js/pdf-generator.js).
- **Lógica e Cálculos de Pontuação:** Arquivo [`js/app.js`](js/app.js).
- **Design System e Temas:** Arquivo [`css/styles.css`](css/styles.css).

---

## 📂 Estrutura de Arquivos

```
diagnosticoprofissional-main/
├── index.html              # Interface completa (Onboarding, Questionário, Resultados e Analytics)
├── css/
│   └── styles.css          # Design System executivo, temas Claro/Escuro, Gráficos e Responsividade
├── js/
│   ├── questions.js        # Definição das 24 questões, 5 pilares, 11 subdimensões e perspectivas BSC
│   ├── app.js              # Lógica de estados, Chart.js Radar, cálculos BSC, filtros e persistência
│   └── pdf-generator.js    # Formatação e geração do dossiê executivo em PDF
├── EMBASAMENTO/            # Pasta com a dissertação acadêmica (PDF), áudio e questionário base (DOCX)
│   ├── Dissertação TAÍS TREVISOL SCHERNER.pdf
│   ├── WhatsApp Ptt 2026-09-15 at 22.22.34.ogg
│   └── perguntas iniciais diagnostico.docx
└── README.md               # Documentação técnica e metodológica da plataforma
```
