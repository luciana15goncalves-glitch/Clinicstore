import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { AgendaView } from './components/AgendaView';
import { PacientesView } from './components/PacientesView';
import { ProntuarioView } from './components/ProntuarioView';
import { InsumosView } from './components/InsumosView';
import { FinanceiroView } from './components/FinanceiroView';
import { RelatoriosView } from './components/RelatoriosView';
import { ConfiguracoesView } from './components/ConfiguracoesView';
import { NovaConsultaModal } from './components/NovaConsultaModal';

import {
  CURRENT_DOCTOR,
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
} from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isNovaConsultaOpen, setIsNovaConsultaOpen] = useState<boolean>(false);

  // Global State Stores
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [records, setRecords] = useState<MedicalRecord[]>(INITIAL_MEDICAL_RECORDS);
  const [stockItems, setStockItems] = useState<StockItem[]>(INITIAL_STOCK);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(INITIAL_TRANSACTIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  const [selectedAptForEHR, setSelectedAptForEHR] = useState<Appointment | null>(null);

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
      userId: CURRENT_DOCTOR.id,
      userName: CURRENT_DOCTOR.nome,
      action: 'create_appointment',
      resourceType: 'Agenda',
      resourceId: newApt.id,
      details: `Agendamento criado para ${newApt.pacienteNome} às ${newApt.horario}`,
      ipAddress: '189.120.45.12',
      timestamp: new Date().toLocaleString('pt-BR'),
    };
    setAuditLogs([log, ...auditLogs]);
  };

  const handleUpdateAppointmentStatus = (id: number, status: AppointmentStatus) => {
    setAppointments(
      appointments.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const handleAddPatient = (patient: Patient) => {
    setPatients([patient, ...patients]);
    const log: AuditLog = {
      id: Date.now(),
      userId: CURRENT_DOCTOR.id,
      userName: CURRENT_DOCTOR.nome,
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
      userId: CURRENT_DOCTOR.id,
      userName: CURRENT_DOCTOR.nome,
      action: 'sign_medical_record',
      resourceType: 'Prontuario',
      resourceId: record.id,
      details: `Prontuário médico assinado com carimbo digital para paciente ID ${record.pacienteId}`,
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
    setSelectedAptForEHR(apt);
    setCurrentTab('prontuario');
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans antialiased`}>
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenNovaConsulta={() => setIsNovaConsultaOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Navbar */}
        <Header
          onSelectPatient={(p) => {
            setCurrentTab('pacientes');
          }}
          onOpenAgenda={() => setCurrentTab('agenda')}
        />

        {/* Scrollable Main View Container */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50">
          {currentTab === 'dashboard' && (
            <DashboardView
              appointments={appointments}
              patients={patients}
              onOpenNovaConsulta={() => setIsNovaConsultaOpen(true)}
              onSelectAppointmentForEHR={handleSelectAppointmentForEHR}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'agenda' && (
            <AgendaView
              appointments={appointments}
              onOpenNovaConsulta={() => setIsNovaConsultaOpen(true)}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onSelectAppointmentForEHR={handleSelectAppointmentForEHR}
            />
          )}

          {currentTab === 'pacientes' && (
            <PacientesView
              patients={patients}
              onAddPatient={handleAddPatient}
              onAnonymizePatient={handleAnonymizePatient}
              onSelectPatientForHistory={() => {}}
            />
          )}

          {currentTab === 'prontuario' && (
            <ProntuarioView
              selectedAppointment={selectedAptForEHR}
              appointments={appointments}
              patients={patients}
              records={records}
              doctor={CURRENT_DOCTOR}
              onSaveRecord={handleSaveMedicalRecord}
            />
          )}

          {currentTab === 'insumos' && (
            <InsumosView
              stockItems={stockItems}
              onUpdateStock={handleUpdateStock}
              onAddStockItem={(item) => setStockItems([item, ...stockItems])}
            />
          )}

          {currentTab === 'financeiro' && (
            <FinanceiroView
              transactions={transactions}
              onAddTransaction={(t) => setTransactions([t, ...transactions])}
            />
          )}

          {currentTab === 'relatorios' && <RelatoriosView />}

          {currentTab === 'configuracoes' && <ConfiguracoesView auditLogs={auditLogs} />}
        </main>
      </div>

      {/* Global Nova Consulta Modal */}
      <NovaConsultaModal
        isOpen={isNovaConsultaOpen}
        onClose={() => setIsNovaConsultaOpen(false)}
        patients={patients}
        onAddAppointment={handleAddAppointment}
        onAddNewPatientClick={() => {
          setIsNovaConsultaOpen(false);
          setCurrentTab('pacientes');
        }}
      />
    </div>
  );
}
