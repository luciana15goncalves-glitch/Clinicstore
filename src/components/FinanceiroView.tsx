import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  FileCheck2,
  DollarSign,
  Search,
  CheckCircle2,
  Clock,
  Download,
  Building2,
} from 'lucide-react';
import { FinancialTransaction } from '../types';

interface FinanceiroViewProps {
  transactions: FinancialTransaction[];
  onAddTransaction: (t: FinancialTransaction) => void;
}

export const FinanceiroView: React.FC<FinanceiroViewProps> = ({
  transactions,
  onAddTransaction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleExportTissLote = (convenio: string) => {
    const xmlContent = `<?xml version="1.0" encoding="ISO-8859-1"?>
<ans:mensagemTISS xmlns:ans="http://www.ans.gov.br/padroes/tiss/schemas">
  <cabecalho>
    <identificacaoTransacao>
      <tipoTransacao>LOTE_GUIAS</tipoTransacao>
      <sequencialTransacao>881920</sequencialTransacao>
      <data>2026-08-02</data>
    </identificacaoTransacao>
    <origem><registroANS>001293</registroANS></origem>
    <destino><nomeConvenio>${convenio}</nomeConvenio></destino>
  </cabecalho>
  <prestadorParaOperadora>
    <loteGuias>
      <numeroLote>2026080201</numeroLote>
      <valorTotalLote>1850.00</valorTotalLote>
    </loteGuias>
  </prestadorParaOperadora>
</ans:mensagemTISS>`;

    const blob = new Blob([xmlContent], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lote_tiss_${convenio.toLowerCase().replace(/\s+/g, '_')}_20260802.xml`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast(`📄 Arquivo de Lote TISS (ANS XML) gerado com sucesso para ${convenio}!`);
  };

  const filteredTransactions = transactions.filter((t) =>
    t.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto relative">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 z-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Gestão Financeira & Faturamento TISS
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              Fluxo de Caixa Ativo
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Controle de honorários particulares, liquidação de guias de convênios e emissão TISS XML
          </p>
        </div>

        {/* TISS Batch Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportTissLote('Unimed')}
            className="bg-teal-50 dark:bg-teal-950/60 text-[#00A896] dark:text-teal-400 hover:bg-[#00A896] hover:text-white text-xs font-bold px-3.5 py-2.5 rounded-2xl flex items-center gap-1.5 transition-all border border-teal-200 dark:border-teal-800"
          >
            <Download className="w-4 h-4" />
            <span>Gerar TISS Unimed</span>
          </button>
          <button
            onClick={() => handleExportTissLote('Bradesco Saúde')}
            className="bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 hover:bg-sky-600 hover:text-white text-xs font-bold px-3.5 py-2.5 rounded-2xl flex items-center gap-1.5 transition-all border border-sky-200 dark:border-sky-800"
          >
            <Download className="w-4 h-4" />
            <span>Gerar TISS Bradesco</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Receita Bruta Mês</p>
            <h3 className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">
              R$ 48.356,00
            </h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1">↑ +12.4% vs mês anterior</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-500 flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Despesas Operacionais</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">
              R$ 12.450,00
            </h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">Aluguel, insumos e folha</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 flex items-center justify-center">
            <ArrowDownRight className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Lucro Líquido</p>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              R$ 35.906,00
            </h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">Margem operacional: 74%</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar lançamento financeiro..."
              className="w-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 pl-9 pr-3 py-2 rounded-xl focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Descrição</th>
                <th className="py-3.5 px-4">Categoria</th>
                <th className="py-3.5 px-4">Forma Pagto</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {filteredTransactions.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-100">
                    {t.descricao}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase">
                    {t.categoria}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                    {t.formaPagamento}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        t.status === 'pago'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                      }`}
                    >
                      {t.status === 'pago' ? 'Pago' : 'Pendente'}
                    </span>
                  </td>
                  <td
                    className={`py-3.5 px-4 text-right font-black ${
                      t.tipo === 'entrada' ? 'text-emerald-600' : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {t.tipo === 'entrada' ? '+' : '-'} R$ {t.valor.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
