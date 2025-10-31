import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useAuthController } from '../../../hooks/useAuthController';
import { connectionApi } from '../../../services/connectionApi';
import { styles } from "./_styles";

interface ConnectedPsychologist {
  id: string;
  name: string;
  connectedAt: string;
}

const PatientConnectScreen: React.FC = () => {
  const [codigo, setCodigo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingConnection, setLoadingConnection] = useState(true);
  const [connectedPsychologist, setConnectedPsychologist] = useState<ConnectedPsychologist | null>(null);
  const { user, userData } = useAuthController();

  // Carrega informações do psicólogo conectado ao abrir a tela
  useEffect(() => {
    loadConnectedPsychologist();
  }, [user]);

  const loadConnectedPsychologist = async () => {
    if (!user) {
      setLoadingConnection(false);
      return;
    }

    try {
      setLoadingConnection(true);
      const response = await connectionApi.getPsychologist(user.uid);

      if (response.success && response.psychologist) {
        setConnectedPsychologist(response.psychologist);
      } else {
        setConnectedPsychologist(null);
      }
    } catch (error) {
      // Se não encontrar psicólogo conectado (404), não é erro
      setConnectedPsychologist(null);
    } finally {
      setLoadingConnection(false);
    }
  };

  const handleConectar = async () => {
    console.log('🔵 handleConectar chamado');
    console.log('🔵 user:', user);
    console.log('🔵 userData:', userData);

    if (!user || !userData) {
      console.log('❌ Erro: usuário não encontrado');
      Alert.alert('Erro', 'Você precisa estar logado');
      return;
    }

    if (codigo.length !== 6) {
      Alert.alert(
        "Código Inválido",
        "O código deve ter 6 caracteres. Verifique se o código está completo."
      );
      return;
    }

    // Pega email e nome, com validação
    const patientEmail = user.email || userData.email;
    const patientName = userData.displayName || user.displayName;

    console.log('🔵 Dados extraídos:');
    console.log('  - user.email:', user.email);
    console.log('  - userData.email:', userData.email);
    console.log('  - user.displayName:', user.displayName);
    console.log('  - userData.displayName:', userData.displayName);
    console.log('  - patientEmail final:', patientEmail);
    console.log('  - patientName final:', patientName);

    // Valida se email e nome existem
    if (!patientEmail || patientEmail.trim() === '') {
      console.log('❌ Email não encontrado');
      Alert.alert(
        'Erro',
        'Seu email não foi encontrado. Por favor, faça login novamente.'
      );
      return;
    }

    if (!patientName || patientName.trim() === '') {
      console.log('❌ Nome não encontrado');
      Alert.alert(
        'Erro',
        'Seu nome não foi encontrado. Por favor, faça login novamente.'
      );
      return;
    }

    setIsLoading(true);

    console.log('🔵 Dados que serão enviados para API:');
    console.log('  - código:', codigo);
    console.log('  - patientId:', user.uid);
    console.log('  - patientName:', patientName);
    console.log('  - patientEmail:', patientEmail);

    try {
      const response = await connectionApi.connect(
        codigo,
        user.uid,
        patientName,
        patientEmail
      );

      setIsLoading(false);
      setCodigo(""); // Limpa o código

      // Recarrega as informações do psicólogo conectado
      await loadConnectedPsychologist();

      Alert.alert(
        "Conexão Estabelecida!",
        `Sua conta foi conectada ao profissional ${response.connection.psychologistName} com sucesso.`,
        [
          {
            text: "OK",
          },
        ]
      );
    } catch (error: any) {
      setIsLoading(false);
      console.error('Erro ao conectar:', error);

      const errorMessage = error.response?.data?.message || error.message ||
        'Código não encontrado ou expirado';

      Alert.alert(
        "Erro na Conexão",
        errorMessage
      );
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
            <Icon name="people" size={40} color="#4ECDC4" />
          </View>
          <Text style={styles.title}>Conecte-se ao Seu Profissional</Text>
          <Text style={styles.subtitle}>
            Sincronize sua jornada com o apoio de quem cuida de você
          </Text>
        </View>

        {/* Status de Conexão */}
        {loadingConnection ? (
          <View style={styles.connectionStatusCard}>
            <ActivityIndicator size="small" color="#4ECDC4" />
            <Text style={styles.connectionStatusText}>Verificando conexão...</Text>
          </View>
        ) : connectedPsychologist ? (
          <View style={[styles.connectionStatusCard, styles.connectedCard]}>
            <View style={styles.connectedHeader}>
              <Icon name="check-circle" size={24} color="#4CAF50" />
              <Text style={styles.connectedTitle}>Você está conectado!</Text>
            </View>
            <View style={styles.connectedInfo}>
              <Icon name="person" size={20} color="#666" />
              <Text style={styles.connectedText}>
                Profissional: <Text style={styles.connectedName}>{connectedPsychologist.name}</Text>
              </Text>
            </View>
            <View style={styles.connectedInfo}>
              <Icon name="event" size={20} color="#666" />
              <Text style={styles.connectedText}>
                Conectado em: <Text style={styles.connectedDate}>
                  {new Date(connectedPsychologist.connectedAt).toLocaleDateString('pt-BR')}
                </Text>
              </Text>
            </View>
          </View>
        ) : null}

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