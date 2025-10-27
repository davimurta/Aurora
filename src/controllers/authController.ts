import type { User } from "firebase/auth";
// 🔄 ATUALIZADO: Agora usa o backend em vez de Firebase direto
import { AuthModelApi as AuthModel } from '../models/AuthModelApi'
import type { PacienteData, PsicologoData, UserData } from "../types/auth.types";

export class AuthController {
  private static instance: AuthController;
  private user: User | null = null;
  private userData: UserData | null = null;
  private loading = false;
  private listeners: Array<(user: User | null, data: UserData | null, loading: boolean) => void> = [];

  private constructor() {}

  public static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.user, this.userData, this.loading));
  }

  public addListener(listener: (user: User | null, data: UserData | null, loading: boolean) => void) {
    this.listeners.push(listener);
  }

  public removeListener(listener: (user: User | null, data: UserData | null, loading: boolean) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  public getUser() {
    return this.user;
  }

  public getUserData() {
    return this.userData;
  }

  public isLoading() {
    return this.loading;
  }

  // 🔹 LOGIN (Agora consome o backend)
  public async login(email: string, password: string): Promise<User> {
    this.loading = true;
    this.notifyListeners();
    try {
      const user = await AuthModel.login(email, password);
      this.user = user;
      this.userData = await AuthModel.getUserDataFromBackend(user.uid);
      return user;
    } finally {
      this.loading = false;
      this.notifyListeners();
    }
  }

  // 🔹 REGISTRO GENÉRICO
  public async register(email: string, password: string, displayName: string): Promise<User> {
    this.loading = true;
    this.notifyListeners();
    try {
      const user = await AuthModel.register(email, password, displayName);
      this.user = user;
      return user;
    } finally {
      this.loading = false;
      this.notifyListeners();
    }
  }

  // 🔹 REGISTRO PACIENTE (Agora consome o backend)
  public async registerPaciente(data: PacienteData): Promise<User> {
    this.loading = true;
    this.notifyListeners();

    try {
      const user = await AuthModel.registerPaciente(data);
      this.user = user;
      this.userData = await AuthModel.getUserDataFromBackend(user.uid);
      return user;
    } catch (error: any) {
      console.error("Erro ao registrar paciente:", error);
      throw new Error(error.message || "Falha ao registrar paciente");
    } finally {
      this.loading = false;
      this.notifyListeners();
    }
  }


  // 🔹 REGISTRO PSICÓLOGO (Agora consome o backend)
  public async registerPsicologo(data: PsicologoData): Promise<User> {
  this.loading = true;
  this.notifyListeners();

  try {
    const user = await AuthModel.registerPsicologo(data);
    this.user = user;
    this.userData = await AuthModel.getUserDataFromBackend(user.uid);
    return user;
  } catch (error: any) {
    console.error("Erro ao registrar psicólogo:", error);
    throw new Error(error.message || "Falha ao registrar psicólogo");
  } finally {
    this.loading = false;
    this.notifyListeners();
  }
}


  // 🔹 RESET DE SENHA (Agora consome o backend)
  public async resetPassword(email: string): Promise<void> {
    await AuthModel.resetPassword(email);
  }

  // 🔹 LOGOUT (Agora consome o backend)
  public async logout(): Promise<void> {
    await AuthModel.logout();
    this.user = null;
    this.userData = null;
    this.notifyListeners();
  }

  // 🔹 Ouvinte de autenticação (Agora consome o backend)
  public initializeAuthListener() {
    AuthModel.onAuthStateChanged(async user => {
      this.user = user;
      if (user) {
        this.userData = await AuthModel.getUserDataFromBackend(user.uid);
      } else {
        this.userData = null;
      }
      this.notifyListeners();
    });
  }
}
