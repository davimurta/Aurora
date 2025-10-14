import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../styles';

interface CardItem {
  id: string;
  title?: string;
  description?: string;
}

interface ActivityCardProps {
  item: CardItem;
  onPress: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.cardVisualArea}>
      <Icon name="spa" size={48} color="#38B2AC" />
    </View>
    <View style={styles.cardContentArea}>
      <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.cardSubtitle} numberOfLines={3}>{item.description}</Text>
    </View>
  </TouchableOpacity>
);