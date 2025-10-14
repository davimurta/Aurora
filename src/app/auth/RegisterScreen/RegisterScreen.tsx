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
} from "react-native";
import Input from "@components/Input";
import Button from "@components/Button";
import { router } from "expo-router";
import { useAuthController } from '../../../hooks/useAuthController';
import { styles } from './styles';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  
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

            <Input
              style={styles.input}
              label="Nome completo"
              type="texto"
              placeholder="Digite seu nome completo"
              value={displayName}
              onChangeText={setDisplayName}
              iconName="person"
            />
            
            <Input
              style={styles.input}
              label="Email"
              type="email"
              placeholder="Digite seu email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              iconName="email"
            />

            <Input
              style={styles.input}
              label="Senha"
              type="senha"
              placeholder="Digite sua senha"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              iconName="lock"
            />

            <Button
              title="Cadastrar"
              iconName="login"
              onPress={handleRegister}
              backgroundColor="#4ECDC4"
              textColor="#fff"
              loading={loading}
              style={{ marginTop: 30, alignSelf: "center" }}
            />

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