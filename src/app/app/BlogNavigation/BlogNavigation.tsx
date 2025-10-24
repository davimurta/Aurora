import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomNavigation from '../../../components/BottonNavigation';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  featured?: boolean;
}

interface BlogNavigationProps {
  onNavigateToPost?: (postId: string) => void;
  onNavigateToAllPosts?: () => void;
}

const BlogNavigation: React.FC<BlogNavigationProps> = ({ 
  onNavigateToPost, 
  onNavigateToAllPosts 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { width } = useWindowDimensions();

  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  const horizontalPadding = isSmallScreen ? 16 : isMediumScreen ? 20 : 24;
  
  const horizontalCardWidth = isSmallScreen ? width * 0.75 : isMediumScreen ? 280 : 320;
  
  const numColumns = isSmallScreen ? 1 : isMediumScreen ? 2 : 3;
  const gridGap = 16;
  const totalGaps = (numColumns - 1) * gridGap;
  const gridCardWidth = (width - (horizontalPadding * 2) - totalGaps) / numColumns;

  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Como a Meditação Pode Transformar Sua Vida',
      description: 'Descubra os benefícios científicos da meditação',
      author: 'Dr. Ana Silva',
      date: '15 Jun 2024',
      readTime: '5 min',
      category: 'Bem-estar',
      featured: true,
    },
    {
      id: '2',
      title: 'Técnicas de Respiração para Ansiedade',
      description: 'Métodos simples e eficazes para acalmar a mente',
      author: 'Prof. Carlos Lima',
      date: '12 Jun 2024',
      readTime: '7 min',
      category: 'Técnicas',
    },
    {
      id: '3',
      title: 'Mindfulness no Trabalho',
      description: 'Como manter o foco e a produtividade',
      author: 'Dra. Maria Santos',
      date: '10 Jun 2024',
      readTime: '4 min',
      category: 'Produtividade',
    },
    {
      id: '4',
      title: 'Os Benefícios do Yoga para Iniciantes',
      description: 'Guia completo para começar a praticar yoga',
      author: 'Instrutor João Pedro',
      date: '8 Jun 2024',
      readTime: '6 min',
      category: 'Yoga',
    },
  ];

  const allPosts = blogPosts;
  const latestPosts = blogPosts.slice(0, 3);
  const forYouPosts = blogPosts.slice(0, 4);

  const renderHorizontalCard = (post: BlogPost) => (
    <TouchableOpacity
      key={post.id}
      style={{
        width: horizontalCardWidth,
        backgroundColor: '#fff',
        borderRadius: isSmallScreen ? 12 : 16,
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
      onPress={() => onNavigateToPost?.(post.id)}
    >
      <View style={{
        height: isSmallScreen ? 120 : 140,
        backgroundColor: '#E8F8F7',
        borderTopLeftRadius: isSmallScreen ? 12 : 16,
        borderTopRightRadius: isSmallScreen ? 12 : 16,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Icon name="article" size={isSmallScreen ? 32 : 40} color="#4ECDC4" />
      </View>
      <View style={{ padding: isSmallScreen ? 12 : 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <View style={{
            backgroundColor: '#E8F8F7',
            paddingHorizontal: isSmallScreen ? 8 : 10,
            paddingVertical: 4,
            borderRadius: 12,
          }}>
            <Text style={{ color: '#4ECDC4', fontSize: isSmallScreen ? 10 : 11, fontWeight: '600' }}>
              {post.category}
            </Text>
          </View>
          <Text style={{ color: '#999', fontSize: isSmallScreen ? 11 : 12 }}>
            {post.readTime}
          </Text>
        </View>
        <Text style={{
          fontSize: isSmallScreen ? 14 : 16,
          fontWeight: '700',
          color: '#333',
          marginBottom: 6,
        }} numberOfLines={2}>
          {post.title}
        </Text>
        <Text style={{
          fontSize: isSmallScreen ? 12 : 13,
          color: '#666',
          marginBottom: 12,
        }} numberOfLines={2}>
          {post.description}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: isSmallScreen ? 11 : 12, color: '#999', flex: 1 }} numberOfLines={1}>
            {post.author}
          </Text>
          <Text style={{ fontSize: isSmallScreen ? 10 : 11, color: '#999', marginLeft: 8 }}>
            {post.date}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderGridCard = (post: BlogPost, index: number) => {
    const isLastInRow = (index + 1) % numColumns === 0;
    
    return (
      <TouchableOpacity
        key={post.id}
        style={{
          width: gridCardWidth,
          backgroundColor: '#fff',
          borderRadius: isSmallScreen ? 12 : 16,
          marginBottom: 16,
          marginRight: isLastInRow ? 0 : gridGap,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
        onPress={() => onNavigateToPost?.(post.id)}
      >
        <View style={{
          height: isSmallScreen ? 100 : isMediumScreen ? 120 : 140,
          backgroundColor: '#E8F8F7',
          borderTopLeftRadius: isSmallScreen ? 12 : 16,
          borderTopRightRadius: isSmallScreen ? 12 : 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Icon name="article" size={isSmallScreen ? 28 : 32} color="#4ECDC4" />
        </View>
        <View style={{ padding: isSmallScreen ? 10 : 12 }}>
          <View style={{
            backgroundColor: '#E8F8F7',
            paddingHorizontal: isSmallScreen ? 6 : 8,
            paddingVertical: 3,
            borderRadius: 10,
            alignSelf: 'flex-start',
            marginBottom: 8,
          }}>
            <Text style={{ color: '#4ECDC4', fontSize: isSmallScreen ? 9 : 10, fontWeight: '600' }}>
              {post.category}
            </Text>
          </View>
          <Text style={{
            fontSize: isSmallScreen ? 13 : 14,
            fontWeight: '700',
            color: '#333',
            marginBottom: 6,
          }} numberOfLines={2}>
            {post.title}
          </Text>
          <Text style={{
            fontSize: isSmallScreen ? 10 : 11,
            color: '#999',
            marginBottom: 8,
          }} numberOfLines={1}>
            {post.author}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: isSmallScreen ? 9 : 10, color: '#999' }}>
              {post.date}
            </Text>
            <Text style={{ fontSize: isSmallScreen ? 9 : 10, color: '#999' }}>
              {post.readTime}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFeaturedCard = (post: BlogPost) => (
    <TouchableOpacity
      key={post.id}
      style={{
        backgroundColor: '#fff',
        borderRadius: isSmallScreen ? 16 : 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        overflow: 'hidden',
      }}
      onPress={() => onNavigateToPost?.(post.id)}
    >
      <View style={{
        height: isSmallScreen ? 160 : isMediumScreen ? 200 : 240,
        backgroundColor: '#4ECDC4',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Icon name="auto-awesome" size={isSmallScreen ? 48 : 60} color="#fff" />
      </View>
      <View style={{ padding: isSmallScreen ? 16 : 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <View style={{
            backgroundColor: '#FFD93D',
            paddingHorizontal: isSmallScreen ? 10 : 12,
            paddingVertical: isSmallScreen ? 5 : 6,
            borderRadius: 16,
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 12,
          }}>
            <Icon name="star" size={isSmallScreen ? 12 : 14} color="#fff" />
            <Text style={{ 
              color: '#fff', 
              fontSize: isSmallScreen ? 11 : 12, 
              fontWeight: '700', 
              marginLeft: 4 
            }}>
              Destaque
            </Text>
          </View>
          <Text style={{ color: '#999', fontSize: isSmallScreen ? 12 : 13 }}>
            <Icon name="access-time" size={isSmallScreen ? 12 : 13} color="#999" /> {post.readTime}
          </Text>
        </View>
        <Text style={{
          fontSize: isSmallScreen ? 18 : 20,
          fontWeight: '700',
          color: '#333',
          marginBottom: 8,
        }}>
          {post.title}
        </Text>
        <Text style={{
          fontSize: isSmallScreen ? 14 : 15,
          color: '#666',
          marginBottom: 16,
          lineHeight: isSmallScreen ? 20 : 22,
        }}>
          {post.description}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: isSmallScreen ? 13 : 14, color: '#333', fontWeight: '600' }}>
            {post.author}
          </Text>
          <Text style={{ fontSize: isSmallScreen ? 12 : 13, color: '#999' }}>
            {post.date}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const filteredPosts = allPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FFFE' }}>
      {/* Header */}
      <View style={{
        paddingHorizontal: horizontalPadding,
        paddingVertical: isSmallScreen ? 12 : 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
      }}>
        <Text style={{
          fontSize: isSmallScreen ? 24 : 28,
          fontWeight: '700',
          color: '#333',
          marginBottom: isSmallScreen ? 12 : 16,
        }}>
          Nosso Blog
        </Text>
        
        {/* Search Bar */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F8FFFE',
          borderRadius: isSmallScreen ? 12 : 16,
          paddingHorizontal: isSmallScreen ? 12 : 16,
          height: isSmallScreen ? 44 : 50,
          borderWidth: 1,
          borderColor: '#E8F8F7',
        }}>
          <Icon name="search" size={isSmallScreen ? 20 : 22} color="#4ECDC4" />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: isSmallScreen ? 14 : 15,
              color: '#333',
            }}
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

      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {searchQuery === '' ? (
          <>
            {/* Featured Section */}
            <View style={{ paddingTop: isSmallScreen ? 16 : 24, paddingHorizontal: horizontalPadding }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}>
                <View>
                  <Text style={{
                    fontSize: isSmallScreen ? 18 : 22,
                    fontWeight: '700',
                    color: '#333',
                  }}>
                    Em Destaque
                  </Text>
                  <Text style={{
                    fontSize: isSmallScreen ? 13 : 14,
                    color: '#666',
                    marginTop: 4,
                  }}>
                    O melhor conteúdo para você
                  </Text>
                </View>
              </View>
              {renderFeaturedCard(allPosts[0])}
            </View>

            {/* Latest Posts Section */}
            <View style={{ paddingTop: 8 }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: horizontalPadding,
                marginBottom: 16,
              }}>
                <View>
                  <Text style={{
                    fontSize: isSmallScreen ? 18 : 22,
                    fontWeight: '700',
                    color: '#333',
                  }}>
                    Últimos Blogs
                  </Text>
                  <Text style={{
                    fontSize: isSmallScreen ? 13 : 14,
                    color: '#666',
                    marginTop: 4,
                  }}>
                    Publicações recentes
                  </Text>
                </View>
                <TouchableOpacity onPress={onNavigateToAllPosts}>
                  <Text style={{
                    fontSize: isSmallScreen ? 13 : 14,
                    color: '#4ECDC4',
                    fontWeight: '600',
                  }}>
                    Ver todos
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: horizontalPadding }}
              >
                {latestPosts.map(renderHorizontalCard)}
              </ScrollView>
            </View>

            {/* For You Section */}
            <View style={{ 
              paddingTop: isSmallScreen ? 24 : 32, 
              paddingHorizontal: horizontalPadding, 
              paddingBottom: 24 
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}>
                <View>
                  <Text style={{
                    fontSize: isSmallScreen ? 18 : 22,
                    fontWeight: '700',
                    color: '#333',
                  }}>
                    Para Você
                  </Text>
                  <Text style={{
                    fontSize: isSmallScreen ? 13 : 14,
                    color: '#666',
                    marginTop: 4,
                  }}>
                    Recomendados especialmente
                  </Text>
                </View>
                <TouchableOpacity onPress={onNavigateToAllPosts}>
                  <Text style={{
                    fontSize: isSmallScreen ? 13 : 14,
                    color: '#4ECDC4',
                    fontWeight: '600',
                  }}>
                    Ver todos
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
                {forYouPosts.map((post, index) => renderGridCard(post, index))}
              </View>
            </View>
          </>
        ) : (
          // Search Results
          <View style={{ 
            paddingTop: isSmallScreen ? 16 : 24, 
            paddingHorizontal: horizontalPadding, 
            paddingBottom: 24 
          }}>
            <Text style={{
              fontSize: isSmallScreen ? 18 : 22,
              fontWeight: '700',
              color: '#333',
              marginBottom: 16,
            }}>
              Resultados da Busca ({filteredPosts.length})
            </Text>
            {filteredPosts.length === 0 ? (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 60,
              }}>
                <Icon name="search-off" size={isSmallScreen ? 56 : 64} color="#ccc" />
                <Text style={{
                  fontSize: isSmallScreen ? 16 : 18,
                  fontWeight: '600',
                  color: '#999',
                  marginTop: 16,
                }}>
                  Nenhum artigo encontrado
                </Text>
                <Text style={{
                  fontSize: isSmallScreen ? 13 : 14,
                  color: '#999',
                  marginTop: 8,
                  textAlign: 'center',
                }}>
                  Tente buscar com outras palavras
                </Text>
              </View>
            ) : (
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
                {filteredPosts.map((post, index) => renderGridCard(post, index))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

export default BlogNavigation;