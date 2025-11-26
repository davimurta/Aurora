import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { styles } from './_styles';

const TermsOfUse: React.FC = () => {
  // Para Android e iOS, vamos usar o PDF hospedado no Google Drive ou similar
  // Para desenvolvimento, usamos uma URL do Google Docs Viewer
  const pdfUrl = Platform.select({
    // Você pode substituir esta URL pela URL real onde o PDF está hospedado
    default: 'https://docs.google.com/gview?embedded=true&url=https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
  });

  const handleOpenPDF = async () => {
    try {
      // Caminho local do PDF nos assets
      const pdfPath = '../../../assets/Termo_de_Uso_Aurora_Formatado_Completo.pdf';
      const supported = await Linking.canOpenURL(pdfPath);

      if (supported) {
        await Linking.openURL(pdfPath);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o documento');
      }
    } catch (error) {
      console.error('Erro ao abrir PDF:', error);
      Alert.alert('Erro', 'Não foi possível abrir o documento');
    }
  };

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
        <Text style={styles.headerTitle}>Termos de Uso</Text>
      </View>

      {/* PDF Viewer */}
      <View style={styles.contentContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            src={require('../../../../assets/Termo_de_Uso_Aurora_Formatado_Completo.pdf')}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Termos de Uso"
          />
        ) : (
          <WebView
            source={{
              uri: pdfUrl
            }}
            style={styles.webView}
            startInLoadingState
            javaScriptEnabled={true}
            domStorageEnabled={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <Icon name="description" size={48} color="#4ECDC4" />
                <Text style={styles.loadingText}>Carregando documento...</Text>
              </View>
            )}
            renderError={() => (
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
            )}
          />
        )}
      </View>

      {/* Botão alternativo para abrir externamente */}
      {Platform.OS !== 'web' && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.openExternalButton}
            onPress={handleOpenPDF}
          >
            <Icon name="open-in-new" size={20} color="#FFF" />
            <Text style={styles.openExternalButtonText}>Abrir em Visualizador Externo</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default TermsOfUse;
