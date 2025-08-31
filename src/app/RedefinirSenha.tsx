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
  SafeAreaView,
} from "react-native";
import Input from "@components/Input";
import Button from "@components/Button";
import Icon from 'react-native-vector-icons/MaterialIcons';
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

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Por favor, digite um email válido');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      Alert.alert(
        'Email Enviado!',
        'Um link para redefinir sua senha foi enviado para seu email. Verifique sua caixa de entrada e spam.',
        [{ text: 'OK', onPress: () => router.push('/') }]
      );
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <Icon name="lock-reset" size={48} color="#4ECDC4" />
                </View>
                <Text style={styles.title}>Redefinir Senha</Text>
                <Text style={styles.subtitle}>
                  Digite seu email para receber as instruções de redefinição de senha
                </Text>
              </View>

              {/* Form */}
              <View style={styles.form}>
                <Input
                  label="Email"
                  type="email"
                  placeholder="Digite seu email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  iconName="email"
                />

                <Button
                  title="Enviar Link"
                  iconName="send"
                  onPress={handleResetPassword}
                  backgroundColor="#4ECDC4"
                  textColor="#fff"
                  loading={loading}
                  style={styles.submitButton}
                />

                <View style={styles.infoContainer}>
                  <Icon name="info" size={16} color="#666" />
                  <Text style={styles.infoText}>
                    Verifique sua caixa de entrada e também a pasta de spam
                  </Text>
                </View>

                <Pressable onPress={() => router.push('/')} style={styles.backButton}>
                  <Icon name="arrow-back" size={20} color="#4ECDC4" />
                  <Text style={styles.backText}>Voltar para o login</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    gap: 20,
  },
  submitButton: {
    marginTop: 10,
    alignSelf: 'stretch',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 16,
  },
  backText: {
    fontSize: 16,
    color: '#4ECDC4',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default RedefinirSenha;