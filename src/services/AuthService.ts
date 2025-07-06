import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig'; // ajuste o caminho conforme seu projeto

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  userType?: 'cliente' | 'prestador';
}

const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Este email já está em uso';
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
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde';
    case 'auth/network-request-failed':
      return 'Erro de rede. Verifique sua conexão';
    default:
      return 'Erro desconhecido';
  }
};

const AuthService = {
  registerWithEmailAndPassword: async (
    email: string, 
    password: string, 
    displayName: string
  ): Promise<UserData> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName });

      const userData: UserData = {
        uid: user.uid,
        email: user.email!,
        displayName,
        createdAt: new Date(),
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      return userData;
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code));
    }
  },

  loginWithEmailAndPassword: async (
    email: string, 
    password: string
  ): Promise<UserData> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserData;
      } else {
        const userData: UserData = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || 'Usuário',
          createdAt: new Date(),
        };
        await setDoc(doc(db, 'users', user.uid), userData);
        return userData;
      }
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code));
    }
  },

  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch {
      throw new Error('Erro ao fazer logout');
    }
  },

  resetPassword: async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code));
    }
  },

  updateUserType: async (uid: string, userType: 'cliente' | 'prestador'): Promise<void> => {
    try {
      await setDoc(doc(db, 'users', uid), { userType }, { merge: true });
    } catch {
      throw new Error('Erro ao atualizar tipo de usuário');
    }
  }
};

export default AuthService;
