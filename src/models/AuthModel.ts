import {
  type User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";
import type {
  PacienteData,
  PsicologoData,
  UserData,
  UserType,
} from "../types/auth.types";

function validatePacienteData(data: PacienteData): void {
  if (data.senha !== data.confirmarSenha) {
    throw new Error("As senhas não coincidem");
  }

  if (data.senha.length < 6) {
    throw new Error("A senha deve ter pelo menos 6 caracteres");
  }
}

function validatePsicologoData(data: PsicologoData): void {
  if (data.senha !== data.confirmarSenha) {
    throw new Error("As senhas não coincidem");
  }

  if (data.senha.length < 6) {
    throw new Error("A senha deve ter pelo menos 6 caracteres");
  }
}

function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "Este email já está sendo usado por outra conta";
    case "auth/invalid-email":
      return "Email inválido";
    case "auth/operation-not-allowed":
      return "Operação não permitida";
    case "auth/weak-password":
      return "Senha muito fraca";
    case "auth/user-disabled":
      return "Usuário desabilitado";
    case "auth/user-not-found":
      return "Usuário não encontrado";
    case "auth/wrong-password":
      return "Senha incorreta";
    case "auth/invalid-credential":
      return "Credenciais inválidas";
    default:
      return "Erro desconhecido. Tente novamente.";
  }
}

export const AuthModel = {
  // Buscar dados do usuário no Firestore
  async getUserDataFromFirestore(uid: string): Promise<UserData | null> {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserData;
      }
      return null;
    } catch {
      return null;
    }
  },

  // Login do usuário
  async login(email: string, password: string): Promise<User> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error) {
        throw new Error(getErrorMessage((error as { code: string }).code));
      }
      throw error;
    }
  },

  // Registro básico
  async register(
    email: string,
    password: string,
    displayName: string
  ): Promise<User> {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(result.user, {
        displayName,
      });
      return result.user;
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error) {
        throw new Error(getErrorMessage((error as { code: string }).code));
      }
      throw error;
    }
  },

  async registerPaciente(data: PacienteData): Promise<User> {
    try {

      // Validações
      validatePacienteData(data);

      // Criar usuário no Authentication
      const result = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.senha
      );

      await updateProfile(result.user, {
        displayName: data.nome,
      });

      // Salvar dados básicos do usuário
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        email: data.email,
        displayName: data.nome,
        userType: "paciente" as UserType,
        createdAt: serverTimestamp(),
      });

      // Salvar dados específicos do paciente
      await setDoc(doc(db, "pacientes", result.user.uid), {
        nome: data.nome,
        cpf: data.cpf,
        telefone: data.telefone,
        dataNascimento: data.dataNascimento,
        createdAt: serverTimestamp(),
      });

      return result.user;
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error) {
        throw new Error(getErrorMessage((error as { code: string }).code));
      }
      throw error;
    }
  },

  // Registro de psicólogo
  async registerPsicologo(
    data: PsicologoData,
    documents?: unknown
  ): Promise<User> {
    try {

      // Validações
      validatePsicologoData(data);

      // Criar usuário no Authentication
      const result = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.senha
      );

      await updateProfile(result.user, {
        displayName: data.nome,
      });

      // Salvar dados básicos do usuário
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        email: data.email,
        displayName: data.nome,
        userType: "psicologo" as UserType,
        isApproved: false, // Psicólogos precisam de aprovação
        createdAt: serverTimestamp(),
      });

      // Salvar dados específicos do psicólogo
      await setDoc(doc(db, "psicologos", result.user.uid), {
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
        createdAt: serverTimestamp(),
      });

      return result.user;
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error) {
        throw new Error(getErrorMessage((error as { code: string }).code));
      }
      throw error;
    }
  },

  // Reset de senha
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error) {
        throw new Error(getErrorMessage((error as { code: string }).code));
      }
      throw error;
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch {
      throw new Error("Erro ao fazer logout");
    }
  },

  // Observer de mudança de autenticação
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  getErrorMessage,
};
