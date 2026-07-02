import React, { useState } from "react";
import { ActionStep, TargetAccount } from "../types";
import { Clipboard, Check, Calendar, ArrowRight, ShieldAlert, CheckCircle2, ChevronRight, Play } from "lucide-react";

interface ActionPlanPanelProps {
  actionPlan: ActionStep[];
  targetAccounts: TargetAccount[];
}

export default function ActionPlanPanel({
  actionPlan,
  targetAccounts,
}: ActionPlanPanelProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "alta":
        return "bg-red-500/10 text-red-400 border border-red-500/30";
      case "média":
      case "media":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/30";
      case "baixa":
        return "bg-slate-500/10 text-slate-400 border border-slate-500/30";
      default:
        return "bg-blue-500/10 text-blue-400 border border-blue-500/30";
    }
  };

  return (
    <div className="space-y-6" id="action-plan-panel-container">
      {/* 1. Action Steps */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <h3 className="text-sm font-display font-bold text-slate-300 mb-4 flex items-center gap-1.5 uppercase tracking-wider">
          <Calendar className="w-4 h-4 text-orange-500" />
          Plano de Ação de Growth Comercial
        </h3>

        {actionPlan.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            Nenhuma etapa de plano de ação gerada ainda. Execute a análise com dados.
          </div>
        ) : (
          <div className="space-y-4">
            {actionPlan.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-slate-950/60 border border-slate-800 rounded-lg hover:border-slate-700/60 transition-all"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-mono font-bold flex items-center justify-center text-slate-300">
                    {idx + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-white truncate">{step.stepTitle}</h4>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getPriorityBadgeColor(step.priority)}`}>
                      Prioridade {step.priority}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Target Accounts & Outreach Scripts */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <h3 className="text-sm font-display font-bold text-slate-300 mb-4 flex items-center gap-1.5 uppercase tracking-wider">
          <ArrowRight className="w-4 h-4 text-red-500" />
          Prospecção Imediata (Contas Semelhantes)
        </h3>

        {targetAccounts.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            Nenhuma sugestão de prospecção gerada ainda. Forneça a lista de clientes para obter alvos semelhantes.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {targetAccounts.map((account, index) => (
              <div
                key={index}
                className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-4 space-y-3 hover:border-orange-500/30 transition-all"
              >
                {/* Header info */}
                <div className="flex justify-between items-start gap-2 border-b border-slate-800/60 pb-2">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      {account.companyName}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      Setor: <strong className="text-slate-300 font-normal">{account.sector}</strong> | Site: <strong className="text-slate-300 font-normal">{account.websitePlaceholder}</strong>
                    </p>
                  </div>
                  <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                    Outbound Target
                  </span>
                </div>

                {/* Pain Point Hook */}
                <div className="bg-slate-900/40 p-2 rounded border border-slate-800 text-[11px] leading-relaxed text-slate-300">
                  <strong className="text-red-400 font-medium block text-[10px] mb-0.5 uppercase tracking-wide">Gancho de Abordagem (Foco em Dor):</strong>
                  {account.painHook}
                </div>

                {/* Outreach Script Box */}
                <div className="bg-slate-950 border border-slate-800 rounded p-2.5 relative group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Script Cold Approach Sugerido</span>
                    <button
                      onClick={() => copyToClipboard(account.outreachScript, index)}
                      className="p-1 text-slate-400 hover:text-white rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all flex items-center gap-1 text-[10px]"
                      title="Copiar script"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-3 h-3 text-green-400" />
                          <span className="text-green-400 text-[9px] font-semibold">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Clipboard className="w-3 h-3 text-slate-400" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed italic pr-8">
                    &ldquo;{account.outreachScript}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
