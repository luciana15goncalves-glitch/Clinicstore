import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  Clock,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Users,
  Lock,
  Zap,
  DollarSign,
  QrCode,
  Building,
  ChevronRight,
  ArrowRight,
  X,
  Stethoscope,
} from 'lucide-react';
import { UserAccount } from '../types';

interface AssinaturaViewProps {
  currentUser: UserAccount;
  systemName?: string;
}

export const AssinaturaView: React.FC<AssinaturaViewProps> = ({ currentUser, systemName = 'CLINIC MEDICAL' }) => {
  const isAdmin = currentUser.role === 'admin';
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao' | 'boleto'>('pix');
  const [renewSuccess, setRenewSuccess] = useState(false);

  // Subscription Mock Specs
  const planDetails = {
    nomeSistema: `${systemName} — Licença Gestão Médica Gold`,
    plano: 'Licença Semestral (6 Meses)',
    valorMensal: 189.90,
    valorTotalSemestral: 189.90 * 6, // R$ 1.139,40
    dataAdesao: '01/03/2026',
    dataVencimento: '01/09/2026',
    diasRestantes: 28,
    status: 'Ativa — Necessita Renovação em Breve',
  };

  const INCLUDED_FEATURES = [
    {
      title: 'Prontuário Eletrônico & Anamnese CFM',
      desc: 'Histórico clínico completo, emissor de receitas com QR Code e assinatura digital.',
      icon: FileText,
    },
    {
      title: 'Módulo de Faturamento & Guias TISS',
      desc: 'Geração de arquivos XML TISS, controle de faturamento particular e convênios.',
      icon: ShieldCheck,
    },
    {
      title: 'Agenda Médica de Alta Densidade',
      desc: 'Visualização por dia, semana ou mês com marcação rápida e controle de horários.',
      icon: Calendar,
    },
    {
      title: 'Perfis de Usuário Ilimitados',
      desc: 'Cadastre quantos médicos, recepcionistas e administradores desejar sem custo extra.',
      icon: Users,
    },
    {
      title: 'Personalização Visual da Clínica',
      desc: 'Upload de logo oficial e customização de cores da interface em degradê.',
      icon: Sparkles,
    },
    {
      title: 'Suporte Técnico Prioritário 24/7',
      desc: 'Atendimento via WhatsApp online, resolução de dúvidas e backup automático LGPD.',
      icon: Zap,
    },
  ];

  const handleConfirmPayment = () => {
    setRenewSuccess(true);
    setTimeout(() => {
      setRenewSuccess(false);
      setIsRenewModalOpen(false);
    }, 3500);
  };

  if (!isAdmin) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Acesso Restrito ao Administrador</h2>
        <p className="text-xs text-slate-500">
          A aba de Gerenciamento da Assinatura e Licença do sistema é visível exclusivamente para o perfil **ADMINISTRADOR**.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 shadow-xl border border-slate-700/80 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Licença de Uso Ativa</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight leading-tight">
            {planDetails.nomeSistema}
          </h2>

          <p className="text-xs text-slate-300">
            Gerenciamento do plano corporativo, vencimento da assinatura e renovação semestral
          </p>
        </div>

        {/* Action Button */}
        <div className="relative z-10 shrink-0">
          <button
            onClick={() => setIsRenewModalOpen(true)}
            className="px-6 py-4 bg-[#00A896] hover:bg-[#009282] text-white font-black text-xs rounded-2xl flex items-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <CreditCard className="w-4 h-4" />
            <span>Renovar Licença por 6 Meses (R$ 189,90/mês)</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Subscription Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Valor Mensal do Plano</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">R$ 189,90</p>
          <p className="text-[11px] text-emerald-600 font-bold">Cobrança Mensal no Plano Semestral</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Data de Adesão</span>
            <Calendar className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{planDetails.dataAdesao}</p>
          <p className="text-[11px] text-slate-400 font-medium">Início do Contrato Atual</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Tempo Restante de Licença</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600">{planDetails.diasRestantes} dias</p>
          <p className="text-[11px] text-amber-700 font-bold">Validade até {planDetails.dataVencimento}</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Status da Assinatura</span>
            <ShieldCheck className="w-4 h-4 text-[#00A896]" />
          </div>
          <p className="text-base font-black text-emerald-600 flex items-center gap-1.5 pt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Licença Válida</span>
          </p>
          <p className="text-[11px] text-slate-400 font-medium">6 Meses — Renovação Garantida</p>
        </div>
      </div>

      {/* Included Features Grid */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">
              O Que Está Incluído no Seu Plano ({systemName})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Recursos completos disponibilizados para sua clínica sem custos adicionais por usuário
            </p>
          </div>

          <span className="text-xs font-extrabold px-3 py-1 bg-teal-50 text-[#00A896] rounded-full">
            Plano Corporativo Ilimitado
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {INCLUDED_FEATURES.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 hover:bg-white hover:shadow-md transition-all space-y-2 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-500/10 text-[#00A896] group-hover:bg-[#00A896] group-hover:text-white transition-all">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900">{feat.title}</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pl-1">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Renewal Modal */}
      {isRenewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-6 animate-scale-up relative">
            <button
              onClick={() => setIsRenewModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 rounded-2xl bg-teal-50 text-[#00A896]">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Renovação de Licença (6 Meses)
                </h3>
                <p className="text-xs text-slate-400">
                  Garanta mais 6 meses de acesso ininterrupto para toda a clínica
                </p>
              </div>
            </div>

            {renewSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-black text-emerald-900 text-base">Pagamento Confirmado!</h4>
                <p className="text-xs text-emerald-800">
                  Sua licença semestral foi renovada com sucesso até **01/03/2027**.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Summary Order */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Plano Semestral (6 Meses):</span>
                    <span className="font-bold text-slate-900">R$ 189,90 / mês</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Período de Renovação:</span>
                    <span className="font-bold text-emerald-600">6 Meses adicionais</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                    <span>Valor Total da Renovação:</span>
                    <span className="text-[#00A896]">R$ 1.139,40</span>
                  </div>
                </div>

                {/* Select Payment Option */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    Forma de Pagamento:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === 'pix'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      <span>PIX Instantâneo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cartao')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === 'cartao'
                          ? 'bg-teal-50 border-teal-500 text-teal-800 ring-2 ring-teal-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-teal-600" />
                      <span>Cartão Crédito</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('boleto')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === 'boleto'
                          ? 'bg-sky-50 border-sky-500 text-sky-800 ring-2 ring-sky-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <FileText className="w-4 h-4 text-sky-600" />
                      <span>Boleto Bancário</span>
                    </button>
                  </div>
                </div>

                {paymentMethod === 'pix' && (
                  <div className="p-3 bg-slate-100 rounded-xl text-center space-y-1 text-xs text-slate-600">
                    <p className="font-bold text-slate-800">Chave PIX (CNPJ da Plataforma):</p>
                    <p className="font-mono text-[11px] bg-white p-2 rounded-lg border border-slate-200 font-bold select-all">
                      48.912.304/0001-99
                    </p>
                  </div>
                )}

                <button
                  onClick={handleConfirmPayment}
                  className="w-full py-3.5 bg-[#00A896] hover:bg-[#009282] text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Renovação por R$ 189,90/mês</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
