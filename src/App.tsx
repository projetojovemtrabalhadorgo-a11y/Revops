import React, { useState, useEffect } from "react";
import { ChannelMetric, AnalysisResponse, ActionStep, TargetAccount, IcpProfile, MetricsSummary } from "./types";
import { SAMPLE_FUNNEL_DATA, SAMPLE_CLIENT_LIST } from "./data";
import MetricInputTable from "./components/MetricInputTable";
import ClientListInput from "./components/ClientListInput";
import FunnelVisualizer from "./components/FunnelVisualizer";
import MarkdownReport from "./components/MarkdownReport";
import MetricsSummaryCards from "./components/MetricsSummaryCards";
import IcpProfilePanel from "./components/IcpProfilePanel";
import ActionPlanPanel from "./components/ActionPlanPanel";

import {
  Flame,
  Zap,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  FileText,
  PieChart,
  Target,
  ArrowRight,
  ChevronRight,
  Info
} from "lucide-react";

export default function App() {
  // Input states pre-populated for a fantastic first-use experience
  const [funnelMetrics, setFunnelMetrics] = useState<ChannelMetric[]>(SAMPLE_FUNNEL_DATA);
  const [clientList, setClientList] = useState<string[]>([]);

  // Results states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [loadingMessageIdx, setLoadingMessageIdx] = useState(0);

  // Active tab on results
  const [activeResultTab, setActiveResultTab] = useState<"markdown" | "metrics" | "icp" | "action">("markdown");

  // Rotating loading messages
  const loadingMessages = [
    "Iniciando o Hub RevOps de Inteligência B2B...",
    "Analisando taxas de conversão de leads por canal...",
    "Rastreando perfis de empresas para definir o ICP...",
    "Identificando o canal com a maior eficiência comercial...",
    "Gerando palavras-chave e canais quentes para prospecção...",
    "Calculando o cruzamento estratégico de receita...",
    "Estruturando plano de ação de growth imediato...",
    "Criando scripts de abordagem outbound focados em receita..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMessageIdx((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    } else {
      setLoadingMessageIdx(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Determine current input state for adaptive guidance
  const hasFunnel = funnelMetrics.length > 0 && funnelMetrics.some(m => m.leads > 0);
  const hasClients = clientList.length > 0;

  const handleClearAll = () => {
    setFunnelMetrics([]);
    setClientList([]);
    setAnalysisResult(null);
    setError(null);
  };

  const handleLoadSamples = () => {
    setFunnelMetrics(SAMPLE_FUNNEL_DATA);
    setClientList(SAMPLE_CLIENT_LIST);
    setError(null);
  };

  const handleRunIntelligence = async () => {
    if (!hasFunnel && !hasClients) {
      setError("Por favor, preencha pelo menos um dos painéis (Dados de Funil ou Lista de Clientes) para que a IA possa analisar.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          funnelData: funnelMetrics,
          clientList: clientList,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ocorreu um erro ao gerar o relatório.");
      }

      setAnalysisResult(data);
      // Automatically switch to executive markdown tab
      setActiveResultTab("markdown");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Ocorreu um erro imprevisto ao entrar em contato com a IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans antialiased pb-12 selection:bg-orange-500 selection:text-white" id="main-applet-root">
      {/* Decorative Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-gradient-to-b from-orange-600/10 via-red-600/5 to-transparent blur-3xl pointer-events-none"></div>

      {/* Header Panel */}
      <header className="border-b border-white/10 bg-[#050505]/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-600 w-10 h-10 rounded flex items-center justify-center font-bold text-black font-display text-base shadow-md shadow-orange-600/10 flame-glow-effect">
              RO
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tighter uppercase italic text-white">
                  <span className="text-orange-500">Rev Ops</span> On Fire
                </h1>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">Hub de Inteligência de Vendas B2B & ICP</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1 ${hasFunnel ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-orange-500/10 border-orange-500/30 text-orange-400'} border rounded text-[10px] uppercase font-bold tracking-wider`}>
              <span className={`w-1.5 h-1.5 rounded-full ${hasFunnel ? 'bg-green-500 animate-pulse' : 'bg-orange-500 animate-pulse'}`}></span>
              Dados do Funil: {hasFunnel ? 'OK' : 'PENDENTE'}
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 ${hasClients ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-orange-500/10 border-orange-500/30 text-orange-400'} border rounded text-[10px] uppercase font-bold tracking-wider`}>
              <span className={`w-1.5 h-1.5 rounded-full ${hasClients ? 'bg-green-500 animate-pulse' : 'bg-orange-500 animate-pulse'}`}></span>
              Lista Clientes: {hasClients ? 'OK' : 'PENDENTE'}
            </div>
            <div className="text-[10px] opacity-50 font-mono hidden sm:inline-block border border-white/5 bg-white/5 px-2 py-1 rounded">v.2.4.0-PRO</div>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={handleLoadSamples}
            className="text-[11px] px-2.5 py-1.5 rounded bg-[#151515] border border-white/10 hover:border-white/20 transition-all font-bold text-slate-300 flex items-center gap-1 uppercase tracking-wider"
            id="btn-header-load-samples"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Exemplo Prático</span>
          </button>
          <button
            onClick={handleClearAll}
            className="text-[11px] px-2.5 py-1.5 rounded bg-[#0f0f0f] border border-white/10 hover:border-red-500/30 hover:text-red-400 transition-all font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider"
            id="btn-header-clear-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetar</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Input controls (span 5) */}
          <section className="lg:col-span-5 space-y-6 flex flex-col">
            
            {/* Input Guidance Banner */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex gap-3 items-start">
              <Info className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-white block mb-0.5">Como usar o RevOps On Fire:</span>
                <p className="text-slate-400 leading-relaxed">
                  Insira seus canais de aquisição com números de funil e a lista de sites de clientes atuais. Nossa IA especialista fará o cruzamento estratégico para identificar oportunidades de growth e gerar scripts de abordagem fria.
                </p>

                {/* Adaptive state message */}
                <div className="mt-2.5 pt-2.5 border-t border-slate-800 flex items-center gap-1.5 font-medium">
                  {hasFunnel && hasClients ? (
                    <span className="text-green-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                      Métricas + Clientes detectados! Pronto para cruzamento de receita máximo.
                    </span>
                  ) : hasFunnel ? (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      Métricas inseridas. Adicione Clientes para desbloquear mapeamento de ICP.
                    </span>
                  ) : hasClients ? (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      Clientes inseridos. Adicione Métricas para medir a eficiência dos canais.
                    </span>
                  ) : (
                    <span className="text-slate-500">Aguardando dados nos painéis abaixo...</span>
                  )}
                </div>
              </div>
            </div>

            {/* Panel 1: Metrics */}
            <MetricInputTable
              metrics={funnelMetrics}
              onChange={setFunnelMetrics}
              onLoadSample={() => setFunnelMetrics(SAMPLE_FUNNEL_DATA)}
              onClear={() => setFunnelMetrics([])}
            />

            {/* Panel 2: Clients */}
            <ClientListInput
              clientList={clientList}
              onChange={setClientList}
              onLoadSample={() => setClientList(SAMPLE_CLIENT_LIST)}
              onClear={() => setClientList([])}
            />

            {/* Main Action Call to AI */}
            <button
              onClick={handleRunIntelligence}
              disabled={loading || (!hasFunnel && !hasClients)}
              className={`w-full py-4 px-6 rounded-xl font-display font-bold text-sm tracking-wide uppercase transition-all shadow-lg flex items-center justify-center gap-2 ${
                loading
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                  : !hasFunnel && !hasClients
                  ? "bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800"
                  : "bg-gradient-to-r from-orange-500 via-amber-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-orange-500/20 border border-orange-500/30 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              }`}
              id="btn-run-analysis"
            >
              <Zap className={`w-4 h-4 ${loading ? "animate-spin text-slate-500" : "text-white animate-pulse"}`} />
              <span>{loading ? "Processando Inteligência..." : "🔥 Rodar Inteligência RevOps"}</span>
            </button>

            {/* High Density KPI benchmarks */}
            <div className="bg-[#0f0f0f] border border-white/10 p-4 rounded-lg flex items-center justify-between shadow-sm mt-2" id="kpi-target-benchmarks">
              <div className="flex flex-col">
                <span className="text-[10px] opacity-40 uppercase tracking-wider font-mono">Revenue Target</span>
                <span className="text-sm font-mono font-bold text-white">R$ 1.2M / Q3</span>
              </div>
              <div className="h-8 w-[1px] bg-white/10"></div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] opacity-40 uppercase tracking-wider font-mono">Efficiency Gain</span>
                <span className="text-sm font-mono font-bold text-green-500">+18.4%</span>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN: Performance / AI Reports (span 7) */}
          <section className="lg:col-span-7 flex flex-col space-y-6">

            {/* Error Display Panel */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-200 rounded-xl p-5 shadow-lg flex gap-3" id="error-panel">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-bold text-red-400 block mb-1">Aviso do Hub de Vendas B2B:</span>
                  <p>{error}</p>
                  {error.includes("GEMINI_API_KEY") && (
                    <div className="mt-3 p-3 bg-slate-950/80 border border-red-500/20 rounded text-slate-300 space-y-1.5 text-[11px]">
                      <p className="font-semibold text-white">Como configurar a sua chave de API:</p>
                      <ol className="list-decimal pl-4 space-y-1">
                        <li>Clique no menu <strong className="text-orange-400">Settings</strong> no topo ou lateral do AI Studio.</li>
                        <li>Selecione <strong className="text-orange-400">Secrets</strong>.</li>
                        <li>Adicione a variável <strong className="text-orange-400">GEMINI_API_KEY</strong> com a sua chave obtida no Google AI Studio.</li>
                        <li>Tente rodar a análise novamente!</li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {loading && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl text-center space-y-6 flex-1 flex flex-col items-center justify-center min-h-[350px] animate-pulse" id="loading-panel">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-orange-500 animate-spin flex items-center justify-center">
                    <Flame className="w-6 h-6 text-orange-500 fill-orange-500 animate-bounce" />
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-orange-500/10 rounded-full filter blur-md"></div>
                </div>

                <div className="space-y-2 max-w-md">
                  <h4 className="text-sm font-display font-bold text-white tracking-wide uppercase">
                    Hub RevOps Alimentado por IA
                  </h4>
                  <p className="text-xs text-orange-400 font-semibold italic min-h-[1.5rem] px-4 animate-fade-in">
                    {loadingMessages[loadingMessageIdx]}
                  </p>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Nossa IA está correlacionando as dores e propostas de valor dos seus clientes com as taxas de conversão de leads e oportunidades de mercado.
                  </p>
                </div>
              </div>
            )}

            {/* Main Result Displays & Charts */}
            {!loading && (
              <div className="flex-1 flex flex-col space-y-6">
                
                {/* AI Analysis Result Tabs Header */}
                {analysisResult ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 flex flex-wrap gap-1 shadow-md" id="result-tabs-bar">
                    <button
                      onClick={() => setActiveResultTab("markdown")}
                      className={`flex-1 min-w-[120px] text-center text-xs font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        activeResultTab === "markdown"
                          ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md font-bold"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Relatório IA</span>
                    </button>
                    <button
                      onClick={() => setActiveResultTab("metrics")}
                      className={`flex-1 min-w-[120px] text-center text-xs font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        activeResultTab === "metrics"
                          ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md font-bold"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      <PieChart className="w-3.5 h-3.5" />
                      <span>Canais & Gargalos</span>
                    </button>
                    <button
                      onClick={() => setActiveResultTab("icp")}
                      className={`flex-1 min-w-[120px] text-center text-xs font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        activeResultTab === "icp"
                          ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md font-bold"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>Perfil ICP & Nichos</span>
                    </button>
                    <button
                      onClick={() => setActiveResultTab("action")}
                      className={`flex-1 min-w-[120px] text-center text-xs font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        activeResultTab === "action"
                          ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md font-bold"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Plano de Ação</span>
                    </button>
                  </div>
                ) : (
                  // Initial Landing State - Visual Welcome & Live Charts
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden" id="landing-welcome-box">
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-800"></div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-orange-500" />
                      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Visão Analítica Preliminar
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      Abaixo, veja o gráfico de conversão calculado localmente com base nos seus dados atuais de métricas. Para cruzar esses números com o perfil dos clientes e receber insights estratégicos de receita, clique no botão <strong className="text-orange-400">🔥 Rodar Inteligência RevOps</strong>.
                    </p>
                  </div>
                )}

                {/* Tab Views content */}
                {analysisResult ? (
                  <div className="transition-all animate-fade-in" id="active-tab-content-wrapper">
                    {activeResultTab === "markdown" && (
                      <MarkdownReport content={analysisResult.markdownReport} />
                    )}

                    {activeResultTab === "metrics" && (
                      <div className="space-y-6">
                        <MetricsSummaryCards summaries={analysisResult.metricsSummary} />
                        {/* Always show charts alongside metrics summaries */}
                        <FunnelVisualizer metrics={funnelMetrics} />
                      </div>
                    )}

                    {activeResultTab === "icp" && (
                      <IcpProfilePanel
                        icp={analysisResult.icpProfile}
                        keywords={analysisResult.prospectingKeywords}
                        niches={analysisResult.prospectingNiches}
                      />
                    )}

                    {activeResultTab === "action" && (
                      <ActionPlanPanel
                        actionPlan={analysisResult.actionPlan}
                        targetAccounts={analysisResult.targetAccounts}
                      />
                    )}
                  </div>
                ) : (
                  // If no AI result yet, show dynamic real-time Recharts visualizer directly!
                  <div className="animate-fade-in" id="initial-funnel-preview">
                    <FunnelVisualizer metrics={funnelMetrics} />
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono opacity-40 uppercase tracking-[0.2em] pb-8 gap-2" id="dashboard-footer">
        <div>Processing real-time neural data intersection</div>
        <div>© 2026 Revenue Ops Intelligence Hub</div>
      </footer>
    </div>
  );
}
