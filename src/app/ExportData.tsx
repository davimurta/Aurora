import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

interface ExportOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  isSelected: boolean;
}

const ExportData: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOption[]>([
    {
      id: "profile",
      title: "Dados do Perfil",
      description: "Nome, email, foto e configurações pessoais",
      icon: "person",
      isSelected: true,
    },
    {
      id: "meditation",
      title: "Histórico de Meditação",
      description: "Sessões, durações e progresso de meditação",
      icon: "self-improvement",
      isSelected: true,
    },
    {
      id: "settings",
      title: "Configurações",
      description: "Preferências e configurações do aplicativo",
      icon: "settings",
      isSelected: false,
    },
    {
      id: "activities",
      title: "Atividades",
      description: "Histórico de atividades",
      icon: "timeline",
      isSelected: false,
    },
  ]);

  const toggleOption = (id: string) => {
    setExportOptions(prev =>
      prev.map(option =>
        option.id === id ? { ...option, isSelected: !option.isSelected } : option
      )
    );
  };

  const generateMockData = () => {
    const selectedOptions = exportOptions.filter(option => option.isSelected);
    
    return {
      exportDate: new Date().toISOString(),
      user: {
        profile: selectedOptions.find(opt => opt.id === "profile") ? {
          name: "Maria Silva",
          email: "maria.silva@email.com",
          birth: "2024-01-15",
          tel: "(11)99999-9999",
        } : null,
        meditation: selectedOptions.find(opt => opt.id === "meditation") ? {
          totalSessions: 156,
          totalMinutes: 2340,
          streak: 12,
          favoriteType: "Mindfulness",
          sessions: [
            { date: "2024-08-29", duration: 15, type: "Mindfulness" },
            { date: "2024-08-28", duration: 20, type: "Respiração" },
            { date: "2024-08-27", duration: 10, type: "Body Scan" },
          ]
        } : null,
        settings: selectedOptions.find(opt => opt.id === "settings") ? {
          language: "pt-BR",
          notifications: true,
          reminderTime: "08:00",
          theme: "light",
        } : null,
        activities: selectedOptions.find(opt => opt.id === "activities") ? {
          concludeActivities: 23,
          notdoneActivities: 8,
          achievements: ["First Session", "Week Streak", "Month Streak"],
        } : null,
      }
    };
  };

  const createPDFContent = (data: any) => {
    let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Exportação de Dados - Aurora</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                color: #333; 
                line-height: 1.6;
            }
            .header { 
                text-align: center; 
                border-bottom: 2px solid #4ECDC4; 
                padding-bottom: 20px; 
                margin-bottom: 30px;
            }
            .section { 
                margin-bottom: 30px; 
                padding: 20px; 
                border: 1px solid #e0e0e0; 
                border-radius: 8px;
                background-color: #f9f9f9;
            }
            .section h2 { 
                color: #4ECDC4; 
                margin-top: 0;
                border-bottom: 1px solid #4ECDC4;
                padding-bottom: 10px;
            }
            .data-item { 
                margin: 10px 0; 
                padding: 8px 0;
                border-bottom: 1px dotted #ccc;
            }
            .data-label { 
                font-weight: bold; 
                display: inline-block; 
                width: 150px;
            }
            .sessions-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
            }
            .sessions-table th, .sessions-table td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }
            .sessions-table th {
                background-color: #4ECDC4;
                color: white;
            }
            .footer {
                margin-top: 40px;
                text-align: center;
                font-size: 12px;
                color: #666;
                border-top: 1px solid #e0e0e0;
                padding-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Aurora - Exportação de Dados</h1>
            <p>Data da exportação: ${new Date(data.exportDate).toLocaleString('pt-BR')}</p>
        </div>
    `;

    if (data.user.profile) {
      htmlContent += `
        <div class="section">
            <h2>📋 Dados do Perfil</h2>
            <div class="data-item">
                <span class="data-label">Nome:</span> ${data.user.profile.name}
            </div>
            <div class="data-item">
                <span class="data-label">Email:</span> ${data.user.profile.email}
            </div>
            <div class="data-item">
                <span class="data-label">Data de Nascimento:</span> ${new Date(data.user.profile.birth).toLocaleDateString('pt-BR')}
            </div>
            <div class="data-item">
                <span class="data-label">Telefone:</span> ${data.user.profile.tel}
            </div>
        </div>
      `;
    }

    if (data.user.meditation) {
      htmlContent += `
        <div class="section">
            <h2>🧘 Histórico de Meditação</h2>
            <div class="data-item">
                <span class="data-label">Total de Sessões:</span> ${data.user.meditation.totalSessions}
            </div>
            <div class="data-item">
                <span class="data-label">Total de Minutos:</span> ${data.user.meditation.totalMinutes}
            </div>
            <div class="data-item">
                <span class="data-label">Sequência Atual:</span> ${data.user.meditation.streak} dias
            </div>
            <div class="data-item">
                <span class="data-label">Tipo Favorito:</span> ${data.user.meditation.favoriteType}
            </div>
            
            <h3>Últimas Sessões:</h3>
            <table class="sessions-table">
                <tr>
                    <th>Data</th>
                    <th>Duração (min)</th>
                    <th>Tipo</th>
                </tr>
                ${data.user.meditation.sessions.map((session: any) => `
                    <tr>
                        <td>${new Date(session.date).toLocaleDateString('pt-BR')}</td>
                        <td>${session.duration}</td>
                        <td>${session.type}</td>
                    </tr>
                `).join('')}
            </table>
        </div>
      `;
    }

    if (data.user.settings) {
      htmlContent += `
        <div class="section">
            <h2>⚙️ Configurações</h2>
            <div class="data-item">
                <span class="data-label">Idioma:</span> ${data.user.settings.language}
            </div>
            <div class="data-item">
                <span class="data-label">Notificações:</span> ${data.user.settings.notifications ? 'Ativadas' : 'Desativadas'}
            </div>
            <div class="data-item">
                <span class="data-label">Lembrete:</span> ${data.user.settings.reminderTime}
            </div>
            <div class="data-item">
                <span class="data-label">Tema:</span> ${data.user.settings.theme === 'light' ? 'Claro' : 'Escuro'}
            </div>
        </div>
      `;
    }

    if (data.user.activities) {
      htmlContent += `
        <div class="section">
            <h2>📊 Atividades</h2>
            <div class="data-item">
                <span class="data-label">Atividades realizadas:</span> ${data.user.activities.concludeActivities}
            </div>
            <div class="data-item">
                <span class="data-label">Atividades não realizadas:</span> ${data.user.activities.notdoneActivities}
            </div>
            <div class="data-item">
                <span class="data-label">Conquistas:</span> ${data.user.activities.achievements.join(', ')}
            </div>
        </div>
      `;
    }

    htmlContent += `
        <div class="footer">
            <p>Este documento foi gerado automaticamente pelo Aurora</p>
            <p>Para mais informações, consulte nossa Política de Privacidade</p>
        </div>
    </body>
    </html>
    `;

    return htmlContent;
  };

  // Função para download no web
  const downloadHTMLAsFile = (htmlContent: string, filename: string) => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Função para gerar PDF usando print do navegador (web)
  const exportDataWeb = async () => {
    try {
      const userData = generateMockData();
      const htmlContent = createPDFContent(userData);
      
      // Criar nova janela para impressão
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Popup bloqueado. Permita popups para este site.');
      }

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Aguardar carregamento e abrir dialog de impressão
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          
          // Mostrar instruções para o usuário
          Alert.alert(
            "Exportação Iniciada! 📄",
            "A janela de impressão foi aberta. Para salvar como PDF:\n\n• Selecione 'Salvar como PDF' no destino\n• Clique em 'Salvar'\n• Escolha onde salvar o arquivo\n\nSe a janela não abriu, verifique se os popups estão habilitados.",
            [
              {
                text: "Entendi",
                onPress: () => {
                  printWindow.close();
                  router.back();
                }
              },
              {
                text: "Download HTML",
                onPress: () => {
                  const fileName = `dados_aurora_${new Date().toISOString().split('T')[0]}.html`;
                  downloadHTMLAsFile(htmlContent, fileName);
                  printWindow.close();
                  router.back();
                }
              }
            ]
          );
        }, 500);
      };

    } catch (error) {
      console.error('Erro ao exportar no web:', error);
      Alert.alert(
        "Erro na Exportação",
        `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}\n\nTente habilitar popups ou use a opção de download HTML.`
      );
    }
  };

  // Função para mobile (usando expo-print)
  const exportDataMobile = async () => {
    try {
      const userData = generateMockData();
      const htmlContent = createPDFContent(userData);
      
      console.log('Iniciando criação do PDF...');
      
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      console.log('PDF criado com sucesso:', uri);

      const fileInfo = await FileSystem.getInfoAsync(uri);
      console.log('Informações do arquivo:', fileInfo);

      if (!fileInfo.exists) {
        throw new Error('Arquivo PDF não foi criado corretamente');
      }

      const fileName = `dados_aurora_${new Date().toISOString().split('T')[0]}.pdf`;
      const documentsUri = FileSystem.documentDirectory + fileName;
      
      await FileSystem.copyAsync({
        from: uri,
        to: documentsUri,
      });

      console.log('Arquivo copiado para:', documentsUri);

      const isAvailable = await Sharing.isAvailableAsync();
      console.log('Sharing disponível:', isAvailable);

      if (isAvailable) {
        try {
          await Sharing.shareAsync(documentsUri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Exportar Dados de Aurora',
          });

          Alert.alert(
            "Exportação Concluída! ✅",
            "Seus dados foram exportados em PDF com sucesso!",
            [
              {
                text: "OK",
                onPress: () => router.back()
              }
            ]
          );

        } catch (shareError) {
          console.log('Erro no compartilhamento:', shareError);
          
          Alert.alert(
            "PDF Salvo! 📁",
            `O arquivo PDF foi salvo com sucesso!\n\nNome: ${fileName}\n\nO arquivo está disponível na pasta de documentos do app.`,
            [
              {
                text: "OK",
                onPress: () => router.back(),
              }
            ]
          );
        }
      } else {
        Alert.alert(
          "PDF Salvo! 📁",
          `Seus dados foram exportados com sucesso!\n\nArquivo: ${fileName}\n\nO arquivo foi salvo na pasta de documentos do aplicativo.`,
          [
            {
              text: "OK",
              onPress: () => router.back(),
            }
          ]
        );
      }

    } catch (error) {
      console.error('Erro detalhado ao exportar dados:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      Alert.alert(
        "Erro na Exportação",
        `Ocorreu um erro ao exportar seus dados.\n\nDetalhes: ${errorMessage}\n\nTente novamente ou contate o suporte.`
      );
    }
  };

  const exportDataToPDF = async () => {
    if (exportOptions.every(option => !option.isSelected)) {
      Alert.alert(
        "Nenhum dado selecionado",
        "Por favor, selecione pelo menos um tipo de dado para exportar."
      );
      return;
    }

    setIsExporting(true);

    try {
      if (Platform.OS === 'web') {
        await exportDataWeb();
      } else {
        await exportDataMobile();
      }
    } catch (error) {
      console.error('Erro geral na exportação:', error);
      Alert.alert(
        "Erro na Exportação",
        `Erro inesperado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      );
    } finally {
      setIsExporting(false);
    }
  };

  const renderExportOption = (option: ExportOption) => (
    <TouchableOpacity 
      key={option.id} 
      style={styles.optionItem}
      onPress={() => toggleOption(option.id)}
    >
      <View style={styles.optionLeft}>
        <View style={[
          styles.iconContainer,
          option.isSelected && styles.iconContainerSelected
        ]}>
          <Icon 
            name={option.icon} 
            size={20} 
            color={option.isSelected ? "#fff" : "#4ECDC4"} 
          />
        </View>
        <View style={styles.optionInfo}>
          <Text style={styles.optionTitle}>{option.title}</Text>
          <Text style={styles.optionDescription}>{option.description}</Text>
        </View>
      </View>
      <View style={[
        styles.checkbox,
        option.isSelected && styles.checkboxSelected
      ]}>
        {option.isSelected && (
          <Icon name="check" size={16} color="#fff" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exportar Dados</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Informações */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Icon name="picture-as-pdf" size={24} color="#4ECDC4" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>
                {Platform.OS === 'web' ? 'Exporte seus dados como PDF/HTML' : 'Exporte seus dados em PDF'}
              </Text>
              <Text style={styles.infoText}>
                Selecione os tipos de dados que você deseja incluir na exportação. 
                {Platform.OS === 'web' 
                  ? ' Um arquivo será gerado e você poderá salvá-lo como PDF através do navegador ou baixar como HTML.' 
                  : ' Um arquivo PDF será gerado com todas as suas informações.'
                }
              </Text>
            </View>
          </View>
        </View>

        {/* Opções de Exportação */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecione os dados para exportar</Text>
          <View style={styles.card}>
            {exportOptions.map(option => renderExportOption(option))}
          </View>
        </View>

        {/* Informações sobre o arquivo */}
        <View style={styles.section}>
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>📄 Sobre o arquivo</Text>
            <Text style={styles.noteText}>
              {Platform.OS === 'web' ? (
                `• No navegador, será aberta a função de impressão\n• Selecione "Salvar como PDF" para gerar o arquivo\n• Alternativamente, você pode baixar um arquivo HTML\n• Compatible com qualquer navegador moderno\n• Os dados incluem apenas informações da sua conta\n• O processo é seguro e não compartilha dados com terceiros`
              ) : (
                `• O arquivo será gerado no formato PDF\n• Você poderá compartilhar ou salvar o arquivo\n• Compatível com qualquer leitor de PDF\n• Os dados incluem apenas informações da sua conta\n• O processo é seguro e não compartilha dados com terceiros`
              )}
            </Text>
          </View>
        </View>

        {/* Botão de Exportar */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[
              styles.exportButton,
              isExporting && styles.exportButtonDisabled
            ]}
            onPress={exportDataToPDF}
            disabled={isExporting}
          >
            {isExporting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Icon name="picture-as-pdf" size={24} color="#fff" />
            )}
            <Text style={styles.exportButtonText}>
              {isExporting 
                ? "Preparando exportação..." 
                : Platform.OS === 'web' 
                  ? "Exportar Dados"
                  : "Exportar como PDF"
              }
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  iconContainerSelected: {
    backgroundColor: "#4ECDC4",
    borderColor: "#4ECDC4",
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#4ECDC4",
    borderColor: "#4ECDC4",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  noteCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  noteText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  exportButton: {
    backgroundColor: "#4ECDC4",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4ECDC4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  exportButtonDisabled: {
    backgroundColor: "#999",
    shadowColor: "#999",
  },
  exportButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default ExportData;