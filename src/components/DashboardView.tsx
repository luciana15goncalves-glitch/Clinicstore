import React, { useState } from 'react';
import {
  Calendar,
  Users,
  Wallet,
  AlertTriangle,
  Plus,
  ChevronDown,
  Eye,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Video,
  XCircle,
  FileCheck,
  Stethoscope,
  Building2,
  Lock,
} from 'lucide-react';
import { Appointment, Patient, UserAccount } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar, XAxis, Tooltip } from 'recharts';

interface DashboardViewProps {
  appointments: Appointment[];
  patients: Patient[];
  onOpenNovaConsulta: () => void;
  onSelectAppointmentForEHR: (apt: Appointment) => void;
  onNavigateTab: (tab: string) => void;
  currentUser?: UserAccount;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  appointments,
  patients,
  onOpenNovaConsulta,
  onSelectAppointmentForEHR,
  onNavigateTab,
  currentUser,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDate, setFilterDate] = useState('today');

  const isDoctor = currentUser?.role === 'medico';

  // Filter list for table
  const itemsPerPage = 5;
  const upcomingAppointments = appointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  // Ocupação donut chart data
  const ocupacaoData = [
    { name: 'Ocupado', value: 85, color: '#00B4D8' },
    { name: 'Disponível', value: 15, color: '#E2E8F0' },
  ];

  // Fluxo de Caixa chart data
  const fluxodeCaixaData = [
    { dia: '01', entrada: 3200, saida: 800 },
    { dia: '05', entrada: 4500, saida: 1200 },
    { dia: '10', entrada: 6800, saida: 2100 },
    { dia: '15', entrada: 12000, saida: 3500 },
    { dia: '20', entrada: 24000, saida: 5400 },
    { dia: '25', entrada: 38000, saida: 9200 },
    { dia: '30', entrada: 48356, saida: 12450 },
  ];

  // Sparkline for Conversão
  const sparklineData = [
    { v: 50 },
    { v: 55 },
    { v: 52 },
    { v: 61 },
    { v: 58 },
    { v: 65 },
    { v: 68 },
  ];

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmada':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
            Confirmada
          </span>
        );
      case 'pendente':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
            Pendente
          </span>
        );
      case 'atrasado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Atrasado
          </span>
        );
      case 'concluida':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400">
            Concluída
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Agendada
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Role Context Notification Banner */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm ${
          isDoctor
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-sky-50 border-sky-200 text-sky-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${
              isDoctor
                ? 'bg-emerald-600 text-white'
                : 'bg-sky-600 text-white'
            }`}
          >
            {isDoctor ? <Stethoscope className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm">
                {isDoctor ? 'Visão Médica do Sistema' : 'Visão Recepção & Atendimento'}
              </span>
              <span
                className={`font-black text-[10px] px-2 py-0.5 rounded-full ${
                  isDoctor
                    ? 'bg-emerald-200 text-emerald-800'
                    : 'bg-sky-200 text-sky-800'
                }`}
              >
                {currentUser?.cargo || (isDoctor ? 'Médico' : 'Atendente')}
              </span>
            </div>
            <p className="text-slate-600 mt-0.5">
              {isDoctor
                ? 'Acesso completo autorizado a Prontuário Eletrônico e Históricos Clínicos. Financeiro e Relatórios são restritos à recepção.'
                : 'Acesso autorizado a Agendamento de Consultas, Especialidades, Caixa TISS e Relatórios. Prontuários Médicos são restritos a médicos.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab(isDoctor ? 'prontuario' : 'agenda')}
          className={`px-3.5 py-2 rounded-xl text-white font-extrabold text-xs shrink-0 transition-all ${
            isDoctor ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-sky-700 hover:bg-sky-600'
          }`}
        >
          {isDoctor ? 'Ir para Prontuários' : 'Ir para Agenda'}
        </button>
      </div>

      {/* 1. TOP METRIC CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Consultas Hoje */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
              Consultas Hoje
            </p>
            <h3 className="text-3xl font-extrabold text-slate-800">18</h3>
            <p className="text-xs text-slate-500">
              <span className="font-medium text-slate-700">15 realizadas</span> • 3 pendentes
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Pacientes Atendidos / Novos */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
              {isDoctor ? 'Pacientes Atendidos' : 'Pacientes Novos'}
            </p>
            <h3 className="text-3xl font-extrabold text-slate-800">{isDoctor ? '142' : '4'}</h3>
            <p className="text-xs text-slate-500">Esta semana na clínica</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Faturamento (Atendente) OR Evoluções Clínicas (Médico) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
              {isDoctor ? 'Evoluções Médicas' : 'Faturamento Hoje'}
            </p>
            {isDoctor ? (
              <>
                <h3 className="text-3xl font-black text-slate-800">48 Assinadas</h3>
                <p className="text-[11px] text-slate-500 truncate">
                  100% gravado em prontuário eletrônico
                </p>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-black text-slate-800">R$ 3.200,00</h3>
                <p className="text-[11px] text-slate-500 truncate">
                  Recebido: R$ 2.100 | Pendente: R$ 1.100
                </p>
              </>
            )}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            {isDoctor ? <FileCheck className="w-6 h-6" /> : <Wallet className="w-6 h-6" />}
          </div>
        </div>

        {/* Card 4: Pendências */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
              Pendências
            </p>
            <h3 className="text-3xl font-extrabold text-slate-800">2</h3>
            <p className="text-xs text-slate-500">
              {isDoctor ? 'Prontuários para assinar' : 'Confirmações via WhatsApp'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. MAIN MIDDLE CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLS: PRÓXIMAS CONSULTAS TABLE */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            {/* Table Header Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Próximas Consultas
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Gerenciamento de atendimentos do dia
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenNovaConsulta}
                  className="bg-[#00A896] hover:bg-[#009282] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Nova Consulta</span>
                </button>
                <div className="relative">
                  <select
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-2 pr-8 rounded-xl focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="today">Hoje</option>
                    <option value="tomorrow">Amanhã</option>
                    <option value="week">Esta semana</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 px-2">Horário</th>
                    <th className="pb-3 px-2">Paciente</th>
                    <th className="pb-3 px-2">Tipo</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                  {upcomingAppointments.map((apt) => {
                    const patientObj = patients.find((p) => p.id === apt.pacienteId);
                    return (
                      <tr
                        key={apt.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* Horário */}
                        <td className="py-3.5 px-2 font-bold text-slate-800 dark:text-slate-200">
                          {apt.horario}
                        </td>

                        {/* Paciente */}
                        <td className="py-3.5 px-2">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={
                                patientObj?.foto ||
                                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
                              }
                              alt={apt.pacienteNome}
                              className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                            />
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                                {apt.pacienteNome}
                              </p>
                              {apt.convenioNome && (
                                <p className="text-[11px] text-slate-400">{apt.convenioNome}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Tipo */}
                        <td className="py-3.5 px-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                          {apt.tipo}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-2">{getStatusBadge(apt.status)}</td>

                        {/* Ações */}
                        <td className="py-3.5 px-2 text-right">
                          <button
                            onClick={() => onSelectAppointmentForEHR(apt)}
                            title="Abrir Prontuário Médico"
                            className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 hover:bg-teal-500 hover:text-white dark:hover:bg-teal-600 inline-flex items-center justify-center transition-all shadow-sm"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Pagination */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-4 text-xs font-semibold text-slate-500">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              &lt; Anterior
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    currentPage === idx + 1
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              Próximo &gt;
            </button>
          </div>
        </div>

        {/* RIGHT COL: OCUPAÇÃO DA CLÍNICA & OPERATIONAL METRICS */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Ocupação da Clínica
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Taxa de utilização das salas hoje</p>

            {/* Donut Chart with center value 85% */}
            <div className="h-52 relative flex items-center justify-center my-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ocupacaoData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    {ocupacaoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Total
                </span>
                <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
                  85%
                </span>
              </div>
            </div>
          </div>

          {/* Métricas Operacionais */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              Métricas Operacionais
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <span className="flex items-center justify-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400 mb-1">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  Concluídos
                </span>
                <p className="text-xl font-black text-slate-800 dark:text-slate-100">15</p>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <span className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  Cancelados
                </span>
                <p className="text-xl font-black text-slate-800 dark:text-slate-100">1</p>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <span className="flex items-center justify-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Em espera
                </span>
                <p className="text-xl font-black text-slate-800 dark:text-slate-100">3</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ROW WIDGETS (Conversão, Fluxo de Caixa, Metas) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Widget 1: Conversão */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-lg flex items-center gap-1">
              ⚡ Conversão
            </span>
            <button
              onClick={() => onNavigateTab('relatorios')}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
            >
              Ver
            </button>
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-black text-slate-800 dark:text-slate-100">68%</span>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
                ↑ 5.2% vs mês anterior
              </p>
            </div>
          </div>
          <div className="h-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="#F59E0B"
                  fill="#FEF3C7"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Widget 2: Fluxo de Caixa */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Fluxo de Caixa
                </h4>
                <p className="text-[11px] text-slate-400">Entradas vs Saídas do mês</p>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-bold">SAÍDA</div>
                <div className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                  R$ 12.450
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-bold">ENTRADA</div>
                <div className="text-xs font-extrabold text-sky-600 dark:text-sky-400">
                  R$ 48.356
                </div>
              </div>
            </div>
            <div className="h-16 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fluxodeCaixaData}>
                  <Bar dataKey="saida" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="entrada" fill="#00B4D8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Widget 3: Metas de Receita */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Metas de Receita
            </span>
            <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100">
              R$ 42.500
            </h4>
            <p className="text-xs text-emerald-600 font-semibold">Meta de Agosto: 82% atingida</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-teal-500 border-t-slate-200 flex items-center justify-center text-sm font-black text-[#00A896] shrink-0">
            75%
          </div>
        </div>
      </div>

      {/* 4. FOOTER: CONFORMIDADE LGPD */}
      <footer className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="font-medium">
            Conformidade LGPD - Todos os dados estão protegidos e criptografados.
          </span>
        </div>
        <div>© 2026 CLINIC MEDICAL. Todos os direitos reservados.</div>
      </footer>
    </div>
  );
};
