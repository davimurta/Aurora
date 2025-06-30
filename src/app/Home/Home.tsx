import BottomNavigation from '@/src/components/BottonNavigation';
import React, { JSX } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CardItem {
  id: string;
  title?: string;
  image?: string;
}

interface SectionProps {
  title: string;
  data: CardItem[];
  renderItem: (item: CardItem) => JSX.Element;
}

const Section: React.FC<SectionProps> = ({ title, data, renderItem }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {data.map((item) => renderItem(item))}
    </ScrollView>
  </View>
);

const Home: React.FC = () => {
  const activities = [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
  ];

  const recommendations = [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
  ];

  const meditationTechniques = [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
  ];

  const blogPosts = [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
  ];

  const renderCard = (item: CardItem) => (
    <TouchableOpacity key={item.id} style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.cardImagePlaceholder}>
          <Icon name="spa" size={24} color="#4ECDC4" />
        </View>
        <View style={styles.cardTextArea}>
          <Text style={styles.cardTitle}>Atividade {item.id}</Text>
          <Text style={styles.cardSubtitle}>Descrição breve</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="search" size={22} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar atividades, técnicas..."
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Suas atividades */}
        <Section
          title="Suas atividades"
          data={activities}
          renderItem={renderCard}
        />

        {/* Recomendações */}
        <Section
          title="Recomendações"
          data={recommendations}
          renderItem={renderCard}
        />

        {/* Técnicas de Meditação */}
        <Section
          title="Técnicas de Meditação"
          data={meditationTechniques}
          renderItem={renderCard}
        />

        {/* Nosso Blog */}
        <Section
          title="Nosso Blog"
          data={blogPosts}
          renderItem={renderCard}
        />

        {/* Espaçamento extra para o bottom navigation */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerContainer: {
    paddingVertical: 20,
    paddingTop: 10,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  subGreetingText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
  },
  searchContainer: {
    paddingVertical: 16,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  scrollContainer: {
    paddingHorizontal: 4,
  },
  card: {
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardContent: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardImagePlaceholder: {
    width: '100%',
    height: 80,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  cardTextArea: {
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '400',
  },
  bottomSpacing: {
    height: 20,
  },
  professionalCard: {
    marginRight: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#4ECDC4',
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemCenter: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
});

export default Home;