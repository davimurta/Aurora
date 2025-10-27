import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "./styles";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  isExpanded: boolean;
}

interface ContactOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
}

const HelpScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    {
      id: "1",
      question: "Como começar a meditar?",
      answer: "Para começar a meditar, escolha um local tranquilo, sente-se confortavelmente e comece com sessões curtas de 5-10 minutos. Use nossos guias de meditação para iniciantes disponíveis no aplicativo.",
      isExpanded: false,
    },
    {
      id: "2",
      question: "Posso usar o app offline?",
      answer: "Sim! Você pode baixar as meditações para ouvir offline. Vá até a meditação desejada e toque no ícone de download. As meditações baixadas ficam disponíveis na seção 'Downloads'.",
      isExpanded: false,
    },
    {
      id: "3",
      question: "Como alterar minha senha?",
      answer: "Para alterar sua senha, vá em Perfil > Editar Perfil > Segurança. Digite sua senha atual e depois a nova senha duas vezes para confirmar.",
      isExpanded: false,
    },
    {
      id: "4",
      question: "O app funciona em outros idiomas?",
      answer: "Sim! O aplicativo está disponível em vários idiomas. Para alterar, vá em Perfil > Configurações > Idioma e escolha sua preferência.",
      isExpanded: false,
    },
    {
      id: "5",
      question: "Como cancelar minha assinatura?",
      answer: "Para cancelar sua assinatura, vá em Perfil > Configurações > Assinatura e toque em 'Cancelar Assinatura'. Você continuará tendo acesso aos recursos premium até o final do período pago.",
      isExpanded: false,
    },
  ]);

  const contactOptions: ContactOption[] = [
    {
      id: "1",
      title: "Email",
      description: "Envie sua dúvida por email",
      icon: "email",
      action: "email",
    },
    {
      id: "2",
      title: "Chat ao Vivo",
      description: "Converse conosco em tempo real",
      icon: "chat",
      action: "chat",
    },
    {
      id: "3",
      title: "WhatsApp",
      description: "Fale conosco pelo WhatsApp",
      icon: "phone",
      action: "whatsapp",
    },
    {
      id: "4",
      title: "Central de Ajuda",
      description: "Acesse nossa base de conhecimento",
      icon: "help-center",
      action: "help-center",
    },
  ];

  const quickActions = [
    {
      title: "Reportar Bug",
      description: "Encontrou um problema no app?",
      icon: "bug-report",
    },
    {
      title: "Sugerir Melhoria",
      description: "Compartilhe suas ideias conosco",
      icon: "lightbulb",
    },
    {
      title: "Avaliar App",
      description: "Deixe sua avaliação na loja",
      icon: "star",
    },
  ];

  const toggleFAQ = (id: string) => {
    setFaqItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
      )
    );
  };

  const handleContactAction = (action: string) => {
    switch (action) {
      case "email":
        Alert.alert("Email", "Abrindo cliente de email...");
        break;
      case "chat":
        Alert.alert("Chat", "Iniciando chat ao vivo...");
        break;
      case "whatsapp":
        Alert.alert("WhatsApp", "Abrindo WhatsApp...");
        break;
      case "help-center":
        Alert.alert("Central de Ajuda", "Abrindo central de ajuda...");
        break;
      default:
        break;
    }
  };

  const filteredFAQ = faqItems.filter(
    item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFAQItem = (item: FAQItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.faqItem}
      onPress={() => toggleFAQ(item.id)}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Icon
          name={item.isExpanded ? "expand-less" : "expand-more"}
          size={24}
          color="#4ECDC4"
        />
      </View>
      {item.isExpanded && (
        <Text style={styles.faqAnswer}>{item.answer}</Text>
      )}
    </TouchableOpacity>
  );

  const renderContactOption = (item: ContactOption) => (
    <TouchableOpacity
      key={item.id}
      style={styles.contactItem}
      onPress={() => handleContactAction(item.action)}
    >
      <View style={styles.contactLeft}>
        <View style={styles.iconContainer}>
          <Icon name={item.icon} size={20} color="#4ECDC4" />
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactTitle}>{item.title}</Text>
          <Text style={styles.contactDescription}>{item.description}</Text>
        </View>
      </View>
      <Icon name="chevron-right" size={20} color="#999" />
    </TouchableOpacity>
  );

  const renderQuickAction = (item: any, index: number) => (
    <TouchableOpacity key={index} style={styles.quickActionItem}>
      <View style={styles.quickActionLeft}>
        <View style={styles.iconContainer}>
          <Icon name={item.icon} size={20} color="#4ECDC4" />
        </View>
        <View style={styles.quickActionInfo}>
          <Text style={styles.quickActionTitle}>{item.title}</Text>
          <Text style={styles.quickActionDescription}>{item.description}</Text>
        </View>
      </View>
      <Icon name="chevron-right" size={20} color="#999" />
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
        <Text style={styles.headerTitle}>Ajuda e Suporte</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar na ajuda..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Icon name="clear" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perguntas Frequentes</Text>
          <View style={styles.card}>
            {filteredFAQ.map((item) => renderFAQItem(item))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Entre em Contato</Text>
          <Text style={styles.sectionSubtitle}>
            Não encontrou o que procurava? Fale conosco!
          </Text>
          <View style={styles.card}>
            {contactOptions.map((item) => renderContactOption(item))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.card}>
            {quickActions.map((item, index) => renderQuickAction(item, index))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Icon name="info" size={24} color="#4ECDC4" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Informações do App</Text>
              <Text style={styles.infoText}>
                Versão: 2.1.0{'\n'}
                Última atualização: 02/07/2025{'\n'}
                Desenvolvido com ❤️ para seu bem-estar
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpScreen;
