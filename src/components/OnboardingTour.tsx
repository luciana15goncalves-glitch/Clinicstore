import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ChevronRight, X, Shield, Stethoscope, Calendar, DollarSign, Send } from 'lucide-react';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Bem-vindo ao MediClinic Pro',
      icon: Sparkles,
      color: 'from-teal-600 to-emerald-600',
      tab: 'dashboard',
      description:
        'Sua plataforma médica completa em conformidade com CFM e LGPD. Acompanhe métricas em tempo real, taxa de ocupação, receitas e atendimentos do dia.',
      highlight: 'Painel Geral & Métricas',
    },
    {
      title: 'Agenda Médica Inteligente & WhatsApp',
      icon: Calendar,
      color: 'from-sky-600 to-blue-600',
      tab: 'agenda',
      description:
        'Gerencie consultas, faça encaixes de urgência, envie lembretes automáticos via WhatsApp e cobre consultas via PIX instantâneo com 1 clique.',
      highlight: 'Lembrete WhatsApp & Cobrança PIX',
    },
    {
      title: 'Prontuário Eletrônico (PEP) Legal',
      icon: Stethoscope,
      color: 'from-emerald-600 to-teal-700',
      tab: 'prontuario',
      description:
        'Evolução clínica, busca rápida CID-10 com autocomplete, prescrição de medicamentos, atestados e assinatura digital qualificada ICP-Brasil.',
      highlight: 'Assinatura Digital SafeWeb / ICP-Brasil',
    },
    {
      title: 'Gestão Financeira & Convênios',
      icon: DollarSign,
      color: 'from-amber-600 to-orange-600',
      tab: 'financeiro',
      description:
        'Controle de fluxo de caixa diário, liquidação PIX, faturamento de convênios, lote TISS e exportação para contabilidade.',
      highlight: 'Faturamento TISS & Relatórios',
    },
    {
      title: 'Segurança LGPD & Auditoria CFM',
      icon: Shield,
      color: 'from-purple-600 to-indigo-700',
      tab: 'dashboard',
      description:
        'Criptografia AES-256 no banco de dados, autenticação de dois fatores (MFA), controle de acessos JWT e histórico de auditoria completo.',
      highlight: 'AES-256 & Rastreabilidade de Acesso',
    },
  ];

  const step = steps[currentStep];
  const IconComponent = step.icon;

  const handleNext = () => {
    onNavigateTab(step.tab);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Step Banner */}
        <div className={`p-6 bg-gradient-to-r ${step.color} text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
            <IconComponent className="w-6 h-6 text-white" />
          </div>

          <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full">
            Passo {currentStep + 1} de {steps.length}
          </span>
          <h3 className="text-xl font-black mt-2 leading-tight">{step.title}</h3>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {step.description}
          </p>

          <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-800 flex items-center gap-2 text-xs font-bold text-[#00A896]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Destaque: {step.highlight}</span>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep ? 'w-8 bg-[#00A896]' : 'w-2 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 px-3 py-2"
          >
            Pular Tour
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-[#00A896] hover:bg-[#009282] text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 transition-all"
          >
            <span>{currentStep === steps.length - 1 ? 'Concluir Onboarding' : 'Próximo Passo'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
