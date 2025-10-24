import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface DailyResource {
  id: string;
  title: string;
  icon: string;
  color: string;
}

interface ResourceCardProps {
  item: DailyResource;
  onPress: () => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ item, onPress }) => (
  <TouchableOpacity 
    style={styles.cardFrame}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.cardContent}>
      <View style={styles.iconCircle}>
        <Icon 
          name={item.icon} 
          size={32} 
          color="#4ECDC4" 
        />
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  cardFrame: {
    marginRight: 12,
    minHeight: 140,
    minWidth: 170,
    backgroundColor: '#fff',
    borderRadius: 16, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    padding: 16,
    justifyContent: 'center',
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0FFFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0F7F6',
  },
  cardTitle: {
    fontSize: 15, 
    fontWeight: '700', 
    color: '#333', 
    lineHeight: 20,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});