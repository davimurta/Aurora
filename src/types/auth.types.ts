import type { User } from 'firebase/auth';

export type UserType = 'paciente' | 'psicologo';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  userType: UserType;
  isApproved?: boolean;
  createdAt: undefined;
}

export interface PacienteData {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  senha: string;
  confirmarSenha: string;
}

export interface PsicologoData {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  crp: string;
  especialidade: string;
  instituicaoFormacao: string;
  anoFormacao: string;
  experiencia: string;
  biografia: string;
  senha: string;
  confirmarSenha: string;
  documents?: undefined;
}

export interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  registerPaciente: (data: PacienteData) => Promise<void>;
  registerPsicologo: (data: PsicologoData, documents?: undefined) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  getUserData: () => Promise<UserData | null>;
}