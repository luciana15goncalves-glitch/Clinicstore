import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert, LogOut, CheckCircle2 } from 'lucide-react';

interface SessionTimeoutModalProps {
  isOpen: boolean;
  onExtendSession: () => void;
  onLogout: () => void;
}

export const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({
  isOpen,
  onExtendSession,
  onLogout,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(60);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onLogout]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-rose-500/30 shadow-2xl overflow-hidden p-6 text-center space-y-4">
        <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-800">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        <div>
          <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
            Aviso de Segurança LGPD: Inatividade
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Por conformidade com a proteção de dados médicos (LGPD/CFM), sua sessão expira em breve se não houver interação.
          </p>
        </div>

        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-400 font-bold uppercase block">Expira em:</span>
          <span className="text-3xl font-black text-rose-600 dark:text-rose-400 font-mono">
            00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            onClick={onLogout}
            className="w-full py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair Agora</span>
          </button>
          <button
            onClick={onExtendSession}
            className="w-full py-3 rounded-2xl bg-[#00A896] hover:bg-[#009282] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Permanecer Conectado</span>
          </button>
        </div>
      </div>
    </div>
  );
};
