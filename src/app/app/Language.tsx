import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface LanguageItem {
  id: string;
  name: string;
  nativeName: string;
  code: string;
  flag: string;
}

const Language: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("pt-BR");

  const languages: LanguageItem[] = [
    {
      id: "1",
      name: "Português",
      nativeName: "Português (Brasil)",
      code: "pt-BR",
      flag: "🇧🇷",
    },
    {
      id: "2",
      name: "English",
      nativeName: "English (United States)",
      code: "en-US",
      flag: "🇺🇸",
    },
    {
      id: "3",
      name: "Español",
      nativeName: "Español (España)",
      code: "es-ES",
      flag: "🇪🇸",
    },
    {
      id: "4",
      name: "Français",
      nativeName: "Français (France)",
      code: "fr-FR",
      flag: "🇫🇷",
    },
    {
      id: "5",
      name: "Deutsch",
      nativeName: "Deutsch (Deutschland)",
      code: "de-DE",
      flag: "🇩🇪",
    },
    {
      id: "6",
      name: "Italiano",
      nativeName: "Italiano (Italia)",
      code: "it-IT",
      flag: "🇮🇹",
    },
    {
      id: "7",
      name: "日本語",
      nativeName: "日本語 (日本)",
      code: "ja-JP",
      flag: "🇯🇵",
    },
    {
      id: "8",
      name: "한국어",
      nativeName: "한국어 (대한민국)",
      code: "ko-KR",
      flag: "🇰🇷",
    },
    {
      id: "9",
      name: "中文",
      nativeName: "中文 (简体)",
      code: "zh-CN",
      flag: "🇨🇳",
    },
  ];

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
  };

  const renderLanguageItem = (item: LanguageItem) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.languageItem,
        selectedLanguage === item.code && styles.selectedLanguageItem
      ]}
      onPress={() => handleLanguageSelect(item.code)}
    >
      <View style={styles.languageLeft}>
        <Text style={styles.flagEmoji}>{item.flag}</Text>
        <View style={styles.languageInfo}>
          <Text style={[
            styles.languageName,
            selectedLanguage === item.code && styles.selectedLanguageName
          ]}>
            {item.name}
          </Text>
          <Text style={styles.languageNativeName}>{item.nativeName}</Text>
        </View>
      </View>
      <View style={styles.radioButton}>
        {selectedLanguage === item.code && (
          <View style={styles.radioButtonSelected} />
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
        <Text style={styles.headerTitle}>Idioma</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Idioma Atual */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Idioma Atual</Text>
          <Text style={styles.sectionSubtitle}>
            O idioma selecionado será aplicado em todo o aplicativo
          </Text>
          <View style={styles.currentLanguageCard}>
            <Text style={styles.currentLanguageFlag}>
              {languages.find(lang => lang.code === selectedLanguage)?.flag}
            </Text>
            <View style={styles.currentLanguageInfo}>
              <Text style={styles.currentLanguageName}>
                {languages.find(lang => lang.code === selectedLanguage)?.name}
              </Text>
              <Text style={styles.currentLanguageNative}>
                {languages.find(lang => lang.code === selectedLanguage)?.nativeName}
              </Text>
            </View>
            <Icon name="check-circle" size={24} color="#4ECDC4" />
          </View>
        </View>

        {/* Lista de Idiomas Disponíveis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Idiomas Disponíveis</Text>
          <View style={styles.card}>
            {languages.map((item) => renderLanguageItem(item))}
          </View>
        </View>

        {/* Informações Adicionais */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Icon name="translate" size={24} color="#4ECDC4" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Sobre as traduções</Text>
              <Text style={styles.infoText}>
                As traduções são constantemente melhoradas. Se você encontrar algum 
                erro ou tiver sugestões, entre em contato conosco através do suporte.
              </Text>
            </View>
          </View>
        </View>

        {/* Botão de Aplicar */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.applyButton}>
            <Icon name="done" size={20} color="#fff" />
            <Text style={styles.applyButtonText}>Aplicar Idioma</Text>
          </TouchableOpacity>
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
  currentLanguageCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "#4ECDC4",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  currentLanguageFlag: {
    fontSize: 32,
    marginRight: 16,
  },
  currentLanguageInfo: {
    flex: 1,
  },
  currentLanguageName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  currentLanguageNative: {
    fontSize: 14,
    color: "#666",
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
  languageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedLanguageItem: {
    backgroundColor: "#f8fdfc",
  },
  languageLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  flagEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  selectedLanguageName: {
    color: "#4ECDC4",
  },
  languageNativeName: {
    fontSize: 12,
    color: "#666",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4ECDC4",
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
  applyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4ECDC4",
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#4ECDC4",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  bottomSpacing: {
    height: 20,
  },
});

export default Language;