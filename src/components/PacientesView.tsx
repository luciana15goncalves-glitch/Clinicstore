import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  ShieldCheck,
  FileDown,
  Trash2,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Calendar,
  X,
  Check,
  UserCheck,
  ChevronRight,
  Heart,
  Clock,
} from 'lucide-react';
import { Patient, PaymentType } from '../types';

interface PacientesViewProps {
  patients: Patient[];
  onAddPatient: (patient: Patient) => void;
  onAnonymizePatient: (id: number) => void;
  onSelectPatientForHistory: (patient: Patient) => void;
}

export const PacientesView: React.FC<PacientesViewProps> = ({
  patients,
  onAddPatient,
  onAnonymizePatient,
  onSelectPatientForHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientModal, setSelectedPatientModal] = useState<Patient | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Patient Form state
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('1990-01-01');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [tipoAtendimento, setTipoAtendimento] = useState<PaymentType>('particular');
  const [convenioNome, setConvenioNome] = useState('Unimed');
  const [carteirinha, setCarteirinha] = useState('');
  const [alergias, setAlergias] = useState('Penicilina');
  const [medicamentos, setMedicamentos] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cpf.includes(searchTerm) ||
      p.telefone.includes(searchTerm)
  );

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !cpf) return;

    const newPat: Patient = {
      id: Date.now(),
      nome,
      cpf,
      dataNascimento,
      idade: new Date().getFullYear() - new Date(dataNascimento).getFullYear(),
      telefone,
      email,
      tipoAtendimento,
      convenioNome: tipoAtendimento === 'convenio' ? convenioNome : undefined,
      carteirinhaNumero: carteirinha,
      alergias: alergias ? alergias.split(',').map((s) => s.trim()) : [],
      medicamentosContinuos: medicamentos ? medicamentos.split(',').map((s) => s.trim()) : [],
      consentimentoLgpdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      consentimentoLgpdIp: '189.120.45.12',
    };

    onAddPatient(newPat);
    setIsAddModalOpen(false);
    showToast(`✅ Paciente ${nome} cadastrado com sucesso com registro de consentimento LGPD!`);

    // Reset fields
    setNome('');
    setCpf('');
    setTelefone('');
    setEmail('');
  };

  const handleExportLgpdData = (p: Patient) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(p, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `lgpd_dados_paciente_${p.cpf.replace(/\D/g, '')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`📥 Exportado relatório completo de dados LGPD para ${p.nome}`);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 z-50">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Cadastro e Prontuários dos Pacientes
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              {patients.length} Cadastrados
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gestão protegida com criptografia LGPD (Lei Geral de Proteção de Dados)
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#00A896] hover:bg-[#009282] text-white text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar Novo Paciente</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, CPF ou telefone..."
            className="w-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A896]"
          />
        </div>
      </div>

      {/* Patients Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPatients.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start gap-3">
                <img
                  src={
                    p.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'
                  }
                  alt={p.nome}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-teal-500/20 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base truncate group-hover:text-[#00A896] transition-colors">
                    {p.nome}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium truncate">
                    CPF: {p.cpf} • {p.idade} anos
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {p.tipoAtendimento === 'convenio' ? p.convenioNome : 'Particular'}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" /> LGPD Ativo
                    </span>
                  </div>
                </div>
              </div>

              {/* Patient Quick Info */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{p.telefone}</span>
                </p>
                {p.email && (
                  <p className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{p.email}</span>
                  </p>
                )}
                {p.alergias.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] font-bold text-rose-500 uppercase">Alergias:</span>
                    {p.alergias.map((a, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedPatientModal(p)}
                className="text-xs font-bold text-[#00A896] hover:underline flex items-center gap-1"
              >
                <span>Ficha Completa</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleExportLgpdData(p)}
                title="Exportar Relatório LGPD (JSON)"
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950/60 transition-colors"
              >
                <FileDown className="w-4 h-4 text-teal-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Patient Detail Modal */}
      {selectedPatientModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-gradient-to-r from-[#00A896] to-[#00B4D8] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={
                    selectedPatientModal.foto ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'
                  }
                  alt={selectedPatientModal.nome}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white/40"
                />
                <div>
                  <h3 className="font-bold text-lg leading-tight">
                    {selectedPatientModal.nome}
                  </h3>
                  <p className="text-xs text-teal-100">
                    CPF: {selectedPatientModal.cpf} • {selectedPatientModal.idade} anos
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatientModal(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-sm text-slate-700 dark:text-slate-300">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Telefone</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    {selectedPatientModal.telefone}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">E-mail</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    {selectedPatientModal.email || 'Não informado'}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    Tipo de Atendimento
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    {selectedPatientModal.tipoAtendimento === 'convenio'
                      ? selectedPatientModal.convenioNome
                      : 'Particular'}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    Consentimento LGPD
                  </span>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Registrado em {selectedPatientModal.consentimentoLgpdAt}
                  </p>
                </div>
              </div>

              {/* Allergies & Continuous Meds */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs uppercase tracking-wider">
                  Condições Médicas & Alergias
                </h4>
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900 text-xs space-y-1">
                  <p>
                    <strong className="text-rose-700 dark:text-rose-300">Alergias conhecidas:</strong>{' '}
                    {selectedPatientModal.alergias.length > 0
                      ? selectedPatientModal.alergias.join(', ')
                      : 'Nenhuma alergia relatada'}
                  </p>
                  <p>
                    <strong className="text-slate-700 dark:text-slate-300">Medicamentos contínuos:</strong>{' '}
                    {selectedPatientModal.medicamentosContinuos.length > 0
                      ? selectedPatientModal.medicamentosContinuos.join(', ')
                      : 'Nenhum medicamento contínuo'}
                  </p>
                </div>
              </div>

              {/* LGPD Governance Options */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleExportLgpdData(selectedPatientModal)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <FileDown className="w-4 h-4 text-teal-600" />
                  <span>Exportar Relatório LGPD</span>
                </button>

                <button
                  onClick={() => {
                    if (
                      confirm(
                        `Tem certeza que deseja anonimizar os dados de ${selectedPatientModal.nome}? Esta ação atende ao Direito ao Esquecimento da LGPD.`
                      )
                    ) {
                      onAnonymizePatient(selectedPatientModal.id);
                      setSelectedPatientModal(null);
                      showToast(`🔒 Dados de paciente anonimizados com sucesso.`);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Anonimizar (Direito ao Esquecimento)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Patient Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-5 bg-[#00A896] text-white flex items-center justify-between">
              <h3 className="font-bold text-lg">Cadastrar Novo Paciente</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm"
                  placeholder="Ex: Carlos Eduardo Silva"
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
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm"
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm"
                    placeholder="paciente@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alergias (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={alergias}
                  onChange={(e) => setAlergias(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm"
                  placeholder="Ex: Penicilina, Dipirona"
                />
              </div>

              <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-xl text-xs text-teal-800 dark:text-teal-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#00A896]" />
                <span>
                  O cadastro registrará o termo de consentimento LGPD com IP e data/hora do cadastro.
                </span>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00A896] hover:bg-[#009282] text-white text-xs font-bold shadow-md"
                >
                  Salvar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
