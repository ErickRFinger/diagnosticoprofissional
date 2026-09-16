/**
 * Base de Perguntas e Construtos para o Diagnóstico Empresarial
 * Avaliação de Maturidade, Governança & Gestão Estratégica
 * Visual Tech (2026)
 *
 * Estrutura em 5 Eixos Estratégicos, 11 Subdimensões e 4 Perspectivas do Balanced Scorecard (BSC)
 * Escala de maturidade de 1 a 5.
 */

const DIAGNOSTIC_FRAMEWORK = {
    productName: "Diagnóstico Empresarial",
    subtitle: "Maturidade, Governança & Gestão Estratégica",
    provider: "Visual Tech",
    year: "2026",
    version: "3.0",
    methodology: "Matriz Multidimensional de Governança & Gestão Corporativa",
    totalQuestions: 24,
    totalPillars: 5
};

const PILLARS = [
    {
        id: "gestao",
        name: "Gestão & Liderança",
        shortName: "Gestão",
        icon: "fas fa-user-tie",
        description: "Envolvimento de gestores profissionais, descentralização da autoridade, comitê executivo e competência da liderança.",
        strategicFocus: "Autonomia, Alçadas Decisórias e Gestão Colegiada"
    },
    {
        id: "estrutura_processos",
        name: "Estrutura, Processos e Operações",
        shortName: "Processos",
        icon: "fas fa-cogs",
        description: "Organogramas formais, mecanismos de controle (ERP/BI), políticas estruturadas de RH e planejamento estratégico.",
        strategicFocus: "Padronização Operacional, Sistemas e Metas"
    },
    {
        id: "familia_negocio",
        name: "Governança & Relações Societárias",
        shortName: "Governança",
        icon: "fas fa-users-cog",
        description: "Mecanismos formais de governança, separação entre papéis de sócio e gestor, e plano de sucessão estruturado.",
        strategicFocus: "Alinhamento Societário, Protocolo e Sucessão"
    },
    {
        id: "pessoas",
        name: "Pessoas & Equipe",
        shortName: "Pessoas",
        icon: "fas fa-users",
        description: "Competência ocupacional para posições-chave, capacitação contínua e protagonismo com critérios de equidade.",
        strategicFocus: "Capacitação, Protagonismo e Meritocracia"
    },
    {
        id: "cultura_ambiente",
        name: "Cultura & Ambiente Organizacional",
        shortName: "Cultura",
        icon: "fas fa-landmark",
        description: "Valores corporativos vivenciados na prática, transparência, coerência e capacidade de inovar preservando a essência.",
        strategicFocus: "Valores Compartilhados, Inovação e Engajamento"
    }
];

const BSC_PERSPECTIVES = {
    financeiro: {
        id: "financeiro",
        name: "Financeira & Sustentabilidade",
        icon: "fas fa-chart-line",
        color: "#0284c7",
        description: "Previsibilidade orçamentária, geração de caixa (EBITDA), controle de custos e retornos sobre ativo/capital (ROA/ROE).",
        ref: "Perspectiva Financeira do Balanced Scorecard"
    },
    clientes: {
        id: "clientes",
        name: "Clientes & Mercado",
        icon: "fas fa-bullseye",
        color: "#10b981",
        description: "Valor percebido dos produtos e serviços, fidelidade dos clientes, expansão de carteira e gestão de inadimplência.",
        ref: "Perspectiva de Mercado e Stakeholders"
    },
    processos: {
        id: "processos",
        name: "Processos Internos & Produtividade",
        icon: "fas fa-cogs",
        color: "#f59e0b",
        description: "Agilidade na tomada de decisão, padronização operacional, sistemas integrados (ERP/BI) e eliminação de retrabalho.",
        ref: "Perspectiva de Eficiência Operacional"
    },
    aprendizado: {
        id: "aprendizado",
        name: "Aprendizagem & Gestão de Pessoas",
        icon: "fas fa-graduation-cap",
        color: "#8b5cf6",
        description: "Desenvolvimento de competências essenciais, retenção de talentos-chave, diminuição de turnover e plano de sucessão.",
        ref: "Perspectiva de Capital Humano e Inovação"
    }
};

const DEFAULT_OPTIONS = [
    { value: 1, label: "1 — Não acontece", desc: "A prática não existe ou não é observada na empresa." },
    { value: 2, label: "2 — Acontece pouco", desc: "Ocorre de maneira muito esporádica ou incipiente." },
    { value: 3, label: "3 — Acontece parcialmente", desc: "Acontece em algumas ocasiões ou áreas, mas sem padrão definitivo." },
    { value: 4, label: "4 — Acontece de forma consistente", desc: "Prática rotineira e bem aplicada na maior parte do tempo." },
    { value: 5, label: "5 — Está consolidado", desc: "Totalmente incorporado à cultura, processos e rotinas da empresa." }
];

const QUESTIONS = [
    // =========================================================================
    // EIXO 1: GESTÃO & LIDERANÇA (Perguntas 1 a 7)
    // =========================================================================
    {
        id: 1,
        pillarId: "gestao",
        dimension: "Gestão Profissional e Competência",
        bscPerspective: "aprendizado",
        horizon: "estruturante",
        title: "Critérios Técnicos na Escolha de Gestores",
        description: "A escolha de pessoas para cargos de gestão considera competência, experiência e capacidade de entrega, independentemente de vínculos pessoais ou de afinidade?",
        tip: "Adotar critérios técnicos e meritocráticos para posições de liderança protege a rentabilidade, legitima os líderes perante a equipe e o mercado e previne ruídos internos de autoridade."
    },
    {
        id: 2,
        pillarId: "gestao",
        dimension: "Gestão Profissional e Competência",
        bscPerspective: "processos",
        horizon: "quick_win",
        title: "Participação Ativa de Gestores nas Decisões",
        description: "Profissionais técnicos e gestores de área participam efetivamente das decisões estratégicas e relevantes da empresa?",
        tip: "Envolver os gestores de área nas decisões estratégicas traz dados reais do mercado, atenua decisões puramente intuitivas e garante o engajamento da equipe na execução."
    },
    {
        id: 3,
        pillarId: "gestao",
        dimension: "Delegação e Descentralização da Autoridade",
        bscPerspective: "processos",
        horizon: "quick_win",
        title: "Autonomia Compatível com Resultados",
        description: "Os gestores possuem autonomia real e alçadas compatíveis com as responsabilidades e resultados pelos quais são cobrados?",
        tip: "Cobrar resultados sem conceder autonomia de decisão desmotiva profissionais qualificados e sobrecarrega a diretoria com tarefas operacionais do dia a dia."
    },
    {
        id: 4,
        pillarId: "gestao",
        dimension: "Delegação e Descentralização da Autoridade",
        bscPerspective: "processos",
        horizon: "quick_win",
        title: "Agilidade nas Decisões do Dia a Dia",
        description: "As decisões operacionais cotidianas acontecem com agilidade sem depender constantemente da aprovação direta dos proprietários?",
        tip: "A dependência excessiva dos donos para aprovar rotinas cotidianas engessa a operação, retarda entregas e limita a capacidade da empresa de crescer e escalar."
    },
    {
        id: 5,
        pillarId: "gestao",
        dimension: "Comitê Estratégico e Governança",
        bscPerspective: "financeiro",
        horizon: "estruturante",
        title: "Espaço Estruturado para Estratégia e Resultados",
        description: "A empresa possui um comitê, reunião executiva ou espaço formal estruturado para discutir estratégia, metas e decisões relevantes?",
        tip: "Instituir reuniões regulares de comitê estratégico com pauta fixa separa as urgências operacionais da visão de longo prazo, garantindo decisões colegiadas e assertivas."
    },
    {
        id: 6,
        pillarId: "gestao",
        dimension: "Competência e Liderança",
        bscPerspective: "aprendizado",
        horizon: "estruturante",
        title: "Competência Técnica das Lideranças",
        description: "Os gestores e líderes possuem as competências e conhecimentos necessários para as responsabilidades que exercem?",
        tip: "Mapear a matriz de competências de cada líder frente aos desafios do mercado previne gargalos de produtividade e eleva o padrão de entrega dos setores."
    },
    {
        id: 7,
        pillarId: "gestao",
        dimension: "Competência e Liderança",
        bscPerspective: "aprendizado",
        horizon: "estruturante",
        title: "Avaliação e Desenvolvimento de Gestores",
        description: "A empresa desenvolve, treina e avalia seus gestores de acordo com as necessidades atuais e futuras do negócio?",
        tip: "Planos de capacitação continuada e avaliações periódicas preparam as lideranças para sustentar os novos ciclos de expansão, tecnologia e eficiência da organização."
    },

    // =========================================================================
    // EIXO 2: ESTRUTURA, PROCESSOS E OPERAÇÕES (Perguntas 8 a 14)
    // =========================================================================
    {
        id: 8,
        pillarId: "estrutura_processos",
        dimension: "Estruturas Organizacionais Formais",
        bscPerspective: "processos",
        horizon: "quick_win",
        title: "Clareza de Funções, Limites e Organograma",
        description: "As responsabilidades, funções, atribuições e limites de atuação dos colaboradores e líderes estão claramente definidos e documentados?",
        tip: "Um organograma formalizado com papéis e alçadas bem definidos previne atritos de autoridade, sobreposição de tarefas e retrabalho."
    },
    {
        id: 9,
        pillarId: "estrutura_processos",
        dimension: "Estruturas Organizacionais Formais",
        bscPerspective: "processos",
        horizon: "sistemas",
        title: "Independência dos Principais Processos",
        description: "Os principais processos e rotinas estão estruturados de forma que não dependam exclusivamente de determinadas pessoas?",
        tip: "Mapear e documentar os processos operacionais críticos impede que a empresa fique refém da presença física ou do conhecimento exclusivo de colaboradores específicos."
    },
    {
        id: 10,
        pillarId: "estrutura_processos",
        dimension: "Controles Gerenciais e Indicadores",
        bscPerspective: "financeiro",
        horizon: "sistemas",
        title: "Indicadores Confiáveis e Informações em Tempo Real",
        description: "A empresa possui informações, relatórios e indicadores confiáveis e suficientes para acompanhar seus principais resultados?",
        tip: "Sistemas de gestão integrados (ERP) e dados confiáveis são indispensáveis para diagnósticos financeiros precisos e para evitar desvios no fluxo de caixa."
    },
    {
        id: 11,
        pillarId: "estrutura_processos",
        dimension: "Controles Gerenciais e Indicadores",
        bscPerspective: "financeiro",
        horizon: "sistemas",
        title: "Uso Efetivo de Indicadores na Tomada de Decisão",
        description: "Os controles e indicadores são efetivamente utilizados no dia a dia para identificar desvios e orientar decisões rápidas?",
        tip: "Painéis visuais e relatórios de inteligência (BI) aceleram a identificação de problemas de custo e produtividade antes que eles gerem prejuízos consolidados."
    },
    {
        id: 12,
        pillarId: "estrutura_processos",
        dimension: "Políticas Profissionais de RH",
        bscPerspective: "aprendizado",
        horizon: "estruturante",
        title: "Critérios Claros em Práticas de RH e Remuneração",
        description: "Contratações, promoções, remunerações e desligamentos seguem critérios claros de competência, desempenho e resultados?",
        tip: "Políticas salariais transparentes e bônus vinculados ao atingimento de metas aumentam o engajamento, reduzem passivos trabalhistas e diminuem a rotatividade (turnover)."
    },
    {
        id: 13,
        pillarId: "estrutura_processos",
        dimension: "Planejamento Estratégico",
        bscPerspective: "financeiro",
        horizon: "estruturante",
        title: "Prioridades Estratégicas Conhecidas pela Equipe",
        description: "A empresa possui prioridades e objetivos estratégicos claramente definidos e amplamente conhecidos pelos gestores e líderes?",
        tip: "A comunicação transparente dos objetivos da empresa garante que todos os setores concentrem seus esforços onde há maior potencial de rentabilidade e retorno."
    },
    {
        id: 14,
        pillarId: "estrutura_processos",
        dimension: "Planejamento Estratégico",
        bscPerspective: "processos",
        horizon: "sistemas",
        title: "Desdobramento em Metas e Planos de Ação",
        description: "Os objetivos estratégicos são transformados em metas setoriais, indicadores práticos e planos de ação acompanhados ao longo do ano?",
        tip: "Desdobrar grandes metas anuais em planos de ação operacionais mensuráveis transforma a visão da diretoria em realizações práticas e rotinas diárias."
    },

    // =========================================================================
    // EIXO 3: GOVERNANÇA & RELAÇÕES SOCIETÁRIAS (Perguntas 15 a 18)
    // =========================================================================
    {
        id: 15,
        pillarId: "familia_negocio",
        dimension: "Estruturas de Governança Societária",
        bscPerspective: "financeiro",
        horizon: "estruturante",
        title: "Diferenciação Clara entre Proprietário e Gestor",
        description: "Os papéis de sócio/acionista e de gestor operacional estão claramente diferenciados em relação a responsabilidades e remunerações?",
        tip: "Separar o papel de dono (dividendos e diretrizes societárias) do papel de executivo (pró-labore por função e metas de desempenho) é o pilar central da perenidade corporativa."
    },
    {
        id: 16,
        pillarId: "familia_negocio",
        dimension: "Estruturas de Governança Societária",
        bscPerspective: "financeiro",
        horizon: "estruturante",
        title: "Regras Formais para Conflitos e Acordos de Sócios",
        description: "Existem critérios claros, acordos de sócios ou protocolos definidos para lidar com situações em que interesses individuais e da empresa possam divergir?",
        tip: "Formalizar acordos de sócios e regras de conduta societária blinda o patrimônio da empresa contra divergências particulares e assegura estabilidade institucional."
    },
    {
        id: 17,
        pillarId: "familia_negocio",
        dimension: "Plano de Sucessão e Continuidade",
        bscPerspective: "aprendizado",
        horizon: "estruturante",
        title: "Clareza sobre Posições-Chave e Sucessão Futura",
        description: "Existe clareza e planejamento sobre quem poderá assumir as posições-chave no futuro e quais competências serão exigidas?",
        tip: "Planejar a sucessão com antecedência evita crises de liderança e insegurança junto a bancos, clientes e fornecedores em períodos de transição geracional."
    },
    {
        id: 18,
        pillarId: "familia_negocio",
        dimension: "Plano de Sucessão e Continuidade",
        bscPerspective: "aprendizado",
        horizon: "estruturante",
        title: "Preparação Gradual de Potenciais Sucessores",
        description: "Potenciais sucessores ou novos líderes estão sendo formados e preparados para assumir gradualmente maiores responsabilidades?",
        tip: "A preparação prática e gradual de novos gestores e sucessores assegura a retenção da cultura do negócio e a perenidade do patrimônio construído."
    },

    // =========================================================================
    // EIXO 4: PESSOAS & EQUIPE (Perguntas 19 a 22)
    // =========================================================================
    {
        id: 19,
        pillarId: "pessoas",
        dimension: "Competência e Qualificação Técnica",
        bscPerspective: "aprendizado",
        horizon: "quick_win",
        title: "Competência Ocupacional em Posições Estratégicas",
        description: "As pessoas que ocupam posições-chave no operacional, vendas e administrativo possuem as qualificações necessárias para desempenhá-las?",
        tip: "Colocar os profissionais certos nas funções críticas da operação, finanças e comercial é o fator mais determinante para a competitividade da empresa."
    },
    {
        id: 20,
        pillarId: "pessoas",
        dimension: "Competência e Qualificação Técnica",
        bscPerspective: "aprendizado",
        horizon: "estruturante",
        title: "Identificação de Necessidades e Treinamento",
        description: "A empresa identifica com antecedência as necessidades de desenvolvimento e capacita seus profissionais para os desafios do negócio?",
        tip: "Treinamentos práticos voltados para a realidade do negócio reduzem erros operacionais, elevam a produtividade e aumentam a retenção de talentos."
    },
    {
        id: 21,
        pillarId: "pessoas",
        dimension: "Protagonismo e Atitude Profissional",
        bscPerspective: "processos",
        horizon: "quick_win",
        title: "Responsabilidade por Resultados e Iniciativa",
        description: "Os colaboradores assumem responsabilidade pelos seus resultados e demonstram iniciativa para solucionar problemas e sugerir melhorias?",
        tip: "Incentivar uma cultura de responsabilidade (accountability) e iniciativa descentralizada libera os diretores para focar em inovação e novas vendas."
    },
    {
        id: 22,
        pillarId: "pessoas",
        dimension: "Protagonismo e Atitude Profissional",
        bscPerspective: "aprendizado",
        horizon: "estruturante",
        title: "Relações Profissionais Equânimes e Respeitosas",
        description: "As relações de trabalho são conduzidas com respeito, profissionalismo e critérios iguais de cobrança e reconhecimento para todos?",
        tip: "Critérios de avaliação justos e transparentes sem privilégios geram um clima de trabalho de alto engajamento, confiança mútua e dedicação."
    },

    // =========================================================================
    // EIXO 5: CULTURA & AMBIENTE ORGANIZACIONAL (Perguntas 23 e 24)
    // =========================================================================
    {
        id: 23,
        pillarId: "cultura_ambiente",
        dimension: "Valores Corporativos e Coerência",
        bscPerspective: "clientes",
        horizon: "quick_win",
        title: "Coerência entre Valores Declarados e Práticas",
        description: "Existe coerência real entre os valores que a empresa declara para o mercado e os comportamentos que ela efetivamente valoriza e pratica no dia a dia?",
        tip: "A reputação e a solidez da empresa no mercado dependem da coerência ética entre o que a liderança prega e o que é tolerado na prática cotidiana."
    },
    {
        id: 24,
        pillarId: "cultura_ambiente",
        dimension: "Valores Corporativos e Coerência",
        bscPerspective: "clientes",
        horizon: "quick_win",
        title: "Preservação da Identidade e Abertura à Inovação",
        description: "A empresa consegue preservar sua identidade e seus diferenciais históricos sem resistir às inovações necessárias para continuar crescendo?",
        tip: "Equilibrar a tradição e os valores essenciais com modernização tecnológica e processos ágeis é o segredo das empresas mais lucrativas e longevas do mercado."
    }
];

// Níveis de Maturidade Empresarial
const MATURITY_LEVELS = [
    {
        min: 0,
        max: 39.9,
        level: "Nível 1: Gestão Informal / Centralizada",
        badgeColor: "badge-danger",
        tag: "Urgência Alta",
        headline: "Alerta de Gestão: Elevada Centralização e Riscos Operacionais",
        summary: "Sua empresa opera em estágio predominantemente intuitivo, com forte dependência dos proprietários e escassa formalização de processos. A ausência de comitês estruturados e de planejamento sucessório expõe a organização a vulnerabilidades de continuidade e atritos decisórios. Uma intervenção executiva é prioritária para estancar desperdícios e estruturar as bases de governança.",
        actionPoints: [
            "Instituir reuniões periódicas de gestão com pauta estratégica e decisões documentadas.",
            "Mapear os processos operacionais críticos para eliminar a dependência exclusiva de pessoas-chave.",
            "Implantar separação formal entre as finanças dos sócios e as contas da empresa.",
            "Definir e capacitar lideranças intermediárias para assumir rotinas operacionais com autonomia."
        ]
    },
    {
        min: 40,
        max: 59.9,
        level: "Nível 2: Em Transição / Gestão em Estruturação",
        badgeColor: "badge-warning",
        tag: "Atenção Prioritária",
        headline: "Fase de Transição: Controles em Implantação e Desafios de Delegação",
        summary: "A empresa já iniciou um movimento consistente em direção à modernização, implementando controles básicos e delegando tarefas. No entanto, ainda ocorrem gargalos na autonomia das lideranças, sobreposição de papéis e falta de tempestividade nos indicadores. O momento exige formalizar comitês executivos, implantar orçamentos e consolidar acordos societários.",
        actionPoints: [
            "Formalizar o Comitê Estratégico com alçadas, cronograma e atribuições documentadas.",
            "Estruturar orçamento anual e metas setoriais com acompanhamento mensal via painéis de BI.",
            "Implantar critérios claros de avaliação de desempenho e remuneração alinhados a resultados.",
            "Iniciar o mapeamento formal de competências e o planejamento de sucessão nas posições críticas."
        ]
    },
    {
        min: 60,
        max: 79.9,
        level: "Nível 3: Gestão Estruturada / Governança Funcional",
        badgeColor: "badge-info",
        tag: "Bom Desempenho",
        headline: "Estrutura Consolidada: Líderes com Autonomia e Práticas Alinhadas",
        summary: "Sua empresa demonstra sólida maturidade gerencial. Há delegação efetiva de autoridade, clima de colaboração entre as equipes e acompanhamento de indicadores. O próximo salto estratégico consiste em formalizar o conselho consultivo, desdobrar metas via Balanced Scorecard e estruturar o plano de sucessão de longo prazo.",
        actionPoints: [
            "Consolidar a estrutura de Governança com reuniões periódicas de Conselho Consultivo.",
            "Estruturar o Plano de Continuidade e Sucessão com trilhas práticas para futuros líderes.",
            "Integrar plenamente indicadores de clientes, processos e pessoas ao Balanced Scorecard (BSC).",
            "Fomentar a cultura de prestação de contas (accountability) em todos os níveis da empresa."
        ]
    },
    {
        min: 80,
        max: 100,
        level: "Nível 4: Alta Performance / Excelência Corporativa",
        badgeColor: "badge-success",
        tag: "Referência de Mercado",
        headline: "Maturidade de Referência: Eficiência Operacional e Perenidade do Negócio",
        summary: "Parabéns! Sua organização opera em padrão de excelência executiva. Consegue equilibrar com maestria a identidade da empresa com gestão meritocrática, comitês estratégicos ativos, cultura orientada a resultados e acompanhamento holístico do desempenho econômico e operacional.",
        actionPoints: [
            "Avaliar a expansão do Conselho com a integração de conselheiros independentes de mercado.",
            "Acelerar a inovação e o crescimento da marca preservando a cultura e os valores essenciais.",
            "Realizar auditorias anuais de governança e alinhamento de expectativas societárias.",
            "Posicionar as melhores práticas da empresa como referência de competitividade no segmento."
        ]
    }
];

// Cargos Executivos / Papéis de Decisão
const ROLES = [
    { id: "socio_fundador", label: "Sócio-Fundador / Proprietário", icon: "fas fa-crown" },
    { id: "socio_cotista", label: "Sócio / Acionista (Conselho)", icon: "fas fa-coins" },
    { id: "sucessor_familiar", label: "Sucessor / Nova Geração Executiva", icon: "fas fa-seedling" },
    { id: "diretor_executivo", label: "Diretor Executivo / CEO", icon: "fas fa-user-tie" },
    { id: "comite_estrategico", label: "Membro do Comitê Executivo / Conselho", icon: "fas fa-handshake" },
    { id: "gerente_gestor", label: "Gerente / Coordenador de Área", icon: "fas fa-chart-pie" },
    { id: "outro_cargo", label: "Consultor / Especialista de Gestão", icon: "fas fa-user" }
];
