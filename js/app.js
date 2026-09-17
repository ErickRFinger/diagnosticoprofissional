/**
 * Auditoria de Margem & Processos
 * Diagnóstico Empresarial de Eficiência Operacional, Governança & DRE
 * Visual Tech (2026)
 */

document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------------------------------------
    // ESTADO CENTRAL DA APLICAÇÃO
    // -------------------------------------------------------------
    const state = {
        theme: localStorage.getItem("app_theme") || "light",
        currentStep: "welcome", // "welcome" | "quiz" | "results"
        currentPillarIndex: 0,
        currentQuestionIndex: 0,
        userData: {
            isAnonymous: false,
            name: "",
            company: "",
            role: "socio_fundador",
            roleLabel: "Sócio-Fundador / Proprietário (Membro Familiar)",
            segment: "Empresa de Pequeno Porte (EPP)",
            phone: "",
            email: ""
        },
        answers: {}, // { 1: 5, 2: 3, ... }
        calculatedResults: null,
        activeGapFilter: "all"
    };

    window.appState = state;

    let radarChartInstance = null;

    // -------------------------------------------------------------
    // ELEMENTOS DOM
    // -------------------------------------------------------------
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    const themeIcon = document.getElementById("theme-icon");
    const welcomeScreen = document.getElementById("welcome-screen");
    const quizScreen = document.getElementById("quiz-screen");
    const resultsScreen = document.getElementById("results-screen");

    const onboardingForm = document.getElementById("onboarding-form");
    const rolesContainer = document.getElementById("roles-container");
    const anonymousToggle = document.getElementById("anonymous-toggle");
    const anonymousCard = document.querySelector(".anonymous-toggle-card");

    const clientNameInput = document.getElementById("client-name");
    const clientCompanyInput = document.getElementById("client-company");
    const clientPhoneInput = document.getElementById("client-phone");
    const clientEmailInput = document.getElementById("client-email");
    const clientSegmentSelect = document.getElementById("client-segment");

    // Elementos da Questão Ativa (1 por vez, pergunta maior, respostas compactas)
    const singleQuestionCard = document.getElementById("single-question-card");
    const activeQBadge = document.getElementById("active-q-badge");
    const activeQDimension = document.getElementById("active-q-dimension");
    const activeQDre = document.getElementById("active-q-dre");
    const activeQStatus = document.getElementById("active-q-status");
    const activeQTitle = document.getElementById("active-q-title");
    const activeQDesc = document.getElementById("active-q-desc");
    const activeOptionsContainer = document.getElementById("active-options-container");
    const currentQNumEl = document.getElementById("current-q-num");

    const pillarTabsContainer = document.getElementById("pillar-tabs");
    const progressBarFill = document.getElementById("progress-bar-fill");
    const progressCountEl = document.getElementById("progress-count");
    const progressPercentEl = document.getElementById("progress-percent");

    const prevQuestionBtn = document.getElementById("prev-question-btn");
    const nextQuestionBtn = document.getElementById("next-question-btn");
    const finishQuizBtn = document.getElementById("finish-quiz-btn");
    const fillSampleBtn = document.getElementById("fill-sample-btn");
    const resetAnswersBtn = document.getElementById("reset-answers-btn");

    const toastEl = document.getElementById("toast-notification");
    const toastMessageEl = document.getElementById("toast-message");

    const loadJsonBtn = document.getElementById("load-json-btn");
    const jsonFileInput = document.getElementById("json-file-input");
    const exportJsonBtn = document.getElementById("export-json-btn");
    const navBrandLink = document.getElementById("nav-brand-link");

    // -------------------------------------------------------------
    // 1. GERENCIAMENTO DE TEMA (CLARO / ESCURO)
    // -------------------------------------------------------------
    function applyTheme(theme) {
        state.theme = theme;
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("app_theme", theme);

        if (theme === "dark") {
            themeIcon.className = "fas fa-sun";
            themeToggleBtn.setAttribute("title", "Alternar para Modo Claro");
        } else {
            themeIcon.className = "fas fa-moon";
            themeToggleBtn.setAttribute("title", "Alternar para Modo Escuro");
        }

        // Atualiza cores do gráfico Radar se já renderizado
        if (radarChartInstance && state.calculatedResults) {
            updateRadarChartTheme();
        }
    }

    applyTheme(state.theme);

    themeToggleBtn.addEventListener("click", () => {
        const newTheme = state.theme === "dark" ? "light" : "dark";
        applyTheme(newTheme);
        showToast(newTheme === "dark" ? "Modo Escuro ativado" : "Modo Claro ativado");
    });

    if (navBrandLink) {
        navBrandLink.addEventListener("click", (e) => {
            e.preventDefault();
            if (state.currentStep !== "welcome") {
                if (confirm("Deseja retornar à tela inicial? Seu progresso continuará salvo.")) {
                    goToStep("welcome");
                }
            }
        });
    }

    // -------------------------------------------------------------
    // 2. MODO ANÔNIMO / CONFIDENCIAL (Sugestão de Áudio da Autora)
    // -------------------------------------------------------------
    function setupAnonymousMode() {
        if (!anonymousToggle) return;

        anonymousToggle.addEventListener("change", (e) => {
            state.userData.isAnonymous = e.target.checked;
            if (anonymousCard) {
                anonymousCard.classList.toggle("active", e.target.checked);
            }

            const isAnon = e.target.checked;
            clientNameInput.disabled = isAnon;
            clientCompanyInput.disabled = isAnon;
            clientPhoneInput.disabled = isAnon;
            clientEmailInput.disabled = isAnon;

            if (isAnon) {
                clientNameInput.placeholder = "Confidencial (Modo Anônimo Ativo)";
                clientCompanyInput.placeholder = "Confidencial (Modo Anônimo Ativo)";
                clientPhoneInput.placeholder = "Não coletado";
                clientEmailInput.placeholder = "Não coletado";
                showToast("Modo Anônimo ativado: nenhum dado pessoal será solicitado.");
            } else {
                clientNameInput.placeholder = "Ex: Maria Santos";
                clientCompanyInput.placeholder = "Ex: Indústria Familiar Exemplo Ltda.";
                clientPhoneInput.placeholder = "Ex: (49) 99999-9999";
                clientEmailInput.placeholder = "Ex: gestao@empresa.com.br";
            }
        });
    }

    setupAnonymousMode();

    // -------------------------------------------------------------
    // 3. RENDERIZAÇÃO DOS CARGOS EXECUTIVOS
    // -------------------------------------------------------------
    function renderRoles() {
        if (!rolesContainer) return;
        rolesContainer.innerHTML = ROLES.map((role, idx) => `
            <label class="role-card">
                <input type="radio" name="userRole" value="${role.id}" ${idx === 0 ? "checked" : ""}>
                <div class="role-content">
                    <i class="${role.icon} role-icon"></i>
                    <span>${role.label}</span>
                </div>
            </label>
        `).join("");

        rolesContainer.querySelectorAll('input[name="userRole"]').forEach(input => {
            input.addEventListener("change", (e) => {
                const found = ROLES.find(r => r.id === e.target.value);
                if (found) {
                    state.userData.role = found.id;
                    state.userData.roleLabel = found.label;
                }
            });
        });
    }

    renderRoles();

    // -------------------------------------------------------------
    // 4. INÍCIO DO QUESTIONÁRIO & VALIDAÇÃO
    // -------------------------------------------------------------
    onboardingForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const isAnon = state.userData.isAnonymous;
        const nameInput = clientNameInput.value.trim();
        const companyInput = clientCompanyInput.value.trim();
        const phoneInput = clientPhoneInput.value.trim();
        const emailInput = clientEmailInput.value.trim();
        const segmentInput = clientSegmentSelect.value;

        const selectedRoleRadio = document.querySelector('input[name="userRole"]:checked');
        const roleId = selectedRoleRadio ? selectedRoleRadio.value : "socio_fundador";
        const roleObj = ROLES.find(r => r.id === roleId) || ROLES[0];

        state.userData = {
            isAnonymous: isAnon,
            name: isAnon ? "Participante Anônimo" : (nameInput || "Gestor(a)"),
            company: isAnon ? "Empresa Familiar (Confidencial)" : (companyInput || "Empresa Familiar"),
            role: roleObj.id,
            roleLabel: roleObj.label,
            segment: segmentInput,
            phone: isAnon ? "" : phoneInput,
            email: isAnon ? "" : emailInput
        };

        saveDraft();
        goToStep("quiz");
        const firstUnanswered = QUESTIONS.findIndex(q => state.answers[q.id] === undefined);
        state.currentQuestionIndex = firstUnanswered !== -1 ? firstUnanswered : 0;
        renderSingleQuestion(state.currentQuestionIndex);
        updateProgress();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // -------------------------------------------------------------
    // 5. NAVEGAÇÃO ENTRE TELAS
    // -------------------------------------------------------------
    function goToStep(step) {
        state.currentStep = step;
        welcomeScreen.style.display = step === "welcome" ? "block" : "none";
        quizScreen.style.display = step === "quiz" ? "block" : "none";
        resultsScreen.style.display = step === "results" ? "block" : "none";
    }

    // -------------------------------------------------------------
    // 6. RENDERIZAÇÃO PROGRESSIVA DO QUESTIONÁRIO (1 POR VEZ)
    // -------------------------------------------------------------
    function renderPillarTabs() {
        if (!pillarTabsContainer) return;
        pillarTabsContainer.innerHTML = PILLARS.map((pillar, index) => {
            const pillarQuestions = QUESTIONS.filter(q => q.pillarId === pillar.id);
            const answeredInPillar = pillarQuestions.filter(q => state.answers[q.id] !== undefined).length;
            const isCompleted = answeredInPillar === pillarQuestions.length;
            const currentQ = QUESTIONS[state.currentQuestionIndex];
            const isActive = currentQ && currentQ.pillarId === pillar.id;

            return `
                <button type="button" class="pillar-tab ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" data-index="${index}">
                    <i class="${pillar.icon}"></i>
                    <span>${index + 1}. ${pillar.shortName || pillar.name}</span>
                    ${isCompleted ? '<i class="fas fa-check-circle" style="margin-left: 3px;"></i>' : ''}
                </button>
            `;
        }).join("");

        pillarTabsContainer.querySelectorAll(".pillar-tab").forEach(tab => {
            tab.addEventListener("click", () => {
                const pIndex = parseInt(tab.getAttribute("data-index"), 10);
                const targetPillar = PILLARS[pIndex];
                const qIdx = QUESTIONS.findIndex(q => q.pillarId === targetPillar.id);
                if (qIdx !== -1) {
                    renderSingleQuestion(qIdx);
                }
            });
        });
    }

    function renderSingleQuestion(questionIndex) {
        if (questionIndex < 0) questionIndex = 0;
        if (questionIndex >= QUESTIONS.length) questionIndex = QUESTIONS.length - 1;

        state.currentQuestionIndex = questionIndex;
        const q = QUESTIONS[questionIndex];
        const pillarIndex = PILLARS.findIndex(p => p.id === q.pillarId);
        state.currentPillarIndex = pillarIndex !== -1 ? pillarIndex : 0;

        // Metadados
        if (currentQNumEl) currentQNumEl.textContent = questionIndex + 1;
        if (activeQBadge) activeQBadge.textContent = `Questão ${questionIndex + 1} de 24`;
        if (activeQDimension) {
            activeQDimension.innerHTML = `<i class="fas fa-layer-group"></i> ${q.dimension || 'Eficiência Operacional'}`;
        }

        // Impacto na DRE
        if (activeQDre) {
            const dreObj = DRE_IMPACTS && DRE_IMPACTS[q.dreImpact];
            if (dreObj) {
                activeQDre.innerHTML = `<i class="${dreObj.icon}"></i> DRE: ${dreObj.name}`;
                activeQDre.style.display = "inline-flex";
            } else {
                activeQDre.style.display = "none";
            }
        }

        // Status da resposta
        updateActiveQuestionStatus(q.id);

        // Pergunta em destaque MAIOR
        if (activeQTitle) activeQTitle.textContent = q.title;
        if (activeQDesc) activeQDesc.textContent = q.description;

        // Respostas MENORES e compactas (5 opções)
        const currentAnswer = state.answers[q.id];
        if (activeOptionsContainer) {
            activeOptionsContainer.innerHTML = DEFAULT_OPTIONS.map(opt => `
                <div class="compact-option-btn ${currentAnswer === opt.value ? 'selected' : ''}" data-val="${opt.value}">
                    <div class="compact-score-circle">${opt.value}</div>
                    <div class="compact-option-label">${opt.label}</div>
                    <div class="compact-option-desc">${opt.desc}</div>
                </div>
            `).join("");

            // Adiciona evento de clique nas opções
            activeOptionsContainer.querySelectorAll(".compact-option-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const val = parseInt(btn.getAttribute("data-val"), 10);
                    selectAnswerAndAutoAdvance(q.id, val);
                });
            });
        }

        updateNavigationButtons();
        renderPillarTabs();
        window.scrollTo({ top: 100, behavior: "smooth" });
    }

    function updateActiveQuestionStatus(qId) {
        if (!activeQStatus) return;
        const ans = state.answers[qId];
        if (ans !== undefined) {
            activeQStatus.innerHTML = `<span style="color: var(--accent); font-size: 0.85rem; font-weight: 700;"><i class="fas fa-check-circle"></i> Respondida (Nota ${ans}/5)</span>`;
        } else {
            activeQStatus.innerHTML = `<span style="color: var(--text-muted); font-size: 0.85rem;"><i class="far fa-circle"></i> Aguardando resposta</span>`;
        }
    }

    function selectAnswerAndAutoAdvance(questionId, val) {
        state.answers[questionId] = val;

        // Destaca imediatamente o botão clicado
        if (activeOptionsContainer) {
            activeOptionsContainer.querySelectorAll(".compact-option-btn").forEach(b => {
                const bVal = parseInt(b.getAttribute("data-val"), 10);
                b.classList.toggle("selected", bVal === val);
            });
        }

        updateActiveQuestionStatus(questionId);
        saveDraft();
        updateProgress();
        renderPillarTabs();

        // Auto-avanço suave para a próxima pergunta (260ms)
        setTimeout(() => {
            if (state.currentQuestionIndex < QUESTIONS.length - 1) {
                renderSingleQuestion(state.currentQuestionIndex + 1);
            } else {
                updateNavigationButtons();
                const allAnswered = QUESTIONS.every(q => state.answers[q.id] !== undefined);
                if (allAnswered) {
                    showToast("Todas as 24 questões foram respondidas! Pronto para concluir o diagnóstico.", "info");
                }
            }
        }, 260);
    }

    function updateNavigationButtons() {
        const qIndex = state.currentQuestionIndex;
        const total = QUESTIONS.length;
        const allAnswered = QUESTIONS.every(q => state.answers[q.id] !== undefined);

        // Botão Pergunta Anterior
        if (prevQuestionBtn) {
            prevQuestionBtn.style.visibility = qIndex > 0 ? "visible" : "hidden";
        }

        // Botão Próxima Pergunta
        if (nextQuestionBtn) {
            if (qIndex === total - 1) {
                nextQuestionBtn.style.display = "none";
            } else {
                nextQuestionBtn.style.display = "inline-flex";
            }
        }

        // Botão Concluir
        if (finishQuizBtn) {
            if (qIndex === total - 1 || allAnswered) {
                finishQuizBtn.style.display = "inline-flex";
            } else {
                finishQuizBtn.style.display = "none";
            }
        }
    }

    if (prevQuestionBtn) {
        prevQuestionBtn.addEventListener("click", () => {
            if (state.currentQuestionIndex > 0) {
                renderSingleQuestion(state.currentQuestionIndex - 1);
            }
        });
    }

    if (nextQuestionBtn) {
        nextQuestionBtn.addEventListener("click", () => {
            if (state.currentQuestionIndex < QUESTIONS.length - 1) {
                renderSingleQuestion(state.currentQuestionIndex + 1);
            }
        });
    }

    // -------------------------------------------------------------
    // 7. PROGRESSO EM TEMPO REAL
    // -------------------------------------------------------------
    function updateProgress() {
        const total = QUESTIONS.length;
        const answeredCount = Object.keys(state.answers).length;
        const percentage = Math.round((answeredCount / total) * 100);

        if (progressBarFill) progressBarFill.style.width = `${percentage}%`;
        if (progressCountEl) {
            progressCountEl.innerHTML = `<i class="fas fa-tasks"></i> Questão <strong id="current-q-num">${state.currentQuestionIndex + 1}</strong> de ${total} (${answeredCount} respondidas)`;
        }
        if (progressPercentEl) progressPercentEl.textContent = `${percentage}% concluído`;
    }

    // -------------------------------------------------------------
    // 8. AUTO-SAVE LOCALSTORAGE & BOTÕES DE DEMO/RESET
    // -------------------------------------------------------------
    function saveDraft() {
        try {
            const draft = {
                userData: state.userData,
                answers: state.answers,
                currentQuestionIndex: state.currentQuestionIndex,
                currentPillarIndex: state.currentPillarIndex,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem("diagnostic_draft_v2", JSON.stringify(draft));
        } catch (e) {
            console.warn("Falha ao salvar no localStorage", e);
        }
    }

    function loadDraft() {
        try {
            const raw = localStorage.getItem("diagnostic_draft_v2");
            if (!raw) return false;
            const draft = JSON.parse(raw);
            if (draft && draft.answers) {
                state.answers = draft.answers;
                if (draft.userData) state.userData = { ...state.userData, ...draft.userData };
                if (typeof draft.currentQuestionIndex === "number") {
                    state.currentQuestionIndex = draft.currentQuestionIndex;
                }
                return true;
            }
        } catch (e) {
            console.warn("Falha ao carregar rascunho", e);
        }
        return false;
    }

    if (fillSampleBtn) {
        fillSampleBtn.addEventListener("click", () => {
            // Preenche as 24 questões com valores representativos e equilibrados
            const sampleScores = [
                3, 4, 3, 2, 4, 3, 3, // Gestão (7 perguntas)
                4, 3, 2, 3, 3, 3, 2, // Processos (7 perguntas)
                3, 2, 2, 3,          // Governança (4 perguntas)
                4, 3, 3, 3,          // Pessoas (4 perguntas)
                4, 4                 // Cultura (2 perguntas)
            ];

            QUESTIONS.forEach((q, idx) => {
                state.answers[q.id] = sampleScores[idx] || 3;
            });

            saveDraft();
            renderSingleQuestion(state.currentQuestionIndex);
            updateProgress();
            renderPillarTabs();
            showToast("24 questões preenchidas com dados de demonstração!");
        });
    }

    if (resetAnswersBtn) {
        resetAnswersBtn.addEventListener("click", () => {
            if (confirm("Deseja limpar todas as respostas desta avaliação e reiniciar?")) {
                state.answers = {};
                state.currentQuestionIndex = 0;
                localStorage.removeItem("diagnostic_draft_v2");
                renderSingleQuestion(0);
                updateProgress();
                renderPillarTabs();
                showToast("Respostas reiniciadas!");
            }
        });
    }

    // -------------------------------------------------------------
    // 9. FINALIZAÇÃO E CÁLCULO ESTRATÉGICO
    // -------------------------------------------------------------
    if (finishQuizBtn) {
        finishQuizBtn.addEventListener("click", () => {
            const unanswered = QUESTIONS.filter(q => state.answers[q.id] === undefined);

            if (unanswered.length > 0) {
                const firstUnanswered = unanswered[0];
                const qIdx = QUESTIONS.findIndex(q => q.id === firstUnanswered.id);

                showToast(`Atenção: faltam ${unanswered.length} perguntas para concluir o diagnóstico. Respondendo questão ${firstUnanswered.id}...`, "warning");
                renderSingleQuestion(qIdx !== -1 ? qIdx : 0);
                return;
            }

            calculateResults();
            renderResultsScreen();
            goToStep("results");
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // -------------------------------------------------------------
    // 10. MOTOR DE CÁLCULO: PILARES, DRE & GAPS
    // -------------------------------------------------------------
    function calculateResults() {
        let totalPoints = 0;
        const maxPossiblePoints = QUESTIONS.length * 5; // 24 * 5 = 120 pontos

        // 10.1 Pontuação dos 5 Pilares
        const pillarScores = PILLARS.map(p => {
            const pQuestions = QUESTIONS.filter(q => q.pillarId === p.id);
            const pMax = pQuestions.length * 5;
            const pEarned = pQuestions.reduce((acc, q) => acc + (state.answers[q.id] || 0), 0);
            const pPercentage = pMax > 0 ? Math.round((pEarned / pMax) * 100) : 0;

            totalPoints += pEarned;

            return {
                ...p,
                earnedPoints: pEarned,
                maxPoints: pMax,
                percentage: pPercentage
            };
        });

        const overallPercentage = Math.round((totalPoints / maxPossiblePoints) * 100);

        // 10.2 Nível de Maturidade
        const maturity = MATURITY_LEVELS.find(lvl => overallPercentage >= lvl.min && overallPercentage <= lvl.max) || MATURITY_LEVELS[0];

        // 10.3 Pontuação nas 4 Linhas da DRE (Demonstração do Resultado)
        const dreScores = Object.values(DRE_IMPACTS).map(dre => {
            const dreQuestions = QUESTIONS.filter(q => q.dreImpact === dre.id);
            const dreMax = dreQuestions.length * 5;
            const dreEarned = dreQuestions.reduce((acc, q) => acc + (state.answers[q.id] || 0), 0);
            const drePercentage = dreMax > 0 ? Math.round((dreEarned / dreMax) * 100) : 0;

            let statusText = "Em Otimização";
            let statusColor = "var(--warning)";
            if (drePercentage >= 75) {
                statusText = "Impacto Positivo Consolidado";
                statusColor = "var(--accent)";
            } else if (drePercentage < 50) {
                statusText = "Gargalo Crítico de Margem";
                statusColor = "var(--danger)";
            }

            return {
                ...dre,
                questionsCount: dreQuestions.length,
                earnedPoints: dreEarned,
                maxPoints: dreMax,
                percentage: drePercentage,
                statusText,
                statusColor
            };
        });

        // 10.4 Lista de Gaps (Notas 1, 2 e 3) ordenados por criticidade
        const gaps = QUESTIONS
            .filter(q => (state.answers[q.id] || 0) <= 3)
            .map(q => ({
                question: q,
                score: state.answers[q.id] || 0,
                horizon: q.horizon || "quick_win"
            }))
            .sort((a, b) => a.score - b.score);

        // 10.5 Balanço Quantitativo das Respostas (1 a 5)
        const distribution = {
            5: { count: 0, percentage: 0, label: "Consolidado", group: "Excelência / Rotina Plena", color: "var(--scale-5)", bg: "var(--scale-5-bg)", border: "var(--scale-5)" },
            4: { count: 0, percentage: 0, label: "Consistente", group: "Estruturado / Formal", color: "var(--scale-4)", bg: "var(--scale-4-bg)", border: "var(--scale-4)" },
            3: { count: 0, percentage: 0, label: "Parcialmente", group: "Em Transição / Risco", color: "var(--scale-3)", bg: "var(--scale-3-bg)", border: "var(--scale-3)" },
            2: { count: 0, percentage: 0, label: "Acontece pouco", group: "Vulnerabilidade / Informal", color: "var(--scale-2)", bg: "var(--scale-2-bg)", border: "var(--scale-2)" },
            1: { count: 0, percentage: 0, label: "Não acontece", group: "Gargalo Crítico / Ausente", color: "var(--scale-1)", bg: "var(--scale-1-bg)", border: "var(--scale-1)" }
        };

        QUESTIONS.forEach(q => {
            const val = state.answers[q.id] || 1;
            if (distribution[val]) {
                distribution[val].count++;
            }
        });

        Object.keys(distribution).forEach(k => {
            distribution[k].percentage = Math.round((distribution[k].count / QUESTIONS.length) * 100);
        });

        const strengthsCount = distribution[5].count + distribution[4].count;
        const transitionCount = distribution[3].count;
        const criticalGapsCount = distribution[2].count + distribution[1].count;

        // 10.6 Palavra-Essência & Arquétipo da Organização
        let essenceWord = "ESTRUTURAÇÃO";
        let archetypeTitle = "Operação em Fase de Estruturação";
        let archetypeDesc = "A empresa apresenta expressivo volume de decisões informais e centralização. O desafio prioritário é instituir controles básicos e estancar perdas invisíveis na operação.";
        let insightHeadline = "Atenção Crítica aos Processos Básicos";
        let insightText = `Identificamos ${criticalGapsCount} práticas em nível crítico ou vulnerável (notas 1 e 2). É fundamental estabelecer alçadas e processos mínimos antes de tentar novas expansões.`;

        if (strengthsCount >= 16) {
            essenceWord = "CONSOLIDAÇÃO";
            archetypeTitle = "Operação Madura em Fase de Escala & Governança";
            archetypeDesc = "A organização opera com processos robustos, autonomia técnica dos gestores e clareza de indicadores. O momento é de refinamento fino de margens e governança avançada.";
            insightHeadline = "Base Forte para Alavancagem e Expansão";
            insightText = `Parabéns! ${strengthsCount} das 24 práticas avaliadas (${Math.round((strengthsCount/24)*100)}%) já operam em padrão consistente ou consolidado (notas 4 e 5). O foco é preservar a margem EBITDA e estruturar o conselho consultivo.`;
        } else if (transitionCount >= 8 || (distribution[3].count >= distribution[1].count && distribution[3].count >= distribution[5].count)) {
            essenceWord = "TRANSIÇÃO";
            archetypeTitle = "Empresa em Transição Crítica (O Gargalo da Delegação)";
            archetypeDesc = "A empresa cresceu e validou seu modelo comercial, mas sua governança interna ainda depende do esforço pessoal dos líderes. O risco de retrabalho e oscilação de margem é elevado.";
            insightHeadline = "Ponto de Inflexão: Transição Operacional";
            insightText = `${transitionCount} práticas estão em estágio parcial (nota 3). A empresa saiu do estágio inicial mas ainda não formalizou rotinas, gerando sobrecarga nas lideranças e oscilação de resultados.`;
        } else if (criticalGapsCount >= 10) {
            essenceWord = "ESTRUTURAÇÃO";
            archetypeTitle = "Operação em Vulnerabilidade (Cultura Apaga-Incêndios)";
            archetypeDesc = "Grande parte das rotinas não está formalizada e as decisões dependem dos proprietários. A falta de tempestividade financeira e de procedimentos expõe a empresa a riscos de caixa.";
            insightHeadline = "Vulnerabilidade Operacional e de Margem";
            insightText = `Atenção: ${criticalGapsCount} respostas apontam para processos inexistentes ou esporádicos (notas 1 e 2). O foco urgente deve ser a implantação de Vitórias Rápidas de controle de custos e fluxo de caixa.`;
        } else if (distribution[5].count >= 4 && distribution[1].count >= 4) {
            essenceWord = "ALINHAMENTO";
            archetypeTitle = "Operação Desbalanceada (Ilhas de Excelência & Pontos Cegos)";
            archetypeDesc = "A organização possui setores com alta maturidade convivendo com áreas desprovidas de controles básicos. Esse descompasso gera atrito entre departamentos e sangria de margem.";
            insightHeadline = "Desbalanceamento entre Eixos Estratégicos";
            insightText = `Há disparidade entre práticas altamente consolidadas (${distribution[5].count} respostas nota 5) e áreas com lacunas severas (${distribution[1].count} respostas nota 1). O alinhamento integrado é prioritário.`;
        } else {
            essenceWord = "EFICIÊNCIA";
            archetypeTitle = "Gestão Funcional em Otimização Contínua";
            archetypeDesc = "A empresa possui equilíbrio operacional razoável, com potencial de alavancagem rápida ao transformar práticas parciais em rotinas documentadas e integradas à DRE.";
            insightHeadline = "Equilíbrio Operacional com Oportunidades de Margem";
            insightText = `A organização possui ${strengthsCount} fortalezas e ${criticalGapsCount} gaps críticos. O plano de ação deve atacar os gargalos para liberar capacidade das lideranças.`;
        }

        // 10.7 Síntese da Leitura Confidencial da Consultoria
        const compName = state.userData.company || (state.userData.name ? `de ${state.userData.name}` : "da sua organização");
        const roleDesc = state.userData.roleLabel || "gestor(a)";

        const p1 = `A presente auditoria executiva da empresa ${compName}, respondida sob a ótica de ${roleDesc}, consolida um Índice Geral de Maturidade de <strong>${overallPercentage}%</strong> (${maturity.level}), totalizando <strong>${totalPoints} de 120 pontos possíveis</strong>. Ao analisarmos o padrão de dispersão das 24 questões fundamentais, observamos que <strong>${distribution[5].count} práticas</strong> atingiram o patamar de excelência plena (Nota 5), <strong>${distribution[4].count} práticas</strong> encontram-se estruturadas de forma consistente (Nota 4), <strong>${distribution[3].count} práticas</strong> operam em transição com padrão intermediário (Nota 3) e <strong>${criticalGapsCount} práticas</strong> representam vulnerabilidades críticas (Notas 1 e 2).`;

        let p2 = "";
        if (strengthsCount >= 10) {
            p2 = `O maior ativo estratégico do negócio reside na solidez dos processos avaliados com notas 4 e 5 (${strengthsCount} itens no total, representando ${Math.round((strengthsCount / 24) * 100)}% da operação). Essas práticas constituem a fortaleza que sustenta o faturamento e o relacionamento com o mercado. Quando a organização documenta e delega rotinas com critérios técnicos, ela blinda a primeira linha da DRE (Receita Bruta), criando a previsibilidade comercial necessária para planejar investimentos com serenidade.`;
        } else {
            p2 = `A operação demonstra competência comercial e capacidade de entrega, sustentada pelo esforço e dedicação diária da liderança. No entanto, o baixo número de práticas consolidadas (${strengthsCount} de 24) evidencia que os resultados atuais dependem fortemente da presença constante dos fundadores, sem um arcabouço procedural que garanta a replicação automática do padrão de qualidade.`;
        }

        let p3 = "";
        if (transitionCount >= 6) {
            p3 = `O principal ponto de atrito e dreno de margem concentra-se nas <strong>${transitionCount} práticas avaliadas com nota 3 (estágio parcial)</strong>. O nível 3 é a armadilha mais perigosa para médias e pequenas empresas: transmite a falsa impressão de que o processo existe, mas sua execução intermitente gera retrabalho, lentidão nas entregas e desgaste emocional das equipes. Esse vácuo operacional repercute de imediato na segunda e terceira linhas da DRE: eleva os <em>Custos Operacionais (CPV)</em> por ineficiência de tempo e inflaciona as <em>Despesas SG&A</em> pelo turnover e necessidade de supervisão constante.`;
        } else if (criticalGapsCount >= 6) {
            p3 = `O diagnóstico aponta <strong>${criticalGapsCount} pontos de fragilidade severa (notas 1 e 2)</strong> que drenam diretamente a rentabilidade final. A ausência de controles contábeis tempestivos, a carência de rituais colegiados de decisão e a indefinição de alçadas geram vazamentos silenciosos de caixa. Cada decisão tomada no improviso corrói pontos percentuais da <em>Margem EBITDA</em>, impedindo que o crescimento das vendas se transforme em sobra líquida de caixa.`;
        } else {
            p3 = `Embora a organização apresente consistência na maioria das áreas, os gaps pontuais identificados nas notas 1, 2 e 3 geram pequenos vazamentos de margem que reduzem o potencial de lucro da empresa. Eliminar esses atritos liberará tempo da diretoria para focar em parcerias estratégicas e no retorno sobre o capital próprio (ROE).`;
        }

        const p4 = `Para os próximos 90 dias, a orientação prioritária da consultoria não é criar burocracias pesadas, mas sim implantar a disciplina da governança prática. O foco deve ser atacar as <em>Vitórias Rápidas</em> nos primeiros 30 dias, formalizar o Comitê Estratégico com reuniões mensais fixas e alinhar os indicadores operacionais diretamente às quatro linhas da DRE. O sucesso da transição para o estágio de <em>${essenceWord}</em> transformará esforço isolado em valor patrimonial perene.`;

        const confidentialReading = { p1, p2, p3, p4 };

        // 10.8 Os 5 Pontos de Mentoria Estratégica
        const mentorshipPoints = [
            {
                num: 1,
                title: "Instituição de Reuniões Mensais de Resultados (Comitê)",
                action: "Separar as urgências cotidianas da estratégia de longo prazo com uma reunião mensal formal de diretoria, pauta fixa e acompanhamento de indicadores.",
                impact: "Governança & Margem EBITDA",
                dreLine: "Margem EBITDA"
            },
            {
                num: 2,
                title: "Mapeamento das 3 Maiores Rotinas de Retrabalho",
                action: "Documentar em formato visual simples (passo a passo de 1 página) os 3 procedimentos operacionais que mais causam dúvidas ou retrabalho na equipe.",
                impact: "Custos Operacionais & Produtividade",
                dreLine: "Custos CPV"
            },
            {
                num: 3,
                title: "Matriz de Alçadas e Limites de Autonomia",
                action: "Definir limites financeiros e operacionais para cada liderança intermediária, eliminando a dependência do sócio para aprovar rotinas cotidianas.",
                impact: "Despesas Administrativas & Agilidade",
                dreLine: "Despesas SG&A"
            },
            {
                num: 4,
                title: "Fechamento Mensal Tempestivo da DRE Gerencial",
                action: "Garantir que a DRE gerencial seja consolidada e apresentada até o 10º dia útil do mês subsequente, permitindo correções de curso antes do fechamento do caixa.",
                impact: "Margem Líquida & Fluxo de Caixa",
                dreLine: "Margem EBITDA"
            },
            {
                num: 5,
                title: "Acordo de Expectativas Societárias e Continuidade",
                action: "Alinhar formalmente os papéis dos sócios, a política de pró-labore vs distribuição de dividendos e as regras de entrada de familiares na gestão.",
                impact: "Perenidade & Governança Societária",
                dreLine: "Governança"
            }
        ];

        state.calculatedResults = {
            totalPoints,
            maxPossiblePoints,
            overallPercentage,
            maturity,
            pillarScores,
            dreScores,
            bscScores: dreScores, // retrocompatibilidade para componentes que leiam bscScores
            gaps,
            distribution,
            strengthsCount,
            transitionCount,
            criticalGapsCount,
            essenceWord,
            archetypeTitle,
            archetypeDesc,
            insightHeadline,
            insightText,
            confidentialReading,
            mentorshipPoints
        };
    }

    // -------------------------------------------------------------
    // 11. RENDERIZAÇÃO DA TELA DE RESULTADOS
    // -------------------------------------------------------------
    function renderResultsScreen() {
        const res = state.calculatedResults;
        if (!res) return;

        // Cabeçalho e Saudação
        const greetingEl = document.getElementById("results-greeting");
        if (state.userData.isAnonymous) {
            greetingEl.textContent = `Diagnóstico Empresarial • Modo Confidencial`;
        } else if (state.userData.name && state.userData.company) {
            greetingEl.textContent = `Diagnóstico de ${state.userData.name} • ${state.userData.company}`;
        } else if (state.userData.company) {
            greetingEl.textContent = `Diagnóstico Empresarial • ${state.userData.company}`;
        } else {
            greetingEl.textContent = `Diagnóstico de ${state.userData.name || 'Empresa'}`;
        }

        // Anel Circular SVG com Animação
        document.getElementById("score-circle-value").textContent = `${res.overallPercentage}%`;
        document.getElementById("score-points-text").textContent = `${res.totalPoints} de ${res.maxPossiblePoints} pontos`;
        document.getElementById("maturity-badge-text").textContent = res.maturity.level;
        document.getElementById("maturity-headline").textContent = res.maturity.headline;
        document.getElementById("maturity-summary").textContent = res.maturity.summary;

        // Animação do anel SVG
        const circleProgress = document.getElementById("score-svg-circle");
        if (circleProgress) {
            const circumference = 314.159;
            const offset = circumference - (circumference * res.overallPercentage) / 100;
            circleProgress.style.strokeDashoffset = circumference;
            setTimeout(() => {
                circleProgress.style.strokeDashoffset = offset;
                if (res.overallPercentage < 40) circleProgress.style.stroke = "var(--danger)";
                else if (res.overallPercentage < 60) circleProgress.style.stroke = "var(--warning)";
                else if (res.overallPercentage < 80) circleProgress.style.stroke = "var(--primary)";
                else circleProgress.style.stroke = "var(--accent)";
            }, 100);
        }

        // 11.1 Renderização do Gráfico Radar (Chart.js)
        renderRadarChart(res.pillarScores);

        // 11.2 Grid de Desempenho dos 5 Pilares
        const pillarsGrid = document.getElementById("pillars-score-grid");
        pillarsGrid.innerHTML = res.pillarScores.map(p => `
            <div class="pillar-score-item">
                <div class="pillar-score-header">
                    <span class="pillar-score-title"><i class="${p.icon}" style="color: var(--primary);"></i> ${p.name}</span>
                    <span class="pillar-score-perc">${p.percentage}%</span>
                </div>
                <div class="progress-track" style="height: 8px;">
                    <div class="progress-bar-fill" style="width: ${p.percentage}%;"></div>
                </div>
                <div class="pillar-score-footer">
                    <span>${p.earnedPoints} de ${p.maxPoints} pts</span>
                    <span>${p.percentage >= 75 ? 'Consolidado' : (p.percentage >= 50 ? 'Parcial' : 'Crítico')}</span>
                </div>
            </div>
        `).join("");

        // 11.3 Módulo DRE (Demonstração do Resultado)
        const dreGrid = document.getElementById("dre-cards-grid");
        const listToRender = res.dreScores || res.bscScores;
        if (dreGrid && listToRender) {
            dreGrid.innerHTML = listToRender.map(dre => `
                <div class="dre-card" style="border-top: 4px solid ${dre.color};">
                    <div class="dre-card-top">
                        <div class="dre-icon-bubble" style="background-color: ${dre.color}20; color: ${dre.color};">
                            <i class="${dre.icon}"></i>
                        </div>
                        <span class="dre-card-score" style="color: ${dre.color};">${dre.percentage}%</span>
                    </div>
                    ${dre.line ? `<div class="dre-card-line">${dre.line}</div>` : ''}
                    <div class="dre-card-name">${dre.name}</div>
                    <div class="dre-card-desc">${dre.description}</div>
                    <div class="progress-track" style="height: 6px; margin-bottom: 0.65rem;">
                        <div class="progress-bar-fill" style="width: ${dre.percentage}%; background: ${dre.color};"></div>
                    </div>
                    <div class="dre-impact-status" style="background-color: ${dre.color}15; color: ${dre.color};">
                        ${dre.statusText}
                    </div>
                    ${dre.metric ? `
                        <div class="dre-metric-tag">
                            <i class="fas fa-bullseye" style="color: var(--primary);"></i> <strong>Foco:</strong> ${dre.metric}
                        </div>
                    ` : ''}
                </div>
            `).join("");
        }

        // 11.4 Diretrizes Estratégicas para o Nível
        const actionsListEl = document.getElementById("maturity-actions-list");
        if (actionsListEl && res.maturity.actionPoints) {
            actionsListEl.innerHTML = res.maturity.actionPoints.map(point => `
                <li>
                    <i class="fas fa-check-circle"></i>
                    <span>${point}</span>
                </li>
            `).join("");
        }

        // 11.5 Matriz de Priorização (Gaps)
        renderGapsMatrix();

        // 11.6 Auditoria Completa das 24 Questões
        renderAuditTable();

        // 11.7 Raio-X de Distribuição das Respostas (1 a 5)
        renderDistributionCard(res);

        // 11.8 O Dossiê Executivo Corporativo
        renderDossier(res);

        // 11.9 Explorador Detalhado: Qual Resposta em Cada Questão
        renderResponseExplorer("all");

        // 11.10 WhatsApp CTA Button
        setupWhatsAppButton(res);

        // 11.11 PDF Download Button
        setupPdfDownloadButton();

        // 11.9 Exportar JSON
        setupExportJsonButton();

        // 11.10 Refazer Teste
        document.getElementById("retake-test-btn").onclick = () => {
            if (confirm("Deseja reiniciar a avaliação do zero?")) {
                state.answers = {};
                state.calculatedResults = null;
                localStorage.removeItem("diagnostic_draft_v2");
                goToStep("welcome");
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        };
    }

    // -------------------------------------------------------------
    // 12. RENDERIZAÇÃO DO GRÁFICO RADAR (CHART.JS)
    // -------------------------------------------------------------
    function renderRadarChart(pillarScores) {
        const ctx = document.getElementById("governance-radar-chart");
        if (!ctx) return;

        const isDark = state.theme === "dark";
        const gridColor = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)";
        const textColor = isDark ? "#e2e8f0" : "#1e293b";

        const labels = pillarScores.map(p => p.shortName || p.name);
        const dataValues = pillarScores.map(p => p.percentage);

        if (radarChartInstance) {
            radarChartInstance.destroy();
        }

        radarChartInstance = new Chart(ctx, {
            type: "radar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Maturidade da Empresa (%)",
                        data: dataValues,
                        backgroundColor: isDark ? "rgba(56, 189, 248, 0.25)" : "rgba(2, 132, 199, 0.2)",
                        borderColor: isDark ? "#38bdf8" : "#0284c7",
                        pointBackgroundColor: isDark ? "#38bdf8" : "#0284c7",
                        pointBorderColor: "#ffffff",
                        pointHoverBackgroundColor: "#ffffff",
                        pointHoverBorderColor: isDark ? "#38bdf8" : "#0284c7",
                        pointRadius: 4,
                        borderWidth: 2
                    },
                    {
                        label: "Padrão de Referência (100%)",
                        data: [100, 100, 100, 100, 100],
                        backgroundColor: "transparent",
                        borderColor: isDark ? "rgba(52, 211, 153, 0.4)" : "rgba(5, 150, 105, 0.3)",
                        borderDash: [4, 4],
                        pointRadius: 0,
                        borderWidth: 1.5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: gridColor },
                        grid: { color: gridColor },
                        pointLabels: {
                            color: textColor,
                            font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: "700" }
                        },
                        ticks: {
                            display: false,
                            min: 0,
                            max: 100,
                            stepSize: 25
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                },
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            color: textColor,
                            font: { family: "'Inter', sans-serif", size: 11, weight: "600" },
                            boxWidth: 12
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ${context.dataset.label}: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    function updateRadarChartTheme() {
        if (!radarChartInstance) return;
        const isDark = state.theme === "dark";
        const gridColor = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)";
        const textColor = isDark ? "#e2e8f0" : "#1e293b";

        radarChartInstance.options.scales.r.angleLines.color = gridColor;
        radarChartInstance.options.scales.r.grid.color = gridColor;
        radarChartInstance.options.scales.r.pointLabels.color = textColor;
        radarChartInstance.options.plugins.legend.labels.color = textColor;
        radarChartInstance.update();
    }

    // -------------------------------------------------------------
    // 13. MATRIZ DE PRIORIZAÇÃO & GAPS COM FILTRO
    // -------------------------------------------------------------
    function renderGapsMatrix() {
        const res = state.calculatedResults;
        const gapsListEl = document.getElementById("gaps-list");
        if (!gapsListEl) return;

        // Atualiza contadores
        const totalGaps = res.gaps.length;
        const quickGaps = res.gaps.filter(g => g.horizon === "quick_win").length;
        const structGaps = res.gaps.filter(g => g.horizon === "estruturante").length;
        const sysGaps = res.gaps.filter(g => g.horizon === "sistemas").length;

        document.getElementById("count-all-gaps").textContent = totalGaps;
        document.getElementById("count-quick-gaps").textContent = quickGaps;
        document.getElementById("count-struct-gaps").textContent = structGaps;
        document.getElementById("count-sys-gaps").textContent = sysGaps;

        // Configura abas de filtro
        document.querySelectorAll(".gap-filter-btn").forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll(".gap-filter-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                state.activeGapFilter = btn.getAttribute("data-filter");
                filterAndDisplayGaps();
            };
        });

        filterAndDisplayGaps();
    }

    function filterAndDisplayGaps() {
        const res = state.calculatedResults;
        const gapsListEl = document.getElementById("gaps-list");
        if (!gapsListEl) return;

        let filtered = res.gaps;
        if (state.activeGapFilter !== "all") {
            filtered = res.gaps.filter(g => g.horizon === state.activeGapFilter);
        }

        if (filtered.length === 0) {
            gapsListEl.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: var(--accent);">
                    <i class="fas fa-circle-check" style="font-size: 2.5rem; margin-bottom: 0.5rem;"></i>
                    <p style="font-weight: 700; font-size: 1.05rem;">Nenhum ponto crítico identificado nesta categoria.</p>
                    <p style="font-size: 0.88rem; color: var(--text-muted);">A empresa atinge níveis consistentes nas práticas avaliadas deste horizonte.</p>
                </div>
            `;
            return;
        }

        gapsListEl.innerHTML = filtered.map((gap, index) => {
            const opt = DEFAULT_OPTIONS.find(o => o.value === gap.score);
            const isCritical = gap.score <= 2;

            let horizonLabel = "⚡ Vitória Rápida (Curto Prazo)";
            if (gap.horizon === "estruturante") horizonLabel = "🏛️ Governança Estruturante (Médio Prazo)";
            if (gap.horizon === "sistemas") horizonLabel = "📊 Controle & Sistemas (Longo Prazo)";

            return `
                <div class="gap-item ${isCritical ? 'critical' : ''}">
                    <div class="gap-item-top">
                        <div class="gap-question-title">${gap.question.id}. ${gap.question.title}</div>
                        <div class="gap-badges-row">
                            <span class="gap-horizon-badge">${horizonLabel}</span>
                            <span class="gap-answer-badge">
                                Nota: ${gap.score}/5 • ${opt ? (opt.label.includes('—') ? opt.label.split('—')[1].trim() : opt.label) : ''}
                            </span>
                        </div>
                    </div>
                    <p style="font-size: 0.92rem; color: var(--text-muted); margin-bottom: 0.4rem;">
                        <strong>Cenário:</strong> ${gap.question.description}
                    </p>
                    <div class="gap-tip-box">
                        <strong><i class="fas fa-lightbulb"></i> Recomendação da Mentoria:</strong> ${gap.question.tip}
                    </div>
                </div>
            `;
        }).join("");
    }

    // -------------------------------------------------------------
    // 14. TABELA DE AUDITORIA DAS 24 QUESTÕES
    // -------------------------------------------------------------
    function renderAuditTable() {
        const tbody = document.getElementById("audit-table-body");
        if (!tbody) return;

        tbody.innerHTML = QUESTIONS.map(q => {
            const score = state.answers[q.id] || 0;
            const opt = DEFAULT_OPTIONS.find(o => o.value === score);
            const optLabel = opt ? opt.label : `Nota ${score}/5`;
            const dreObj = DRE_IMPACTS && DRE_IMPACTS[q.dreImpact];

            let pillStyle = "background: var(--scale-5-bg); color: var(--scale-5);";
            if (score <= 2) pillStyle = "background: var(--scale-1-bg); color: var(--scale-1);";
            else if (score === 3) pillStyle = "background: var(--scale-3-bg); color: var(--scale-3);";

            return `
                <tr>
                    <td style="text-align: center; font-weight: 800; color: var(--primary);">${q.id}</td>
                    <td>
                        <strong>${q.dimension || 'Dimensão de Eficiência'}</strong>
                        ${dreObj ? `<br><span style="display: inline-block; margin-top: 3px; font-size: 0.72rem; color: var(--primary); font-weight: 700;"><i class="${dreObj.icon}"></i> ${dreObj.name}</span>` : ''}
                    </td>
                    <td>
                        <strong>${q.title}</strong><br>
                        <span style="font-size: 0.82rem; color: var(--text-muted);">${q.description}</span>
                    </td>
                    <td style="text-align: center;">
                        <span class="audit-score-pill" style="${pillStyle}">${optLabel}</span>
                    </td>
                </tr>
            `;
        }).join("");
    }

    // -------------------------------------------------------------
    // 14-B. RAIO-X DE DISTRIBUIÇÃO DAS RESPOSTAS (1 A 5)
    // -------------------------------------------------------------
    function renderDistributionCard(res) {
        const track = document.getElementById("distribution-track");
        const cardsGrid = document.getElementById("distribution-cards-grid");
        const insightBanner = document.getElementById("distribution-insight-banner");
        if (!track || !cardsGrid) return;

        const dist = res.distribution;

        // Barra segmentada proporcional (de 5 a 1)
        track.innerHTML = [5, 4, 3, 2, 1].map(k => {
            const item = dist[k];
            if (item.count === 0) return '';
            return `<div class="distribution-segment" style="width: ${item.percentage}%; background-color: ${item.color};" title="Nota ${k}: ${item.count} respostas (${item.percentage}%)"></div>`;
        }).join('');

        // 5 Mini cards clicáveis
        cardsGrid.innerHTML = [5, 4, 3, 2, 1].map(k => {
            const item = dist[k];
            return `
                <div class="dist-mini-card" data-score="${k}" title="Clique para ver as ${item.count} questões avaliadas com Nota ${k}">
                    <div class="dist-badge" style="background: ${item.bg}; color: ${item.color};">
                        Nota ${k} • ${item.label}
                    </div>
                    <div class="dist-count" style="color: ${item.color};">${item.count}</div>
                    <div class="dist-label">${item.percentage}% das 24 questões</div>
                    <div class="dist-desc">${item.group}</div>
                </div>
            `;
        }).join('');

        // Evento de clique para filtrar o explorador de respostas
        cardsGrid.querySelectorAll(".dist-mini-card").forEach(card => {
            card.addEventListener("click", () => {
                const score = card.getAttribute("data-score");
                cardsGrid.querySelectorAll(".dist-mini-card").forEach(c => c.classList.remove("active"));
                card.classList.add("active");
                renderResponseExplorer(score);
                const explorerCard = document.getElementById("response-explorer-card");
                if (explorerCard) {
                    explorerCard.scrollIntoView({ behavior: "smooth", block: "start" });
                }
                showToast(`Filtrando: exibindo as ${dist[score].count} questões avaliadas com Nota ${score}`);
            });
        });

        // Banner Analítico
        if (insightBanner) {
            insightBanner.innerHTML = `
                <div class="insight-icon"><i class="fas fa-lightbulb"></i></div>
                <div class="insight-content">
                    <h4>Padrão Comportamental Dominante: ${res.insightHeadline}</h4>
                    <p>${res.insightText}</p>
                </div>
            `;
        }
    }

    // -------------------------------------------------------------
    // 14-C. O DOSSIÊ ESTRATÉGICO CORPORATIVO (ESTILO ROTA)
    // -------------------------------------------------------------
    function renderDossier(res) {
        const prancha1 = document.getElementById("prancha-1-panel");
        const prancha2 = document.getElementById("prancha-2-panel");
        const prancha3 = document.getElementById("prancha-3-panel");
        const prancha4 = document.getElementById("prancha-4-panel");
        const prancha5 = document.getElementById("prancha-5-panel");
        if (!prancha1 || !prancha2 || !prancha3 || !prancha4 || !prancha5) return;

        const currentDate = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
        const compName = state.userData.company || (state.userData.name ? state.userData.name : "Organização Avaliada");
        const gestorName = state.userData.name || "Diretoria Executiva";

        // PRANCHA 1: CAPA NOBRE & PALAVRA-ESSÊNCIA
        prancha1.innerHTML = `
            <div class="dossier-cover-sheet">
                <div class="cover-header-tag">
                    <span><i class="fas fa-shield-halved"></i> AUDITORIA DE MARGEM & PROCESSOS</span>
                </div>

                <div class="cover-essence-section">
                    <div class="cover-essence-label">CONCEITO CENTRAL & PALAVRA-ESSÊNCIA</div>
                    <div class="cover-essence-word">${res.essenceWord}</div>
                    <div class="cover-essence-desc">"${res.archetypeTitle} — ${res.archetypeDesc}"</div>
                </div>

                <div class="cover-meta-grid">
                    <div class="cover-meta-item">
                        <span>EMPRESA AUDITADA</span>
                        <strong>${compName}</strong>
                        <div style="font-size: 0.85rem; color: #D6C2B4; margin-top: 2px;">${state.userData.segment}</div>
                    </div>
                    <div class="cover-meta-item">
                        <span>GESTOR / DECISOR</span>
                        <strong>${gestorName}</strong>
                        <div style="font-size: 0.85rem; color: #D6C2B4; margin-top: 2px;">${state.userData.roleLabel}</div>
                    </div>
                    <div class="cover-meta-item">
                        <span>DATA DA AUDITORIA</span>
                        <strong>${currentDate}</strong>
                        <div style="font-size: 0.85rem; color: #D6C2B4; margin-top: 2px;">Protocolo nº ${Date.now().toString().slice(-6)}</div>
                    </div>
                    <div class="cover-meta-item">
                        <span>RESPONSABILIDADE TÉCNICA</span>
                        <strong>Taís Trevisol Scherner • Erick Finger</strong>
                        <div style="font-size: 0.85rem; color: #D6C2B4; margin-top: 2px;">Governança & Gestão Estratégica</div>
                    </div>
                </div>
            </div>
        `;

        // PRANCHA 2: BALANÇO DAS RESPOSTAS & SUMÁRIO
        prancha2.innerHTML = `
            <div class="balance-summary-grid">
                <div class="balance-metric-card">
                    <div class="num">${res.overallPercentage}%</div>
                    <div class="lbl">Índice Geral de Maturidade</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">${res.maturity.level}</div>
                </div>
                <div class="balance-metric-card">
                    <div class="num" style="color: var(--accent);">${res.strengthsCount} de 24</div>
                    <div class="lbl">Fortalezas Consolidadas</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Notas 4 e 5 (${Math.round((res.strengthsCount/24)*100)}% da operação)</div>
                </div>
                <div class="balance-metric-card">
                    <div class="num" style="color: ${res.criticalGapsCount > 5 ? 'var(--danger)' : 'var(--warning)'};">${res.criticalGapsCount}</div>
                    <div class="lbl">Gargalos Críticos de Margem</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Notas 1 e 2 (Atenção Imediata)</div>
                </div>
            </div>

            <div style="margin-top: 1.5rem;">
                <h4 style="font-size: 1.1rem; color: var(--text-heading); margin-bottom: 0.75rem;">
                    <i class="fas fa-table-list" style="color: var(--primary);"></i> Balanço Geral das 24 Questões por Nível
                </h4>
                <table class="balance-table">
                    <thead>
                        <tr>
                            <th style="width: 140px;">Nível / Nota</th>
                            <th>Classificação Operacional</th>
                            <th style="width: 110px; text-align: center;">Respostas</th>
                            <th style="width: 100px; text-align: center;">% Total</th>
                            <th>Reflexo Estratégico na Gestão</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><span class="dist-badge" style="background: var(--scale-5-bg); color: var(--scale-5);">Nota 5 • Consolidado</span></td>
                            <td><strong>Excelência & Rotina Plena</strong></td>
                            <td style="text-align: center; font-weight: 800;">${res.distribution[5].count}</td>
                            <td style="text-align: center;">${res.distribution[5].percentage}%</td>
                            <td style="font-size: 0.85rem; color: var(--text-muted);">Práticas incorporadas à cultura, gerando eficiência e blindando a Receita.</td>
                        </tr>
                        <tr>
                            <td><span class="dist-badge" style="background: var(--scale-4-bg); color: var(--scale-4);">Nota 4 • Consistente</span></td>
                            <td><strong>Estruturado & Formalizado</strong></td>
                            <td style="text-align: center; font-weight: 800;">${res.distribution[4].count}</td>
                            <td style="text-align: center;">${res.distribution[4].percentage}%</td>
                            <td style="font-size: 0.85rem; color: var(--text-muted);">Processos rotineiros com autonomia dos gestores e poucas oscilações.</td>
                        </tr>
                        <tr>
                            <td><span class="dist-badge" style="background: var(--scale-3-bg); color: var(--scale-3);">Nota 3 • Parcialmente</span></td>
                            <td><strong>Zona de Transição (Atenção)</strong></td>
                            <td style="text-align: center; font-weight: 800; color: var(--warning);">${res.distribution[3].count}</td>
                            <td style="text-align: center; color: var(--warning); font-weight: 700;">${res.distribution[3].percentage}%</td>
                            <td style="font-size: 0.85rem; color: var(--text-muted);">Existe em algumas áreas mas sem padrão. Causa retrabalho e inflaciona CPV e SG&A.</td>
                        </tr>
                        <tr>
                            <td><span class="dist-badge" style="background: var(--scale-2-bg); color: var(--scale-2);">Nota 2 • Acontece pouco</span></td>
                            <td><strong>Vulnerabilidade Operacional</strong></td>
                            <td style="text-align: center; font-weight: 800; color: var(--scale-2);">${res.distribution[2].count}</td>
                            <td style="text-align: center; color: var(--scale-2); font-weight: 700;">${res.distribution[2].percentage}%</td>
                            <td style="font-size: 0.85rem; color: var(--text-muted);">Prática incipiente, dependente de heróis individuais e sem controle formal.</td>
                        </tr>
                        <tr>
                            <td><span class="dist-badge" style="background: var(--scale-1-bg); color: var(--scale-1);">Nota 1 • Não acontece</span></td>
                            <td><strong>Gargalo Crítico / Inexistente</strong></td>
                            <td style="text-align: center; font-weight: 800; color: var(--danger);">${res.distribution[1].count}</td>
                            <td style="text-align: center; color: var(--danger); font-weight: 700;">${res.distribution[1].percentage}%</td>
                            <td style="font-size: 0.85rem; color: var(--text-muted);">Ausência total de processo ou controle. Sangria direta de margem EBITDA e caixa.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

        // PRANCHA 3: TEIA & REFLEXO NA DRE
        prancha3.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div>
                    <h4 style="font-size: 1.05rem; color: var(--text-heading); margin-bottom: 0.75rem;">
                        <i class="fas fa-chart-pie" style="color: var(--primary);"></i> Síntese dos 5 Eixos Estratégicos
                    </h4>
                    <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                        ${res.pillarScores.map(p => `
                            <div style="background: var(--bg-main); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.85rem 1rem;">
                                <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 0.9rem; margin-bottom: 0.4rem;">
                                    <span><i class="${p.icon}" style="color: var(--primary);"></i> ${p.name}</span>
                                    <span style="color: var(--primary);">${p.percentage}%</span>
                                </div>
                                <div class="progress-track" style="height: 6px;">
                                    <div class="progress-bar-fill" style="width: ${p.percentage}%;"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div>
                    <h4 style="font-size: 1.05rem; color: var(--text-heading); margin-bottom: 0.75rem;">
                        <i class="fas fa-file-invoice-dollar" style="color: var(--primary);"></i> Impacto nas 4 Linhas da DRE
                    </h4>
                    <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                        ${res.dreScores.map(d => `
                            <div style="background: var(--bg-main); border: 1px solid var(--border-color); border-left: 4px solid ${d.color}; border-radius: var(--radius-sm); padding: 0.85rem 1rem;">
                                <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 0.9rem;">
                                    <span style="color: var(--text-heading);">${d.name}</span>
                                    <span style="color: ${d.color};">${d.percentage}%</span>
                                </div>
                                <div style="font-size: 0.78rem; color: var(--text-muted); margin: 2px 0 6px;">${d.line}</div>
                                <div style="font-size: 0.82rem; font-weight: 700; color: ${d.color};">${d.statusText}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // PRANCHA 4: LEITURA CONFIDENCIAL DA CONSULTORIA
        prancha4.innerHTML = `
            <div class="confidential-reading-sheet">
                <div class="reading-letterhead">
                    <div>
                        <div style="font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--primary); font-weight: 800;">
                            RELATÓRIO CONFIDENCIAL DE CONSULTORIA
                        </div>
                        <h3 class="reading-title">Diagnóstico Comportamental & Devolutiva Executiva</h3>
                    </div>
                    <div style="text-align: right; font-size: 0.82rem; color: var(--text-muted);">
                        Emitido em ${currentDate}<br>
                        <strong>Ref: ${compName}</strong>
                    </div>
                </div>

                <div class="reading-body">
                    <p>${res.confidentialReading.p1}</p>
                    <p>${res.confidentialReading.p2}</p>
                    <p>${res.confidentialReading.p3}</p>
                    <p>${res.confidentialReading.p4}</p>
                </div>
            </div>
        `;

        // PRANCHA 5: CARTA DE DIREÇÃO & PLANO 90 DIAS
        prancha5.innerHTML = `
            <div>
                <h4 style="font-size: 1.15rem; color: var(--text-heading); margin-bottom: 0.5rem;">
                    <i class="fas fa-compass" style="color: var(--primary);"></i> 5 Pontos de Mentoria Estratégica Prioritária
                </h4>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.25rem;">
                    Ações recomendadas pela consultoria para elevar o índice de maturidade e estancar vazamentos de margem:
                </p>

                <div class="direction-points-list">
                    ${res.mentorshipPoints.map(pt => `
                        <div class="direction-point-item">
                            <div class="direction-point-num">${pt.num}</div>
                            <div style="flex: 1;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
                                    <strong style="font-size: 0.95rem; color: var(--text-heading);">${pt.title}</strong>
                                    <span style="font-size: 0.75rem; padding: 2px 7px; border-radius: 4px; background: rgba(2, 132, 199, 0.12); color: var(--primary); font-weight: 700;">
                                        Impacto: ${pt.impact}
                                    </span>
                                </div>
                                <p style="font-size: 0.86rem; color: var(--text-main); margin: 0; line-height: 1.45;">
                                    ${pt.action}
                                </p>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div style="margin-top: 2rem; padding: 1.5rem; background: var(--bg-main); border: 1px solid var(--border-color); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">CONSULTORIA RESPONSÁVEL</div>
                        <div style="font-size: 1.05rem; font-weight: 800; color: var(--text-heading); margin-top: 2px;">Taís Trevisol Scherner • Erick Finger</div>
                        <div style="font-size: 0.85rem; color: var(--text-muted);">Mestra em Administração • Governança & Gestão Estratégica</div>
                    </div>
                    <div>
                        <a href="https://api.whatsapp.com/send?phone=5549988369445" target="_blank" class="btn btn-success">
                            <i class="fab fa-whatsapp"></i> Agendar Devolutiva no WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        `;

        setupDossierEvents(res);
    }

    // -------------------------------------------------------------
    // 14-D. EVENTOS DAS ABAS DO DOSSIÊ
    // -------------------------------------------------------------
    function setupDossierEvents(res) {
        const tabs = document.querySelectorAll(".dossier-tab-btn");
        const panels = document.querySelectorAll(".dossier-sheet-panel");

        tabs.forEach(tab => {
            tab.onclick = () => {
                const targetId = `${tab.getAttribute("data-tab")}-panel`;
                tabs.forEach(t => t.classList.remove("active"));
                panels.forEach(p => p.classList.remove("active"));

                tab.classList.add("active");
                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    targetPanel.classList.add("active");
                }
            };
        });

        // Botão Baixar Dossiê (PDF)
        const downloadBtn = document.getElementById("dossier-download-pdf-btn");
        if (downloadBtn) {
            downloadBtn.onclick = () => {
                const mainDownloadBtn = document.getElementById("download-pdf-btn");
                if (mainDownloadBtn) mainDownloadBtn.click();
            };
        }

        // Botão Imprimir Dossiê
        const printBtn = document.getElementById("dossier-print-btn");
        if (printBtn) {
            printBtn.onclick = () => {
                window.print();
            };
        }
    }

    // -------------------------------------------------------------
    // 14-E. AUDITORIA DETALHADA: QUAL RESPOSTA EM CADA QUESTÃO
    // -------------------------------------------------------------
    function renderResponseExplorer(activeScore = "all") {
        const pillsContainer = document.getElementById("response-filter-pills");
        const itemsGrid = document.getElementById("response-items-grid");
        if (!pillsContainer || !itemsGrid) return;

        const res = state.calculatedResults;
        if (!res) return;

        // Atualiza contadores das pílulas
        const countAllEl = document.getElementById("count-pill-all");
        if (countAllEl) countAllEl.textContent = QUESTIONS.length;

        [5, 4, 3, 2, 1].forEach(k => {
            const el = document.getElementById(`count-pill-${k}`);
            if (el) el.textContent = res.distribution[k].count;
        });

        // Atualiza classe ativa nas pílulas
        pillsContainer.querySelectorAll(".resp-filter-pill").forEach(pill => {
            const pScore = pill.getAttribute("data-score");
            pill.classList.toggle("active", String(pScore) === String(activeScore));

            pill.onclick = () => {
                renderResponseExplorer(pScore);
            };
        });

        // Filtra as perguntas
        const filtered = QUESTIONS.filter(q => {
            const val = state.answers[q.id] || 1;
            if (activeScore === "all") return true;
            return String(val) === String(activeScore);
        });

        if (filtered.length === 0) {
            itemsGrid.innerHTML = `
                <div style="text-align: center; padding: 2.5rem; background: var(--bg-main); border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
                    <i class="fas fa-check-circle" style="font-size: 2rem; color: var(--accent); margin-bottom: 0.5rem;"></i>
                    <p style="font-weight: 700; color: var(--text-heading);">Nenhuma resposta com Nota ${activeScore}</p>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">A empresa não assinalou esta nota em nenhuma das 24 questões.</p>
                </div>
            `;
            return;
        }

        itemsGrid.innerHTML = filtered.map(q => {
            const score = state.answers[q.id] || 1;
            const opt = DEFAULT_OPTIONS.find(o => o.value === score) || DEFAULT_OPTIONS[0];
            const dreObj = DRE_IMPACTS && DRE_IMPACTS[q.dreImpact];
            const pillarObj = PILLARS.find(p => p.id === q.pillarId);

            let borderColor = "var(--scale-5)";
            let badgeBg = "var(--scale-5-bg)";
            let badgeColor = "var(--scale-5)";
            if (score <= 2) {
                borderColor = "var(--scale-1)";
                badgeBg = "var(--scale-1-bg)";
                badgeColor = "var(--scale-1)";
            } else if (score === 3) {
                borderColor = "var(--scale-3)";
                badgeBg = "var(--scale-3-bg)";
                badgeColor = "var(--scale-3)";
            } else if (score === 4) {
                borderColor = "var(--scale-4)";
                badgeBg = "var(--scale-4-bg)";
                badgeColor = "var(--scale-4)";
            }

            return `
                <div class="response-item-card" style="border-left-color: ${borderColor};">
                    <div class="response-item-header">
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                            <span style="font-weight: 800; color: var(--primary); font-size: 0.9rem;">Questão ${q.id} de 24</span>
                            ${pillarObj ? `<span style="font-size: 0.75rem; background: var(--bg-main); border: 1px solid var(--border-color); padding: 2px 7px; border-radius: 4px; color: var(--text-muted);"><i class="${pillarObj.icon}"></i> ${pillarObj.name}</span>` : ''}
                            ${dreObj ? `<span style="font-size: 0.75rem; background: rgba(2, 132, 199, 0.1); padding: 2px 7px; border-radius: 4px; color: var(--primary); font-weight: 700;"><i class="${dreObj.icon}"></i> ${dreObj.name}</span>` : ''}
                        </div>
                        <span class="response-chosen-badge" style="background: ${badgeBg}; color: ${badgeColor};">
                            Nota ${score}/5 • ${opt.label}
                        </span>
                    </div>

                    <div class="response-item-title">${q.title}</div>
                    <div class="response-item-desc">${q.description}</div>

                    <div class="response-chosen-box">
                        <div class="response-chosen-badge" style="background: ${badgeBg}; color: ${badgeColor};">
                            Resposta Marcada
                        </div>
                        <div class="response-chosen-text">
                            <strong>${opt.label}:</strong> ${opt.desc}
                        </div>
                    </div>

                    <div class="response-tip-box">
                        <strong><i class="fas fa-lightbulb"></i> Recomendação de Gestão:</strong> ${q.tip}
                    </div>
                </div>
            `;
        }).join('');
    }

    // -------------------------------------------------------------
    // 15. INTEGRAÇÕES: WHATSAPP, PDF & EXPORTAÇÃO JSON
    // -------------------------------------------------------------
    function setupWhatsAppButton(res) {
        const whatsappBtn = document.getElementById("whatsapp-cta-btn");
        if (!whatsappBtn) return;
        const defaultPhone = "5549988369445";

        let participantInfo = "";
        if (state.userData.isAnonymous) {
            participantInfo = `Perfil: ${state.userData.roleLabel} (${state.userData.segment}) - Resposta Confidencial.\n`;
        } else if (state.userData.name && state.userData.company) {
            participantInfo = `Empresa: *${state.userData.company}*\nGestor(a): *${state.userData.name}* (${state.userData.roleLabel}).\n`;
        } else {
            participantInfo = `Gestor(a): *${state.userData.name || 'Gestor'}* (${state.userData.roleLabel}).\n`;
        }

        const d = res.distribution;
        const distributionSummary = 
            `📊 *Balanço das 24 Respostas:*\n` +
            `• Nível 5 (Excelência): ${d[5].count} respostas (${d[5].percentage}%)\n` +
            `• Nível 4 (Estruturado): ${d[4].count} respostas (${d[4].percentage}%)\n` +
            `• Nível 3 (Em Transição): ${d[3].count} respostas (${d[3].percentage}%)\n` +
            `• Nível 2 (Vulnerabilidade): ${d[2].count} respostas (${d[2].percentage}%)\n` +
            `• Nível 1 (Gargalo Crítico): ${d[1].count} respostas (${d[1].percentage}%)\n`;

        const waMsg = encodeURIComponent(
            `*AUDITORIA DE MARGEM & PROCESSOS*\n\n` +
            `Olá Taís! Concluí o diagnóstico empresarial e gerei o Dossiê Estratégico.\n\n` +
            participantInfo +
            `Índice Geral de Maturidade: *${res.overallPercentage}%* (${res.maturity.level})\n` +
            `Palavra-Essência Diagnosticada: *${res.essenceWord}*\n\n` +
            distributionSummary + `\n` +
            `Gostaria de agendar a reunião de devolutiva da consultoria para analisarmos o plano de 90 dias!`
        );
        whatsappBtn.href = `https://api.whatsapp.com/send?phone=${defaultPhone}&text=${waMsg}`;
    }

    function setupPdfDownloadButton() {
        const downloadPdfBtn = document.getElementById("download-pdf-btn");
        if (!downloadPdfBtn) return;

        downloadPdfBtn.onclick = async () => {
            downloadPdfBtn.disabled = true;
            downloadPdfBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando Dossiê Executivo...';
            showToast("Formatando relatório executivo de alta fidelidade...");

            // Captura imagem do gráfico radar em base64 com contraste ideal para impressão/PDF
            let radarImgData = null;
            if (radarChartInstance) {
                try {
                    const isDark = state.theme === "dark";
                    if (isDark) {
                        radarChartInstance.options.scales.r.angleLines.color = "rgba(0, 0, 0, 0.12)";
                        radarChartInstance.options.scales.r.grid.color = "rgba(0, 0, 0, 0.12)";
                        radarChartInstance.options.scales.r.pointLabels.color = "#0f172a";
                        radarChartInstance.options.plugins.legend.labels.color = "#0f172a";
                        radarChartInstance.update('none');
                    }
                    radarImgData = radarChartInstance.toBase64Image();
                    if (isDark) {
                        updateRadarChartTheme();
                    }
                } catch (e) {
                    console.warn("Não foi possível extrair imagem do radar chart", e);
                }
            }

            if (!radarImgData) {
                const canvas = document.getElementById("governance-radar-chart");
                if (canvas) {
                    try {
                        radarImgData = canvas.toDataURL("image/png");
                    } catch (e) {
                        console.warn("Falha no fallback do canvas", e);
                    }
                }
            }

            try {
                await window.diagnosticPdfGenerator.generatePdf(
                    state.userData,
                    state.calculatedResults,
                    QUESTIONS,
                    state.answers,
                    radarImgData
                );
                showToast("Relatório PDF baixado com sucesso!");
            } catch (err) {
                console.error("Erro ao gerar PDF:", err);
                showToast("Erro ao exportar PDF. Tente imprimir a página.", "warning");
            } finally {
                downloadPdfBtn.disabled = false;
                downloadPdfBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Baixar Relatório Executivo Completo (PDF)';
            }
        };
    }

    function setupExportJsonButton() {
        if (!exportJsonBtn) return;
        exportJsonBtn.onclick = () => {
            const dataToExport = {
                version: "4.0",
                system: "Auditoria de Margem & Processos",
                exportedAt: new Date().toISOString(),
                userData: state.userData,
                answers: state.answers,
                calculatedResults: state.calculatedResults
            };

            const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
            const downloadAnchor = document.createElement("a");
            const companySlug = (state.userData.company || "Empresa").replace(/\s+/g, "_");
            downloadAnchor.setAttribute("href", jsonStr);
            downloadAnchor.setAttribute("download", `Auditoria_Margem_Processos_${companySlug}_${new Date().toISOString().slice(0, 10)}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();

            showToast("Diagnóstico exportado em arquivo JSON!");
        };
    }

    // Carregar JSON de diagnóstico prévio
    if (loadJsonBtn && jsonFileInput) {
        loadJsonBtn.addEventListener("click", () => {
            jsonFileInput.click();
        });

        jsonFileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const parsed = JSON.parse(event.target.result);
                    if (parsed.answers && Object.keys(parsed.answers).length > 0) {
                        state.answers = parsed.answers;
                        if (parsed.userData) state.userData = { ...state.userData, ...parsed.userData };
                        calculateResults();
                        renderResultsScreen();
                        goToStep("results");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        showToast("Diagnóstico carregado com sucesso a partir do arquivo JSON!");
                    } else {
                        showToast("Arquivo JSON inválido ou sem respostas.", "warning");
                    }
                } catch (err) {
                    showToast("Erro ao processar arquivo JSON.", "warning");
                }
            };
            reader.readAsText(file);
        });
    }

    // -------------------------------------------------------------
    // 16. ATALHOS DE TECLADO (1 a 5 para responder rápido e setas para navegar)
    // -------------------------------------------------------------
    document.addEventListener("keydown", (e) => {
        if (state.currentStep !== "quiz") return;
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;

        if (["1", "2", "3", "4", "5"].includes(e.key)) {
            const val = parseInt(e.key, 10);
            const currentQ = QUESTIONS[state.currentQuestionIndex];
            if (currentQ) {
                selectAnswerAndAutoAdvance(currentQ.id, val);
            }
        } else if (e.key === "ArrowLeft") {
            if (state.currentQuestionIndex > 0) {
                renderSingleQuestion(state.currentQuestionIndex - 1);
            }
        } else if (e.key === "ArrowRight") {
            if (state.currentQuestionIndex < QUESTIONS.length - 1) {
                renderSingleQuestion(state.currentQuestionIndex + 1);
            }
        }
    });

    // -------------------------------------------------------------
    // 17. TOAST NOTIFICATIONS
    // -------------------------------------------------------------
    let toastTimeout = null;
    function showToast(message, type = "info") {
        if (!toastEl) return;
        toastMessageEl.textContent = message;

        if (type === "warning") {
            toastEl.style.borderLeftColor = "var(--danger)";
        } else {
            toastEl.style.borderLeftColor = "var(--primary)";
        }

        toastEl.classList.add("show");

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastEl.classList.remove("show");
        }, 3500);
    }

    // Expor para depuração e automação de testes
    window.calculateResults = calculateResults;
    window.renderResultsScreen = renderResultsScreen;
    window.goToStep = goToStep;

    // Restaura rascunho anterior se houver
    if (loadDraft() && Object.keys(state.answers).length > 0) {
        updateProgress();
    }
});

