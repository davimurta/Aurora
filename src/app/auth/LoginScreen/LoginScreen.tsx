import React, { useState, useEffect } from "react";
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
  Animated,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useAuthController } from '../../../hooks/useAuthController';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuthController();
  const params = useLocalSearchParams();
  const isWeb = Platform.OS === 'web';

  // Detecta se veio do cadastro
  useEffect(() => {
    if (params.registered === 'true' || params.registered === 'psychologist') {
      setShowSuccessBanner(true);
  
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
  
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setShowSuccessBanner(false);
        });
      }, 5000);
  
      return () => clearTimeout(timer);
    }
  }, [params.registered]);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Por favor, preencha todos os campos');
      return;
    }
  
    setLoading(true);
    setErrorMessage(''); // Limpa erro anterior
    
    try {
      await login(email, password);
      setLoading(false);
      router.push('/app/HomeScreen/HomeScreen');
      
    } catch (error: any) {
      setLoading(false);
      console.log('ENTROU NO CATCH - VAI SETAR ERRO'); // Debug
      setErrorMessage('Email ou senha incorretos. Verifique seus dados e tente novamente.');
      console.log('ERROR MESSAGE SETADO:', errorMessage); // Debug
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Em breve', 'Login com Google será implementado em breve');
  };

  const ScrollContent = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
            {/* Banner de Sucesso */}
            {showSuccessBanner && (
              <Animated.View style={[styles.successBanner, { opacity: fadeAnim }]}>
                <Icon name="check-circle" size={24} color="#fff" />
                <View style={styles.successTextContainer}>
                <Text style={styles.successTitle}>Conta criada com sucesso!</Text>
                <Text style={styles.successSubtitle}>
                  {params.registered === 'psychologist'
                    ? 'Seus dados estão em análise. Aguarde a aprovação.'
                    : 'Faça login para começar'}
                </Text>
                </View>
              </Animated.View>
            )}

            {/* Banner de Erro */}
            {errorMessage && (
              <View style={styles.errorBanner}>
                <Icon name="error" size={24} color="#fff" />
                <Text style={styles.errorText}>{errorMessage}</Text>
                <TouchableOpacity onPress={() => setErrorMessage('')}>
                  <Icon name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.headerSection}>
              <View style={styles.logoContainer}>
                <View style={styles.logoPlaceholder}>
                  <Icon name="psychology" size={40} color="#fff" />
                </View>
                <Text style={styles.appName}>Aurora</Text>
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
                <Text style={styles.inputLabel}>Email</Text>
                <View style={[
                  styles.inputWrapper,
                  emailFocused && styles.inputWrapperFocused
                ]}>
                  <Icon name="email" size={20} color={emailFocused ? "#4ECDC4" : "#999"} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Digite seu email"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Senha</Text>
                <View style={[
                  styles.inputWrapper,
                  passwordFocused && styles.inputWrapperFocused
                ]}>
                  <Icon name="lock" size={20} color={passwordFocused ? "#4ECDC4" : "#999"} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Digite sua senha"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Forgot Password Link */}
              <View style={styles.forgotPasswordContainer}>
                <Pressable 
                  onPress={() => router.push('/auth/LoginScreen/LoginScreen')}
                  style={styles.forgotPasswordButton}
                >
                  <Text style={styles.forgotPasswordText}>
                    Esqueceu a senha?
                  </Text>
                </Pressable>
              </View>

              {/* Login Button */}
              <View style={styles.loginButtonContainer}>
                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    (loading || !email || !password) && styles.loginButtonDisabled
                  ]}
                  onPress={handleLogin}
                  disabled={loading || !email || !password}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Icon name="login" size={20} color="#fff" style={styles.buttonIcon} />
                      <Text style={styles.loginButtonText}>Entrar</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer Section */}
            <View style={styles.footerSection}>
              <Text style={styles.signupText}>Não tem uma conta?</Text>
              <Pressable 
                onPress={() => router.push('/auth/UserTypeSelectionScreen/UserTypeSelectionScreen')}
                style={styles.signupButton}
              >
                <Text style={styles.signupLinkText}>
                  Criar conta agora
                </Text>
              </Pressable>
            </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : isWeb ? undefined : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {isWeb ? (
          <ScrollContent />
        ) : (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <ScrollContent />
            </View>
          </TouchableWithoutFeedback>
        )}
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
  
  // Banner de Sucesso
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    // Remove gap: 12,
    shadowColor: '#4ECDC4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  successTextContainer: {
    flex: 1,
    marginLeft: 12, // ← Adiciona margem
  },
  successTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  successSubtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
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
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4ECDC4',
    marginTop: 12,
    letterSpacing: 0.5,
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
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E1E8ED',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  inputWrapperFocused: {
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
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#2C3E50',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 280,
    height: 56,
    backgroundColor: '#4ECDC4',
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
  loginButtonDisabled: {
    opacity: 0.6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E74C3C',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    // Remove o gap: 12,
    shadowColor: '#E74C3C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  errorText: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 12, // ← Adiciona margem lateral para substituir o gap
  },
});

export default Login;