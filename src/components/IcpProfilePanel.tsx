import React from "react";
import { IcpProfile } from "../types";
import { Target, Search, Compass, Flame, ShieldAlert, BadgeDollarSign, HelpCircle } from "lucide-react";

interface IcpProfilePanelProps {
  icp: IcpProfile;
  keywords: string[];
  niches: string[];
}

export default function IcpProfilePanel({
  icp,
  keywords,
  niches,
}: IcpProfilePanelProps) {
  return (
    <div className="space-y-6" id="icp-profile-panel-container">
      {/* Segment and Value Prop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Market Segment Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/5 rounded-full blur-xl"></div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-orange-500" />
            Segmento de Mercado Alvo
          </h4>
          <p className="text-sm font-display font-bold text-white mt-2 leading-snug">
            {icp.marketSegment || "Análise pendente"}
          </p>
          {icp.revenueOpportunity && (
            <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center gap-2">
              <BadgeDollarSign className="w-4 h-4 text-green-400 flex-shrink-0" />
              <p className="text-[10px] text-slate-400">
                Oportunidade Comercial: <strong className="text-slate-200 font-semibold">{icp.revenueOpportunity}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Value Prop Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-full blur-xl"></div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-red-500" />
            Proposta de Valor Core
          </h4>
          <p className="text-xs font-medium text-slate-200 mt-2 leading-relaxed">
            {icp.valueProposition || "Pendente de inserção de lista de clientes"}
          </p>
        </div>
      </div>

      {/* Dores e Setores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pain points */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <ShieldAlert className="w-4 h-4 text-orange-500" />
            Principais Dores do ICP
          </h4>
          {(!icp.commonPains || icp.commonPains.length === 0) ? (
            <p className="text-slate-500 text-xs italic">Nenhuma dor mapeada ainda.</p>
          ) : (
            <ul className="space-y-2 text-xs">
              {icp.commonPains.map((pain, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300">
                  <span className="text-red-500 font-bold mt-0.5">•</span>
                  <span>{pain}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Target Sectors */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Flame className="w-4 h-4 text-red-500 fill-red-500/20" />
            Setores Ideais Recomendados
          </h4>
          {(!icp.idealSectors || icp.idealSectors.length === 0) ? (
            <p className="text-slate-500 text-xs italic">Nenhum setor identificado.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {icp.idealSectors.map((sector, idx) => (
                <span
                  key={idx}
                  className="bg-slate-950 border border-slate-800/80 text-orange-400 font-medium text-xs px-2.5 py-1.5 rounded-lg shadow-sm"
                >
                  {sector}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Keywords and Niches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Keywords */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Search className="w-4 h-4 text-slate-400" />
            Palavras-chave para Prospecção B2B
          </h4>
          {keywords.length === 0 ? (
            <p className="text-slate-500 text-xs italic">Nenhuma palavra-chave gerada.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((word, idx) => (
                <span
                  key={idx}
                  className="bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] px-2 py-1 rounded flex items-center gap-1"
                >
                  <Search className="w-2.5 h-2.5 text-slate-500" />
                  {word}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Hot Niches */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Flame className="w-4 h-4 text-orange-500" />
            Novos Nichos Quentes Sugeridos
          </h4>
          {niches.length === 0 ? (
            <p className="text-slate-500 text-xs italic">Nenhum nicho sugerido.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {niches.map((niche, idx) => (
                <span
                  key={idx}
                  className="bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs px-2.5 py-1 rounded-md font-medium"
                >
                  {niche}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
