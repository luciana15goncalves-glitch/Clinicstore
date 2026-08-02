import React from 'react';
import { BarChart3, Download, TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

export const RelatoriosView: React.FC = () => {
  const faturamentoMensalData = [
    { mes: 'Jan', valor: 38000 },
    { mes: 'Fev', valor: 42000 },
    { mes: 'Mar', valor: 39500 },
    { mes: 'Abr', valor: 45000 },
    { mes: 'Mai', valor: 41000 },
    { mes: 'Jun', valor: 46200 },
    { mes: 'Jul', valor: 44000 },
    { mes: 'Ago', valor: 48356 },
  ];

  const faixaEtariaData = [
    { name: '0-18 anos', value: 12, color: '#38BDF8' },
    { name: '19-39 anos', value: 35, color: '#00A896' },
    { name: '40-59 anos', value: 38, color: '#F59E0B' },
    { name: '60+ anos', value: 15, color: '#EC4899' },
  ];

  const handleExportReportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Mes,Faturamento,ConsultasRealizadas\nJan,38000,120\nFev,42000,135\nMar,39500,128\nAgo,48356,152';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'relatorio_desempenho_clinicstore_2026.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Relatórios Estratégicos & BI Clínico
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Análise de produtividade, curva de demanda e faturamento comparativo
          </p>
        </div>

        <button
          onClick={handleExportReportCSV}
          className="bg-[#00A896] hover:bg-[#009282] text-white text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Relatório CSV</span>
        </button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Evolução Faturamento */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">
            Evolução do Faturamento Mensal (R$)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={faturamentoMensalData}>
                <XAxis dataKey="mes" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="valor" fill="#00A896" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Perfil Etário dos Pacientes */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">
            Distribuição por Faixa Etária dos Pacientes
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={faixaEtariaData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {faixaEtariaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
