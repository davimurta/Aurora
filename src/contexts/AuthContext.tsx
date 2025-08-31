import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';

export type UserType = 'paciente' | 'psicologo';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  userType: UserType;
  isApproved?: boolean;
  createdAt: any;
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
  documents?: any;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  registerPaciente: (data: PacienteData) => Promise<void>;
  registerPsicologo: (data: PsicologoData, documents?: any) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  getUserData: () => Promise<UserData | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Estado da autenticação mudou:', user?.email);
      setUser(user);
      
      if (user) {
        const data = await getUserDataFromFirestore(user.uid);
        setUserData(data);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const getUserDataFromFirestore = async (uid: string): Promise<UserData | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserData;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log('Tentando fazer login com:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login realizado com sucesso:', result.user.email);
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(getErrorMessage(error.code));
    }
  };

  const register = async (email: string, password: string, displayName: string): Promise<void> => {
    try {
      console.log('Criando usuário básico...');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(result.user, {
        displayName: displayName
      });
      
      console.log('Usuário básico criado:', result.user.email);
    } catch (error: any) {
      console.error('Erro no registro básico:', error);
      throw new Error(getErrorMessage(error.code));
    }
  };

  const registerPaciente = async (data: PacienteData): Promise<void> => {
    try {
      console.log('Registrando paciente...');
      
      // Validações
      if (data.senha !== data.confirmarSenha) {
        throw new Error('As senhas não coincidem');
      }

      if (data.senha.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      // Criar usuário no Authentication
      const result = await createUserWithEmailAndPassword(auth, data.email, data.senha);
      
      await updateProfile(result.user, {
        displayName: data.nome
      });

      // Salvar dados básicos do usuário
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: data.email,
        displayName: data.nome,
        userType: 'paciente' as UserType,
        createdAt: serverTimestamp()
      });

      // Salvar dados específicos do paciente
      await setDoc(doc(db, 'pacientes', result.user.uid), {
        nome: data.nome,
        cpf: data.cpf,
        telefone: data.telefone,
        dataNascimento: data.dataNascimento,
        createdAt: serverTimestamp()
      });

      console.log('Paciente registrado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao registrar paciente:', error);
      throw new Error(getErrorMessage(error.code));
    }
  };

  const registerPsicologo = async (data: PsicologoData, documents?: any): Promise<void> => {
    try {
      console.log('Registrando psicólogo...');
      
      // Validações
      if (data.senha !== data.confirmarSenha) {
        throw new Error('As senhas não coincidem');
      }

      if (data.senha.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      // Criar usuário no Authentication
      const result = await createUserWithEmailAndPassword(auth, data.email, data.senha);
      
      await updateProfile(result.user, {
        displayName: data.nome
      });

      // Salvar dados básicos do usuário
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: data.email,
        displayName: data.nome,
        userType: 'psicologo' as UserType,
        isApproved: false, // Psicólogos precisam de aprovação
        createdAt: serverTimestamp()
      });

      // Salvar dados específicos do psicólogo
      await setDoc(doc(db, 'psicologos', result.user.uid), {
        nome: data.nome,
        cpf: data.cpf,
        telefone: data.telefone,
        dataNascimento: data.dataNascimento,
        crp: data.crp,
        especialidade: data.especialidade,
        instituicaoFormacao: data.instituicaoFormacao,
        anoFormacao: data.anoFormacao,
        experiencia: data.experiencia,
        biografia: data.biografia,
        documents: documents || {},
        isApproved: false,
        createdAt: serverTimestamp()
      });

      console.log('Psicólogo registrado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao registrar psicólogo:', error);
      throw new Error(getErrorMessage(error.code));
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      console.log('Enviando email de redefinição para:', email);
      await sendPasswordResetEmail(auth, email);
      console.log('Email de redefinição enviado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao enviar email de redefinição:', error);
      throw new Error(getErrorMessage(error.code));
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUserData(null);
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      throw new Error('Erro ao fazer logout');
    }
  };

  const getUserData = async (): Promise<UserData | null> => {
    if (!user) return null;
    return getUserDataFromFirestore(user.uid);
  };

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Este email já está sendo usado por outra conta';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/operation-not-allowed':
        return 'Operação não permitida';
      case 'auth/weak-password':
        return 'Senha muito fraca';
      case 'auth/user-disabled':
        return 'Usuário desabilitado';
      case 'auth/user-not-found':
        return 'Usuário não encontrado';
      case 'auth/wrong-password':
        return 'Senha incorreta';
      case 'auth/invalid-credential':
        return 'Credenciais inválidas';
      default:
        return 'Erro desconhecido. Tente novamente.';
    }
  };

  const value: AuthContextType = {
    user,
    userData,
    loading,
    login,
    register,
    registerPaciente,
    registerPsicologo,
    resetPassword,
    logout,
    getUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};