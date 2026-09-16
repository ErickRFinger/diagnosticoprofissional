/**
 * Sistema de Diagnóstico & Mentoria Contábil
 * Controle de Fluxo, Temas, Questionário e Diagnóstico
 */

document.addEventListener("DOMContentLoaded", () => {
    // Estado da Aplicação
    const state = {
        theme: localStorage.getItem("app_theme") || "light",
        currentStep: "welcome", // "welcome" | "quiz" | "results"
        currentPillarIndex: 0,
        userData: {
            name: "",
            company: "",
            role: "socio_proprietario",
            roleLabel: "Sócio / Proprietário / Fundador",
            segment: "Microempresa (ME)",
            phone: "",
            email: ""
        },
        answers: {}, // { 1: 5, 2: 3, ... }
        calculatedResults: null
    };

    // Elementos DOM
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    const themeIcon = document.getElementById("theme-icon");
    const welcomeScreen = document.getElementById("welcome-screen");
    const quizScreen = document.getElementById("quiz-screen");
    const resultsScreen = document.getElementById("results-screen");

    const onboardingForm = document.getElementById("onboarding-form");
    const rolesContainer = document.getElementById("roles-container");
    const questionsContainer = document.getElementById("questions-container");
    const pillarTabsContainer = document.getElementById("pillar-tabs");
    const currentPillarNameEl = document.getElementById("current-pillar-name");
    const currentPillarDescEl = document.getElementById("current-pillar-desc");

    const progressBarFill = document.getElementById("progress-bar-fill");
    const progressCountEl = document.getElementById("progress-count");
    const progressPercentEl = document.getElementById("progress-percent");

    const prevPillarBtn = document.getElementById("prev-pillar-btn");
    const nextPillarBtn = document.getElementById("next-pillar-btn");
    const finishQuizBtn = document.getElementById("finish-quiz-btn");
    const fillSampleBtn = document.getElementById("fill-sample-btn");

    const toastEl = document.getElementById("toast-notification");
    const toastMessageEl = document.getElementById("toast-message");

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
    }

    applyTheme(state.theme);

    themeToggleBtn.addEventListener("click", () => {
        const newTheme = state.theme === "dark" ? "light" : "dark";
        applyTheme(newTheme);
        showToast(newTheme === "dark" ? "Modo Escuro ativado" : "Modo Claro ativado");
    });

    // -------------------------------------------------------------
    // 2. RENDERIZAÇÃO DOS CARGOS NA TELA INICIAL
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

        // Atualiza o listener de seleção
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
    // 3. INÍCIO DO QUESTIONÁRIO & VALIDAÇÃO
    // -------------------------------------------------------------
    onboardingForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nameInput = document.getElementById("client-name").value.trim();
        const companyInput = document.getElementById("client-company").value.trim();
        const phoneInput = document.getElementById("client-phone").value.trim();
        const emailInput = document.getElementById("client-email").value.trim();
        const segmentInput = document.getElementById("client-segment").value;

        const selectedRoleRadio = document.querySelector('input[name="userRole"]:checked');
        const roleId = selectedRoleRadio ? selectedRoleRadio.value : "socio_proprietario";
        const roleObj = ROLES.find(r => r.id === roleId) || ROLES[0];

        state.userData = {
            name: nameInput || "",
            company: companyInput || "",
            role: roleObj.id,
            roleLabel: roleObj.label,
            segment: segmentInput,
            phone: phoneInput || "",
            email: emailInput || ""
        };

        // Transiciona para a tela do quiz
        goToStep("quiz");
        renderQuizPillar(0);
        updateProgress();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // -------------------------------------------------------------
    // 4. NAVEGAÇÃO DE TELAS (WELCOME -> QUIZ -> RESULTS)
    // -------------------------------------------------------------
    function goToStep(step) {
        state.currentStep = step;
        welcomeScreen.style.display = step === "welcome" ? "block" : "none";
        quizScreen.style.display = step === "quiz" ? "block" : "none";
        resultsScreen.style.display = step === "results" ? "block" : "none";
    }

    // -------------------------------------------------------------
    // 5. RENDERIZAÇÃO DO QUESTIONÁRIO POR PILARES
    // -------------------------------------------------------------
    function renderPillarTabs() {
        if (!pillarTabsContainer) return;
        pillarTabsContainer.innerHTML = PILLARS.map((pillar, index) => {
            const pillarQuestions = QUESTIONS.filter(q => q.pillarId === pillar.id);
            const answeredInPillar = pillarQuestions.filter(q => state.answers[q.id] !== undefined).length;
            const isCompleted = answeredInPillar === pillarQuestions.length;
            const isActive = index === state.currentPillarIndex;

            return `
                <button type="button" class="pillar-tab ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" data-index="${index}">
                    <i class="${pillar.icon}"></i>
                    <span>${index + 1}. ${pillar.shortName || pillar.name}</span>
                    ${isCompleted ? '<i class="fas fa-check-circle" style="margin-left: 4px;"></i>' : ''}
                </button>
            `;
        }).join("");

        pillarTabsContainer.querySelectorAll(".pillar-tab").forEach(tab => {
            tab.addEventListener("click", () => {
                const index = parseInt(tab.getAttribute("data-index"), 10);
                renderQuizPillar(index);
            });
        });
    }

    function renderQuizPillar(pillarIndex) {
        state.currentPillarIndex = pillarIndex;
        const currentPillar = PILLARS[pillarIndex];
        const pillarQuestions = QUESTIONS.filter(q => q.pillarId === currentPillar.id);

        currentPillarNameEl.innerHTML = `<i class="${currentPillar.icon}"></i> ${pillarIndex + 1}. ${currentPillar.name}`;
        currentPillarDescEl.textContent = currentPillar.description;

        questionsContainer.innerHTML = pillarQuestions.map((q) => {
            const currentAnswer = state.answers[q.id];
            const isAnswered = currentAnswer !== undefined;

            const optionsHtml = DEFAULT_OPTIONS.map(opt => `
                <label class="option-item">
                    <input type="radio" name="question_${q.id}" value="${opt.value}" ${currentAnswer === opt.value ? 'checked' : ''}>
                    <div class="option-label-box">
                        <div class="option-score-indicator">${opt.value}</div>
                        <div class="option-text-container">
                            <div class="option-title-text">${opt.label}</div>
                            <div class="option-sub-text">${opt.desc}</div>
                        </div>
                    </div>
                </label>
            `).join("");

            return `
                <div class="question-card ${isAnswered ? 'answered' : 'unanswered'}" id="card-q-${q.id}">
                    <div class="question-header">
                        <span class="question-number-badge">${q.title}</span>
                        ${isAnswered ? '<span style="color: var(--accent); font-size: 0.85rem; font-weight: 600;"><i class="fas fa-check"></i> Respondida</span>' : ''}
                    </div>
                    ${q.dimension ? `<div style="font-size: 0.8rem; color: var(--primary); font-weight: 600; margin-bottom: 0.35rem;"><i class="fas fa-layer-group"></i> ${q.dimension}</div>` : ''}
                    <h3 class="question-title">${q.title.split(':')[1] ? q.title.split(':')[1].trim() : q.title}</h3>
                    <p class="question-desc">${q.description}</p>
                    <div class="options-list">
                        ${optionsHtml}
                    </div>
                </div>
            `;
        }).join("");

        // Registra os listeners de cada opção de resposta
        pillarQuestions.forEach(q => {
            const radios = document.querySelectorAll(`input[name="question_${q.id}"]`);
            radios.forEach(radio => {
                radio.addEventListener("change", (e) => {
                    const val = parseInt(e.target.value, 10);
                    state.answers[q.id] = val;

                    const card = document.getElementById(`card-q-${q.id}`);
                    if (card) {
                        card.classList.remove("unanswered");
                        card.classList.add("answered");
                        const headerBadge = card.querySelector(".question-header");
                        if (!headerBadge.querySelector(".fa-check")) {
                            const checkBadge = document.createElement("span");
                            checkBadge.style.cssText = "color: var(--accent); font-size: 0.85rem; font-weight: 600;";
                            checkBadge.innerHTML = '<i class="fas fa-check"></i> Respondida';
                            headerBadge.appendChild(checkBadge);
                        }
                    }

                    updateProgress();
                    renderPillarTabs();
                });
            });
        });

        // Atualiza botões de navegação
        prevPillarBtn.style.display = pillarIndex > 0 ? "inline-flex" : "none";
        
        if (pillarIndex === PILLARS.length - 1) {
            nextPillarBtn.style.display = "none";
            finishQuizBtn.style.display = "inline-flex";
        } else {
            nextPillarBtn.style.display = "inline-flex";
            finishQuizBtn.style.display = "none";
        }

        renderPillarTabs();
        window.scrollTo({ top: 150, behavior: "smooth" });
    }

    prevPillarBtn.addEventListener("click", () => {
        if (state.currentPillarIndex > 0) {
            renderQuizPillar(state.currentPillarIndex - 1);
        }
    });

    nextPillarBtn.addEventListener("click", () => {
        if (state.currentPillarIndex < PILLARS.length - 1) {
            renderQuizPillar(state.currentPillarIndex + 1);
        }
    });

    // -------------------------------------------------------------
    // 6. PROGRESSO EM TEMPO REAL
    // -------------------------------------------------------------
    function updateProgress() {
        const total = QUESTIONS.length;
        const answeredCount = Object.keys(state.answers).length;
        const percentage = Math.round((answeredCount / total) * 100);

        progressBarFill.style.width = `${percentage}%`;
        progressCountEl.textContent = `${answeredCount} de ${total} respondidas`;
        progressPercentEl.textContent = `${percentage}% concluído`;
    }

    // -------------------------------------------------------------
    // 7. PREENCHIMENTO RÁPIDO DE EXEMPLO (DEMONSTRAÇÃO)
    // -------------------------------------------------------------
    if (fillSampleBtn) {
        fillSampleBtn.addEventListener("click", () => {
            // Preenche todas as 24 perguntas com valores variados realistas (1 a 5)
            const sampleScores = [
                3, 2, 4, 2, 3, 4, 3, // Pilar 1: Gestão (7 perguntas)
                4, 3, 2, 3, 3, 2, 4, // Pilar 2: Estrutura, Processos e Operações (7 perguntas)
                2, 3, 2, 4,          // Pilar 3: Família e Negócio (4 perguntas)
                3, 4, 3, 3,          // Pilar 4: Pessoas (4 perguntas)
                4, 3                 // Pilar 5: Cultura e Ambiente de Trabalho (2 perguntas)
            ];

            QUESTIONS.forEach((q, idx) => {
                state.answers[q.id] = sampleScores[idx] || (Math.floor(Math.random() * 4) + 2);
            });

            renderQuizPillar(state.currentPillarIndex);
            updateProgress();
            showToast("Perguntas preenchidas com dados de exemplo!");
        });
    }

    // -------------------------------------------------------------
    // 8. FINALIZAÇÃO E CÁLCULO DO DIAGNÓSTICO
    // -------------------------------------------------------------
    finishQuizBtn.addEventListener("click", () => {
        const unanswered = QUESTIONS.filter(q => state.answers[q.id] === undefined);

        if (unanswered.length > 0) {
            const firstUnanswered = unanswered[0];
            const pillarIndex = PILLARS.findIndex(p => p.id === firstUnanswered.pillarId);

            showToast(`Atenção: Existem ${unanswered.length} perguntas não respondidas. Respondendo o restante...`, "warning");
            renderQuizPillar(pillarIndex);

            // Destaca a pergunta não respondida
            setTimeout(() => {
                const card = document.getElementById(`card-q-${firstUnanswered.id}`);
                if (card) {
                    card.scrollIntoView({ behavior: "smooth", block: "center" });
                    card.style.boxShadow = "0 0 0 3px #ef4444";
                    setTimeout(() => card.style.boxShadow = "", 2500);
                }
            }, 300);
            return;
        }

        // Se todas as 24 perguntas foram respondidas, calcula os resultados
        calculateResults();
        renderResultsScreen();
        goToStep("results");
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // -------------------------------------------------------------
    // 9. CÁLCULO ESTRATÉGICO DE MATURIDADE
    // -------------------------------------------------------------
    function calculateResults() {
        let totalPoints = 0;
        const maxPossiblePoints = QUESTIONS.length * 5; // 24 * 5 = 120 pontos

        // Cálculo por pilar
        const pillarScores = PILLARS.map(p => {
            const pQuestions = QUESTIONS.filter(q => q.pillarId === p.id);
            const pMax = pQuestions.length * 5;
            const pEarned = pQuestions.reduce((acc, q) => acc + (state.answers[q.id] || 0), 0);
            const pPercentage = Math.round((pEarned / pMax) * 100);

            totalPoints += pEarned;

            return {
                ...p,
                earnedPoints: pEarned,
                maxPoints: pMax,
                percentage: pPercentage
            };
        });

        const overallPercentage = Math.round((totalPoints / maxPossiblePoints) * 100);

        // Identifica nível de maturidade correspondente
        const maturity = MATURITY_LEVELS.find(lvl => overallPercentage >= lvl.min && overallPercentage <= lvl.max) || MATURITY_LEVELS[0];

        // Lista de gaps (perguntas com nota 1, 2 ou 3) ordenados por prioridade (menor nota primeiro)
        const gaps = QUESTIONS
            .filter(q => (state.answers[q.id] || 0) <= 3)
            .map(q => ({
                question: q,
                score: state.answers[q.id] || 0
            }))
            .sort((a, b) => a.score - b.score);

        state.calculatedResults = {
            totalPoints,
            maxPossiblePoints,
            overallPercentage,
            maturity,
            pillarScores,
            gaps
        };
    }

    // -------------------------------------------------------------
    // 10. RENDERIZAÇÃO DA TELA DE RESULTADOS
    // -------------------------------------------------------------
    function renderResultsScreen() {
        const res = state.calculatedResults;
        if (!res) return;

        // Saudação e Cabeçalho
        if (state.userData.name && state.userData.company) {
            document.getElementById("results-greeting").textContent = `Diagnóstico de ${state.userData.name} • ${state.userData.company}`;
        } else if (state.userData.company) {
            document.getElementById("results-greeting").textContent = `Diagnóstico de Governança • ${state.userData.company}`;
        } else if (state.userData.name) {
            document.getElementById("results-greeting").textContent = `Diagnóstico de ${state.userData.name}`;
        } else {
            document.getElementById("results-greeting").textContent = `Diagnóstico de Governança & Maturidade`;
        }
        document.getElementById("score-circle-value").textContent = `${res.overallPercentage}%`;
        document.getElementById("maturity-badge-text").textContent = res.maturity.level;
        document.getElementById("maturity-headline").textContent = res.maturity.headline;
        document.getElementById("maturity-summary").textContent = res.maturity.summary;

        // Grid de Pontuação dos 5 Pilares
        const pillarsGrid = document.getElementById("pillars-score-grid");
        pillarsGrid.innerHTML = res.pillarScores.map(p => `
            <div class="pillar-score-card">
                <div class="pillar-score-header">
                    <span class="pillar-score-title"><i class="${p.icon}"></i> ${p.name}</span>
                    <span class="pillar-percentage">${p.percentage}%</span>
                </div>
                <div class="progress-track" style="height: 8px;">
                    <div class="progress-bar-fill" style="width: ${p.percentage}%;"></div>
                </div>
                <div style="margin-top: 0.5rem; font-size: 0.78rem; color: var(--text-muted); display: flex; justify-content: space-between;">
                    <span>${p.earnedPoints} de ${p.maxPoints} pontos</span>
                    <span>${p.percentage >= 70 ? 'Maturidade Alta' : (p.percentage >= 50 ? 'Intermediário' : 'Crítico')}</span>
                </div>
            </div>
        `).join("");

        // Diretrizes Estratégicas para o Nível de Maturidade
        const actionsListEl = document.getElementById("maturity-actions-list");
        if (actionsListEl && res.maturity.actionPoints) {
            actionsListEl.innerHTML = res.maturity.actionPoints.map(point => `
                <li style="display: flex; align-items: flex-start; gap: 0.5rem;">
                    <i class="fas fa-check-circle" style="color: var(--primary); margin-top: 0.25rem; font-size: 0.85rem;"></i>
                    <span>${point}</span>
                </li>
            `).join("");
        }

        // Seção: Pontos de Melhoria Prioritários (Gaps)
        const gapsListEl = document.getElementById("gaps-list");
        if (res.gaps.length === 0) {
            gapsListEl.innerHTML = `
                <div style="padding: 1.5rem; text-align: center; color: var(--accent);">
                    <i class="fas fa-award" style="font-size: 2.5rem; margin-bottom: 0.5rem;"></i>
                    <p style="font-weight: 700; font-size: 1.1rem;">Parabéns! Nenhum ponto crítico identificado.</p>
                    <p style="font-size: 0.9rem; color: var(--text-muted);">Sua empresa opera no padrão de excelência de governança corporativa.</p>
                </div>
            `;
        } else {
            gapsListEl.innerHTML = res.gaps.map((gap, index) => {
                const opt = DEFAULT_OPTIONS.find(o => o.value === gap.score);
                const isCritical = gap.score <= 2;

                return `
                    <div class="gap-item ${isCritical ? 'critical' : ''}">
                        <div class="gap-question-title">${index + 1}. ${gap.question.title}</div>
                        <span class="gap-answer-badge">
                            ${opt ? opt.label : `Nota: ${gap.score}/5`}
                        </span>
                        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.6rem;">
                            <strong>Cenário avaliado:</strong> ${gap.question.description}
                        </p>
                        <div class="gap-tip-box">
                            <strong><i class="fas fa-lightbulb"></i> Recomendação da Mentoria:</strong> ${gap.question.tip}
                        </div>
                    </div>
                `;
            }).join("");
        }

        // WhatsApp CTA Button
        const whatsappBtn = document.getElementById("whatsapp-cta-btn");
        const defaultPhone = "5549988369445"; // Contato da Mentora Taís Trevisol Scherner

        let participantInfo = "";
        if (state.userData.name && state.userData.company) {
            participantInfo = `Meu nome é ${state.userData.name} e avaliei a empresa "${state.userData.company}" (${state.userData.roleLabel}).\n`;
        } else if (state.userData.name) {
            participantInfo = `Meu nome é ${state.userData.name} (${state.userData.roleLabel}).\n`;
        } else if (state.userData.company) {
            participantInfo = `Avaliação da empresa "${state.userData.company}" no papel de ${state.userData.roleLabel}.\n`;
        } else {
            participantInfo = `Perfil: ${state.userData.roleLabel} (${state.userData.segment}).\n`;
        }

        const companyStr = state.userData.company ? ` para a empresa "${state.userData.company}"` : "";

        const waMsg = encodeURIComponent(
            `Olá, Taís! Acabei de realizar o Diagnóstico de Governança & Maturidade${companyStr}.\n` +
            participantInfo +
            `Meu índice geral foi de ${res.overallPercentage}% (${res.maturity.level}).\n` +
            `Gostaria de agendar uma sessão de mentoria para analisar o plano de ação e os pontos prioritários da empresa.`
        );
        whatsappBtn.href = `https://api.whatsapp.com/send?phone=${defaultPhone}&text=${waMsg}`;

        // PDF Download Button
        const downloadPdfBtn = document.getElementById("download-pdf-btn");
        downloadPdfBtn.onclick = async () => {
            downloadPdfBtn.disabled = true;
            downloadPdfBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando Relatório Executivo...';

            showToast("Formatando e gerando PDF executivo de alta fidelidade...");

            try {
                await window.diagnosticPdfGenerator.generatePdf(
                    state.userData,
                    state.calculatedResults,
                    QUESTIONS,
                    state.answers
                );
                showToast("Relatório baixado com sucesso!");
            } catch (err) {
                console.error("Erro ao gerar PDF:", err);
                showToast("Erro ao exportar PDF. Tente imprimir a página.", "warning");
            } finally {
                downloadPdfBtn.disabled = false;
                downloadPdfBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Baixar Relatório Executivo Completo (PDF)';
            }
        };

        // Botão Refazer Teste
        document.getElementById("retake-test-btn").onclick = () => {
            if (confirm("Deseja reiniciar o diagnóstico do zero?")) {
                state.answers = {};
                state.calculatedResults = null;
                goToStep("welcome");
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        };
    }

    // -------------------------------------------------------------
    // 11. TOAST NOTIFICATIONS
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
});
