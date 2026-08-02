import React, { useState } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  Plus,
  Trash2,
  Printer,
  ShieldCheck,
  User,
  HeartPulse,
  Save,
  AlertTriangle,
  Stethoscope,
} from 'lucide-react';
import {
  Appointment,
  Patient,
  MedicalRecord,
  PrescriptionItem,
  CID10Item,
  UserProfile,
} from '../types';
import { CID10_DATABASE } from '../data/mockData';
import { PrescriptionPdfModal } from './PrescriptionPdfModal';

interface ProntuarioViewProps {
  selectedAppointment: Appointment | null;
  appointments: Appointment[];
  patients: Patient[];
  records: MedicalRecord[];
  doctor: UserProfile;
  onSaveRecord: (record: MedicalRecord) => void;
}

export const ProntuarioView: React.FC<ProntuarioViewProps> = ({
  selectedAppointment,
  appointments,
  patients,
  records,
  doctor,
  onSaveRecord,
}) => {
  const [activeAptId, setActiveAptId] = useState<number>(
    selectedAppointment?.id || appointments[0]?.id || 0
  );

  const currentApt = appointments.find((a) => a.id === Number(activeAptId)) || appointments[0];
  const currentPatient = patients.find((p) => p.id === currentApt?.pacienteId) || patients[0];
  const existingRecord = records.find((r) => r.consultaId === currentApt?.id);

  // SOAP Form State
  const [subjetivo, setSubjetivo] = useState(
    existingRecord?.subjetivo || 'Paciente relata dores torácicas leves e tonturas ocasionais ao levantar.'
  );
  const [objetivo, setObjetivo] = useState(
    existingRecord?.objetivo || 'PA: 130/85 mmHg, FC: 78 bpm. Ausculta cardíaca normal em 2 tempos, sem sopros.'
  );
  const [avaliacao, setAvaliacao] = useState(
    existingRecord?.avaliacao || 'Suspeita de hipertensão arterial estágio 1 em investigação.'
  );
  const [plano, setPlano] = useState(
    existingRecord?.plano || 'Prescrição de anti-hipertensivo leve e solicitação de ECG e Holter 24h.'
  );

  // CID-10 State
  const [cidSearch, setCidSearch] = useState('');
  const [selectedCid, setSelectedCid] = useState<CID10Item>({
    codigo: existingRecord?.cid10Codigo || 'I10',
    descricao: existingRecord?.cid10Descricao || 'Hipertensão essencial (primária)',
  });

  // Prescriptions State
  const [prescricoes, setPrescricoes] = useState<PrescriptionItem[]>(
    existingRecord?.prescricoes || [
      {
        id: '1',
        medicamento: 'Losartana Potássica',
        principioAtivo: 'Losartana Potássica',
        dosagem: '50mg',
        via: 'Oral',
        frequencia: '1x ao dia pela manhã',
        duracao: '30 dias',
        quantidade: 1,
      },
    ]
  );

  // New Prescription Line State
  const [medNome, setMedNome] = useState('');
  const [medDosagem, setMedDosagem] = useState('50mg');
  const [medVia, setMedVia] = useState('Oral');
  const [medFreq, setMedFreq] = useState('1x ao dia');
  const [medDur, setMedDur] = useState('30 dias');
  const [medQtd, setMedQtd] = useState(1);

  const [isSigned, setIsSigned] = useState(existingRecord?.assinado || false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredCid = cidSearch.trim()
    ? CID10_DATABASE.filter(
        (c) =>
          c.codigo.toLowerCase().includes(cidSearch.toLowerCase()) ||
          c.descricao.toLowerCase().includes(cidSearch.toLowerCase())
      )
    : [];

  const handleAddPrescription = () => {
    if (!medNome) return;
    const newItem: PrescriptionItem = {
      id: Date.now().toString(),
      medicamento: medNome,
      dosagem: medDosagem,
      via: medVia,
      frequencia: medFreq,
      duracao: medDur,
      quantidade: medQtd,
    };
    setPrescricoes([...prescricoes, newItem]);
    setMedNome('');
  };

  const handleRemovePrescription = (id: string) => {
    setPrescricoes(prescricoes.filter((p) => p.id !== id));
  };

  const handleSaveAndSign = () => {
    if (!currentApt || !currentPatient) return;

    const recordToSave: MedicalRecord = {
      id: existingRecord?.id || Date.now(),
      consultaId: currentApt.id,
      pacienteId: currentPatient.id,
      medicoId: doctor.id,
      dataHora: new Date().toISOString(),
      subjetivo,
      objetivo,
      avaliacao,
      plano,
      cid10Codigo: selectedCid.codigo,
      cid10Descricao: selectedCid.descricao,
      prescricoes,
      assinado: true,
      assinadoEm: new Date().toLocaleString('pt-BR'),
    };

    onSaveRecord(recordToSave);
    setIsSigned(true);
    setToastMsg('✍️ Prontuário salvo e assinado digitalmente com carimbo ICP-Brasil!');
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto relative">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 z-50">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Prontuário Eletrônico (SOAP) & Prescrição
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-[#00A896] dark:bg-teal-950 dark:text-teal-400">
              Assinatura Digital Ativa
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Registro estruturado de anamnese, exame físico, diagnóstico CID-10 e prescrição
          </p>
        </div>

        {/* Appointment Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400">Consulta:</span>
          <select
            value={activeAptId}
            onChange={(e) => setActiveAptId(Number(e.target.value))}
            className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
          >
            {appointments.map((apt) => (
              <option key={apt.id} value={apt.id}>
                {apt.horario} — {apt.pacienteNome} ({apt.tipo})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Patient Banner */}
      {currentPatient && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={
                currentPatient.foto ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'
              }
              alt={currentPatient.nome}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-teal-400/40 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">{currentPatient.nome}</h3>
                <span className="text-xs bg-teal-500/30 text-teal-200 px-2.5 py-0.5 rounded-full font-semibold">
                  CPF: {currentPatient.cpf}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Idade: {currentPatient.idade} anos • Tel: {currentPatient.telefone} • {currentPatient.tipoAtendimento === 'convenio' ? currentPatient.convenioNome : 'Particular'}
              </p>
              {currentPatient.alergias.length > 0 && (
                <p className="text-xs text-rose-300 font-bold mt-1">
                  ⚠️ ALERGIAS: {currentPatient.alergias.join(', ')}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPdfModal(true)}
              className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Gerar Receituário PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* SOAP EDITOR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subjetivo (S) & Objetivo (O) */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 font-black flex items-center justify-center text-xs">
                S
              </span>
              Subjetivo (Anamnese / Queixa Principal)
            </label>
            <textarea
              rows={4}
              value={subjetivo}
              onChange={(e) => setSubjetivo(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-xs">
                O
              </span>
              Objetivo (Exame Físico / Sinais Vitais)
            </label>
            <textarea
              rows={4}
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
            />
          </div>
        </div>

        {/* Avaliação (A) - CID-10 & Plano (P) */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 font-black flex items-center justify-center text-xs">
                A
              </span>
              Avaliação & Hipótese Diagnóstica (CID-10)
            </label>

            {/* CID-10 Selected Badge */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900 mb-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-amber-800 dark:text-amber-300">
                  CID-10 Selecionado: {selectedCid.codigo}
                </span>
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  {selectedCid.descricao}
                </p>
              </div>
            </div>

            {/* CID-10 Search input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={cidSearch}
                onChange={(e) => setCidSearch(e.target.value)}
                placeholder="Buscar código ou descrição CID-10..."
                className="w-full bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
              {filteredCid.length > 0 && (
                <div className="absolute left-0 right-0 top-10 bg-white dark:bg-slate-800 border rounded-xl shadow-xl z-20 max-h-40 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredCid.map((c) => (
                    <button
                      key={c.codigo}
                      type="button"
                      onClick={() => {
                        setSelectedCid(c);
                        setCidSearch('');
                      }}
                      className="w-full text-left p-2.5 text-xs hover:bg-teal-50 dark:hover:bg-slate-700 flex items-center justify-between"
                    >
                      <span className="font-bold text-[#00A896]">{c.codigo}</span>
                      <span className="text-slate-600 dark:text-slate-300 truncate max-w-xs">
                        {c.descricao}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <textarea
              rows={2}
              value={avaliacao}
              onChange={(e) => setAvaliacao(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-lg bg-teal-100 text-[#00A896] font-black flex items-center justify-center text-xs">
                P
              </span>
              Plano Terapêutico & Orientações
            </label>
            <textarea
              rows={3}
              value={plano}
              onChange={(e) => setPlano(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
            />
          </div>
        </div>
      </div>

      {/* PRESCRIPTION BUILDER SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-[#00A896]" />
          <span>Prescrição Médica Eletrônica</span>
        </h3>

        {/* Add Drug Line */}
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Medicamento *
            </label>
            <input
              type="text"
              value={medNome}
              onChange={(e) => setMedNome(e.target.value)}
              placeholder="Ex: Atenolol"
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Dosagem
            </label>
            <input
              type="text"
              value={medDosagem}
              onChange={(e) => setMedDosagem(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Frequência
            </label>
            <input
              type="text"
              value={medFreq}
              onChange={(e) => setMedFreq(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Duração
            </label>
            <input
              type="text"
              value={medDur}
              onChange={(e) => setMedDur(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleAddPrescription}
              className="w-full bg-[#00A896] hover:bg-[#009282] text-white text-xs font-bold p-2.5 rounded-xl flex items-center justify-center gap-1 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar</span>
            </button>
          </div>
        </div>

        {/* Prescription List */}
        <div className="space-y-2">
          {prescricoes.map((p, idx) => (
            <div
              key={p.id || idx}
              className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  {idx + 1}. {p.medicamento} {p.dosagem}
                </span>
                <p className="text-slate-500 dark:text-slate-400">
                  Uso {p.via} — {p.frequencia} por {p.duracao} (Qtd: {p.quantidade})
                </p>
              </div>
              <button
                onClick={() => handleRemovePrescription(p.id)}
                className="text-rose-500 hover:text-rose-700 p-1 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Save & Sign Controls */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
            {isSigned ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Prontuário assinado digitalmente pelo {doctor.crm}</span>
              </>
            ) : (
              <span className="text-amber-600">
                ⚠️ Alterações pendentes de assinatura
              </span>
            )}
          </div>

          <button
            onClick={handleSaveAndSign}
            className="px-6 py-3 rounded-2xl bg-[#00A896] hover:bg-[#009282] text-white text-xs font-bold shadow-lg flex items-center gap-2 transition-all active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Salvar & Assinar Prontuário</span>
          </button>
        </div>
      </div>

      {/* PDF Printable Modal */}
      <PrescriptionPdfModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        record={{
          id: existingRecord?.id || Date.now(),
          consultaId: currentApt?.id || 0,
          pacienteId: currentPatient?.id || 0,
          medicoId: doctor.id,
          dataHora: new Date().toISOString(),
          subjetivo,
          objetivo,
          avaliacao,
          plano,
          cid10Codigo: selectedCid.codigo,
          cid10Descricao: selectedCid.descricao,
          prescricoes,
          assinado: true,
        }}
        patient={currentPatient}
        doctor={doctor}
      />
    </div>
  );
};
