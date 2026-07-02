import React, { useState } from "react";
import { ChannelMetric } from "../types";
import { Plus, Trash2, FileSpreadsheet, Sparkles, RefreshCw } from "lucide-react";

interface MetricInputTableProps {
  metrics: ChannelMetric[];
  onChange: (metrics: ChannelMetric[]) => void;
  onLoadSample: () => void;
  onClear: () => void;
}

export default function MetricInputTable({
  metrics,
  onChange,
  onLoadSample,
  onClear,
}: MetricInputTableProps) {
  const [pasteAreaOpen, setPasteAreaOpen] = useState(false);
  const [pastedText, setPastedText] = useState("");

  const handleRowChange = (id: string, field: keyof ChannelMetric, value: string | number) => {
    const updated = metrics.map((row) => {
      if (row.id === id) {
        let val = value;
        if (field === "leads" || field === "sqls" || field === "clients") {
          val = Number(value) || 0;
        }
        return { ...row, [field]: val };
      }
      return row;
    });
    onChange(updated);
  };

  const addRow = () => {
    const newRow: ChannelMetric = {
      id: Date.now().toString(),
      channel: `Canal ${metrics.length + 1}`,
      leads: 0,
      sqls: 0,
      clients: 0,
    };
    onChange([...metrics, newRow]);
  };

  const removeRow = (id: string) => {
    onChange(metrics.filter((row) => row.id !== id));
  };

  const handleSpreadsheetPaste = () => {
    if (!pastedText.trim()) return;

    const lines = pastedText.trim().split("\n");
    const parsedRows: ChannelMetric[] = [];

    lines.forEach((line, index) => {
      // Split by tabs (spreadsheets) or commas/semicolons
      const parts = line.split(/\t|,|;/);
      if (parts.length >= 2) {
        // Simple extraction
        const name = parts[0]?.trim() || `Canal Importado ${index + 1}`;
        const leads = parseInt(parts[1]?.replace(/[.\s]/g, "")) || 0;
        const sqls = parts[2] ? parseInt(parts[2]?.replace(/[.\s]/g, "")) || 0 : 0;
        const clients = parts[3] ? parseInt(parts[3]?.replace(/[.\s]/g, "")) || 0 : 0;

        parsedRows.push({
          id: `${Date.now()}-${index}`,
          channel: name,
          leads,
          sqls,
          clients,
        });
      }
    });

    if (parsedRows.length > 0) {
      onChange(parsedRows);
      setPasteAreaOpen(false);
      setPastedText("");
    }
  };

  return (
    <div className="bg-[#0f0f0f] border border-white/10 rounded-lg p-4 shadow-lg relative overflow-hidden" id="metric-input-card">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-orange-600"></div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
        <div>
          <h2 className="text-sm font-display font-bold text-white flex items-center gap-1.5 uppercase tracking-wide">
            <span className="text-orange-500 font-black">1.</span> Dados do Funil (Métricas)
          </h2>
          <p className="text-[10px] text-slate-400">
            Insira os dados quantitativos de seus canais de vendas B2B.
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setPasteAreaOpen(!pasteAreaOpen)}
            className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-[#151515] hover:bg-neutral-800 text-slate-200 transition-all border border-white/10"
            title="Importar do Excel/Google Sheets"
            id="btn-paste-spreadsheet"
          >
            <FileSpreadsheet className="w-3 h-3 text-green-500" />
            <span>Colar Planilha</span>
          </button>
          <button
            onClick={onLoadSample}
            className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-orange-950/20 hover:bg-orange-900/30 text-orange-400 transition-all border border-orange-900/30"
            title="Carregar exemplo prático"
            id="btn-load-sample-metrics"
          >
            <Sparkles className="w-3 h-3 text-orange-400" />
            <span>Exemplo</span>
          </button>
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-[#0f0f0f] hover:bg-neutral-800 text-slate-500 hover:text-red-400 transition-all border border-white/5"
            title="Limpar todos os dados"
            id="btn-clear-metrics"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Limpar</span>
          </button>
        </div>
      </div>

      {pasteAreaOpen && (
        <div className="mb-3 p-3 bg-[#050505] border border-white/10 rounded animate-fade-in" id="paste-box-container">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
            Cole as colunas de sua planilha (Canal, Leads, SQLs, Clientes):
          </label>
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Outbound&#9;1000&#9;150&#9;15&#10;Inbound&#9;5000&#9;600&#9;30"
            rows={3}
            className="w-full text-[11px] font-mono bg-[#151515] border border-white/10 text-slate-100 p-2 rounded focus:outline-none focus:border-orange-500 resize-none"
            id="spreadsheet-textarea"
          />
          <div className="flex justify-end gap-1.5 mt-1.5">
            <button
              onClick={() => {
                setPasteAreaOpen(false);
                setPastedText("");
              }}
              className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-[#151515] hover:bg-neutral-800 text-slate-300 rounded"
              id="btn-cancel-paste"
            >
              Cancelar
            </button>
            <button
              onClick={handleSpreadsheetPaste}
              className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-orange-600 hover:bg-orange-500 text-black font-black rounded shadow-md"
              id="btn-confirm-paste"
            >
              Processar
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded border border-white/10 bg-[#050505]/50">
        <table className="w-full text-left border-collapse text-[11px] font-mono">
          <thead>
            <tr className="bg-[#050505] border-b border-white/10 text-slate-400 uppercase text-[9px] tracking-wider">
              <th className="py-2 px-3 font-medium">Canal de Aquisição</th>
              <th className="py-2 px-2 text-right font-medium">Leads</th>
              <th className="py-2 px-2 text-right font-medium">SQLs</th>
              <th className="py-2 px-2 text-right font-medium">Clientes</th>
              <th className="py-2 px-3 text-center font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {metrics.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-500 bg-[#050505]/10 font-sans">
                  Nenhum canal cadastrado. Clique em <span className="text-orange-500 font-bold cursor-pointer" onClick={addRow}>Adicionar Canal</span>.
                </td>
              </tr>
            ) : (
              metrics.map((row) => (
                <tr key={row.id} className="hover:bg-white/5 text-slate-200">
                  <td className="py-1 px-3">
                    <input
                      type="text"
                      value={row.channel}
                      onChange={(e) => handleRowChange(row.id, "channel", e.target.value)}
                      placeholder="Ex: Outbound Ativo"
                      className="w-full bg-[#151515] border border-white/5 focus:border-orange-500 focus:outline-none px-2 py-1 rounded text-white transition-all text-[11px] font-sans"
                    />
                  </td>
                  <td className="py-1 px-2">
                    <input
                      type="number"
                      value={row.leads}
                      onChange={(e) => handleRowChange(row.id, "leads", e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-20 ml-auto text-right bg-[#151515] border border-white/5 focus:border-orange-500 focus:outline-none px-2 py-1 rounded text-white transition-all font-mono"
                    />
                  </td>
                  <td className="py-1 px-2">
                    <input
                      type="number"
                      value={row.sqls}
                      onChange={(e) => handleRowChange(row.id, "sqls", e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-16 ml-auto text-right bg-[#151515] border border-white/5 focus:border-orange-500 focus:outline-none px-2 py-1 rounded text-white transition-all font-mono"
                    />
                  </td>
                  <td className="py-1 px-2">
                    <input
                      type="number"
                      value={row.clients}
                      onChange={(e) => handleRowChange(row.id, "clients", e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-16 ml-auto text-right bg-[#151515] border border-white/5 focus:border-orange-500 focus:outline-none px-2 py-1 rounded text-white transition-all font-mono"
                    />
                  </td>
                  <td className="py-1 px-3 text-center">
                    <button
                      onClick={() => removeRow(row.id)}
                      className="p-1 text-slate-400 hover:text-red-400 hover:bg-[#151515] rounded transition-all"
                      title="Remover canal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex justify-between items-center text-xs">
        <button
          onClick={addRow}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#151515] border border-white/10 hover:border-white/20 text-white font-bold text-[10px] uppercase tracking-wider transition-all"
          id="btn-add-channel-row"
        >
          <Plus className="w-3.5 h-3.5 text-orange-500" />
          <span>Adicionar Canal</span>
        </button>

        {metrics.length > 0 && (
          <div className="text-slate-400 font-mono text-right flex gap-2 text-[10px] uppercase opacity-75">
            <span>Leads: <strong className="text-white">{metrics.reduce((acc, c) => acc + c.leads, 0).toLocaleString()}</strong></span>
            <span>SQLs: <strong className="text-white">{metrics.reduce((acc, c) => acc + c.sqls, 0).toLocaleString()}</strong></span>
            <span>Clientes: <strong className="text-white">{metrics.reduce((acc, c) => acc + c.clients, 0).toLocaleString()}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
}
