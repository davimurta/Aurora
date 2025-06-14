import React from "react";
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
  Linking,
} from "react-native";
import Input from "@components/Input";
import Button from "@components/Button";
import { router } from "expo-router";

const Login: React.FC = () => {
  const Cadastro = () => {
    Linking.openURL('https://www.seusite.com/cadastro');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined} // no Android use undefined ou "height"
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // ajusta para evitar sobreposição
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled" // permite toque fora para fechar teclado
        >
          <View style={styles.inputWrapper}>
            <View style={styles.googleLogin}>
              <Image
                source={require("@assets/images/google.png")}
                style={styles.image}
              />
              <Text>Fazer Login com o google</Text>
            </View>

            <View style={styles.divider} />

            <Input
              style={styles.input}
              label="Email"
              type="email"
              placeholder="Digite seu email"
              keyboardType="email-address"
              iconName="email"
            />

            <Input
              style={styles.input}
              label="Senha"
              type="senha"
              placeholder="Digite sua senha"
              secureTextEntry
              iconName="lock"
            />

            <Button
              title="Entrar"
              iconName="login"
              onPress={() => router.push("/Home/Home")}
              backgroundColor="#4ECDC4"
              textColor="#fff"
              loading={false}
              style={{ marginTop: 30, alignSelf: "center" }} // ou qualquer outro estilo
            />

            <Pressable onPress={() => router.push('/Cadastro/Cadastro')}>
              <Text style={styles.link}>
                Não tem uma conta? Criar uma agora
              </Text>
            </Pressable>
            <Pressable onPress={() => router.push('/RedefinirSenha/RedefinirSenha')}>
              <Text style={styles.link}>
                Esqueci a senha
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
    borderRadius: 8,
  },
  link: {
    color: '#B0B0B0',
    textDecorationLine: 'underline',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Login;
