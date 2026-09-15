# Sistema de Diagnóstico & Mentoria Contábil

Plataforma completa de diagnóstico empresarial e perfilamento de leads, desenvolvida especialmente para serviços de **Mentoria Contábil e Consultoria Estratégica**.

---

## 🌟 Principais Funcionalidades

1. **Troca de Tema Instantânea:**
   - Modo Claro (*Clean Corporate*) e Modo Escuro (*Dark Executive*) com salvamento automático da preferência do usuário.
2. **Identificação & Perfilamento Completo:**
   - Captura de Nome, Empresa, Porte, WhatsApp, E-mail e Cargo Executivo (Sócio/Proprietário, CEO, Gerente Financeiro, Gestor Operacional, MEI/Autônomo).
3. **40 Perguntas Divididas em 5 Pilares Estratégicos:**
   - **Pilar 1:** Gestão Financeira & Fluxo de Caixa (Perguntas 1 a 8)
   - **Pilar 2:** Planejamento Tributário & Fiscal (Perguntas 9 a 16)
   - **Pilar 3:** Processos Internos & Governança (Perguntas 17 a 24)
   - **Pilar 4:** Gestão de Pessoas & Custos Trabalhistas (Perguntas 25 a 32)
   - **Pilar 5:** Estratégia, Precificação & Crescimento (Perguntas 33 a 40)
4. **Escala de Maturidade em 5 Níveis:**
   - **Nível 1:** Não implantado / Inexistente (Crítico)
   - **Nível 2:** Em estruturação inicial / Esporádico
   - **Nível 3:** Parcialmente implementado
   - **Nível 4:** Bem estruturado / Quase total
   - **Nível 5:** Efetivamente implantado e monitorado (Excelência)
5. **Diagnóstico Inteligente & Plano de Ação:**
   - Cálculo automático do percentual global e por pilar.
   - Destaque imediato de todos os itens com nota 1, 2 ou 3 com orientações práticas para melhoria imediata.
6. **Exportação de Relatório Executivo em PDF:**
   - Gera um dossiê pronto para impressão ou download contendo os dados do cliente, notas, resumo executivo, recomendações e auditoria de todas as 40 perguntas.
7. **Integração com WhatsApp:**
   - Botão para o cliente enviar o resultado diretamente para o WhatsApp da mentora, pronto para agendar a primeira sessão de consultoria.

---

## 🚀 Como Executar o Sistema

Não requer instalação de Node.js, banco de dados ou servidores pesados.

### Opção 1: Direto no Navegador (Mais Rápido)
Basta dar um **duplo clique no arquivo `index.html`** no seu computador. Ele abrirá instantaneamente no Chrome, Edge, Firefox ou qualquer navegador moderno.

### Opção 2: Servidor Local (Recomendado para testar em rede/celular)
No terminal dentro da pasta `mentoria-diagnostico`, você pode rodar:
```bash
# Com Python:
python -m http.server 8080

# Ou com npx:
npx serve .
```
E acessar no navegador: `http://localhost:8080`.

---

## ✏️ Como Personalizar as Perguntas e Dados da Mentora

### 1. Para alterar as 40 Perguntas ou Adicionar Novas:
Abra o arquivo [`js/questions.js`](js/questions.js). Cada pergunta segue esta estrutura simples:
```javascript
{
    id: 1,
    pillarId: "financeiro",
    title: "Pergunta 1: Nome do Assunto",
    description: "Texto da pergunta explicativa...",
    tip: "Orientação e conselho da mentora caso o cliente marque uma nota baixa..."
}
```

### 2. Para colocar o WhatsApp e Contatos da sua Madrinha:
- No arquivo [`js/app.js`](js/app.js), procure por `defaultPhone` e coloque o número com DDD (ex: `"5511999999999"`).
- No arquivo [`js/pdf-generator.js`](js/pdf-generator.js), edite o objeto `mentorConfig` com o nome, telefone e e-mail que sairão no rodapé do PDF.

---

## 📂 Estrutura de Arquivos

```
mentoria-diagnostico/
├── index.html              # Tela de início, quiz e resultados
├── css/
│   └── styles.css          # Estilos modernos, temas Claro/Escuro e responsividade
├── js/
│   ├── questions.js        # Definição das 40 perguntas, pilares e níveis
│   ├── app.js              # Lógica da aplicação e cálculos de notas
│   └── pdf-generator.js    # Formatação e geração do PDF executivo
└── README.md               # Este guia explicativo
```
