/**
 * Gerador de Relatório Executivo em PDF - Diagnóstico Empresarial
 * Avaliação de Maturidade, Governança & Gestão Estratégica
 * Visual Tech (2026)
 *
 * Diagramação Executiva: Capa, Identificação, Gráfico Radar, 5 Eixos Estratégicos,
 * Módulo BSC, Matriz de Priorização e Tabela de Auditoria.
 */

class DiagnosticPdfGenerator {
    constructor() {
        this.mentorConfig = {
            reportTitle: "Relatório Executivo • Diagnóstico Empresarial",
            tagline: "Maturidade de Gestão, Governança & Eficiência Operacional",
            provider: "Visual Tech",
            contactPhone: "(49) 98836-9445",
            contactEmail: "contato@visualtech.com.br",
            disclaimer: "Documento executivo confidencial desenvolvido para apoio ao planejamento estratégico e tomada de decisões corporativas."
        };
    }

    /**
     * Gera e dispara o download do PDF executivo de alta fidelidade
     */
    async generatePdf(userData, results, questions, answers, radarImgData = null) {
        const currentDate = new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const reportContainer = document.createElement('div');
        reportContainer.id = 'executive-pdf-content';
        reportContainer.innerHTML = this.buildReportHtml(userData, results, questions, answers, currentDate, radarImgData);

        reportContainer.style.cssText = `
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #0f172a;
            background: #ffffff;
            padding: 24px;
            width: 820px;
            margin: 0 auto;
            line-height: 1.5;
            box-sizing: border-box;
        `;

        document.body.appendChild(reportContainer);

        const companyOrName = userData.isAnonymous ? 'Confidencial' : (userData.company || userData.name || 'Empresa');
        const fileName = `Diagnostico_Empresarial_${companyOrName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;

        if (typeof html2pdf !== 'undefined') {
            const opt = {
                margin: [8, 8, 8, 8],
                filename: fileName,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: false },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };

            try {
                await html2pdf().set(opt).from(reportContainer).save();
            } catch (err) {
                console.error("Erro no html2pdf, abrindo impressão nativa:", err);
                this.fallbackPrint(reportContainer.innerHTML);
            } finally {
                document.body.removeChild(reportContainer);
            }
        } else {
            this.fallbackPrint(reportContainer.innerHTML);
            document.body.removeChild(reportContainer);
        }
    }

    /**
     * Fallback de impressão nativa
     */
    fallbackPrint(htmlContent) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Relatório de Diagnóstico Empresarial</title>
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
     * Constrói a estrutura HTML completa do relatório
     */
    buildReportHtml(userData, results, questions, answers, currentDate, radarImgData) {
        const improvementGaps = results.gaps;

        // 1. Linhas da tabela de 24 perguntas
        const questionsTableRows = questions.map(q => {
            const score = answers[q.id] || 0;
            const opt = DEFAULT_OPTIONS.find(o => o.value === score);
            const optLabel = opt ? opt.label : `Nota ${score}/5`;

            let badgeStyle = "background-color: #f1f5f9; color: #475569;";
            if (score <= 2) badgeStyle = "background-color: #fee2e2; color: #991b1b; font-weight: bold;";
            else if (score === 3) badgeStyle = "background-color: #fef3c7; color: #92400e; font-weight: bold;";
            else badgeStyle = "background-color: #d1fae5; color: #065f46; font-weight: bold;";

            return `
                <tr>
                    <td style="padding: 6px; border: 1px solid #e2e8f0; font-size: 10px; text-align: center; font-weight: bold; color: #0284c7;">${q.id}</td>
                    <td style="padding: 6px; border: 1px solid #e2e8f0; font-size: 10.5px;">
                        <strong>${q.title}</strong>
                        ${q.dimension ? `<br><span style="color: #0284c7; font-size: 9.5px; font-weight: bold;">[${q.dimension}]</span>` : ''}<br>
                        <span style="color: #475569;">${q.description}</span>
                    </td>
                    <td style="padding: 6px; border: 1px solid #e2e8f0; font-size: 10px; text-align: center;">
                        <span style="display: inline-block; padding: 3px 8px; border-radius: 4px; ${badgeStyle}">
                            ${optLabel}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');

        // 2. Resumo dos 5 Eixos Estratégicos
        const pillarsHtml = results.pillarScores.map(p => `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; margin-bottom: 5px;">
                    <span style="color: #0f172a;">${p.name}</span>
                    <span style="color: #0284c7;">${p.percentage}% (${p.earnedPoints}/${p.maxPoints} pts)</span>
                </div>
                <div style="background: #e2e8f0; height: 7px; border-radius: 4px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #0284c7, #059669); height: 100%; width: ${p.percentage}%;"></div>
                </div>
            </div>
        `).join('');

        // 3. Módulo Balanced Scorecard (BSC)
        const bscHtml = results.bscScores ? results.bscScores.map(b => `
            <div style="border: 1px solid #e2e8f0; border-top: 3px solid ${b.color}; background: #ffffff; border-radius: 6px; padding: 10px; margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <strong style="font-size: 11.5px; color: #0f172a;">${b.name}</strong>
                    <span style="font-size: 12px; font-weight: bold; color: ${b.color};">${b.percentage}%</span>
                </div>
                <p style="font-size: 10px; color: #64748b; margin: 2px 0 6px;">${b.description}</p>
                <div style="background: #f1f5f9; height: 5px; border-radius: 3px; overflow: hidden; margin-bottom: 6px;">
                    <div style="background: ${b.color}; height: 100%; width: ${b.percentage}%;"></div>
                </div>
                <div style="font-size: 9.5px; font-weight: bold; color: ${b.color};">
                    ${b.statusText}
                </div>
            </div>
        `).join('') : '';

        // 4. Plano de Ação Prioritário
        const actionPlanHtml = improvementGaps.length > 0 ? improvementGaps.map((gap, index) => {
            let horizonBadge = "Vitória Rápida (Curto Prazo)";
            if (gap.horizon === "estruturante") horizonBadge = "Governança Estruturante (Médio Prazo)";
            if (gap.horizon === "sistemas") horizonBadge = "Controle & Sistemas (Longo Prazo)";

            return `
                <div style="border-left: 4px solid ${gap.score <= 2 ? '#ef4444' : '#f59e0b'}; background: #fafafa; border-radius: 4px; padding: 10px 12px; margin-bottom: 10px; page-break-inside: avoid;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <strong style="font-size: 11.5px; color: #0f172a;">${index + 1}. ${gap.question.title}</strong>
                        <div style="display: flex; gap: 4px;">
                            <span style="font-size: 9px; padding: 2px 5px; border-radius: 3px; background: #e0f2fe; color: #0369a1; font-weight: bold;">
                                ${horizonBadge}
                            </span>
                            <span style="font-size: 9px; padding: 2px 5px; border-radius: 3px; background: ${gap.score <= 2 ? '#fee2e2' : '#fef3c7'}; color: ${gap.score <= 2 ? '#991b1b' : '#92400e'}; font-weight: bold;">
                                Nota: ${gap.score}/5 (${gap.score <= 2 ? 'Crítico' : 'Atenção'})
                            </span>
                        </div>
                    </div>
                    <p style="font-size: 10px; color: #475569; margin: 3px 0;"><strong>Situação Avaliada:</strong> ${gap.question.description}</p>
                    <div style="font-size: 10.5px; color: #0369a1; background: #e0f2fe; padding: 7px 10px; border-radius: 4px; margin-top: 5px;">
                        <strong>Orientação Prática de Gestão:</strong> ${gap.question.tip}
                    </div>
                </div>
            `;
        }).join('') : '<p style="font-size: 11px; color: #059669;"><strong>Excelente!</strong> A empresa não apresentou respostas em níveis críticos nos 5 eixos avaliados.</p>';

        return `
            <!-- CABEÇALHO EXECUTIVO -->
            <div style="border-bottom: 3px solid #0284c7; padding-bottom: 12px; margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h1 style="font-size: 18px; font-weight: 800; color: #0284c7; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
                            ${this.mentorConfig.reportTitle}
                        </h1>
                        <p style="font-size: 11px; color: #475569; margin: 4px 0 0;">
                            ${this.mentorConfig.tagline} • ${this.mentorConfig.provider}
                        </p>
                    </div>
                    <div style="text-align: right; font-size: 9.5px; color: #64748b;">
                        Data de Emissão:<br>
                        <strong style="color: #0f172a;">${currentDate}</strong>
                    </div>
                </div>
            </div>

            <!-- METODOLOGIA EXECUTIVA -->
            <div style="background-color: #f1f5f9; border-left: 4px solid #0284c7; border-radius: 4px; padding: 9px 12px; margin-bottom: 16px;">
                <div style="font-size: 10px; font-weight: bold; color: #0284c7; text-transform: uppercase; margin-bottom: 2px;">
                    Metodologia de Diagnóstico Corporativo
                </div>
                <p style="font-size: 9.5px; color: #334155; margin: 0; line-height: 1.4;">
                    Avaliação estruturada em 5 eixos estratégicos de governança, eficiência operacional e liderança, correlacionando a maturidade das práticas de gestão ao desempenho financeiro e não financeiro da organização (Balanced Scorecard).
                </p>
            </div>

            <!-- DADOS DO CLIENTE & EMPRESA -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin-bottom: 16px;">
                <h3 style="font-size: 11px; text-transform: uppercase; color: #334155; margin: 0 0 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; font-weight: 800;">
                    1. Identificação da Empresa & Participante
                </h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                    <tr>
                        <td style="padding: 3px 0; width: 50%;"><strong>Nome do Gestor:</strong> ${userData.isAnonymous ? 'Confidencial' : (userData.name || 'Não informado')}</td>
                        <td style="padding: 3px 0; width: 50%;"><strong>Empresa / Negócio:</strong> ${userData.isAnonymous ? 'Empresa Confidencial' : (userData.company || 'Não informada')}</td>
                    </tr>
                    <tr>
                        <td style="padding: 3px 0;"><strong>Cargo / Posição de Decisão:</strong> ${userData.roleLabel || userData.role}</td>
                        <td style="padding: 3px 0;"><strong>Porte da Organização:</strong> ${userData.segment || 'Não informado'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 3px 0;"><strong>E-mail de Contato:</strong> ${userData.isAnonymous ? 'Não coletado' : (userData.email || 'Não informado')}</td>
                        <td style="padding: 3px 0;"><strong>WhatsApp / Telefone:</strong> ${userData.isAnonymous ? 'Não coletado' : (userData.phone || 'Não informado')}</td>
                    </tr>
                </table>
            </div>

            <!-- SCORE GERAL & ESTÁGIO -->
            <div style="display: flex; gap: 16px; align-items: center; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px 18px; margin-bottom: 18px;">
                <div style="text-align: center; min-width: 115px; border-right: 1px solid #bbf7d0; padding-right: 16px;">
                    <div style="font-size: 34px; font-weight: 900; color: #166534; line-height: 1;">
                        ${results.overallPercentage}%
                    </div>
                    <div style="font-size: 10px; text-transform: uppercase; color: #15803d; font-weight: bold; margin-top: 3px;">
                        Maturidade Geral
                    </div>
                    <div style="font-size: 9px; color: #4ade80;">(${results.totalPoints} de ${results.maxPossiblePoints} pts)</div>
                </div>
                <div>
                    <span style="display: inline-block; background: #166534; color: #ffffff; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; margin-bottom: 4px;">
                        ${results.maturity.level}
                    </span>
                    <h2 style="font-size: 13.5px; color: #14532d; margin: 0 0 4px; font-weight: 800;">${results.maturity.headline}</h2>
                    <p style="font-size: 10.5px; color: #374151; margin: 0; line-height: 1.45;">${results.maturity.summary}</p>
                </div>
            </div>

            <!-- GRID ANALYTICS: RADAR CHART & 5 PILARES -->
            <div style="margin-bottom: 18px; page-break-inside: avoid;">
                <h3 style="font-size: 11px; text-transform: uppercase; color: #334155; margin: 0 0 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; font-weight: 800;">
                    2. Desempenho por Eixo Estratégico
                </h3>
                <div style="display: flex; gap: 14px; align-items: center;">
                    ${radarImgData ? `
                        <div style="width: 48%; text-align: center;">
                            <img src="${radarImgData}" style="max-width: 100%; max-height: 230px; object-fit: contain;" alt="Teia de Governança">
                            <div style="font-size: 9px; color: #64748b; margin-top: 4px;">Gráfico Radar de Maturidade Corporativa</div>
                        </div>
                    ` : ''}
                    <div style="width: ${radarImgData ? '52%' : '100%'};">
                        ${pillarsHtml}
                    </div>
                </div>
            </div>

            <!-- MÓDULO BALANCED SCORECARD (BSC) -->
            <div style="margin-bottom: 18px; page-break-inside: avoid;">
                <h3 style="font-size: 11px; text-transform: uppercase; color: #334155; margin: 0 0 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; font-weight: 800;">
                    3. Impacto no Desempenho Organizacional (Balanced Scorecard)
                </h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    ${bscHtml}
                </div>
            </div>

            <!-- DIRETRIZES ESTRATÉGICAS PARA O ESTÁGIO ATUAL -->
            <div style="margin-bottom: 18px; page-break-inside: avoid;">
                <h3 style="font-size: 11px; text-transform: uppercase; color: #334155; margin: 0 0 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; font-weight: 800;">
                    4. Recomendações Estratégicas para Evolução
                </h3>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px;">
                    <ul style="margin: 0; padding-left: 14px; font-size: 10.5px; color: #334155; line-height: 1.55;">
                        ${results.maturity.actionPoints ? results.maturity.actionPoints.map(pt => `<li>${pt}</li>`).join('') : ''}
                    </ul>
                </div>
            </div>

            <!-- PLANO DE AÇÃO PRIORITÁRIO (GAPS) -->
            <div style="margin-bottom: 20px; page-break-before: always;">
                <h3 style="font-size: 11px; text-transform: uppercase; color: #334155; margin: 0 0 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; font-weight: 800;">
                    5. Plano de Ação: Gaps Prioritários e Recomendações
                </h3>
                <p style="font-size: 10px; color: #64748b; margin-bottom: 12px;">
                    Práticas avaliadas com notas 1 (Não acontece), 2 (Acontece pouco) ou 3 (Acontece parcialmente), estruturadas por horizonte prioritário de implementação:
                </p>
                <div>
                    ${actionPlanHtml}
                </div>
            </div>

            <!-- TABELA DE AUDITORIA DAS 24 QUESTÕES -->
            <div style="margin-bottom: 20px; page-break-before: always;">
                <h3 style="font-size: 11px; text-transform: uppercase; color: #334155; margin: 0 0 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; font-weight: 800;">
                    6. Auditoria Completa: As 24 Questões e Níveis Declarados
                </h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f1f5f9;">
                            <th style="padding: 6px; border: 1px solid #cbd5e1; font-size: 10px; width: 30px; text-align: center;">#</th>
                            <th style="padding: 6px; border: 1px solid #cbd5e1; font-size: 10px; text-align: left;">Questão & Dimensão Avaliada</th>
                            <th style="padding: 6px; border: 1px solid #cbd5e1; font-size: 10px; width: 140px; text-align: center;">Maturidade</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${questionsTableRows}
                    </tbody>
                </table>
            </div>

            <!-- ASSINATURA CORPORATIVA -->
            <div style="margin-top: 25px; border-top: 2px solid #e2e8f0; padding-top: 15px; page-break-inside: avoid;">
                <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                    <div style="font-size: 10px; color: #64748b; max-width: 480px;">
                        <strong style="color: #0f172a;">${this.mentorConfig.reportTitle}</strong><br>
                        ${this.mentorConfig.tagline}<br>
                        WhatsApp: ${this.mentorConfig.contactPhone} • E-mail: ${this.mentorConfig.contactEmail}<br>
                        <span style="font-size: 9px; color: #94a3b8;">${this.mentorConfig.disclaimer}</span>
                    </div>
                    <div style="text-align: center; width: 220px;">
                        <div style="border-bottom: 1px solid #94a3b8; height: 32px; margin-bottom: 4px;"></div>
                        <div style="font-size: 10.5px; font-weight: bold; color: #0f172a;">${this.mentorConfig.provider}</div>
                        <div style="font-size: 9.5px; color: #64748b;">Diagnóstico Executivo 2026</div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Instância global
window.diagnosticPdfGenerator = new DiagnosticPdfGenerator();
