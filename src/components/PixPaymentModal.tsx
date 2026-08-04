import React, { useState } from 'react';
import {
  QrCode,
  X,
  Copy,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  Building2,
  Clock,
  Zap,
} from 'lucide-react';
import { Appointment, Patient } from '../types';

interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  patient: Patient | null;
  onPaymentConfirmed?: () => void;
}

export const PixPaymentModal: React.FC<PixPaymentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  patient,
  onPaymentConfirmed,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
  const [paid, setPaid] = useState(false);

  if (!isOpen || !appointment) return null;

  const pixKeyCopy = `00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540${appointment.valor.toFixed(
    2
  )}5802BR5915CLINIC MEDICAL6009SAO PAULO62070503***6304A1B2`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKeyCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSimulatePayment = () => {
    setIsSimulatingPayment(true);
    setTimeout(() => {
      setIsSimulatingPayment(false);
      setPaid(true);
      if (onPaymentConfirmed) onPaymentConfirmed();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white flex items-center justify-between border-b border-teal-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <QrCode className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Cobrança Instantânea PIX</h3>
              <p className="text-xs text-teal-200">Liquidação Imediata na Conta da Clínica</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-center">
          {paid ? (
            <div className="py-8 space-y-3 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
                Pagamento PIX Confirmado!
              </h4>
              <p className="text-xs text-slate-500">
                Valor de <strong className="text-emerald-600">R$ {appointment.valor.toFixed(2)}</strong> recebido com sucesso no Banco Central.
              </p>
              <button
                onClick={onClose}
                className="mt-4 w-full py-3 rounded-2xl bg-[#00A896] hover:bg-[#009282] text-white font-bold text-xs shadow-md transition-all"
              >
                Concluir & Voltar para Agenda
              </button>
            </div>
          ) : (
            <>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-left space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">Paciente:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {patient?.nome || appointment.pacienteNome}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">Consulta:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {appointment.tipo} • {appointment.horario}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 font-bold uppercase">Valor a Pagar:</span>
                  <span className="text-lg font-black text-[#00A896]">
                    R$ {appointment.valor.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* QR Code Graphic Box */}
              <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-teal-500 inline-block shadow-md relative">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    pixKeyCopy
                  )}`}
                  alt="PIX QR Code"
                  className="w-44 h-44 mx-auto"
                />
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[9px] font-extrabold px-3 py-1 rounded-full shadow-xs">
                  Escaneie no app do Banco
                </span>
              </div>

              {/* Copy Paste Code */}
              <div className="space-y-1 text-left pt-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Código Copia e Cola PIX:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={pixKeyCopy}
                    className="w-full bg-slate-100 dark:bg-slate-800 text-[10px] font-mono p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 truncate"
                  />
                  <button
                    onClick={handleCopy}
                    className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold shrink-0 flex items-center gap-1"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              {/* Action Trigger */}
              <button
                onClick={handleSimulatePayment}
                disabled={isSimulatingPayment}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {isSimulatingPayment ? (
                  <span>Verificando no Banco Central...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Confirmar Recebimento Instantâneo</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
