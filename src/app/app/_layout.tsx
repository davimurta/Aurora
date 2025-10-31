import React, { useEffect } from 'react';
import { Stack, useRouter, Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthController } from '../../hooks/useAuthController';

/**
 * Layout protegido para todas as rotas do app
 * Verifica autenticação e bloqueia acesso se não autenticado
 */
export default function AppLayout() {
  const { user, loading } = useAuthController();

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  // Se não houver usuário, redireciona para SplashScreen (que leva ao login)
  if (!user) {
    console.log('🔒 [AppLayout] Bloqueando acesso - usuário não autenticado');
    return <Redirect href="/" />;
  }

  console.log('✅ [AppLayout] Acesso permitido - usuário:', user.uid);

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
