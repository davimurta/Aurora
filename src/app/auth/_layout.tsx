import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthController } from '../../hooks/useAuthController';

/**
 * Layout para rotas de autenticação
 * Redireciona usuários já autenticados para o app
 */
export default function AuthLayout() {
  const { user, loading } = useAuthController();
  const router = useRouter();

  useEffect(() => {
    // Aguarda o carregamento inicial da autenticação
    if (loading) return;

    // Se já houver usuário autenticado, redireciona para o app
    if (user) {
      console.log('✅ [AuthLayout] Usuário já autenticado, redirecionando para HomeScreen');
      router.replace('/app/HomeScreen/HomeScreen');
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

  // Se já houver usuário, não renderiza nada (redirecionamento já foi iniciado)
  if (user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  // Renderiza as rotas de autenticação
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
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
