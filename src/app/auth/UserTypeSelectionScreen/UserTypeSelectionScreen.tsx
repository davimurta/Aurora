import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { styles } from './_styles';

const UserTypeSelectionScreen: React.FC = () => {
  const handleSelectType = (type: 'client' | 'psychologist') => {
    const route = type === 'client' ? '/auth/UserSignupScreen/UserSignupScreen' : '/auth/PsychologistSignupScreen/PsychologistSignupScreen';
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
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Icon name="psychology" size={32} color="#4ECDC4" />
          </View>
          <Text style={styles.headerTitle}>Bem-vindo!</Text>
          <Text style={styles.headerSubtitle}>
            Escolha como você gostaria de usar nossa plataforma
          </Text>
        </View>

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

export default UserTypeSelectionScreen;