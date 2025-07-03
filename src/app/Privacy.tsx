import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface PrivacyItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  hasSwitch: boolean;
  isEnabled?: boolean;
}

const Privacy: React.FC = () => {
  const [privacySettings, setPrivacySettings] = useState<PrivacyItem[]>([
    {
      id: "1",
      title: "Perfil Público",
      description: "Permitir que outros usuários vejam seu perfil",
      icon: "visibility",
      hasSwitch: true,
      isEnabled: false,
    },
    {
      id: "2",
      title: "Compartilhar Atividades",
      description: "Compartilhar suas atividades de meditação com amigos",
      icon: "share",
      hasSwitch: true,
      isEnabled: true,
    },
    {
      id: "3",
      title: "Dados de Localização",
      description: "Permitir acesso à sua localização para melhor experiência",
      icon: "location-on",
      hasSwitch: true,
      isEnabled: false,
    },
    {
      id: "4",
      title: "Analytics",
      description: "Ajudar a melhorar o app compartilhando dados de uso",
      icon: "analytics",
      hasSwitch: true,
      isEnabled: true,
    },
  ]);

  const privacyOptions = [
    {
      title: "Política de Privacidade",
      description: "Leia nossa política de privacidade completa",
      icon: "policy",
      hasSwitch: false,
    },
    {
      title: "Termos de Uso",
      description: "Consulte os termos de uso do aplicativo",
      icon: "description",
      hasSwitch: false,
    },
    {
      title: "Excluir Dados",
      description: "Solicitar exclusão de todos os seus dados",
      icon: "delete-forever",
      hasSwitch: false,
    },
    {
      title: "Exportar Dados",
      description: "Baixar uma cópia dos seus dados pessoais",
      icon: "download",
      hasSwitch: false,
    },
  ];

  const togglePrivacySetting = (id: string) => {
    setPrivacySettings(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isEnabled: !item.isEnabled } : item
      )
    );
  };

  const renderPrivacySettingItem = (item: PrivacyItem) => (
    <View key={item.id} style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Icon name={item.icon} size={20} color="#4ECDC4" />
        </View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingDescription}>{item.description}</Text>
        </View>
      </View>
      {item.hasSwitch && (
        <Switch
          value={item.isEnabled}
          onValueChange={() => togglePrivacySetting(item.id)}
          trackColor={{ false: "#e9ecef", true: "#4ECDC4" }}
          thumbColor={item.isEnabled ? "#fff" : "#fff"}
        />
      )}
    </View>
  );

  const renderPrivacyOption = (item: any, index: number) => (
    <TouchableOpacity key={index} style={styles.optionItem}>
      <View style={styles.optionLeft}>
        <View style={styles.iconContainer}>
          <Icon name={item.icon} size={20} color="#4ECDC4" />
        </View>
        <View style={styles.optionInfo}>
          <Text style={styles.optionTitle}>{item.title}</Text>
          <Text style={styles.optionDescription}>{item.description}</Text>
        </View>
      </View>
      <Icon name="chevron-right" size={20} color="#999" />
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
        <Text style={styles.headerTitle}>Privacidade</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Configurações de Privacidade */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações de Privacidade</Text>
          <Text style={styles.sectionSubtitle}>
            Controle como seus dados são compartilhados e utilizados
          </Text>
          <View style={styles.card}>
            {privacySettings.map((item) => renderPrivacySettingItem(item))}
          </View>
        </View>

        {/* Opções de Privacidade */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações e Controles</Text>
          <View style={styles.card}>
            {privacyOptions.map((item, index) => renderPrivacyOption(item, index))}
          </View>
        </View>

        {/* Informações Adicionais */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Icon name="info" size={24} color="#4ECDC4" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Seus dados são importantes</Text>
              <Text style={styles.infoText}>
                Respeitamos sua privacidade e seguimos as melhores práticas de segurança 
                para proteger suas informações pessoais. Você tem controle total sobre 
                seus dados e pode alterá-los a qualquer momento.
              </Text>
            </View>
          </View>
        </View>

        {/* Espaçamento extra */}
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
    paddingTop: 50,
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
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
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
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  bottomSpacing: {
    height: 20,
  },
});

export default Privacy;