import React from 'react';
import { ShieldAlert, Lock, ArrowLeft, Stethoscope, Building2, UserCheck, KeyRound } from 'lucide-react';
import { UserAccount } from '../types';

interface AccessDeniedViewProps {
  tabName: string;
  user: UserAccount;
  onNavigateTab: (tab: string) => void;
  onOpenSwitchUser?: () => void;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  tabName,
  user,
  onNavigateTab,
  onOpenSwitchUser,
}) => {
  const isDoctor = user.role === 'medico';

  const tabLabels: { [key: string]: string } = {
    pacientes: 'Lista & Histórico de Pacientes',
    prontuario: 'Prontuário Eletrônico Confidential',
    financeiro: 'Financeiro TISS & Faturamento',
    relatorios: 'Relatórios Gerenciais & BI',
  };

  const restrictedTabTitle = tabLabels[tabName] || tabName;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl text-center space-y-6 max-w-2xl relative overflow-hidden">
        {/* Top Decorative Banner Pattern */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600" />

        {/* Icon Lock Badge */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shadow-inner">
          <ShieldAlert className="w-10 h-10 stroke-[2]" />
        </div>

        {/* Title & Badge */}
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Acesso Restrito — Controle de Acesso LGPD
          </span>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Módulo: {restrictedTabTitle}
          </h2>
        </div>

        {/* Contextual Error Message depending on role */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-3">
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {isDoctor ? (
              <>
                Como <strong className="text-emerald-700">{user.nome} ({user.cargo})</strong>, você está em um perfil com perfil exclusivo médico. Os módulos de <strong>Financeiro TISS</strong> e <strong>Relatórios Gerenciais</strong> são restritos aos funcionários e atendentes da recepção/administração da clínica.
              </>
            ) : (
              <>
                Como <strong className="text-sky-700">{user.nome} ({user.cargo})</strong>, seu perfil de atendimento na recepção <strong>NÃO possui autorização</strong> para acessar o <strong>Prontuário Eletrônico</strong>, <strong>Lista de Pacientes</strong> ou <strong>Históricos Médicos</strong>. Estas informações contêm dados sigilosos e de saúde protegidos pelo CFM e LGPD (Lei nº 13.709/2018), restritos unicamente aos médicos credenciados.
              </>
            )}
          </p>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-semibold flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {isDoctor
                ? 'Para consultar ou emitir cobranças, solicite ao setor de recepção.'
                : 'Para agendar consultas ou verificar disponibilidade dos médicos, utilize a aba "Agenda & Calendário".'}
            </span>
          </div>
        </div>

        {/* User Card Bar */}
        <div className="p-3 bg-slate-100/80 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.nome}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-white"
            />
            <div className="text-left">
              <p className="font-bold text-slate-900">{user.nome}</p>
              <p className="text-[11px] text-slate-500">{user.cargo}</p>
            </div>
          </div>

          <span
            className={`font-black text-[10px] px-2.5 py-1 rounded-full ${
              isDoctor ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
            }`}
          >
            {isDoctor ? 'PERFIL MÉDICO' : 'PERFIL RECEPÇÃO'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigateTab(isDoctor ? 'prontuario' : 'agenda')}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para {isDoctor ? 'Prontuário Médico' : 'Agenda da Recepção'}</span>
          </button>

          {onOpenSwitchUser && (
            <button
              onClick={onOpenSwitchUser}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <UserCheck className="w-4 h-4" />
              <span>Trocar de Usuário / Entrar como {isDoctor ? 'Atendente' : 'Médico'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
