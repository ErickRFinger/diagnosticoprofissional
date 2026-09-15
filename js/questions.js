/**
 * Base de Perguntas para Diagnóstico e Mentoria Empresarial / Contábil
 * Cada pergunta possui 5 níveis de maturidade (1 a 5).
 * A 5ª opção representa a excelência ("Efetivamente implantado").
 */

const PILLARS = [
    {
        id: "financeiro",
        name: "Gestão Financeira & Fluxo de Caixa",
        icon: "fas fa-wallet",
        description: "Controle de entradas, saídas, conciliação e previsibilidade financeira."
    },
    {
        id: "fiscal",
        name: "Planejamento Tributário & Fiscal",
        icon: "fas fa-file-invoice-dollar",
        description: "Conformidade tributária, emissão de notas e otimização de impostos."
    },
    {
        id: "processos",
        name: "Processos Internos & Governança",
        icon: "fas fa-cogs",
        description: "Padronização de rotinas, separação de contas e controle operacional."
    },
    {
        id: "pessoas",
        name: "Gestão de Pessoas & Custos Trabalhistas",
        icon: "fas fa-users",
        description: "Folha de pagamento, encargos, pró-labore e produtividade da equipe."
    },
    {
        id: "estrategia",
        name: "Estratégia, Precificação & Crescimento",
        icon: "fas fa-chart-line",
        description: "Formação de preços, margem de lucro, metas e visão de futuro."
    }
];

const DEFAULT_OPTIONS = [
    { value: 1, label: "Nível 1 - Não implantado / Inexistente", desc: "A empresa não realiza ou não possui controle sobre este item." },
    { value: 2, label: "Nível 2 - Em estruturação inicial / Raro", desc: "Feito de forma esporádica, manual e sem padrão definido." },
    { value: 3, label: "Nível 3 - Parcialmente implementado", desc: "Existe rotina básica, mas ocorrem falhas ou faltam dados precisos." },
    { value: 4, label: "Nível 4 - Bem estruturado / Quase total", desc: "Processo rotineiro e bem acompanhado, com pequenos ajustes pendentes." },
    { value: 5, label: "Nível 5 - Efetivamente implantado e monitorado", desc: "Prática consolidada, com indicadores regulares e excelência comprovada." }
];

const QUESTIONS = [
    // --- PILAR 1: GESTÃO FINANCEIRA & FLUXO DE CAIXA (Perguntas 1 a 8) ---
    {
        id: 1,
        pillarId: "financeiro",
        title: "Pergunta 1: Conciliação Bancária Diária",
        description: "Os extratos de todas as contas bancárias da empresa são conferidos e conciliados diariamente com o sistema de gestão ou planilha?",
        tip: "Realizar a conciliação bancária diariamente evita furos no saldo, cobranças indevidas de tarifas e garante visibilidade real do caixa."
    },
    {
        id: 2,
        pillarId: "financeiro",
        title: "Pergunta 2: Projeção de Fluxo de Caixa Futuro",
        description: "A empresa possui uma projeção de fluxo de caixa para os próximos 30, 60 e 90 dias com previsão de recebimentos e pagamentos?",
        tip: "A projeção do fluxo de caixa permite antecipar momentos de escassez e planejar investimentos com antecedência."
    },
    {
        id: 3,
        pillarId: "financeiro",
        title: "Pergunta 3: Controle de Inadimplência e Cobrança",
        description: "Existe uma régua estruturada de cobrança de clientes e monitoramento periódico dos recebíveis em atraso?",
        tip: "Automatizar a régua de cobrança reduz o índice de inadimplência e acelera a recuperação de capital de giro."
    },
    {
        id: 4,
        pillarId: "financeiro",
        title: "Pergunta 4: Separação entre Contas PF e PJ (Princípio da Entidade)",
        description: "As contas pessoais dos sócios são rigorosamente separadas das contas da pessoa jurídica, sem misturar despesas pessoais?",
        tip: "Misturar finanças pessoais e empresariais compromete a apuração do lucro e gera sérios riscos fiscais com a Receita Federal."
    },
    {
        id: 5,
        pillarId: "financeiro",
        title: "Pergunta 5: Gestão de Contas a Pagar e Prazos com Fornecedores",
        description: "Todos os compromissos futuros com fornecedores são agendados e negociados alinhados ao prazo médio de recebimento?",
        tip: "Manter o prazo de pagamento maior ou equilibrado com o prazo de recebimento preserva a liquidez do negócio."
    },
    {
        id: 6,
        pillarId: "financeiro",
        title: "Pergunta 6: Demonstração do Resultado do Exercício (DRE Gerencial)",
        description: "A empresa elabora mensalmente um DRE gerencial para identificar se a operação gerou lucro líquido real ou prejuízo?",
        tip: "O DRE gerencial é o termômetro vital do negócio: demonstra receitas, custos variáveis, margem de contribuição e lucro líquido."
    },
    {
        id: 7,
        pillarId: "financeiro",
        title: "Pergunta 7: Reserva de Emergência e Capital de Giro",
        description: "A empresa mantém uma reserva financeira equivalente a pelo menos 3 a 6 meses dos seus custos fixos operacionais?",
        tip: "Uma reserva de liquidez sólida protege a empresa de oscilações de mercado e momentos de crise sem depender de empréstimos caros."
    },
    {
        id: 8,
        pillarId: "financeiro",
        title: "Pergunta 8: Acompanhamento do Ponto de Equilíbrio (Break-Even)",
        description: "A gestão sabe com clareza o valor exato de faturamento mínimo mensal necessário para cobrir todos os custos fixos e variáveis?",
        tip: "Conhecer o ponto de equilíbrio define a meta mínima de vendas para que a empresa não opere no vermelho."
    },

    // --- PILAR 2: CONTROLE FISCAL & TRIBUTÁRIO (Perguntas 9 a 16) ---
    {
        id: 9,
        pillarId: "fiscal",
        title: "Pergunta 9: Emissão de Notas Fiscais em 100% das Vendas",
        description: "Todas as vendas de produtos ou prestações de serviços são acobertadas pela emissão imediata e correta da documentação fiscal?",
        tip: "A emissão integral de notas fiscais protege o negócio de autuações pesadas e permite comprovar a solidez da receita."
    },
    {
        id: 10,
        pillarId: "fiscal",
        title: "Pergunta 10: Revisão do Enquadramento Tributário Anual",
        description: "A empresa realiza anualmente, com apoio contábil, estudo comparativo entre Simples Nacional, Lucro Presumido e Lucro Real?",
        tip: "O planejamento tributário anual pode economizar milhares de reais em impostos pagos indevidamente."
    },
    {
        id: 11,
        pillarId: "fiscal",
        title: "Pergunta 11: Controle e Guarda de Documentos Fiscais e XMLs",
        description: "Os arquivos XML das notas de entrada e saída são arquivados de forma segura em nuvem e integrados à contabilidade?",
        tip: "A legislação exige a guarda dos XMLs por 5 anos. A perda desses arquivos dificulta a defesa em auditorias fiscais."
    },
    {
        id: 12,
        pillarId: "fiscal",
        title: "Pergunta 12: Gestão de Retenções na Fonte e Tributos Federais/Municipais",
        description: "As retenções de impostos (ISS, IRRF, PIS/COFINS/CSLL) são calculadas, retidas e recolhidas rigorosamente em dia?",
        tip: "Retenções não recolhidas no prazo podem ser enquadradas em apropriação indébita previdenciária e fiscal."
    },
    {
        id: 13,
        pillarId: "fiscal",
        title: "Pergunta 13: Monitoramento de Certidões Negativas de Débitos (CNDs)",
        description: "A empresa emite e monitora mensalmente as CNDs da Receita Federal, FGTS, Trabalhista e Fazendas Estadual e Municipal?",
        tip: "Monitorar CNDs evita surpresas ao solicitar crédito, emitir certidões para clientes ou participar de licitações."
    },
    {
        id: 14,
        pillarId: "fiscal",
        title: "Pergunta 14: Cadastro Fiscal de Itens e NCM / Alíquotas Corretas",
        description: "O cadastro de produtos ou serviços possui as classificações fiscais (NCM, CFOP, CST) validadas pela contabilidade?",
        tip: "Classificação incorreta de NCM faz com que a empresa pague impostos a mais ou sofra cobranças retroativas."
    },
    {
        id: 15,
        pillarId: "fiscal",
        title: "Pergunta 15: Aproveitamento de Créditos Tributários / Benefícios",
        description: "A gestão tributária analisa se a empresa tem direito à recuperação de tributos (ex: PIS/COFINS monofásico, ICMS)?",
        tip: "Empresas do Simples de diversos ramos (autopeças, farmácias, cosméticos, bebidas) possuem créditos não aproveitados."
    },
    {
        id: 16,
        pillarId: "fiscal",
        title: "Pergunta 16: Cumprimento do Calendário de Obrigações Acessórias",
        description: "Os documentos contábeis e fiscais são enviados pontualmente à contabilidade nos primeiros dias do mês seguinte?",
        tip: "A pontualidade no envio de documentos permite que a contabilidade forneça relatórios precisos sem risco de multas por atraso."
    },

    // --- PILAR 3: PROCESSOS INTERNOS & GOVERNANÇA (Perguntas 17 a 24) ---
    {
        id: 17,
        pillarId: "processos",
        title: "Pergunta 17: Mapeamento e Padronização de Procedimentos (POPs)",
        description: "As rotinas operacionais, administrativas e de atendimento possuem procedimentos operacionais padronizados por escrito?",
        tip: "Processos documentados reduzem a dependência de pessoas específicas e facilitam o treinamento de novos colaboradores."
    },
    {
        id: 18,
        pillarId: "processos",
        title: "Pergunta 18: Uso de Software de Gestão Integrado (ERP)",
        description: "A empresa utiliza um sistema ERP para integrar vendas, estoque, compras e financeiro em uma única plataforma?",
        tip: "Planilhas isoladas geram retrabalho e inconsistência; um ERP garante rastreabilidade e segurança dos dados."
    },
    {
        id: 19,
        pillarId: "processos",
        title: "Pergunta 19: Controle e Inventário Periódico de Estoque",
        description: "Existe contagem física periódica de estoques e conferência com o saldo registrado no sistema para apuração de perdas?",
        tip: "Estoque parado é dinheiro imobilizado. Aferir quebras e desvios impacta diretamente o lucro líquido apurado."
    },
    {
        id: 20,
        pillarId: "processos",
        title: "Pergunta 20: Política de Alçadas e Aprovações de Compras",
        description: "As compras e pagamentos exigem cotação prévia e dupla aprovação de acordo com limites de valor pré-estabelecidos?",
        tip: "Alçadas claras evitam gastos desnecessários e fraudes no setor de compras e contas a pagar."
    },
    {
        id: 21,
        pillarId: "processos",
        title: "Pergunta 21: Segurança da Informação e Backups Periódicos",
        description: "Os sistemas da empresa e arquivos importantes possuem cópias de segurança em nuvem automáticas e testadas?",
        tip: "A perda de dados por falhas de hardware ou ataques virtuais pode paralisar totalmente a operação da empresa."
    },
    {
        id: 22,
        pillarId: "processos",
        title: "Pergunta 22: Conformidade com a LGPD e Proteção de Dados de Clientes",
        description: "A empresa adota práticas de proteção e sigilo com os dados cadastrais e financeiros de seus clientes e parceiros?",
        tip: "Adequação básica à LGPD mitiga riscos de vazamento e fortalece a reputação da empresa no mercado."
    },
    {
        id: 23,
        pillarId: "processos",
        title: "Pergunta 23: Gestão de Contratos e Renovação com Clientes e Fornecedores",
        description: "Todos os contratos possuem controle de vigência, reajustes anuais previstos por índice e cláusulas de rescisão claras?",
        tip: "Deixar de aplicar reajustes contratuais na data-base reduz as margens de lucro ano a ano frente à inflação."
    },
    {
        id: 24,
        pillarId: "processos",
        title: "Pergunta 24: Reuniões Periódicas de Alinhamento Operacional",
        description: "A liderança realiza reuniões estruturadas semanais ou mensais com a equipe para revisar pendências e gargalos?",
        tip: "Alinhamentos constantes aumentam o senso de responsabilidade e resolvem problemas antes que afetem o cliente."
    },

    // --- PILAR 4: GESTÃO DE PESSOAS & CUSTOS TRABALHISTAS (Perguntas 25 a 32) ---
    {
        id: 25,
        pillarId: "pessoas",
        title: "Pergunta 25: Definição Formal de Pró-Labore dos Sócios",
        description: "Os sócios possuem valor fixo mensal de pró-labore com recolhimento de INSS, separando da distribuição de lucros?",
        tip: "O pró-labore correto comprova a remuneração pelo trabalho e protege a isenção tributária da distribuição de lucros."
    },
    {
        id: 26,
        pillarId: "pessoas",
        title: "Pergunta 26: Previsão de Encargos, Férias e 13º Salário no Caixa",
        description: "A empresa provisiona mensalmente os encargos trabalhistas futuros (férias + 1/3, 13º e FGTS) em conta reservada?",
        tip: "Provisionar o passivo trabalhista evita o desespero financeiro no final do ano com o pagamento de décimo terceiro e férias."
    },
    {
        id: 27,
        pillarId: "pessoas",
        title: "Pergunta 27: Controle Eletrônico ou Formal de Ponto e Horas Extras",
        description: "A jornada de trabalho dos funcionários é registrada de forma precisa e auditável, evitando passivos trabalhistas?",
        tip: "A ausência de controle fidedigno de jornada é a causa número 1 de ações trabalhistas de alto valor contra empresas."
    },
    {
        id: 28,
        pillarId: "pessoas",
        title: "Pergunta 28: Cumprimento das Normas de Saúde e Segurança (SST / eSocial)",
        description: "A empresa possui laudos vigentes (PGR, PCMSO) e envia os eventos de SST ao eSocial no prazo legal?",
        tip: "As multas do eSocial por falta de envio dos laudos de segurança do trabalho incidem diretamente por funcionário."
    },
    {
        id: 29,
        pillarId: "pessoas",
        title: "Pergunta 29: Descrição de Cargos, Funções e Salários Claros",
        description: "Cada colaborador possui atribuições, metas e responsabilidades formalmente definidas por escrito?",
        tip: "Clareza de funções evita desvios de função, retrabalho e desmotivação entre os colaboradores."
    },
    {
        id: 30,
        pillarId: "pessoas",
        title: "Pergunta 30: Avaliação de Produtividade e Métricas por Colaborador",
        description: "A empresa avalia a entrega e eficiência de cada funcionário através de indicadores objetivos e feedbacks?",
        tip: "Medir produtividade permite premiar os melhores talentos e corrigir rapidamente desempenhos abaixo do esperado."
    },
    {
        id: 31,
        pillarId: "pessoas",
        title: "Pergunta 31: Política de Retenção e Clima Organizacional",
        description: "Existe um ambiente de valorização que mantém o turnover (rotatividade de pessoal) em patamares saudáveis?",
        tip: "Alta rotatividade eleva os custos de rescisão, novos treinamentos e prejudica a qualidade do atendimento."
    },
    {
        id: 32,
        pillarId: "pessoas",
        title: "Pergunta 32: Plano de Desenvolvimento e Treinamento Contínuo",
        description: "A empresa investe periodicamente em capacitação técnica ou comportamental para a equipe?",
        tip: "Equipes capacitadas cometem menos erros operacionais e elevam o nível de satisfação dos clientes."
    },

    // --- PILAR 5: ESTRATÉGIA, PRECIFICAÇÃO & CRESCIMENTO (Perguntas 33 a 40) ---
    {
        id: 33,
        pillarId: "estrategia",
        title: "Pergunta 33: Metodologia Científica de Formação de Preço de Venda",
        description: "Os preços são calculados com base em custos diretos, impostos, despesas fixas proporcionais e margem de lucro desejada?",
        tip: "Precificar apenas copiando a concorrência é um risco grave: você pode estar vendendo com margem negativa sem saber."
    },
    {
        id: 34,
        pillarId: "estrategia",
        title: "Pergunta 34: Análise da Margem de Contribuição por Produto ou Serviço",
        description: "A gestão sabe exatamente quais produtos ou serviços são os mais rentáveis e quais geram pouca ou nenhuma margem?",
        tip: "Conhecer a margem unitária permite direcionar a força de vendas para os itens que realmente sustentam a rentabilidade."
    },
    {
        id: 35,
        pillarId: "estrategia",
        title: "Pergunta 35: Metas Claras de Vendas e Faturamento Mensal",
        description: "A empresa possui metas quantitativas divididas por mês, trimestre e por vendedor/canal de aquisição?",
        tip: "Metas tangíveis mobilizam o time comercial e facilitam o acompanhamento periódico do crescimento."
    },
    {
        id: 36,
        pillarId: "estrategia",
        title: "Pergunta 36: Custo de Aquisição de Cliente (CAC) e Ticket Médio",
        description: "A empresa calcula quanto investe para atrair um novo cliente e acompanha o valor médio de cada transação?",
        tip: "Otimizar o ticket médio é uma das formas mais baratas de aumentar o faturamento sem inflar os custos operacionais."
    },
    {
        id: 37,
        pillarId: "estrategia",
        title: "Pergunta 37: Pesquisa de Satisfação do Cliente (NPS / Feedback)",
        description: "Existe um canal estruturado para colher a opinião dos clientes sobre a qualidade do produto ou serviço entregue?",
        tip: "Clientes satisfeitos geram indicações espontâneas e recompra com custo de marketing praticamente nulo."
    },
    {
        id: 38,
        pillarId: "estrategia",
        title: "Pergunta 38: Análise da Concorrência e Diferencial Competitivo",
        description: "A empresa conhece claramente a sua proposta de valor exclusiva e os pontos fortes e fracos dos concorrentes diretos?",
        tip: "Um diferencial competitivo nítido reduz a guerra por descontos e valoriza a percepção de valor do cliente."
    },
    {
        id: 39,
        pillarId: "estrategia",
        title: "Pergunta 39: Orçamento Anual de Investimentos (Capex & Expansão)",
        description: "Os investimentos em equipamentos, reformas, tecnologia ou marketing são planejados previamente com base no orçamento?",
        tip: "Investimentos por impulso comprometem o caixa operacional e podem levar à tomada de crédito com juros elevados."
    },
    {
        id: 40,
        pillarId: "estrategia",
        title: "Pergunta 40: Reuniões de Mentoria e Aconselhamento Estratégico",
        description: "Os gestores contam com acompanhamento periódico de mentoria contábil/empresarial para tomadas de decisão de alto impacto?",
        tip: "Uma mentoria contábil especializada traz visão externa isenta, identifica brechas tributárias e acelera os resultados do negócio."
    }
];

// Perfis de Maturidade com base no percentual total de pontuação
const MATURITY_LEVELS = [
    {
        min: 0,
        max: 39.9,
        level: "Nível 1: Sobrevivência / Crítico",
        badgeColor: "badge-danger",
        tag: "Urgência Alta",
        headline: "Alerta Vermelho: Necessidade Imediata de Reestruturação",
        summary: "Sua empresa apresenta vulnerabilidades operacionais, fiscais e financeiras consideráveis. A ausência de controles estruturados coloca a continuidade do negócio em risco diário. Uma intervenção imediata de mentoria e organização contábil é indispensável para estancar perdas e evitar passivos irreversíveis."
    },
    {
        min: 40,
        max: 59.9,
        level: "Nível 2: Em Estruturação / Vulnerável",
        badgeColor: "badge-warning",
        tag: "Atenção Necessária",
        headline: "Fase de Transição: Controles Básicos com Gargalos Relevantes",
        summary: "A operação já possui algumas rotinas estabelecidas, mas ainda depende muito de processos manuais ou improvisos. Há riscos fiscais latentes e oportunidade clara de estancar desperdícios, melhorar a precificação e profissionalizar a tomada de decisões através de indicadores confiáveis."
    },
    {
        min: 60,
        max: 79.9,
        level: "Nível 3: Gestão Funcional / Em Expansão",
        badgeColor: "badge-info",
        tag: "Bom Desempenho",
        headline: "Negócio Estável: Pronto para Alavancagem e Otimização",
        summary: "Sua empresa possui boa organização financeira e cumpre a maioria das exigências. O desafio agora é sair do operacional e focar na eficiência máxima: planejamento tributário refinado, otimização das margens de lucro, governança de pessoas e alinhamento estratégico para crescer com segurança."
    },
    {
        min: 80,
        max: 100,
        level: "Nível 4: Alta Performance / Excelência",
        badgeColor: "badge-success",
        tag: "Referência de Gestão",
        headline: "Maturidade Consolidada: Governança Sólida e Pronta para Escalar",
        summary: "Parabéns! Sua gestão demonstra alto nível de controle, conformidade legal e visão estratégica. Seu foco agora é inovação, expansão contínua, governança corporativa e consolidação de liderança no seu segmento de mercado."
    }
];

// Cargos pré-configurados com descrições executivas
const ROLES = [
    { id: "socio_proprietario", label: "Sócio / Proprietário / Fundador", icon: "fas fa-crown" },
    { id: "ceo_diretor", label: "CEO / Diretor Executivo", icon: "fas fa-user-tie" },
    { id: "gerente_financeiro", label: "Gerente Financeiro / Administrativo", icon: "fas fa-chart-pie" },
    { id: "gestor_operacional", label: "Coordenador / Gestor Operacional", icon: "fas fa-tasks" },
    { id: "profissional_liberal", label: "Profissional Liberal / MEI / Autônomo", icon: "fas fa-briefcase" },
    { id: "outro_cargo", label: "Outro Cargo de Gestão / Liderança", icon: "fas fa-user" }
];
