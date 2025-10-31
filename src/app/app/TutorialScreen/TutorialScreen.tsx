import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomNavigation from "@components/BottonNavigation";
import { router } from 'expo-router';
import { styles } from './_styles';

export default function TutorialScreen() {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const tutorialSteps = [
    {
      icon: 'login',
      title: 'Criar sua Conta',
      description: 'Comece criando uma conta gratuita para personalizar sua experiência',
      details: [
        'Clique em "Criar Conta" na tela inicial',
        'Preencha seus dados básicos',
        'Confirme seu email',
        'Pronto! Sua conta está criada',
      ],
    },
    {
      icon: 'explore',
      title: 'Explorar Atividades',
      description: 'Descubra uma variedade de práticas de bem-estar disponíveis',
      details: [
        'Navegue pela página inicial',
        'Veja meditações guiadas',
        'Experimente exercícios de respiração',
        'Explore artigos sobre saúde mental',
      ],
    },
    {
      icon: 'play-circle-outline',
      title: 'Iniciar uma Sessão',
      description: 'Escolha uma atividade e comece sua prática de mindfulness',
      details: [
        'Selecione uma atividade que interesse você',
        'Ajuste as configurações se necessário',
        'Encontre um lugar tranquilo',
        'Clique em "Iniciar" e relaxe',
      ],
    },
    {
      icon: 'track-changes',
      title: 'Acompanhar Progresso',
      description: 'Monitore suas atividades e veja seu desenvolvimento',
      details: [
        'Acesse a aba "Perfil"',
        'Veja seu histórico de atividades',
        'Acompanhe estatísticas pessoais',
        'Celebre suas conquistas',
      ],
    },
    {
      icon: 'settings',
      title: 'Personalizar Experiência',
      description: 'Ajuste o app de acordo com suas preferências',
      details: [
        'Configure notificações de lembrete',
        'Escolha temas e sons preferidos',
        'Defina metas pessoais',
        'Personalize seu perfil',
      ],
    },
  ];

  const quickTips = [
    {
      icon: 'lightbulb-outline',
      text: 'Pratique diariamente, mesmo que por poucos minutos',
    },
    {
      icon: 'volume-up',
      text: 'Use fones de ouvido para uma experiência imersiva',
    },
    {
      icon: 'schedule',
      text: 'Crie uma rotina nos mesmos horários',
    },
    {
      icon: 'mood',
      text: 'Seja paciente consigo mesmo durante a jornada',
    },
  ];

  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Como Usar</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeIconContainer}>
            <Icon name="school" size={48} color="#4ECDC4" />
          </View>
          <Text style={styles.welcomeTitle}>Guia Rápido</Text>
          <Text style={styles.welcomeDescription}>
            Aprenda a usar o app em poucos passos simples
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Primeiros Passos</Text>
          
          {tutorialSteps.map((step, index) => (
            <TouchableOpacity
              key={index}
              style={styles.stepCard}
              onPress={() => toggleSection(index)}
              activeOpacity={0.7}
            >
              <View style={styles.stepHeader}>
                <View style={styles.stepIconContainer}>
                  <Icon name={step.icon} size={24} color="#4ECDC4" />
                </View>
                <View style={styles.stepInfo}>
                  <View style={styles.stepTitleRow}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                  </View>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
                <Icon 
                  name={expandedSection === index ? 'expand-less' : 'expand-more'} 
                  size={24} 
                  color="#999" 
                />
              </View>

              {expandedSection === index && (
                <View style={styles.stepDetails}>
                  {step.details.map((detail, detailIndex) => (
                    <View key={detailIndex} style={styles.detailItem}>
                      <Icon name="check-circle" size={16} color="#4ECDC4" />
                      <Text style={styles.detailText}>{detail}</Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dicas Importantes</Text>
          <View style={styles.tipsCard}>
            {quickTips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <View style={styles.tipIconContainer}>
                  <Icon name={tip.icon} size={20} color="#4ECDC4" />
                </View>
                <Text style={styles.tipText}>{tip.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.helpCard}>
            <Icon name="help-outline" size={32} color="#4ECDC4" />
            <Text style={styles.helpTitle}>Precisa de Ajuda?</Text>
            <Text style={styles.helpDescription}>
              Nossa equipe está sempre disponível para auxiliar você
            </Text>
            <TouchableOpacity style={styles.helpButton}>
              <Icon name="chat" size={18} color="#fff" style={styles.helpButtonIcon} />
              <Text style={styles.helpButtonText}>Falar com Suporte</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
}