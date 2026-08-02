import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Package,
  Wallet,
  BarChart3,
  Settings,
  Plus,
  Sun,
  Moon,
  ShieldCheck,
  Activity,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenNovaConsulta: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenNovaConsulta,
  darkMode,
  setDarkMode,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'pacientes', label: 'Pacientes', icon: Users },
    { id: 'prontuario', label: 'Prontuário', icon: FileText },
    { id: 'insumos', label: 'Insumos', icon: Package },
    { id: 'financeiro', label: 'Financeiro', icon: Wallet },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-[#00A896] via-[#00B4D8] to-[#0284C7] text-white flex flex-col justify-between shrink-0 shadow-xl transition-all duration-300">
      <div className="p-5 flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center font-bold text-xl shadow-inner">
            .D
          </div>
          <div>
            <h1 className="font-bold text-xl leading-tight tracking-tight text-white flex items-center gap-1">
              ClinicStore
            </h1>
            <span className="text-xs text-teal-100 font-medium px-2 py-0.5 rounded-full bg-white/15 inline-block">
              Admin
            </span>
          </div>
        </div>

        {/* Quick Action Button: Nova Consulta */}
        <button
          onClick={onOpenNovaConsulta}
          className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3.5 px-4 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg backdrop-blur-sm transition-all duration-200 active:scale-[0.98] group"
        >
          <div className="w-8 h-8 rounded-full bg-white text-[#00A896] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-sm font-bold tracking-wide mt-1">Nova Consulta</span>
        </button>

        {/* Menu Navigation */}
        <nav className="flex flex-col gap-1 mt-2">
          <span className="text-[11px] uppercase tracking-wider font-bold text-white/70 px-3 mb-1">
            Menu
          </span>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-white/25 text-white shadow-md backdrop-blur-md font-semibold translate-x-1 border border-white/20'
                    : 'text-white/85 hover:bg-white/15 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/80'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Configurations Section */}
        <div className="flex flex-col gap-1 pt-4 border-t border-white/20">
          <span className="text-[11px] uppercase tracking-wider font-bold text-white/70 px-3 mb-1">
            Configuração
          </span>
          <button
            onClick={() => setCurrentTab('configuracoes')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              currentTab === 'configuracoes'
                ? 'bg-white/25 text-white shadow-md backdrop-blur-md font-semibold border border-white/20'
                : 'text-white/85 hover:bg-white/15 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configurações</span>
          </button>

          {/* Theme Switcher Toggle */}
          <div className="flex items-center justify-between px-3.5 py-2.5 mt-1 rounded-xl bg-white/10 text-xs text-white/90 font-medium">
            <span className="flex items-center gap-2">
              {darkMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              {darkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
                darkMode ? 'bg-indigo-900 justify-end' : 'bg-white/30 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer LGPD Badge in Sidebar */}
      <div className="p-4 bg-black/10 backdrop-blur-sm border-t border-white/10 text-center">
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/90 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-200" />
          <span>LGPD Conformidade Ativa</span>
        </div>
      </div>
    </aside>
  );
};
