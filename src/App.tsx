import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { AgendaView } from './components/AgendaView';
import { EspecialidadesView } from './components/EspecialidadesView';
import { PacientesView } from './components/PacientesView';
import { ProntuarioView } from './components/ProntuarioView';
import { FinanceiroView } from './components/FinanceiroView';
import { RelatoriosView } from './components/RelatoriosView';
import { ConfiguracoesView } from './components/ConfiguracoesView';
import { SuporteView } from './components/SuporteView';
import { AssinaturaView } from './components/AssinaturaView';
import { NovaConsultaModal } from './components/NovaConsultaModal';
import { LoginModal } from './components/LoginModal';
import { AccessDeniedView } from './components/AccessDeniedView';

import {
  MOCK_USER_ACCOUNTS,
  CURRENT_DOCTOR,
  DOCTORS_SPECIALTIES,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICAL_RECORDS,
  INITIAL_STOCK,
  INITIAL_TRANSACTIONS,
  INITIAL_AUDIT_LOGS,
} from './data/mockData';

import {
  Patient,
  Appointment,
  MedicalRecord,
  StockItem,
  FinancialTransaction,
  AuditLog,
  AppointmentStatus,
  DoctorSpecialty,
  UserAccount,
  UserProfile,
} from './types';
import { ClinicTheme } from './components/Sidebar';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isNovaConsultaOpen, setIsNovaConsultaOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Authenticated User State (Defaults to Dr. Fernando Silva)
  const [currentUser, setCurrentUser] = useState<UserAccount>(MOCK_USER_ACCOUNTS[0]);

  // System Customization State (Name, Logo & Gradient Theme)
  const [systemName, setSystemName] = useState<string>('CLINIC MEDICAL');
  const [clinicLogo, setClinicLogo] = useState<string>(
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=80'
  );
  const [clinicTheme, setClinicTheme] = useState<ClinicTheme>({
    primaryColor: '#00A896',
    secondaryColor: '#00B4D8',
    gradientName: 'Teal Esmeralda & Ciano',
  });

  // Global State Stores
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [records, setRecords] = useState<MedicalRecord[]>(INITIAL_MEDICAL_RECORDS);
  const [stockItems, setStockItems] = useState<StockItem[]>(INITIAL_STOCK);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(INITIAL_TRANSACTIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [doctors, setDoctors] = useState<DoctorSpecialty[]>(DOCTORS_SPECIALTIES);
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(MOCK_USER_ACCOUNTS);

  const [selectedAptForEHR, setSelectedAptForEHR] = useState<Appointment | null>(null);
  const [receptionSelectedPatient, setReceptionSelectedPatient] = useState<Patient | null>(null);

  const isAdmin = currentUser.role === 'admin';
  const isDoctor = currentUser.role === 'medico';
  const isAtendente = currentUser.role === 'atendente';

  const handleAddDoctor = (newDoc: DoctorSpecialty) => {
    setDoctors([newDoc, ...doctors]);
  };

  const handleAddUserAccount = (newUser: UserAccount) => {
    setUserAccounts([newUser, ...userAccounts]);
  };

  // Action Helpers
  const handleAddAppointment = (newAptData: Omit<Appointment, 'id'>) => {
    const newApt: Appointment = {
      ...newAptData,
      id: Date.now(),
    };
    setAppointments([newApt, ...appointments]);

    // Record audit log for LGPD
    const log: AuditLog = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.nome,
      action: 'create_appointment',
      resourceType: 'Agenda',
      resourceId: newApt.id,
      details: `Agendamento criado por ${currentUser.nome} (${currentUser.cargo}) para ${newApt.pacienteNome} às ${newApt.horario}`,
      ipAddress: '189.120.45.12',
      timestamp: new Date().toLocaleString('pt-BR'),
    };
    setAuditLogs([log, ...auditLogs]);
  };

  const handleUpdateAppointmentStatus = (id: number, status: AppointmentStatus, motivo?: string) => {
    setAppointments(
      appointments.map((a) => (a.id === id ? { ...a, status, motivoDesistencia: motivo !== undefined ? motivo : a.motivoDesistencia } : a))
    );
  };

  const handleAddPatient = (patient: Patient) => {
    setPatients([patient, ...patients]);
    const log: AuditLog = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.nome,
      action: 'create_patient_consent',
      resourceType: 'Paciente',
      resourceId: patient.id,
      details: `Cadastro de paciente com consentimento LGPD ativo para ${patient.nome}`,
      ipAddress: '189.120.45.12',
      timestamp: new Date().toLocaleString('pt-BR'),
    };
    setAuditLogs([log, ...auditLogs]);
  };

  const handleAnonymizePatient = (id: number) => {
    setPatients(
      patients.map((p) =>
        p.id === id
          ? {
              ...p,
              nome: 'PACIENTE ANONIMIZADO (LGPD)',
              cpf: '000.000.000-00',
              telefone: '(00) 00000-0000',
              email: 'anonimizado@lgpd.com.br',
              alergias: [],
              medicamentosContinuos: [],
            }
          : p
      )
    );
  };

  const handleSaveMedicalRecord = (record: MedicalRecord) => {
    const existingIndex = records.findIndex((r) => r.consultaId === record.consultaId);
    if (existingIndex >= 0) {
      const updated = [...records];
      updated[existingIndex] = record;
      setRecords(updated);
    } else {
      setRecords([record, ...records]);
    }

    // Auto-deplete inventory for prescribed items
    record.prescricoes.forEach((p) => {
      const stockMatch = stockItems.find((s) =>
        s.nome.toLowerCase().includes(p.medicamento.toLowerCase())
      );
      if (stockMatch) {
        handleUpdateStock(stockMatch.id, -p.quantidade);
      }
    });

    const log: AuditLog = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.nome,
      action: 'sign_medical_record',
      resourceType: 'Prontuario',
      resourceId: record.id,
      details: `Prontuário médico assinado por ${currentUser.nome} (${currentUser.crm || 'CRM Ativo'}) para paciente ID ${record.pacienteId}`,
      ipAddress: '189.120.45.12',
      timestamp: new Date().toLocaleString('pt-BR'),
    };
    setAuditLogs([log, ...auditLogs]);
  };

  const handleUpdateStock = (id: number, delta: number) => {
    setStockItems(
      stockItems.map((s) =>
        s.id === id ? { ...s, estoqueAtual: Math.max(0, s.estoqueAtual + delta) } : s
      )
    );
  };

  const handleSelectAppointmentForEHR = (apt: Appointment) => {
    if (!isDoctor) {
      // If receptionist tries to open EHR, switch tab to prontuario which will trigger AccessDeniedView
      setSelectedAptForEHR(apt);
      setCurrentTab('prontuario');
      return;
    }
    setSelectedAptForEHR(apt);
    setCurrentTab('prontuario');
  };

  const handleAgendarComMedico = (medico: DoctorSpecialty) => {
    setIsNovaConsultaOpen(true);
  };

  const handleSwitchUser = (newUser: UserAccount) => {
    setCurrentUser(newUser);
    // Automatically route user to their relevant default tab if they were on a restricted view
    if (newUser.role === 'atendente' && (currentTab === 'pacientes' || currentTab === 'prontuario')) {
      setCurrentTab('agenda');
    } else if (newUser.role === 'medico' && (currentTab === 'financeiro' || currentTab === 'relatorios')) {
      setCurrentTab('prontuario');
    }
  };

  const doctorProfile: UserProfile = {
    id: currentUser.id,
    nome: currentUser.nome,
    email: currentUser.email,
    crm: currentUser.crm || 'CRM/SP 148.920',
    especialidade: currentUser.especialidade || 'Cardiologia',
    role: currentUser.role,
    cargo: currentUser.cargo,
    avatar: currentUser.avatar,
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenNovaConsulta={() => setIsNovaConsultaOpen(true)}
        currentUser={currentUser}
        onOpenSwitchUser={() => setIsLoginModalOpen(true)}
        clinicLogo={clinicLogo}
        clinicTheme={clinicTheme}
        systemName={systemName}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Navbar */}
        <Header
          currentUser={currentUser}
          onOpenSwitchUser={() => setIsLoginModalOpen(true)}
          onSelectPatient={(p) => {
            if (isDoctor || isAdmin) {
              // Find or set appointment for this patient to open EHR in Prontuário directly
              const existingApt = appointments.find((a) => a.pacienteId === p.id);
              if (existingApt) {
                setSelectedAptForEHR(existingApt);
              } else {
                const syntheticApt: Appointment = {
                  id: Date.now(),
                  pacienteId: p.id,
                  pacienteNome: p.nome,
                  pacienteCpf: p.cpf,
                  pacienteTelefone: p.telefone,
                  medicoId: currentUser.id,
                  medicoNome: currentUser.nome,
                  medicoEspecialidade: currentUser.especialidade || 'Cardiologia',
                  dataHora: new Date().toISOString(),
                  horario: '14:00',
                  duracaoMinutos: 30,
                  status: 'em_atendimento',
                  tipo: 'Retorno',
                  valor: 250,
                  formaPagamento: p.tipoAtendimento,
                };
                setSelectedAptForEHR(syntheticApt);
              }
              setCurrentTab('prontuario');
            } else {
              setReceptionSelectedPatient(p);
              setCurrentTab('agenda');
            }
          }}
          onOpenAgenda={() => setCurrentTab('agenda')}
        />

        {/* Scrollable Main View Container */}
        <main className="flex-1 overflow-y-auto bg-slate-50/60">
          {currentTab === 'dashboard' && (
            <DashboardView
              appointments={appointments}
              patients={patients}
              onOpenNovaConsulta={() => setIsNovaConsultaOpen(true)}
              onSelectAppointmentForEHR={handleSelectAppointmentForEHR}
              onNavigateTab={setCurrentTab}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'agenda' && (
            <AgendaView
              appointments={appointments}
              patients={patients}
              onOpenNovaConsulta={() => setIsNovaConsultaOpen(true)}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onSelectAppointmentForEHR={handleSelectAppointmentForEHR}
              onAddAppointment={handleAddAppointment}
              receptionSelectedPatient={receptionSelectedPatient}
              onClearReceptionPatient={() => setReceptionSelectedPatient(null)}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'especialidades' && (
            <EspecialidadesView
              onAgendarComMedico={handleAgendarComMedico}
              doctors={doctors}
              currentUser={currentUser}
              onNavigateTab={setCurrentTab}
            />
          )}

          {/* DOCTOR/ADMIN TAB: Pacientes */}
          {currentTab === 'pacientes' && (
            (isDoctor || isAdmin) ? (
              <PacientesView
                patients={patients}
                onAddPatient={handleAddPatient}
                onAnonymizePatient={handleAnonymizePatient}
                onSelectPatientForHistory={() => {}}
              />
            ) : (
              <AccessDeniedView
                tabName="pacientes"
                user={currentUser}
                onNavigateTab={setCurrentTab}
                onOpenSwitchUser={() => setIsLoginModalOpen(true)}
              />
            )
          )}

          {/* DOCTOR/ADMIN TAB: Prontuário */}
          {currentTab === 'prontuario' && (
            (isDoctor || isAdmin) ? (
              <ProntuarioView
                selectedAppointment={selectedAptForEHR}
                appointments={appointments}
                patients={patients}
                records={records}
                doctor={doctorProfile}
                onSaveRecord={handleSaveMedicalRecord}
              />
            ) : (
              <AccessDeniedView
                tabName="prontuario"
                user={currentUser}
                onNavigateTab={setCurrentTab}
                onOpenSwitchUser={() => setIsLoginModalOpen(true)}
              />
            )
          )}

          {/* ADMIN-ONLY TAB: Financeiro */}
          {currentTab === 'financeiro' && (
            isAdmin ? (
              <FinanceiroView
                transactions={transactions}
                onAddTransaction={(t) => setTransactions([t, ...transactions])}
              />
            ) : (
              <AccessDeniedView
                tabName="financeiro"
                user={currentUser}
                onNavigateTab={setCurrentTab}
                onOpenSwitchUser={() => setIsLoginModalOpen(true)}
              />
            )
          )}

          {/* ADMIN-ONLY TAB: Relatórios */}
          {currentTab === 'relatorios' && (
            isAdmin ? (
              <RelatoriosView />
            ) : (
              <AccessDeniedView
                tabName="relatorios"
                user={currentUser}
                onNavigateTab={setCurrentTab}
                onOpenSwitchUser={() => setIsLoginModalOpen(true)}
              />
            )
          )}

          {/* ADMIN-ONLY TAB: Assinatura & Licença */}
          {currentTab === 'assinatura' && (
            isAdmin ? (
              <AssinaturaView currentUser={currentUser} systemName={systemName} />
            ) : (
              <AccessDeniedView
                tabName="assinatura"
                user={currentUser}
                onNavigateTab={setCurrentTab}
                onOpenSwitchUser={() => setIsLoginModalOpen(true)}
              />
            )
          )}

          {/* ALL LOGINS TAB: Suporte & Ajuda */}
          {currentTab === 'suporte' && <SuporteView currentUser={currentUser} />}

          {currentTab === 'configuracoes' && (
            <ConfiguracoesView
              auditLogs={auditLogs}
              currentUser={currentUser}
              clinicLogo={clinicLogo}
              onUpdateClinicLogo={setClinicLogo}
              clinicTheme={clinicTheme}
              onUpdateClinicTheme={setClinicTheme}
              doctors={doctors}
              onAddDoctor={handleAddDoctor}
              userAccounts={userAccounts}
              onAddUserAccount={handleAddUserAccount}
              systemName={systemName}
              onUpdateSystemName={setSystemName}
            />
          )}
        </main>
      </div>

      {/* Global Nova Consulta Modal */}
      <NovaConsultaModal
        isOpen={isNovaConsultaOpen}
        onClose={() => setIsNovaConsultaOpen(false)}
        patients={patients}
        doctors={doctors}
        onAddAppointment={handleAddAppointment}
        onAddPatient={handleAddPatient}
        onAddNewPatientClick={() => {
          setIsNovaConsultaOpen(false);
          if (isDoctor || isAdmin) {
            setCurrentTab('pacientes');
          } else {
            setCurrentTab('agenda');
          }
        }}
      />

      {/* Login & User Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        currentUser={currentUser}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleSwitchUser}
        userAccounts={userAccounts}
      />
    </div>
  );
}
