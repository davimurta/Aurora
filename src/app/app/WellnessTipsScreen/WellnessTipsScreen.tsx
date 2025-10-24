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
import { styles } from './styles';

export default function WellnessTipsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Todos', icon: 'dashboard' },
    { id: 'sleep', label: 'Sono', icon: 'nightlight' },
    { id: 'stress', label: 'Estresse', icon: 'self-improvement' },
    { id: 'nutrition', label: 'Nutrição', icon: 'restaurant' },
    { id: 'exercise', label: 'Exercício', icon: 'fitness-center' },
  ];

  const wellnessTips = [
    {
      id: '1',
      category: 'sleep',
      title: 'Estabeleça uma Rotina de Sono',
      description: 'Dormir e acordar no mesmo horário todos os dias ajuda a regular seu relógio biológico',
      icon: 'bedtime',
      color: '#E8F5E9',
      tips: [
        'Vá para cama e acorde no mesmo horário',
        'Evite telas 1 hora antes de dormir',
        'Mantenha o quarto escuro e fresco',
        'Evite cafeína após às 15h',
      ],
    },
    {
      id: '2',
      category: 'stress',
      title: 'Pratique Respiração Consciente',
      description: 'A respiração profunda ativa o sistema nervoso parassimpático, promovendo relaxamento',
      icon: 'air',
      color: '#E3F2FD',
      tips: [
        'Inspire por 4 segundos pelo nariz',
        'Segure por 4 segundos',
        'Expire por 6 segundos pela boca',
        'Repita por 5 minutos diariamente',
      ],
    },
    {
      id: '3',
      category: 'nutrition',
      title: 'Hidrate-se Adequadamente',
      description: 'A água é essencial para todas as funções corporais e ajuda na concentração',
      icon: 'water-drop',
      color: '#E1F5FE',
      tips: [
        'Beba pelo menos 2 litros de água por dia',
        'Comece o dia com um copo de água',
        'Mantenha uma garrafa sempre por perto',
        'Observe a cor da urina como indicador',
      ],
    },
    {
      id: '4',
      category: 'exercise',
      title: 'Movimente-se Regularmente',
      description: 'Exercícios físicos liberam endorfinas e melhoram o humor',
      icon: 'directions-run',
      color: '#FFF3E0',
      tips: [
        'Faça 30 minutos de atividade por dia',
        'Escolha uma atividade que você goste',
        'Comece devagar e aumente gradualmente',
        'Alongue-se antes e depois',
      ],
    },
    {
      id: '5',
      category: 'stress',
      title: 'Pratique Mindfulness',
      description: 'Estar presente no momento reduz ansiedade sobre passado e futuro',
      icon: 'spa',
      color: '#F3E5F5',
      tips: [
        'Reserve 10 minutos diários para meditar',
        'Observe seus pensamentos sem julgamento',
        'Foque em um sentido de cada vez',
        'Use apps de meditação guiada',
      ],
    },
    {
      id: '6',
      category: 'sleep',
      title: 'Crie um Ritual de Relaxamento',
      description: 'Atividades relaxantes antes de dormir preparam corpo e mente para o descanso',
      icon: 'self-improvement',
      color: '#FCE4EC',
      tips: [
        'Tome um banho morno',
        'Leia um livro tranquilo',
        'Ouça música suave',
        'Pratique alongamentos leves',
      ],
    },
    {
      id: '7',
      category: 'nutrition',
      title: 'Alimente-se com Consciência',
      description: 'Comer devagar e prestar atenção melhora digestão e satisfação',
      icon: 'restaurant-menu',
      color: '#E8F5E9',
      tips: [
        'Mastigue bem cada garfada',
        'Coma sem distrações (TV, celular)',
        'Preste atenção aos sabores',
        'Pare quando estiver 80% satisfeito',
      ],
    },
    {
      id: '8',
      category: 'exercise',
      title: 'Faça Pausas Ativas',
      description: 'Pequenas pausas com movimento previnem fadiga e melhoram foco',
      icon: 'directions-walk',
      color: '#FFF9C4',
      tips: [
        'Levante-se a cada hora',
        'Faça alongamentos simples',
        'Caminhe por 5 minutos',
        'Movimente pescoço e ombros',
      ],
    },
  ];

  const filteredTips = selectedCategory === 'all' 
    ? wellnessTips 
    : wellnessTips.filter(tip => tip.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dicas de Bem-Estar</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.heroIconContainer}>
            <Icon name="tips-and-updates" size={48} color="#4ECDC4" />
          </View>
          <Text style={styles.heroTitle}>Práticas Saudáveis</Text>
          <Text style={styles.heroDescription}>
            Pequenas mudanças no dia a dia podem ter grande impacto no seu bem-estar
          </Text>
        </View>

        <View style={styles.categoriesSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
                activeOpacity={0.7}
              >
                <Icon 
                  name={category.icon} 
                  size={18} 
                  color={selectedCategory === category.id ? '#fff' : '#4ECDC4'} 
                />
                <Text 
                  style={[
                    styles.categoryChipText,
                    selectedCategory === category.id && styles.categoryChipTextActive,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          {filteredTips.map((tip) => (
            <View key={tip.id} style={[styles.tipCard, { backgroundColor: tip.color }]}>
              <View style={styles.tipHeader}>
                <View style={styles.tipIconContainer}>
                  <Icon name={tip.icon} size={28} color="#4ECDC4" />
                </View>
                <View style={styles.tipHeaderText}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipDescription}>{tip.description}</Text>
                </View>
              </View>

              <View style={styles.tipsList}>
                {tip.tips.map((item, index) => (
                  <View key={index} style={styles.tipListItem}>
                    <View style={styles.tipBullet}>
                      <Text style={styles.tipBulletText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.tipListText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.reminderCard}>
            <Icon name="favorite" size={32} color="#ff6b6b" />
            <Text style={styles.reminderTitle}>Lembre-se</Text>
            <Text style={styles.reminderText}>
              A jornada do bem-estar é única para cada pessoa. Experimente diferentes práticas 
              e descubra o que funciona melhor para você. Seja gentil consigo mesmo!
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
}