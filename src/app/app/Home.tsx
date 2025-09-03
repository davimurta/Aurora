import BottomNavigation from '@components/BottonNavigation';
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
import { useRouter } from 'expo-router';

interface CardItem {
  id: string;
  title?: string;
  image?: string;
  description?: string;
  author?: string;
  date?: string;
  readTime?: string;
  category?: string;
}

interface BlogPost extends CardItem {
  content?: string;
}

interface SectionProps {
  title: string;
  data: CardItem[];
  renderItem: (item: CardItem) => JSX.Element;
}

interface HomeProps {
  onNavigateToBlogPost?: (postId: string) => void;
  onNavigateToActivity?: (activityId: string) => void;
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

const Home: React.FC<HomeProps> = ({ 
  onNavigateToBlogPost, 
  onNavigateToActivity 
}) => {
  const router = useRouter();

  const activities = [
    { 
      id: '1', 
      title: 'Respiração Guiada',
      description: 'Exercício de 10 minutos' 
    },
    { 
      id: '2', 
      title: 'Meditação Matinal',
      description: 'Comece o dia com calma' 
    },
    { 
      id: '3', 
      title: 'Relaxamento',
      description: 'Técnicas para desestressar' 
    },
    { 
      id: '4', 
      title: 'Mindfulness',
      description: 'Atenção plena no presente' 
    },
  ];

  const recommendations = [
    { 
      id: '1', 
      title: 'Yoga Básico',
      description: 'Para iniciantes' 
    },
    { 
      id: '2', 
      title: 'Caminhada Consciente',
      description: 'Conecte-se com a natureza' 
    },
    { 
      id: '3', 
      title: 'Journaling',
      description: 'Reflexão diária' 
    },
    { 
      id: '4', 
      title: 'Gratidão',
      description: 'Exercício de reconhecimento' 
    },
  ];

  const meditationTechniques = [
    { 
      id: '1', 
      title: 'Concentração',
      description: 'Foque na respiração' 
    },
    { 
      id: '2', 
      title: 'Body Scan',
      description: 'Consciência corporal' 
    },
    { 
      id: '3', 
      title: 'Loving Kindness',
      description: 'Cultive a compaixão' 
    },
    { 
      id: '4', 
      title: 'Observação',
      description: 'Observe sem julgar' 
    },
  ];

  const blogPosts: BlogPost[] = [
    { 
      id: '1',
      title: 'Como a Meditação Transforma Sua Vida',
      description: 'Benefícios científicos da prática diária',
      author: 'Dr. Ana Silva',
      date: '15 Jun 2024',
      readTime: '5 min',
      category: 'Bem-estar'
    },
    { 
      id: '2',
      title: 'Técnicas de Respiração para Ansiedade',
      description: 'Métodos simples para acalmar a mente',
      author: 'Prof. Carlos Lima',
      date: '12 Jun 2024',
      readTime: '7 min',
      category: 'Técnicas'
    },
    { 
      id: '3',
      title: 'Mindfulness no Trabalho',
      description: 'Como manter o foco durante o dia',
      author: 'Dra. Maria Santos',
      date: '10 Jun 2024',
      readTime: '4 min',
      category: 'Produtividade'
    },
    { 
      id: '4',
      title: 'Os Benefícios do Yoga para Iniciantes',
      description: 'Guia completo para começar a praticar',
      author: 'Instrutor João Pedro',
      date: '8 Jun 2024',
      readTime: '6 min',
      category: 'Yoga'
    },
  ];

  const renderCard = (item: CardItem) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.card}
      onPress={() => onNavigateToActivity?.(item.id)}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardImagePlaceholder}>
          <Icon name="spa" size={24} color="#4ECDC4" />
        </View>
        <View style={styles.cardTextArea}>
          <Text style={styles.cardTitle}>{item.title || `Atividade ${item.id}`}</Text>
          <Text style={styles.cardSubtitle}>{item.description || 'Descrição breve'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderBlogCard = (item: BlogPost) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.blogCard}
      onPress={() => handleBlogNavigation(item.id)}
    >
      <View style={styles.blogCardContent}>
        <View style={styles.blogImagePlaceholder}>
          <Icon name="article" size={28} color="#4ECDC4" />
        </View>
        <View style={styles.blogTextArea}>
          <View style={styles.blogMeta}>
            {item.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{item.category}</Text>
              </View>
            )}
            {item.readTime && (
              <Text style={styles.readTimeText}>
                <Icon name="access-time" size={12} color="#666" /> {item.readTime}
              </Text>
            )}
          </View>
          <Text style={styles.blogTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.blogDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.blogAuthorInfo}>
            <Text style={styles.blogAuthor}>{item.author}</Text>
            <Text style={styles.blogDate}> • {item.date}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleBlogNavigation = (postId: string) => {
    if (onNavigateToBlogPost) {
      onNavigateToBlogPost(postId);
    } else {
      router.push(`/app/BlogPost?id=${postId}`);
    }
  };

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

        {/* Nosso Blog - Seção Especial */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nosso Blog</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            {blogPosts.map((item) => renderBlogCard(item))}
          </ScrollView>
        </View>

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
    height: 140,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardImagePlaceholder: {
    width: '100%',
    height: 60,
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
    flex: 1,
    justifyContent: 'space-between',
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
  blogCard: {
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  blogCardContent: {
    width: 280,
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  blogImagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  blogTextArea: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'space-between',
  },
  blogMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  readTimeText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '400',
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
    lineHeight: 22,
  },
  blogDescription: {
    fontSize: 13,
    color: '#666',
    fontWeight: '400',
    marginBottom: 10,
    lineHeight: 18,
  },
  blogAuthorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blogAuthor: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4ECDC4',
  },
  blogDate: {
    fontSize: 12,
    color: '#999',
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