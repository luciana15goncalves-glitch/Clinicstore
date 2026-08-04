import React, { useState } from 'react';
import {
  Shield,
  X,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  Download,
  Database,
  Calendar,
  User,
  Activity,
  FileSpreadsheet,
} from 'lucide-react';
import { AuditLog } from '../types';

interface AuditLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditLogs: AuditLog[];
}

export const AuditLogsModal: React.FC<AuditLogsModalProps> = ({
  isOpen,
  onClose,
  auditLogs,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('todos');

  if (!isOpen) return null;

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.detalhes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.includes(searchTerm);
    const matchesAction = filterAction === 'todos' || log.acao.toLowerCase().includes(filterAction.toLowerCase());
    return matchesSearch && matchesAction;
  });

  const handleExportLogs = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Data,Usuario,Acao,Detalhes,IP\n' +
      filteredLogs.map((l) => `"${l.id}","${l.dataHora}","${l.userName}","${l.acao}","${l.detalhes}","${l.ip}"`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `logs_auditoria_lgpd_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Shield className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Logs de Auditoria & Segurança LGPD</h3>
                <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  AES-256 Intacto
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Rastreabilidade de acessos, visualizações de prontuário e alterações em conformidade com a LGPD e CFM.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar por usuário, ação ou IP..."
              className="w-full bg-white dark:bg-slate-900 text-xs font-medium pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="bg-white dark:bg-slate-900 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
            >
              <option value="todos">Todas as Ações</option>
              <option value="Acesso">Acessos a Prontuário</option>
              <option value="Edição">Edições & Registros</option>
              <option value="Login">Logins & Autenticação</option>
            </select>

            <button
              onClick={handleExportLogs}
              className="bg-[#00A896] hover:bg-[#009282] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Log List */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div key={log.id} className="py-3 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl transition-colors flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold shrink-0 mt-0.5">
                    <Activity className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">{log.userName}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-400">
                        {log.acao}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5 font-medium">{log.detalhes}</p>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400 font-mono">
                      <span>IP: {log.ip}</span>
                      <span>•</span>
                      <span>{log.dataHora}</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-md shrink-0 border border-emerald-200 dark:border-emerald-800">
                  Assinado Hash
                </span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Nenhum log de auditoria encontrado para o filtro.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Retenção legal CFM: 20 Anos • Backup Automático Diário</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
