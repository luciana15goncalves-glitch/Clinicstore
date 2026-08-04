import React, { useState } from 'react';
import {
  Video,
  X,
  Mic,
  MicOff,
  VideoOff,
  MessageSquare,
  FileText,
  ShieldCheck,
  Send,
  User,
  Heart,
  CheckCircle2,
} from 'lucide-react';
import { Appointment, Patient } from '../types';

interface TelemedicinaModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  patient: Patient | null;
  onOpenProntuario: (apt: Appointment) => void;
}

export const TelemedicinaModal: React.FC<TelemedicinaModalProps> = ({
  isOpen,
  onClose,
  appointment,
  patient,
  onOpenProntuario,
}) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Sistema', text: 'Sala Virtual de Telemedicina Conectada (Criptografia P2P End-to-End).', time: '14:00' },
    { sender: patient?.nome || 'Paciente', text: 'Boa tarde doutor, já estou online na sala.', time: '14:01' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  if (!isOpen || !appointment) return null;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setChatMessages([
      ...chatMessages,
      { sender: 'Doutor(a)', text: newMessage.trim(), time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setNewMessage('');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 z-50 animate-fade-in">
      <div className="bg-slate-900 rounded-3xl max-w-6xl w-full border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        {/* Header Bar */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Video className="w-5 h-5 text-teal-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Teleconsulta Médica: {patient?.nome || appointment.pacienteNome}
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  🔴 AO VIVO • CFM Res. 2.314
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Consulta Online • Especialidade: {appointment.medicoEspecialidade}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenProntuario(appointment);
              }}
              className="bg-[#00A896] hover:bg-[#009282] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Abrir Prontuário Lado a Lado</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Grid & Side Panel */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-hidden bg-slate-950">
          {/* Main Video Stream Frame */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col justify-between p-4 shadow-inner">
            {/* Top Video Overlay */}
            <div className="flex items-center justify-between z-10">
              <span className="bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                Conexão HD Segura (Jitsi / Whereby API)
              </span>
              <span className="bg-slate-950/80 text-slate-300 text-xs font-mono px-3 py-1.5 rounded-xl border border-slate-800">
                00:14:22
              </span>
            </div>

            {/* Simulated Video Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              {isVideoOn ? (
                <div className="relative w-full h-full">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&auto=format&fit=crop&q=80"
                    alt="Vídeo do Paciente"
                    className="w-full h-full object-cover rounded-xl opacity-90"
                  />
                  {/* Doctor Thumbnail */}
                  <div className="absolute bottom-4 right-4 w-40 h-28 bg-slate-800 rounded-xl overflow-hidden border-2 border-teal-500 shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300"
                      alt="Médico"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 bg-slate-950/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Você (Dr.)
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <VideoOff className="w-16 h-16 mb-2 text-slate-600" />
                  <p className="text-sm font-bold">Câmera Desativada</p>
                </div>
              )}
            </div>

            {/* Bottom Controls Bar */}
            <div className="relative z-10 flex items-center justify-center gap-4 bg-slate-950/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 max-w-md mx-auto">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  isMicOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
                title={isMicOn ? 'Mutar Microfone' : 'Ativar Microfone'}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  isVideoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
                title={isVideoOn ? 'Desativar Vídeo' : 'Ativar Câmera'}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={onClose}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all active:scale-95"
              >
                Encerrar Chamada
              </button>
            </div>
          </div>

          {/* Right Side Chat & Clinical Notes */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 flex flex-col justify-between overflow-hidden">
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-teal-400" />
                Chat ao Vivo com Paciente
              </span>
              <span className="text-[10px] text-teal-400 bg-teal-950 px-2 py-0.5 rounded-full border border-teal-800">
                Sigilo Médico
              </span>
            </div>

            {/* Chat Messages List */}
            <div className="p-3 overflow-y-auto flex-1 space-y-3">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-2xl text-xs max-w-[85%] ${
                    msg.sender === 'Doutor(a)'
                      ? 'bg-[#00A896] text-white ml-auto'
                      : 'bg-slate-800 text-slate-200 mr-auto'
                  }`}
                >
                  <p className="text-[10px] font-extrabold opacity-75 mb-0.5">{msg.sender} • {msg.time}</p>
                  <p className="font-medium">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Enviar mensagem para o paciente..."
                className="w-full bg-slate-900 text-white text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-[#00A896]"
              />
              <button
                onClick={handleSendMessage}
                className="w-9 h-9 rounded-xl bg-[#00A896] text-white flex items-center justify-center hover:bg-[#009282] shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
