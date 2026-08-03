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
  Palette,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Plus,
  Stethoscope,
  Users,
  DollarSign,
  UserPlus,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  Sliders,
  Trash2,
} from 'lucide-react';
import { AuditLog, UserAccount, DoctorSpecialty } from '../types';
import { ClinicTheme } from './Sidebar';

interface ConfiguracoesViewProps {
  auditLogs: AuditLog[];
  currentUser: UserAccount;
  clinicLogo: string;
  onUpdateClinicLogo: (logoUrl: string) => void;
  clinicTheme: ClinicTheme;
  onUpdateClinicTheme: (theme: ClinicTheme) => void;
  doctors: DoctorSpecialty[];
  onAddDoctor: (doctor: DoctorSpecialty) => void;
  userAccounts: UserAccount[];
  onAddUserAccount: (account: UserAccount) => void;
  systemName?: string;
  onUpdateSystemName?: (name: string) => void;
}

export const ConfiguracoesView: React.FC<ConfiguracoesViewProps> = ({
  auditLogs,
  currentUser,
  clinicLogo,
  onUpdateClinicLogo,
  clinicTheme,
  onUpdateClinicTheme,
  doctors,
  onAddDoctor,
  userAccounts,
  onAddUserAccount,
  systemName = 'CLINIC MEDICAL',
  onUpdateSystemName,
}) => {
  const isAdmin = currentUser.role === 'admin';
  const [activeTab, setActiveTab] = useState<
    'personalizacao' | 'gestao_medicos' | 'gestao_usuarios' | 'auditoria' | 'permissoes' | 'lgpd'
  >(isAdmin ? 'personalizacao' : 'auditoria');

  // Personalização Local State
  const [systemNameInput, setSystemNameInput] = useState<string>(systemName);
  const [logoInput, setLogoInput] = useState<string>(clinicLogo);
  const [primaryColor, setPrimaryColor] = useState<string>(clinicTheme.primaryColor || '#00A896');
  const [secondaryColor, setSecondaryColor] = useState<string>(clinicTheme.secondaryColor || '#00B4D8');
  const [gradientName, setGradientName] = useState<string>(clinicTheme.gradientName || 'Personalizado');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Form State: Add Doctor & Specialty
  const [newDocNome, setNewDocNome] = useState('');
  const [newDocCrm, setNewDocCrm] = useState('');
  const [newDocEspecialidade, setNewDocEspecialidade] = useState('');
  const [newDocValor, setNewDocValor] = useState<number>(350);
  const [newDocDias, setNewDocDias] = useState<string>('Seg, Qua, Sex');
  const [newDocHorario, setNewDocHorario] = useState<string>('08:00 - 17:00');
  const [newDocConsultorio, setNewDocConsultorio] = useState<string>('Consultório 102');
  const [newDocDescricao, setNewDocDescricao] = useState<string>('Atendimento especializado com foco em medicina de precisão.');
  const [newDocConvenio, setNewDocConvenio] = useState<boolean>(true);
  const [docAddSuccess, setDocAddSuccess] = useState<string | null>(null);

  // Form State: Create User Login
  const [newUserNome, setNewUserNome] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserSenha, setNewUserSenha] = useState('123');
  const [newUserRole, setNewUserRole] = useState<'medico' | 'atendente' | 'admin'>('atendente');
  const [newUserCargo, setNewUserCargo] = useState('Atendente de Recepção');
  const [newUserCrm, setNewUserCrm] = useState('');
  const [newUserEspecialidade, setNewUserEspecialidade] = useState('');
  const [userAddSuccess, setUserAddSuccess] = useState<string | null>(null);

  // Preset Color Palettes (Degradê de duas cores)
  const PRESET_THEMES = [
    { name: 'Teal Esmeralda & Azul Ciano', c1: '#00A896', c2: '#00B4D8' },
    { name: 'Azul Marinho & Safira Real', c1: '#1C2541', c2: '#3A86FF' },
    { name: 'Roxo Imperial & Violeta', c1: '#4A0E17', c2: '#7209B7' },
    { name: 'Vinho Nobre & Coral Vivo', c1: '#7209B7', c2: '#F72585' },
    { name: 'Verde Menta & Oliva Profundo', c1: '#064E3B', c2: '#10B981' },
  ];

  // File Upload Handler for Logo
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setLogoInput(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePersonalizacao = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateSystemName && systemNameInput.trim()) {
      onUpdateSystemName(systemNameInput.trim());
    }
    onUpdateClinicLogo(logoInput);
    onUpdateClinicTheme({
      primaryColor,
      secondaryColor,
      gradientName,
    });
    setSaveSuccessMsg('Nome do sistema, logo e esquema de cores degradê atualizados com sucesso!');
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handleCreateDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocNome || !newDocCrm || !newDocEspecialidade) return;

    const newDoc: DoctorSpecialty = {
      id: Date.now(),
      nome: newDocNome.startsWith('Dr.') ? newDocNome : `Dr. ${newDocNome}`,
      crm: newDocCrm,
      especialidade: newDocEspecialidade,
      valorConsulta: Number(newDocValor),
      diasAtendimento: newDocDias.split(',').map((d) => d.trim()),
      horarioAtendimento: newDocHorario,
      consultorio: newDocConsultorio,
      descricao: newDocDescricao,
      atendeConvenio: newDocConvenio,
      conveniosAtendidos: ['Unimed', 'Bradesco Saúde', 'SulAmérica'],
      status: 'disponivel',
      avatar:
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    };

    onAddDoctor(newDoc);
    setDocAddSuccess(`Médico ${newDoc.nome} (${newDoc.especialidade}) cadastrado com sucesso!`);
    setNewDocNome('');
    setNewDocCrm('');
    setNewDocEspecialidade('');
    setTimeout(() => setDocAddSuccess(null), 4000);
  };

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserNome || !newUserEmail) return;

    const newUser: UserAccount = {
      id: Date.now(),
      nome: newUserNome,
      email: newUserEmail,
      senha: newUserSenha || '123',
      role: newUserRole,
      cargo: newUserCargo,
      crm: newUserRole === 'medico' ? newUserCrm : undefined,
      especialidade: newUserRole === 'medico' ? newUserEspecialidade : undefined,
      avatar:
        newUserRole === 'medico'
          ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
          : newUserRole === 'admin'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    };

    onAddUserAccount(newUser);
    setUserAddSuccess(`Login para ${newUser.nome} (${newUser.cargo}) criado com sucesso!`);
    setNewUserNome('');
    setNewUserEmail('');
    setNewUserCrm('');
    setNewUserEspecialidade('');
    setTimeout(() => setUserAddSuccess(null), 4000);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#00A896]" />
            <h2 className="text-xl font-black text-slate-900">
              Configurações do Sistema & Gestão Administrativa
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Personalização visual da marca, gerenciamento de equipe, médicos, valores e auditoria LGPD
          </p>
        </div>

        {/* Tab Selector */}
        <div className="bg-slate-100 p-1 rounded-2xl flex flex-wrap items-center gap-1">
          {isAdmin && (
            <button
              onClick={() => setActiveTab('personalizacao')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'personalizacao'
                  ? 'bg-white text-[#00A896] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Personalização (Logo & Cores)</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('gestao_medicos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'gestao_medicos'
                ? 'bg-white text-[#00A896] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Médicos & Valores</span>
            {!isAdmin && (
              <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-black">
                ADMIN
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('gestao_usuarios')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'gestao_usuarios'
                ? 'bg-white text-[#00A896] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Logins & Usuários</span>
            {!isAdmin && (
              <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-black">
                ADMIN
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('auditoria')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'auditoria'
                ? 'bg-white text-[#00A896] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Logs de Auditoria</span>
          </button>

          <button
            onClick={() => setActiveTab('permissoes')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'permissoes'
                ? 'bg-white text-[#00A896] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Permissões
          </button>
        </div>
      </div>

      {/* TAB 1: Personalização do Sistema (Logo & Cores Degradê) - EXCLUSIVO ADMINISTRADOR */}
      {activeTab === 'personalizacao' && isAdmin && (
        <form onSubmit={handleSavePersonalizacao} className="space-y-6">
          {saveSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 animate-fade-in shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Box 1: Logo da Clínica */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="p-2 rounded-xl bg-teal-50 text-[#00A896]">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Enviar Logo da Clínica
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sua marca será exibida no menu lateral, relatórios e documentos da clínica
                  </p>
                </div>
              </div>

              {/* Current Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
                <img
                  src={logoInput}
                  alt="Logo preview"
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/30 bg-white p-1 shadow-md shrink-0"
                />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800">Visualização em Tempo Real</p>
                  <p className="text-[11px] text-slate-400">
                    PNG, JPG ou SVG com fundo transparente recomendado (Mínimo 200x200px)
                  </p>
                </div>
              </div>

              {/* Editable System Name / Clinic Name */}
              <div className="pt-2 space-y-1.5 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800">
                  Nome do Sistema / Nome da Clínica *
                </label>
                <p className="text-[11px] text-slate-400">
                  Defina o nome de identificação exibido no topo do menu lateral e cabeçalho do sistema
                </p>
                <input
                  type="text"
                  required
                  value={systemNameInput}
                  onChange={(e) => setSystemNameInput(e.target.value)}
                  placeholder="Ex: CLINIC MEDICAL, Clínica Santa Luzia..."
                  className="w-full bg-slate-50 text-xs font-bold text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                />
              </div>

              {/* Upload Input */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700">
                  Fazer Upload de Nova Imagem da Logo:
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm">
                    <Upload className="w-4 h-4 text-teal-400" />
                    <span>Selecionar Arquivo da Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ou insira a URL da Logo:
                  </label>
                  <input
                    type="url"
                    value={logoInput}
                    onChange={(e) => setLogoInput(e.target.value)}
                    placeholder="https://exemplo.com/logo.png"
                    className="w-full bg-slate-50 text-xs font-medium text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                  />
                </div>
              </div>
            </div>

            {/* Box 2: Mudar as Cores para Degradê */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="p-2 rounded-xl bg-teal-50 text-[#00A896]">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Esquema de Cores em Degradê (2 Cores Padrões)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Defina o tom de degradê da barra lateral e barras de destaque
                  </p>
                </div>
              </div>

              {/* Preset Palette Buttons */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                  Escolher Paleta Predefinida de Degradê:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRESET_THEMES.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setPrimaryColor(preset.c1);
                        setSecondaryColor(preset.c2);
                        setGradientName(preset.name);
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 transition-all flex items-center justify-between text-left group bg-slate-50 hover:bg-white"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-teal-600 truncate">
                          {preset.name}
                        </p>
                      </div>
                      <div
                        className="w-12 h-6 rounded-lg shadow-inner shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${preset.c1}, ${preset.c2})`,
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Cor Primária (Início do Degradê)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full bg-slate-50 text-xs font-mono font-bold text-slate-800 p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Cor Secundária (Fim do Degradê)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-full bg-slate-50 text-xs font-mono font-bold text-slate-800 p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Live Banner Preview */}
              <div className="pt-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                  Pré-Visualização do Degradê Personalizado:
                </label>
                <div
                  className="h-20 rounded-2xl p-4 text-white flex items-center justify-between shadow-lg border border-white/20 transition-all"
                  style={{
                    background: `linear-gradient(135deg, #090D16 0%, ${primaryColor} 50%, ${secondaryColor} 100%)`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <img src={logoInput} alt="Logo" className="w-9 h-9 rounded-xl object-cover bg-white p-0.5" />
                    <div>
                      <p className="font-black text-sm">CLINIC MEDICAL</p>
                      <p className="text-[10px] text-white/80 font-bold">Menu Lateral Degradê Personalizado</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
                    {gradientName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-3.5 bg-[#00A896] hover:bg-[#009282] text-white text-xs font-extrabold rounded-2xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Salvar e Aplicar Personalização do Sistema</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Gestão de Médicos, Especialidades e Valores (Exclusivo Administrador) */}
      {activeTab === 'gestao_medicos' && (
        <div className="space-y-6">
          {!isAdmin && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-3 shadow-sm">
              <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <p className="font-extrabold">Acesso Restrito ao Administrador</p>
                <p className="text-[11px] text-amber-800 font-medium">
                  Somente o login de **ADMINISTRADOR** tem permissão para cadastrar novos médicos, especialidades e alterar os valores das consultas.
                </p>
              </div>
            </div>
          )}

          {docAddSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{docAddSuccess}</span>
            </div>
          )}

          {/* Form to Add New Doctor/Specialty (Only enabled for Admin) */}
          <div className={`bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5 ${!isAdmin ? 'opacity-60 pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-50 text-[#00A896]">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Cadastrar Novo Médico, Especialidade & Valor da Consulta
                  </h3>
                  <p className="text-xs text-slate-400">
                    Adicione profissionais ao corpo clínico da clínica e configure os valores de honorários
                  </p>
                </div>
              </div>

              <span className="text-xs font-extrabold px-3 py-1 bg-amber-100 text-amber-900 rounded-full">
                Exclusivo Administrador
              </span>
            </div>

            <form onSubmit={handleCreateDoctorSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome Completo do Médico *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dr. Roberto Guimarães"
                    value={newDocNome}
                    onChange={(e) => setNewDocNome(e.target.value)}
                    className="w-full bg-slate-50 text-xs font-medium text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    CRM com Estado *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: CRM/SP 198.432"
                    value={newDocCrm}
                    onChange={(e) => setNewDocCrm(e.target.value)}
                    className="w-full bg-slate-50 text-xs font-medium text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Especialidade Principal *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Neurologia, Ortopedia, Pediatria..."
                    value={newDocEspecialidade}
                    onChange={(e) => setNewDocEspecialidade(e.target.value)}
                    className="w-full bg-slate-50 text-xs font-medium text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Valor da Consulta Particular (R$) *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-slate-400">R$</span>
                    <input
                      type="number"
                      required
                      min={0}
                      step={10}
                      value={newDocValor}
                      onChange={(e) => setNewDocValor(Number(e.target.value))}
                      className="w-full bg-slate-50 text-xs font-extrabold text-slate-900 pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dias de Atendimento
                  </label>
                  <input
                    type="text"
                    value={newDocDias}
                    onChange={(e) => setNewDocDias(e.target.value)}
                    placeholder="Seg, Ter, Qui"
                    className="w-full bg-slate-50 text-xs font-medium text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Horário de Atendimento
                  </label>
                  <input
                    type="text"
                    value={newDocHorario}
                    onChange={(e) => setNewDocHorario(e.target.value)}
                    placeholder="08:00 - 17:00"
                    className="w-full bg-slate-50 text-xs font-medium text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Consultório
                  </label>
                  <input
                    type="text"
                    value={newDocConsultorio}
                    onChange={(e) => setNewDocConsultorio(e.target.value)}
                    placeholder="Consultório 102"
                    className="w-full bg-slate-50 text-xs font-medium text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={newDocConvenio}
                    onChange={(e) => setNewDocConvenio(e.target.checked)}
                    className="w-4 h-4 rounded text-[#00A896] focus:ring-[#00A896]"
                  />
                  <span>Aceita Convênios Médicos (Unimed, Bradesco, etc.)</span>
                </label>

                <button
                  type="submit"
                  disabled={!isAdmin}
                  className="px-5 py-2.5 bg-[#00A896] hover:bg-[#009282] text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Cadastrar Médico & Especialidade</span>
                </button>
              </div>
            </form>
          </div>

          {/* List of Active Doctors */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">
              Corpo Clínico Cadastrado ({doctors.length} Médicos)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start gap-3 justify-between"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={doc.avatar}
                      alt={doc.nome}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shrink-0"
                    />
                    <div>
                      <p className="font-extrabold text-xs text-slate-900">{doc.nome}</p>
                      <p className="text-[11px] font-bold text-emerald-600">{doc.especialidade}</p>
                      <p className="text-[10px] text-slate-400">{doc.crm}</p>
                      <p className="text-[10px] text-slate-600 font-semibold mt-1">
                        Consulta: R$ {doc.valorConsulta},00
                      </p>
                    </div>
                  </div>

                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Ativo
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Gestão de Equipe & Criação de Logins (Exclusivo Administrador) */}
      {activeTab === 'gestao_usuarios' && (
        <div className="space-y-6">
          {!isAdmin && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-3 shadow-sm">
              <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <p className="font-extrabold">Acesso Restrito ao Administrador</p>
                <p className="text-[11px] text-amber-800 font-medium">
                  Somente o login de **ADMINISTRADOR** pode criar novos logins de acesso para médicos, atendentes e outros administradores.
                </p>
              </div>
            </div>
          )}

          {userAddSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{userAddSuccess}</span>
            </div>
          )}

          {/* Form to Create New User Login */}
          <div className={`bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5 ${!isAdmin ? 'opacity-60 pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-50 text-[#00A896]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Criar Novo Login de Acesso (Médicos e Atendentes)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Cadastre credenciais e vincule o perfil de acesso às abas autorizadas do sistema
                  </p>
                </div>
              </div>

              <span className="text-xs font-extrabold px-3 py-1 bg-amber-100 text-amber-900 rounded-full">
                Exclusivo Administrador
              </span>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome Completo do Usuário *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Juliana Prado"
                    value={newUserNome}
                    onChange={(e) => setNewUserNome(e.target.value)}
                    className="w-full bg-slate-50 text-xs font-medium text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    E-mail de Login *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="usuario@clinicmedical.com.br"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full bg-slate-50 text-xs font-medium text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Senha Provisória
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserSenha}
                    onChange={(e) => setNewUserSenha(e.target.value)}
                    className="w-full bg-slate-50 text-xs font-medium text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tipo de Perfil de Acesso (Role) *
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => {
                      const role = e.target.value as 'medico' | 'atendente' | 'admin';
                      setNewUserRole(role);
                      if (role === 'atendente') setNewUserCargo('Atendente da Recepção');
                      if (role === 'medico') setNewUserCargo('Médico Especialista');
                      if (role === 'admin') setNewUserCargo('Administrador Geral');
                    }}
                    className="w-full bg-slate-50 text-xs font-bold text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                  >
                    <option value="atendente">Atendente de Recepção (Agenda & Especialidades)</option>
                    <option value="medico">Médico (Prontuário & Pacientes & Agenda)</option>
                    <option value="admin">Administrador (Acesso Total A Todas as Abas)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cargo Exibido no Perfil
                  </label>
                  <input
                    type="text"
                    value={newUserCargo}
                    onChange={(e) => setNewUserCargo(e.target.value)}
                    className="w-full bg-slate-50 text-xs font-medium text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                {newUserRole === 'medico' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      CRM do Médico
                    </label>
                    <input
                      type="text"
                      placeholder="CRM/SP 000.000"
                      value={newUserCrm}
                      onChange={(e) => setNewUserCrm(e.target.value)}
                      className="w-full bg-slate-50 text-xs font-medium text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={!isAdmin}
                  className="px-5 py-2.5 bg-[#00A896] hover:bg-[#009282] text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4 stroke-[2.5]" />
                  <span>Criar Login de Usuário</span>
                </button>
              </div>
            </form>
          </div>

          {/* List of Active Accounts */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">
              Logins Cadastrados no Sistema ({userAccounts.length} Contas)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userAccounts.map((acc) => {
                const isAdminAcc = acc.role === 'admin';
                const isDocAcc = acc.role === 'medico';

                return (
                  <div
                    key={acc.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center gap-3 justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={acc.avatar}
                        alt={acc.nome}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-extrabold text-xs text-slate-900 truncate">
                          {acc.nome}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">{acc.email}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{acc.cargo}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                        isAdminAcc
                          ? 'bg-amber-100 text-amber-900'
                          : isDocAcc
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {isAdminAcc ? 'ADMIN' : isDocAcc ? 'MÉDICO' : 'ATENDENTE'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Logs de Auditoria LGPD */}
      {activeTab === 'auditoria' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>Registro Oficial de Logs de Auditoria (Rastreabilidade LGPD)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Em conformidade com as resoluções do CFM e Artigo 37 da LGPD
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Data / Hora</th>
                  <th className="py-3 px-3">Usuário</th>
                  <th className="py-3 px-3">Ação</th>
                  <th className="py-3 px-3">Recurso</th>
                  <th className="py-3 px-3">IP Origem</th>
                  <th className="py-3 px-3">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-semibold text-slate-700">{log.timestamp}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{log.userName}</td>
                    <td className="py-3 px-3">
                      <span className="font-mono bg-slate-100 text-teal-700 px-2 py-0.5 rounded font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-600">
                      {log.resourceType} #{log.resourceId}
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono">{log.ipAddress}</td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Permissões RBAC Matrix */}
      {activeTab === 'permissoes' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Matriz de Controle de Acesso Baseado em Perfis (RBAC)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <h4 className="font-bold text-amber-900 text-sm">Perfil Administrador</h4>
              <p className="text-xs text-amber-800/80 mt-1">
                Acesso irrestrito a todas as abas: Financeiro, Relatórios, Agenda, Prontuários, Pacientes, Especialidades, Criação de Logins, Gestão de Médicos/Valores e Personalização.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <h4 className="font-bold text-emerald-900 text-sm">Perfil Médico</h4>
              <p className="text-xs text-emerald-800/80 mt-1">
                Acesso direcionado ao Prontuário Eletrônico Eletrônico, Prescrições, Lista de Pacientes e Agenda. (Financeiro e Relatórios bloqueados).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
              <h4 className="font-bold text-sky-900 text-sm">Perfil Atendente de Recepção</h4>
              <p className="text-xs text-sky-800/80 mt-1">
                Acesso focado na Agenda & Agendamento de Consultas e Consulta a Especialidades. (Acesso ao Financeiro, Relatórios e Prontuários Médicos bloqueados).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
