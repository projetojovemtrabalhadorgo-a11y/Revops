import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini API client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined. Please configure it in the Secrets panel in the AI Studio settings.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST API for RevOps Intelligence Analysis
app.post("/api/analyze", async (req, res) => {
  try {
    const { funnelData, clientList } = req.body;

    const hasFunnel = Array.isArray(funnelData) && funnelData.length > 0;
    const hasClients = Array.isArray(clientList) && clientList.length > 0;

    if (!hasFunnel && !hasClients) {
      res.status(400).json({ error: "Por favor, forneça pelo menos os dados de funil ou a lista de clientes para a análise." });
      return;
    }

    const ai = getGeminiClient();

    // Context message for the prompt
    let inputDescription = "";
    if (hasFunnel) {
      inputDescription += `\n### DADOS DE FUNIL (MÉTRICAS) FORNECIDOS:\n${JSON.stringify(funnelData, null, 2)}`;
    }
    if (hasClients) {
      inputDescription += `\n### LISTA DE CLIENTES ATUAIS (URLS/EMPRESAS) FORNECIDAS:\n${JSON.stringify(clientList, null, 2)}`;
    }

    const systemInstruction = `Você é o "RevOps On Fire - Hub de Inteligência de Vendas", uma inteligência artificial especialista em RevOps, análise avançada de funis de vendas B2B e inteligência de mercado.
Sua missão é impulsionar a receita (revenue generation) das empresas fornecendo diagnósticos agressivos, práticos e acionáveis (focados em growth).

DIRETRIZES DE PROCESSAMENTO CRÍTICAS:

1. CANAIS DE AQUISIÇÃO PRIORITÁRIOS:
   - Dê foco total nos canais "BDR Configr" e "Multicanal" que representam as principais origens de tração do negócio. Analise a eficiência e as taxas de conversão de cada um detalhadamente no relatório e nos dados estruturados.

2. LISTAGEM MASSIVA DE LEADS/PORTAIS SIMILARES (60+ SUGESTÕES):
   - Você DEVE incluir obrigatoriamente no seu relatório em Markdown uma seção chamada "## 🚀 SUGESTÕES DE PORTAIS E LEADS SIMILARES PARA PROSPECÇÃO (60+ RECOMENDAÇÕES)".
   - Nessa seção, você deve listar obrigatoriamente, em formato numerado de 1 a no mínimo 60, sugestões reais/práticas de portais de negócios, plataformas B2B, empresas SaaS de médio/grande porte, fintechs, ERPs, sistemas de cobrança, logística ou portais que são análogos aos clientes que viraram (ex: similares a Pipedrive, RD Station, Vindi, Senior, Atlassian, SolucoesB2B). Divida-os por categorias claras de mercado (ex: FinTechs de Infraestrutura, SaaS Corporativos, Plataformas B2B e ERPs, Tecnologias de Logística, etc.). A lista deve conter exatamente pelo menos 60 nomes válidos para prospecção direta, garantindo que o usuário tenha um banco de dados maciço para atuar.

3. PROIBIÇÃO ABSOLUTA DE TREINAMENTO / CAPACITAÇÃO DE TIME:
   - Você está TERMINANTEMENTE E TOTALMENTE PROIBIDO de sugerir qualquer ação de treinamento de equipe, cursos para vendedores, capacitação técnica de profissionais, melhorias de habilidades do time de vendas, palestras motivacionais ou mentoring de pessoas.
   - Ao invés disso, foque 100% em ESTRATÉGIAS DE SOLUÇÃO técnica e estrutural: automações de fluxos de dados, integrações de software, enriquecimento de leads via APIs de inteligência comercial, configurações de infraestrutura de outbound (como DNS, SPF, DKIM, DMARC), estruturação de funis de nutrição automatizados, algoritmos de qualificação automatizados (MQL para SQL via dados), e estratégias de growth hacking sistêmicas. Todas as etapas do Plano de Ação devem ser de soluções técnicas e estratégias de engenharia de vendas.

DIRETRIZES GERAIS DE PROCESSAMENTO:

1. SE O USUÁRIO FORNECER APENAS OS DADOS DO FUNIL (hasFunnel = true, hasClients = false):
   - Identifique detalhadamente a origem de cada lead, a taxa de conversão para SQL (Lead -> SQL) e de SQL para Cliente (SQL -> Cliente).
   - Monte uma tabela Markdown clara com as taxas de conversão de cada etapa e a taxa geral do canal.
   - Ofereça um diagnóstico de qual canal é o mais eficiente (como BDR Configr ou Multicanal) e qual apresenta o maior gargalo operacional.

2. SE O USUÁRIO FORNECER APENAS OS SITES/EMPRESAS DOS CLIENTES (hasFunnel = false, hasClients = true):
   - Analise profundamente o perfil destas empresas.
   - Trace um Perfil de Cliente Ideal (ICP - Ideal Customer Profile) detalhado.
   - Forneça a lista de pelo menos 60 portais similares e as palavras-chave eficientes de busca de mercado.

3. SE O USUÁRIO FORNECER AMBOS OS DADOS (hasFunnel = true, hasClients = true):
   - Entregue a inteligência completa cruzada com foco em otimização de receita.
   - Monte a tabela de conversão detalhada por canal.
   - Defina o perfil ICP refinado extraído das empresas e realize o cruzamento estratégico focado em BDR Configr e Multicanal.
   - Forneça o Plano de Ação focado em soluções estruturais e a listagem maciça de mais de 60 portais/empresas recomendadas.

REGRAS DE FORMATAÇÃO E TOM:
- Use um tom profissional de consultor de vendas elite, altamente focado em growth, enérgico, direto e sem enrolação.
- O relatório em Markdown no campo "markdownReport" deve ser rico, estruturado, usar tabelas Markdown e bullet points para máxima scannabilidade.
- Além do "markdownReport", preencha com alta fidelidade os campos estruturados do JSON para permitir a renderização de componentes e painéis visuais no dashboard.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Realize a análise de RevOps baseado nos seguintes dados e nas diretrizes estabelecidas:${inputDescription}`,
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            markdownReport: {
              type: Type.STRING,
              description: "Relatório detalhado em Markdown contendo as tabelas, análises de conversão e planos de ação como estipulado nas diretrizes."
            },
            metricsSummary: {
              type: Type.ARRAY,
              description: "Resumo estruturado por canal. Caso não haja dados de funil, retorne um array vazio.",
              items: {
                type: Type.OBJECT,
                properties: {
                  channel: { type: Type.STRING, description: "Nome do canal (ex: Outbound, Inbound)" },
                  leads: { type: Type.NUMBER },
                  sqls: { type: Type.NUMBER },
                  clients: { type: Type.NUMBER },
                  leadToSqlRate: { type: Type.NUMBER, description: "Taxa em % (Ex: 15.4)" },
                  sqlToClientRate: { type: Type.NUMBER, description: "Taxa em % (Ex: 22.1)" },
                  overallRate: { type: Type.NUMBER, description: "Taxa em % Geral de Lead para Cliente (Ex: 3.4)" },
                  efficiencyScore: { type: Type.STRING, description: "Rating de eficiência do canal: Alta, Média ou Baixa" },
                  mainBottleneck: { type: Type.STRING, description: "O maior gargalo identificado nesse canal" }
                },
                required: ["channel", "leads", "sqls", "clients", "leadToSqlRate", "sqlToClientRate", "overallRate", "efficiencyScore", "mainBottleneck"]
              }
            },
            icpProfile: {
              type: Type.OBJECT,
              description: "Detalhamento de Perfil de Cliente Ideal (ICP). Se não houver lista de clientes, faça inferências educadas a partir dos canais.",
              properties: {
                marketSegment: { type: Type.STRING, description: "Segmento principal detectado ou sugerido" },
                valueProposition: { type: Type.STRING, description: "Proposta de valor core" },
                commonPains: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "As 3 a 5 maiores dores dessas empresas"
                },
                idealSectors: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Setores específicos recomendados para focar"
                },
                revenueOpportunity: { type: Type.STRING, description: "Descrição do tamanho ideal de empresa e potencial financeiro" }
              },
              required: ["marketSegment", "valueProposition", "commonPains", "idealSectors"]
            },
            prospectingKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Palavras-chave de pesquisa para vendas B2B"
            },
            prospectingNiches: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Nichos quentes sugeridos para prospecção"
            },
            targetAccounts: {
              type: Type.ARRAY,
              description: "Lista de empresas recomendadas para prospecção imediata",
              items: {
                type: Type.OBJECT,
                properties: {
                  companyName: { type: Type.STRING, description: "Nome da empresa recomendada" },
                  sector: { type: Type.STRING, description: "Setor da empresa" },
                  websitePlaceholder: { type: Type.STRING, description: "Domínio ou site exemplo" },
                  painHook: { type: Type.STRING, description: "Diz o gancho de dor ideal para abordar essa empresa" },
                  outreachScript: { type: Type.STRING, description: "Script rápido e matador de abordagem focado em receita" }
                },
                required: ["companyName", "sector", "websitePlaceholder", "painHook", "outreachScript"]
              }
            },
            actionPlan: {
              type: Type.ARRAY,
              description: "Plano de ação focado em RevOps e crescimento",
              items: {
                type: Type.OBJECT,
                properties: {
                  stepTitle: { type: Type.STRING, description: "Ação a ser tomada" },
                  priority: { type: Type.STRING, description: "Alta, Média ou Baixa" },
                  description: { type: Type.STRING, description: "Explicação prática e direta do que fazer" }
                },
                required: ["stepTitle", "priority", "description"]
              }
            }
          },
          required: ["markdownReport", "metricsSummary", "icpProfile", "prospectingKeywords", "prospectingNiches", "targetAccounts", "actionPlan"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Erro na rota de análise:", error);
    res.status(500).json({ error: error?.message || "Ocorreu um erro interno ao processar a inteligência artificial de RevOps." });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
