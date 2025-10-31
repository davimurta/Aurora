import React, { useState } from 'react';
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
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from "expo-router";
import { useAuthController } from '../../../hooks/useAuthController';
import { styles } from './styles';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const { register } = useAuthController();

  const handleRegister = async () => {
    
    if (!email || !password || !displayName) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, displayName);
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'OK', onPress: () => router.push('/auth/UserTypeSelectionScreen/UserTypeSelectionScreen') }
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined} 
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} 
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled" 
        >
          <View style={styles.inputWrapper}>
            <View style={styles.googleLogin}>
              <Image
                source={require("@assets/images/google.png")}
                style={styles.image}
              />
              <Text>Continuar com o Google</Text>
            </View>

            <View style={styles.divider} />

            {/* Nome Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nome completo</Text>
              <View style={[styles.inputWrapper, nameFocused && styles.inputWrapperFocused]}>
                <Icon name="person" size={20} color={nameFocused ? "#4ECDC4" : "#999"} />
                <TextInput
                  style={styles.inputField}
                  placeholder="Digite seu nome completo"
                  placeholderTextColor="#999"
                  value={displayName}
                  onChangeText={setDisplayName}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
                <Icon name="email" size={20} color={emailFocused ? "#4ECDC4" : "#999"} />
                <TextInput
                  style={styles.inputField}
                  placeholder="Digite seu email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Senha Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Senha</Text>
              <View style={[styles.inputWrapper, passwordFocused && styles.inputWrapperFocused]}>
                <Icon name="lock" size={20} color={passwordFocused ? "#4ECDC4" : "#999"} />
                <TextInput
                  style={styles.inputField}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Botão de Cadastro */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Icon name="login" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Cadastrar</Text>
                </>
              )}
            </TouchableOpacity>

            <Pressable onPress={() => router.push('/')}>
              <Text style={styles.link}>
                Já tem uma conta? Faça login aqui
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default RegisterScreen;