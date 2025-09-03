import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
  Image,
  Text,
  Pressable,
  Alert,
  SafeAreaView,
} from "react-native";
import Input from "@components/Input";
import Button from "@components/Button";
import { router } from "expo-router";
import { useAuthController } from '../../hooks/useAuthController';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  const { login } = useAuthController();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      setTimeout(() => {
        router.push('/app/Home');
      }, 100);
      
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Em breve', 'Login com Google será implementado em breve');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerSection}>
              <View style={styles.logoContainer}>
                <View style={styles.logoPlaceholder}>
                  <Text style={styles.logoText}>Logo</Text>
                </View>
              </View>
              
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeTitle}>Bem-vindo de volta!</Text>
                <Text style={styles.welcomeSubtitle}>
                  Faça login para continuar sua jornada
                </Text>
              </View>
            </View>

            <View style={styles.formSection}>
              <Pressable 
                style={[styles.googleLogin, styles.shadowButton]}
                onPress={handleGoogleLogin}
                android_ripple={{ color: '#f0f0f0' }}
              >
                <Image
                  source={require("@assets/images/google.png")}
                  style={styles.googleIcon}
                />
                <Text style={styles.googleLoginText}>Continuar com o Google</Text>
              </Pressable>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Input
                  style={[
                    styles.input,
                    emailFocused && styles.inputFocused
                  ]}
                  label="Email"
                  type="email"
                  placeholder="Digite seu email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  iconName="email"
                  editable={!loading}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Input
                  style={[
                    styles.input,
                    passwordFocused && styles.inputFocused
                  ]}
                  label="Senha"
                  type="senha"
                  placeholder="Digite sua senha"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  iconName="lock"
                  editable={!loading}
                />
              </View>

              {/* Forgot Password Link */}
              <View style={styles.forgotPasswordContainer}>
                <Pressable 
                  onPress={() => router.push('/auth/RedefinirSenha')}
                  style={styles.forgotPasswordButton}
                >
                  <Text style={styles.forgotPasswordText}>
                    Esqueceu a senha?
                  </Text>
                </Pressable>
              </View>

              {/* Login Button */}
              <View style={styles.loginButtonContainer}>
                <Button
                  title="Entrar"
                  iconName="login"
                  onPress={handleLogin}
                  backgroundColor="#4ECDC4"
                  textColor="#fff"
                  loading={loading}
                  style={[styles.loginButton, styles.shadowButton]}
                  disabled={loading || !email || !password}
                />
              </View>
            </View>

            {/* Footer Section */}
            <View style={styles.footerSection}>
              <Text style={styles.signupText}>Não tem uma conta?</Text>
              <Pressable 
                onPress={() => router.push('/auth/UserTypeSelection')}
                style={styles.signupButton}
              >
                <Text style={styles.signupLinkText}>
                  Criar conta agora
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#4ECDC4',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4ECDC4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 22,
  },

  formSection: {
    flex: 1,
    marginBottom: 30,
  },
  googleLogin: {
    width: "100%",
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: "#E1E8ED",
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  googleIcon: {
    width: 24,
    height: 24,
  },
  googleLoginText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E1E8ED',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#95A5A6',
    fontWeight: '500',
  },

  inputContainer: {
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E1E8ED',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
  },
  inputFocused: {
    borderColor: '#4ECDC4',
    shadowColor: '#4ECDC4',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  forgotPasswordText: {
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '600',
  },

  loginButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    width: '100%',
    display: 'flex',
  },
  loginButton: {
    width: '100%',
    maxWidth: 280,
    height: 56,
    borderRadius: 12,
    shadowColor: '#4ECDC4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  footerSection: {
    alignItems: 'center',
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  signupText: {
    fontSize: 16,
    color: '#7F8C8D',
    marginRight: 8,
  },
  signupButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  signupLinkText: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: '600',
  },

  shadowButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default Login;