export type Role = 'admin' | 'medico' | 'secretaria';

export interface UserProfile {
  id: number;
  nome: string;
  email: string;
  crm?: string;
  especialidade?: string;
  role: Role;
  avatar: string;
}

export type AppointmentStatus = 'agendada' | 'confirmada' | 'pendente' | 'em_atendimento' | 'concluida' | 'cancelada' | 'atrasado';
export type AppointmentType = 'Primeira Consulta' | 'Retorno' | 'Urgência' | 'Teleconsulta';
export type PaymentType = 'particular' | 'convenio';
export type PaymentMethod = 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'convenio';

export interface Patient {
  id: number;
  nome: string;
  cpf: string;
  rg?: string;
  dataNascimento: string;
  idade: number;
  telefone: string;
  whatsapp?: string;
  email?: string;
  endereco?: {
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  contatoEmergencia?: {
    nome: string;
    telefone: string;
    parentesco: string;
  };
  tipoAtendimento: PaymentType;
  convenioNome?: string;
  carteirinhaNumero?: string;
  alergias: string[];
  medicamentosContinuos: string[];
  observacoes?: string;
  consentimentoLgpdAt: string;
  consentimentoLgpdIp: string;
  foto?: string;
}

export interface Appointment {
  id: number;
  pacienteId: number;
  pacienteNome: string;
  pacienteCpf: string;
  pacienteTelefone: string;
  medicoId: number;
  medicoNome: string;
  medicoEspecialidade: string;
  dataHora: string; // ISO String or YYYY-MM-DD THH:mm
  horario: string; // e.g., '14:00'
  duracaoMinutos: number;
  status: AppointmentStatus;
  tipo: AppointmentType;
  valor: number;
  formaPagamento: PaymentType;
  convenioNome?: string;
  observacoes?: string;
}

export interface CID10Item {
  codigo: string;
  descricao: string;
}

export interface PrescriptionItem {
  id: string;
  medicamento: string;
  principioAtivo?: string;
  dosagem: string;
  via: string; // Oral, Topico, Intravenoso
  frequencia: string; // e.g., 8/8h
  duracao: string; // e.g., 7 dias
  quantidade: number;
  observacoes?: string;
}

export interface MedicalRecord {
  id: number;
  consultaId: number;
  pacienteId: number;
  medicoId: number;
  dataHora: string;
  subjetivo: string;
  objetivo: string;
  avaliacao: string;
  plano: string;
  cid10Codigo?: string;
  cid10Descricao?: string;
  prescricoes: PrescriptionItem[];
  assinado: boolean;
  assinadoEm?: string;
}

export interface StockItem {
  id: number;
  nome: string;
  principioAtivo: string;
  dosagem: string;
  apresentacao: string;
  estoqueAtual: number;
  estoqueMinimo: number;
  custoUnitario: number;
  validade: string;
  lote: string;
  localizacao: string;
  controlado: boolean;
  categoriaABC: 'A' | 'B' | 'C';
}

export interface FinancialTransaction {
  id: number;
  consultaId?: number;
  pacienteNome?: string;
  descricao: string;
  categoria: 'consulta' | 'exame' | 'insumos' | 'aluguel' | 'pessoal' | 'outros';
  tipo: 'entrada' | 'saida';
  valor: number;
  formaPagamento: PaymentMethod;
  status: 'pago' | 'pendente' | 'cancelado';
  dataVencimento: string;
  dataPagamento?: string;
  convenioNome?: string;
}

export interface AuditLog {
  id: number;
  userId: number;
  userName: string;
  action: string;
  resourceType: string;
  resourceId: number;
  details: string;
  ipAddress: string;
  timestamp: string;
}
