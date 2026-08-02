import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
  Send,
  CheckCircle,
  XCircle,
  FileText,
  Filter,
  Search,
  MessageSquare,
  AlertCircle,
  Check,
} from 'lucide-react';
import { Appointment, AppointmentStatus } from '../types';

interface AgendaViewProps {
  appointments: Appointment[];
  onOpenNovaConsulta: () => void;
  onUpdateStatus: (id: number, status: AppointmentStatus) => void;
  onSelectAppointmentForEHR: (apt: Appointment) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  appointments,
  onOpenNovaConsulta,
  onUpdateStatus,
  onSelectAppointmentForEHR,
}) => {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = selectedStatus === 'all' || apt.status === selectedStatus;
    const matchesSearch =
      apt.pacienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.pacienteCpf.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const handleSendWhatsapp = (apt: Appointment) => {
    showToast(`📱 Lembrete enviado via WhatsApp para ${apt.pacienteNome} (${apt.pacienteTelefone})!`);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-4 z-50">
          <MessageSquare className="w-4 h-4 text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Agenda de Consultas
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-[#00A896] dark:bg-teal-950 dark:text-teal-400">
              {filteredAppointments.length} agendamentos
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gestão completa da grade horária dos profissionais da clínica
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Switcher */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl flex items-center">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'day'
                  ? 'bg-white dark:bg-slate-700 text-[#00A896] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Dia
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'week'
                  ? 'bg-white dark:bg-slate-700 text-[#00A896] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'month'
                  ? 'bg-white dark:bg-slate-700 text-[#00A896] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Mês
            </button>
          </div>

          <button
            onClick={onOpenNovaConsulta}
            className="bg-[#00A896] hover:bg-[#009282] text-white text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Agendar Consulta</span>
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por paciente ou CPF..."
            className="w-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A896]"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Status:
          </span>
          {[
            { id: 'all', label: 'Todos' },
            { id: 'confirmada', label: 'Confirmadas' },
            { id: 'pendente', label: 'Pendentes' },
            { id: 'atrasado', label: 'Atrasados' },
            { id: 'concluida', label: 'Concluídas' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStatus(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === s.id
                  ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List / Timeline View */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="p-5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Time & Patient Info */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-[#00A896] dark:text-teal-400 flex flex-col items-center justify-center shrink-0 border border-teal-100 dark:border-teal-900">
                  <span className="text-sm font-black">{apt.horario}</span>
                  <span className="text-[10px] font-medium text-slate-400">30 min</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                      {apt.pacienteNome}
                    </h4>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                      {apt.tipo}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    <span>CPF: {apt.pacienteCpf}</span>
                    <span>•</span>
                    <span>Tel: {apt.pacienteTelefone}</span>
                  </p>

                  <div className="flex items-center gap-2 text-xs pt-0.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {apt.formaPagamento === 'convenio'
                        ? `Convênio: ${apt.convenioNome}`
                        : `Particular — R$ ${apt.valor}`}
                    </span>
                    {apt.observacoes && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 italic truncate max-w-md">
                          "{apt.observacoes}"
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Status & Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
                {/* Send WhatsApp button */}
                <button
                  onClick={() => handleSendWhatsapp(apt)}
                  title="Enviar confirmação por WhatsApp"
                  className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                {/* Open EHR / Prontuário */}
                <button
                  onClick={() => onSelectAppointmentForEHR(apt)}
                  className="px-3 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Prontuário</span>
                </button>

                {/* Status Trigger Dropdown */}
                <div className="relative">
                  <select
                    value={apt.status}
                    onChange={(e) =>
                      onUpdateStatus(apt.id, e.target.value as AppointmentStatus)
                    }
                    className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none appearance-none cursor-pointer pr-7 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="agendada">Agendada</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="pendente">Pendente</option>
                    <option value="atrasado">Atrasado</option>
                    <option value="concluida">Concluída</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <CalendarIcon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
            <p className="font-semibold text-slate-600 dark:text-slate-300">
              Nenhum agendamento encontrado
            </p>
            <p className="text-xs text-slate-400">
              Tente mudar os filtros de busca ou agendar uma nova consulta.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
