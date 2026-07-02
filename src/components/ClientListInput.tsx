import React, { useState, useEffect, useRef } from "react";
import { Link2, Trash2, Sparkles, AlertCircle, RefreshCw, Layers } from "lucide-react";

interface ClientListInputProps {
  clientList: string[];
  onChange: (clients: string[]) => void;
  onLoadSample: () => void;
  onClear: () => void;
}

export default function ClientListInput({
  clientList = [],
  onChange,
  onLoadSample,
  onClear,
}: ClientListInputProps) {
  const [textValue, setTextValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Keep textValue in sync with parent state changes (like load/clear/remove)
  useEffect(() => {
    if (isFocused) return; // Do not overwrite while actively typing

    const list = Array.isArray(clientList) ? clientList : [];
    
    // Check if the current clientList matches what was parsed last from the text
    const currentTextParsed = textValue
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const isSynced =
      list.length === currentTextParsed.length &&
      list.every((val, i) => val === currentTextParsed[i]);

    if (!isSynced) {
      setTextValue(list.join("\n"));
    }
  }, [clientList, isFocused]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value || "";
    setTextValue(val);
    
    // Parse on changes
    const parsed = val
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    
    onChange(parsed);
  };

  const removeClientTag = (index: number) => {
    const list = Array.isArray(clientList) ? clientList : [];
    const updated = list.filter((_, i) => i !== index);
    onChange(updated);
    setTextValue(updated.join("\n"));
  };

  const safeClientList = Array.isArray(clientList) ? clientList : [];

  return (
    <div className="bg-[#0f0f0f] border border-white/10 rounded-lg p-4 shadow-lg relative overflow-hidden" id="client-list-input-card">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-orange-600"></div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
        <div>
          <h2 className="text-sm font-display font-bold text-white flex items-center gap-1.5 uppercase tracking-wide">
            <span className="text-orange-500 font-black">2.</span> Lista de Clientes (URLs/Empresas)
          </h2>
          <p className="text-[10px] text-slate-400">
            Cole as URLs ou nomes de seus clientes atuais para decifrar seu perfil de ICP.
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={onLoadSample}
            className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-orange-950/20 hover:bg-orange-900/30 text-orange-400 transition-all border border-orange-900/30 font-sans cursor-pointer"
            title="Carregar exemplo de clientes de tecnologia B2B"
            id="btn-load-sample-clients"
          >
            <Sparkles className="w-3 h-3 text-orange-400" />
            <span>Exemplo</span>
          </button>
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-[#0f0f0f] hover:bg-neutral-800 text-slate-500 hover:text-red-400 transition-all border border-white/5 font-sans cursor-pointer"
            title="Limpar todos os clientes"
            id="btn-clear-clients"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Limpar</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Editor Area */}
        <div className="flex flex-col">
          <label className="text-slate-300 font-bold text-[10px] uppercase tracking-wider mb-1 flex justify-between">
            <span>Editor (Um por linha):</span>
            <span className="font-mono text-slate-400">Total: <strong className="text-orange-500">{safeClientList.length}</strong></span>
          </label>
          <div className="relative flex-1">
            <textarea
              value={textValue}
              onChange={handleTextChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ex:&#10;https://www.google.com&#10;Pipedrive CRM&#10;RD Station"
              rows={5}
              className="w-full h-full min-h-[120px] text-xs font-mono bg-[#050505] border border-white/10 focus:border-orange-500 focus:outline-none text-slate-200 p-2.5 rounded focus:ring-1 focus:ring-orange-500/20 resize-none transition-all"
              id="clients-list-textarea"
            />
          </div>
        </div>

        {/* Visualized/Parsed Area */}
        <div className="flex flex-col bg-[#050505]/40 border border-white/10 rounded p-2.5">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            Empresas Identificadas ({safeClientList.length})
          </span>

          {safeClientList.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-slate-500">
              <AlertCircle className="w-5 h-5 text-slate-600 mb-1" />
              <p className="text-[11px]">Nenhum cliente inserido ainda.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto max-h-[120px] pr-1 space-y-1">
              {safeClientList.map((client, index) => {
                if (!client) return null;
                const isUrl = typeof client === "string" && (client.startsWith("http://") || client.startsWith("https://"));
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center text-[11px] px-2 py-1 rounded bg-[#151515] border border-white/5 hover:border-white/10 text-slate-200 group transition-all"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <Link2 className={`w-3 h-3 flex-shrink-0 ${isUrl ? "text-blue-400" : "text-orange-500"}`} />
                      <span className="truncate font-mono">{client}</span>
                    </div>
                    <button
                      onClick={() => removeClientTag(index)}
                      className="text-slate-500 hover:text-red-400 p-0.5 rounded transition-all ml-1.5 cursor-pointer"
                      title="Excluir"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
