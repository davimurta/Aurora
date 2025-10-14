import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../styles';

interface BlogPost {
  id: string;
  title?: string;
  author?: string;
  date?: string;
  category?: string;
}

interface BlogCardProps {
  item: BlogPost;
  onPress: () => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.blogCard} onPress={onPress}>
    <View style={styles.blogCardVisualArea}>
      <Icon name="article" size={56} color="#4299E1" />
    </View>
    <View style={styles.blogCardContentArea}>
      <View>
        {item.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.category.toUpperCase()}</Text>
          </View>
        )}
        <Text style={styles.blogTitle} numberOfLines={3}>{item.title}</Text>
      </View>
      <View style={styles.blogAuthorInfo}>
        <Text style={styles.blogAuthor}>{item.author}</Text>
        <Text style={styles.blogDate}> • {item.date}</Text>
      </View>
    </View>
  </TouchableOpacity>
);