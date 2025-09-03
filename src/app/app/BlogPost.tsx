import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface BlogPostProps {
  post?: {
    id: string;
    title: string;
    description: string;
    author: string;
    date: string;
    content: string;
    imageUrl?: string;
    category?: string;
    readTime?: string;
  };
  onBack?: () => void;
}

const BlogPost: React.FC<BlogPostProps> = ({ post, onBack }) => {
  const defaultPost = {
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
  };

  const currentPost = post || defaultPost;

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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
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
        {/* Category and Read Time */}
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

        {/* Title */}
        <Text style={styles.title}>{currentPost.title}</Text>

        {/* Description */}
        <Text style={styles.description}>{currentPost.description}</Text>

        {/* Author and Date */}
        <View style={styles.authorContainer}>
          <View style={styles.authorAvatar}>
            <Icon name="person" size={20} color="#4ECDC4" />
          </View>
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{currentPost.author}</Text>
            <Text style={styles.publishDate}>{currentPost.date}</Text>
          </View>
        </View>

        {/* Featured Image */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Icon name="image" size={40} color="#4ECDC4" />
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {formatContent(currentPost.content)}
        </View>

        {/* Related Actions */}
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
    justifyContent: 'space-between',
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 12,
  },
  categoryTag: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  readTime: {
    fontSize: 12,
    color: '#666',
    fontWeight: '400',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    lineHeight: 36,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: '400',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  publishDate: {
    fontSize: 12,
    color: '#666',
    fontWeight: '400',
  },
  imageContainer: {
    marginBottom: 24,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    marginBottom: 32,
  },
  paragraph: {
    fontSize: 16,
    color: '#333',
    lineHeight: 26,
    marginBottom: 16,
    fontWeight: '400',
  },
  subheading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 24,
    marginBottom: 12,
  },
  subheading2: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#4ECDC4',
    fontWeight: '600',
    marginRight: 8,
    minWidth: 20,
  },
  bulletText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    flex: 1,
  },
  spacing: {
    height: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginBottom: 20,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default BlogPost;