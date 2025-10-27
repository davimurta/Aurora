import React from 'react';
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
import { styles } from './styles';

export default function AboutUsScreen() {
  const teamValues = [
    {
      icon: 'favorite',
      title: 'Bem-estar',
      description: 'Priorizamos sua saúde mental e emocional acima de tudo',
    },
    {
      icon: 'security',
      title: 'Privacidade',
      description: 'Seus dados são protegidos com máxima segurança',
    },
    {
      icon: 'psychology',
      title: 'Ciência',
      description: 'Baseado em práticas comprovadas cientificamente',
    },
    {
      icon: 'people',
      title: 'Comunidade',
      description: 'Construímos um espaço acolhedor para todos',
    },
  ];
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quem Somos</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Icon name="spa" size={60} color="#4ECDC4" />
          </View>
          <Text style={styles.heroTitle}>Aurora</Text>
          <Text style={styles.heroSubtitle}>
            Sua jornada para uma vida mais equilibrada e saudável!
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nossa Missão</Text>
          <View style={styles.card}>
            <Text style={styles.missionText}>
              Acreditamos que o bem-estar mental é fundamental para uma vida plena e feliz. 
              Nossa missão é tornar práticas de mindfulness, meditação e relaxamento acessíveis 
              a todos, através de uma plataforma intuitiva e baseada em ciência.
            </Text>
          </View>
        </View>


        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nossos Valores</Text>
          <View style={styles.valuesGrid}>
            {teamValues.map((value, index) => (
              <View key={index} style={styles.valueCard}>
                <View style={styles.valueIconContainer}>
                  <Icon name={value.icon} size={28} color="#4ECDC4" />
                </View>
                <Text style={styles.valueTitle}>{value.title}</Text>
                <Text style={styles.valueDescription}>{value.description}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O Que Oferecemos</Text>
          <View style={styles.card}>
            <View style={styles.featureItem}>
              <Icon name="self-improvement" size={24} color="#4ECDC4" />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Meditações Guiadas</Text>
                <Text style={styles.featureDescription}>
                  Sessões personalizadas para diferentes momentos do dia
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Icon name="air" size={24} color="#4ECDC4" />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Exercícios de Respiração</Text>
                <Text style={styles.featureDescription}>
                  Técnicas comprovadas para reduzir estresse e ansiedade
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Icon name="article" size={24} color="#4ECDC4" />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Conteúdo Educativo</Text>
                <Text style={styles.featureDescription}>
                  Artigos e recursos sobre saúde mental e bem-estar
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Icon name="insights" size={24} color="#4ECDC4" />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Acompanhamento</Text>
                <Text style={styles.featureDescription}>
                  Monitore seu progresso e conquistas ao longo do tempo
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.ctaCard}>
            <Icon name="mail-outline" size={32} color="#4ECDC4" />
            <Text style={styles.ctaTitle}>Entre em Contato</Text>
            <Text style={styles.ctaDescription}>
              Tem dúvidas ou sugestões? Adoraríamos ouvir você!
            </Text>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>contato@aurora.com</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
}