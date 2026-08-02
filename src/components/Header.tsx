import React, { useState } from 'react';
import {
  Search,
  Calendar as CalendarIcon,
  LayoutGrid,
  Grid,
  Bell,
  Mail,
  ChevronDown,
  User,
  Shield,
  LogOut,
  X,
  FileText,
} from 'lucide-react';
import { CURRENT_DOCTOR, INITIAL_PATIENTS } from '../data/mockData';
import { Patient } from '../types';

interface HeaderProps {
  onSelectPatient: (patient: Patient) => void;
  onOpenAgenda: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSelectPatient, onOpenAgenda }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const filteredPatients = searchTerm.trim()
    ? INITIAL_PATIENTS.filter(
        (p) =>
          p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.cpf.includes(searchTerm) ||
          p.telefone.includes(searchTerm)
      )
    : [];

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between shrink-0 shadow-sm relative z-30">
      {/* Search Input Bar */}
      <div className="relative w-80 lg:w-96">
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
            placeholder="Buscar paciente, CPF..."
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm rounded-xl pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A896] transition-all border border-transparent focus:border-transparent"
          />
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
          <div className="absolute left-0 right-0 top-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
            <div className="p-2 border-b border-slate-100 dark:border-slate-700 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Pacientes Encontrados ({filteredPatients.length})
            </div>
            {filteredPatients.length > 0 ? (
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                {filteredPatients.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectPatient(p);
                      setShowSearchResults(false);
                      setSearchTerm('');
                    }}
                    className="w-full text-left p-3 hover:bg-teal-50 dark:hover:bg-slate-700/50 flex items-center gap-3 transition-colors group"
                  >
                    <img
                      src={p.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      alt={p.nome}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#00A896] truncate">
                        {p.nome}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        CPF: {p.cpf} • {p.telefone}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-slate-400">
                Nenhum paciente localizado para "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Navbar Actions & User Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Toolbar Icons */}
        <button
          onClick={onOpenAgenda}
          title="Abrir Agenda"
          className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors relative"
        >
          <CalendarIcon className="w-4 h-4" />
        </button>

        <button
          title="Visão em Grade"
          className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>

        <button
          title="Módulos ClinicStore"
          className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
        >
          <Grid className="w-4 h-4" />
        </button>

        {/* Message Bell Badge (11) */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors relative"
          >
            <Mail className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              11
            </span>
          </button>
        </div>

        {/* Notification Bell Badge (7) */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              7
            </span>
          </button>

          {/* Notifications Dropdown Modal */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  Notificações & Alertas
                </span>
                <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                  7 Novas
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-64 overflow-y-auto">
                <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 text-xs">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    ⚠️ Estoque Crítico
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Seringa Descartável 5ml atingiu estoque mínimo (12 unidades).
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 inline-block">Há 15 min</span>
                </div>
                <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 text-xs">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    📋 Prontuário Pendente
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    2 consultas finalizadas aguardando assinatura digital.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 inline-block">Há 45 min</span>
                </div>
                <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 text-xs">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    💬 WhatsApp Confirmado
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Maria Silva confirmou presença para as 14:00.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 inline-block">Há 1h</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Doctor User Profile Button */}
        <div className="relative border-l border-slate-200 dark:border-slate-800 pl-3 ml-1">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={CURRENT_DOCTOR.avatar}
              alt={CURRENT_DOCTOR.nome}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-teal-500/30"
            />
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-none">
                {CURRENT_DOCTOR.nome}
              </p>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                {CURRENT_DOCTOR.especialidade}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="p-3 bg-slate-50 dark:bg-slate-700/40 border-b border-slate-100 dark:border-slate-700">
                <p className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  {CURRENT_DOCTOR.nome}
                </p>
                <p className="text-xs text-slate-400">{CURRENT_DOCTOR.crm}</p>
              </div>
              <div className="p-1.5 flex flex-col gap-0.5 text-xs">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Perfil do Profissional</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors">
                  <Shield className="w-4 h-4 text-slate-400" />
                  <span>Conformidade & LGPD</span>
                </button>
                <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-medium transition-colors">
                  <LogOut className="w-4 h-4" />
                  <span>Sair do Sistema</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
