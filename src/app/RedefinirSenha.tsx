import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
  Text,
  Pressable,
  Alert,
} from "react-native";
import Input from "@components/Input";
import Button from "@components/Button";
import { router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

const RedefinirSenha: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, digite seu email');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      Alert.alert(
        'Sucesso', 
        'Um link para redefinir sua senha foi enviado para seu email',
        [{ text: 'OK', onPress: () => router.push('/') }]
      );
    } catch (error: any) {
      Alert.alert('Erro', error.message);
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
            <Text style={styles.title}>Redefinir Senha</Text>
            <Text style={styles.subtitle}>
              Digite seu email para receber as instruções de redefinição de senha
            </Text>

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

            <Button
              title="Enviar"
              iconName="send"
              onPress={handleResetPassword}
              backgroundColor="#4ECDC4"
              textColor="#fff"
              loading={loading}
              style={{ marginTop: 30, alignSelf: "center" }}
            />

            <Pressable onPress={() => router.push('/')}>
              <Text style={styles.link}>
                Voltar para o login
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 40,
    paddingVertical: 20,
    justifyContent: "center",
  },
  inputWrapper: {
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 22,
  },
  input: {
    width: "100%",
  },
  link: {
    color: '#B0B0B0',
    textDecorationLine: 'underline',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RedefinirSenha;