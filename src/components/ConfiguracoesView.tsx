import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  UserCheck,
  Lock,
  Database,
  Building,
  Key,
  Eye,
  FileCheck,
} from 'lucide-react';
import { AuditLog } from '../types';

interface ConfiguracoesViewProps {
  auditLogs: AuditLog[];
}

export const ConfiguracoesView: React.FC<ConfiguracoesViewProps> = ({ auditLogs }) => {
  const [activeTab, setActiveTab] = useState<'perfil' | 'permissoes' | 'auditoria' | 'lgpd'>('auditoria');

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Configurações, Permissões RBAC & Auditoria LGPD
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestão de perfis de acesso, logs de auditoria e encarregado DPO da clínica
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl flex items-center">
          <button
            onClick={() => setActiveTab('auditoria')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'auditoria'
                ? 'bg-white dark:bg-slate-700 text-[#00A896] shadow-sm'
                : 'text-slate-500'
            }`}
          >
            Logs de Auditoria
          </button>
          <button
            onClick={() => setActiveTab('permissoes')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'permissoes'
                ? 'bg-white dark:bg-slate-700 text-[#00A896] shadow-sm'
                : 'text-slate-500'
            }`}
          >
            Permissões RBAC
          </button>
          <button
            onClick={() => setActiveTab('lgpd')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'lgpd'
                ? 'bg-white dark:bg-slate-700 text-[#00A896] shadow-sm'
                : 'text-slate-500'
            }`}
          >
            DPO & Privacidade
          </button>
        </div>
      </div>

      {/* Tab 1: Audit Logs */}
      {activeTab === 'auditoria' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>Registro Oficial de Logs de Auditoria (Rastreabilidade de Acessos)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Em conformidade com as resoluções do CFM e Artigo 37 da LGPD (Retenção obrigatória por 5 anos)
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Data / Hora</th>
                  <th className="py-3 px-3">Usuário</th>
                  <th className="py-3 px-3">Ação</th>
                  <th className="py-3 px-3">Recurso</th>
                  <th className="py-3 px-3">IP Origem</th>
                  <th className="py-3 px-3">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-100">
                      {log.userName}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-400 px-2 py-0.5 rounded font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-600 dark:text-slate-300">
                      {log.resourceType} #{log.resourceId}
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono">{log.ipAddress}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: RBAC Matrix */}
      {activeTab === 'permissoes' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Matriz de Controle de Acesso Baseado em Perfis (RBAC)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900">
              <h4 className="font-bold text-teal-800 dark:text-teal-300">Perfil Admin</h4>
              <p className="text-xs text-slate-500 mt-1">Acesso total a relatórios, financeiro, usuários e configurações.</p>
            </div>
            <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900">
              <h4 className="font-bold text-sky-800 dark:text-sky-300">Perfil Médico</h4>
              <p className="text-xs text-slate-500 mt-1">Acesso focado a agenda, prontuários, prescrições e estoque de insumos.</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
              <h4 className="font-bold text-amber-800 dark:text-amber-300">Perfil Secretária</h4>
              <p className="text-xs text-slate-500 mt-1">Acesso restrito a recepção, confirmação de horários e lançamento básico.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: DPO Contact */}
      {activeTab === 'lgpd' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Encarregado de Proteção de Dados (DPO) & Política de Privacidade
          </h3>
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 max-w-xl">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Nome do DPO responsável:
              </label>
              <input
                type="text"
                defaultValue="Dra. Luciana Gonçalves (DPO / Compliance)"
                className="w-full bg-slate-100 dark:bg-slate-800 border rounded-xl p-2.5 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                E-mail para solicitações dos titulares (LGPD):
              </label>
              <input
                type="email"
                defaultValue="dpo@clinicstore.com.br"
                className="w-full bg-slate-100 dark:bg-slate-800 border rounded-xl p-2.5 text-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
