import React, { useState } from 'react';
import { X, Calendar, Clock, User, Plus, Check } from 'lucide-react';
import { Patient, Appointment, AppointmentType, PaymentType } from '../types';

interface NovaConsultaModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  onAddNewPatientClick: () => void;
}

export const NovaConsultaModal: React.FC<NovaConsultaModalProps> = ({
  isOpen,
  onClose,
  patients,
  onAddAppointment,
  onAddNewPatientClick,
}) => {
  if (!isOpen) return null;

  const [selectedPatientId, setSelectedPatientId] = useState<number>(patients[0]?.id || 0);
  const [data, setData] = useState<string>(new Date().toISOString().split('T')[0]);
  const [horario, setHorario] = useState<string>('15:00');
  const [tipo, setTipo] = useState<AppointmentType>('Primeira Consulta');
  const [formaPagamento, setFormaPagamento] = useState<PaymentType>('particular');
  const [convenioNome, setConvenioNome] = useState<string>('Unimed');
  const [valor, setValor] = useState<number>(350);
  const [observacoes, setObservacoes] = useState<string>('');

  const selectedPatient = patients.find((p) => p.id === Number(selectedPatientId));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    onAddAppointment({
      pacienteId: selectedPatient.id,
      pacienteNome: selectedPatient.nome,
      pacienteCpf: selectedPatient.cpf,
      pacienteTelefone: selectedPatient.telefone,
      medicoId: 1,
      medicoNome: 'Dr. Silva',
      medicoEspecialidade: 'Cardiologia',
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
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Agendar Nova Consulta</h3>
              <p className="text-xs text-teal-100">Preencha os dados do atendimento</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Patient Select */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Selecione o Paciente *
              </label>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAddNewPatientClick();
                }}
                className="text-xs font-bold text-[#00A896] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Novo Paciente
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
      </div>
    </div>
  );
};
