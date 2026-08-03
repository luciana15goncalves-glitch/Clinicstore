import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
  Send,
  FileText,
  Filter,
  Search,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Stethoscope,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  XCircle,
  X,
  UserX,
  ShieldCheck,
  HeartPulse,
} from 'lucide-react';
import { Appointment, AppointmentStatus, Patient, UserAccount } from '../types';
import { DOCTORS_SPECIALTIES } from '../data/mockData';

interface AgendaViewProps {
  appointments: Appointment[];
  patients?: Patient[];
  onOpenNovaConsulta: () => void;
  onUpdateStatus: (id: number, status: AppointmentStatus, motivo?: string) => void;
  onSelectAppointmentForEHR: (apt: Appointment) => void;
  onAddAppointment?: (apt: Omit<Appointment, 'id'>) => void;
  receptionSelectedPatient?: Patient | null;
  onClearReceptionPatient?: () => void;
  currentUser?: UserAccount;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  appointments,
  patients = [],
  onOpenNovaConsulta,
  onUpdateStatus,
  onSelectAppointmentForEHR,
  onAddAppointment,
  receptionSelectedPatient,
  onClearReceptionPatient,
  currentUser,
}) => {
  const [viewMode, setViewMode] = useState<'month' | 'day' | 'week'>('month');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Month navigation state
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(7); // 0-indexed: 7 = Agosto
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('2026-08-03');

  // Encaixe Modal State
  const [isEncaixeModalOpen, setIsEncaixeModalOpen] = useState(false);
  const [encaixePatientId, setEncaixePatientId] = useState<number>(patients[0]?.id || 101);
  const [encaixePatientNome, setEncaixePatientNome] = useState('');
  const [encaixePatientCpf, setEncaixePatientCpf] = useState('');
  const [encaixePatientTel, setEncaixePatientTel] = useState('');
  const [encaixeDoctorId, setEncaixeDoctorId] = useState<number>(DOCTORS_SPECIALTIES[0].id);
  const [encaixeHorario, setEncaixeHorario] = useState('14:30');
  const [encaixeValor, setEncaixeValor] = useState(300);
  const [encaixeForma, setEncaixeForma] = useState<'particular' | 'convenio'>('particular');
  const [encaixeConvenio, setEncaixeConvenio] = useState('Unimed');
  const [encaixeObs, setEncaixeObs] = useState('Atendimento de encaixe de urgência autorizado na recepção.');

  // Desistência Modal State
  const [desistenciaAptId, setDesistenciaAptId] = useState<number | null>(null);
  const [desistenciaMotivo, setDesistenciaMotivo] = useState('Imprevisto pessoal / Desistência informada na recepção');
  const [customDesistenciaMotivo, setCustomDesistenciaMotivo] = useState('');

  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const daysOfWeekShort = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSendWhatsapp = (apt: Appointment) => {
    showToast(`📱 Lembrete de consulta enviado via WhatsApp para ${apt.pacienteNome} (${apt.pacienteTelefone})!`);
  };

  // Helper to generate calendar matrix
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  // Create calendar cells array
  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  for (let day = 1; day <= totalDays; day++) {
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = currentMonth + 1 < 10 ? `0${currentMonth + 1}` : `${currentMonth + 1}`;
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    calendarCells.push({ day, dateStr });
  }

  // Filter appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = selectedStatus === 'all' || apt.status === selectedStatus;
    const matchesSearch =
      apt.pacienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.pacienteCpf.includes(searchTerm) ||
      apt.medicoNome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDoctor =
      selectedDoctorFilter === 'todos' || apt.medicoNome.toLowerCase().includes(selectedDoctorFilter.toLowerCase());
    return matchesStatus && matchesSearch && matchesDoctor;
  });

  // Get appointments for a specific date string
  const getAppointmentsForDate = (dateStr: string) => {
    return filteredAppointments.filter((apt) => apt.dataHora.startsWith(dateStr));
  };

  // Available doctors for a given day of the week
  const getAvailableDoctorsForDayOfWeek = (dateStr: string) => {
    const d = new Date(`${dateStr}T12:00:00`);
    const dayNamesMap: { [key: number]: string } = {
      1: 'Segunda-feira',
      2: 'Terça-feira',
      3: 'Quarta-feira',
      4: 'Quinta-feira',
      5: 'Sexta-feira',
      6: 'Sábado',
      0: 'Domingo',
    };
    const dayName = dayNamesMap[d.getDay()];
    return DOCTORS_SPECIALTIES.filter((doc) => doc.diasAtendimento.includes(dayName));
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const selectedDateAppointments = getAppointmentsForDate(selectedCalendarDate);
  const selectedDateAvailableDoctors = getAvailableDoctorsForDayOfWeek(selectedCalendarDate);

  // Today's appointment for reception selected patient
  const receptionPatientApt = receptionSelectedPatient
    ? appointments.find((a) => a.pacienteId === receptionSelectedPatient.id || a.pacienteCpf === receptionSelectedPatient.cpf)
    : null;

  // Open Encaixe modal pre-filled
  const handleOpenEncaixeForPatient = (patient?: Patient | null) => {
    if (patient) {
      setEncaixePatientId(patient.id);
      setEncaixePatientNome(patient.nome);
      setEncaixePatientCpf(patient.cpf);
      setEncaixePatientTel(patient.telefone);
      setEncaixeForma(patient.tipoAtendimento);
      if (patient.convenioNome) setEncaixeConvenio(patient.convenioNome);
    } else if (patients.length > 0) {
      const p = patients[0];
      setEncaixePatientId(p.id);
      setEncaixePatientNome(p.nome);
      setEncaixePatientCpf(p.cpf);
      setEncaixePatientTel(p.telefone);
    }
    setIsEncaixeModalOpen(true);
  };

  const handleConfirmEncaixe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddAppointment) return;

    const doc = DOCTORS_SPECIALTIES.find((d) => d.id === Number(encaixeDoctorId)) || DOCTORS_SPECIALTIES[0];
    const todayISO = new Date().toISOString().split('T')[0];

    onAddAppointment({
      pacienteId: encaixePatientId || Date.now(),
      pacienteNome: encaixePatientNome || 'Paciente Encaixe',
      pacienteCpf: encaixePatientCpf || '000.000.000-00',
      pacienteTelefone: encaixePatientTel || '(11) 99999-0000',
      medicoId: doc.id,
      medicoNome: doc.nome,
      medicoEspecialidade: doc.especialidade,
      dataHora: `${todayISO}T${encaixeHorario}:00`,
      horario: encaixeHorario,
      duracaoMinutos: 20,
      status: 'confirmada',
      tipo: 'Urgência',
      valor: encaixeValor,
      formaPagamento: encaixeForma,
      convenioNome: encaixeForma === 'convenio' ? encaixeConvenio : undefined,
      observacoes: encaixeObs,
      isEncaixe: true,
    });

    setIsEncaixeModalOpen(false);
    showToast(`⚡ Encaixe de emergência agendado e confirmado para ${encaixePatientNome} com ${doc.nome}!`);
  };

  const handleConfirmDesistencia = () => {
    if (!desistenciaAptId) return;
    const finalReason = customDesistenciaMotivo.trim() || desistenciaMotivo;
    onUpdateStatus(desistenciaAptId, 'cancelada', finalReason);
    setDesistenciaAptId(null);
    setCustomDesistenciaMotivo('');
    showToast(`🚫 Desistência registrada com sucesso. Horário da consulta liberado na agenda.`);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 z-50 animate-bounce">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* RECEPTION PATIENT EVIDENCE BANNER (Modo Atendente de Recepção) */}
      {receptionSelectedPatient && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 border-2 border-[#00A896] shadow-2xl ring-4 ring-teal-500/20 relative overflow-hidden transition-all">
          <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 w-32 h-32 bg-[#00A896]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between gap-4 border-b border-slate-700/80 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-sm font-black text-teal-300 uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                PACIENTE SELECIONADO NA RECEPÇÃO — PAINEL DE ATENDIMENTO
              </h3>
            </div>
            {onClearReceptionPatient && (
              <button
                type="button"
                onClick={onClearReceptionPatient}
                className="text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1 transition-all"
              >
                <X className="w-4 h-4" />
                <span>Fechar Seleção</span>
              </button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Patient Info Card */}
            <div className="flex items-center gap-4">
              <img
                src={
                  receptionSelectedPatient.foto ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'
                }
                alt={receptionSelectedPatient.nome}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-400 shadow-lg shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-black text-white">{receptionSelectedPatient.nome}</h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    CPF: {receptionSelectedPatient.cpf}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Idade: <strong>{receptionSelectedPatient.idade} anos</strong> • Tel: <strong>{receptionSelectedPatient.telefone}</strong> • Atendimento:{' '}
                  <span className="font-bold text-teal-300 uppercase">
                    {receptionSelectedPatient.tipoAtendimento === 'convenio'
                      ? `Convênio (${receptionSelectedPatient.convenioNome})`
                      : 'Particular'}
                  </span>
                </p>

                {/* Status of Today's Appointment */}
                {receptionPatientApt ? (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs font-semibold text-slate-300">Consulta Agendada:</span>
                    <span className="text-xs font-black bg-slate-800 text-teal-300 px-2.5 py-0.5 rounded-lg border border-slate-700">
                      {receptionPatientApt.horario} — {receptionPatientApt.medicoNome} ({receptionPatientApt.medicoEspecialidade})
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        receptionPatientApt.status === 'confirmada'
                          ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/30'
                          : receptionPatientApt.status === 'cancelada'
                          ? 'bg-rose-500/30 text-rose-300 border border-rose-400/30'
                          : 'bg-amber-500/30 text-amber-300 border border-amber-400/30'
                      }`}
                    >
                      Status: {receptionPatientApt.status.toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-amber-300 font-bold flex items-center gap-1 pt-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Nenhum agendamento prévio localizado para este paciente no dia de hoje.</span>
                  </p>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS IN EVIDENCE */}
            <div className="flex items-center gap-3 flex-wrap">
              {receptionPatientApt ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateStatus(receptionPatientApt.id, 'confirmada');
                      showToast(
                        `✅ Presença confirmada! Paciente ${receptionSelectedPatient.nome} deu entrada na recepção e o médico foi notificado.`
                      );
                    }}
                    className={`px-5 py-3 rounded-2xl text-xs font-black shadow-xl flex items-center gap-2 transition-all active:scale-95 ${
                      receptionPatientApt.status === 'confirmada'
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:shadow-emerald-500/20'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>
                      {receptionPatientApt.status === 'confirmada'
                        ? 'PRESENÇA CONFIRMADA NA RECEPÇÃO'
                        : 'CONFIRMAR PRESENÇA NA RECEPÇÃO (CHECK-IN)'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEncaixeForPatient(receptionSelectedPatient)}
                    className="px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>⚡ Novo Encaixe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDesistenciaAptId(receptionPatientApt.id);
                    }}
                    className="px-4 py-3 rounded-2xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95 border border-rose-500/50"
                  >
                    <UserX className="w-4 h-4" />
                    <span>Registrar Desistência</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => handleOpenEncaixeForPatient(receptionSelectedPatient)}
                  className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-xl flex items-center gap-2 transition-all active:scale-95 animate-pulse"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  <span>AGENDAR ENCAIXE DE EMERGÊNCIA AGORA</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header & Action Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              Agenda & Calendário de Consultas
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {filteredAppointments.length} agendamentos no filtro
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gestão de consultas regulares, confirmação de presença na recepção, encaixes de emergência e desistências.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Switcher */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'month'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Visão Mês (Calendário)
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'day'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Lista do Dia
            </button>
          </div>

          {/* Encaixe Button */}
          <button
            onClick={() => handleOpenEncaixeForPatient(receptionSelectedPatient || null)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            title="Inserir agendamento emergencial extra na agenda"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>⚡ Novo Encaixe</span>
          </button>

          {/* Regular Appointment Button */}
          <button
            onClick={onOpenNovaConsulta}
            className="bg-[#00A896] hover:bg-[#009282] text-white text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Agendar Consulta</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por paciente, CPF ou médico..."
            className="w-full bg-slate-50 text-xs text-slate-800 pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
          />
        </div>

        {/* Doctor Filter Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
            <Stethoscope className="w-4 h-4 text-[#00A896]" />
            <span>Médico:</span>
          </div>
          <select
            value={selectedDoctorFilter}
            onChange={(e) => setSelectedDoctorFilter(e.target.value)}
            className="bg-slate-50 text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="todos">Todos os Médicos</option>
            {DOCTORS_SPECIALTIES.map((d) => (
              <option key={d.id} value={d.nome}>
                {d.nome} ({d.especialidade})
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            Status:
          </span>
          {[
            { id: 'all', label: 'Todos' },
            { id: 'confirmada', label: 'Confirmadas' },
            { id: 'agendada', label: 'Agendadas' },
            { id: 'concluida', label: 'Concluídas' },
            { id: 'cancelada', label: 'Desistências/Canc.' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStatus(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === s.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* MONTH CALENDAR VIEW */}
      {viewMode === 'month' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Month Grid (Left 2 Columns) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            {/* Month Navigation Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-[#00A896]" />
                <h3 className="text-lg font-black text-slate-900">
                  {monthNames[currentMonth]} {currentYear}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Mês Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setCurrentYear(2026);
                    setCurrentMonth(7);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-teal-50 text-[#00A896] hover:bg-teal-100 text-xs font-bold transition-colors"
                >
                  Hoje (Agosto 2026)
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Próximo Mês"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of Week Headers */}
            <div className="grid grid-cols-7 gap-1 text-center font-extrabold text-xs text-slate-400 uppercase tracking-wider py-1">
              {daysOfWeekShort.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Month Days Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {calendarCells.map((cell, idx) => {
                if (!cell) {
                  return <div key={`empty-${idx}`} className="h-24 bg-slate-50/40 rounded-2xl" />;
                }

                const dayApts = getAppointmentsForDate(cell.dateStr);
                const isSelected = cell.dateStr === selectedCalendarDate;
                const availableDocs = getAvailableDoctorsForDayOfWeek(cell.dateStr);

                return (
                  <div
                    key={cell.dateStr}
                    onClick={() => setSelectedCalendarDate(cell.dateStr)}
                    className={`h-24 p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#00A896] bg-teal-50/40 shadow-sm ring-2 ring-teal-500/20'
                        : 'border-slate-100 hover:border-slate-300 bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-extrabold w-6 h-6 rounded-full flex items-center justify-center ${
                          cell.dateStr === '2026-08-03'
                            ? 'bg-[#00A896] text-white'
                            : isSelected
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-800'
                        }`}
                      >
                        {cell.day}
                      </span>

                      {dayApts.length > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-100 text-[#00A896]">
                          {dayApts.length}
                        </span>
                      )}
                    </div>

                    {/* Day appointments mini preview */}
                    <div className="space-y-1 overflow-hidden">
                      {dayApts.slice(0, 2).map((a) => (
                        <div
                          key={a.id}
                          className={`text-[10px] truncate px-1.5 py-0.5 rounded font-semibold flex items-center justify-between ${
                            a.isEncaixe
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : a.status === 'confirmada'
                              ? 'bg-emerald-100 text-emerald-900'
                              : a.status === 'cancelada'
                              ? 'bg-rose-100 text-rose-800 line-through'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span>{a.horario}</span>
                          <span className="truncate">{a.pacienteNome.split(' ')[0]}</span>
                        </div>
                      ))}
                      {dayApts.length > 2 && (
                        <span className="text-[9px] text-slate-400 font-bold block">
                          +{dayApts.length - 2} mais
                        </span>
                      )}
                      {dayApts.length === 0 && availableDocs.length > 0 && (
                        <span className="text-[9px] text-[#00A896] font-semibold block truncate">
                          {availableDocs.length} médicos disp.
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Day Details & Doctors Available */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Data Selecionada
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">
                {selectedCalendarDate.split('-').reverse().join('/')}
              </h3>
            </div>

            {/* Doctors Available on this Date */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-[#00A896]" />
                <span>Médicos Disponíveis na Data ({selectedDateAvailableDoctors.length})</span>
              </h4>

              {selectedDateAvailableDoctors.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedDateAvailableDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-800">{doc.nome}</p>
                        <p className="text-[11px] text-[#00A896] font-semibold">{doc.especialidade}</p>
                        <p className="text-[10px] text-slate-400">{doc.horarioAtendimento}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEncaixeDoctorId(doc.id);
                          setIsEncaixeModalOpen(true);
                        }}
                        className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-1 rounded-lg hover:bg-amber-200 transition-colors flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3 text-amber-600" />
                        <span>Encaixe</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Sem escala de médicos cadastrada para este dia.</p>
              )}
            </div>

            <hr className="border-slate-100" />

            {/* Appointments on Selected Date */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Agendamentos ({selectedDateAppointments.length})
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEncaixeForPatient(null)}
                    className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Encaixe</span>
                  </button>
                  <button
                    onClick={onOpenNovaConsulta}
                    className="text-xs font-bold text-[#00A896] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Novo</span>
                  </button>
                </div>
              </div>

              {selectedDateAppointments.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1 divide-y divide-slate-100">
                  {selectedDateAppointments.map((apt) => (
                    <div key={apt.id} className="pt-3 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {apt.horario}
                          </span>
                          {apt.isEncaixe && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-100 text-amber-900 flex items-center gap-1 border border-amber-300">
                              <Zap className="w-3 h-3 fill-current text-amber-600" />
                              ENCAIXE
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            apt.status === 'confirmada'
                              ? 'bg-emerald-100 text-emerald-800'
                              : apt.status === 'cancelada'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {apt.status === 'confirmada' ? 'Presença Confirmada' : apt.status}
                        </span>
                      </div>
                      
                      <p className="font-bold text-slate-900 text-sm flex items-center justify-between">
                        <span>{apt.pacienteNome}</span>
                        <span className="text-[10px] text-slate-400 font-normal">CPF: {apt.pacienteCpf}</span>
                      </p>
                      
                      <p className="text-slate-500 text-[11px]">
                        Médico: <span className="font-semibold text-slate-700">{apt.medicoNome}</span> ({apt.medicoEspecialidade})
                      </p>

                      {apt.motivoDesistencia && (
                        <p className="text-[11px] text-rose-600 font-semibold bg-rose-50 p-1.5 rounded-lg border border-rose-100">
                          Motivo Desistência: {apt.motivoDesistencia}
                        </p>
                      )}

                      {/* Action buttons on card */}
                      <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
                        {apt.status !== 'confirmada' && apt.status !== 'cancelada' && (
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateStatus(apt.id, 'confirmada');
                              showToast(`✅ Presença de ${apt.pacienteNome} confirmada na recepção!`);
                            }}
                            className="text-[11px] font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirmar Presença</span>
                          </button>
                        )}

                        {apt.status !== 'cancelada' && (
                          <button
                            type="button"
                            onClick={() => setDesistenciaAptId(apt.id)}
                            className="text-[11px] font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>Desistência</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleSendWhatsapp(apt)}
                          className="text-[11px] font-bold text-[#00A896] hover:underline"
                        >
                          WhatsApp
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs font-medium text-slate-500">Nenhum agendamento para esta data.</p>
                  <button
                    onClick={onOpenNovaConsulta}
                    className="mt-2 text-xs font-bold text-[#00A896] underline"
                  >
                    Agendar agora
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DAILY TIMELINE LIST VIEW */}
      {viewMode === 'day' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className={`p-5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  receptionSelectedPatient && (receptionSelectedPatient.id === apt.pacienteId || receptionSelectedPatient.cpf === apt.pacienteCpf)
                    ? 'bg-teal-50/60 ring-2 ring-[#00A896]/40'
                    : 'hover:bg-slate-50/80'
                }`}
              >
                {/* Time & Patient Info */}
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 border ${
                    apt.isEncaixe
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : apt.status === 'confirmada'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : apt.status === 'cancelada'
                      ? 'bg-rose-100 text-rose-900 border-rose-300'
                      : 'bg-teal-50 text-teal-800 border-teal-100'
                  }`}>
                    <span className="text-sm font-black">{apt.horario}</span>
                    <span className="text-[10px] font-bold uppercase">
                      {apt.isEncaixe ? 'ENCAIXE' : '30 min'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-black text-slate-900 text-base">
                        {apt.pacienteNome}
                      </h4>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
                        {apt.tipo}
                      </span>
                      {apt.isEncaixe && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <Zap className="w-3 h-3 fill-current text-amber-600" />
                          ENCAIXE DE EMERGÊNCIA
                        </span>
                      )}
                      {apt.status === 'confirmada' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Presença Confirmada (Na Recepção)
                        </span>
                      )}
                      {apt.status === 'cancelada' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                          <UserX className="w-3 h-3 text-rose-600" />
                          Desistência Registrada
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <span>CPF: <strong className="text-slate-800">{apt.pacienteCpf}</strong></span>
                      <span>•</span>
                      <span>Médico: <strong className="text-slate-800">{apt.medicoNome}</strong> ({apt.medicoEspecialidade})</span>
                    </p>

                    <div className="flex items-center gap-2 text-xs pt-0.5">
                      <span className="font-semibold text-slate-700">
                        {apt.formaPagamento === 'convenio'
                          ? `Convênio: ${apt.convenioNome || 'Ativo'}`
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

                    {apt.motivoDesistencia && (
                      <p className="text-xs text-rose-600 font-bold bg-rose-50 p-1.5 rounded-xl border border-rose-100 mt-1">
                        Motivo da Desistência: {apt.motivoDesistencia}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status & Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
                  {/* CONFIRMAR PRESENÇA BUTTON (EVIDÊNCIA PARA RECEPÇÃO) */}
                  {apt.status !== 'confirmada' && apt.status !== 'cancelada' && (
                    <button
                      onClick={() => {
                        onUpdateStatus(apt.id, 'confirmada');
                        showToast(`✅ Presença confirmada! Paciente ${apt.pacienteNome} aguardando atendimento.`);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirmar Presença</span>
                    </button>
                  )}

                  {/* DESISTÊNCIA BUTTON */}
                  {apt.status !== 'cancelada' && (
                    <button
                      onClick={() => setDesistenciaAptId(apt.id)}
                      className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold flex items-center gap-1 transition-colors"
                      title="Registrar desistência do paciente"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Desistência</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleSendWhatsapp(apt)}
                    className="px-3 py-2 rounded-xl bg-teal-50 text-[#00A896] hover:bg-teal-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => onSelectAppointmentForEHR(apt)}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Prontuário</span>
                  </button>

                  <select
                    value={apt.status}
                    onChange={(e) =>
                      onUpdateStatus(apt.id, e.target.value as AppointmentStatus)
                    }
                    className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none appearance-none cursor-pointer border border-slate-200"
                  >
                    <option value="agendada">Agendada</option>
                    <option value="confirmada">Confirmada (Presença)</option>
                    <option value="pendente">Pendente</option>
                    <option value="concluida">Concluída</option>
                    <option value="cancelada">Desistência / Cancelada</option>
                  </select>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <CalendarIcon className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-600">
                Nenhum agendamento encontrado
              </p>
              <p className="text-xs text-slate-400">
                Tente alterar os filtros de busca ou agendar um novo encaixe de emergência.
              </p>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: ENCAIXE DE EMERGÊNCIA */}
      {isEncaixeModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5 fill-current text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Agendar Encaixe de Urgência</h3>
                  <p className="text-xs text-slate-400">Inserir paciente em vaga extra na agenda do médico</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEncaixeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmEncaixe} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Nome do Paciente *
                </label>
                <input
                  type="text"
                  required
                  value={encaixePatientNome}
                  onChange={(e) => setEncaixePatientNome(e.target.value)}
                  placeholder="Nome completo do paciente"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    CPF do Paciente *
                  </label>
                  <input
                    type="text"
                    required
                    value={encaixePatientCpf}
                    onChange={(e) => setEncaixePatientCpf(e.target.value)}
                    placeholder="123.456.789-00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={encaixePatientTel}
                    onChange={(e) => setEncaixePatientTel(e.target.value)}
                    placeholder="(11) 99999-0000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Médico Especialista *
                  </label>
                  <select
                    value={encaixeDoctorId}
                    onChange={(e) => setEncaixeDoctorId(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    {DOCTORS_SPECIALTIES.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nome} ({d.especialidade})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Horário do Encaixe *
                  </label>
                  <input
                    type="text"
                    required
                    value={encaixeHorario}
                    onChange={(e) => setEncaixeHorario(e.target.value)}
                    placeholder="Ex: 14:30"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Forma de Atendimento
                  </label>
                  <select
                    value={encaixeForma}
                    onChange={(e) => setEncaixeForma(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="particular">Particular</option>
                    <option value="convenio">Convênio Médico</option>
                  </select>
                </div>
                {encaixeForma === 'particular' ? (
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Valor da Consulta (R$)
                    </label>
                    <input
                      type="number"
                      value={encaixeValor}
                      onChange={(e) => setEncaixeValor(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Nome do Convênio
                    </label>
                    <input
                      type="text"
                      value={encaixeConvenio}
                      onChange={(e) => setEncaixeConvenio(e.target.value)}
                      placeholder="Ex: Unimed, Bradesco"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Observação do Encaixe
                </label>
                <input
                  type="text"
                  value={encaixeObs}
                  onChange={(e) => setEncaixeObs(e.target.value)}
                  placeholder="Ex: Paciente com dores fortes, encaixe aprovado pelo médico..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEncaixeModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-md flex items-center gap-1.5"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Confirmar Agendamento de Encaixe</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTRAR DESISTÊNCIA */}
      {desistenciaAptId && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <UserX className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900">Registrar Desistência do Paciente</h3>
              </div>
              <button
                type="button"
                onClick={() => setDesistenciaAptId(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Por favor, informe ou selecione o motivo da desistência/cancelamento para atualizar o status e liberar a vaga na agenda:
            </p>

            <div className="space-y-2 text-xs">
              {[
                'Imprevisto pessoal / Desistência sem aviso prévio',
                'Paciente informou problema de transporte',
                'Solicitou reagendamento para outra data',
                'Desistência médica / Sintomas resolvidos',
                'Outro motivo',
              ].map((m) => (
                <label
                  key={m}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                    desistenciaMotivo === m
                      ? 'border-rose-500 bg-rose-50/50 text-rose-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="motivo"
                    checked={desistenciaMotivo === m}
                    onChange={() => setDesistenciaMotivo(m)}
                    className="accent-rose-600"
                  />
                  <span>{m}</span>
                </label>
              ))}

              {desistenciaMotivo === 'Outro motivo' && (
                <input
                  type="text"
                  value={customDesistenciaMotivo}
                  onChange={(e) => setCustomDesistenciaMotivo(e.target.value)}
                  placeholder="Especifique o motivo da desistência..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 mt-2"
                />
              )}
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDesistenciaAptId(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirmDesistencia}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <UserX className="w-4 h-4" />
                <span>Confirmar Desistência</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
