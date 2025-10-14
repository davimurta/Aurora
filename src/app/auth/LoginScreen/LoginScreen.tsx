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
import { useAuthController } from '../../../hooks/useAuthController';
import { styles } from './styles';

const LoginScreen: React.FC = () => {
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
        router.push('/app/HomeScreen/HomeScreen');
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

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View>

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
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;