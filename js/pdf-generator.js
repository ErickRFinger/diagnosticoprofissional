/**
 * Gerador de Relatório Executivo em PDF para Diagnóstico e Mentoria
 * Formata os dados do usuário, pontuações, análise de gaps e todas as 40 respostas.
 */

class DiagnosticPdfGenerator {
    constructor() {
        this.mentorConfig = {
            mentorTitle: "Mentoria Contábil & Gestão Empresarial",
            tagline: "Diagnóstico de Maturidade e Reestruturação Estratégica",
            contactPhone: "(Coloque o WhatsApp da Mentora)",
            contactEmail: "(Coloque o E-mail da Mentora)",
            disclaimer: "Este relatório foi gerado automaticamente pelo Sistema de Diagnóstico Empresarial com base nas respostas fornecidas pelo participante."
        };
    }

    /**
     * Gera e dispara o download do PDF executivo
     */
    async generatePdf(userData, results, questions, answers) {
        const currentDate = new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Monta o elemento HTML do relatório
        const reportContainer = document.createElement('div');
        reportContainer.id = 'executive-pdf-content';
        reportContainer.innerHTML = this.buildReportHtml(userData, results, questions, answers, currentDate);

        // Estilos embutidos para garantir precisão e fidelidade visual no PDF (independente do tema da página)
        reportContainer.style.cssText = `
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1e293b;
            background: #ffffff;
            padding: 30px;
            width: 800px;
            margin: 0 auto;
            line-height: 1.5;
            box-sizing: border-box;
        `;

        document.body.appendChild(reportContainer);

        const fileName = `Diagnostico_Mentoria_${(userData.company || userData.name).replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;

        // Verifica se html2pdf está carregado
        if (typeof html2pdf !== 'undefined') {
            const opt = {
                margin: [10, 10, 10, 10],
                filename: fileName,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: false },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };

            try {
                await html2pdf().set(opt).from(reportContainer).save();
            } catch (err) {
                console.error("Erro no html2pdf, abrindo tela de impressão nativa:", err);
                this.fallbackPrint(reportContainer.innerHTML);
            } finally {
                document.body.removeChild(reportContainer);
            }
        } else {
            // Fallback nativo
            this.fallbackPrint(reportContainer.innerHTML);
            document.body.removeChild(reportContainer);
        }
    }

    /**
     * Fallback para impressão limpa no navegador
     */
    fallbackPrint(htmlContent) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Relatório de Diagnóstico Contábil</title>
                <style>
                    body { font-family: Arial, sans-serif; color: #1e293b; padding: 25px; }
                    .page-break { page-break-before: always; }
                    table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
                    th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
                    th { background-color: #f1f5f9; }
                </style>
            </head>
            <body>
                ${htmlContent}
                <script>
                    window.onload = function() {
                        window.print();
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    /**
     * Constrói o HTML estruturado do documento
     */
    buildReportHtml(userData, results, questions, answers, currentDate) {
        // Separa os pontos de melhoria (perguntas com nota <= 3)
        const improvementGaps = results.gaps;

        // Monta as linhas da tabela consolidada de 40 perguntas
        const questionsTableRows = questions.map(q => {
            const score = answers[q.id] || 0;
            let badgeStyle = "background-color: #f1f5f9; color: #475569;";
            if (score <= 2) badgeStyle = "background-color: #fee2e2; color: #991b1b; font-weight: bold;";
            else if (score === 3) badgeStyle = "background-color: #fef3c7; color: #92400e; font-weight: bold;";
            else badgeStyle = "background-color: #d1fae5; color: #065f46; font-weight: bold;";

            return `
                <tr>
                    <td style="padding: 8px; border: 1px solid #e2e8f0; font-size: 11px; text-align: center; font-weight: bold;">${q.id}</td>
                    <td style="padding: 8px; border: 1px solid #e2e8f0; font-size: 11px;">
                        <strong>${q.title}</strong><br>
                        <span style="color: #64748b;">${q.description}</span>
                    </td>
                    <td style="padding: 8px; border: 1px solid #e2e8f0; font-size: 11px; text-align: center;">
                        <span style="display: inline-block; padding: 3px 8px; border-radius: 4px; ${badgeStyle}">
                            Nível ${score}/5
                        </span>
                    </td>
                </tr>
            `;
        }).join('');

        // Monta o resumo dos 5 pilares
        const pillarsHtml = results.pillarScores.map(p => `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: bold; margin-bottom: 6px;">
                    <span>${p.name}</span>
                    <span style="color: #0284c7;">${p.percentage}% (${p.earnedPoints}/${p.maxPoints} pts)</span>
                </div>
                <div style="background: #e2e8f0; height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background: #0284c7; height: 100%; width: ${p.percentage}%;"></div>
                </div>
            </div>
        `).join('');

        // Monta o plano de ação / prioridades de melhoria
        const actionPlanHtml = improvementGaps.length > 0 ? improvementGaps.map((gap, index) => `
            <div style="border-left: 4px solid ${gap.score <= 2 ? '#ef4444' : '#f59e0b'}; background: #fafafa; border-radius: 4px; padding: 12px; margin-bottom: 10px; page-break-inside: avoid;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <strong style="font-size: 12px; color: #0f172a;">${index + 1}. ${gap.question.title}</strong>
                    <span style="font-size: 10px; padding: 2px 6px; border-radius: 4px; background: ${gap.score <= 2 ? '#fee2e2' : '#fef3c7'}; color: ${gap.score <= 2 ? '#991b1b' : '#92400e'}; font-weight: bold;">
                        Nota Atual: ${gap.score}/5 (${gap.score <= 2 ? 'Prioridade Crítica' : 'Atenção'})
                    </span>
                </div>
                <p style="font-size: 11px; color: #475569; margin: 4px 0;"><strong>Situação Atual:</strong> ${gap.question.description}</p>
                <div style="font-size: 11px; color: #0369a1; background: #e0f2fe; padding: 8px; border-radius: 4px; margin-top: 6px;">
                    <strong>Orientação da Mentoria:</strong> ${gap.question.tip}
                </div>
            </div>
        `).join('') : '<p style="font-size: 12px; color: #059669;"><strong>Excelente!</strong> A empresa não apresentou respostas com níveis críticos.</p>';

        return `
            <!-- CABEÇALHO EXECUTIVO -->
            <div style="border-bottom: 3px solid #0284c7; padding-bottom: 15px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h1 style="font-size: 20px; font-weight: bold; color: #0284c7; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
                            Relatório Executivo de Diagnóstico & Mentoria
                        </h1>
                        <p style="font-size: 12px; color: #64748b; margin: 4px 0 0;">
                            Auditoria Preliminar de Maturidade Contábil, Financeira & Gestão Empresarial
                        </p>
                    </div>
                    <div style="text-align: right; font-size: 10px; color: #64748b;">
                        Emitido em: <strong>${currentDate}</strong>
                    </div>
                </div>
            </div>

            <!-- DADOS DO CLIENTE & EMPRESA -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                <h3 style="font-size: 13px; text-transform: uppercase; color: #334155; margin: 0 0 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
                    1. Dados de Identificação do Participante
                </h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                    <tr>
                        <td style="padding: 4px 0; width: 50%;"><strong>Nome do Gestor:</strong> ${userData.name}</td>
                        <td style="padding: 4px 0; width: 50%;"><strong>Empresa / Negócio:</strong> ${userData.company || 'Não informado'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0;"><strong>Cargo / Função:</strong> ${userData.roleLabel || userData.role}</td>
                        <td style="padding: 4px 0;"><strong>Porte da Empresa:</strong> ${userData.segment || 'Não informado'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0;"><strong>E-mail:</strong> ${userData.email || 'Não informado'}</td>
                        <td style="padding: 4px 0;"><strong>WhatsApp / Contato:</strong> ${userData.phone || 'Não informado'}</td>
                    </tr>
                </table>
            </div>

            <!-- RESULTADO GERAL & CLASSIFICAÇÃO -->
            <div style="display: flex; gap: 20px; align-items: center; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <div style="text-align: center; min-width: 130px; border-right: 1px solid #bbf7d0; padding-right: 20px;">
                    <div style="font-size: 38px; font-weight: 900; color: #166534; line-height: 1;">
                        ${results.overallPercentage}%
                    </div>
                    <div style="font-size: 11px; text-transform: uppercase; color: #15803d; font-weight: bold; margin-top: 4px;">
                        Índice Geral
                    </div>
                    <div style="font-size: 10px; color: #4ade80;">(${results.totalPoints} de ${results.maxPossiblePoints} pontos)</div>
                </div>
                <div>
                    <span style="display: inline-block; background: #166534; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; margin-bottom: 6px;">
                        ${results.maturity.level}
                    </span>
                    <h2 style="font-size: 15px; color: #14532d; margin: 0 0 6px;">${results.maturity.headline}</h2>
                    <p style="font-size: 11px; color: #374151; margin: 0; line-height: 1.5;">${results.maturity.summary}</p>
                </div>
            </div>

            <!-- DESEMPENHO POR PILAR -->
            <div style="margin-bottom: 25px; page-break-inside: avoid;">
                <h3 style="font-size: 13px; text-transform: uppercase; color: #334155; margin: 0 0 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
                    2. Desempenho por Eixo Estratégico
                </h3>
                <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                    ${pillarsHtml}
                </div>
            </div>

            <!-- PONTOS DE MELHORIA / PLANO DE AÇÃO -->
            <div style="margin-bottom: 25px; page-break-before: always;">
                <h3 style="font-size: 13px; text-transform: uppercase; color: #334155; margin: 0 0 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
                    3. Plano de Ação Prioritário: Pontos que Precisam de Melhoria
                </h3>
                <p style="font-size: 11px; color: #64748b; margin-bottom: 15px;">
                    Itens identificados com pontuação abaixo do padrão de excelência (Níveis 1, 2 ou 3). Estes gargalos devem ser priorizados nas primeiras sessões da mentoria contábil.
                </p>
                <div>
                    ${actionPlanHtml}
                </div>
            </div>

            <!-- TABELA AUDITADA COM TODAS AS 40 RESPOSTAS -->
            <div style="margin-bottom: 25px; page-break-before: always;">
                <h3 style="font-size: 13px; text-transform: uppercase; color: #334155; margin: 0 0 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
                    4. Auditoria Completa: As 40 Perguntas e Respostas
                </h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f1f5f9;">
                            <th style="padding: 8px; border: 1px solid #cbd5e1; font-size: 11px; width: 40px; text-align: center;">#</th>
                            <th style="padding: 8px; border: 1px solid #cbd5e1; font-size: 11px; text-align: left;">Pergunta / Descrição</th>
                            <th style="padding: 8px; border: 1px solid #cbd5e1; font-size: 11px; width: 100px; text-align: center;">Maturidade</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${questionsTableRows}
                    </tbody>
                </table>
            </div>

            <!-- ASSINATURA DA MENTORA & ENCERRAMENTO -->
            <div style="margin-top: 35px; border-top: 2px solid #e2e8f0; padding-top: 20px; page-break-inside: avoid;">
                <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                    <div style="font-size: 11px; color: #64748b; max-width: 450px;">
                        <strong>${this.mentorConfig.mentorTitle}</strong><br>
                        ${this.mentorConfig.tagline}<br>
                        <em>${this.mentorConfig.disclaimer}</em>
                    </div>
                    <div style="text-align: center; width: 220px;">
                        <div style="border-bottom: 1px solid #94a3b8; height: 35px; margin-bottom: 5px;"></div>
                        <div style="font-size: 11px; font-weight: bold; color: #0f172a;">Mentoria Contábil Especializada</div>
                        <div style="font-size: 10px; color: #64748b;">Parecer & Validação Estratégica</div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Instancia global
window.diagnosticPdfGenerator = new DiagnosticPdfGenerator();
