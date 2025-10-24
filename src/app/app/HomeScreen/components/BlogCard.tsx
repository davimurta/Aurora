import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface BlogPost {
  id: string;
  title?: string;
  description?: string;
  author?: string;
  date?: string;
  readTime?: string;
  category?: string;
}

interface BlogCardProps {
  item: BlogPost;
  onPress: () => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.blogCard} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.blogCardVisualArea}>
      <Icon name="article" size={40} color="#4ECDC4" />
    </View>
    <View style={styles.blogCardContentArea}>
      <View style={styles.blogMeta}>
        {item.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.category}</Text>
          </View>
        )}
        {item.readTime && (
          <View style={styles.readTimeContainer}>
            <Icon name="access-time" size={12} color="#666" />
            <Text style={styles.readTimeText}> {item.readTime}</Text>
          </View>
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
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  blogCard: {
    width: 280,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  blogCardVisualArea: {
    height: 140,
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  blogCardContentArea: {
    padding: 16,
  },
  blogMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  readTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTimeText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: 22,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  blogDescription: {
    fontSize: 13,
    color: '#666',
    fontWeight: '400',
    lineHeight: 18,
    marginBottom: 12,
  },
  blogAuthorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  blogAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4ECDC4',
  },
  blogDate: {
    fontSize: 12,
    color: '#999',
    fontWeight: '400',
  },
});