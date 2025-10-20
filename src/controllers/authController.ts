import type { User } from "firebase/auth";
import { AuthModel } from '../models/AuthModel'
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

  // 🔹 LOGIN
  public async login(email: string, password: string): Promise<User> {
    this.loading = true;
    this.notifyListeners();
    try {
      const user = await AuthModel.login(email, password);
      this.user = user;
      this.userData = await AuthModel.getUserDataFromFirestore(user.uid);
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

  // 🔹 REGISTRO PACIENTE
  public async registerPaciente(data: PacienteData): Promise<User> {
    this.loading = true;
    this.notifyListeners();
    try {
      const user = await AuthModel.registerPaciente(data);
      this.user = user;
      this.userData = await AuthModel.getUserDataFromFirestore(user.uid);
      return user; // ✅ importante para o fluxo do Alert funcionar
    } finally {
      this.loading = false;
      this.notifyListeners();
    }
  }

  // 🔹 REGISTRO PSICÓLOGO
  public async registerPsicologo(data: PsicologoData): Promise<User> {
    this.loading = true;
    this.notifyListeners();
    try {
      const user = await AuthModel.registerPsicologo(data);
      this.user = user;
      this.userData = await AuthModel.getUserDataFromFirestore(user.uid);
      return user;
    } finally {
      this.loading = false;
      this.notifyListeners();
    }
  }

  // 🔹 RESET DE SENHA
  public async resetPassword(email: string): Promise<void> {
    await AuthModel.resetPassword(email);
  }

  // 🔹 LOGOUT
  public async logout(): Promise<void> {
    await AuthModel.logout();
    this.user = null;
    this.userData = null;
    this.notifyListeners();
  }

  // 🔹 Ouvinte de autenticação
  public initializeAuthListener() {
    AuthModel.onAuthStateChanged(async user => {
      this.user = user;
      if (user) {
        this.userData = await AuthModel.getUserDataFromFirestore(user.uid);
      } else {
        this.userData = null;
      }
      this.notifyListeners();
    });
  }
}
