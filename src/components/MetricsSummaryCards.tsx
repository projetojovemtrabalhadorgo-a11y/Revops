import React from "react";
import { MetricsSummary } from "../types";
import { TrendingUp, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, HelpCircle } from "lucide-react";

interface MetricsSummaryCardsProps {
  summaries: MetricsSummary[];
}

export default function MetricsSummaryCards({ summaries }: MetricsSummaryCardsProps) {
  const getEfficiencyColor = (score: string) => {
    switch (score.toLowerCase()) {
      case "alta":
        return {
          bg: "bg-green-500/10 border-green-500/30",
          text: "text-green-400",
          dot: "bg-green-400",
        };
      case "média":
      case "media":
        return {
          bg: "bg-amber-500/10 border-amber-500/30",
          text: "text-amber-400",
          dot: "bg-amber-400",
        };
      case "baixa":
        return {
          bg: "bg-red-500/10 border-red-500/30",
          text: "text-red-400",
          dot: "bg-red-400",
        };
      default:
        return {
          bg: "bg-slate-800 border-slate-700",
          text: "text-slate-300",
          dot: "bg-slate-400",
        };
    }
  };
  return (
    <div className="space-y-4" id="metrics-summary-cards-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {summaries.length === 0 ? (
          <div className="col-span-2 text-center py-10 bg-[#0f0f0f] border border-white/10 rounded-lg text-slate-500 text-xs">
            Nenhum canal de métricas calculado. Insira os dados quantitativos de funil e gere o relatório.
          </div>
        ) : (
          summaries.map((sum, index) => {
            const styles = getEfficiencyColor(sum.efficiencyScore);
            return (
              <div
                key={index}
                className="bg-[#0f0f0f] border border-white/10 rounded-lg p-3.5 shadow-md relative overflow-hidden flex flex-col justify-between hover:border-white/20 transition-all"
              >
                {/* Glow bar */}
                <div className={`absolute left-0 top-0 h-full w-[3px] ${styles.dot}`}></div>

                <div className="space-y-2.5">
                  {/* Header */}
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-[11px] font-bold text-white uppercase tracking-wider leading-tight font-display pr-6">
                      {sum.channel}
                    </h4>
                    <span
                      className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 ${styles.bg} ${styles.text}`}
                    >
                      <span className={`w-1 h-1 rounded-full ${styles.dot}`}></span>
                      Eficiência {sum.efficiencyScore}
                    </span>
                  </div>

                  {/* Funnel volumes if available */}
                  {(sum.leads !== undefined || sum.sqls !== undefined || sum.clients !== undefined) && (
                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 bg-[#050505]/60 p-2 rounded border border-white/5">
                      <span>Leads: <strong className="text-slate-200">{sum.leads?.toLocaleString() || 0}</strong></span>
                      <span>SQLs: <strong className="text-slate-200">{sum.sqls?.toLocaleString() || 0}</strong></span>
                      <span>Clientes: <strong className="text-slate-200">{sum.clients?.toLocaleString() || 0}</strong></span>
                    </div>
                  )}

                  {/* Calculations grid */}
                  <div className="grid grid-cols-3 gap-1.5 py-0.5">
                    <div className="bg-[#050505] p-2 rounded border border-white/5 text-center">
                      <span className="text-[8px] text-slate-400 block uppercase tracking-wider">Lead → SQL</span>
                      <strong className="text-xs font-mono text-white mt-0.5 block">{sum.leadToSqlRate}%</strong>
                    </div>
                    <div className="bg-[#050505] p-2 rounded border border-white/5 text-center">
                      <span className="text-[8px] text-slate-400 block uppercase tracking-wider">SQL → Cliente</span>
                      <strong className="text-xs font-mono text-white mt-0.5 block">{sum.sqlToClientRate}%</strong>
                    </div>
                    <div className="bg-[#050505] p-2 rounded border border-white/5 text-center">
                      <span className="text-[8px] text-orange-400 block uppercase tracking-wider font-bold">Taxa Geral</span>
                      <strong className="text-xs font-mono text-orange-400 mt-0.5 block">{sum.overallRate}%</strong>
                    </div>
                  </div>
                </div>

                {/* Bottleneck Alert */}
                <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[8px] text-slate-400 uppercase font-bold tracking-wider block">Maior Gargalo Comercial:</span>
                    <p className="text-[10px] text-slate-300 leading-normal font-medium truncate-2-lines">
                      {sum.mainBottleneck}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
