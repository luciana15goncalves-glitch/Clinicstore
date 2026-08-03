import React, { useState, useRef, useEffect } from 'react';
import {
  HelpCircle,
  BookOpen,
  Wrench,
  MessageSquare,
  PhoneCall,
  Send,
  Upload,
  CheckCircle2,
  FileText,
  Calendar,
  Stethoscope,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  LifeBuoy,
  X,
  Mail,
  MailCheck,
  Clock,
  Headphones,
  Bot,
  User as UserIcon,
  Sparkles,
} from 'lucide-react';
import { UserAccount } from '../types';

interface SuporteViewProps {
  currentUser: UserAccount;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export const SuporteView: React.FC<SuporteViewProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'faq' | 'chamado' | 'chat'>('manual');

  // Form State for Ticket Submission (EMAIL)
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketUserEmail, setTicketUserEmail] = useState(currentUser.email || 'usuario@clinica.com.br');
  const [ticketPhone, setTicketPhone] = useState('(11) 99876-5432');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketScreenshot, setTicketScreenshot] = useState<string | null>(null);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticketProtocol, setTicketProtocol] = useState('');

  // Accordion state for FAQ
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'agent',
      text: `Olá, ${currentUser.nome}! Bem-vindo ao Chat de Atendimento do Suporte Técnico. Nosso horário de atendimento é de Segunda a Sábado, das 08h00 às 18h00. Como posso te ajudar hoje?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setTicketScreenshot(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle || !ticketDescription) return;

    const protocolNum = `#SUP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketProtocol(protocolNum);
    setTicketSubmitted(true);
  };

  const handleSendChatMessage = (textToSend?: string) => {
    const text = (textToSend || chatInput).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput('');
    setIsTyping(true);

    // Simulate Agent Auto Response
    setTimeout(() => {
      let replyText = 'Entendido! Nossa equipe técnica está verificando os dados do sistema para te orientar.';
      const lower = text.toLowerCase();

      if (lower.includes('receita') || lower.includes('pdf') || lower.includes('prescrição')) {
        replyText =
          'Para gerar a Receita Médica em PDF, acesse a aba "Prontuário", selecione a consulta do paciente e clique no botão "Gerar Receita PDF" na seção de prescrição.';
      } else if (lower.includes('valor') || lower.includes('preço') || lower.includes('consulta')) {
        replyText =
          'A alteração de valores de consulta é permitida apenas para o perfil de ADMINISTRADOR na aba "Configurações" -> guia "Médicos & Valores".';
      } else if (lower.includes('financeiro') || lower.includes('relatório') || lower.includes('acesso')) {
        replyText =
          'As abas Financeiro e Relatórios são restritas ao login de Administrador por questões de segurança e conformidade LGPD.';
      } else if (lower.includes('agendamento') || lower.includes('agenda') || lower.includes('horário')) {
        replyText =
          'Para agendar, acesse a aba "Agenda & Calendário", clique em "+ Nova Consulta" no topo, escolha o paciente, especialista e horário desejado.';
      } else {
        replyText =
          'Obrigado pelo contato! Registramos sua dúvida. Nosso atendente humano pode responder em instantes se necessário. Horário de atendimento: Seg a Sáb, das 08h00 às 18h00.';
      }

      const agentMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const MANUAL_SECTIONS = [
    {
      id: 'agenda',
      title: '1. Agenda & Agendamento de Consultas',
      icon: Calendar,
      color: 'text-sky-500 bg-sky-50',
      content:
        'Na aba "Agenda & Calendário", você pode visualizar o calendário por dia, semana ou mês. Para realizar um novo agendamento, clique em "+ Nova Consulta". Selecione o paciente ou cadastre um novo na hora, escolha o médico especialista (o valor da consulta particular será preenchido automaticamente) e defina o horário. O status pode ser atualizado para Confirmado, Em Atendimento ou Concluído.',
    },
    {
      id: 'prontuario',
      title: '2. Prontuário Eletrônico & Anamnese',
      icon: FileText,
      color: 'text-emerald-500 bg-emerald-50',
      content:
        'Acessível para Médicos e Administradores. Permite registrar a Queixa Principal, Anamnese, Exame Físico e Hipótese Diagnóstica (CID-10). Possui emissor de Prescrição Médica em PDF com assinatura eletrônica e QR Code de autenticidade para imprimir ou enviar ao paciente.',
    },
    {
      id: 'especialidades',
      title: '3. Especialidades & Corpo Clínico',
      icon: Stethoscope,
      color: 'text-purple-500 bg-purple-50',
      content:
        'Lista todos os médicos da clínica com CRM, especialidade, dias de atendimento e valor da consulta particular. O Administrador pode cadastrar novos médicos e alterar os valores praticados.',
    },
    {
      id: 'financeiro',
      title: '4. Faturamento TISS & Relatórios (Exclusivo Admin)',
      icon: ShieldCheck,
      color: 'text-amber-500 bg-amber-50',
      content:
        'Módulo exclusivo para Administradores. Permite gerar lotes de guias TISS para operadoras de plano de saúde (Unimed, Bradesco, etc.), monitorar glosas e consultar gráficos de faturamento mensal e anual.',
    },
  ];

  const FAQ_ITEMS = [
    {
      question: 'Como faço para alterar o valor da consulta de um médico?',
      answer:
        'Somente o login de **ADMINISTRADOR** pode alterar valores. Acesse a aba "Configurações", clique na guia "Médicos & Valores", preencha o novo valor no formulário ou edite os dados do profissional e clique em Salvar.',
    },
    {
      question: 'Não consigo acessar as abas Financeiro e Relatórios. O que fazer?',
      answer:
        'As abas Financeiro TISS e Relatórios são de acesso **exclusivo do perfil ADMINISTRADOR**. Se você estiver logado como Atendente de Recepção ou Médico, o sistema restringe o acesso por questões de segurança e LGPD.',
    },
    {
      question: 'Como exportar ou imprimir uma Receita Médica em PDF?',
      answer:
        'Na aba "Prontuário", selecione a consulta do paciente e vá até o painel de Prescrição. Clique no botão "Gerar Receita PDF". O documento será gerado com cabeçalho da clínica, QR Code e opção de impressão direta.',
    },
    {
      question: 'Esqueci a senha de um usuário ou preciso criar um novo login de atendente.',
      answer:
        'O Administrador pode criar e redefinir logins acessando "Configurações" -> "Logins & Usuários". Lá é possível cadastrar nome, e-mail, senha provisória e atribuir a função (Médico, Atendente ou Admin).',
    },
    {
      question: 'O sistema está lento ou o agendamento não salvou. O que verificar?',
      answer:
        'Verifique se sua conexão de internet está estável. Caso persista, recarregue a página (F5) ou limpe o cache do navegador. Se necessário, abra um chamado de suporte enviando um e-mail com o print da tela.',
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Banner with Operating Hours Info */}
      <div className="bg-[#0B132B] text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">
                Central de Suporte & Treinamento do Sistema
              </h2>
              <p className="text-xs text-slate-300">
                Manual de uso, abertura de chamados via e-mail e chat de suporte online
              </p>
            </div>
          </div>

          {/* Operating Hours Banner Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-bold text-teal-300">
            <Clock className="w-4 h-4 text-teal-400" />
            <span>Horário de Atendimento do Suporte: Segunda a Sábado, das 08h00 às 18h00</span>
          </div>
        </div>

        {/* Direct Online Support Chat Action */}
        <button
          onClick={() => setActiveTab('chat')}
          className="relative z-10 px-5 py-3.5 bg-[#00A896] hover:bg-[#009282] text-white font-black text-xs rounded-2xl flex items-center gap-2.5 shadow-lg transition-all active:scale-95 shrink-0"
        >
          <Headphones className="w-5 h-5" />
          <span>Iniciar Chat de Atendimento Online</span>
        </button>
      </div>

      {/* Tabs selector */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-sm flex flex-wrap items-center gap-1">
        <button
          onClick={() => setActiveTab('manual')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'manual'
              ? 'bg-[#00A896] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Manual de Instruções</span>
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'faq'
              ? 'bg-[#00A896] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Possíveis Problemas & Soluções</span>
        </button>

        <button
          onClick={() => setActiveTab('chamado')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'chamado'
              ? 'bg-[#00A896] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Enviar Chamado por E-mail</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'chat'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Headphones className="w-4 h-4 text-teal-400" />
          <span>Chat de Suporte Online</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>
      </div>

      {/* TAB 1: Manual de Instruções */}
      {activeTab === 'manual' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MANUAL_SECTIONS.map((sec) => {
            const IconComp = sec.icon;
            return (
              <div
                key={sec.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${sec.color}`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-sm text-slate-900">{sec.title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{sec.content}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: FAQ & Possíveis Problemas */}
      {activeTab === 'faq' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#00A896]" />
              <span>Resolução Rápida de Dúvidas e Problemas Frequentes</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Clique nas perguntas para visualizar as orientações passo a passo
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-all bg-slate-50"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-4 font-bold text-xs text-slate-800 flex items-center justify-between gap-3 hover:bg-slate-100"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#00A896] shrink-0" />
                      <span>{item.question}</span>
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-4 bg-white border-t border-slate-200 text-xs text-slate-600 leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Abrir Chamado por E-mail (Envia para e-mail de suporte) */}
      {activeTab === 'chamado' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#00A896]" />
                <span>Envio de Chamado Técnico por E-mail</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Os dados e o print anexo serão enviados para{' '}
                <strong className="text-slate-700">suporte@clinicmedical.com.br</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl shrink-0">
              <Clock className="w-4 h-4 text-[#00A896]" />
              <span>Atendimento: Seg a Sáb das 08h00 às 18h00</span>
            </div>
          </div>

          {ticketSubmitted ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <MailCheck className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-emerald-950 text-lg">
                  Chamado Enviado com Sucesso para o E-mail de Suporte!
                </h4>
                <p className="text-xs font-bold text-emerald-800">
                  E-mail de Destino: suporte@clinicmedical.com.br
                </p>
                <p className="text-xs text-emerald-700">
                  Protocolo Gerado: <strong className="font-mono bg-emerald-200/70 px-2 py-0.5 rounded">{ticketProtocol}</strong>
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-emerald-200 max-w-lg mx-auto text-left text-xs text-slate-600 space-y-1.5 shadow-sm">
                <p><strong>Solicitante:</strong> {ticketUserEmail}</p>
                <p><strong>Título:</strong> {ticketTitle}</p>
                <p><strong>Telefone:</strong> {ticketPhone}</p>
                <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                  Nossa equipe técnica analisará as informações enviadas e responderá em até 15 minutos para o seu e-mail cadastrado.
                </p>
              </div>

              <button
                onClick={() => {
                  setTicketSubmitted(false);
                  setTicketTitle('');
                  setTicketDescription('');
                  setTicketScreenshot(null);
                }}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all"
              >
                Abrir Novo Chamado por E-mail
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Título do Problema ou Dúvida *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Erro ao exportar prontuário de paciente ou agendamento"
                    value={ticketTitle}
                    onChange={(e) => setTicketTitle(e.target.value)}
                    className="w-full bg-slate-50 text-xs font-medium text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Seu E-mail para Resposta *
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
                    <input
                      type="email"
                      required
                      placeholder="usuario@clinica.com.br"
                      value={ticketUserEmail}
                      onChange={(e) => setTicketUserEmail(e.target.value)}
                      className="w-full bg-slate-50 text-xs font-medium text-slate-800 pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Telefone para Contato *
                  </label>
                  <div className="relative flex items-center">
                    <PhoneCall className="w-4 h-4 text-slate-400 absolute left-3" />
                    <input
                      type="text"
                      required
                      placeholder="(11) 99876-5432"
                      value={ticketPhone}
                      onChange={(e) => setTicketPhone(e.target.value)}
                      className="w-full bg-slate-50 text-xs font-medium text-slate-800 pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descrição Detalhada do Problema *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explique com detalhes o que ocorreu no sistema para que nosso suporte possa resolver rapidamente..."
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  className="w-full bg-slate-50 text-xs font-medium text-slate-800 p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                />
              </div>

              {/* Upload print de tela */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Anexar Print de Tela (Opcional):
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm">
                    <Upload className="w-4 h-4 text-teal-400" />
                    <span>Carregar Imagem da Tela</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      className="hidden"
                    />
                  </label>
                  {ticketScreenshot && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Print anexado com sucesso
                    </span>
                  )}
                </div>

                {ticketScreenshot && (
                  <div className="pt-2">
                    <img
                      src={ticketScreenshot}
                      alt="Print do erro"
                      className="max-h-40 rounded-xl border border-slate-300 object-contain bg-black/5 p-1"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <p className="text-xs text-slate-400">
                  Destino: <strong className="text-slate-600">suporte@clinicmedical.com.br</strong>
                </p>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#00A896] hover:bg-[#009282] text-white text-xs font-extrabold rounded-2xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar E-mail para o Suporte</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 4: Chat de Suporte Online (Atendimento Direto) */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg overflow-hidden flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-teal-400" />
                </div>
                <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 absolute -bottom-0.5 -right-0.5" />
              </div>

              <div>
                <h3 className="font-black text-sm text-white flex items-center gap-2">
                  <span>Atendimento Online do Suporte</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Online
                  </span>
                </h3>
                <p className="text-[11px] text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-teal-400" />
                  <span>Horário de Atendimento: Seg a Sáb das 08h00 às 18h00</span>
                </p>
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-400 hidden sm:block">
              <span>Atendente Técnico em Tempo Real</span>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">Dúvidas rápidas:</span>
            <button
              onClick={() => handleSendChatMessage('Como gerar receita médica em PDF?')}
              className="px-3 py-1 bg-white hover:bg-slate-200 border border-slate-200 rounded-full text-[11px] font-bold text-slate-700 shrink-0 transition-colors"
            >
              Como gerar receita em PDF?
            </button>
            <button
              onClick={() => handleSendChatMessage('Como alterar o valor da consulta médica?')}
              className="px-3 py-1 bg-white hover:bg-slate-200 border border-slate-200 rounded-full text-[11px] font-bold text-slate-700 shrink-0 transition-colors"
            >
              Alterar valor de consulta?
            </button>
            <button
              onClick={() => handleSendChatMessage('Como agendar uma nova consulta na agenda?')}
              className="px-3 py-1 bg-white hover:bg-slate-200 border border-slate-200 rounded-full text-[11px] font-bold text-slate-700 shrink-0 transition-colors"
            >
              Como agendar consulta?
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {chatMessages.map((msg) => {
              const isAgent = msg.sender === 'agent';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isAgent ? 'justify-start' : 'justify-end'}`}
                >
                  {isAgent && (
                    <div className="w-8 h-8 rounded-xl bg-[#00A896] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 ${
                      isAgent
                        ? 'bg-white text-slate-800 border border-slate-200/80 shadow-sm rounded-tl-none'
                        : 'bg-[#00A896] text-white shadow-md rounded-tr-none font-medium'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div
                      className={`text-[10px] text-right font-semibold ${
                        isAgent ? 'text-slate-400' : 'text-teal-100'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {!isAgent && (
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 italic font-medium pl-2">
                <Bot className="w-4 h-4 text-[#00A896] animate-spin" />
                <span>Atendente de Suporte digitando...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChatMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Digite sua dúvida ou mensagem de suporte..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-slate-50 text-xs font-medium text-slate-800 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#00A896] hover:bg-[#009282] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Enviar</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
