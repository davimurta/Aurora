import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { styles } from './_styles';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const ConsentTerms: React.FC = () => {
  const [pdfUri, setPdfUri] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadPDF();
  }, []);

  const loadPDF = async () => {
    try {
      if (Platform.OS === 'web') {
        // Para web, use o caminho direto
        setPdfUri(require('../../../../assets/Termo_de_Consentimento_Aurora_Formatado_Completo.pdf'));
        setIsLoading(false);
      } else {
        // Para mobile, copie o PDF para o cache e use o URI local
        const asset = require('../../../../assets/Termo_de_Consentimento_Aurora_Formatado_Completo.pdf');
        const fileUri = `${FileSystem.cacheDirectory}Termo_de_Consentimento_Aurora.pdf`;

        // Verifica se o arquivo já existe no cache
        const fileInfo = await FileSystem.getInfoAsync(fileUri);

        if (!fileInfo.exists) {
          // Se não existe, copia do asset
          await FileSystem.downloadAsync(asset, fileUri);
        }

        setPdfUri(fileUri);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Erro ao carregar PDF:', err);
      setError(true);
      setIsLoading(false);
    }
  };

  const handleOpenPDF = async () => {
    try {
      if (Platform.OS === 'web') {
        // No web, abre em nova aba
        window.open(require('../../../../assets/Termo_de_Consentimento_Aurora_Formatado_Completo.pdf'), '_blank');
      } else {
        // No mobile, usa o Sharing API para abrir com app externo
        const fileUri = `${FileSystem.cacheDirectory}Termo_de_Consentimento_Aurora.pdf`;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);

        if (fileInfo.exists) {
          const canShare = await Sharing.isAvailableAsync();
          if (canShare) {
            await Sharing.shareAsync(fileUri, {
              mimeType: 'application/pdf',
              dialogTitle: 'Abrir Termo de Consentimento',
              UTI: 'com.adobe.pdf',
            });
          } else {
            Alert.alert('Erro', 'Não foi possível abrir o documento');
          }
        }
      }
    } catch (error) {
      console.error('Erro ao abrir PDF:', error);
      Alert.alert('Erro', 'Não foi possível abrir o documento');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color="#4ECDC4" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Termo de Consentimento</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ECDC4" />
          <Text style={styles.loadingText}>Carregando documento...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color="#4ECDC4" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Termo de Consentimento</Text>
        </View>
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>Erro ao carregar o documento</Text>
          <TouchableOpacity
            style={styles.openExternalButton}
            onPress={handleOpenPDF}
          >
            <Icon name="open-in-new" size={20} color="#FFF" />
            <Text style={styles.openExternalButtonText}>Abrir Documento</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#4ECDC4" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Termo de Consentimento</Text>
      </View>

      {/* PDF Viewer */}
      <View style={styles.contentContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            src={pdfUri}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Termo de Consentimento"
          />
        ) : (
          <WebView
            source={{ uri: pdfUri }}
            style={styles.webView}
            startInLoadingState={true}
            originWhitelist={['*']}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowFileAccess={true}
            allowUniversalAccessFromFileURLs={true}
            mixedContentMode="always"
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
              setError(true);
            }}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4ECDC4" />
                <Text style={styles.loadingText}>Carregando documento...</Text>
              </View>
            )}
          />
        )}
      </View>

      {/* Botão para abrir externamente */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.openExternalButton}
          onPress={handleOpenPDF}
        >
          <Icon name="open-in-new" size={20} color="#FFF" />
          <Text style={styles.openExternalButtonText}>
            {Platform.OS === 'web' ? 'Abrir em Nova Aba' : 'Abrir em Visualizador Externo'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ConsentTerms;
