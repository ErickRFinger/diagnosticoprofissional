/**
 * Gerador de Relatório Executivo em PDF - Diagnóstico Empresarial
 * Avaliação de Maturidade, Governança & Gestão Estratégica
 * Auditoria de Margem & Processos
 *
 * Diagramação Executiva: Capa Nobre (Estilo Dossiê), Identificação,
 * Gráfico Radar, 5 Eixos Estratégicos, Módulo DRE, Matriz de Priorização
 * e Tabela de Auditoria das 24 Questões.
 */

class DiagnosticPdfGenerator {
    constructor() {
        this.mentorConfig = {
            reportTitle: "Relatório Executivo • Auditoria de Margem & Processos",
            tagline: "Diagnóstico Empresarial de Eficiência Operacional, Governança & DRE",
            responsavel: "Taís Trevisol Scherner • Erick Finger",
            cargo: "Governança & Gestão Estratégica",
            contactPhone: "(49) 98836-9445",
            contactEmail: "contato@visualtech.com.br",
            disclaimer: "Documento confidencial desenvolvido para auditoria de processos, governança e otimização das margens na DRE."
        };
    }

    /**
     * Gera e dispara o download do PDF executivo de alta fidelidade
     */
    async generatePdf(userData, results, questions, answers, radarImgData = null) {
        const currentDate = new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        const protocol = Date.now().toString().slice(-6);

        // Salva a posição de rolagem atual do usuário
        const prevScrollX = window.scrollX || window.pageXOffset || 0;
        const prevScrollY = window.scrollY || window.pageYOffset || 0;

        const reportContainer = document.createElement('div');
        reportContainer.id = 'executive-pdf-content';
        reportContainer.innerHTML = this.buildReportHtml(userData, results, questions, answers, currentDate, protocol, radarImgData);

        reportContainer.style.cssText = `
            position: relative;
            width: 740px;
            margin: 0 auto;
            background: #ffffff;
            color: #0f172a;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            padding: 16px 20px;
            line-height: 1.45;
            box-sizing: border-box;
        `;

        document.body.appendChild(reportContainer);

        const companyOrName = userData.isAnonymous ? 'Confidencial' : (userData.company || userData.name || 'Empresa');
        const fileName = `Auditoria_Margem_Processos_${companyOrName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;

        // Rola suavemente ao topo para o html2canvas capturar com coordenadas corretas
        window.scrollTo(0, 0);

        if (typeof html2pdf !== 'undefined') {
            const opt = {
                margin: [10, 10, 10, 10],
                filename: fileName,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2, 
                    useCORS: true, 
                    logging: false,
                    scrollY: 0,
                    scrollX: 0,
                    windowWidth: 740
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['css', 'legacy'] }
            };

            try {
                await html2pdf().set(opt).from(reportContainer).save();
            } catch (err) {
                console.error("Erro no html2pdf, abrindo impressão nativa:", err);
                this.fallbackPrint(reportContainer.innerHTML);
            } finally {
                if (document.body.contains(reportContainer)) {
                    document.body.removeChild(reportContainer);
                }
                // Restaura a posição de rolagem original do usuário
                window.scrollTo(prevScrollX, prevScrollY);
            }
        } else {
            this.fallbackPrint(reportContainer.innerHTML);
            if (document.body.contains(reportContainer)) {
                document.body.removeChild(reportContainer);
            }
            window.scrollTo(prevScrollX, prevScrollY);
        }
    }

    /**
     * Fallback de impressão nativa
     */
    fallbackPrint(htmlContent) {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Relatório • Auditoria de Margem & Processos</title>
                <style>
                    body { font-family: Arial, sans-serif; color: #0f172a; padding: 25px; }
                    .page-break { page-break-before: always; }
                    table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11px; }
                    th, td { border: 1px solid #cbd5e1; padding: 7px; text-align: left; }
                    th { background-color: #f1f5f9; }
                </style>
            </head>
            <body>
                ${htmlContent}
                <script>
                    window.onload = function() { window.print(); };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    /**
     * Constrói a estrutura HTML completa do relatório executivo
     */
    buildReportHtml(userData, results, questions, answers, currentDate, protocol, radarImgData) {
        const compName = userData.isAnonymous ? 'Confidencial' : (userData.company || userData.name || 'Organização Avaliada');
        const gestorName = userData.isAnonymous ? 'Participante Confidencial' : (userData.name || 'Diretoria Executiva');
        const roleDesc = userData.roleLabel || userData.role || 'Gestor(a) / Decisor(a)';
        const segmentDesc = userData.segment || 'Empresa Privada';

        // 1. Linhas da tabela de 24 perguntas
        const questionsTableRows = questions.map(q => {
            const score = answers[q.id] || 0;
            const opt = typeof DEFAULT_OPTIONS !== 'undefined' ? DEFAULT_OPTIONS.find(o => o.value === score) : null;
            const optLabel = opt ? opt.label : `Nota ${score}/5`;
            const dreObj = typeof DRE_IMPACTS !== 'undefined' && DRE_IMPACTS[q.dreImpact];

            let badgeBg = "#f1f5f9";
            let badgeColor = "#475569";
            if (score <= 2) { badgeBg = "#fee2e2"; badgeColor = "#991b1b"; }
            else if (score === 3) { badgeBg = "#fef3c7"; badgeColor = "#92400e"; }
            else if (score === 4) { badgeBg = "#e0f2fe"; badgeColor = "#0369a1"; }
            else if (score === 5) { badgeBg = "#d1fae5"; badgeColor = "#065f46"; }

            return `
                <tr style="page-break-inside: avoid; break-inside: avoid;">
                    <td style="padding: 6px 8px; border: 1px solid #e2e8f0; font-size: 10px; text-align: center; font-weight: 800; color: #0284c7;">${q.id}</td>
                    <td style="padding: 6px 8px; border: 1px solid #e2e8f0; font-size: 10px;">
                        <strong style="color: #0f172a; font-size: 10.5px;">${q.title}</strong>
                        ${q.dimension ? `<span style="color: #64748b; font-size: 9px; font-weight: 700; margin-left: 4px;">[${q.dimension}]</span>` : ''}
                        ${dreObj ? `<span style="color: #0284c7; font-size: 9px; font-weight: 700; margin-left: 4px;">[${dreObj.name}]</span>` : ''}<br>
                        <span style="color: #475569; font-size: 9.5px; line-height: 1.35; display: inline-block; margin-top: 2px;">${q.description}</span>
                    </td>
                    <td style="padding: 6px 8px; border: 1px solid #e2e8f0; font-size: 9.5px; text-align: center; white-space: nowrap;">
                        <span style="display: inline-block; padding: 3px 7px; border-radius: 4px; font-weight: 700; background: ${badgeBg}; color: ${badgeColor};">
                            ${optLabel}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');

        // 2. Resumo dos 5 Eixos Estratégicos
        const pillarsHtml = results.pillarScores.map(p => `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 7px 10px; margin-bottom: 6px; page-break-inside: avoid; break-inside: avoid;">
                <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; margin-bottom: 4px;">
                    <span style="color: #0f172a;">${p.name}</span>
                    <span style="color: #0284c7;">${p.percentage}% (${p.earnedPoints}/${p.maxPoints} pts)</span>
                </div>
                <div style="background: #e2e8f0; height: 6px; border-radius: 3px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #0284c7, #059669); height: 100%; width: ${p.percentage}%;"></div>
                </div>
            </div>
        `).join('');

        // 3. Módulo DRE (Demonstração do Resultado)
        const dreList = results.dreScores || results.bscScores;
        const dreHtml = dreList ? dreList.map(b => `
            <div style="border: 1px solid #e2e8f0; border-top: 3px solid ${b.color}; background: #ffffff; border-radius: 6px; padding: 8px 10px; page-break-inside: avoid; break-inside: avoid;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                    <div>
                        ${b.line ? `<span style="font-size: 8px; text-transform: uppercase; font-weight: 800; color: #0284c7; display: block;">${b.line}</span>` : ''}
                        <strong style="font-size: 10.5px; color: #0f172a;">${b.name}</strong>
                    </div>
                    <span style="font-size: 11.5px; font-weight: 800; color: ${b.color};">${b.percentage}%</span>
                </div>
                <p style="font-size: 9px; color: #64748b; margin: 2px 0 4px; line-height: 1.3;">${b.description}</p>
                <div style="background: #f1f5f9; height: 5px; border-radius: 3px; overflow: hidden; margin-bottom: 4px;">
                    <div style="background: ${b.color}; height: 100%; width: ${b.percentage}%;"></div>
                </div>
                <div style="font-size: 9px; font-weight: 700; color: ${b.color};">
                    ${b.statusText}
                </div>
            </div>
        `).join('') : '';

        // 4. Plano de Ação Prioritário (Gaps)
        const improvementGaps = results.gaps || [];
        const actionPlanHtml = improvementGaps.length > 0 ? improvementGaps.map((gap, index) => {
            let horizonBadge = "Vitória Rápida (Curto Prazo)";
            if (gap.horizon === "estruturante") horizonBadge = "Governança Estruturante (Médio Prazo)";
            if (gap.horizon === "sistemas") horizonBadge = "Controle & Sistemas (Longo Prazo)";

            return `
                <div style="border-left: 4px solid ${gap.score <= 2 ? '#ef4444' : '#f59e0b'}; background: #fafafa; border-radius: 4px; padding: 8px 10px; margin-bottom: 8px; page-break-inside: avoid; break-inside: avoid;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
                        <strong style="font-size: 11px; color: #0f172a;">${index + 1}. ${gap.question.title}</strong>
                        <div style="display: flex; gap: 4px;">
                            <span style="font-size: 8.5px; padding: 2px 5px; border-radius: 3px; background: #e0f2fe; color: #0369a1; font-weight: 700;">
                                ${horizonBadge}
                            </span>
                            <span style="font-size: 8.5px; padding: 2px 5px; border-radius: 3px; background: ${gap.score <= 2 ? '#fee2e2' : '#fef3c7'}; color: ${gap.score <= 2 ? '#991b1b' : '#92400e'}; font-weight: 700;">
                                Nota: ${gap.score}/5 (${gap.score <= 2 ? 'Crítico' : 'Atenção'})
                            </span>
                        </div>
                    </div>
                    <p style="font-size: 9.5px; color: #475569; margin: 2px 0;"><strong>Situação Avaliada:</strong> ${gap.question.description}</p>
                    <div style="font-size: 9.5px; color: #0369a1; background: #e0f2fe; padding: 6px 8px; border-radius: 4px; margin-top: 4px;">
                        <strong>Orientação Prática de Gestão:</strong> ${gap.question.tip}
                    </div>
                </div>
            `;
        }).join('') : '<p style="font-size: 10.5px; color: #059669; font-weight: 700;">Excelente! A empresa não apresentou respostas em níveis críticos nos 5 eixos avaliados.</p>';

        return `
            <!-- ============================================================
                 CAPA NOBRE EXECUTIVA (ESTILO DOSSIÊ CORPORATIVO)
                 ============================================================ -->
            <div style="background: linear-gradient(135deg, #18131d 0%, #261726 100%); color: #F4EFEA; border-radius: 10px; padding: 20px 24px; margin-bottom: 16px; border: 1px solid rgba(203, 161, 82, 0.35); page-break-inside: avoid; break-inside: avoid;">
                
                <!-- Tag Superior da Capa -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(203, 161, 82, 0.3); padding-bottom: 10px; margin-bottom: 16px;">
                    <span style="font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase; color: #CBA152; font-weight: 800;">
                        AUDITORIA DE MARGEM & PROCESSOS
                    </span>
                    <span style="font-size: 9px; letter-spacing: 0.1em; color: #D6C2B4; text-transform: uppercase;">
                        DOSSIÊ EXECUTIVO CONFIDENCIAL
                    </span>
                </div>

                <!-- Palavra-Essência & Conceito Central -->
                <div style="text-align: center; margin: 12px 0 16px;">
                    <div style="font-size: 9.5px; letter-spacing: 0.22em; text-transform: uppercase; color: #CBA152; font-weight: 700; margin-bottom: 4px;">
                        CONCEITO CENTRAL & PALAVRA-ESSÊNCIA
                    </div>
                    <div style="font-family: Georgia, serif; font-size: 28px; font-weight: 800; letter-spacing: 0.08em; color: #FFF6EC; text-transform: uppercase; margin-bottom: 6px;">
                        ${results.essenceWord || 'CONSOLIDAÇÃO'}
                    </div>
                    <div style="max-width: 620px; margin: 0 auto; font-size: 10.5px; color: #D6C2B4; line-height: 1.45; font-style: italic;">
                        "${results.archetypeTitle || 'Diagnóstico Executivo'} — ${results.archetypeDesc || 'Refinamento fino de margens e governança avançada.'}"
                    </div>
                </div>

                <!-- Metadados da Empresa & Auditoria -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(203, 161, 82, 0.25); font-size: 10px;">
                    <div>
                        <span style="display: block; font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; color: #CBA152; font-weight: 700;">EMPRESA AUDITADA</span>
                        <strong style="font-size: 12px; color: #FFF6EC;">${compName}</strong>
                        <div style="font-size: 9px; color: #D6C2B4; margin-top: 1px;">${segmentDesc}</div>
                    </div>
                    <div>
                        <span style="display: block; font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; color: #CBA152; font-weight: 700;">GESTOR / DECISOR</span>
                        <strong style="font-size: 12px; color: #FFF6EC;">${gestorName}</strong>
                        <div style="font-size: 9px; color: #D6C2B4; margin-top: 1px;">${roleDesc}</div>
                    </div>
                    <div>
                        <span style="display: block; font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; color: #CBA152; font-weight: 700;">DATA DA AUDITORIA</span>
                        <strong style="font-size: 11px; color: #FFF6EC;">${currentDate}</strong>
                        <div style="font-size: 9px; color: #D6C2B4; margin-top: 1px;">Protocolo nº ${protocol}</div>
                    </div>
                    <div>
                        <span style="display: block; font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; color: #CBA152; font-weight: 700;">RESPONSABILIDADE TÉCNICA</span>
                        <strong style="font-size: 11px; color: #FFF6EC;">${this.mentorConfig.responsavel}</strong>
                        <div style="font-size: 9px; color: #D6C2B4; margin-top: 1px;">${this.mentorConfig.cargo}</div>
                    </div>
                </div>
            </div>

            <!-- SCORE GERAL & ESTÁGIO DE MATURIDADE -->
            <div style="display: flex; gap: 14px; align-items: center; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin-bottom: 14px; page-break-inside: avoid; break-inside: avoid;">
                <div style="text-align: center; min-width: 105px; border-right: 1px solid #bbf7d0; padding-right: 14px;">
                    <div style="font-size: 32px; font-weight: 900; color: #166534; line-height: 1;">
                        ${results.overallPercentage}%
                    </div>
                    <div style="font-size: 9.5px; text-transform: uppercase; color: #15803d; font-weight: 800; margin-top: 3px;">
                        Maturidade Geral
                    </div>
                    <div style="font-size: 8.5px; color: #16a34a;">(${results.totalPoints} de ${results.maxPossiblePoints} pts)</div>
                </div>
                <div>
                    <span style="display: inline-block; background: #166534; color: #ffffff; padding: 2px 7px; border-radius: 4px; font-size: 9.5px; font-weight: 700; margin-bottom: 3px;">
                        ${results.maturity.level}
                    </span>
                    <h2 style="font-size: 12.5px; color: #14532d; margin: 0 0 3px; font-weight: 800;">${results.maturity.headline}</h2>
                    <p style="font-size: 9.5px; color: #374151; margin: 0; line-height: 1.4;">${results.maturity.summary}</p>
                </div>
            </div>

            <!-- BALANÇO DAS 24 RESPOSTAS (RAIO-X 1 A 5) -->
            ${results.distribution ? `
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; page-break-inside: avoid; break-inside: avoid;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 8px;">
                        <h3 style="font-size: 11px; text-transform: uppercase; color: #0f172a; margin: 0; font-weight: 800;">
                            1. Balanço das 24 Respostas: Raio-X por Nível (1 a 5)
                        </h3>
                        <span style="font-size: 9px; color: #64748b; font-weight: 600;">
                            ${results.strengthsCount} Fortalezas • ${results.criticalGapsCount} Gargalos Críticos
                        </span>
                    </div>
                    <div style="display: flex; gap: 6px; margin-bottom: 8px;">
                        ${[5, 4, 3, 2, 1].map(k => {
                            const item = results.distribution[k];
                            let borderC = "#10b981"; let bgC = "#d1fae5"; let textC = "#065f46";
                            if (k === 4) { borderC = "#0284c7"; bgC = "#e0f2fe"; textC = "#0369a1"; }
                            if (k === 3) { borderC = "#f59e0b"; bgC = "#fef3c7"; textC = "#92400e"; }
                            if (k === 2) { borderC = "#f97316"; bgC = "#ffedd5"; textC = "#c2410c"; }
                            if (k === 1) { borderC = "#ef4444"; bgC = "#fee2e2"; textC = "#b91c1c"; }
                            return `
                                <div style="flex: 1; border: 1px solid ${borderC}; background: ${bgC}; border-radius: 5px; padding: 5px 6px; text-align: center;">
                                    <div style="font-size: 8px; font-weight: 700; color: ${textC}; text-transform: uppercase;">Nota ${k}</div>
                                    <div style="font-size: 15px; font-weight: 900; color: ${textC}; line-height: 1.1;">${item.count}</div>
                                    <div style="font-size: 8px; color: ${textC};">${item.percentage}%</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    ${results.insightHeadline ? `
                        <div style="background: #f8fafc; border-left: 3px solid #0284c7; padding: 6px 10px; font-size: 9px; color: #334155; line-height: 1.4; border-radius: 0 4px 4px 0;">
                            <strong>Padrão Dominante: ${results.insightHeadline}:</strong> ${results.insightText}
                        </div>
                    ` : ''}
                </div>
            ` : ''}

            <!-- DESEMPENHO POR EIXO ESTRATÉGICO & RADAR -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; margin-bottom: 14px; page-break-inside: avoid; break-inside: avoid;">
                <h3 style="font-size: 11px; text-transform: uppercase; color: #0f172a; margin: 0 0 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; font-weight: 800;">
                    2. Desempenho nos 5 Eixos Estratégicos
                </h3>
                <div style="display: flex; gap: 14px; align-items: center;">
                    ${radarImgData ? `
                        <div style="width: 46%; text-align: center;">
                            <img src="${radarImgData}" style="max-width: 100%; max-height: 200px; object-fit: contain; background: #ffffff;" alt="Teia de Governança">
                            <div style="font-size: 8.5px; color: #64748b; margin-top: 3px; font-weight: 600;">Teia de Governança & Maturidade</div>
                        </div>
                    ` : ''}
                    <div style="width: ${radarImgData ? '54%' : '100%'};">
                        ${pillarsHtml}
                    </div>
                </div>
            </div>

            <!-- IMPACTO ESTRATÉGICO NA DRE (DEMONSTRAÇÃO DO RESULTADO) -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; margin-bottom: 14px; page-break-inside: avoid; break-inside: avoid;">
                <h3 style="font-size: 11px; text-transform: uppercase; color: #0f172a; margin: 0 0 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; font-weight: 800;">
                    3. Impacto Estratégico nas 4 Linhas da DRE
                </h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    ${dreHtml}
                </div>
            </div>

            <!-- PARECER CONFIDENCIAL DE CONSULTORIA -->
            ${results.confidentialReading ? `
                <div style="background: #fdfefe; border: 1px solid #cbd5e1; border-left: 4px solid #0284c7; border-radius: 8px; padding: 12px 14px; margin-bottom: 14px; page-break-inside: avoid; break-inside: avoid;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px;">
                        <span style="font-size: 9px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; color: #0284c7;">
                            4. Parecer Confidencial de Consultoria
                        </span>
                        <span style="font-size: 8.5px; color: #64748b;">Análise Comportamental Integrada</span>
                    </div>
                    <div style="font-size: 9.5px; color: #1e293b; line-height: 1.5; text-align: justify;">
                        <p style="margin: 0 0 5px;">${results.confidentialReading.p1}</p>
                        <p style="margin: 0 0 5px;">${results.confidentialReading.p2}</p>
                        <p style="margin: 0 0 5px;">${results.confidentialReading.p3}</p>
                        <p style="margin: 0;">${results.confidentialReading.p4}</p>
                    </div>
                </div>
            ` : ''}

            <!-- 5 DIRETRIZES DA MENTORIA ESTRATÉGICA -->
            ${results.mentorshipPoints ? `
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; margin-bottom: 14px; page-break-inside: avoid; break-inside: avoid;">
                    <h3 style="font-size: 11px; text-transform: uppercase; color: #0f172a; margin: 0 0 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; font-weight: 800;">
                        5. Diretrizes da Mentoria: 5 Ações Estratégicas Prioritárias
                    </h3>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        ${results.mentorshipPoints.map(pt => `
                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #0284c7; border-radius: 4px; padding: 6px 10px; page-break-inside: avoid; break-inside: avoid;">
                                <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; color: #0f172a;">
                                    <span>${pt.num}. ${pt.title}</span>
                                    <span style="font-size: 8.5px; color: #0284c7;">${pt.impact}</span>
                                </div>
                                <div style="font-size: 9px; color: #475569; margin-top: 2px;">${pt.action}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <!-- PLANO DE AÇÃO: GAPS PRIORITÁRIOS -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; margin-bottom: 14px; page-break-inside: avoid; break-inside: avoid;">
                <h3 style="font-size: 11px; text-transform: uppercase; color: #0f172a; margin: 0 0 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; font-weight: 800;">
                    6. Plano de Ação: Gaps Prioritários e Recomendações
                </h3>
                <p style="font-size: 9.5px; color: #64748b; margin: 0 0 8px;">
                    Práticas que demandam alinhamento ou estruturação (notas 1, 2 e 3), ordenadas por prioridade:
                </p>
                <div>
                    ${actionPlanHtml}
                </div>
            </div>

            <!-- TABELA DE AUDITORIA COMPLETA DAS 24 QUESTÕES -->
            <div style="margin-top: 10px; margin-bottom: 14px;">
                <h3 style="font-size: 11px; text-transform: uppercase; color: #0f172a; margin: 0 0 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; font-weight: 800;">
                    7. Auditoria Completa: As 24 Questões e Respostas Declaradas
                </h3>
                <table style="width: 100%; border-collapse: collapse; background: #ffffff;">
                    <thead>
                        <tr style="background-color: #f1f5f9;">
                            <th style="padding: 6px 8px; border: 1px solid #cbd5e1; font-size: 9.5px; width: 28px; text-align: center;">#</th>
                            <th style="padding: 6px 8px; border: 1px solid #cbd5e1; font-size: 9.5px; text-align: left;">Questão, Dimensão & Impacto DRE</th>
                            <th style="padding: 6px 8px; border: 1px solid #cbd5e1; font-size: 9.5px; width: 130px; text-align: center;">Maturidade</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${questionsTableRows}
                    </tbody>
                </table>
            </div>

            <!-- ENCERRAMENTO & ASSINATURA EXECUTIVA -->
            <div style="margin-top: 18px; border-top: 2px solid #e2e8f0; padding-top: 12px; page-break-inside: avoid; break-inside: avoid;">
                <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                    <div style="font-size: 9px; color: #64748b; max-width: 460px; line-height: 1.4;">
                        <strong style="color: #0f172a; font-size: 9.5px;">${this.mentorConfig.reportTitle}</strong><br>
                        ${this.mentorConfig.tagline}<br>
                        WhatsApp: ${this.mentorConfig.contactPhone} • E-mail: ${this.mentorConfig.contactEmail}<br>
                        <span style="font-size: 8px; color: #94a3b8;">${this.mentorConfig.disclaimer}</span>
                    </div>
                    <div style="text-align: center; width: 200px;">
                        <div style="border-bottom: 1px solid #94a3b8; height: 26px; margin-bottom: 3px;"></div>
                        <div style="font-size: 10px; font-weight: 700; color: #0f172a;">${this.mentorConfig.responsavel}</div>
                        <div style="font-size: 8.5px; color: #64748b;">${this.mentorConfig.cargo}</div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Instância global
window.diagnosticPdfGenerator = new DiagnosticPdfGenerator();
