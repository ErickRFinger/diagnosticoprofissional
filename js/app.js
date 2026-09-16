/**
 * Sistema de Diagnóstico & Governança da Empresa Familiar
 * Controle de Fluxo, Temas, Questionário, Analytics (Chart.js Radar, BSC) e Diagnóstico
 * Metodologia: Taís Trevisol Scherner (Unoesc, 2024)
 */

document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------------------------------------
    // ESTADO CENTRAL DA APLICAÇÃO
    // -------------------------------------------------------------
    const state = {
        theme: localStorage.getItem("app_theme") || "light",
        currentStep: "welcome", // "welcome" | "quiz" | "results"
        currentPillarIndex: 0,
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

    const questionsContainer = document.getElementById("questions-container");
    const pillarTabsContainer = document.getElementById("pillar-tabs");
    const currentPillarNameEl = document.getElementById("current-pillar-name");
    const currentPillarDescEl = document.getElementById("current-pillar-desc");
    const currentPillarRefEl = document.getElementById("current-pillar-ref");

    const progressBarFill = document.getElementById("progress-bar-fill");
    const progressCountEl = document.getElementById("progress-count");
    const progressPercentEl = document.getElementById("progress-percent");

    const prevPillarBtn = document.getElementById("prev-pillar-btn");
    const nextPillarBtn = document.getElementById("next-pillar-btn");
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
        renderQuizPillar(0);
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
    // 6. RENDERIZAÇÃO DO QUESTIONÁRIO POR PILARES
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
                    ${isCompleted ? '<i class="fas fa-check-circle" style="margin-left: 3px;"></i>' : ''}
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
        if (currentPillarRefEl) {
            currentPillarRefEl.innerHTML = `<i class="fas fa-book-bookmark"></i> Base Teórica: ${currentPillar.academicRef}`;
        }

        questionsContainer.innerHTML = pillarQuestions.map((q) => {
            const currentAnswer = state.answers[q.id];
            const isAnswered = currentAnswer !== undefined;
            const bscObj = BSC_PERSPECTIVES[q.bscPerspective];

            const optionsHtml = DEFAULT_OPTIONS.map(opt => `
                <label class="option-item" data-val="${opt.value}">
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
                        <div class="question-meta-tags">
                            <span class="question-number-badge">Questão ${q.id} de 24</span>
                            ${q.dimension ? `<span class="question-dimension-badge"><i class="fas fa-layer-group"></i> ${q.dimension}</span>` : ''}
                            ${bscObj ? `<span class="question-bsc-badge"><i class="${bscObj.icon}"></i> BSC: ${bscObj.name.split('&')[0].trim()}</span>` : ''}
                        </div>
                        <div id="badge-status-q-${q.id}">
                            ${isAnswered ? '<span style="color: var(--accent); font-size: 0.85rem; font-weight: 700;"><i class="fas fa-check"></i> Respondida</span>' : ''}
                        </div>
                    </div>

                    <h3 class="question-title">${q.title}</h3>
                    <p class="question-desc">${q.description}</p>
                    
                    <div class="options-list">
                        ${optionsHtml}
                    </div>
                </div>
            `;
        }).join("");

        // Listeners das opções
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
                        const statusBadge = document.getElementById(`badge-status-q-${q.id}`);
                        if (statusBadge) {
                            statusBadge.innerHTML = '<span style="color: var(--accent); font-size: 0.85rem; font-weight: 700;"><i class="fas fa-check"></i> Respondida</span>';
                        }
                    }

                    saveDraft();
                    updateProgress();
                    renderPillarTabs();
                });
            });
        });

        // Atualiza botões
        prevPillarBtn.style.display = pillarIndex > 0 ? "inline-flex" : "none";
        if (pillarIndex === PILLARS.length - 1) {
            nextPillarBtn.style.display = "none";
            finishQuizBtn.style.display = "inline-flex";
        } else {
            nextPillarBtn.style.display = "inline-flex";
            finishQuizBtn.style.display = "none";
        }

        renderPillarTabs();
        window.scrollTo({ top: 120, behavior: "smooth" });
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
    // 7. PROGRESSO EM TEMPO REAL
    // -------------------------------------------------------------
    function updateProgress() {
        const total = QUESTIONS.length;
        const answeredCount = Object.keys(state.answers).length;
        const percentage = Math.round((answeredCount / total) * 100);

        progressBarFill.style.width = `${percentage}%`;
        progressCountEl.innerHTML = `<i class="fas fa-tasks"></i> ${answeredCount} de ${total} respondidas`;
        progressPercentEl.textContent = `${percentage}% concluído`;
    }

    // -------------------------------------------------------------
    // 8. AUTO-SAVE LOCALSTORAGE & BOTÕES DE DEMO/RESET
    // -------------------------------------------------------------
    function saveDraft() {
        try {
            const draft = {
                userData: state.userData,
                answers: state.answers,
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
                return true;
            }
        } catch (e) {
            console.warn("Falha ao carregar rascunho", e);
        }
        return false;
    }

    if (fillSampleBtn) {
        fillSampleBtn.addEventListener("click", () => {
            // Preenche as 24 questões com valores equilibrados e realistas (caso prático similar à dissertação)
            const sampleScores = [
                3, 4, 3, 2, 4, 3, 3, // Pilar 1: Gestão (7 perguntas)
                4, 3, 2, 3, 3, 3, 2, // Pilar 2: Estrutura & Processos (7 perguntas)
                3, 2, 2, 3,          // Pilar 3: Família & Negócio (4 perguntas)
                4, 3, 3, 3,          // Pilar 4: Pessoas (4 perguntas)
                4, 4                 // Pilar 5: Cultura & Ambiente (2 perguntas)
            ];

            QUESTIONS.forEach((q, idx) => {
                state.answers[q.id] = sampleScores[idx] || 3;
            });

            saveDraft();
            renderQuizPillar(state.currentPillarIndex);
            updateProgress();
            showToast("24 questões preenchidas com dados de exemplo da pesquisa!");
        });
    }

    if (resetAnswersBtn) {
        resetAnswersBtn.addEventListener("click", () => {
            if (confirm("Deseja limpar todas as respostas desta avaliação?")) {
                state.answers = {};
                localStorage.removeItem("diagnostic_draft_v2");
                renderQuizPillar(state.currentPillarIndex);
                updateProgress();
                showToast("Respostas reiniciadas!");
            }
        });
    }

    // -------------------------------------------------------------
    // 9. FINALIZAÇÃO E CÁLCULO ESTRATÉGICO
    // -------------------------------------------------------------
    finishQuizBtn.addEventListener("click", () => {
        const unanswered = QUESTIONS.filter(q => state.answers[q.id] === undefined);

        if (unanswered.length > 0) {
            const firstUnanswered = unanswered[0];
            const pillarIndex = PILLARS.findIndex(p => p.id === firstUnanswered.pillarId);

            showToast(`Atenção: faltam ${unanswered.length} questões. Navegando para o pilar correspondente...`, "warning");
            renderQuizPillar(pillarIndex);

            setTimeout(() => {
                const card = document.getElementById(`card-q-${firstUnanswered.id}`);
                if (card) {
                    card.scrollIntoView({ behavior: "smooth", block: "center" });
                    card.style.boxShadow = "0 0 0 4px var(--danger)";
                    setTimeout(() => card.style.boxShadow = "", 3000);
                }
            }, 350);
            return;
        }

        calculateResults();
        renderResultsScreen();
        goToStep("results");
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // -------------------------------------------------------------
    // 10. MOTOR DE CÁLCULO: PILARES, BSC & GAPS
    // -------------------------------------------------------------
    function calculateResults() {
        let totalPoints = 0;
        const maxPossiblePoints = QUESTIONS.length * 5; // 24 * 5 = 120 pontos

        // 10.1 Pontuação dos 5 Pilares
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

        // 10.2 Nível de Maturidade
        const maturity = MATURITY_LEVELS.find(lvl => overallPercentage >= lvl.min && overallPercentage <= lvl.max) || MATURITY_LEVELS[0];

        // 10.3 Pontuação nas 4 Perspectivas do Balanced Scorecard (BSC)
        const bscScores = Object.values(BSC_PERSPECTIVES).map(b => {
            const bQuestions = QUESTIONS.filter(q => q.bscPerspective === b.id);
            const bMax = bQuestions.length * 5;
            const bEarned = bQuestions.reduce((acc, q) => acc + (state.answers[q.id] || 0), 0);
            const bPercentage = Math.round((bEarned / bMax) * 100);

            let statusText = "Em Desenvolvimento";
            let statusColor = "var(--warning)";
            if (bPercentage >= 75) {
                statusText = "Impacto Positivo Consolidado";
                statusColor = "var(--accent)";
            } else if (bPercentage < 50) {
                statusText = "Gargalo Crítico de Desempenho";
                statusColor = "var(--danger)";
            }

            return {
                ...b,
                questionsCount: bQuestions.length,
                earnedPoints: bEarned,
                maxPoints: bMax,
                percentage: bPercentage,
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

        state.calculatedResults = {
            totalPoints,
            maxPossiblePoints,
            overallPercentage,
            maturity,
            pillarScores,
            bscScores,
            gaps
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
            greetingEl.textContent = `Diagnóstico de Empresa Familiar • Modo Confidencial`;
        } else if (state.userData.name && state.userData.company) {
            greetingEl.textContent = `Diagnóstico de ${state.userData.name} • ${state.userData.company}`;
        } else if (state.userData.company) {
            greetingEl.textContent = `Diagnóstico de Governança • ${state.userData.company}`;
        } else {
            greetingEl.textContent = `Diagnóstico de ${state.userData.name || 'Empresa Familiar'}`;
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

        // 11.3 Módulo Balanced Scorecard (BSC)
        const bscGrid = document.getElementById("bsc-cards-grid");
        if (bscGrid) {
            bscGrid.innerHTML = res.bscScores.map(b => `
                <div class="bsc-card" style="border-top: 4px solid ${b.color};">
                    <div class="bsc-card-top">
                        <div class="bsc-icon-bubble" style="background-color: ${b.color}20; color: ${b.color};">
                            <i class="${b.icon}"></i>
                        </div>
                        <span class="bsc-card-score" style="color: ${b.color};">${b.percentage}%</span>
                    </div>
                    <div class="bsc-card-name">${b.name}</div>
                    <div class="bsc-card-desc">${b.description}</div>
                    <div class="progress-track" style="height: 6px; margin-bottom: 0.5rem;">
                        <div class="progress-bar-fill" style="width: ${b.percentage}%; background: ${b.color};"></div>
                    </div>
                    <div class="bsc-impact-status" style="background-color: ${b.color}15; color: ${b.color};">
                        ${b.statusText}
                    </div>
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

        // 11.7 WhatsApp CTA Button
        setupWhatsAppButton(res);

        // 11.8 PDF Download Button
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
                                Nota: ${gap.score}/5 • ${opt ? opt.label.split('—')[1].trim() : ''}
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

            let pillStyle = "background: var(--scale-5-bg); color: var(--scale-5);";
            if (score <= 2) pillStyle = "background: var(--scale-1-bg); color: var(--scale-1);";
            else if (score === 3) pillStyle = "background: var(--scale-3-bg); color: var(--scale-3);";

            return `
                <tr>
                    <td style="text-align: center; font-weight: 800; color: var(--primary);">${q.id}</td>
                    <td>
                        <strong>${q.dimension || 'Dimensão de Polat'}</strong>
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
    // 15. INTEGRAÇÕES: WHATSAPP, PDF & EXPORTAÇÃO JSON
    // -------------------------------------------------------------
    function setupWhatsAppButton(res) {
        const whatsappBtn = document.getElementById("whatsapp-cta-btn");
        if (!whatsappBtn) return;
        const defaultPhone = "5549988369445"; // Contato da Mentora Taís Trevisol Scherner

        let participantInfo = "";
        if (state.userData.isAnonymous) {
            participantInfo = `Perfil: ${state.userData.roleLabel} (${state.userData.segment}) - Resposta Confidencial.\n`;
        } else if (state.userData.name && state.userData.company) {
            participantInfo = `Meu nome é ${state.userData.name} da empresa "${state.userData.company}" (${state.userData.roleLabel}).\n`;
        } else {
            participantInfo = `Meu nome é ${state.userData.name || 'Gestor'} (${state.userData.roleLabel}).\n`;
        }

        const topGaps = res.gaps.slice(0, 2).map(g => `• ${g.question.title}`).join('\n');
        const gapsText = topGaps ? `\nPrincipais pontos de atenção identificados:\n${topGaps}\n` : '';

        const waMsg = encodeURIComponent(
            `Olá, Taís! Acabei de realizar o Diagnóstico de Governança & Empresa Familiar.\n` +
            participantInfo +
            `Índice Geral de Maturidade: ${res.overallPercentage}% (${res.maturity.level}).\n` +
            gapsText +
            `Gostaria de agendar uma devolutiva de mentoria estratégica para avaliar o plano de ação e a sucessão da empresa.`
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

            // Captura imagem do gráfico radar em base64
            let radarImgData = null;
            if (radarChartInstance) {
                try {
                    radarImgData = radarChartInstance.toBase64Image();
                } catch (e) {
                    console.warn("Não foi possível extrair imagem do radar chart", e);
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
                version: "2.0",
                methodology: "Taís Trevisol Scherner - Unoesc 2024",
                exportedAt: new Date().toISOString(),
                userData: state.userData,
                answers: state.answers,
                calculatedResults: state.calculatedResults
            };

            const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
            const downloadAnchor = document.createElement("a");
            const companySlug = (state.userData.company || "Empresa_Familiar").replace(/\s+/g, "_");
            downloadAnchor.setAttribute("href", jsonStr);
            downloadAnchor.setAttribute("download", `Diagnostico_Governanca_${companySlug}_${new Date().toISOString().slice(0, 10)}.json`);
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
    // 16. ATALHOS DE TECLADO (1 a 5 para responder rápido)
    // -------------------------------------------------------------
    document.addEventListener("keydown", (e) => {
        if (state.currentStep !== "quiz") return;
        if (["1", "2", "3", "4", "5"].includes(e.key)) {
            // Evita disparar se o usuário estiver digitando em um input
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

            const val = parseInt(e.key, 10);
            const currentPillar = PILLARS[state.currentPillarIndex];
            const pillarQuestions = QUESTIONS.filter(q => q.pillarId === currentPillar.id);
            const firstUnanswered = pillarQuestions.find(q => state.answers[q.id] === undefined);

            if (firstUnanswered) {
                const radio = document.querySelector(`input[name="question_${firstUnanswered.id}"][value="${val}"]`);
                if (radio) {
                    radio.checked = true;
                    radio.dispatchEvent(new Event("change"));
                }
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

    // Restaura rascunho anterior se houver
    if (loadDraft() && Object.keys(state.answers).length > 0) {
        updateProgress();
    }
});
