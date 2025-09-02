// controllers/AuthController.ts
import { User } from 'firebase/auth';
import { AuthModel } from '../models/AuthModel';
import type { UserData, PacienteData, PsicologoData } from '../types/auth.types';

export class AuthController {
  private static instance: AuthController;
  private user: User | null = null;
  private userData: UserData | null = null;
  private loading: boolean = true;
  private listeners: Array<(user: User | null, userData: UserData | null, loading: boolean) => void> = [];

  private constructor() {
    this.initAuthStateListener();
  }

  // Singleton para garantir uma única instância
  public static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  // Inicializar listener de mudança de estado
  private initAuthStateListener(): void {
    AuthModel.onAuthStateChanged(async (user) => {
      this.user = user;
      
      if (user) {
        const data = await AuthModel.getUserDataFromFirestore(user.uid);
        this.userData = data;
      } else {
        this.userData = null;
      }
      
      this.loading = false;
      this.notifyListeners();
    });
  }

  // Adicionar listener
  public addListener(callback: (user: User | null, userData: UserData | null, loading: boolean) => void): void {
    this.listeners.push(callback);
  }

  // Remover listener
  public removeListener(callback: (user: User | null, userData: UserData | null, loading: boolean) => void): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Notificar listeners
  private notifyListeners(): void {
    this.listeners.forEach(callback => {
      callback(this.user, this.userData, this.loading);
    });
  }

  // Getters
  public getUser(): User | null {
    return this.user;
  }

  public getUserData(): UserData | null {
    return this.userData;
  }

  public isLoading(): boolean {
    return this.loading;
  }

  // Login
  public async login(email: string, password: string): Promise<void> {
      await AuthModel.login(email, password);
  }

  // Registro básico
  public async register(email: string, password: string, displayName: string): Promise<void> {
      await AuthModel.register(email, password, displayName);
  }

  // Registro de paciente
  public async registerPaciente(data: PacienteData): Promise<void> {
      await AuthModel.registerPaciente(data);
  }

  // Registro de psicólogo
  public async registerPsicologo(data: PsicologoData, documents?: undefined): Promise<void> {
      await AuthModel.registerPsicologo(data, documents);
  }

  // Reset de senha
  public async resetPassword(email: string): Promise<void> {
      await AuthModel.resetPassword(email);
  }

  // Logout
  public async logout(): Promise<void> {
      await AuthModel.logout();
      this.userData = null;
  }

  // Buscar dados do usuário atual
  public async getCurrentUserData(): Promise<UserData | null> {
    if (!this.user) return null;
    return await AuthModel.getUserDataFromFirestore(this.user.uid);
  }
}