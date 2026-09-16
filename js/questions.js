/**
 * Base de Perguntas para Diagnóstico e Mentoria de Empresas Familiares
 * Metodologia: Taís Trevisol Scherner (2024), M.Sc. em Administração (Estratégia e Competitividade - Unoesc).
 * Fundamentação Teórica: Modelo Multidimensional de Profissionalização (Polat, 2020; Hiebl & Mayrleitner, 2019; Dekker et al., 2015).
 * Escala de maturidade de 1 a 5.
 */

const DIAGNOSTIC_FRAMEWORK = {
    author: "Taís Trevisol Scherner",
    credentials: "Mestra em Administração (Estratégia e Competitividade - Unoesc) • Especialista em Governança & Empresas Familiares",
    institution: "Universidade do Oeste de Santa Catarina (Unoesc)",
    methodology: "Matriz Multidimensional de Governança e Profissionalização da Empresa Familiar",
    theoreticalBase: "Polat (2020), Hiebl & Mayrleitner (2019), Dyer (2006), Dekker et al. (2015), Kaplan & Norton (1997)"
};

const PILLARS = [
    {
        id: "gestao",
        name: "Gestão",
        shortName: "Gestão",
        icon: "fas fa-user-tie",
        description: "Envolvimento não familiar na gestão, delegação de autoridade, conselho/comitê estratégico e liderança dos gerentes."
    },
    {
        id: "estrutura_processos",
        name: "Estrutura, Processos e Operações",
        shortName: "Estrutura & Processos",
        icon: "fas fa-cogs",
        description: "Estruturas formais, mecanismos de controle gerencial, práticas de RH e planejamento estratégico."
    },
    {
        id: "familia_negocio",
        name: "Família e Negócio",
        shortName: "Família & Negócio",
        icon: "fas fa-users-cog",
        description: "Mecanismos eficazes de governança, diferenciação de papéis societários e plano de sucessão."
    },
    {
        id: "pessoas",
        name: "Pessoas",
        shortName: "Pessoas",
        icon: "fas fa-users",
        description: "Competência ocupacional (técnica), capacitação contínua e profissionalismo comportamental da equipe."
    },
    {
        id: "cultura_ambiente",
        name: "Cultura e Ambiente de Trabalho",
        shortName: "Cultura & Ambiente",
        icon: "fas fa-landmark",
        description: "Valores profissionais compartilhados, coerência ética e preservação do legado familiar com inovação."
    }
];

const DEFAULT_OPTIONS = [
    { value: 1, label: "1 — Não acontece", desc: "A prática não existe ou não é observada na empresa." },
    { value: 2, label: "2 — Acontece pouco", desc: "Ocorre de maneira muito esporádica ou incipiente." },
    { value: 3, label: "3 — Acontece parcialmente", desc: "Acontece em algumas ocasiões ou áreas, mas sem padrão definitivo." },
    { value: 4, label: "4 — Acontece de forma consistente", desc: "Prática rotineira e bem aplicada na maior parte do tempo." },
    { value: 5, label: "5 — Está consolidado", desc: "Totalmente incorporado à cultura, processos e rotinas da empresa." }
];

const QUESTIONS = [
    // =========================================================================
    // PILAR 1: GESTÃO (Perguntas 1 a 7)
    // =========================================================================
    {
        id: 1,
        pillarId: "gestao",
        dimension: "Envolvimento não familiar na gestão",
        title: "Pergunta 1: Critérios Técnicos na Escolha de Gestores",
        description: "A escolha de pessoas para cargos de gestão considera competência, experiência e capacidade de entrega, independentemente do vínculo familiar?",
        tip: "Adotar critérios técnicos de seleção para cargos de liderança protege o patrimônio e legitima os gestores perante a equipe e o mercado, evitando o viés de bifurcação e o nepotismo desestruturado (Dyer, 1989; Chua et al., 2009)."
    },
    {
        id: 2,
        pillarId: "gestao",
        dimension: "Envolvimento não familiar na gestão",
        title: "Pergunta 2: Participação de Gestores Não Familiares",
        description: "Profissionais não familiares participam efetivamente das decisões relevantes da empresa?",
        tip: "Integrar profissionais não familiares nas decisões estratégicas traz visões isentas de mercado, atenua vieses emocionais e compensa eventuais lacunas de competência na família (Decker et al., 2015; Fang et al., 2022)."
    },
    {
        id: 3,
        pillarId: "gestao",
        dimension: "Delegação e descentralização da autoridade",
        title: "Pergunta 3: Autonomia Compatível com Resultados",
        description: "Os gestores possuem autonomia compatível com as responsabilidades e resultados pelos quais são cobrados?",
        tip: "Cobrar resultados sem conceder poder decisório desmotiva lideranças qualificadas e sobrecarrega a alta direção com microgestão diária (Polat, 2020; Chua et al., 2009)."
    },
    {
        id: 4,
        pillarId: "gestao",
        dimension: "Delegação e descentralização da autoridade",
        title: "Pergunta 4: Agilidade nas Decisões do Dia a Dia",
        description: "As decisões do dia a dia acontecem sem depender constantemente da aprovação dos proprietários?",
        tip: "A dependência excessiva dos proprietários para rotinas operacionais engessa o ritmo da operação e impede a empresa de ganhar escala e competitividade (Howorth et al., 2016)."
    },
    {
        id: 5,
        pillarId: "gestao",
        dimension: "Profissionalização do conselho/comitê",
        title: "Pergunta 5: Espaço Estruturado para Estratégia",
        description: "A empresa possui um espaço estruturado para discutir estratégia, resultados e decisões relevantes?",
        tip: "Reuniões periódicas de comitê estratégico ou conselho de gestão separam as urgências da rotina da visão estratégica de médio e longo prazo, promovendo decisões plurais e fundamentadas (Habba et al., 2022; Scherner, 2024)."
    },
    {
        id: 6,
        pillarId: "gestao",
        dimension: "Profissionalismo dos gerentes",
        title: "Pergunta 6: Competência Técnica das Lideranças",
        description: "Os gestores possuem as competências necessárias para as responsabilidades que exercem?",
        tip: "Mapear o perfil de competências de cada líder frente aos desafios do cargo previne gargalos de produtividade e eleva o padrão de entrega dos setores (Hall & Nordqvist, 2008)."
    },
    {
        id: 7,
        pillarId: "gestao",
        dimension: "Profissionalismo dos gerentes",
        title: "Pergunta 7: Avaliação e Desenvolvimento de Gestores",
        description: "A empresa desenvolve e avalia seus gestores de acordo com as necessidades atuais e futuras do negócio?",
        tip: "Planos de capacitação continuada e avaliações periódicas preparam as lideranças para sustentar os novos ciclos de expansão, inovação e governança da organização (Hiebl & Mayrleitner, 2019)."
    },

    // =========================================================================
    // PILAR 2: ESTRUTURA, PROCESSOS E OPERAÇÕES (Perguntas 8 a 14)
    // =========================================================================
    {
        id: 8,
        pillarId: "estrutura_processos",
        dimension: "Estruturas organizacionais e operacionais formais",
        title: "Pergunta 8: Clareza de Responsabilidades e Limites",
        description: "As responsabilidades, funções e limites de atuação estão claramente definidos?",
        tip: "Um organograma formalizado com papéis, atribuições e limites de autoridade documentados previne sobreposição de funções, conflitos internos e retrabalho (Mucci, 2020; Decker et al., 2013)."
    },
    {
        id: 9,
        pillarId: "estrutura_processos",
        dimension: "Estruturas organizacionais e operacionais formais",
        title: "Pergunta 9: Independência dos Principais Processos",
        description: "Os principais processos estão estruturados de forma que não dependam excessivamente de determinadas pessoas?",
        tip: "Processos documentados e padronizados evitam que a operação fique refém do conhecimento tácito ou da presença física de colaboradores específicos (Howorth et al., 2016)."
    },
    {
        id: 10,
        pillarId: "estrutura_processos",
        dimension: "Mecanismos formais de controle",
        title: "Pergunta 10: Indicadores e Informações Confiáveis",
        description: "A empresa possui informações e indicadores confiáveis e suficientes para acompanhar seus principais resultados?",
        tip: "Contar com um sistema de gestão integrado (ERP) e dados fidedignos é a base para diagnósticos precisos e para evitar surpresas na rentabilidade e no caixa (Hiebl & Mayrleitner, 2019)."
    },
    {
        id: 11,
        pillarId: "estrutura_processos",
        dimension: "Mecanismos formais de controle",
        title: "Pergunta 11: Uso dos Indicadores nas Decisões",
        description: "Os controles e indicadores são efetivamente utilizados para identificar desvios e orientar decisões?",
        tip: "Gerar relatórios só gera valor quando a liderança analisa desvios com tempestividade (ex: via Business Intelligence) e adota ações corretivas fundamentadas (Songini et al., 2023)."
    },
    {
        id: 12,
        pillarId: "estrutura_processos",
        dimension: "Práticas profissionais de RH",
        title: "Pergunta 12: Critérios Claros em Práticas de RH",
        description: "Contratações, promoções, remunerações e desligamentos seguem critérios claros de competência e desempenho?",
        tip: "Políticas salariais objetivas e sistemas de incentivo vinculados a metas reduzem o sentimento de injustiça, mitigam passivos trabalhistas e diminuem a rotatividade (turnover) da equipe (Santos & Silva, 2018)."
    },
    {
        id: 13,
        pillarId: "estrutura_processos",
        dimension: "Planejamento estratégico",
        title: "Pergunta 13: Prioridades Estratégicas Conhecidas",
        description: "A empresa possui prioridades estratégicas claramente definidas e conhecidas pelos gestores?",
        tip: "A comunicação transparente das prioridades estratégicas assegura que todos os setores caminhem na mesma direção, alocando recursos onde há maior retorno potencial (Rieley & Clarkson, 2001)."
    },
    {
        id: 14,
        pillarId: "estrutura_processos",
        dimension: "Planejamento estratégico",
        title: "Pergunta 14: Desdobramento em Metas e Planos de Ação",
        description: "Os objetivos estratégicos são transformados em metas, indicadores e planos de ação acompanhados ao longo do tempo?",
        tip: "Desdobrar grandes objetivos em metas mensuráveis de curto e médio prazo transforma a visão dos fundadores em ações práticas e executáveis no dia a dia (Kaplan & Norton, 1997; Polat, 2020)."
    },

    // =========================================================================
    // PILAR 3: FAMÍLIA E NEGÓCIO (Perguntas 15 a 18)
    // =========================================================================
    {
        id: 15,
        pillarId: "familia_negocio",
        dimension: "Mecanismos eficazes de governança",
        title: "Pergunta 15: Diferenciação entre Proprietário, Familiar e Gestor",
        description: "Os papéis de proprietário, familiar e gestor estão claramente diferenciados?",
        tip: "Diferenciar quem é proprietário/sócio, quem é membro da família e quem atua na gestão executiva é a chave para proteger a harmonia familiar e a eficiência empresarial (Habba et al., 2022)."
    },
    {
        id: 16,
        pillarId: "familia_negocio",
        dimension: "Mecanismos eficazes de governança",
        title: "Pergunta 16: Critérios para Atuação e Conflitos de Interesse",
        description: "Existem critérios claros para a atuação dos familiares e para situações em que os interesses da família e da empresa possam divergir?",
        tip: "Um protocolo ou constituição familiar formalizado estabelece regras claras de entrada, remuneração e conduta, blindando a empresa de divergências pessoais (Arteaga & Menéndez-Requejo, 2017; Polat, 2020)."
    },
    {
        id: 17,
        pillarId: "familia_negocio",
        dimension: "Plano de sucessão",
        title: "Pergunta 17: Clareza sobre Posições-Chave e Sucessão",
        description: "Existe clareza sobre quem poderá assumir posições-chave no futuro e quais competências serão necessárias?",
        tip: "Planejar a sucessão com antecedência evita vácuos de poder e insegurança junto a clientes, instituições financeiras e colaboradores em momentos de transição geracional (Hillen & Lavarda, 2021)."
    },
    {
        id: 18,
        pillarId: "familia_negocio",
        dimension: "Plano de sucessão",
        title: "Pergunta 18: Preparação Gradual de Potenciais Sucessores",
        description: "Potenciais sucessores estão sendo preparados para assumir gradualmente maiores responsabilidades?",
        tip: "A formação gradual e prática de sucessores (familiares ou talentos internos promovidos) assegura a retenção do know-how do negócio e a perenidade do patrimônio (Yeh & Liao, 2021; Scherner, 2024)."
    },

    // =========================================================================
    // PILAR 4: PESSOAS (Perguntas 19 a 22)
    // =========================================================================
    {
        id: 19,
        pillarId: "pessoas",
        dimension: "Competência ocupacional",
        title: "Pergunta 19: Competência em Posições Estratégicas",
        description: "As pessoas que ocupam posições-chave possuem as competências necessárias para desempenhá-las?",
        tip: "Contar com profissionais qualificados nas posições vitais da operação, do comercial e das finanças é o diferencial decisivo para sustentar a competitividade e o crescimento sustentável (Madison et al., 2018)."
    },
    {
        id: 20,
        pillarId: "pessoas",
        dimension: "Competência ocupacional",
        title: "Pergunta 20: Identificação de Necessidades e Treinamento",
        description: "A empresa identifica necessidades de desenvolvimento e prepara seus profissionais de acordo com as necessidades do negócio?",
        tip: "Treinamentos direcionados para as dores reais da operação (como programas internos de formação) elevam a produtividade e fortalecem o comprometimento da equipe (Utrilla & Grande-Torraleja, 2022)."
    },
    {
        id: 21,
        pillarId: "pessoas",
        dimension: "Profissionalismo comportamental",
        title: "Pergunta 21: Responsabilidade por Resultados e Iniciativa",
        description: "Os colaboradores assumem responsabilidade pelos resultados e demonstram iniciativa para resolver problemas e propor melhorias?",
        tip: "Fomentar a cultura de prestação de contas (accountability) e o protagonismo estimula a inovação e libera a diretoria para atuar na expansão dos negócios (Rieley & Clarkson, 2001)."
    },
    {
        id: 22,
        pillarId: "pessoas",
        dimension: "Profissionalismo comportamental",
        title: "Pergunta 22: Relações Profissionais com Critérios Semelhantes",
        description: "As relações profissionais são conduzidas com respeito, responsabilidade e critérios semelhantes, independentemente de vínculos pessoais ou familiares?",
        tip: "Tratamento equânime e regras profissionais idênticas para familiares e não familiares eliminam o viés de bifurcação e criam um clima organizacional justo, ético e engajador (Madison et al., 2018; Habba et al., 2022)."
    },

    // =========================================================================
    // PILAR 5: CULTURA E AMBIENTE DE TRABALHO (Perguntas 23 e 24)
    // =========================================================================
    {
        id: 23,
        pillarId: "cultura_ambiente",
        dimension: "Valores profissionais compartilhados",
        title: "Pergunta 23: Coerência entre Valores Declarados e Práticas",
        description: "Existe coerência entre os valores que a empresa declara e os comportamentos que efetivamente reconhece, promove e tolera?",
        tip: "A credibilidade da governança reside no alinhamento diário entre o discurso ético pregado pela família e as atitudes reais praticadas e toleradas na empresa (Simons, 1995; Oro & Lavarda, 2019)."
    },
    {
        id: 24,
        pillarId: "cultura_ambiente",
        dimension: "Valores profissionais compartilhados",
        title: "Pergunta 24: Preservação da História e Abertura a Mudanças",
        description: "A empresa consegue preservar os valores importantes de sua história sem impedir mudanças necessárias para seu crescimento?",
        tip: "Preservar a essência e a riqueza socioemocional (SEW) do negócio enquanto se modernizam processos e governança é o grande diferencial competitivo de empresas familiares longevas (Hall & Nordqvist, 2008; Teston & Filippim, 2016)."
    }
];

// Perfis de Maturidade com base no percentual total de pontuação
const MATURITY_LEVELS = [
    {
        min: 0,
        max: 39.9,
        level: "Nível 1: Gestão Informal / Centralizada",
        badgeColor: "badge-danger",
        tag: "Urgência Alta",
        headline: "Alerta Crítico: Forte Centralização e Vulnerabilidades de Governança",
        summary: "Sua empresa opera em estágio predominantemente intuitivo, com forte dependência dos proprietários e escassa formalização de processos. A ausência de órgãos colegiados e de alinhamento sucessório expõe a organização a riscos de descontinuidade e atritos familiares. Uma intervenção imediata de governança é essencial para estancar perdas e profissionalizar as bases de gestão.",
        actionPoints: [
            "Instituir reuniões regulares de alinhamento com pauta fixa e registro de decisões.",
            "Mapear os processos críticos para eliminar a dependência exclusiva de pessoas específicas.",
            "Iniciar a separação formal entre as finanças pessoais dos sócios e as contas da empresa.",
            "Identificar potenciais líderes internos para assumir rotinas operacionais descentralizadas."
        ]
    },
    {
        min: 40,
        max: 59.9,
        level: "Nível 2: Em Transição / Profissionalização Inicial",
        badgeColor: "badge-warning",
        tag: "Atenção Necessária",
        headline: "Fase de Transição: Primeiros Controles com Desafios de Descentralização",
        summary: "A empresa já iniciou o movimento em direção à profissionalização, implementando algumas rotinas e buscando apoio em lideranças. Contudo, ainda enfrenta resistência na delegação de autoridade, sobreposição de papéis entre familiares e gestores e carência de indicadores integrados. O momento exige formalizar comitês estratégicos e definir regras claras de convivência societária.",
        actionPoints: [
            "Formalizar o Comitê Estratégico com atribuições, alçadas e responsabilidades claramente documentadas.",
            "Estabelecer orçamento anual e metas setoriais acompanhadas com tempestividade via ERP/BI.",
            "Definir políticas claras de RH (remuneração, avaliação e feedback) para evitar o viés de bifurcação.",
            "Iniciar discussões estruturadas sobre o futuro da gestão e o plano de sucessão."
        ]
    },
    {
        min: 60,
        max: 79.9,
        level: "Nível 3: Gestão Estruturada / Governança Funcional",
        badgeColor: "badge-info",
        tag: "Bom Desempenho",
        headline: "Estrutura Consolidada: Gestores com Autonomia e Práticas Alinhadas",
        summary: "Sua empresa demonstra um nível consistente de maturidade. Há delegação efetiva de autoridade, clima de confiança mútua entre membros familiares e não familiares e práticas regulares de monitoramento. O próximo salto estratégico consiste em formalizar o protocolo familiar/conselho, estruturar o plano de sucessão de longo prazo e desdobrar metas via Balanced Scorecard.",
        actionPoints: [
            "Formalizar a Constituição / Protocolo Familiar e instituir o Conselho de Família.",
            "Estruturar o Plano Formal de Sucessão com trilhas de preparação para potenciais sucessores.",
            "Integrar indicadores financeiros e não financeiros (Balanced Scorecard: clientes, processos, pessoas).",
            "Fomentar a cultura de prestação de contas (accountability) em todos os níveis hierárquicos."
        ]
    },
    {
        min: 80,
        max: 100,
        level: "Nível 4: Alta Performance / Governança Consolidada",
        badgeColor: "badge-success",
        tag: "Referência de Gestão",
        headline: "Maturidade de Referência: Perpetuidade do Negócio e Preservação do Legado",
        summary: "Parabéns! Sua empresa atingiu um padrão de excelência corporativa. Consegue equilibrar com maestria a preservação da riqueza socioemocional e dos valores familiares com uma gestão meritocrática, comitês estratégicos ativos, cultura de feedback e monitoramento abrangente de desempenho econômico e não financeiro.",
        actionPoints: [
            "Consolidar o Conselho de Administração com a participação de conselheiros independentes.",
            "Fomentar a inovação e expansão contínua no mercado preservando a essência e o legado dos fundadores.",
            "Revisar periodicamente o alinhamento das expectativas patrimoniais entre as gerações familiares.",
            "Compartilhar as melhores práticas de governança como referência no segmento de atuação."
        ]
    }
];

// Cargos pré-configurados com descrições executivas
const ROLES = [
    { id: "socio_proprietario", label: "Sócio / Proprietário / Fundador", icon: "fas fa-crown" },
    { id: "membro_familia", label: "Membro da Família (Sucessor / Acionista)", icon: "fas fa-users-cog" },
    { id: "ceo_diretor", label: "Diretor Executivo / CEO", icon: "fas fa-user-tie" },
    { id: "gerente_gestor", label: "Gerente / Coordenador de Área", icon: "fas fa-chart-pie" },
    { id: "conselheiro", label: "Conselheiro / Membro do Comitê Estratégico", icon: "fas fa-handshake" },
    { id: "outro_cargo", label: "Outro Cargo de Gestão / Liderança", icon: "fas fa-user" }
];
