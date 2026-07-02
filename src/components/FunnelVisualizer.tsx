import React from "react";
import { ChannelMetric } from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ArrowDown, Flame, Percent, TrendingUp, Users } from "lucide-react";

interface FunnelVisualizerProps {
  metrics: ChannelMetric[];
}

export default function FunnelVisualizer({ metrics }: FunnelVisualizerProps) {
  // Compute aggregate numbers
  const totalLeads = metrics.reduce((sum, item) => sum + item.leads, 0);
  const totalSqls = metrics.reduce((sum, item) => sum + item.sqls, 0);
  const totalClients = metrics.reduce((sum, item) => sum + item.clients, 0);

  // Compute conversion rates
  const aggregateLeadToSql = totalLeads > 0 ? ((totalSqls / totalLeads) * 100).toFixed(1) : "0.0";
  const aggregateSqlToClient = totalSqls > 0 ? ((totalClients / totalSqls) * 100).toFixed(1) : "0.0";
  const aggregateOverall = totalLeads > 0 ? ((totalClients / totalLeads) * 100).toFixed(1) : "0.0";

  // Recharts structured data
  const barChartData = metrics.map((item) => {
    const l2s = item.leads > 0 ? Number(((item.sqls / item.leads) * 100).toFixed(1)) : 0;
    const s2c = item.sqls > 0 ? Number(((item.clients / item.sqls) * 100).toFixed(1)) : 0;
    const overall = item.leads > 0 ? Number(((item.clients / item.leads) * 100).toFixed(1)) : 0;

    return {
      name: item.channel,
      Leads: item.leads,
      SQLs: item.sqls,
      Clientes: item.clients,
      "Conversão SQL (%)": s2c,
      "Conversão Geral (%)": overall,
    };
  });

  const COLORS = ["#f97316", "#ef4444", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e"];

  return (
    <div className="space-y-4" id="funnel-visualizer-container">
      {/* Visual Funnel Card */}
      <div className="bg-[#0f0f0f] border border-white/10 rounded-lg p-4 shadow-lg relative overflow-hidden">
        <h3 className="text-xs font-display font-bold text-slate-300 mb-3 flex items-center gap-1.5 uppercase tracking-widest">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          Funil de Conversão Agregado (Real-time)
        </h3>

        {totalLeads === 0 ? (
          <div className="py-10 text-center text-slate-500 text-xs font-sans">
            Insira dados quantitativos nas métricas para ver o funil de conversão agregado.
          </div>
        ) : (
          <div className="space-y-3">
            {/* Top Funnel Block */}
            <div className="relative">
              <div className="w-full bg-[#050505]/60 border border-white/10 rounded p-2.5 flex justify-between items-center relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-[4px] bg-orange-600"></div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Etapa 1: Leads de Topo (MQL/Geral)</span>
                  <p className="text-lg font-mono font-extrabold text-white">{totalLeads.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">Conversão Base</span>
                  <p className="text-xs font-mono font-bold text-orange-500">100%</p>
                </div>
              </div>
            </div>

            {/* Down Arrow / Rate */}
            <div className="flex justify-center items-center -my-1">
              <div className="bg-[#050505] px-2.5 py-0.5 rounded border border-white/10 flex items-center gap-1 text-[10px] font-mono text-amber-500 font-bold shadow-md z-10 uppercase tracking-wider">
                <ArrowDown className="w-3 h-3 text-amber-500" />
                <span>Conversão Meio: {aggregateLeadToSql}%</span>
              </div>
            </div>

            {/* Middle Funnel Block */}
            <div className="relative">
              <div className="w-[92%] mx-auto bg-[#050505]/60 border border-white/10 rounded p-2.5 flex justify-between items-center relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-[4px] bg-amber-500"></div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Etapa 2: SQLs (Oportunidades Qualificadas)</span>
                  <p className="text-lg font-mono font-extrabold text-white">{totalSqls.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">Sobra do Topo</span>
                  <p className="text-xs font-mono font-bold text-amber-500">{aggregateLeadToSql}%</p>
                </div>
              </div>
            </div>

            {/* Down Arrow / Rate */}
            <div className="flex justify-center items-center -my-1">
              <div className="bg-[#050505] px-2.5 py-0.5 rounded border border-white/10 flex items-center gap-1 text-[10px] font-mono text-red-500 font-bold shadow-md z-10 uppercase tracking-wider">
                <ArrowDown className="w-3 h-3 text-red-500" />
                <span>Conversão Fechamento: {aggregateSqlToClient}%</span>
              </div>
            </div>

            {/* Bottom Funnel Block */}
            <div className="relative">
              <div className="w-[84%] mx-auto bg-[#050505]/60 border border-white/10 rounded p-2.5 flex justify-between items-center relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-[4px] bg-red-600"></div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Etapa 3: Clientes Novos Ativados</span>
                  <p className="text-lg font-mono font-extrabold text-white">{totalClients.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">Conversão Geral</span>
                  <p className="text-xs font-mono font-bold text-red-500">{aggregateOverall}%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recharts Grid */}
      {totalLeads > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Chart 1: Volume por Canal */}
          <div className="bg-[#0f0f0f] border border-white/10 rounded-lg p-3.5 shadow-md">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-300 mb-2.5 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-orange-500" />
              Volume de Leads & SQLs por Canal
            </h4>
            <div className="h-56" id="volume-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="name" stroke="#737373" fontSize={9} tickLine={false} />
                  <YAxis stroke="#737373" fontSize={9} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#050505", borderColor: "rgba(255, 255, 255, 0.1)", fontSize: 10, fontFamily: "monospace" }}
                    labelStyle={{ color: "#fff", fontWeight: "bold" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 9, fontFamily: "monospace", textTransform: "uppercase" }} />
                  <Bar dataKey="Leads" fill="#525252" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="SQLs" fill="#f97316" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Clientes" fill="#ef4444" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Taxa de Conversão */}
          <div className="bg-[#0f0f0f] border border-white/10 rounded-lg p-3.5 shadow-md">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-300 mb-2.5 flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-amber-500" />
              Taxas de Conversão do Funil B2B (%)
            </h4>
            <div className="h-56" id="conversion-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="name" stroke="#737373" fontSize={9} tickLine={false} />
                  <YAxis stroke="#737373" fontSize={9} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#050505", borderColor: "rgba(255, 255, 255, 0.1)", fontSize: 10, fontFamily: "monospace" }}
                    labelStyle={{ color: "#fff", fontWeight: "bold" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 9, fontFamily: "monospace", textTransform: "uppercase" }} />
                  <Bar dataKey="Conversão SQL (%)" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Conversão Geral (%)" fill="#10b981" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
