import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { router } from "expo-router";
import { styles } from "./styles";

const PatientConnectScreen: React.FC = () => {
  const [codigo, setCodigo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConectar = async () => {
    if (codigo.length !== 6) {
      Alert.alert(
        "Código Inválido",
        "O código deve ter 6 caracteres. Verifique se o código está completo."
      );
      return;
    }

    setIsLoading(true);

    // Simulação de conexão - aqui você integraria com sua API/Firebase
    setTimeout(() => {
      const sucesso = Math.random() > 0.3;
      setIsLoading(false);

      if (sucesso) {
        Alert.alert(
          "Conexão Estabelecida!",
          `Sua conta foi conectada ao profissional com sucesso.`,
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert(
          "Erro na Conexão",
          `O código '${codigo}' não foi encontrado ou está expirado. Verifique novamente com seu profissional.`
        );
      }
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <View style={styles.iconCircle}>
            <Icon name="people" size={40} color="#4ECDC4" />
          </View>
          <Text style={styles.title}>Conecte-se ao Seu Profissional</Text>
          <Text style={styles.subtitle}>
            Sincronize sua jornada com o apoio de quem cuida de você
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Como se Conectar:</Text>

          <View style={styles.instructionItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.instructionText}>
              <Text style={styles.instructionTitle}>Solicite o Código</Text>
              <Text style={styles.instructionDescription}>
                Peça ao seu Psicólogo ou Terapeuta o Código de Conexão de 6
                dígitos gerado por ele no aplicativo.
              </Text>
            </View>
          </View>

          <View style={styles.instructionItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.instructionText}>
              <Text style={styles.instructionTitle}>Insira Abaixo</Text>
              <Text style={styles.instructionDescription}>
                Digite (ou cole) o código recebido no campo abaixo, com atenção
                às letras maiúsculas e números.
              </Text>
            </View>
          </View>

          <View style={styles.instructionItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.instructionText}>
              <Text style={styles.instructionTitle}>Confirme a Conexão</Text>
              <Text style={styles.instructionDescription}>
                Clique em "Conectar". A conexão será estabelecida, permitindo
                que seu profissional acompanhe seu progresso.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>Código de Conexão</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: P9K4V2"
            placeholderTextColor="#999"
            value={codigo}
            onChangeText={(text) => setCodigo(text.toUpperCase())}
            maxLength={6}
            autoCapitalize="characters"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={[
              styles.connectButton,
              isLoading && styles.connectButtonDisabled,
            ]}
            onPress={handleConectar}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.connectButtonText}>Conectando...</Text>
            ) : (
              <>
                <Icon name="link" size={20} color="#fff" />
                <Text style={styles.connectButtonText}>Conectar</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};


export default PatientConnectScreen;