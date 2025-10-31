import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthController } from '../../hooks/useAuthController';

/**
 * Layout protegido para todas as rotas do app
 * Verifica autenticação e redireciona para login se necessário
 */
export default function AppLayout() {
  const { user, loading } = useAuthController();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Aguarda o carregamento inicial da autenticação
    if (loading) return;

    // Se não houver usuário autenticado, redireciona para login
    if (!user) {
      console.log('🔒 [AppLayout] Usuário não autenticado, redirecionando para login');
      router.replace('/auth/LoginScreen/LoginScreen');
    } else {
      console.log('✅ [AppLayout] Usuário autenticado:', user.uid);
    }
  }, [user, loading]);

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  // Se não houver usuário, não renderiza nada (redirecionamento já foi iniciado)
  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  // Renderiza as rotas protegidas
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
