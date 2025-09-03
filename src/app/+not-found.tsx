import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  GestureResponderEvent,
} from 'react-native';
import { Link, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '@components/Button';

export default function NotFoundScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Oops! Página não encontrada' }} />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name="alert-circle-outline" 
            size={120} 
            color="#e74c3c" 
          />
        </View>
        
        <Text style={styles.title}>404</Text>
        <Text style={styles.subtitle}>Página não encontrada</Text>
        <Text style={styles.description}>
          A página que você está procurando não existe ou foi movida.
        </Text>
        
        <View style={styles.buttonContainer}>
          <Link href="/" asChild>
            <Button
              title="Voltar ao início"
              iconName="home"
              backgroundColor="#4ECDC4"
              textColor="#fff"
              style={styles.button}/>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 280,
  },
  button: {
    height: 56,
    borderRadius: 12,
  },
});