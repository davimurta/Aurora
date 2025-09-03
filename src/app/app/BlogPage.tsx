import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  content?: string;
  featured?: boolean;
}

interface BlogPageProps {
  onNavigateToPost?: (postId: string) => void;
  onBack?: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; 

const BlogPage: React.FC<BlogPageProps> = ({ onNavigateToPost, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Como a Meditação Pode Transformar Sua Vida',
      description: 'Descubra os benefícios científicos da meditação e como implementar essa prática transformadora em sua rotina diária.',
      author: 'Dr. Ana Silva',
      date: '15 Jun 2024',
      readTime: '5 min',
      category: 'Bem-estar',
      featured: true,
    },
    {
      id: '2',
      title: 'Técnicas de Respiração para Ansiedade',
      description: 'Métodos simples e eficazes para acalmar a mente em momentos de estresse.',
      author: 'Prof. Carlos Lima',
      date: '12 Jun 2024',
      readTime: '7 min',
      category: 'Técnicas',
    },
    {
      id: '3',
      title: 'Mindfulness no Trabalho',
      description: 'Como manter o foco e a produtividade através da atenção plena.',
      author: 'Dra. Maria Santos',
      date: '10 Jun 2024',
      readTime: '4 min',
      category: 'Produtividade',
    },
    {
      id: '4',
      title: 'Os Benefícios do Yoga para Iniciantes',
      description: 'Guia completo para começar a praticar yoga com segurança.',
      author: 'Instrutor João Pedro',
      date: '8 Jun 2024',
      readTime: '6 min',
      category: 'Yoga',
    },
    {
      id: '5',
      title: 'Nutrição Consciente: Alimentação e Bem-estar',
      description: 'Como a alimentação mindful pode melhorar sua saúde física e mental.',
      author: 'Nutri. Paula Ferreira',
      date: '5 Jun 2024',
      readTime: '8 min',
      category: 'Bem-estar',
    },
    {
      id: '6',
      title: 'Exercícios de Relaxamento Muscular',
      description: 'Técnicas progressivas para aliviar tensões do corpo.',
      author: 'Fisio. Roberto Santos',
      date: '3 Jun 2024',
      readTime: '6 min',
      category: 'Técnicas',
    },
    {
      id: '7',
      title: 'Criando um Espaço Sagrado em Casa',
      description: 'Dicas para organizar seu ambiente pessoal para meditação.',
      author: 'Designer Ana Costa',
      date: '1 Jun 2024',
      readTime: '4 min',
      category: 'Lifestyle',
    },
    {
      id: '8',
      title: 'Meditação para Crianças: Guia Prático',
      description: 'Como introduzir práticas de mindfulness na rotina infantil.',
      author: 'Psico. Infantil Carla Dias',
      date: '28 Mai 2024',
      readTime: '7 min',
      category: 'Família',
    },
  ];

  const categories = ['Todos', 'Bem-estar', 'Técnicas', 'Produtividade', 'Yoga', 'Lifestyle', 'Família'];

  
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  
  const featuredPost = blogPosts.find(post => post.featured) || blogPosts[0];
  const regularPosts = filteredPosts.filter(post => post.id !== featuredPost.id);

  const renderCategoryButton = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        selectedCategory === category && styles.categoryButtonActive
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === category && styles.categoryButtonTextActive
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  const renderFeaturedPost = () => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => onNavigateToPost?.(featuredPost.id)}
    >
      <View style={styles.featuredImagePlaceholder}>
        <Icon name="auto-awesome" size={32} color="#4ECDC4" />
      </View>
      <View style={styles.featuredContent}>
        <View style={styles.featuredMeta}>
          <View style={styles.featuredBadge}>
            <Icon name="star" size={12} color="#fff" />
            <Text style={styles.featuredBadgeText}>Destaque</Text>
          </View>
          <Text style={styles.featuredReadTime}>
            <Icon name="access-time" size={12} color="#666" /> {featuredPost.readTime}
          </Text>
        </View>
        <Text style={styles.featuredTitle} numberOfLines={2}>
          {featuredPost.title}
        </Text>
        <Text style={styles.featuredDescription} numberOfLines={2}>
          {featuredPost.description}
        </Text>
        <View style={styles.featuredAuthorInfo}>
          <Text style={styles.featuredAuthor}>{featuredPost.author}</Text>
          <Text style={styles.featuredDate}> • {featuredPost.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPostCard = ({ item }: { item: BlogPost }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => onNavigateToPost?.(item.id)}
    >
      <View style={styles.postImagePlaceholder}>
        <Icon name="article" size={24} color="#4ECDC4" />
      </View>
      <View style={styles.postContent}>
        <View style={styles.postMeta}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryTagText}>{item.category}</Text>
          </View>
          <Text style={styles.postReadTime}>{item.readTime}</Text>
        </View>
        <Text style={styles.postTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.postDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.postAuthorInfo}>
          <Text style={styles.postAuthor} numberOfLines={1}>
            {item.author}
          </Text>
          <Text style={styles.postDate}>{item.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nosso Blog</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar artigos..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="clear" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScrollContainer}
          >
            {categories.map(renderCategoryButton)}
          </ScrollView>
        </View>

        {/* Featured Post (apenas se não houver filtros) */}
        {searchQuery === '' && selectedCategory === 'Todos' && (
          <View style={styles.featuredSection}>
            <Text style={styles.sectionTitle}>Em Destaque</Text>
            {renderFeaturedPost()}
          </View>
        )}

        {/* Posts Grid */}
        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>
            {searchQuery || selectedCategory !== 'Todos' 
              ? `Resultados (${filteredPosts.length})`
              : 'Todos os Artigos'
            }
          </Text>
          
          {filteredPosts.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="search-off" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>
                Nenhum artigo encontrado
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Tente ajustar sua busca ou filtros
              </Text>
            </View>
          ) : (
            <FlatList
              data={regularPosts}
              renderItem={renderPostCard}
              keyExtractor={(item) => item.id}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.postsGrid}
            />
          )}
        </View>

        {/* Espaçamento final */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginRight: 40, 
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchContainer: {
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
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
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesScrollContainer: {
    paddingRight: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  featuredSection: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  featuredCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  featuredImagePlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featuredContent: {
    flex: 1,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  featuredReadTime: {
    fontSize: 12,
    color: '#666',
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    lineHeight: 26,
  },
  featuredDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  featuredAuthorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4ECDC4',
  },
  featuredDate: {
    fontSize: 14,
    color: '#999',
  },
  postsSection: {
    marginBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  postsGrid: {
    paddingBottom: 20,
  },
  postCard: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  postImagePlaceholder: {
    width: '100%',
    height: 80,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  postContent: {
    flex: 1,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryTag: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  postReadTime: {
    fontSize: 10,
    color: '#666',
  },
  postTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
    lineHeight: 18,
  },
  postDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 8,
  },
  postAuthorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postAuthor: {
    fontSize: 11,
    fontWeight: '500',
    color: '#4ECDC4',
    flex: 1,
  },
  postDate: {
    fontSize: 10,
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default BlogPage;