import React, { useState } from 'react';
import { X, Calendar, Clock, User, Plus, Check, UserPlus, ArrowLeft, ShieldCheck, Stethoscope } from 'lucide-react';
import { Patient, Appointment, AppointmentType, PaymentType, DoctorSpecialty } from '../types';
import { DOCTORS_SPECIALTIES } from '../data/mockData';

interface NovaConsultaModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  doctors?: DoctorSpecialty[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  onAddNewPatientClick?: () => void;
  onAddPatient?: (patient: Patient) => void;
}

export const NovaConsultaModal: React.FC<NovaConsultaModalProps> = ({
  isOpen,
  onClose,
  patients,
  doctors,
  onAddAppointment,
  onAddNewPatientClick,
  onAddPatient,
}) => {
  if (!isOpen) return null;

  const doctorList = doctors && doctors.length > 0 ? doctors : DOCTORS_SPECIALTIES;

  const [selectedPatientId, setSelectedPatientId] = useState<number>(patients[0]?.id || 0);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number>(doctorList[0]?.id || 1);
  const [data, setData] = useState<string>(new Date().toISOString().split('T')[0]);
  const [horario, setHorario] = useState<string>('15:00');
  const [tipo, setTipo] = useState<AppointmentType>('Primeira Consulta');
  const [formaPagamento, setFormaPagamento] = useState<PaymentType>('particular');
  const [convenioNome, setConvenioNome] = useState<string>('Unimed');
  const [valor, setValor] = useState<number>(doctorList[0]?.valorConsulta || 350);
  const [observacoes, setObservacoes] = useState<string>('');

  // Mode state: quick patient creation form
  const [isCreatingPatient, setIsCreatingPatient] = useState<boolean>(false);
  const [newNome, setNewNome] = useState<string>('');
  const [newCpf, setNewCpf] = useState<string>('');
  const [newTelefone, setNewTelefone] = useState<string>('');
  const [newIdade, setNewIdade] = useState<number>(32);
  const [newDataNasc, setNewDataNasc] = useState<string>('1994-05-10');
  const [newTipo, setNewTipo] = useState<PaymentType>('particular');
  const [newConvenio, setNewConvenio] = useState<string>('Unimed');
  const [newConsentimento, setNewConsentimento] = useState<boolean>(true);

  const selectedPatient = patients.find((p) => p.id === Number(selectedPatientId));
  const selectedDoctor = doctorList.find((d) => d.id === Number(selectedDoctorId)) || doctorList[0];

  const handleCreatePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNome.trim() || !newCpf.trim()) return;

    const createdPatient: Patient = {
      id: Date.now(),
      nome: newNome.trim(),
      cpf: newCpf.trim(),
      telefone: newTelefone.trim() || '(11) 99999-0000',
      dataNascimento: newDataNasc,
      idade: Number(newIdade) || 30,
      tipoAtendimento: newTipo,
      convenioNome: newTipo === 'convenio' ? newConvenio : undefined,
      consentimentoLgpdAt: new Date().toISOString(),
      consentimentoLgpdIp: '189.120.45.12',
      alergias: [],
      medicamentosContinuos: [],
    };

    if (onAddPatient) {
      onAddPatient(createdPatient);
    }

    setSelectedPatientId(createdPatient.id);
    setFormaPagamento(newTipo);
    if (newTipo === 'convenio') setConvenioNome(newConvenio);
    setIsCreatingPatient(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    onAddAppointment({
      pacienteId: selectedPatient.id,
      pacienteNome: selectedPatient.nome,
      pacienteCpf: selectedPatient.cpf,
      pacienteTelefone: selectedPatient.telefone,
      medicoId: selectedDoctor?.id || 1,
      medicoNome: selectedDoctor?.nome || 'Dr. Fernando Silva',
      medicoEspecialidade: selectedDoctor?.especialidade || 'Cardiologia',
      dataHora: `${data}T${horario}:00`,
      horario,
      duracaoMinutos: 30,
      status: 'agendada',
      tipo,
      valor: Number(valor),
      formaPagamento,
      convenioNome: formaPagamento === 'convenio' ? convenioNome : undefined,
      observacoes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-[#00A896] to-[#00B4D8] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              {isCreatingPatient ? <UserPlus className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {isCreatingPatient ? 'Cadastrar Novo Paciente' : 'Agendar Nova Consulta'}
              </h3>
              <p className="text-xs text-teal-100">
                {isCreatingPatient
                  ? 'Insira os dados do paciente para liberar o agendamento'
                  : 'Preencha os dados do atendimento'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {isCreatingPatient ? (
          /* FORMULARIO DE CADASTRO RAPIDO DE NOVO PACIENTE */
          <form onSubmit={handleCreatePatientSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Dados Básicos do Paciente
              </span>
              <button
                type="button"
                onClick={() => setIsCreatingPatient(false)}
                className="text-xs font-bold text-[#00A896] hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar ao Agendamento</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nome Completo do Paciente *
              </label>
              <input
                type="text"
                required
                value={newNome}
                onChange={(e) => setNewNome(e.target.value)}
                placeholder="Ex: Maria Oliveira Santos"
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  CPF *
                </label>
                <input
                  type="text"
                  required
                  value={newCpf}
                  onChange={(e) => setNewCpf(e.target.value)}
                  placeholder="123.456.789-00"
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  value={newTelefone}
                  onChange={(e) => setNewTelefone(e.target.value)}
                  placeholder="(11) 99876-5432"
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Idade (anos)
                </label>
                <input
                  type="number"
                  value={newIdade}
                  onChange={(e) => setNewIdade(Number(e.target.value))}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={newDataNasc}
                  onChange={(e) => setNewDataNasc(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tipo de Atendimento
                </label>
                <select
                  value={newTipo}
                  onChange={(e) => setNewTipo(e.target.value as PaymentType)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                >
                  <option value="particular">Particular</option>
                  <option value="convenio">Convênio Médico</option>
                </select>
              </div>

              {newTipo === 'convenio' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nome do Convênio
                  </label>
                  <input
                    type="text"
                    value={newConvenio}
                    onChange={(e) => setNewConvenio(e.target.value)}
                    placeholder="Unimed, Bradesco..."
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                  />
                </div>
              )}
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <label className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newConsentimento}
                    onChange={(e) => setNewConsentimento(e.target.checked)}
                    className="rounded border-emerald-400 text-[#00A896] focus:ring-[#00A896]"
                  />
                  <span>Consentimento LGPD Ativo</span>
                </label>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                  Paciente autoriza coleta de dados cadastrais conforme termos da clínica.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreatingPatient(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#00A896] hover:bg-[#009282] text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Salvar e Selecionar para Agendamento</span>
              </button>
            </div>
          </form>
        ) : (
          /* FORMULARIO DE CONSULTA */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Patient Select */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Selecione o Paciente *
                </label>
                <button
                  type="button"
                  onClick={() => setIsCreatingPatient(true)}
                  className="text-xs font-bold text-[#00A896] hover:underline flex items-center gap-1 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-lg border border-teal-200/60"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Novo Paciente</span>
                </button>
              </div>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(Number(e.target.value))}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} — CPF: {p.cpf}
                  </option>
                ))}
              </select>
            </div>

            {/* Specialist / Doctor Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-[#00A896]" />
                <span>Selecione o Especialista / Médico *</span>
              </label>
              <select
                value={selectedDoctorId}
                onChange={(e) => {
                  const docId = Number(e.target.value);
                  setSelectedDoctorId(docId);
                  const doc = doctorList.find((d) => d.id === docId);
                  if (doc && formaPagamento === 'particular') {
                    setValor(doc.valorConsulta);
                  }
                }}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
              >
                {doctorList.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.nome} — {doc.especialidade} ({doc.crm})
                  </option>
                ))}
              </select>
              {selectedDoctor && (
                <div className="mt-1.5 px-3 py-2 bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800/60 rounded-xl flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#00A896] dark:text-teal-400">{selectedDoctor.especialidade}</span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-slate-500 dark:text-slate-400">{selectedDoctor.consultorio}</span>
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    R$ {selectedDoctor.valorConsulta}
                  </span>
                </div>
              )}
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Data do Atendimento
                </label>
                <input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Horário
                </label>
                <input
                  type="time"
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                  required
                />
              </div>
            </div>

            {/* Type & Payment Mode */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tipo de Consulta
                </label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as AppointmentType)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                >
                  <option value="Primeira Consulta">Primeira Consulta</option>
                  <option value="Retorno">Retorno</option>
                  <option value="Urgência">Urgência</option>
                  <option value="Teleconsulta">Teleconsulta</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Modalidade de Pagamento
                </label>
                <select
                  value={formaPagamento}
                  onChange={(e) => setFormaPagamento(e.target.value as PaymentType)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                >
                  <option value="particular">Particular</option>
                  <option value="convenio">Convênio Médico</option>
                </select>
              </div>
            </div>

            {/* Convenio Name (if applicable) & Price */}
            <div className="grid grid-cols-2 gap-3">
              {formaPagamento === 'convenio' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nome do Convênio
                  </label>
                  <input
                    type="text"
                    value={convenioNome}
                    onChange={(e) => setConvenioNome(e.target.value)}
                    placeholder="Ex: Unimed, Bradesco"
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    value={valor}
                    onChange={(e) => setValor(Number(e.target.value))}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Duração Prevista
                </label>
                <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm text-slate-600 dark:text-slate-300 font-medium">
                  30 minutos
                </div>
              </div>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Observações Médicas / Motivo
              </label>
              <textarea
                rows={2}
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Ex: Retorno de exames, dor torácica, checkup..."
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
              />
            </div>

            {/* Modal Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#00A896] hover:bg-[#009282] text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar Agendamento</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

