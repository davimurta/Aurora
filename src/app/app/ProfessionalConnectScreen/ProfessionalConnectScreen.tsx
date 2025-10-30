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
import { useAuthController } from '../../../hooks/useAuthController';
import { connectionApi } from '../../../services/connectionApi';
import { styles } from "./styles";

const ProfessionalConnectScreen: React.FC = () => {
  const [codigo, setCodigo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const { user, userData } = useAuthController();

  const handleGerarCodigo = async () => {
    console.log('🔵 handleGerarCodigo chamado');
    console.log('🔵 user:', user);
    console.log('🔵 userData:', userData);

    if (!user) {
      console.log('❌ Erro: usuário não encontrado');
      Alert.alert('Erro', 'Você precisa estar logado');
      return;
    }

    setIsLoading(true);
    console.log('🔵 Iniciando requisição para gerar código...');

    try {
      const response = await connectionApi.generateCode(
        user.uid,
        userData?.displayName || 'Profissional'
      );

      console.log('✅ Resposta recebida:', response);
      console.log('✅ Código gerado:', response.code);

      setCodigo(response.code);
      setIsLoading(false);

      Alert.alert(
        "Código Gerado!",
        `Compartilhe este código com seu paciente: ${response.code}`,
        [{ text: "OK" }]
      );
    } catch (error: any) {
      setIsLoading(false);
      console.error('❌ Erro ao gerar código:', error);
      console.error('❌ Detalhes do erro:', error.response?.data);
      console.error('❌ Status:', error.response?.status);

      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Não foi possível gerar o código. Tente novamente.'
      );
    }
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