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

const MainScreen: React.FC = () => {
  // Mock data
  const professionals = [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
  ];

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

  const renderProfessional = (item: CardItem) => (
    <TouchableOpacity key={item.id} style={styles.professionalCard}>
      <View style={styles.avatar}>
        <Icon name="person" size={30} color="#999" />
      </View>
    </TouchableOpacity>
  );

  const renderCard = (item: CardItem) => (
    <TouchableOpacity key={item.id} style={styles.card}>
      <View style={styles.cardContent} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder=""
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Conectar com um profissional */}
        <Section
          title="Conectar com um profissional"
          data={professionals}
          renderItem={renderProfessional}
        />

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

        {/* Técnicas de Medit */}
        <Section
          title="Técnicas de Medit"
          data={meditationTechniques}
          renderItem={renderCard}
        />

        {/* Nosso Blog */}
        <Section
          title="Nosso Blog"
          data={blogPosts}
          renderItem={renderCard}
        />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchContainer: {
    paddingVertical: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  scrollContainer: {
    paddingHorizontal: 4,
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
  card: {
    marginRight: 16,
  },
  cardContent: {
    width: 120,
    height: 80,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
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

export default MainScreen;
