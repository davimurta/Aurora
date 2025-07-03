import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  StatusBar,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';

const UserTypeSelection: React.FC = () => {
  const handleSelectType = (type: 'client' | 'psychologist') => {
    const route = type === 'client' ? '/UserSignup' : '/PsychologistSignup';
    router.push(route as any);
  };

  const UserTypeCard = ({ 
    type, 
    title, 
    subtitle, 
    description, 
    icon, 
    features 
  }: {
    type: 'client' | 'psychologist';
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    features: string[];
  }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleSelectType(type)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: type === 'client' ? '#E8F8F7' : '#F3F4FF' }
          ]}>
            <Icon 
              name={icon} 
              size={28} 
              color={type === 'client' ? '#4ECDC4' : '#667eea'} 
            />
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
          <Text style={styles.cardDescription}>{description}</Text>

          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureBullet} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Icon 
            name="arrow-forward" 
            size={20} 
            color={type === 'client' ? '#4ECDC4' : '#667eea'} 
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Icon name="psychology" size={32} color="#4ECDC4" />
          </View>
          <Text style={styles.headerTitle}>Bem-vindo!</Text>
          <Text style={styles.headerSubtitle}>
            Escolha como você gostaria de usar nossa plataforma
          </Text>
        </View>

        {/* Cards Container */}
        <View style={styles.cardsContainer}>
          <UserTypeCard
            type="client"
            title="Busco Ajuda"
            subtitle="Sou Cliente"
            description="Encontre o psicólogo ideal para suas necessidades"
            icon="person"
            features={[
              'Psicólogos qualificados',
              'Agendamento fácil',
              'Acompanhamento pessoal',
              'Suporte completo'
            ]}
          />

          <UserTypeCard
            type="psychologist"
            title="Ofereço Ajuda"
            subtitle="Sou Psicólogo"
            description="Cadastre-se como profissional e amplie sua prática"
            icon="psychology"
            features={[
              'Gestão de agenda',
              'Novos pacientes',
              'Ferramentas profissionais',
              'Rede de contatos'
            ]}
          />
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <View style={styles.infoRow}>
            <Icon name="security" size={16} color="#4ECDC4" />
            <Text style={styles.infoText}>Dados seguros e protegidos</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="verified" size={16} color="#4ECDC4" />
            <Text style={styles.infoText}>Profissionais verificados</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  cardHeader: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  headerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F8F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
  },
  cardsContainer: {
    paddingHorizontal: 16,
    gap: 16,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardSelected: {
    borderColor: '#4ECDC4',
    borderWidth: 2,
    elevation: 6,
    shadowOpacity: 0.1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '600',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  featuresContainer: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureBullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4ECDC4',
  },
  featureText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  cardFooter: {
    alignItems: 'flex-end',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    gap: 12,
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '400',
  },
});

export default UserTypeSelection;