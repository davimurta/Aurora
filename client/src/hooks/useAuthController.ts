import { useState, useEffect } from "react";
import type { User } from "firebase/auth";
import { AuthController } from "../controllers/authController";
import type { UserData, PacienteData, PsicologoData } from "../types/auth.types";

export const useAuthController = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authController] = useState(() => AuthController.getInstance());

  useEffect(() => {
    const handleAuthStateChange = (
      newUser: User | null,
      newUserData: UserData | null,
      newLoading: boolean
    ) => {
      setUser(newUser);
      setUserData(newUserData);
      setLoading(newLoading);
    };

    authController.addListener(handleAuthStateChange);
    authController.initializeAuthListener();

    setUser(authController.getUser());
    setUserData(authController.getUserData());
    setLoading(authController.isLoading());

    return () => {
      authController.removeListener(handleAuthStateChange);
    };
  }, [authController]);

  return {
    user,
    userData,
    loading,
    login: (email: string, password: string) => authController.login(email, password),
    register: (email: string, password: string, displayName: string) =>
      authController.register(email, password, displayName),
    registerPaciente: (data: PacienteData) => authController.registerPaciente(data),
    registerPsicologo: (data: PsicologoData) => authController.registerPsicologo(data),
    resetPassword: (email: string) => authController.resetPassword(email),
    logout: () => authController.logout(),
    getUserData: () => authController.getUserData(),
  };
};