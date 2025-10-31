import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Banner: React.FC = () => (
  <View style={styles.welcomeBanner}>
    <View style={styles.bannerContent}>
      <Text style={styles.bannerTitle}>Bem-vindo ao nosso{'\n'}espaço de bem-estar</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  welcomeBanner: {
    backgroundColor: '#4ECDC4',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 24,
    minHeight: 120,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bannerContent: {
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 30,
    letterSpacing: 0.3,
  },
});