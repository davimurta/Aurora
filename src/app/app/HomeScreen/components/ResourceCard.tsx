import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';

interface DailyResource {
  id: string;
  title: string;
  icon: string;
  route: string;
}

interface ResourceCardProps {
  item: DailyResource;
  onPress?: () => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ item, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (item.route) {
      router.push(item.route as any);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Icon name={item.icon} size={32} color="#4ECDC4" />
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 140,
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
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
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
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    lineHeight: 18,
    textAlign: 'center',
  },
});

export const dailyResources: DailyResource[] = [
  {
    id: '1',
    title: 'Quem Somos',
    icon: 'info',
    route: '/app/AboutUsScreen/AboutUsScreen',
  },
  {
    id: '2',
    title: 'Como Usar',
    icon: 'school',
    route: '/app/TutorialScreen/TutorialScreen',
  },
  {
    id: '3',
    title: 'Dicas de Bem-Estar',
    icon: 'tips-and-updates',
    route: '/app/WellnessTipsScreen/WellnessTipsScreen',
  },
  {
    id: '4',
    title: 'Técnicas de Relaxamento',
    icon: 'spa',
    route: '/app/RelaxationScreen/RelaxationScreen',
  },
  {
    id: '5',
    title: 'Meditação Guiada',
    icon: 'self-improvement',
    route: '/app/MeditationScreen/MeditationScreen',
  },
];