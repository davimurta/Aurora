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
import { useAuth } from "../contexts/AuthContext";
import { db } from "../services/firebaseConfig";
import { collection, addDoc } from 'firebase/firestore';

const Cadastro = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();

  // Função para testar Firestore
  const testFirestore = async () => {
    try {
      console.log('Testando Firestore...');
      const testData = {
        message: 'Teste de conexão',
        timestamp: new Date(),
      };
      
      const docRef = await addDoc(collection(db, 'teste'), testData);
      console.log('✅ Documento de teste criado:', docRef.id);
      Alert.alert('Sucesso', `Firestore funcionando! ID: ${docRef.id}`);
    } catch (error) {
      console.error('❌ Erro no teste do Firestore:', error);
      Alert.alert(
        'Erro',
        `Firestore não funcionando: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  const handleRegister = async () => {
    console.log('Iniciando processo de cadastro...');
    console.log('Email:', email);
    console.log('Nome:', displayName);
    console.log('Senha length:', password.length);
    
    if (!email || !password || !displayName) {
      console.log('Campos obrigatórios não preenchidos');
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      console.log('Senha muito curta');
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      console.log('Chamando função de registro...');
      await register(email, password, displayName);
      console.log('Cadastro realizado com sucesso!');
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'OK', onPress: () => router.push('/UserTypeSelection') }
      ]);
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
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

            {/* Botão temporário para teste do Firestore */}
            <Button
              title="Teste Firestore"
              onPress={testFirestore}
              backgroundColor="#FF6B6B"
              textColor="#fff"
              style={{ marginTop: 10, alignSelf: "center" }}
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
  input: {
    width: "100%",
  },
  divider: {
    height: 2,
    borderRadius: 9999,
    backgroundColor: "#4ECDC4",
    marginVertical: 20,
    width: "100%",
  },
  image: {
    width: 20,
    height: 20,
    alignSelf: "center",
  },
  googleLogin: {
    width: "100%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
    gap: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#4ECDC4",
    borderRadius: 4,
  },
  link: {
    color: '#B0B0B0',
    textDecorationLine: 'underline',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Cadastro;