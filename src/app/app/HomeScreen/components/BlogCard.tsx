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
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.imageArea}>
      <Icon name="article" size={40} color="#4ECDC4" />
    </View>
    <View style={styles.contentArea}>
      <View style={styles.metaRow}>
        {item.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        )}
        {item.readTime && (
          <View style={styles.readTimeContainer}>
            <Icon name="access-time" size={12} color="#666" />
            <Text style={styles.readTimeText}> {item.readTime}</Text>
          </View>
        )}
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.authorRow}>
        <Text style={styles.author}>{item.author}</Text>
        <Text style={styles.date}> • {item.date}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
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
    overflow: 'hidden',
  },
  imageArea: {
    height: 140,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  contentArea: {
    padding: 16,
  },
  metaRow: {
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
  categoryText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
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
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: 22,
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  author: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4ECDC4',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});