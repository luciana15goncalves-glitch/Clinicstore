import React, { useState } from 'react';
import {
  Search,
  Calendar as CalendarIcon,
  Grid,
  Bell,
  Mail,
  ChevronDown,
  User,
  Shield,
  LogOut,
  X,
  UserCheck,
  Building2,
  Stethoscope,
  ShieldCheck,
  Lock,
  Wifi,
  Activity,
  Smartphone,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { INITIAL_PATIENTS } from '../data/mockData';
import { Patient, UserAccount } from '../types';

interface HeaderProps {
  onSelectPatient: (patient: Patient) => void;
  onOpenAgenda: () => void;
  currentUser: UserAccount;
  onOpenSwitchUser?: () => void;
  currentUnit?: string;
  onChangeUnit?: (unit: string) => void;
  onOpenAuditLogs?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectPatient,
  onOpenAgenda,
  currentUser,
  onOpenSwitchUser,
  currentUnit = 'Unidade 1 - Centro Paulista',
  onChangeUnit,
  onOpenAuditLogs,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showUnitMenu, setShowUnitMenu] = useState(false);
  const [showSecurityDetails, setShowSecurityDetails] = useState(false);

  const isDoctor = currentUser.role === 'medico';

  const units = [
    'Unidade 1 - Centro Paulista',
    'Unidade 2 - Jardins / Oscar Freire',
    'Unidade 3 - Alphaville Premium',
  ];

  const filteredPatients = searchTerm.trim()
    ? INITIAL_PATIENTS.filter(
        (p) =>
          p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.cpf.includes(searchTerm) ||
          p.telefone.includes(searchTerm)
      )
    : [];

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 lg:px-6 flex items-center justify-between shrink-0 shadow-sm relative z-30">
      {/* Left: Multi-Tenant Unit Selector & Global Search */}
      <div className="flex items-center gap-3">
        {/* Multi-Tenant Unit Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowUnitMenu(!showUnitMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200"
          >
            <Building2 className="w-4 h-4 text-[#00A896]" />
            <span className="truncate max-w-[160px]">{currentUnit}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUnitMenu && (
            <div className="absolute left-0 top-11 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1">
                Selecione a Unidade / Filial (Multi-Tenant)
              </p>
              <div className="space-y-1 mt-1">
                {units.map((unit) => (
                  <button
                    key={unit}
                    onClick={() => {
                      if (onChangeUnit) onChangeUnit(unit);
                      setShowUnitMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      unit === currentUnit
                        ? 'bg-teal-50 text-[#00A896] border border-teal-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{unit}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Global Search Input Bar */}
        <div className="relative w-64 lg:w-80">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Busca global paciente, CPF (Ctrl+K)..."
              className="w-full bg-slate-100 text-slate-800 placeholder-slate-400 text-xs font-medium rounded-xl pl-10 pr-14 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A896] transition-all border border-transparent"
            />
            {!searchTerm && (
              <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-slate-200/70 rounded border border-slate-300 pointer-events-none hidden sm:inline-block">
                Ctrl K
              </kbd>
            )}
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setShowSearchResults(false);
                }}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Live Search Dropdown */}
          {showSearchResults && searchTerm.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-11 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="p-2 bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                <span>Resultados ({filteredPatients.length})</span>
                <span className="text-teal-600">LGPD Protegido</span>
              </div>
              {filteredPatients.length > 0 ? (
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                  {filteredPatients.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectPatient(p);
                        setShowSearchResults(false);
                        setSearchTerm('');
                      }}
                      className="w-full text-left p-3 hover:bg-teal-50 flex items-center gap-3 transition-colors group"
                    >
                      <img
                        src={p.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                        alt={p.nome}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-[#00A896] truncate">
                          {p.nome}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          CPF: {p.cpf} • {p.telefone}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        Abrir Prontuário ➔
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  Nenhum paciente localizado para "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Center: Security, MFA, PWA & Performance Indicators */}
      <div className="hidden xl:flex items-center gap-2">
        <button
          onClick={() => setShowSecurityDetails(!showSecurityDetails)}
          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200/80 text-[11px] font-bold hover:bg-emerald-100 transition-all"
          title="Status de Criptografia, MFA e LGPD"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>MFA Ativo • AES-256</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>

        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[11px] font-semibold">
          <Activity className="w-3.5 h-3.5 text-teal-600" />
          <span>12ms</span>
          <span className="text-slate-300">•</span>
          <Smartphone className="w-3.5 h-3.5 text-sky-600" />
          <span className="text-sky-700 font-bold">PWA Ready</span>
        </div>

        {onOpenAuditLogs && (
          <button
            onClick={onOpenAuditLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[11px] font-bold hover:bg-slate-800 transition-all shadow-xs"
            title="Ver Logs de Auditoria LGPD"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Logs LGPD</span>
          </button>
        )}
      </div>

      {/* Right Navbar Actions & User Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Toolbar Icons */}
        <button
          onClick={onOpenAgenda}
          title="Abrir Agenda & Calendário"
          className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors relative"
        >
          <CalendarIcon className="w-4 h-4" />
        </button>

        {/* Message Bell Badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              3
            </span>
          </button>

          {/* Notifications Dropdown Modal */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">
                  Notificações do Sistema & Alertas
                </span>
                <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                  3 Novas
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                <div className="p-3 hover:bg-slate-50 text-xs">
                  <p className="font-semibold text-slate-800">
                    🔒 Sessão JWT Segura
                  </p>
                  <p className="text-slate-500 mt-0.5">
                    Autenticação MFA de dois fatores verificada com sucesso.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 inline-block">Agora</span>
                </div>
                <div className="p-3 hover:bg-slate-50 text-xs">
                  <p className="font-semibold text-slate-800">
                    📲 Confirmação WhatsApp
                  </p>
                  <p className="text-slate-500 mt-0.5">
                    Paciente Maria Silva confirmou consulta de amanhã.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 inline-block">Há 10 min</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Button */}
        <div className="relative border-l border-slate-200 pl-3 ml-1">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.nome}
              className={`w-9 h-9 rounded-full object-cover ring-2 ${
                isDoctor ? 'ring-teal-500' : 'ring-sky-500'
              }`}
            />
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-slate-800 leading-none">
                  {currentUser.nome}
                </p>
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                    isDoctor
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-sky-100 text-sky-800'
                  }`}
                >
                  {isDoctor ? 'MÉDICO' : 'RECEPÇÃO'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                {currentUser.cargo}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="p-3 bg-slate-50 border-b border-slate-100">
                <p className="font-bold text-sm text-slate-800">
                  {currentUser.nome}
                </p>
                <p className="text-xs text-slate-500">{currentUser.cargo}</p>
                {currentUser.crm && (
                  <p className="text-[11px] text-teal-600 font-semibold mt-0.5">
                    CRM: {currentUser.crm}
                  </p>
                )}
                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Sessão JWT: Ativa</span>
                  <span className="text-emerald-600 font-bold">MFA 🟢</span>
                </div>
              </div>
              <div className="p-1.5 flex flex-col gap-0.5 text-xs">
                {onOpenSwitchUser && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenSwitchUser();
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-teal-700 bg-teal-50 hover:bg-teal-100 font-bold transition-colors"
                  >
                    <UserCheck className="w-4 h-4 text-teal-600" />
                    <span>Trocar Perfil / Entrar como Outro</span>
                  </button>
                )}
                {onOpenAuditLogs && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenAuditLogs();
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium transition-colors"
                  >
                    <Shield className="w-4 h-4 text-amber-500" />
                    <span>Logs de Auditoria LGPD</span>
                  </button>
                )}
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onOpenSwitchUser) onOpenSwitchUser();
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 font-bold transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair do Sistema (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

