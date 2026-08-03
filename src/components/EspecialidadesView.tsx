import React, { useState } from 'react';
import {
  Stethoscope,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Search,
  Building2,
  Award,
  Plus,
  Filter,
  UserCheck,
} from 'lucide-react';
import { DOCTORS_SPECIALTIES } from '../data/mockData';
import { DoctorSpecialty, UserAccount } from '../types';

interface EspecialidadesViewProps {
  onAgendarComMedico?: (medico: DoctorSpecialty) => void;
  doctors?: DoctorSpecialty[];
  currentUser?: UserAccount;
  onNavigateTab?: (tab: string) => void;
}

export const EspecialidadesView: React.FC<EspecialidadesViewProps> = ({
  onAgendarComMedico,
  doctors,
  currentUser,
  onNavigateTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('todas');

  const doctorList = doctors && doctors.length > 0 ? doctors : DOCTORS_SPECIALTIES;
  const isAdmin = currentUser?.role === 'admin';

  const specialtiesList = Array.from(
    new Set(doctorList.map((d) => d.especialidade.split('&')[0].trim()))
  );

  const filteredDoctors = doctorList.filter((doc) => {
    const matchesSearch =
      doc.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.especialidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.crm.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty =
      selectedSpecialty === 'todas' ||
      doc.especialidade.toLowerCase().includes(selectedSpecialty.toLowerCase());

    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-600 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <Stethoscope className="w-6 h-6 text-emerald-300" />
            </span>
            <h2 className="text-2xl font-black tracking-tight">
              Especialidades Médicas & Corpo Clínico
            </h2>
          </div>
          <p className="text-xs text-slate-200 max-w-2xl leading-relaxed">
            Consulte a grade de especialidades da <span className="font-bold text-emerald-300">CLINIC MEDICAL</span>, os dias e horários de atendimento dos nossos médicos e agende suas consultas.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
            <div className="text-right">
              <p className="text-[10px] text-slate-300 uppercase font-bold">Corpo Clínico Ativo</p>
              <p className="text-lg font-extrabold text-emerald-300">{doctorList.length} Especialistas</p>
            </div>
          </div>

          {isAdmin && onNavigateTab && (
            <button
              onClick={() => onNavigateTab('configuracoes')}
              className="px-4 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-2xl flex items-center gap-2 shadow-lg transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Gerenciar Médicos & Valores (Admin)</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por médico, especialidade ou CRM..."
            className="w-full bg-slate-50 text-xs text-slate-800 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Specialty Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            Filtrar:
          </span>
          <button
            onClick={() => setSelectedSpecialty('todas')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedSpecialty === 'todas'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas as Especialidades
          </button>
          {specialtiesList.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedSpecialty === spec
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
          >
            <div className="p-6 space-y-4">
              {/* Doctor Avatar & Basic Info */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={doc.avatar}
                    alt={doc.nome}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/20 shadow-sm"
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      doc.status === 'disponivel'
                        ? 'bg-emerald-500'
                        : doc.status === 'em_atendimento'
                        ? 'bg-amber-500'
                        : 'bg-slate-300'
                    }`}
                    title={doc.status}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-600 transition-colors truncate">
                      {doc.nome}
                    </h3>
                  </div>
                  <p className="text-xs font-extrabold text-emerald-600 mt-0.5">
                    {doc.especialidade}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {doc.crm}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                {doc.descricao}
              </p>

              <hr className="border-slate-100" />

              {/* Schedule Details */}
              <div className="space-y-2.5 text-xs">
                {/* Days of Week */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700">Dias de Atendimento:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {doc.diasAtendimento.map((dia) => (
                        <span
                          key={dia}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold"
                        >
                          {dia}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700">Horários:</p>
                    <p className="text-slate-500 font-medium">{doc.horarioAtendimento}</p>
                  </div>
                </div>

                {/* Room / Office */}
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700">Localização:</p>
                    <p className="text-slate-500 font-medium">{doc.consultorio}</p>
                  </div>
                </div>

                {/* Pricing & Insurance */}
                <div className="pt-2 flex items-center justify-between text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Consulta Particular
                    </span>
                    <span className="font-black text-slate-900 text-sm">
                      R$ {doc.valorConsulta},00
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Convênios
                    </span>
                    <span className="font-bold text-emerald-600 text-xs">
                      {doc.atendeConvenio ? 'Sim (Unimed, Bradesco...)' : 'Apenas Particular'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card Action */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <UserCheck className="w-4 h-4 text-emerald-500" />
                <span>Atendimento Ativo</span>
              </div>

              <button
                onClick={() => onAgendarComMedico && onAgendarComMedico(doc)}
                className="px-4 py-2.5 bg-[#00A896] hover:bg-[#009282] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Agendar com Médico</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
