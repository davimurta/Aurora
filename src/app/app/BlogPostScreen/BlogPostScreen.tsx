import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import { postsApi, Post } from '../../../services/postsApi';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  content: string;
  imageUrl?: string;
  category?: string;
  readTime?: string;
}

const BlogPostScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const postId = id as string;

  const [loading, setLoading] = useState(true);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Busca o post da API quando o componente montar
  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    if (!postId) {
      setError('ID do post não fornecido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await postsApi.getPostById(postId);

      if (response.success && response.post) {
        const post = response.post;

        // Converte o post da API para o formato BlogPost
        const formattedPost: BlogPost = {
          id: post.id,
          title: post.title,
          description: post.excerpt || post.content.substring(0, 200) + '...',
          author: post.authorName,
          date: new Date(post.createdAt).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          content: post.content,
          category: post.category || 'Geral',
          readTime: `${Math.ceil(post.content.length / 1000)} min`,
        };

        setCurrentPost(formattedPost);

        // Incrementa visualizações do post
        await postsApi.incrementViews(postId);
      } else {
        setError('Post não encontrado');
      }
    } catch (error: any) {
      console.error('Erro ao carregar post:', error);
      setError('Erro ao carregar o artigo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };


  const handleBack = () => {
    router.back(); 
  };


  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.startsWith('## ')) {
        return (
          <Text key={index} style={styles.subheading}>
            {paragraph.replace('## ', '')}
          </Text>
        );
      } else if (paragraph.startsWith('### ')) {
        return (
          <Text key={index} style={styles.subheading2}>
            {paragraph.replace('### ', '')}
          </Text>
        );
      } else if (paragraph.startsWith('• ')) {
        return (
          <View key={index} style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              {paragraph.replace('• ', '')}
            </Text>
          </View>
        );
      } else if (paragraph.match(/^\d+\./)) {
        return (
          <View key={index} style={styles.bulletPoint}>
            <Text style={styles.bullet}>
              {paragraph.match(/^\d+\./)?.[0]}
            </Text>
            <Text style={styles.bulletText}>
              {paragraph.replace(/^\d+\.\s/, '')}
            </Text>
          </View>
        );
      } else if (paragraph.trim() !== '') {
        return (
          <Text key={index} style={styles.paragraph}>
            {paragraph}
          </Text>
        );
      }
      return <View key={index} style={styles.spacing} />;
    });
  };

  // Estado de carregamento
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ECDC4" />
          <Text style={styles.loadingText}>Carregando artigo...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Estado de erro
  if (error || !currentPost) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={64} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Ops! Algo deu errado</Text>
          <Text style={styles.errorText}>{error || 'Não foi possível carregar o artigo'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadPost}>
            <Icon name="refresh" size={20} color="#fff" />
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="bookmark-border" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="share" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.metaContainer}>
          {currentPost.category && (
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{currentPost.category}</Text>
            </View>
          )}
          {currentPost.readTime && (
            <Text style={styles.readTime}>
              <Icon name="access-time" size={14} color="#666" /> {currentPost.readTime}
            </Text>
          )}
        </View>

        <Text style={styles.title}>{currentPost.title}</Text>

        <Text style={styles.description}>{currentPost.description}</Text>

        <View style={styles.authorContainer}>
          <View style={styles.authorAvatar}>
            <Icon name="person" size={20} color="#4ECDC4" />
          </View>
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{currentPost.author}</Text>
            <Text style={styles.publishDate}>{currentPost.date}</Text>
          </View>
        </View>

        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Icon name="image" size={40} color="#4ECDC4" />
          </View>
        </View>

        <View style={styles.contentContainer}>
          {formatContent(currentPost.content)}
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.likeButton}>
            <Icon name="favorite-border" size={20} color="#666" />
            <Text style={styles.actionText}>Curtir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentButton}>
            <Icon name="comment" size={20} color="#666" />
            <Text style={styles.actionText}>Comentar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default BlogPostScreen;