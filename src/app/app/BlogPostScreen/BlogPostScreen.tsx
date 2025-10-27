import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; 
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
const mockBlogPosts = [
    
    { 
        id: '1', 
        title: 'Como a Meditação Pode Transformar Sua Vida', 
        description: 'Descubra os benefícios científicos da meditação e como implementar essa prática transformadora em sua rotina diária.',
        author: 'Dr. Ana Silva',
        date: '15 de Junho, 2024',
        content: `A meditação é uma prática milenar que tem ganhado cada vez mais reconhecimento científico nos últimos anos. Estudos comprovam que apenas 10 minutos diários de meditação podem trazer benefícios significativos para nossa saúde mental e física.

## Os Benefícios Comprovados
    
Pesquisas realizadas em universidades renomadas mostram que a meditação regular pode:
    
• Reduzir significativamente os níveis de stress e ansiedade
• Melhorar a capacidade de concentração e foco
• Fortalecer o sistema imunológico
• Promover melhor qualidade do sono
• Aumentar a sensação de bem-estar geral
    
## Como Começar
    
Para iniciantes, recomendamos começar com sessões curtas de 5 a 10 minutos. Escolha um local tranquilo, sente-se confortavelmente e foque na sua respiração.
    
### Técnica Básica de Respiração
    
1. Inspire lentamente pelo nariz contando até 4
2. Segure a respiração por 4 segundos
3. Expire pela boca contando até 6
4. Repita o ciclo por 5-10 minutos
    
## Mantendo a Consistência
    
O segredo para obter os benefícios da meditação está na consistência. É melhor meditar 5 minutos todos os dias do que 30 minutos uma vez por semana.
    
Crie um horário fixo para sua prática, preferencialmente no mesmo local. Isso ajudará a formar um hábito duradouro que transformará positivamente sua vida.`,
        imageUrl: 'https://example.com/meditation-image.jpg',
        category: 'Bem-estar',
        readTime: '5 min'
    },

];


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

  const allPosts: any[] = mockBlogPosts; 

  const defaultPost: BlogPost = allPosts[0] || { 
    id: 'fallback-0',
    title: 'Post Padrão (Fallback)',
    description: 'Este é o conteúdo padrão.',
    author: 'System',
    date: 'Hoje',
    content: `Conteúdo de fallback.`,
    imageUrl: '',
    category: 'Erro',
    readTime: '1 min'
  };

  
  const currentPost = useMemo(() => {
    return (allPosts.find((p) => p.id === postId) as BlogPost) || defaultPost;
  }, [postId, allPosts]);


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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* BOTÃO DE VOLTAR COM A ROTA CORRETA */}
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