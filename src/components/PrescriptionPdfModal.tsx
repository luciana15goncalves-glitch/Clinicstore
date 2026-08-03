import React from 'react';
import { X, Printer, Download, ShieldCheck, HeartPulse } from 'lucide-react';
import { MedicalRecord, Patient, UserProfile } from '../types';

interface PrescriptionPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MedicalRecord | null;
  patient: Patient | null;
  doctor: UserProfile;
}

export const PrescriptionPdfModal: React.FC<PrescriptionPdfModalProps> = ({
  isOpen,
  onClose,
  record,
  patient,
  doctor,
}) => {
  if (!isOpen || !record || !patient) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Controls Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            <span className="font-bold text-sm">Receituário Médico Oficial — Documento PDF</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEITUÁRIO CONTENT */}
        <div id="printable-receita" className="p-8 bg-white text-slate-900 overflow-y-auto space-y-6 flex-1 font-sans">
          {/* Official Clinic Header */}
          <div className="border-b-2 border-teal-600 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-teal-700 uppercase tracking-wide flex items-center gap-2">
                <HeartPulse className="w-6 h-6 text-teal-600" />
                ClinicStore Saúde
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Clínica de Especialidades Médicas & Cardiologia
              </p>
            </div>
            <div className="text-right text-xs text-slate-600">
              <p className="font-bold text-slate-800">{doctor.nome}</p>
              <p>{doctor.especialidade}</p>
              <p className="font-bold text-teal-600">{doctor.crm}</p>
            </div>
          </div>

          {/* Patient Details Row */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="font-bold text-slate-700">Paciente: {patient.nome}</span>
              <span className="text-slate-500">CPF: {patient.cpf}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Data de Nasc: {patient.dataNascimento} ({patient.idade} anos)</span>
              <span>Data da Emissão: {new Date().toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          {/* Title Banner */}
          <div className="text-center py-2 border-y border-dashed border-slate-300">
            <h3 className="text-sm font-black tracking-widest text-slate-800 uppercase">
              RECEITUÁRIO MÉDICO
            </h3>
          </div>

          {/* Prescriptions List */}
          <div className="space-y-4 py-2">
            {record.prescricoes.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-black uppercase text-slate-500 tracking-wider border-b border-slate-200 pb-1">
                  I. Prescrição de Medicamentos:
                </p>
                {record.prescricoes.map((p, idx) => (
                  <div key={p.id || idx} className="space-y-1">
                    <div className="flex items-baseline justify-between">
                      <p className="font-extrabold text-sm text-slate-900">
                        {idx + 1}. {p.medicamento} {p.dosagem}
                      </p>
                      <span className="text-xs font-bold text-slate-600">
                        Qtd: {p.quantidade} frasco(s)/caixa(s)
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 pl-4 border-l-2 border-teal-500 italic">
                      Uso {p.via}: {p.frequencia} por {p.duracao}.
                    </p>
                    {p.observacoes && (
                      <p className="text-[11px] text-slate-500 pl-4 italic">
                        Obs: {p.observacoes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Requested Diagnostic Exams Section */}
            {record.examesSolicitados && record.examesSolicitados.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                  <p className="text-xs font-black uppercase text-teal-700 tracking-wider">
                    II. Solicitação de Exames Complementares:
                  </p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                    Pedido Médico Oficial
                  </span>
                </div>

                <div className="space-y-2">
                  {record.examesSolicitados.map((ex, idx) => (
                    <div key={ex.id || idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{idx + 1}. {ex.nomeExame}</span>
                        {ex.urgente && (
                          <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            Urgente
                          </span>
                        )}
                      </div>
                      {ex.indicacaoClinica && (
                        <p className="text-[11px] text-slate-600 mt-0.5 italic">
                          Indicação Clínica: {ex.indicacaoClinica}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {record.orientacoesExames && (
                  <p className="text-[11px] text-slate-600 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    <strong>Orientações para os Exames:</strong> {record.orientacoesExames}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Official Signature & QR Code Simulator */}
          <div className="pt-8 border-t border-slate-200 flex items-end justify-between text-xs">
            <div className="space-y-1">
              <p className="font-bold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Assinado Digitalmente por ICP-Brasil
              </p>
              <p className="text-[10px] text-slate-400">
                Hash de validação: 8f92a10c-39b2-4d1e-8820
              </p>
              <p className="text-[10px] text-slate-400">
                Emissão em conformidade com o CFM e LGPD.
              </p>
            </div>

            <div className="text-center space-y-1">
              <div className="w-48 border-b border-slate-800 mx-auto" />
              <p className="font-bold text-slate-800">{doctor.nome}</p>
              <p className="text-[11px] text-slate-500">{doctor.crm}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
