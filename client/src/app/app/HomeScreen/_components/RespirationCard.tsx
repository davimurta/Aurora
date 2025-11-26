import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface RespirationActivity {
  id: string;
  title: string;
  icon: string;
  bgColor: string; 
}

interface RespirationCardProps {
  item: RespirationActivity;
  onPress?: () => void;
}

export const RespirationCard: React.FC<RespirationCardProps> = ({ item, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('./BreathingActivityScreen');
    }
  };

  return (
    <TouchableOpacity 
      style={styles.cardFrame} 
      onPress={handlePress} 
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons
          name={item.icon as any}
          size={32} 
          color="#4ECDC4"
        />
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardFrame: {
    width: 145,     
    height: 145,
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
    alignItems: 'center', 
    justifyContent: 'space-between', 
  },
  iconContainer: {
    width: 64, 
    height: 64,
    borderRadius: 32, 
    backgroundColor: '#F0FFFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0F7F6',
  },
  cardTitle: {
    fontSize: 15, 
    fontWeight: '700', 
    color: '#333', 
    lineHeight: 20, 
    textAlign: 'center',
    marginTop: 'auto',
    letterSpacing: 0.2,
  },
});

export default RespirationCard;