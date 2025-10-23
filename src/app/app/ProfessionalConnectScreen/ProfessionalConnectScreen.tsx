import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { router } from "expo-router";
import Clipboard from "@react-native-clipboard/clipboard";
import { styles } from "./styles";

const ProfessionalConnectScreen: React.FC = () => {
  const [codigo, setCodigo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const gerarCodigoAleatorio = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    const length = 6;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleGerarCodigo = async () => {
    setIsLoading(true);

    // Simulação de geração e salvamento no backend
    setTimeout(() => {
      const novoCodigo = gerarCodigoAleatorio();
      setCodigo(novoCodigo);
      setIsLoading(false);

      // Aqui você integraria com Firebase/API para salvar o código
      console.log(`Código gerado: ${novoCodigo}. Salvar no Firestore.`);

      Alert.alert(
        "Código Gerado!",
        `Compartilhe este código com seu paciente: ${novoCodigo}`,
        [{ text: "OK" }]
      );
    }, 1000);
  };

  const handleCopiarCodigo = () => {
    console.log("Botão clicado! Código:", codigo);
    
    if (!codigo) {
      Alert.alert("Aviso", "Gere um código primeiro!");
      return;
    }

    try {
      Clipboard.setString(codigo);
      setCopiado(true);
      console.log("Código copiado com sucesso!");
      
      setTimeout(() => {
        setCopiado(false);
      }, 2000);
    } catch (error) {
      console.error("Erro ao copiar:", error);
      Alert.alert("Erro", "Não foi possível copiar o código.");
    }
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
            <Icon name="medical-services" size={40} color="#4ECDC4" />
          </View>
          <Text style={styles.title}>Gerar Código de Conexão</Text>
          <Text style={styles.subtitle}>
            Crie um código único para conectar-se ao seu paciente
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Como Funciona:</Text>

          <View style={styles.instructionItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.instructionText}>
              <Text style={styles.instructionTitle}>Gere o Código</Text>
              <Text style={styles.instructionDescription}>
                Clique no botão "Gerar Novo Código" abaixo para criar um código
                único de 6 caracteres.
              </Text>
            </View>
          </View>

          <View style={styles.instructionItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.instructionText}>
              <Text style={styles.instructionTitle}>Compartilhe</Text>
              <Text style={styles.instructionDescription}>
                Envie este código para o seu paciente através do canal de
                comunicação que vocês utilizam.
              </Text>
            </View>
          </View>

          <View style={styles.instructionItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.instructionText}>
              <Text style={styles.instructionTitle}>Aguarde a Conexão</Text>
              <Text style={styles.instructionDescription}>
                O paciente deve acessar "Conectar ao Profissional" no aplicativo
                e inserir o código para estabelecer a conexão.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.formCard}>
          <TouchableOpacity
            style={[
              styles.connectButton,
              isLoading && styles.connectButtonDisabled,
            ]}
            onPress={handleGerarCodigo}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.connectButtonText}>Gerando...</Text>
            ) : (
              <>
                <Icon name="refresh" size={20} color="#fff" />
                <Text style={styles.connectButtonText}>Gerar Novo Código</Text>
              </>
            )}
          </TouchableOpacity>

          {codigo ? (
            <View style={styles.codigoDisplay}>
              <Text style={styles.codigoLabel}>
                Seu Código de Conexão Único:
              </Text>
              <Text style={styles.codigoValor}>{codigo}</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={handleCopiarCodigo}
              >
                <Icon name={copiado ? "check" : "content-copy"} size={18} color="#fff" />
                <Text style={styles.copyButtonText}>
                  {copiado ? "Copiado!" : "Copiar Código"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfessionalConnectScreen;