import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  KeyboardAvoidingView,
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
import { styles } from "./_styles";

// Componente de Banner de Sucesso (Memoizado para evitar re-renders)
const SuccessBanner = React.memo(({ show, fadeAnim, message }: any) => {
  if (!show) return null;
  
  return (
    <Animated.View style={[styles.successBanner, { opacity: fadeAnim }]}>
      <Icon name="check-circle" size={24} color="#fff" />
      <View style={styles.successTextContainer}>
        <Text style={styles.successTitle}>Conta criada com sucesso!</Text>
        <Text style={styles.successSubtitle}>{message}</Text>
      </View>
    </Animated.View>
  );
});

// Componente de Banner de Erro (Memoizado)
const ErrorBanner = React.memo(({ message, onClose }: any) => {
  if (!message) return null;
  
  return (
    <View style={styles.errorBanner}>
      <Icon name="error" size={24} color="#fff" />
      <Text style={styles.errorText}>{message}</Text>
      <TouchableOpacity onPress={onClose}>
        <Icon name="close" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
});

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const { login } = useAuthController();
  const params = useLocalSearchParams();
  const isWeb = Platform.OS === 'web';

  // Mensagem do banner de sucesso
  const successMessage = params.registered === 'psychologist'
    ? 'Seus dados estão em análise. Aguarde a aprovação.'
    : 'Faça login para começar';

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

  // Handlers memoizados para evitar re-renders
  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
  }, []);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
  }, []);

  const handleEmailFocus = useCallback(() => {
    setEmailFocused(true);
  }, []);

  const handleEmailBlur = useCallback(() => {
    setEmailFocused(false);
  }, []);

  const handlePasswordFocus = useCallback(() => {
    setPasswordFocused(true);
  }, []);

  const handlePasswordBlur = useCallback(() => {
    setPasswordFocused(false);
  }, []);

  const clearError = useCallback(() => {
    setErrorMessage('');
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Por favor, preencha todos os campos');
      return;
    }
  
    setLoading(true);
    setErrorMessage('');
    
    try {
      await login(email, password);
      router.push('/app/HomeScreen/HomeScreen');
    } catch (error: any) {
      setErrorMessage('Email ou senha incorretos. Verifique seus dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Em breve', 'Login com Google será implementado em breve');
  };

  const handleForgotPassword = () => {
    // router.push('/auth/ForgotPasswordScreen/ForgotPasswordScreen');
  };

  const handleSignup = () => {
    router.push('/auth/UserTypeSelectionScreen/UserTypeSelectionScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={Keyboard.dismiss}
        >
            {/* Banner de Sucesso */}
            <SuccessBanner 
              show={showSuccessBanner} 
              fadeAnim={fadeAnim}
              message={successMessage}
            />

            {/* Banner de Erro */}
            <ErrorBanner message={errorMessage} onClose={clearError} />

            {/* Header Section */}
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

            {/* Form Section */}
            <View style={styles.formSection}>
              {/* Google Login Button */}
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
                  <Icon 
                    name="email" 
                    size={20} 
                    color={emailFocused ? "#4ECDC4" : "#999"} 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    ref={emailInputRef}
                    style={styles.input}
                    placeholder="Digite seu email"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={handleEmailChange}
                    onFocus={handleEmailFocus}
                    onBlur={handleEmailBlur}
                    editable={!loading}
                    returnKeyType="next"
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                    blurOnSubmit={false}
                    selectTextOnFocus={false}
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
                  <Icon 
                    name="lock" 
                    size={20} 
                    color={passwordFocused ? "#4ECDC4" : "#999"} 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    ref={passwordInputRef}
                    style={styles.input}
                    placeholder="Digite sua senha"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={password}
                    onChangeText={handlePasswordChange}
                    onFocus={handlePasswordFocus}
                    onBlur={handlePasswordBlur}
                    editable={!loading}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                    blurOnSubmit={false}
                    selectTextOnFocus={false}
                  />
                </View>
              </View>

              {/* Forgot Password Link */}
              <View style={styles.forgotPasswordContainer}>
                <Pressable 
                  onPress={handleForgotPassword}
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
                onPress={handleSignup}
                style={styles.signupButton}
              >
                <Text style={styles.signupLinkText}>
                  Criar conta agora
                </Text>
              </Pressable>
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;