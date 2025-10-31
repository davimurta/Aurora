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
import { styles } from "./_styles";

interface LanguageItem {
  id: string;
  name: string;
  nativeName: string;
  code: string;
  flag: string;
}

const LanguageScreen: React.FC = () => {
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Idiomas Disponíveis</Text>
          <View style={styles.card}>
            {languages.map((item) => renderLanguageItem(item))}
          </View>
        </View>

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

        <View style={styles.section}>
          <TouchableOpacity style={styles.applyButton}>
            <Icon name="done" size={20} color="#fff" />
            <Text style={styles.applyButtonText}>Aplicar Idioma</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default LanguageScreen;