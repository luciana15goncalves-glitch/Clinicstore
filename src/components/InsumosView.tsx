import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  Plus,
  Minus,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  TrendingDown,
  ShieldAlert,
} from 'lucide-react';
import { StockItem } from '../types';

interface InsumosViewProps {
  stockItems: StockItem[];
  onUpdateStock: (id: number, delta: number) => void;
  onAddStockItem: (item: StockItem) => void;
}

export const InsumosView: React.FC<InsumosViewProps> = ({
  stockItems,
  onUpdateStock,
  onAddStockItem,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAlertsOnly, setFilterAlertsOnly] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredItems = stockItems.filter((item) => {
    const matchesSearch =
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.principioAtivo.toLowerCase().includes(searchTerm.toLowerCase());
    const isLowStock = item.estoqueAtual <= item.estoqueMinimo;
    return filterAlertsOnly ? matchesSearch && isLowStock : matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto relative">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 z-50">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Controle de Insumos & Medicamentos
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400">
              Rastreabilidade ANVISA
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gestão de estoque, lote, validade e baixa automática por prescrição
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterAlertsOnly(!filterAlertsOnly)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              filterAlertsOnly
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Alertas Críticos ({stockItems.filter((i) => i.estoqueAtual <= i.estoqueMinimo).length})</span>
          </button>
        </div>
      </div>

      {/* Search toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome do medicamento ou princípio ativo..."
            className="w-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A896]"
          />
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Insumo / Medicamento</th>
                <th className="py-3.5 px-4">Localização & Lote</th>
                <th className="py-3.5 px-4">Validade</th>
                <th className="py-3.5 px-4 text-center">Estoque Atual</th>
                <th className="py-3.5 px-4 text-right">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {filteredItems.map((item) => {
                const isLow = item.estoqueAtual <= item.estoqueMinimo;
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-800 dark:text-slate-100">
                            {item.nome}
                          </p>
                          {item.controlado && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400">
                              TARJA PRETA
                            </span>
                          )}
                          {isLow && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-100 text-rose-700 animate-pulse">
                              ESTOQUE CRÍTICO
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {item.principioAtivo} • {item.apresentacao}
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                      <p className="font-semibold">{item.localizacao}</p>
                      <p className="text-slate-400 text-[11px]">Lote: {item.lote}</p>
                    </td>

                    <td className="py-4 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {item.validade}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span
                        className={`text-base font-black px-3 py-1 rounded-xl ${
                          isLow
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                        }`}
                      >
                        {item.estoqueAtual} un.
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">Mínimo: {item.estoqueMinimo}</p>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            onUpdateStock(item.id, -1);
                            showToast(`🔻 Baixa de 1 un. em ${item.nome}`);
                          }}
                          className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold transition-colors"
                          title="Registrar Saída (Uso)"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            onUpdateStock(item.id, 10);
                            showToast(`🔺 Entrada de +10 un. em ${item.nome}`);
                          }}
                          className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-[#00A896] hover:bg-[#00A896] hover:text-white flex items-center justify-center font-bold transition-colors"
                          title="Registrar Entrada (+10)"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
