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
import { styles } from './styles';

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

const BlogPageScreen: React.FC<BlogPageProps> = ({ onNavigateToPost, onBack }) => {
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nosso Blog</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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

        <View style={styles.categoriesContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScrollContainer}
          >
            {categories.map(renderCategoryButton)}
          </ScrollView>
        </View>

        {searchQuery === '' && selectedCategory === 'Todos' && (
          <View style={styles.featuredSection}>
            <Text style={styles.sectionTitle}>Em Destaque</Text>
            {renderFeaturedPost()}
          </View>
        )}

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

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default BlogPageScreen;