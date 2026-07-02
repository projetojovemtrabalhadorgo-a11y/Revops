import { jsPDF } from "jspdf";
import { AnalysisResponse, ChannelMetric, MetricsSummary, ActionStep, TargetAccount } from "../types";

export function generateRevOpsPDF(
  analysisResult: AnalysisResponse,
  funnelMetrics: ChannelMetric[],
  clientList: string[]
) {
  // Initialize document in portrait A4 (210 x 297 mm)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 20;
  const contentWidth = pageWidth - marginX * 2; // 170 mm
  let y = 20;
  let pageNum = 1;

  // Colors
  const orangeColor = [234, 88, 12]; // #ea580c (RevOps Primary Accent)
  const darkSlateColor = [15, 23, 42]; // #0f172a (Primary Text & Header)
  const lightBgColor = [248, 250, 252]; // #f8fafc (Light Neutral Card)
  const textGray = [71, 85, 105]; // #475569 (Secondary Text)
  const greenColor = [22, 163, 74]; // #16a34a (High Efficiency/Success)

  // Helper to draw Header & Footer on each page
  function drawHeaderFooter(pdf: jsPDF, currentPNum: number) {
    // Top Accent Bar
    pdf.setFillColor(orangeColor[0], orangeColor[1], orangeColor[2]);
    pdf.rect(0, 0, pageWidth, 4, "F");

    // Header Metadata
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(orangeColor[0], orangeColor[1], orangeColor[2]);
    pdf.text("REV OPS ON FIRE", marginX, 12);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(150, 150, 150);
    pdf.text("HUB DE INTELIGÊNCIA DE VENDAS B2B", pageWidth - marginX, 12, { align: "right" });

    // Header subtle divider line
    pdf.setDrawColor(240, 240, 240);
    pdf.setLineWidth(0.2);
    pdf.line(marginX, 15, pageWidth - marginX, 15);

    // Footer divider line
    pdf.line(marginX, pageHeight - 15, pageWidth - marginX, pageHeight - 15);

    // Footer
    pdf.setFontSize(7);
    pdf.setTextColor(150, 150, 150);
    pdf.text("Relatório Confidencial de Oportunidades & Receita", marginX, pageHeight - 10);
    pdf.text(`Página ${currentPNum}`, pageWidth - marginX, pageHeight - 10, { align: "right" });
  }

  // Helper to ensure we don't overflow the page
  function ensureSpace(heightNeeded: number) {
    if (y + heightNeeded > pageHeight - 20) {
      doc.addPage();
      pageNum++;
      drawHeaderFooter(doc, pageNum);
      y = 25; // Reset to top of new page (under header)
    }
  }

  // Draw Header/Footer for Page 1
  drawHeaderFooter(doc, pageNum);

  // ================= PAGE 1: TITLE & EXECUTIVE SUMMARY =================
  y = 25;

  // Title Box
  doc.setFillColor(15, 23, 42); // slate-900 background
  doc.rect(marginX, y, contentWidth, 32, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("RELATÓRIO DE INTELIGÊNCIA REVOPS", marginX + 8, y + 11);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(234, 88, 12); // Orange subtitle
  doc.text("CRUZAMENTO ESTRATÉGICO DE MÉTRICAS DE FUNIL & CLIENTES ATUAIS", marginX + 8, y + 18);

  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  const formattedDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.text(`Gerado em: ${formattedDate} | Hub de Vendas B2B`, marginX + 8, y + 25);

  y += 40;

  // Section: Executive Markdown Analysis
  ensureSpace(12);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
  doc.text("1. RELATÓRIO EXECUTIVO DE IA", marginX, y);
  
  // Underline section title
  doc.setDrawColor(orangeColor[0], orangeColor[1], orangeColor[2]);
  doc.setLineWidth(1);
  doc.line(marginX, y + 2, marginX + 35, y + 2);
  y += 8;

  // Parse markdown content line by line and draw nicely
  if (analysisResult.markdownReport) {
    const rawLines = analysisResult.markdownReport.split("\n");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);

    for (let rawLine of rawLines) {
      let line = rawLine.trim();
      if (!line) {
        y += 3;
        continue;
      }

      // Handle Markdown headings
      if (line.startsWith("### ")) {
        const text = line.replace("### ", "").replace(/\*\*/g, "");
        ensureSpace(12);
        y += 3;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(orangeColor[0], orangeColor[1], orangeColor[2]);
        doc.text(text, marginX, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(textGray[0], textGray[1], textGray[2]);
      } else if (line.startsWith("## ")) {
        const text = line.replace("## ", "").replace(/\*\*/g, "");
        ensureSpace(14);
        y += 4;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11.5);
        doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
        doc.text(text, marginX, y);
        y += 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(textGray[0], textGray[1], textGray[2]);
      } else if (line.startsWith("# ")) {
        const text = line.replace("# ", "").replace(/\*\*/g, "");
        ensureSpace(16);
        y += 5;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
        doc.text(text, marginX, y);
        y += 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(textGray[0], textGray[1], textGray[2]);
      } else {
        // Plain text or bullet points
        let isBullet = false;
        if (line.startsWith("- ") || line.startsWith("* ")) {
          isBullet = true;
          line = line.substring(2);
        }

        // Clean out double asterisks for bold markdown
        const cleanedText = line.replace(/\*\*/g, "");

        // Split text to fit standard content width
        const wrapWidth = isBullet ? contentWidth - 6 : contentWidth;
        const wrappedLines = doc.splitTextToSize(cleanedText, wrapWidth) as string[];

        for (let i = 0; i < wrappedLines.length; i++) {
          ensureSpace(5);
          if (isBullet && i === 0) {
            // Draw bullet point
            doc.setFillColor(orangeColor[0], orangeColor[1], orangeColor[2]);
            doc.circle(marginX + 2, y - 1, 1, "F");
            doc.text(wrappedLines[i], marginX + 6, y);
          } else if (isBullet) {
            doc.text(wrappedLines[i], marginX + 6, y);
          } else {
            doc.text(wrappedLines[i], marginX, y);
          }
          y += 4.5;
        }
      }
    }
  }

  // ================= PAGE 2: METRICS TABLE & DIAGNOSIS =================
  doc.addPage();
  pageNum++;
  drawHeaderFooter(doc, pageNum);
  y = 25;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
  doc.text("2. DESEMPENHO DOS CANAIS & GARGALOS", marginX, y);
  
  doc.setDrawColor(orangeColor[0], orangeColor[1], orangeColor[2]);
  doc.setLineWidth(1);
  doc.line(marginX, y + 2, marginX + 35, y + 2);
  y += 10;

  // Subtitle/intro text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(textGray[0], textGray[1], textGray[2]);
  const introText = "A tabela abaixo apresenta os dados quantitativos inseridos para cada canal de aquisição, juntamente com as taxas de conversão automáticas e a análise de eficiência calculada pela IA.";
  const wrappedIntro = doc.splitTextToSize(introText, contentWidth) as string[];
  wrappedIntro.forEach((ln) => {
    doc.text(ln, marginX, y);
    y += 4.5;
  });
  y += 4;

  // Table Header
  const colWidths = [38, 20, 20, 20, 32, 20, 20]; // Total: 170 mm
  const tableHeaders = ["Canal", "Leads", "SQLs", "Clientes", "Conv. Global", "Gargalo", "Eficiência"];
  
  ensureSpace(12);
  doc.setFillColor(15, 23, 42); // Deep dark header
  doc.rect(marginX, y, contentWidth, 8, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  
  let currentX = marginX;
  tableHeaders.forEach((header, idx) => {
    doc.text(header, currentX + 3, y + 5.5);
    currentX += colWidths[idx];
  });
  y += 8;

  // Table Body
  const safeMetrics = Array.isArray(analysisResult.metricsSummary) ? analysisResult.metricsSummary : [];
  
  if (safeMetrics.length === 0) {
    ensureSpace(10);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Nenhum dado de funil inserido para análise.", marginX + 5, y + 6);
    y += 10;
  } else {
    safeMetrics.forEach((metric, rowIdx) => {
      ensureSpace(9);
      
      // Zebra striping
      if (rowIdx % 2 === 0) {
        doc.setFillColor(245, 247, 250);
      } else {
        doc.setFillColor(255, 255, 255);
      }
      doc.rect(marginX, y, contentWidth, 8, "F");
      
      // Draw cells text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(textGray[0], textGray[1], textGray[2]);

      let drawX = marginX;
      
      // Channel Name
      doc.setFont("helvetica", "bold");
      doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
      doc.text(metric.channel, drawX + 3, y + 5.5);
      drawX += colWidths[0];

      // Leads, SQLs, Clients
      doc.setFont("helvetica", "normal");
      doc.setTextColor(textGray[0], textGray[1], textGray[2]);
      doc.text(String(metric.leads), drawX + 3, y + 5.5);
      drawX += colWidths[1];

      doc.text(String(metric.sqls), drawX + 3, y + 5.5);
      drawX += colWidths[2];

      doc.text(String(metric.clients), drawX + 3, y + 5.5);
      drawX += colWidths[3];

      // Conversion Rate (Global)
      const formattedRate = `${metric.overallRate?.toFixed(1) || "0.0"}%`;
      const ratesDetail = `L->S: ${metric.leadToSqlRate?.toFixed(0) || 0}% | S->C: ${metric.sqlToClientRate?.toFixed(0) || 0}%`;
      doc.setFontSize(7.5);
      doc.text(`${formattedRate} (${ratesDetail})`, drawX + 1, y + 5.5);
      doc.setFontSize(8.5);
      drawX += colWidths[4];

      // Main Bottleneck
      const bottleneck = metric.mainBottleneck || "Nenhum";
      doc.setFontSize(7.5);
      doc.text(bottleneck, drawX + 2, y + 5.5);
      doc.setFontSize(8.5);
      drawX += colWidths[5];

      // Efficiency Badge
      const eff = metric.efficiencyScore || "Média";
      if (eff.toLowerCase().includes("alta")) {
        doc.setTextColor(greenColor[0], greenColor[1], greenColor[2]);
      } else if (eff.toLowerCase().includes("baixa")) {
        doc.setTextColor(orangeColor[0], orangeColor[1], orangeColor[2]);
      } else {
        doc.setTextColor(217, 119, 6); // Amber
      }
      doc.setFont("helvetica", "bold");
      doc.text(eff, drawX + 3, y + 5.5);

      y += 8;
    });
  }

  y += 5;

  // Add sub-cards for metrics summaries
  if (safeMetrics.length > 0) {
    ensureSpace(35);
    doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
    doc.rect(marginX, y, contentWidth, 30, "F");
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.rect(marginX, y, contentWidth, 30, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
    doc.text("RECOMENDAÇÃO DE EFICIÊNCIA DE IA:", marginX + 6, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    
    // Find highest conversion channel
    const sorted = [...safeMetrics].sort((a, b) => (b.overallRate || 0) - (a.overallRate || 0));
    const bestChannel = sorted[0]?.channel || "N/A";
    const bestRate = sorted[0]?.overallRate?.toFixed(1) || "0.0";
    
    const recommText = `O canal "${bestChannel}" demonstrou a melhor eficiência global de conversão (${bestRate}% de Lead a Cliente). Recomendamos priorizar os orçamentos de marketing outbound neste canal para maximizar o Retorno sobre Investimento (ROI), enquanto foca nos gargalos identificados para as demais frentes de aquisição comerciais.`;
    const wrappedRecomm = doc.splitTextToSize(recommText, contentWidth - 12) as string[];
    let recY = y + 11;
    wrappedRecomm.forEach((ln) => {
      doc.text(ln, marginX + 6, recY);
      recY += 4;
    });
    
    y += 35;
  }

  // ================= PAGE 3: CLIENT ICP & PROSPECTING =================
  doc.addPage();
  pageNum++;
  drawHeaderFooter(doc, pageNum);
  y = 25;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
  doc.text("3. DEFINIÇÃO DE PERFIL DE CLIENTE IDEAL (ICP)", marginX, y);
  
  doc.setDrawColor(orangeColor[0], orangeColor[1], orangeColor[2]);
  doc.setLineWidth(1);
  doc.line(marginX, y + 2, marginX + 35, y + 2);
  y += 10;

  const icp = analysisResult.icpProfile;
  if (icp) {
    // 1. Segmento de Mercado
    ensureSpace(20);
    doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
    doc.rect(marginX, y, contentWidth, 14, "F");
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.rect(marginX, y, contentWidth, 14, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(orangeColor[0], orangeColor[1], orangeColor[2]);
    doc.text("SEGMENTO DE MERCADO ALVO:", marginX + 4, y + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
    doc.text(icp.marketSegment || "Não definido", marginX + 4, y + 10);
    y += 18;

    // 2. Proposta de Valor
    ensureSpace(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
    doc.text("PROPOSTA DE VALOR CENTRAL", marginX, y);
    y += 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    const wrappedValProp = doc.splitTextToSize(icp.valueProposition || "Sem proposta definida", contentWidth) as string[];
    wrappedValProp.forEach((ln) => {
      doc.text(ln, marginX, y);
      y += 4;
    });
    y += 5;

    // 3. Dores Comuns (Pain list)
    ensureSpace(35);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
    doc.text("DORES COMUNS MAPEADAS DO ICP", marginX, y);
    y += 4;

    const pains = icp.commonPains || [];
    if (pains.length === 0) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.text("Nenhuma dor mapeada.", marginX, y);
      y += 5;
    } else {
      pains.forEach((pain) => {
        ensureSpace(10);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(textGray[0], textGray[1], textGray[2]);
        
        // Split pain text
        const wrappedPain = doc.splitTextToSize(pain, contentWidth - 6) as string[];
        wrappedPain.forEach((ln, lIdx) => {
          if (lIdx === 0) {
            doc.setFillColor(orangeColor[0], orangeColor[1], orangeColor[2]);
            doc.circle(marginX + 2, y - 1, 0.8, "F");
            doc.text(ln, marginX + 6, y);
          } else {
            doc.text(ln, marginX + 6, y);
          }
          y += 4;
        });
      });
      y += 4;
    }

    // 4. Setores Ideais
    ensureSpace(25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
    doc.text("SETORES VERTICAIS DE ALTO POTENCIAL", marginX, y);
    y += 4;

    const sectors = icp.idealSectors || [];
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    const sectorsText = sectors.join(", ");
    const wrappedSectors = doc.splitTextToSize(sectorsText, contentWidth) as string[];
    wrappedSectors.forEach((ln) => {
      doc.text(ln, marginX, y);
      y += 4;
    });
    y += 4;

    // 5. Oportunidade de Receita (Revenue Opportunity)
    if (icp.revenueOpportunity) {
      ensureSpace(25);
      doc.setFillColor(254, 243, 199); // Light amber
      doc.rect(marginX, y, contentWidth, 14, "F");
      doc.setDrawColor(251, 191, 36);
      doc.rect(marginX, y, contentWidth, 14, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(180, 83, 9); // Amber text
      doc.text("💡 PROJEÇÃO DE OPORTUNIDADE DE RECEITA:", marginX + 4, y + 5.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(icp.revenueOpportunity, marginX + 4, y + 10);
      y += 18;
    }
  }

  // Prospecting Niches & Keywords
  ensureSpace(40);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
  doc.text("NICHOS E PALAVRAS-CHAVE RECOMENDADAS PARA OUTBOUND", marginX, y);
  y += 5;

  // Niches
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(orangeColor[0], orangeColor[1], orangeColor[2]);
  doc.text("Nichos de Prospecção:", marginX, y);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textGray[0], textGray[1], textGray[2]);
  const nichesText = (analysisResult.prospectingNiches || []).join(" | ");
  const wrappedNiches = doc.splitTextToSize(nichesText, contentWidth) as string[];
  wrappedNiches.forEach((ln) => {
    doc.text(ln, marginX, y + 4);
    y += 4;
  });
  y += 6;

  // Keywords
  ensureSpace(15);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(orangeColor[0], orangeColor[1], orangeColor[2]);
  doc.text("Palavras-chave Quentes:", marginX, y);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textGray[0], textGray[1], textGray[2]);
  const kwText = (analysisResult.prospectingKeywords || []).join(", ");
  const wrappedKws = doc.splitTextToSize(kwText, contentWidth) as string[];
  wrappedKws.forEach((ln) => {
    doc.text(ln, marginX, y + 4);
    y += 4;
  });

  // ================= PAGE 4: ACTION PLAN & OUTBOUND TARGETS =================
  doc.addPage();
  pageNum++;
  drawHeaderFooter(doc, pageNum);
  y = 25;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
  doc.text("4. PLANO DE AÇÃO & CONTAS-ALVO", marginX, y);
  
  doc.setDrawColor(orangeColor[0], orangeColor[1], orangeColor[2]);
  doc.setLineWidth(1);
  doc.line(marginX, y + 2, marginX + 35, y + 2);
  y += 10;

  // Section Action Steps
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
  doc.text("PASSOS DO PLANO DE AÇÃO COMERCIAL", marginX, y);
  y += 6;

  const actionSteps = analysisResult.actionPlan || [];
  if (actionSteps.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(150, 150, 150);
    doc.text("Nenhum passo no plano de ação estruturado ainda.", marginX, y);
    y += 6;
  } else {
    actionSteps.forEach((step, idx) => {
      ensureSpace(22);
      doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
      doc.rect(marginX, y, contentWidth, 14, "F");
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.rect(marginX, y, contentWidth, 14, "S");

      // Priority color
      const p = step.priority || "Média";
      let pColor = [217, 119, 6]; // Amber
      if (p.toLowerCase().includes("alta")) pColor = orangeColor;
      else if (p.toLowerCase().includes("baixa")) pColor = [100, 116, 139]; // Slate

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
      doc.text(`${idx + 1}. ${step.stepTitle}`, marginX + 4, y + 5.5);

      // Priority pill text
      doc.setFontSize(7.5);
      doc.setTextColor(pColor[0], pColor[1], pColor[2]);
      doc.text(`[Prioridade: ${p}]`, marginX + contentWidth - 35, y + 5.5);

      // Description
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(textGray[0], textGray[1], textGray[2]);
      doc.text(step.description || "", marginX + 4, y + 10);

      y += 18;
    });
  }

  y += 4;

  // Section Outbound targets
  ensureSpace(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
  doc.text("CONTAS-ALVO MAPEADAS & SCRIPTS DE ABORDAGEM", marginX, y);
  y += 6;

  const targets = analysisResult.targetAccounts || [];
  if (targets.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(150, 150, 150);
    doc.text("Adicione empresas na lista de clientes para que a IA possa mapear contas semelhantes e gerar roteiros de outbound.", marginX, y);
  } else {
    targets.forEach((target) => {
      ensureSpace(40);
      
      // Card container for target account
      doc.setFillColor(250, 250, 250);
      doc.rect(marginX, y, contentWidth, 32, "F");
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.3);
      doc.rect(marginX, y, contentWidth, 32, "S");

      // Target Header: Company & Sector
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
      doc.text(target.companyName || "Empresa Alvo", marginX + 4, y + 5);

      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(orangeColor[0], orangeColor[1], orangeColor[2]);
      doc.text(`Segmento: ${target.sector || "Geral"}`, marginX + 4, y + 9);

      // Pain hook
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(textGray[0], textGray[1], textGray[2]);
      doc.text("Gancho de Dor Mapeado:", marginX + 4, y + 14);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.text(target.painHook || "Não especificado", marginX + 38, y + 14);

      // Outreach Script
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(darkSlateColor[0], darkSlateColor[1], darkSlateColor[2]);
      doc.text("Roteiro de Abordagem Outbound (Cold Mail/LinkedIn):", marginX + 4, y + 19);

      // Wrap script text nicely
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      
      const script = target.outreachScript || "";
      const wrappedScript = doc.splitTextToSize(script, contentWidth - 10) as string[];
      
      let scriptY = y + 23;
      wrappedScript.slice(0, 2).forEach((ln) => {
        doc.text(ln, marginX + 4, scriptY);
        scriptY += 3.5;
      });

      y += 36;
    });
  }

  // Save the PDF!
  doc.save("Relatorio_Inteligencia_RevOps_B2B.pdf");
}
