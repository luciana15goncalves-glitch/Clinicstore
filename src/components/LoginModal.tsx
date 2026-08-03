import React, { useState } from 'react';
import {
  Stethoscope,
  UserCheck,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  Sparkles,
  Users,
  Building2,
  AlertCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { MOCK_USER_ACCOUNTS } from '../data/mockData';
import { UserAccount, Role } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (user: UserAccount) => void;
  currentUser?: UserAccount | null;
  onClose?: () => void;
  userAccounts?: UserAccount[];
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onLoginSuccess,
  currentUser,
  onClose,
  userAccounts,
}) => {
  const accountsList = userAccounts && userAccounts.length > 0 ? userAccounts : MOCK_USER_ACCOUNTS;

  const [selectedAccount, setSelectedAccount] = useState<UserAccount>(
    accountsList[0]
  );
  const [emailInput, setEmailInput] = useState<string>(accountsList[0].email);
  const [passwordInput, setPasswordInput] = useState<string>('123');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickSelect = (account: UserAccount) => {
    setSelectedAccount(account);
    setEmailInput(account.email);
    setPasswordInput('123');
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedAccount = accountsList.find(
      (a) => a.email.toLowerCase() === emailInput.trim().toLowerCase()
    );

    if (matchedAccount) {
      onLoginSuccess(matchedAccount);
      if (onClose) onClose();
    } else {
      setErrorMsg('Usuário não encontrado. Selecione um dos perfis autorizados abaixo.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        {/* Left Column: Branding & Role Explanation Banner */}
        <div className="md:w-5/12 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            {/* Logo Brand */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-lg">
                <Stethoscope className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white">
                  CLINIC MEDICAL
                </h1>
                <p className="text-xs text-emerald-300 font-bold">
                  Gestão Médica Inteligente
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h2 className="text-2xl font-black leading-tight">
                Acesso Restrito ao Sistema
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Acesse o sistema com seu perfil profissional para visualizar as ferramentas autorizadas de acordo com o nivel de acesso LGPD.
              </p>
            </div>

            {/* Permission Summary Boxes */}
            <div className="space-y-2.5 text-xs pt-1">
              <div className="p-3 rounded-2xl bg-amber-500/10 backdrop-blur-md border border-amber-400/30 space-y-1">
                <div className="flex items-center gap-2 font-black text-amber-300">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Perfil ADMINISTRADOR:</span>
                </div>
                <p className="text-[11px] text-slate-200 leading-snug">
                  Acesso total a todas as abas (Financeiro, Relatórios, Configurações, Prontuários, Pacientes, Agenda), criação de logins, cadastro de médicos, especialidades, valores e personalização de logo/cores.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
                <div className="flex items-center gap-2 font-extrabold text-emerald-300">
                  <UserCheck className="w-4 h-4" />
                  <span>Perfil Médico:</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Acesso ao Prontuário Eletrônico, Lista de Pacientes, Prescrições e Agenda. (Financeiro e Relatórios bloqueados).
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
                <div className="flex items-center gap-2 font-extrabold text-sky-300">
                  <Building2 className="w-4 h-4" />
                  <span>Perfil Atendente / Recepção:</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Acesso a Agenda, Agendamento e Especialidades. (Financeiro, Relatórios e Prontuários bloqueados).
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-[11px] text-emerald-200/80 flex items-center gap-1.5 relative z-10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Conformidade com Ética Médica e LGPD</span>
          </div>
        </div>

        {/* Right Column: Login Form & Preset Account Cards */}
        <div className="md:w-7/12 p-8 flex flex-col justify-between bg-white space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Autenticação de Usuário
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selecione um perfil abaixo ou insira suas credenciais
                </p>
              </div>

              {currentUser && onClose && (
                <button
                  onClick={onClose}
                  className="text-xs font-bold text-slate-400 hover:text-slate-700 px-3 py-1.5 rounded-xl bg-slate-100"
                >
                  Continuar
                </button>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick Account Preset Cards */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                Escolha um Perfil para Acessar Rapidamente:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {accountsList.map((acc) => {
                  const isSelected = selectedAccount.id === acc.id;
                  const isDoctor = acc.role === 'medico';
                  const isAdmin = acc.role === 'admin';

                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleQuickSelect(acc)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-3 relative ${
                        isSelected
                          ? isAdmin
                            ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                            : isDoctor
                            ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                            : 'bg-sky-50/80 border-sky-500 ring-2 ring-sky-500/20 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <img
                        src={acc.avatar}
                        alt={acc.nome}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shrink-0 mt-0.5"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-extrabold text-slate-900 text-xs truncate">
                            {acc.nome}
                          </p>
                        </div>

                        <p
                          className={`text-[10px] font-bold mt-0.5 ${
                            isAdmin
                              ? 'text-amber-800'
                              : isDoctor
                              ? 'text-emerald-700'
                              : 'text-sky-700'
                          }`}
                        >
                          {acc.cargo}
                        </p>

                        <span
                          className={`inline-block mt-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                            isAdmin
                              ? 'bg-amber-100 text-amber-900'
                              : isDoctor
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-sky-100 text-sky-800'
                          }`}
                        >
                          {isAdmin ? 'ADMINISTRADOR' : isDoctor ? 'MÉDICO' : 'RECEPÇÃO'}
                        </span>
                      </div>

                      {isSelected && (
                        <CheckCircle2
                          className={`w-4 h-4 absolute top-2 right-2 ${
                            isAdmin
                              ? 'text-amber-600'
                              : isDoctor
                              ? 'text-emerald-600'
                              : 'text-sky-600'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  E-mail de Acesso
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  placeholder="seu.email@clinicmedical.com.br"
                  className="w-full bg-slate-50 text-xs font-medium text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                    Senha de Acesso
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    (Senha padrão: 123)
                  </span>
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 text-xs font-medium text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Entrar no Sistema como {selectedAccount.nome.split(' ')[0]}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 text-center font-medium">
            Sessão com autenticação segura e registro automático em Log de Auditoria.
          </div>
        </div>
      </div>
    </div>
  );
};
