import React, { useState, useEffect } from 'react';
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
  Clock,
  ChevronDown,
  ChevronUp,
  Activity,
  FileSpreadsheet,
  TestTube,
  FileSearch,
} from 'lucide-react';
import {
  Appointment,
  Patient,
  MedicalRecord,
  PrescriptionItem,
  ExamRequestItem,
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
  // Active Selected Patient State
  const [selectedPatientId, setSelectedPatientId] = useState<number>(
    selectedAppointment?.pacienteId || patients[0]?.id || 101
  );

  const [patientSearch, setPatientSearch] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  // Sync selected patient when prop changes
  useEffect(() => {
    if (selectedAppointment) {
      setSelectedPatientId(selectedAppointment.pacienteId);
      setActiveAptId(selectedAppointment.id);
    }
  }, [selectedAppointment]);

  const currentPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Appointments for selected patient
  const patientAppointments = appointments.filter((a) => a.pacienteId === currentPatient?.id);

  const [activeAptId, setActiveAptId] = useState<number>(
    selectedAppointment?.id || patientAppointments[0]?.id || appointments[0]?.id || 0
  );

  const currentApt =
    appointments.find((a) => a.id === Number(activeAptId)) ||
    patientAppointments[0] ||
    appointments[0];

  const existingRecord = records.find(
    (r) => r.consultaId === currentApt?.id || (r.pacienteId === currentPatient?.id && r.assinado)
  );

  // Historical Records for this patient
  const patientRecords = records.filter((r) => r.pacienteId === currentPatient?.id);

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

  // Exam Requests State
  const [solicitaExames, setSolicitaExames] = useState<boolean>(
    existingRecord?.solicitaExames ?? true
  );
  const [examesSolicitados, setExamesSolicitados] = useState<ExamRequestItem[]>(
    existingRecord?.examesSolicitados || [
      {
        id: 'e1',
        nomeExame: 'Ecocardiograma Transtorácico com Doppler em Cores',
        categoria: 'Cardiologia',
        indicacaoClinica: 'Avaliação de função ventricular e morfologia valvar',
        urgente: false,
      },
      {
        id: 'e2',
        nomeExame: 'Holter 24 Horas de 3 Canais',
        categoria: 'Cardiologia',
        indicacaoClinica: 'Mapeamento de arritmias e extrassístoles',
        urgente: false,
      },
    ]
  );

  const [exameNome, setExameNome] = useState('');
  const [exameCategoria, setExameCategoria] = useState('Cardiologia');
  const [exameIndicacao, setExameIndicacao] = useState('');
  const [exameUrgente, setExameUrgente] = useState(false);
  const [orientacoesExames, setOrientacoesExames] = useState(
    existingRecord?.orientacoesExames ||
      'Jejum absoluto de 8 horas para exames laboratoriais. Manter uso dos medicamentos contínuos.'
  );

  const [isSigned, setIsSigned] = useState(existingRecord?.assinado || false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Accordion for Historical Consultations
  const [expandedRecordId, setExpandedRecordId] = useState<number | null>(
    patientRecords[0]?.id || null
  );

  // Sync state when patient changes
  useEffect(() => {
    if (currentPatient) {
      const rec = records.find((r) => r.pacienteId === currentPatient.id);
      if (rec) {
        setSubjetivo(rec.subjetivo);
        setObjetivo(rec.objetivo);
        setAvaliacao(rec.avaliacao);
        setPlano(rec.plano);
        setSelectedCid({
          codigo: rec.cid10Codigo || 'I10',
          descricao: rec.cid10Descricao || 'Hipertensão essencial (primária)',
        });
        setPrescricoes(rec.prescricoes || []);
        if (rec.solicitaExames !== undefined) setSolicitaExames(rec.solicitaExames);
        if (rec.examesSolicitados) setExamesSolicitados(rec.examesSolicitados);
        if (rec.orientacoesExames) setOrientacoesExames(rec.orientacoesExames);
        setIsSigned(rec.assinado);
      }
    }
  }, [selectedPatientId, records]);

  const filteredPatientsSearch = patientSearch.trim()
    ? patients.filter(
        (p) =>
          p.nome.toLowerCase().includes(patientSearch.toLowerCase()) ||
          p.cpf.includes(patientSearch)
      )
    : [];

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

  const handleAddExam = () => {
    if (!exameNome.trim()) return;
    const newExam: ExamRequestItem = {
      id: Date.now().toString(),
      nomeExame: exameNome.trim(),
      categoria: exameCategoria,
      indicacaoClinica: exameIndicacao.trim(),
      urgente: exameUrgente,
    };
    setExamesSolicitados([...examesSolicitados, newExam]);
    setExameNome('');
    setExameIndicacao('');
    setExameUrgente(false);
  };

  const handleQuickAddExam = (nome: string, cat: string = 'Cardiologia') => {
    if (examesSolicitados.some((e) => e.nomeExame.toLowerCase() === nome.toLowerCase())) return;
    const newExam: ExamRequestItem = {
      id: Date.now().toString(),
      nomeExame: nome,
      categoria: cat,
      indicacaoClinica: `Investigação clínica cardiológica - Dra(o) ${doctor.nome}`,
      urgente: false,
    };
    setExamesSolicitados([...examesSolicitados, newExam]);
  };

  const handleRemoveExam = (id: string) => {
    setExamesSolicitados(examesSolicitados.filter((e) => e.id !== id));
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
      solicitaExames,
      examesSolicitados: solicitaExames ? examesSolicitados : [],
      orientacoesExames: solicitaExames ? orientacoesExames : '',
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

      {/* Top Header & Direct Patient Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Prontuário Eletrônico (SOAP), Prescrição & Exames
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-[#00A896] dark:bg-teal-950 dark:text-teal-400">
                Assinatura Digital Ativa
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Consulte histórico de consultas, diagnósticos CID-10, prescrições e solicitação de exames do especialista.
            </p>
          </div>

          {/* Quick Consultation Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">Consulta:</span>
            <select
              value={activeAptId}
              onChange={(e) => {
                const id = Number(e.target.value);
                setActiveAptId(id);
                const apt = appointments.find((a) => a.id === id);
                if (apt) setSelectedPatientId(apt.pacienteId);
              }}
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

        {/* Dedicated Patient Search Input (Nome ou CPF) */}
        <div className="relative pt-2">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1.5">
            <FileSearch className="w-3.5 h-3.5 text-teal-600" />
            <span>Buscar Prontuário por Nome ou CPF do Paciente:</span>
          </label>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={patientSearch}
              onChange={(e) => {
                setPatientSearch(e.target.value);
                setShowPatientDropdown(true);
              }}
              onFocus={() => setShowPatientDropdown(true)}
              placeholder="Digite o nome completo ou CPF do paciente (ex: 123.456.789-00 ou Maria)..."
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
            />
          </div>

          {showPatientDropdown && patientSearch.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
              {filteredPatientsSearch.length > 0 ? (
                filteredPatientsSearch.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedPatientId(p.id);
                      setPatientSearch('');
                      setShowPatientDropdown(false);
                      const apt = appointments.find((a) => a.pacienteId === p.id);
                      if (apt) setActiveAptId(apt.id);
                    }}
                    className="w-full text-left p-3 hover:bg-teal-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors"
                  >
                    <img
                      src={
                        p.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
                      }
                      alt={p.nome}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {p.nome}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        CPF: <span className="font-semibold text-teal-600">{p.cpf}</span> • {p.idade} anos • {p.telefone}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-3 text-xs text-slate-400 text-center">
                  Nenhum paciente encontrado com esse Nome ou CPF.
                </div>
              )}
            </div>
          )}
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
                <p className="text-xs text-rose-300 font-bold mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>ALERGIAS CONHECIDAS: {currentPatient.alergias.join(', ')}</span>
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
              <span>Imprimir Receita / Exames PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* HISTÓRICO DAS ÚLTIMAS CONSULTAS E PRONTUÁRIOS REALIZADOS COM ESTE ESPECIALISTA */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            <span>Histórico de Consultas & Registros Anteriores do Paciente ({patientRecords.length})</span>
          </h3>
          <span className="text-xs font-semibold text-slate-400">
            Especialista: {doctor.nome} ({doctor.crm})
          </span>
        </div>

        {patientRecords.length > 0 ? (
          <div className="space-y-3">
            {patientRecords.map((rec) => {
              const isExpanded = expandedRecordId === rec.id;
              return (
                <div
                  key={rec.id}
                  className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/40 transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedRecordId(isExpanded ? null : rec.id)}
                    className="w-full text-left p-4 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950 text-[#00A896] dark:text-teal-400 flex items-center justify-center font-bold text-xs shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                            Consulta em {new Date(rec.dataHora).toLocaleDateString('pt-BR')} às {new Date(rec.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                            Assinado Digitalmente
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          CID-10: <strong className="text-teal-600">{rec.cid10Codigo}</strong> — {rec.cid10Descricao}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-4 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 rounded-xl bg-sky-50 dark:bg-slate-800 border border-sky-100 dark:border-slate-700">
                          <span className="font-bold text-sky-800 dark:text-sky-300 block mb-1">
                            S — Subjetivo (Anamnese):
                          </span>
                          <p className="text-slate-700 dark:text-slate-300">{rec.subjetivo}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700">
                          <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                            O — Objetivo (Exame Físico):
                          </span>
                          <p className="text-slate-700 dark:text-slate-300">{rec.objetivo}</p>
                        </div>
                      </div>

                      {/* Prescriptions */}
                      {rec.prescricoes.length > 0 && (
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                          <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                            <span>Medicamentos Prescritos nesta Consulta:</span>
                          </span>
                          <div className="space-y-1 pl-2">
                            {rec.prescricoes.map((p, i) => (
                              <p key={i} className="text-slate-600 dark:text-slate-300">
                                • <strong>{p.medicamento} {p.dosagem}</strong> — Uso {p.via}, {p.frequencia} por {p.duracao}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Requested Exams */}
                      {rec.examesSolicitados && rec.examesSolicitados.length > 0 && (
                        <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 space-y-2">
                          <span className="font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                            <TestTube className="w-3.5 h-3.5 text-teal-600" />
                            <span>Exames Complementares Solicitados nesta Consulta:</span>
                          </span>
                          <div className="space-y-1.5">
                            {rec.examesSolicitados.map((ex, i) => (
                              <div key={i} className="flex items-center justify-between text-[11px] bg-white dark:bg-slate-800 p-2 rounded-lg border border-teal-100 dark:border-slate-700">
                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                  {ex.nomeExame} ({ex.categoria || 'Cardiologia'})
                                </span>
                                {ex.urgente && (
                                  <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                                    URGENTE
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                          {rec.orientacoesExames && (
                            <p className="text-[11px] text-teal-700 dark:text-teal-300 italic pt-1">
                              Orientações: {rec.orientacoesExames}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center text-xs text-slate-400">
            Nenhum histórico médico anterior assinado encontrado para este paciente com este especialista.
          </div>
        )}
      </div>

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

      {/* PRESCRIPTION & EXAM BUILDER SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-[#00A896]" />
          <span>Prescrição Médica Eletrônica & Solicitação de Exames</span>
        </h3>

        {/* 1. MEDICATIONS SECTION */}
        <div className="space-y-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            I. Prescrição de Medicamentos
          </span>

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
                  type="button"
                  onClick={() => handleRemovePrescription(p.id)}
                  className="text-rose-500 hover:text-rose-700 p-1 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2. SOLICITAÇÃO DE EXAMES COMPLEMENTARES SECTION */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={solicitaExames}
                onChange={(e) => setSolicitaExames(e.target.checked)}
                className="w-4 h-4 accent-[#00A896] rounded"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <TestTube className="w-4 h-4 text-[#00A896]" />
                Solicitar Exames Médicos / Complementares nesta consulta
              </span>
            </label>
            {solicitaExames && (
              <span className="text-[11px] font-semibold text-teal-600">
                {examesSolicitados.length} exame(s) no pedido
              </span>
            )}
          </div>

          {solicitaExames && (
            <div className="space-y-4 bg-teal-50/40 dark:bg-slate-800/40 p-5 rounded-3xl border border-teal-100 dark:border-slate-700">
              {/* Quick Add Exam Chips */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-2">
                  Atalhos Rápidos de Exames Frequentes:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { nome: 'Ecocardiograma Transtorácico com Doppler', cat: 'Cardiologia' },
                    { nome: 'Holter 24 Horas de 3 Canais', cat: 'Cardiologia' },
                    { nome: 'Teste Ergométrico Computadorizado', cat: 'Cardiologia' },
                    { nome: 'ECG 12 Derivações de Repouso', cat: 'Cardiologia' },
                    { nome: 'Hemograma Completo', cat: 'Laboratorial' },
                    { nome: 'Perfil Lipídico & Glicemia', cat: 'Laboratorial' },
                    { nome: 'Raio-X de Tórax (PA e Perfil)', cat: 'Imagem' },
                  ].map((chip) => (
                    <button
                      key={chip.nome}
                      type="button"
                      onClick={() => handleQuickAddExam(chip.nome, chip.cat)}
                      className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-slate-600 hover:bg-teal-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3 text-[#00A896]" />
                      <span>{chip.nome}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Exam Line Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Nome do Exame *
                  </label>
                  <input
                    type="text"
                    value={exameNome}
                    onChange={(e) => setExameNome(e.target.value)}
                    placeholder="Ex: Tomografia de Tórax, Doppler de Carótidas..."
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Categoria
                  </label>
                  <select
                    value={exameCategoria}
                    onChange={(e) => setExameCategoria(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-semibold"
                  >
                    <option value="Cardiologia">Cardiologia</option>
                    <option value="Laboratorial">Laboratorial</option>
                    <option value="Imagem">Imagem</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Indicação Clínica / Observação
                  </label>
                  <input
                    type="text"
                    value={exameIndicacao}
                    onChange={(e) => setExameIndicacao(e.target.value)}
                    placeholder="Ex: Investigação de sopro, síncope..."
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleAddExam}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold p-2.5 rounded-xl flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Exame</span>
                  </button>
                </div>
              </div>

              {/* Urgent Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="urgenteCheck"
                  checked={exameUrgente}
                  onChange={(e) => setExameUrgente(e.target.checked)}
                  className="w-4 h-4 accent-rose-600 rounded"
                />
                <label htmlFor="urgenteCheck" className="text-xs font-bold text-rose-600 cursor-pointer">
                  ⚠️ Marcar este exame como Pedido Urgente
                </label>
              </div>

              {/* Requested Exams List */}
              <div className="space-y-2">
                {examesSolicitados.map((ex, idx) => (
                  <div
                    key={ex.id || idx}
                    className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs shadow-sm"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-100 text-xs">
                          {idx + 1}. {ex.nomeExame}
                        </span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold px-2 py-0.5 rounded">
                          {ex.categoria}
                        </span>
                        {ex.urgente && (
                          <span className="text-[10px] bg-rose-100 text-rose-700 font-black px-2 py-0.5 rounded">
                            URGENTE
                          </span>
                        )}
                      </div>
                      {ex.indicacaoClinica && (
                        <p className="text-[11px] text-slate-500 italic">
                          Indicação: {ex.indicacaoClinica}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExam(ex.id)}
                      className="text-rose-500 hover:text-rose-700 p-1 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Exam Preparation / Instructions Textarea */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Orientações e Preparo do Paciente para os Exames:
                </label>
                <textarea
                  rows={2}
                  value={orientacoesExames}
                  onChange={(e) => setOrientacoesExames(e.target.value)}
                  placeholder="Ex: Jejum de 8h para exames de sangue. Comparecer com roupa leve para o teste ergométrico..."
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                />
              </div>
            </div>
          )}
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
            type="button"
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
          solicitaExames,
          examesSolicitados,
          orientacoesExames,
          assinado: true,
        }}
        patient={currentPatient}
        doctor={doctor}
      />
    </div>
  );
};
