import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Wallet,
  BarChart3,
  Settings,
  Plus,
  ShieldCheck,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Lock,
  UserCheck,
  Building2,
  LifeBuoy,
  CreditCard,
} from 'lucide-react';
import { UserAccount } from '../types';

export interface ClinicTheme {
  primaryColor: string;
  secondaryColor: string;
  gradientName: string;
}

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenNovaConsulta: () => void;
  currentUser: UserAccount;
  onOpenSwitchUser?: () => void;
  clinicLogo?: string;
  clinicTheme?: ClinicTheme;
  systemName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenNovaConsulta,
  currentUser,
  onOpenSwitchUser,
  clinicLogo,
  clinicTheme = { primaryColor: '#00A896', secondaryColor: '#00B4D8', gradientName: 'Padrão' },
  systemName = 'CLINIC MEDICAL',
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const isDoctor = currentUser.role === 'medico';
  const isAdmin = currentUser.role === 'admin';
  const isAtendente = currentUser.role === 'atendente';

  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['medico', 'atendente', 'admin'] },
    { id: 'agenda', label: 'Agenda & Calendário', icon: Calendar, roles: ['medico', 'atendente', 'admin'] },
    { id: 'especialidades', label: 'Especialidades & Corpo Clínico', icon: Stethoscope, roles: ['atendente', 'admin'] },
    { id: 'pacientes', label: 'Pacientes', icon: Users, roles: ['medico', 'admin'] },
    { id: 'prontuario', label: 'Prontuário', icon: FileText, roles: ['medico', 'admin'] },
    { id: 'financeiro', label: 'Financeiro TISS (Admin)', icon: Wallet, roles: ['admin'] },
    { id: 'relatorios', label: 'Relatórios Gerenciais (Admin)', icon: BarChart3, roles: ['admin'] },
    { id: 'assinatura', label: 'Assinatura & Licença (Admin)', icon: CreditCard, roles: ['admin'] },
    { id: 'suporte', label: 'Suporte & Ajuda', icon: LifeBuoy, roles: ['medico', 'atendente', 'admin'] },
  ];

  const menuItems = allMenuItems.filter((item) =>
    item.roles.includes(currentUser.role)
  );

  const customGradientStyle = {
    background: `linear-gradient(180deg, #090D16 0%, ${clinicTheme.primaryColor} 55%, ${clinicTheme.secondaryColor} 100%)`,
  };

  return (
    <aside
      style={customGradientStyle}
      className={`text-white flex flex-col justify-between shrink-0 shadow-2xl transition-all duration-300 relative ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-4 flex flex-col gap-4">
        {/* Header / Brand Title & Toggle Button */}
        <div className="border-b border-white/10 pb-4">
          {!isCollapsed ? (
            <div className="flex flex-col items-center text-center space-y-2 pt-1">
              {/* Toggle Button in Top Corner */}
              <div className="w-full flex justify-end">
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Recolher Menu"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Clinic Logo in Evidence */}
              <div className="relative group">
                {clinicLogo ? (
                  <img
                    src={clinicLogo}
                    alt="Logo da Clínica"
                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20 bg-white p-1 shadow-xl transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-white/15 border-2 border-white/30 flex items-center justify-center text-white shadow-xl">
                    <Stethoscope className="w-8 h-8 stroke-[2.5]" />
                  </div>
                )}
              </div>

              {/* Clinic Name below logo with smaller font */}
              <div className="w-full px-2">
                <h1 className="font-extrabold text-xs tracking-wide text-white uppercase break-words leading-tight drop-shadow-sm">
                  {systemName}
                </h1>
                <span className="text-[10px] text-white/80 font-semibold px-2 py-0.5 rounded-full bg-white/10 inline-block mt-1">
                  Gestão Médica
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 pt-1">
              {clinicLogo ? (
                <img
                  src={clinicLogo}
                  alt="Logo da Clínica"
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/20 bg-white p-0.5 shadow-md"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-inner">
                  <Stethoscope className="w-5 h-5 stroke-[2.5]" />
                </div>
              )}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Expandir Menu"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>

        {/* Current Active User Info Widget */}
        {!isCollapsed ? (
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatar}
                alt={currentUser.nome}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-white/20 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-xs text-white truncate">
                  {currentUser.nome}
                </p>
                <p className="text-[10px] text-emerald-200 font-medium truncate">
                  {currentUser.cargo}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px]">
              <span
                className={`font-black px-2 py-0.5 rounded-full ${
                  isAdmin
                    ? 'bg-amber-300 text-slate-950'
                    : isDoctor
                    ? 'bg-emerald-400 text-slate-950'
                    : 'bg-sky-400 text-slate-950'
                }`}
              >
                {isAdmin ? 'ADMINISTRADOR' : isDoctor ? 'MÉDICO' : 'ATENDENTE RECEPÇÃO'}
              </span>

              {onOpenSwitchUser && (
                <button
                  onClick={onOpenSwitchUser}
                  className="text-white/80 hover:text-white underline font-bold"
                >
                  Trocar
                </button>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={onOpenSwitchUser}
            className="w-10 h-10 mx-auto rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white"
            title={`Logado como: ${currentUser.nome} (${currentUser.cargo}) - Clique para trocar`}
          >
            <UserCheck className="w-5 h-5 text-emerald-300" />
          </button>
        )}

        {/* Quick Action Button: Nova Consulta (Omitido no perfil Médico) */}
        {!isDoctor && (
          <button
            onClick={onOpenNovaConsulta}
            className={`w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-lg backdrop-blur-sm transition-all duration-200 active:scale-[0.98] group ${
              isCollapsed ? 'p-3' : 'py-3.5 px-4'
            }`}
            title="Nova Consulta"
          >
            <div className="w-7 h-7 rounded-full bg-slate-950 text-emerald-400 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
            {!isCollapsed && <span className="text-sm font-bold tracking-wide">Nova Consulta</span>}
          </button>
        )}

        {/* Menu Navigation */}
        <nav className="flex flex-col gap-1 mt-1">
          {!isCollapsed && (
            <div className="flex items-center justify-between px-3 mb-1">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-200/80">
                Navegação Permitida
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/90">
                {currentUser.role.toUpperCase()}
              </span>
            </div>
          )}

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center gap-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isCollapsed ? 'p-3 justify-center' : 'px-3.5 py-2.5'
                } ${
                  isActive
                    ? 'bg-white/20 text-white shadow-md backdrop-blur-md font-bold border border-white/20'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-emerald-300' : 'text-white/80'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Configurations Section */}
        <div className="flex flex-col gap-1 pt-3 border-t border-white/15">
          {!isCollapsed && (
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-200/80 px-3 mb-1">
              Sistema
            </span>
          )}
          <button
            onClick={() => setCurrentTab('configuracoes')}
            title={isCollapsed ? 'Configurações' : undefined}
            className={`flex items-center gap-3 rounded-xl font-medium text-sm transition-all ${
              isCollapsed ? 'p-3 justify-center' : 'px-3.5 py-2.5'
            } ${
              currentTab === 'configuracoes'
                ? 'bg-white/20 text-white shadow-md backdrop-blur-md font-bold border border-white/20'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Configurações</span>}
          </button>
        </div>
      </div>

      {/* Footer LGPD Badge */}
      <div className="p-3 bg-slate-950/20 backdrop-blur-sm border-t border-white/10 text-center">
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-100 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
          {!isCollapsed && <span>LGPD Conformidade</span>}
        </div>
      </div>
    </aside>
  );
};
