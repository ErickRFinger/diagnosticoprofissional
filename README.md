# Auditoria de Margem & Processos • Diagnóstico Empresarial

Plataforma executiva de **Diagnóstico Empresarial de Eficiência Operacional, Governança & DRE**, desenvolvida para auditoria de processos, consultoria de margem e estruturação estratégica de empresas.

---

## 🌟 Principais Funcionalidades

1. **Questionário Progressivo Passo a Passo (1 Questão por vez):**
   - Pergunta em destaque com tipografia maior e alta legibilidade.
   - Opções de resposta compactas e organizadas na escala de maturidade (1 a 5).
   - Auto-avanço dinâmico e suave ao selecionar a resposta.
   - Navegação por atalhos numéricos no teclado (1 a 5 e setas esquerda/direita) ou botões de navegação.

2. **24 Perguntas Estratégicas em 5 Eixos Operacionais:**
   - **Eixo 1 — Gestão & Liderança:** Critérios técnicos de seleção, autonomia decisória, comitês executivos e liderança de equipe.
   - **Eixo 2 — Estrutura, Processos e Operações:** Organogramas formais, ERP/BI, padronização, RH e planejamento de metas.
   - **Eixo 3 — Governança & Relações Societárias:** Regras societárias, separação entre sócio e gestor, transparência e sucessão.
   - **Eixo 4 — Pessoas & Equipe:** Competência para funções-chave, capacitação contínua, meritocracia e protagonismo.
   - **Eixo 5 — Cultura & Ambiente Organizacional:** Valores corporativos vividos na prática, inovação e retenção de talentos.

3. **Mapeamento de Impacto Direto na DRE (Demonstração do Resultado):**
   - Conecta a maturidade das rotinas operacionais ao impacto financeiro em cada linha da DRE:
     - **Linha 1 — Receita Bruta & Vendas:** Precificação, ticket médio, carteira ativa e expansão comercial.
     - **Linha 2 — Custos Operacionais & CPV:** Produtividade por hora/homem, redução de retrabalho, giro de estoque e perdas fabris.
     - **Linha 3 — Despesas de Gestão & SG&A:** Redução de turnover, integração sistêmica por ERP/BI e alçadas de despesa.
     - **Linha 4 — Margem EBITDA & Lucro Líquido:** Lucratividade final, retorno sobre ativo (ROA) e preservação do caixa.

4. **Teia de Eficiência (Gráfico Radar Interativo via Chart.js):**
   - Comparativo visual imediato entre os 5 eixos estratégicos frente ao referencial de 100% de consolidação. Suporta modo claro e escuro.

5. **Matriz de Priorização de Ações (Gaps - Notas 1, 2 e 3):**
   - Filtros dinâmicos por horizontes de ação:
     - ⚡ *Vitórias Rápidas (Curto Prazo):* Ações imediatas de baixo custo (pautas de reunião, feedbacks, alinhamentos).
     - 🏛️ *Governança Estruturante (Médio Prazo):* Comitês de gestão, alçadas e protocolos societários.
     - 📊 *Controle & Sistemas (Longo Prazo):* Implantação de BI/ERP e metas formais plurianuais.

6. **Dossiê Executivo em PDF:**
   - Relatório executivo completo diagramado para apresentação à diretoria e conselhos, contendo perfil empresarial, radar de maturidade, reflexo na DRE, matriz de planos de ação e auditoria das 24 questões.

7. **Persistência & Mobilidade:**
   - Auto-save contínuo em `localStorage`.
   - Exportação e importação instantânea em JSON.
   - Modo Confidencial / Anônimo para diagnóstico inicial sem coleta de dados cadastrais.
   - Conexão direta via WhatsApp para agendamento de devolutiva.

---

## 🚀 Como Executar o Sistema

Não requer instalação de dependências ou servidores complexos.

### Opção 1: Direto no Navegador (Mais Rápido)
Basta dar um **duplo clique no arquivo `index.html`** no seu computador. Ele abrirá instantaneamente em qualquer navegador moderno (Chrome, Edge, Firefox, Safari).

### Opção 2: Servidor Local
No terminal dentro da pasta do projeto, execute:
```bash
python -m http.server 8080
```
E acesse no navegador: `http://localhost:8080`.

---

## 📂 Estrutura de Arquivos

```
diagnosticoprofissional-main/
├── index.html              # Interface do produto (Onboarding, Questionário Progressivo e Resultados DRE)
├── css/
│   └── styles.css          # Design System executivo, temas Claro/Escuro, Cards DRE e Questionário
├── js/
│   ├── questions.js        # As 24 questões, 5 eixos estratégicos, opções compactas e 4 linhas da DRE
│   ├── app.js              # Fluxo progressivo 1 a 1, atalhos, cálculos DRE e visual analytics
│   └── pdf-generator.js    # Dossiê Executivo corporativo em PDF
├── EMBASAMENTO/            # Documentos e questionários base
└── README.md               # Documentação técnica do produto
```

&copy; Visual Tech 2026
